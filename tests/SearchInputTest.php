<?php

namespace PonchRobles\InertiaTable\Tests;

use PHPUnit\Framework\TestCase;
use PonchRobles\InertiaTable\SearchInput;

class SearchInputTest extends TestCase
{
    public function test_search_input_can_be_created(): void
    {
        $input = new SearchInput(key: 'name', label: 'Name');

        $this->assertEquals('name', $input->key);
        $this->assertEquals('Name', $input->label);
        $this->assertNull($input->value);
    }

    public function test_search_input_with_default_value(): void
    {
        $input = new SearchInput(key: 'name', label: 'Name', value: 'John');

        $this->assertEquals('John', $input->value);
    }

    public function test_search_input_to_array(): void
    {
        $input = new SearchInput(key: 'email', label: 'Email', value: 'test@example.com');

        $this->assertEquals([
            'key'   => 'email',
            'label' => 'Email',
            'value' => 'test@example.com',
        ], $input->toArray());
    }
}
