<?php

namespace PonchRobles\InertiaTable\Tests;

use PHPUnit\Framework\TestCase;
use PonchRobles\InertiaTable\Column;

class ColumnTest extends TestCase
{
    public function test_column_can_be_created_with_all_properties(): void
    {
        $column = new Column(
            key: 'name',
            label: 'Name',
            canBeHidden: true,
            hidden: false,
            sortable: true,
            sorted: false,
        );

        $this->assertEquals('name', $column->key);
        $this->assertEquals('Name', $column->label);
        $this->assertTrue($column->canBeHidden);
        $this->assertFalse($column->hidden);
        $this->assertTrue($column->sortable);
        $this->assertFalse($column->sorted);
    }

    public function test_column_to_array(): void
    {
        $column = new Column(
            key: 'email',
            label: 'Email Address',
            canBeHidden: false,
            hidden: false,
            sortable: true,
            sorted: 'asc',
        );

        $array = $column->toArray();

        $this->assertEquals([
            'key'           => 'email',
            'label'         => 'Email Address',
            'can_be_hidden' => false,
            'hidden'        => false,
            'sortable'      => true,
            'sorted'        => 'asc',
        ], $array);
    }

    public function test_column_defaults(): void
    {
        $column = new Column(key: 'test', label: 'Test');

        $this->assertTrue($column->canBeHidden);
        $this->assertFalse($column->hidden);
        $this->assertFalse($column->sortable);
        $this->assertFalse($column->sorted);
    }
}
