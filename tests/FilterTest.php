<?php

namespace PonchRobles\InertiaTable\Tests;

use PHPUnit\Framework\TestCase;
use PonchRobles\InertiaTable\Filters\DateRangeFilter;
use PonchRobles\InertiaTable\Filters\Filter;
use PonchRobles\InertiaTable\Filters\MultiSelectFilter;
use PonchRobles\InertiaTable\Filters\NumberRangeFilter;
use PonchRobles\InertiaTable\Filters\ToggleFilter;

class FilterTest extends TestCase
{
    public function test_select_filter_can_be_created(): void
    {
        $filter = new Filter(
            key: 'status',
            label: 'Status',
            options: ['active' => 'Active', 'inactive' => 'Inactive'],
        );

        $this->assertEquals('status', $filter->getKey());
        $this->assertEquals('select', $filter->getType());
        $this->assertNull($filter->getValue());
    }

    public function test_select_filter_to_array_with_no_filter_option(): void
    {
        $filter = new Filter(
            key: 'status',
            label: 'Status',
            options: ['active' => 'Active', 'inactive' => 'Inactive'],
            noFilterOption: true,
            noFilterOptionLabel: 'All',
        );

        $array = $filter->toArray();

        $this->assertArrayHasKey('', $array['options']);
        $this->assertEquals('All', $array['options']['']);
    }

    public function test_select_filter_to_array_without_no_filter_option(): void
    {
        $filter = new Filter(
            key: 'status',
            label: 'Status',
            options: ['active' => 'Active'],
            noFilterOption: false,
        );

        $array = $filter->toArray();

        $this->assertArrayNotHasKey('', $array['options']);
    }

    public function test_toggle_filter(): void
    {
        $filter = new ToggleFilter(key: 'is_admin', label: 'Admin Only');

        $this->assertEquals('is_admin', $filter->getKey());
        $this->assertEquals('toggle', $filter->getType());
        $this->assertNull($filter->getValue());

        $filter->setValue(true);
        $this->assertTrue($filter->getValue());
    }

    public function test_toggle_filter_to_array(): void
    {
        $filter = new ToggleFilter(key: 'active', label: 'Active', value: true);

        $this->assertEquals([
            'key'   => 'active',
            'label' => 'Active',
            'value' => true,
            'type'  => 'toggle',
        ], $filter->toArray());
    }

    public function test_number_range_filter(): void
    {
        $filter = new NumberRangeFilter(
            key: 'price',
            label: 'Price',
            max: 1000,
            min: 0,
            prefix: '$',
            step: 10,
        );

        $this->assertEquals('price', $filter->getKey());
        $this->assertEquals('number_range', $filter->getType());
        $this->assertNull($filter->getValue());
    }

    public function test_number_range_filter_to_array_with_null_value(): void
    {
        $filter = new NumberRangeFilter(
            key: 'price',
            label: 'Price',
            max: 100,
            min: 10,
        );

        $array = $filter->toArray();

        $this->assertEquals([10, 100], $array['value']);
    }

    public function test_number_range_filter_to_array_with_value(): void
    {
        $filter = new NumberRangeFilter(
            key: 'price',
            label: 'Price',
            max: 100,
            min: 10,
            value: [20, 80],
        );

        $array = $filter->toArray();

        $this->assertEquals([20, 80], $array['value']);
    }

    public function test_date_range_filter_can_be_created(): void
    {
        $filter = new DateRangeFilter(
            key: 'created_at',
            label: 'Created At',
        );

        $this->assertEquals('created_at', $filter->getKey());
        $this->assertEquals('date_range', $filter->getType());
        $this->assertNull($filter->getValue());
    }

    public function test_date_range_filter_to_array(): void
    {
        $filter = new DateRangeFilter(
            key: 'created_at',
            label: 'Created At',
            value: ['2024-01-01', '2024-12-31'],
            minDate: '2020-01-01',
            maxDate: '2025-12-31',
        );

        $array = $filter->toArray();

        $this->assertEquals('date_range', $array['type']);
        $this->assertEquals(['2024-01-01', '2024-12-31'], $array['value']);
        $this->assertEquals('2020-01-01', $array['minDate']);
        $this->assertEquals('2025-12-31', $array['maxDate']);
        $this->assertEquals('Y-m-d', $array['format']);
    }

    public function test_date_range_filter_set_value(): void
    {
        $filter = new DateRangeFilter(key: 'date', label: 'Date');
        $filter->setValue(['2024-06-01', '2024-06-30']);

        $this->assertEquals(['2024-06-01', '2024-06-30'], $filter->getValue());
    }

    public function test_multi_select_filter_can_be_created(): void
    {
        $filter = new MultiSelectFilter(
            key: 'tags',
            label: 'Tags',
            options: ['php' => 'PHP', 'js' => 'JavaScript', 'vue' => 'Vue'],
        );

        $this->assertEquals('tags', $filter->getKey());
        $this->assertEquals('multi_select', $filter->getType());
        $this->assertNull($filter->getValue());
    }

    public function test_multi_select_filter_to_array(): void
    {
        $filter = new MultiSelectFilter(
            key: 'tags',
            label: 'Tags',
            options: ['php' => 'PHP', 'js' => 'JavaScript'],
            value: ['php'],
        );

        $array = $filter->toArray();

        $this->assertEquals('multi_select', $array['type']);
        $this->assertEquals(['php'], $array['value']);
        $this->assertArrayHasKey('php', $array['options']);
    }

    public function test_multi_select_filter_set_value(): void
    {
        $filter = new MultiSelectFilter(
            key: 'tags',
            label: 'Tags',
            options: ['a' => 'A', 'b' => 'B'],
        );

        $filter->setValue(['a', 'b']);
        $this->assertEquals(['a', 'b'], $filter->getValue());

        $filter->setValue('a');
        $this->assertEquals(['a'], $filter->getValue());
    }
}
