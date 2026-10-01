<?php

namespace PonchRobles\InertiaTable\Tests\QueryBuilderFilters;

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use PonchRobles\InertiaTable\Tests\Fixtures\Product;
use PonchRobles\InertiaTable\Tests\TestCase;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

abstract class FilterTestCase extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->integer('price');
            $table->dateTime('created_at')->nullable();
            $table->string('category');
        });
    }

    protected function seedProduct(string $name, int $price, string $createdAt, string $category): void
    {
        Product::create([
            'name'       => $name,
            'price'      => $price,
            'created_at' => $createdAt,
            'category'   => $category,
        ]);
    }

    /**
     * @return array<int, string>
     */
    protected function filterNames(AllowedFilter $allowed, string $column, array|string $input): array
    {
        $request = Request::create('/', 'GET', ['filter' => [$column => $input]]);

        return QueryBuilder::for(Product::class, $request)
            ->allowedFilters($allowed)
            ->orderBy('id')
            ->pluck('name')
            ->all();
    }
}
