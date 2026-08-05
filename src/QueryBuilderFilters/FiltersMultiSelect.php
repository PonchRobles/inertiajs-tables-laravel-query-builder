<?php

namespace PonchRobles\InertiaTable\QueryBuilderFilters;

use Illuminate\Database\Eloquent\Builder;
use Spatie\QueryBuilder\Filters\Filter;

class FiltersMultiSelect implements Filter
{
    public function __invoke(Builder $query, $value, string $property): void
    {
        $value = array_values(array_filter((array) $value, fn ($v) => $v !== '' && $v !== null));

        if (empty($value)) {
            return;
        }

        $query->whereIn($property, $value);
    }
}
