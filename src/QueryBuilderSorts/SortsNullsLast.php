<?php

namespace PonchRobles\InertiaTable\QueryBuilderSorts;

use Illuminate\Database\Eloquent\Builder;
use Spatie\QueryBuilder\AllowedSort;
use Spatie\QueryBuilder\Sorts\Sort;

/**
 * Sorts by the given column, always placing NULL values last whatever the direction.
 *
 * Uses a plain `column IS NULL` ordering (0 for non-null, 1 for null) followed by the column
 * itself, so it works on MySQL, PostgreSQL and SQLite alike (no `NULLS LAST` syntax).
 */
class SortsNullsLast implements Sort
{
    public function __invoke(Builder $query, bool $descending, string $property): void
    {
        $wrapped = $query->getQuery()->getGrammar()->wrap($property);

        $query
            ->orderByRaw("{$wrapped} IS NULL ASC")
            ->orderBy($property, $descending ? 'desc' : 'asc');
    }

    /**
     * @param string      $name   the name of the sort, as used in the `sort` query parameter
     * @param string|null $column the database column, defaults to $name
     */
    public static function getQueryBuilderSort(string $name, ?string $column = null): AllowedSort
    {
        return AllowedSort::custom($name, new static(), $column);
    }
}
