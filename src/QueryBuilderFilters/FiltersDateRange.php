<?php

namespace PonchRobles\InertiaTable\QueryBuilderFilters;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Spatie\QueryBuilder\Filters\Filter;

class FiltersDateRange implements Filter
{
    public function __invoke(Builder $query, $value, string $property): void
    {
        $value = array_values(array_filter((array) $value, fn ($v) => ! empty($v)));

        if (count($value) < 2) {
            return;
        }

        try {
            $start = Carbon::parse($value[0])->startOfDay();
            $end = Carbon::parse($value[1])->endOfDay();
        } catch (\Exception) {
            return;
        }

        $query->whereBetween($property, [$start, $end]);
    }
}
