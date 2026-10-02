<?php

namespace PonchRobles\InertiaTable\Tests\QueryBuilderFilters;

use PonchRobles\InertiaTable\Filters\DateRangeFilter;

class FiltersDateRangeTest extends FilterTestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        $this->seedProduct('A', 1, '2024-01-01 00:00:00', 'x');
        $this->seedProduct('B', 1, '2024-01-10 12:30:00', 'x');
        $this->seedProduct('C', 1, '2024-01-20 23:59:59', 'x');
        $this->seedProduct('D', 1, '2024-02-01 00:00:00', 'x');
    }

    private function names(array|string $input): array
    {
        return $this->filterNames(DateRangeFilter::getQueryBuilderFilter('created_at'), 'created_at', $input);
    }

    public function test_both_bounds_are_inclusive(): void
    {
        $this->assertSame(['A', 'B', 'C'], $this->names('2024-01-01,2024-01-20'));
    }

    public function test_to_date_includes_the_whole_day(): void
    {
        $this->assertSame(['A', 'B', 'C'], $this->names('2024-01-01,2024-01-20'));
        $this->assertSame(['B'], $this->names('2024-01-10,2024-01-10'));
    }

    public function test_from_date_starts_at_beginning_of_day(): void
    {
        $this->assertSame(['A'], $this->names('2024-01-01,2024-01-01'));
    }

    public function test_array_input_is_supported(): void
    {
        $this->assertSame(['B', 'C'], $this->names(['2024-01-02', '2024-01-31']));
    }

    public function test_only_from_is_ignored(): void
    {
        $this->assertSame(['A', 'B', 'C', 'D'], $this->names('2024-01-10,'));
        $this->assertSame(['A', 'B', 'C', 'D'], $this->names(['2024-01-10', '']));
    }

    public function test_only_to_is_ignored(): void
    {
        $this->assertSame(['A', 'B', 'C', 'D'], $this->names(',2024-01-10'));
        $this->assertSame(['A', 'B', 'C', 'D'], $this->names(['', '2024-01-10']));
    }

    public function test_single_value_is_ignored(): void
    {
        $this->assertSame(['A', 'B', 'C', 'D'], $this->names('2024-01-10'));
    }

    public function test_empty_input_is_ignored(): void
    {
        $this->assertSame(['A', 'B', 'C', 'D'], $this->names(''));
        $this->assertSame(['A', 'B', 'C', 'D'], $this->names(','));
    }

    public function test_invalid_dates_are_ignored(): void
    {
        $this->assertSame(['A', 'B', 'C', 'D'], $this->names('not-a-date,also-bad'));
    }
}
