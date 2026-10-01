<?php

namespace PonchRobles\InertiaTable\Tests\QueryBuilderFilters;

use PonchRobles\InertiaTable\Filters\NumberRangeFilter;

class FiltersNumberRangeTest extends FilterTestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        $this->seedProduct('A', 10, '2024-01-01', 'x');
        $this->seedProduct('B', 20, '2024-01-01', 'x');
        $this->seedProduct('C', 30, '2024-01-01', 'x');
        $this->seedProduct('D', 40, '2024-01-01', 'x');
    }

    private function names(array|string $input): array
    {
        return $this->filterNames(NumberRangeFilter::getQueryBuilderFilter('price'), 'price', $input);
    }

    public function test_both_bounds_are_inclusive(): void
    {
        $this->assertSame(['B', 'C'], $this->names('20,30'));
    }

    public function test_full_range(): void
    {
        $this->assertSame(['A', 'B', 'C', 'D'], $this->names('0,1000'));
    }

    public function test_reversed_bounds_are_normalised(): void
    {
        $this->assertSame(['B', 'C'], $this->names('30,20'));
    }

    public function test_array_input_is_supported(): void
    {
        $this->assertSame(['C', 'D'], $this->names(['25', '100']));
    }

    public function test_only_min_is_ignored(): void
    {
        $this->assertSame(['A', 'B', 'C', 'D'], $this->names('20,'));
    }

    public function test_only_max_is_ignored(): void
    {
        $this->assertSame(['A', 'B', 'C', 'D'], $this->names(',30'));
    }

    public function test_empty_input_is_ignored(): void
    {
        $this->assertSame(['A', 'B', 'C', 'D'], $this->names(''));
    }

    public function test_non_numeric_input_is_ignored(): void
    {
        $this->assertSame(['A', 'B', 'C', 'D'], $this->names('abc,def'));
        $this->assertSame(['A', 'B', 'C', 'D'], $this->names('abc,30'));
    }
}
