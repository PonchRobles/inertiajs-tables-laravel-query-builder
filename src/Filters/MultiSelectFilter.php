<?php

namespace PonchRobles\InertiaTable\Filters;

use PonchRobles\InertiaTable\QueryBuilderFilters\FiltersMultiSelect;
use Spatie\QueryBuilder\AllowedFilter;

class MultiSelectFilter implements Filterable
{
    protected const TYPE = 'multi_select';

    public function __construct(
        public string $key,
        public string $label,
        public array $options,
        public ?array $value = null,
        public bool $noFilterOption = true,
        public string $noFilterOptionLabel = '-',
    ) {
    }

    public function getKey(): string
    {
        return $this->key;
    }

    public function getType(): string
    {
        return self::TYPE;
    }

    public function getValue(): mixed
    {
        return $this->value;
    }

    public function setValue(mixed $value): void
    {
        $this->value = is_array($value) ? $value : (array) $value;
    }

    public function toArray(): array
    {
        return [
            'key'             => $this->key,
            'label'           => $this->label,
            'options'         => $this->options,
            'ordered_options' => $this->getOrderedOptions(),
            'value'           => $this->value,
            'type'            => self::TYPE,
        ];
    }

    /**
     * Options as a list so the PHP order survives JSON (objects reorder integer-like keys in JS).
     *
     * @return array<int, array{value: int|string, label: string}>
     */
    protected function getOrderedOptions(): array
    {
        $ordered = [];

        foreach ($this->options as $value => $label) {
            $ordered[] = ['value' => $value, 'label' => $label];
        }

        return $ordered;
    }

    public static function getQueryBuilderFilter(string $column): AllowedFilter
    {
        return AllowedFilter::custom($column, new FiltersMultiSelect());
    }
}
