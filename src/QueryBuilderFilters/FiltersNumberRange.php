<?php

namespace PonchRobles\InertiaTable\QueryBuilderFilters;

use Illuminate\Database\Eloquent\Builder;
use Spatie\QueryBuilder\Filters\Filter;

class FiltersNumberRange implements Filter
{
    public function __invoke(Builder $query, $value, string $property): void
    {
        $value = array_values(array_filter((array) $value, fn ($v) => is_numeric($v)));

        if (count($value) < 2) {
            return;
        }

        $min = min($value[0], $value[1]);
        $max = max($value[0], $value[1]);

        $query->whereBetween($property, [$min, $max]);
    }
}
