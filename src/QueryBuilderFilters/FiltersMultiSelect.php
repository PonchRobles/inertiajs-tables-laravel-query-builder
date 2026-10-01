<?php

namespace PonchRobles\InertiaTable\QueryBuilderFilters;

use Illuminate\Database\Eloquent\Builder;
use Spatie\QueryBuilder\Filters\Filter;

class FiltersMultiSelect implements Filter
{
    public function __invoke(Builder $query, $value, string $property): void
    {
        $value = array_map(fn ($v) => $this->rejoinSplitValue($v), (array) $value);
        $value = array_values(array_filter($value, fn ($v) => $v !== '' && $v !== null));

        if (empty($value)) {
            return;
        }

        $query->whereIn($property, $value);
    }

    /**
     * Spatie splits every filter value on the delimiter, so a single option that contains the
     * delimiter (filter[category][]=a,b) reaches the filter as a nested array. Rejoin it so the
     * option matches the literal value.
     */
    private function rejoinSplitValue(mixed $value): mixed
    {
        if (!is_array($value)) {
            return $value;
        }

        $delimiter = (string) config('query-builder.delimiter', ',');

        return implode($delimiter, array_map(fn ($v) => $this->rejoinSplitValue($v), $value));
    }
}
