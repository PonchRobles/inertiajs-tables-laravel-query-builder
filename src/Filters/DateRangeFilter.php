<?php

namespace PonchRobles\InertiaTable\Filters;

use PonchRobles\InertiaTable\QueryBuilderFilters\FiltersDateRange;
use Spatie\QueryBuilder\AllowedFilter;

class DateRangeFilter implements Filterable
{
    protected const TYPE = 'date_range';

    public function __construct(
        public string $key,
        public string $label,
        public ?array $value = null,
        public ?string $minDate = null,
        public ?string $maxDate = null,
        public string $format = 'Y-m-d',
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
        $this->value = $value;
    }

    public function toArray(): array
    {
        return [
            'key'     => $this->key,
            'label'   => $this->label,
            'value'   => $this->value,
            'minDate' => $this->minDate,
            'maxDate' => $this->maxDate,
            'format'  => $this->format,
            'type'    => self::TYPE,
        ];
    }

    public static function getQueryBuilderFilter(string $column): AllowedFilter
    {
        return AllowedFilter::custom($column, new FiltersDateRange);
    }
}
