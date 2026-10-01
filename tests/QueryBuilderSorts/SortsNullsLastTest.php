<?php

namespace PonchRobles\InertiaTable\Tests\QueryBuilderSorts;

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use PonchRobles\InertiaTable\QueryBuilderSorts\SortsNullsLast;
use PonchRobles\InertiaTable\Tests\Fixtures\Product;
use PonchRobles\InertiaTable\Tests\TestCase;
use Spatie\QueryBuilder\QueryBuilder;

class SortsNullsLastTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->integer('price');
            $table->dateTime('created_at')->nullable();
            $table->string('category')->nullable();
        });

        foreach ([['a', 'b'], ['b', null], ['c', 'a'], ['d', null], ['e', 'c']] as [$name, $category]) {
            Product::create(['name' => $name, 'price' => 1, 'category' => $category]);
        }
    }

    /**
     * @param array<int, mixed> $allowed
     *
     * @return array<int, string>
     */
    private function sorted(string $sort, array $allowed): array
    {
        return QueryBuilder::for(Product::class, Request::create('/', 'GET', ['sort' => $sort]))
            ->allowedSorts(...$allowed)
            ->orderBy('id')
            ->pluck('name')
            ->all();
    }

    public function test_nulls_come_last_ascending(): void
    {
        $this->assertSame(
            ['c', 'a', 'e', 'b', 'd'],
            $this->sorted('category', [SortsNullsLast::getQueryBuilderSort('category')])
        );
    }

    public function test_nulls_come_last_descending(): void
    {
        $this->assertSame(
            ['e', 'a', 'c', 'b', 'd'],
            $this->sorted('-category', [SortsNullsLast::getQueryBuilderSort('category')])
        );
    }

    public function test_sort_name_can_differ_from_the_column(): void
    {
        $this->assertSame(
            ['c', 'a', 'e', 'b', 'd'],
            $this->sorted('cat', [SortsNullsLast::getQueryBuilderSort('cat', 'category')])
        );
    }

    public function test_plain_sorts_keep_nulls_first_ascending(): void
    {
        $this->assertSame(['b', 'd', 'c', 'a', 'e'], $this->sorted('category', ['category']));
    }
}
