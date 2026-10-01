<?php

namespace PonchRobles\InertiaTable\Tests\QueryBuilderFilters;

use PonchRobles\InertiaTable\Filters\MultiSelectFilter;

class FiltersMultiSelectTest extends FilterTestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        $this->seedProduct('A', 1, '2024-01-01', 'books');
        $this->seedProduct('B', 1, '2024-01-01', 'games');
        $this->seedProduct('C', 1, '2024-01-01', 'toys');
        $this->seedProduct('D', 1, '2024-01-01', 'books');
        $this->seedProduct('E', 1, '2024-01-01', 'a,b');
    }

    private function names(array|string $input): array
    {
        return $this->filterNames(MultiSelectFilter::getQueryBuilderFilter('category'), 'category', $input);
    }

    public function test_single_value(): void
    {
        $this->assertSame(['B'], $this->names('games'));
    }

    public function test_multiple_values_as_comma_string(): void
    {
        $this->assertSame(['A', 'B', 'D'], $this->names('books,games'));
    }

    public function test_multiple_values_as_array(): void
    {
        $this->assertSame(['B', 'C'], $this->names(['games', 'toys']));
    }

    public function test_empty_selection_is_ignored(): void
    {
        $this->assertSame(['A', 'B', 'C', 'D', 'E'], $this->names(''));
        $this->assertSame(['A', 'B', 'C', 'D', 'E'], $this->names(['', '']));
    }

    public function test_empty_entries_are_dropped(): void
    {
        $this->assertSame(['B'], $this->names(['', 'games']));
    }

    public function test_value_containing_comma_matches_when_sent_as_array(): void
    {
        $this->assertSame(['E'], $this->names(['a,b']));
    }

    public function test_comma_value_can_be_mixed_with_plain_values(): void
    {
        $this->assertSame(['B', 'E'], $this->names(['a,b', 'games']));
    }

    public function test_unknown_value_returns_nothing(): void
    {
        $this->assertSame([], $this->names('nope'));
    }
}
