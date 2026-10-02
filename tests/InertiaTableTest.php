<?php

namespace PonchRobles\InertiaTable\Tests;

use Illuminate\Http\Request;
use Inertia\Inertia;
use PonchRobles\InertiaTable\InertiaTable;

class InertiaTableTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        InertiaTable::resetDefaults();
    }

    private function createTable(?Request $request = null): InertiaTable
    {
        return new InertiaTable($request ?? Request::create('/'));
    }

    private function getProps(\Inertia\Response $response): array
    {
        $reflection = new \ReflectionProperty($response, 'props');
        $reflection->setAccessible(true);

        return $reflection->getValue($response);
    }

    public function test_basic_table_creation(): void
    {
        $table    = $this->createTable();
        $response = Inertia::render('Users/Index');
        $table->applyTo($response);

        $props = $this->getProps($response);

        $this->assertArrayHasKey('queryBuilderProps', $props);
        $this->assertArrayHasKey('default', $props['queryBuilderProps']);
    }

    public function test_table_with_columns(): void
    {
        $table = $this->createTable();
        $table->column(key: 'name', label: 'Name', sortable: true)
            ->column(key: 'email', label: 'Email', sortable: true);

        $response = Inertia::render('Users/Index');
        $table->applyTo($response);

        $props = $this->getProps($response);
        $qb    = $props['queryBuilderProps']['default'];

        $this->assertCount(2, $qb['columns']);
        $this->assertEquals('name', $qb['columns'][0]->key);
        $this->assertEquals('email', $qb['columns'][1]->key);
    }

    public function test_table_with_global_search(): void
    {
        $table = $this->createTable();
        $table->withGlobalSearch('Search users...');

        $response = Inertia::render('Users/Index');
        $table->applyTo($response);

        $props = $this->getProps($response);
        $qb    = $props['queryBuilderProps']['default'];

        $this->assertNotNull($qb['globalSearch']);
        $this->assertEquals('global', $qb['globalSearch']->key);
        $this->assertEquals('Search users...', $qb['globalSearch']->label);
    }

    public function test_table_with_select_filter(): void
    {
        $table = $this->createTable();
        $table->selectFilter('status', [
            'active'   => 'Active',
            'inactive' => 'Inactive',
        ], 'Status');

        $response = Inertia::render('Users/Index');
        $table->applyTo($response);

        $props = $this->getProps($response);
        $qb    = $props['queryBuilderProps']['default'];

        $this->assertTrue($qb['hasFilters']);
        $this->assertCount(1, $qb['filters']);
        $this->assertEquals('status', $qb['filters'][0]->key);
    }

    public function test_table_with_toggle_filter(): void
    {
        $table = $this->createTable();
        $table->toggleFilter('is_admin', 'Admin Only');

        $response = Inertia::render('Users/Index');
        $table->applyTo($response);

        $props = $this->getProps($response);
        $qb    = $props['queryBuilderProps']['default'];

        $this->assertTrue($qb['hasFilters']);
        $this->assertEquals('toggle', $qb['filters'][0]->getType());
    }

    public function test_table_with_number_range_filter(): void
    {
        $table = $this->createTable();
        $table->numberRangeFilter('price', max: 1000, min: 0, prefix: '$', step: 10);

        $response = Inertia::render('Users/Index');
        $table->applyTo($response);

        $props = $this->getProps($response);
        $qb    = $props['queryBuilderProps']['default'];

        $this->assertTrue($qb['hasFilters']);
        $this->assertEquals('number_range', $qb['filters'][0]->getType());
        $this->assertEquals(1000, $qb['filters'][0]->max);
        $this->assertEquals('$', $qb['filters'][0]->prefix);
    }

    public function test_named_table(): void
    {
        $table = $this->createTable();
        $table->name('users');

        $response = Inertia::render('Dashboard');
        $table->applyTo($response);

        $props = $this->getProps($response);

        $this->assertArrayHasKey('users', $props['queryBuilderProps']);
        $this->assertArrayNotHasKey('default', $props['queryBuilderProps']);
    }

    public function test_per_page_options(): void
    {
        $table = $this->createTable();
        $table->perPageOptions([10, 25, 50]);

        $response = Inertia::render('Users/Index');
        $table->applyTo($response);

        $props = $this->getProps($response);
        $qb    = $props['queryBuilderProps']['default'];

        $this->assertEquals([10, 25, 50], $qb['perPageOptions']);
    }

    public function test_default_sort(): void
    {
        $table = $this->createTable();
        $table->defaultSort('name');

        $response = Inertia::render('Users/Index');
        $table->applyTo($response);

        $props = $this->getProps($response);
        $qb    = $props['queryBuilderProps']['default'];

        $this->assertEquals('name', $qb['defaultSort']);
        $this->assertEquals('name', $qb['sort']);
    }

    public function test_searchable_column_creates_search_input(): void
    {
        $table = $this->createTable();
        $table->column(key: 'name', label: 'Name', searchable: true);

        $response = Inertia::render('Users/Index');
        $table->applyTo($response);

        $props = $this->getProps($response);
        $qb    = $props['queryBuilderProps']['default'];

        $this->assertTrue($qb['hasSearchInputs']);
    }

    public function test_default_global_search(): void
    {
        InertiaTable::defaultGlobalSearch('Find...');

        $table = $this->createTable();

        $response = Inertia::render('Users/Index');
        $table->applyTo($response);

        $props = $this->getProps($response);
        $qb    = $props['queryBuilderProps']['default'];

        $this->assertNotNull($qb['globalSearch']);
    }

    public function test_global_search_label_is_null_without_explicit_label(): void
    {
        $table = $this->createTable();
        $table->withGlobalSearch();

        $response = Inertia::render('Users/Index');
        $table->applyTo($response);

        $qb = $this->getProps($response)['queryBuilderProps']['default'];

        $this->assertNull($qb['globalSearch']->label);
        $this->assertNull($qb['globalSearch']->toArray()['label']);
    }

    public function test_global_search_explicit_label_is_sent_unchanged(): void
    {
        $table = $this->createTable();
        $table->withGlobalSearch('Search users...');

        $response = Inertia::render('Users/Index');
        $table->applyTo($response);

        $qb = $this->getProps($response)['queryBuilderProps']['default'];

        $this->assertSame('Search users...', $qb['globalSearch']->label);
    }

    public function test_default_global_search_without_label_sends_null(): void
    {
        foreach ([fn () => InertiaTable::defaultGlobalSearch(), fn () => InertiaTable::defaultGlobalSearch(true)] as $enable) {
            InertiaTable::resetDefaults();
            $enable();

            $table    = $this->createTable();
            $response = Inertia::render('Users/Index');
            $table->applyTo($response);

            $qb = $this->getProps($response)['queryBuilderProps']['default'];

            $this->assertNotNull($qb['globalSearch']);
            $this->assertNull($qb['globalSearch']->label);
        }
    }

    public function test_default_global_search_explicit_label_is_sent(): void
    {
        InertiaTable::defaultGlobalSearch('Find...');

        $table    = $this->createTable();
        $response = Inertia::render('Users/Index');
        $table->applyTo($response);

        $qb = $this->getProps($response)['queryBuilderProps']['default'];

        $this->assertSame('Find...', $qb['globalSearch']->label);
    }

    public function test_default_global_search_false_disables_it(): void
    {
        InertiaTable::defaultGlobalSearch();
        InertiaTable::defaultGlobalSearch(false);

        $table    = $this->createTable();
        $response = Inertia::render('Users/Index');
        $table->applyTo($response);

        $qb = $this->getProps($response)['queryBuilderProps']['default'];

        $this->assertNull($qb['globalSearch']);
    }

    public function test_table_macro_on_inertia_response(): void
    {
        $response = Inertia::render('Users/Index')
            ->table(function (InertiaTable $table) {
                $table->column(key: 'name', label: 'Name', sortable: true)
                    ->withGlobalSearch();
            });

        $props = $this->getProps($response);

        $this->assertArrayHasKey('queryBuilderProps', $props);
        $this->assertNotNull($props['queryBuilderProps']['default']['globalSearch']);
    }

    public function test_column_sorting_from_query_string(): void
    {
        $request = Request::create('/', 'GET', ['sort' => 'name']);
        $table   = new InertiaTable($request);

        $table->column(key: 'name', label: 'Name', sortable: true)
            ->column(key: 'email', label: 'Email', sortable: true);

        $response = Inertia::render('Users/Index');
        $table->applyTo($response);

        $props = $this->getProps($response);
        $qb    = $props['queryBuilderProps']['default'];

        $this->assertEquals('asc', $qb['columns'][0]->sorted);
        $this->assertFalse($qb['columns'][1]->sorted);
    }

    public function test_column_sorting_descending_from_query_string(): void
    {
        $request = Request::create('/', 'GET', ['sort' => '-email']);
        $table   = new InertiaTable($request);

        $table->column(key: 'name', label: 'Name', sortable: true)
            ->column(key: 'email', label: 'Email', sortable: true);

        $response = Inertia::render('Users/Index');
        $table->applyTo($response);

        $props = $this->getProps($response);
        $qb    = $props['queryBuilderProps']['default'];

        $this->assertFalse($qb['columns'][0]->sorted);
        $this->assertEquals('desc', $qb['columns'][1]->sorted);
    }

    public function test_multiple_tables_on_same_page(): void
    {
        $usersTable = $this->createTable();
        $usersTable->name('users')->column(key: 'name', label: 'Name');

        $ordersTable = $this->createTable();
        $ordersTable->name('orders')->column(key: 'total', label: 'Total');

        $response = Inertia::render('Dashboard');
        $usersTable->applyTo($response);
        $ordersTable->applyTo($response);

        $props = $this->getProps($response);

        $this->assertArrayHasKey('users', $props['queryBuilderProps']);
        $this->assertArrayHasKey('orders', $props['queryBuilderProps']);
    }

    public function test_filter_value_from_query_string(): void
    {
        $request = Request::create('/', 'GET', ['filter' => ['status' => 'active']]);
        $table   = new InertiaTable($request);

        $table->selectFilter('status', ['active' => 'Active', 'inactive' => 'Inactive']);

        $response = Inertia::render('Users/Index');
        $table->applyTo($response);

        $props = $this->getProps($response);
        $qb    = $props['queryBuilderProps']['default'];

        $this->assertEquals('active', $qb['filters'][0]->getValue());
        $this->assertTrue($qb['hasEnabledFilters']);
    }

    public function test_select_filter_array_value_from_query_string_does_not_throw(): void
    {
        $request = Request::create('/', 'GET', ['filter' => ['status' => ['active', 'inactive']]]);
        $table   = new InertiaTable($request);

        $table->selectFilter('status', ['active' => 'Active', 'inactive' => 'Inactive']);

        $response = Inertia::render('Users/Index');
        $table->applyTo($response);

        $props = $this->getProps($response);
        $qb    = $props['queryBuilderProps']['default'];

        $this->assertNull($qb['filters'][0]->getValue());
    }

    public function test_search_value_from_query_string(): void
    {
        $request = Request::create('/', 'GET', ['filter' => ['global' => 'john']]);
        $table   = new InertiaTable($request);

        $table->withGlobalSearch();

        $response = Inertia::render('Users/Index');
        $table->applyTo($response);

        $props = $this->getProps($response);
        $qb    = $props['queryBuilderProps']['default'];

        $this->assertEquals('john', $qb['globalSearch']->value);
    }

    public function test_table_with_date_range_filter(): void
    {
        $table = $this->createTable();
        $table->dateRangeFilter(
            'created_at',
            label: 'Created At',
            minDate: '2020-01-01',
            maxDate: '2025-12-31',
        );

        $response = Inertia::render('Users/Index');
        $table->applyTo($response);

        $props = $this->getProps($response);
        $qb    = $props['queryBuilderProps']['default'];

        $this->assertTrue($qb['hasFilters']);
        $this->assertEquals('date_range', $qb['filters'][0]->getType());
        $this->assertEquals('Created At', $qb['filters'][0]->label);
    }

    public function test_date_range_filter_value_from_query_string(): void
    {
        $request = Request::create('/', 'GET', [
            'filter' => ['created_at' => ['2024-01-01', '2024-06-30']],
        ]);
        $table = new InertiaTable($request);

        $table->dateRangeFilter('created_at', label: 'Created At');

        $response = Inertia::render('Users/Index');
        $table->applyTo($response);

        $props = $this->getProps($response);
        $qb    = $props['queryBuilderProps']['default'];

        $this->assertEquals(['2024-01-01', '2024-06-30'], $qb['filters'][0]->getValue());
        $this->assertTrue($qb['hasEnabledFilters']);
    }

    public function test_table_with_multi_select_filter(): void
    {
        $table = $this->createTable();
        $table->multiSelectFilter('tags', [
            'php' => 'PHP',
            'js'  => 'JavaScript',
            'vue' => 'Vue',
        ], 'Tags');

        $response = Inertia::render('Users/Index');
        $table->applyTo($response);

        $props = $this->getProps($response);
        $qb    = $props['queryBuilderProps']['default'];

        $this->assertTrue($qb['hasFilters']);
        $this->assertEquals('multi_select', $qb['filters'][0]->getType());
    }

    public function test_multi_select_filter_value_from_query_string(): void
    {
        $request = Request::create('/', 'GET', [
            'filter' => ['tags' => ['php', 'vue']],
        ]);
        $table = new InertiaTable($request);

        $table->multiSelectFilter('tags', ['php' => 'PHP', 'js' => 'JS', 'vue' => 'Vue']);

        $response = Inertia::render('Users/Index');
        $table->applyTo($response);

        $props = $this->getProps($response);
        $qb    = $props['queryBuilderProps']['default'];

        $this->assertEquals(['php', 'vue'], $qb['filters'][0]->getValue());
        $this->assertTrue($qb['hasEnabledFilters']);
    }

    public function test_per_page_returns_valid_value_from_options(): void
    {
        $this->assertSame(50, InertiaTable::perPage(Request::create('/', 'GET', ['perPage' => '50'])));
    }

    public function test_per_page_reads_prefixed_param_for_named_table(): void
    {
        $request = Request::create('/', 'GET', ['users_perPage' => '50', 'posts_perPage' => '30']);

        $this->assertSame(50, InertiaTable::perPage($request, [15, 30, 50], name: 'users'));
        $this->assertSame(30, InertiaTable::perPage($request, [15, 30, 50], name: 'posts'));
        $this->assertSame(15, InertiaTable::perPage($request, [15, 30, 50]));
    }

    public function test_per_page_named_table_prefers_prefixed_over_plain(): void
    {
        $request = Request::create('/', 'GET', ['perPage' => '30', 'users_perPage' => '50']);

        $this->assertSame(50, InertiaTable::perPage($request, [15, 30, 50], name: 'users'));
    }

    public function test_per_page_named_table_falls_back_to_plain_param(): void
    {
        $request = Request::create('/', 'GET', ['perPage' => '30']);

        $this->assertSame(30, InertiaTable::perPage($request, [15, 30, 50], name: 'users'));
    }

    public function test_per_page_named_table_validates_prefixed_value(): void
    {
        foreach (['-1', '0', 'abc', '20', '100000'] as $value) {
            $request = Request::create('/', 'GET', ['users_perPage' => $value]);
            $this->assertSame(15, InertiaTable::perPage($request, name: 'users'), "value: {$value}");
        }

        $this->assertSame(15, InertiaTable::perPage(Request::create('/', 'GET', ['users_perPage' => ['15']]), name: 'users'));
    }

    public function test_per_page_default_table_ignores_prefixed_param(): void
    {
        $request = Request::create('/', 'GET', ['users_perPage' => '50']);

        $this->assertSame(15, InertiaTable::perPage($request));
    }

    public function test_per_page_falls_back_for_invalid_values(): void
    {
        foreach (['-1', '0', 'abc', '15.5', '20', '', '100000'] as $value) {
            $this->assertSame(15, InertiaTable::perPage(Request::create('/', 'GET', ['perPage' => $value])), "value: {$value}");
        }
    }

    public function test_per_page_falls_back_for_array_value(): void
    {
        $this->assertSame(15, InertiaTable::perPage(Request::create('/', 'GET', ['perPage' => ['15']])));
    }

    public function test_per_page_falls_back_when_param_is_missing(): void
    {
        $this->assertSame(15, InertiaTable::perPage(Request::create('/')));
    }

    public function test_per_page_supports_custom_options_and_default(): void
    {
        $request = Request::create('/', 'GET', ['perPage' => '25']);

        $this->assertSame(25, InertiaTable::perPage($request, [10, 25]));
        $this->assertSame(10, InertiaTable::perPage(Request::create('/', 'GET', ['perPage' => '15']), [10, 25]));
        $this->assertSame(25, InertiaTable::perPage(Request::create('/', 'GET', ['perPage' => '15']), [10, 25], 25));
    }

    public function test_per_page_ignores_prefixed_param(): void
    {
        $request = Request::create('/', 'GET', ['perPage' => '30', 'users_perPage' => '100']);

        $this->assertSame(30, InertiaTable::perPage($request));
        $this->assertSame(15, InertiaTable::perPage(Request::create('/', 'GET', ['users_perPage' => '100'])));
    }

    public function test_per_page_uses_current_request_when_none_given(): void
    {
        $this->app->instance('request', Request::create('/', 'GET', ['perPage' => '30']));

        $this->assertSame(30, InertiaTable::perPage());
    }

    public function test_per_page_throws_for_empty_options(): void
    {
        $this->expectException(\InvalidArgumentException::class);

        InertiaTable::perPage(Request::create('/'), []);
    }
}
