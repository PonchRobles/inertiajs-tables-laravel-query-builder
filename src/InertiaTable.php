<?php

namespace PonchRobles\InertiaTable;

use Illuminate\Http\Request;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;
use Inertia\Response;
use PonchRobles\InertiaTable\Filters\DateRangeFilter;
use PonchRobles\InertiaTable\Filters\Filter;
use PonchRobles\InertiaTable\Filters\Filterable;
use PonchRobles\InertiaTable\Filters\MultiSelectFilter;
use PonchRobles\InertiaTable\Filters\NumberRangeFilter;
use PonchRobles\InertiaTable\Filters\ToggleFilter;

class InertiaTable
{
    public const DEFAULT_PER_PAGE_OPTIONS = [15, 30, 50, 100];

    private string $name          = 'default';
    private string $pageName      = 'page';
    private array $perPageOptions = self::DEFAULT_PER_PAGE_OPTIONS;
    private string $defaultSort   = '';

    private Request $request;
    private Collection $columns;
    private Collection $searchInputs;
    private Collection $filters;

    /** false = disabled, true = enabled without a label, string = enabled with that label. */
    private static bool|string $defaultGlobalSearch = false;
    private static array $defaultQueryBuilderConfig = [];

    public function __construct(Request $request)
    {
        $this->request      = $request;
        $this->columns      = new Collection();
        $this->searchInputs = new Collection();
        $this->filters      = new Collection();

        if (static::$defaultGlobalSearch !== false) {
            $this->withGlobalSearch(is_string(static::$defaultGlobalSearch) ? static::$defaultGlobalSearch : null);
        }
    }

    /**
     * Set a default for global search. `false` disables it, `true` enables it without a label
     * (the frontend then uses its `search` translation), a string enables it with that label.
     */
    public static function defaultGlobalSearch(bool|string $label = true): void
    {
        static::$defaultGlobalSearch = is_string($label) ? __($label) : $label;
    }

    /**
     * Reset the default global search (useful for testing).
     */
    public static function resetDefaults(): void
    {
        static::$defaultGlobalSearch       = false;
        static::$defaultQueryBuilderConfig = [];
    }

    /**
     * Retrieve a query string item from the request.
     */
    private function query(string $key, mixed $default = null): mixed
    {
        return $this->request->query(
            $this->name === 'default' ? $key : "{$this->name}_{$key}",
            $default
        );
    }

    /**
     * Resolve a validated per-page value from the request. Returns the requested
     * value only if it is an integer present in $options, otherwise $default
     * (or the first option when no default is given).
     *
     * When $name is given, `{name}_perPage` is read. If that parameter is absent,
     * the plain `perPage` parameter is used as a fallback.
     *
     * Note: the fallback to the unprefixed `perPage` for named tables is
     * deprecated and will be removed in the next release.
     *
     * @param int[] $options
     *
     * @throws \InvalidArgumentException when $options is empty
     */
    public static function perPage(
        ?Request $request = null,
        array $options = self::DEFAULT_PER_PAGE_OPTIONS,
        ?int $default = null,
        ?string $name = null,
    ): int {
        if ($options === []) {
            throw new \InvalidArgumentException('The per page options must not be empty.');
        }

        $options = array_values($options);
        $request ??= request();

        $value = $request->query('perPage');

        if ($name !== null && $name !== '' && $name !== 'default') {
            // DEPRECATED: falling back to the unprefixed `perPage` for named tables
            // is kept for one release only, to ease migration of existing URLs.
            $value = $request->query("{$name}_perPage", $value);
        }

        if (is_string($value) && preg_match('/^[1-9][0-9]*$/', $value) === 1) {
            $value = (int) $value;

            if (in_array($value, $options, true)) {
                return $value;
            }
        }

        return $default ?? $options[0];
    }

    /**
     * Helper method to update the Spatie Query Builder parameter config.
     */
    public static function updateQueryBuilderParameters(string $name): void
    {
        if (empty(static::$defaultQueryBuilderConfig)) {
            static::$defaultQueryBuilderConfig = config('query-builder.parameters');
        }

        $newConfig = collect(static::$defaultQueryBuilderConfig)->map(function ($value) use ($name) {
            return "{$name}_{$value}";
        })->all();

        config(['query-builder.parameters' => $newConfig]);
    }

    /**
     * Name for this table.
     */
    public function name(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    /**
     * Page name for this table.
     */
    public function pageName(string $pageName): self
    {
        $this->pageName = $pageName;

        return $this;
    }

    /**
     * Per Page options for this table.
     */
    public function perPageOptions(array $perPageOptions): self
    {
        $this->perPageOptions = $perPageOptions;

        return $this;
    }

    /**
     * Default sort for this table.
     */
    public function defaultSort(string $defaultSort): self
    {
        $this->defaultSort = $defaultSort;

        return $this;
    }

    /**
     * Collects all properties and sets the default values from the request query.
     */
    protected function getQueryBuilderProps(): array
    {
        return [
            'defaultVisibleToggleableColumns' => $this->columns->reject->hidden->map->key->sort()->values(),
            'columns'                         => $this->transformColumns(),
            'hasHiddenColumns'                => $this->columns->filter->hidden->isNotEmpty(),
            'hasToggleableColumns'            => $this->columns->filter->canBeHidden->isNotEmpty(),

            'filters'           => $this->transformFilters(),
            'hasFilters'        => $this->filters->isNotEmpty(),
            'hasEnabledFilters' => $this->filters->filter(fn (Filterable $f) => $f->getValue() !== null)->isNotEmpty(),

            'searchInputs'                => $searchInputs              = $this->transformSearchInputs(),
            'searchInputsWithoutGlobal'   => $searchInputsWithoutGlobal = $searchInputs->where('key', '!=', 'global'),
            'hasSearchInputs'             => $searchInputsWithoutGlobal->isNotEmpty(),
            'hasSearchInputsWithValue'    => $searchInputsWithoutGlobal->whereNotNull('value')->isNotEmpty(),
            'hasSearchInputsWithoutValue' => $searchInputsWithoutGlobal->whereNull('value')->isNotEmpty(),

            'globalSearch' => $this->searchInputs->firstWhere('key', 'global'),

            'cursor'         => $this->query('cursor'),
            'sort'           => $this->query('sort', $this->defaultSort) ?: null,
            'defaultSort'    => $this->defaultSort,
            'page'           => Paginator::resolveCurrentPage($this->pageName),
            'pageName'       => $this->pageName,
            'perPageOptions' => $this->perPageOptions,
        ];
    }

    /**
     * Transform the columns collection so it can be used in the Inertia front-end.
     */
    protected function transformColumns(): Collection
    {
        $columns = $this->query('columns', []);
        $sort    = $this->query('sort', $this->defaultSort);

        return $this->columns->map(function (Column $column) use ($columns, $sort) {
            $key = $column->key;

            if (!empty($columns)) {
                $column->hidden = !in_array($key, $columns);
            }

            if ($sort === $key) {
                $column->sorted = 'asc';
            } elseif ($sort === "-{$key}") {
                $column->sorted = 'desc';
            }

            return $column;
        });
    }

    /**
     * Transform the filters collection so it can be used in the Inertia front-end.
     */
    protected function transformFilters(): Collection
    {
        $queryFilters = $this->query('filter', []);

        if (empty($queryFilters)) {
            return $this->filters;
        }

        return $this->filters->map(function (Filterable $filter) use ($queryFilters) {
            if (array_key_exists($filter->getKey(), $queryFilters)) {
                if ($filter instanceof NumberRangeFilter) {
                    $filter->value = [
                        $queryFilters[$filter->getKey()][0] ?? $filter->min,
                        $queryFilters[$filter->getKey()][1] ?? $filter->max,
                    ];
                } elseif ($filter instanceof DateRangeFilter) {
                    $filterValue = (array) $queryFilters[$filter->getKey()];
                    $filter->setValue([
                        $filterValue[0] ?? null,
                        $filterValue[1] ?? null,
                    ]);
                } elseif ($filter instanceof MultiSelectFilter) {
                    $filter->setValue((array) $queryFilters[$filter->getKey()]);
                } else {
                    $filter->setValue($queryFilters[$filter->getKey()]);
                }
            }

            return $filter;
        });
    }

    /**
     * Transform the search inputs collection so it can be used in the Inertia front-end.
     */
    protected function transformSearchInputs(): Collection
    {
        $filters = $this->query('filter', []);

        if (empty($filters)) {
            return $this->searchInputs;
        }

        return $this->searchInputs->map(function (SearchInput $searchInput) use ($filters) {
            if (array_key_exists($searchInput->key, $filters)) {
                $searchInput->value = $filters[$searchInput->key];
            }

            return $searchInput;
        });
    }

    /**
     * Add a column to the query builder.
     */
    public function column(
        ?string $key = null,
        ?string $label = null,
        bool $canBeHidden = true,
        bool $hidden = false,
        bool $sortable = false,
        bool $searchable = false,
        bool $nullsLast = false,
    ): self {
        $key   = $key ?: Str::kebab($label);
        $label = $label ?: Str::headline($key);

        $this->columns = $this->columns->reject(function (Column $column) use ($key) {
            return $column->key === $key;
        })->push($column = new Column(
            key: $key,
            label: $label,
            canBeHidden: $canBeHidden,
            hidden: $hidden,
            sortable: $sortable,
            sorted: false,
            nullsLast: $nullsLast,
        ))->values();

        if ($searchable) {
            $this->searchInput($column->key, $column->label);
        }

        return $this;
    }

    /**
     * Helper method to add a global search input.
     */
    public function withGlobalSearch(?string $label = null): self
    {
        $this->searchInput('global', $label);

        if (!$label) {
            // No explicit label: send null so the frontend uses its `search` translation.
            $this->searchInputs->firstWhere('key', 'global')->label = null;
        }

        return $this;
    }

    /**
     * Add a search input to query builder.
     */
    public function searchInput(string $key, ?string $label = null, ?string $defaultValue = null): self
    {
        $this->searchInputs = $this->searchInputs->reject(function (SearchInput $searchInput) use ($key) {
            return $searchInput->key === $key;
        })->push(new SearchInput(
            key: $key,
            label: $label ?: Str::headline($key),
            value: $defaultValue,
        ))->values();

        return $this;
    }

    /**
     * Add a select filter to the query builder.
     */
    public function selectFilter(
        string $key,
        array $options,
        ?string $label = null,
        ?string $defaultValue = null,
        bool $noFilterOption = true,
        ?string $noFilterOptionLabel = null,
    ): self {
        $this->filters = $this->filters->reject(function (Filterable $filter) use ($key) {
            return $filter->getKey() === $key;
        })->push(new Filter(
            key: $key,
            label: $label ?: Str::headline($key),
            options: $options,
            value: $defaultValue,
            noFilterOption: $noFilterOption,
            noFilterOptionLabel: $noFilterOptionLabel ?: '-',
            type: 'select',
        ))->values();

        return $this;
    }

    /**
     * Add a toggle filter to the query builder.
     */
    public function toggleFilter(string $key, ?string $label = null, ?bool $defaultValue = null): self
    {
        $this->filters = $this->filters->reject(function (Filterable $filter) use ($key) {
            return $filter->getKey() === $key;
        })->push(new ToggleFilter(
            key: $key,
            label: $label ?: Str::headline($key),
            value: $defaultValue,
        ))->values();

        return $this;
    }

    /**
     * Add a number range filter to the query builder.
     */
    public function numberRangeFilter(
        string $key,
        float $max,
        float $min = 0,
        string $prefix = '',
        string $suffix = '',
        float $step = 1,
        ?string $label = null,
        ?array $defaultValue = null,
    ): self {
        $this->filters = $this->filters->reject(function (Filterable $filter) use ($key) {
            return $filter->getKey() === $key;
        })->push(new NumberRangeFilter(
            key: $key,
            label: $label ?: Str::headline($key),
            max: $max,
            min: $min,
            prefix: $prefix,
            suffix: $suffix,
            step: $step,
            value: $defaultValue,
        ))->values();

        return $this;
    }

    /**
     * Add a date range filter to the query builder.
     */
    public function dateRangeFilter(
        string $key,
        ?string $label = null,
        ?array $defaultValue = null,
        ?string $minDate = null,
        ?string $maxDate = null,
        string $format = 'Y-m-d',
    ): self {
        $this->filters = $this->filters->reject(function (Filterable $filter) use ($key) {
            return $filter->getKey() === $key;
        })->push(new DateRangeFilter(
            key: $key,
            label: $label ?: Str::headline($key),
            value: $defaultValue,
            minDate: $minDate,
            maxDate: $maxDate,
            format: $format,
        ))->values();

        return $this;
    }

    /**
     * Add a multi-select filter to the query builder.
     */
    public function multiSelectFilter(
        string $key,
        array $options,
        ?string $label = null,
        ?array $defaultValue = null,
        bool $noFilterOption = true,
        ?string $noFilterOptionLabel = null,
    ): self {
        $this->filters = $this->filters->reject(function (Filterable $filter) use ($key) {
            return $filter->getKey() === $key;
        })->push(new MultiSelectFilter(
            key: $key,
            label: $label ?: Str::headline($key),
            options: $options,
            value: $defaultValue,
            noFilterOption: $noFilterOption,
            noFilterOptionLabel: $noFilterOptionLabel ?: '-',
        ))->values();

        return $this;
    }

    /**
     * Give the query builder props to the given Inertia response.
     */
    public function applyTo(Response $response): Response
    {
        $props = array_merge($response->getQueryBuilderProps(), [
            $this->name => $this->getQueryBuilderProps(),
        ]);

        return $response->with('queryBuilderProps', $props);
    }
}
