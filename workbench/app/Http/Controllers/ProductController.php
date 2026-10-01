<?php

namespace Workbench\App\Http\Controllers;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Arr;
use Inertia\Inertia;
use Inertia\Response;
use PonchRobles\InertiaTable\Filters\DateRangeFilter;
use PonchRobles\InertiaTable\Filters\MultiSelectFilter;
use PonchRobles\InertiaTable\Filters\NumberRangeFilter;
use PonchRobles\InertiaTable\InertiaTable;
use PonchRobles\InertiaTable\QueryBuilderSorts\SortsNullsLast;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;
use Workbench\App\Models\Product;
use Workbench\Database\Factories\ProductFactory;

class ProductController
{
    private const PER_PAGE_OPTIONS = [10, 25, 50];

    /**
     * The full table: global search, search rows, sorting, pagination, per page, reset,
     * column toggle and every filter type.
     */
    public function index(): Response
    {
        $globalSearch = AllowedFilter::callback('global', function (Builder $query, $value) {
            $query->where(function (Builder $query) use ($value) {
                foreach (Arr::wrap($value) as $term) {
                    $query->orWhere('name', 'LIKE', "%{$term}%")
                        ->orWhere('brand', 'LIKE', "%{$term}%");
                }
            });
        });

        $products = QueryBuilder::for(Product::class)
            ->defaultSort('name')
            ->allowedSorts(
                'name',
                'category',
                'brand',
                'price',
                SortsNullsLast::getQueryBuilderSort('stock'),
                SortsNullsLast::getQueryBuilderSort('released_at'),
            )
            ->allowedFilters(
                'name',
                $globalSearch,
                AllowedFilter::exact('category'),
                MultiSelectFilter::getQueryBuilderFilter('brand'),
                AllowedFilter::exact('is_active'),
                NumberRangeFilter::getQueryBuilderFilter('price'),
                DateRangeFilter::getQueryBuilderFilter('released_at'),
            )
            ->paginate(InertiaTable::perPage(options: self::PER_PAGE_OPTIONS, default: 10))
            ->withQueryString();

        $categories = array_combine(ProductFactory::CATEGORIES, array_map('ucfirst', ProductFactory::CATEGORIES));
        $brands     = array_combine(ProductFactory::BRANDS, ProductFactory::BRANDS);

        return Inertia::render('Products/Index', ['products' => $products])
            ->table(function (InertiaTable $table) use ($categories, $brands) {
                $table
                    ->withGlobalSearch()
                    ->defaultSort('name')
                    ->perPageOptions(self::PER_PAGE_OPTIONS)
                    ->column(key: 'name', label: 'Name', canBeHidden: false, sortable: true, searchable: true)
                    ->column(key: 'category', label: 'Category', sortable: true)
                    ->column(key: 'brand', label: 'Brand', hidden: true, sortable: true) // hidden by default
                    ->column(key: 'price', label: 'Price', sortable: true)
                    ->column(key: 'stock', label: 'Stock', sortable: true, nullsLast: true)
                    ->column(key: 'is_active', label: 'Active')
                    ->column(key: 'released_at', label: 'Released', sortable: true, nullsLast: true)
                    ->selectFilter(key: 'category', options: $categories, label: 'Category')
                    ->multiSelectFilter(key: 'brand', options: $brands, label: 'Brand')
                    ->toggleFilter(key: 'is_active', label: 'Active')
                    ->numberRangeFilter(key: 'price', max: 1000, prefix: '$', label: 'Price')
                    ->dateRangeFilter(key: 'released_at', label: 'Released');
            });
    }

    /**
     * Two named tables on one page: prefixed query keys and independent per page values.
     */
    public function twoTables(): Response
    {
        InertiaTable::updateQueryBuilderParameters('gadgets');

        $gadgets = QueryBuilder::for(Product::query()->whereIn('category', ['electronics', 'games']))
            ->defaultSort('name')
            ->allowedSorts('name', 'price')
            ->allowedFilters('name')
            ->paginate(InertiaTable::perPage(options: [5, 10, 25], default: 5, name: 'gadgets'), pageName: 'gadgetsPage')
            ->withQueryString();

        InertiaTable::updateQueryBuilderParameters('household');

        $household = QueryBuilder::for(Product::query()->whereIn('category', ['home', 'books', 'toys']))
            ->defaultSort('name')
            ->allowedSorts('name', 'price')
            ->allowedFilters('name')
            ->paginate(InertiaTable::perPage(options: [5, 10, 25], default: 10, name: 'household'), pageName: 'householdPage')
            ->withQueryString();

        return Inertia::render('TwoTables', ['gadgets' => $gadgets, 'household' => $household])
            ->table(function (InertiaTable $table) {
                $table
                    ->name('gadgets')
                    ->pageName('gadgetsPage')
                    ->defaultSort('name')
                    ->perPageOptions([5, 10, 25])
                    ->column(key: 'name', label: 'Name', canBeHidden: false, sortable: true, searchable: true)
                    ->column(key: 'price', label: 'Price', sortable: true);
            })->table(function (InertiaTable $table) {
                $table
                    ->name('household')
                    ->pageName('householdPage')
                    ->defaultSort('name')
                    ->perPageOptions([5, 10, 25])
                    ->column(key: 'name', label: 'Name', canBeHidden: false, sortable: true, searchable: true)
                    ->column(key: 'price', label: 'Price', sortable: true);
            });
    }
}
