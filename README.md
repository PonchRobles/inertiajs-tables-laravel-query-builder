# Inertia.js Tables for Laravel Query Builder

[![Latest Version on NPM](https://img.shields.io/npm/v/@ponchrobles_/inertiajs-tables-laravel-query-builder.svg?style=flat-square)](https://npmjs.com/package/@ponchrobles_/inertiajs-tables-laravel-query-builder)
[![npm](https://img.shields.io/npm/dt/@ponchrobles_/inertiajs-tables-laravel-query-builder.svg?style=flat-square)](https://www.npmjs.com/package/@ponchrobles_/inertiajs-tables-laravel-query-builder)
[![Latest Version on Packagist](https://img.shields.io/packagist/v/ponchrobles/inertiajs-tables-laravel-query-builder.svg?style=flat-square)](https://packagist.org/packages/ponchrobles/inertiajs-tables-laravel-query-builder)
[![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE)

A *DataTables-like* experience for [Inertia.js](https://inertiajs.com/) and Vue 3, with searching, filtering, sorting, column toggling and pagination. The table talks to your Laravel backend through the query string, in the format that Spatie's [Laravel Query Builder](https://github.com/spatie/laravel-query-builder) already understands, so no extra request-parsing logic is needed. It is styled with [Tailwind CSS](https://tailwindcss.com/) (v3) and everything can be replaced through slots or theme overrides.

> **Fork note.** This package is a maintained fork of [protonemedia/inertiajs-tables-laravel-query-builder](https://github.com/protonemedia/inertiajs-tables-laravel-query-builder), published under the `ponchrobles` namespace. See the [fork reason](https://github.com/protonemedia/inertiajs-tables-laravel-query-builder/issues/122). The data refresh logic is based on Inertia's [Ping CRM demo](https://github.com/inertiajs/pingcrm).

![Inertia.js Table for Laravel Query Builder](https://user-images.githubusercontent.com/8403149/177773377-86c32d69-8f86-47e4-8063-ea227e480d10.mp4)

## Table of contents

- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Quick start](#quick-start)
- [How it works](#how-it-works)
- [Server-side guide](#server-side-guide)
- [Client-side guide](#client-side-guide)
- [Customization reference](#customization-reference)
- [Local demo](#local-demo)
- [Testing](#testing)
- [Upgrading](#upgrading)
- [Changelog](#changelog), [Contributing](#contributing), [Security](#security), [Credits](#credits), [License](#license)

## Features

- Auto-fill: generates the `thead` and `tbody` for you, with support for custom cells and headers
- Global search and search per field
- Select, multi-select, toggle (boolean), number range and date range filters
- Toggle columns, sort columns (with optional NULLs-last sorting)
- Pagination with a validated per-page selector (Eloquent, API Resource, simple and cursor paginators)
- Several named tables on one page, each with its own query-string keys
- Updates the query string through Inertia's [`replace`](https://inertiajs.com/manual-visits#browser-history) visits, so URLs are shareable
- Runtime-switchable translations
- Theme overrides and slots for full customization
- TypeScript type definitions

## Requirements

| Dependency | Version |
| ---------- | ------- |
| PHP | 8.2 or higher (`^8.2`) |
| Laravel (`illuminate/support`) | 11, 12 or 13 |
| [Inertia Laravel adapter](https://inertiajs.com/server-side-setup) (`inertiajs/inertia-laravel`) | 1, 2 or 3 |
| [Spatie Laravel Query Builder](https://github.com/spatie/laravel-query-builder) | 6 or 7 |
| [`@inertiajs/vue3`](https://inertiajs.com/) | `^1.0.16`, 2 or 3 |
| [Vue](https://vuejs.org/) | `^3.4.0` |
| [`tailwind-merge`](https://github.com/dcastil/tailwind-merge) | `^2.2.0` or 3 |
| [Tailwind CSS](https://tailwindcss.com/) | v3, with the [Forms plugin](https://github.com/tailwindlabs/tailwindcss-forms) |

The Composer package is `ponchrobles/inertiajs-tables-laravel-query-builder` and the npm package is `@ponchrobles_/inertiajs-tables-laravel-query-builder`.

## Installation

You need to install both the server-side (Composer) and the client-side (npm) package. Inertia (server and client), Spatie's Query Builder, Vue 3 and Tailwind CSS 3 with the Forms plugin are expected to be set up in your application already.

### Server-side (Laravel)

```bash
composer require ponchrobles/inertiajs-tables-laravel-query-builder
```

The service provider is auto-discovered. It adds two macros to the `Inertia\Response` class: `table()` (configures a table) and `getQueryBuilderProps()`.

The package itself only requires `illuminate/support`. Make sure `inertiajs/inertia-laravel` and `spatie/laravel-query-builder` are installed in your application:

```bash
composer require inertiajs/inertia-laravel spatie/laravel-query-builder
```

### Client-side (Inertia + Vue)

```bash
npm install @ponchrobles_/inertiajs-tables-laravel-query-builder tailwind-merge
# or
yarn add @ponchrobles_/inertiajs-tables-laravel-query-builder tailwind-merge
```

`@inertiajs/vue3`, `vue` and `tailwind-merge` are peer dependencies.

**Tailwind content.** Add the package to the `content` array of your [Tailwind configuration](https://tailwindcss.com/docs/content-configuration) so its classes survive production builds, and enable the Forms plugin:

```js
// tailwind.config.js
import forms from "@tailwindcss/forms";

export default {
    content: [
        "./resources/js/**/*.{js,vue}",
        "./node_modules/@ponchrobles_/inertiajs-tables-laravel-query-builder/**/*.{js,vue}",
    ],
    plugins: [forms],
};
```

**Importing components.** There is no global plugin to register. Import what you need from the package, wherever you use it:

```js
import { Table } from "@ponchrobles_/inertiajs-tables-laravel-query-builder";
```

Besides `Table`, the package exports its building blocks (`ButtonWithDropdown`, `GroupedActions`, `HeaderCell`, `OnClickOutside`, `Pagination`, `PerPageSelector`, `TableAddSearchRow`, `TableColumns`, `TableFilter`, `TableGlobalSearch`, `TableReset`, `TableSearchRows`, `TableWrapper`, `ToggleSwitch`) and the translation helpers `getTranslations`, `setTranslation` and `setTranslations`.

**App setup.** The standard Inertia `createInertiaApp` setup is enough. Optionally, call `setTranslations()` once at startup (see [Translations](#translations)) and provide theme overrides (see [Customization reference](#customization-reference)):

```js
import { createApp, h } from "vue";
import { createInertiaApp } from "@inertiajs/vue3";

const pages = import.meta.glob("./Pages/**/*.vue", { eager: true });

createInertiaApp({
    resolve: (name) => pages[`./Pages/${name}.vue`],
    setup({ el, App, props, plugin }) {
        createApp({ render: () => h(App, props) })
            .use(plugin)
            // .provide("themeVariables", themeVariables) // optional
            .mount(el);
    },
});
```

## Quick start

A minimal table, end to end.

**Controller:**

```php
<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use PonchRobles\InertiaTable\InertiaTable;
use Spatie\QueryBuilder\QueryBuilder;

class UserIndexController
{
    public function __invoke()
    {
        $users = QueryBuilder::for(User::class)
            ->defaultSort('name')
            ->allowedSorts(['name', 'email'])
            ->allowedFilters(['name', 'email'])
            ->paginate(InertiaTable::perPage())
            ->withQueryString();

        return Inertia::render('Users/Index', ['users' => $users])
            ->table(function (InertiaTable $table) {
                $table
                    ->defaultSort('name')
                    ->column(key: 'name', searchable: true, sortable: true, canBeHidden: false)
                    ->column(key: 'email', searchable: true, sortable: true);
            });
    }
}
```

**Vue page** (`resources/js/Pages/Users/Index.vue`):

```vue
<script setup>
import { Table } from "@ponchrobles_/inertiajs-tables-laravel-query-builder";

defineProps(["users"]);
</script>

<template>
  <Table :resource="users" />
</template>
```

That is all: the table renders the columns, a per-field search for `name` and `email`, sortable headers, a column toggle and pagination. Everything you do in the UI is reflected in the query string and re-applied by the Query Builder on the next request.

## How it works

1. **The controller describes the table.** `Inertia::render(...)->table(fn (InertiaTable $table) => ...)` builds a `queryBuilderProps` prop containing, per table name, the columns, filters, search inputs, sort, page name and per-page options. It also reads the current query string, so the props echo the current state (the active sort direction, filter values, search values and hidden columns).
2. **The Query Builder does the querying.** Your own `QueryBuilder::for(...)` call reads the same query-string keys (`filter`, `sort`, ...) and returns the paginated data. The table configuration does *not* restrict the query: `allowedSorts()` and `allowedFilters()` stay the source of truth for what the database accepts.
3. **The `Table` component renders and drives the state.** It reads `page.props.queryBuilderProps[name]` (`name` defaults to `default`) and the rows from its `resource` (or `data` and `meta`) prop.
4. **User input becomes a query string.** When the user types, picks a filter, sorts, toggles a column, changes the page or the per-page value, the component updates its internal state and, after a debounce for text inputs (`inputDebounceMs`, 350 ms by default), issues `router.get(url, {}, { replace: true, preserveState: true })` through Inertia. Unrelated query parameters are preserved. Empty values, the default column visibility and a number range covering its full range are omitted from the URL.

The query string of a default table looks like this:

```
/users?filter[name]=jane&filter[language_code]=en&sort=-email&columns[]=name&page=2&perPage=30
```

| Key | Meaning |
| --- | ------- |
| `filter[<key>]` | Search inputs and filters. Multi-select and range filters use an array (`filter[brand][]=a&filter[brand][]=b`, `filter[price][]=10&filter[price][]=50`). |
| `sort` | Column key, prefixed with `-` for descending. |
| `columns[]` | The visible columns, only present when it differs from the default visibility. |
| `cursor` | Cursor of a cursor paginator. |
| `page` | The page (the key is the table's `pageName`). |
| `perPage` | Rows per page. |

### Named tables and query-key prefixes

A table has a `name` (`default` unless you change it). For the `default` table the keys above are used as is. For a named table, every key except the page key is prefixed with `{name}_`: `users_filter[name]=...`, `users_sort=-name`, `users_columns[]=...`, `users_cursor`, `users_perPage`. The page key is the table's `pageName` (`page` by default), which you should also set per table.

For the Query Builder to read the prefixed keys, call `InertiaTable::updateQueryBuilderParameters('users')` before building that table's query. See [Multiple tables per page](#multiple-tables-per-page).

## Server-side guide

All configuration happens in the callback of `->table()`, which receives an `InertiaTable` instance. Every method returns the instance, so calls can be chained, and re-declaring a column, search input or filter with the same key replaces the previous one.

```php
use PonchRobles\InertiaTable\InertiaTable;

Inertia::render('Page/Index', ['items' => $items])->table(function (InertiaTable $table) {
    // ...
});
```

You can call `->table()` several times on the same response to register several tables (see [Multiple tables per page](#multiple-tables-per-page)).

### Columns

```php
column(
    ?string $key = null,
    ?string $label = null,
    bool $canBeHidden = true,
    bool $hidden = false,
    bool $sortable = false,
    bool $searchable = false,
    bool $nullsLast = false,
): self
```

You must pass a key or a label. A missing key is derived from the label (`Str::kebab`) and a missing label from the key (`Str::headline`).

```php
$table->column('name', 'User Name');

$table->column(
    key: 'name',
    label: 'User Name',
    canBeHidden: true, // appears in the "Show / Hide columns" menu
    hidden: false,     // initially hidden
    sortable: true,
    searchable: true,  // shortcut for $table->searchInput('name', 'User Name')
    nullsLast: false,  // see "Sorting NULLs last"
);
```

Hiding a column only hides it in the browser: the data is still sent. The visible columns are kept in the `columns` query key.

### Sorting

Mark columns as `sortable: true` and allow them on the Query Builder. Clicking a header sorts ascending, clicking it again sorts descending (`sort=-name`).

```php
$users = QueryBuilder::for(User::class)
    ->defaultSort('name')
    ->allowedSorts(['name', 'email']);

$table->defaultSort('name')->column('name', sortable: true);
```

`defaultSort(string)` tells the frontend which sort applies when no `sort` is in the URL. Use the same value in `QueryBuilder::defaultSort()`.

#### Sorting NULLs last

Pass `nullsLast: true` to a sortable column and use the `SortsNullsLast` helper for the Spatie sort, so rows with a `NULL` value always come last, whatever the sort direction:

```php
use PonchRobles\InertiaTable\QueryBuilderSorts\SortsNullsLast;

$users = QueryBuilder::for(User::class)
    ->allowedSorts(
        SortsNullsLast::getQueryBuilderSort('last_login_at'),
        SortsNullsLast::getQueryBuilderSort('name', 'users.name'), // sort name, database column
        'email', // columns without the helper behave as before
    )
    ->paginate();

Inertia::render('Users/Index', ['users' => $users])->table(function (InertiaTable $table) {
    $table->column('last_login_at', sortable: true, nullsLast: true);
});
```

The server-side sorting is done **only** by `SortsNullsLast`: the `nullsLast` column option does not change the query by itself, it is exposed to the frontend as `nulls_last` in the column props. The helper orders by `column IS NULL` and then by the column, which works on MySQL, PostgreSQL and SQLite (no `NULLS LAST` syntax). The column name comes from your `allowedSorts` definition, never from the request, and is quoted by the query grammar.

### Search fields

```php
searchInput(string $key, ?string $label = null, ?string $defaultValue = null): self
```

A search field renders a text input (added through the "Add search field" menu) and sends `filter[<key>]=<text>`. It needs a matching allowed filter on the Query Builder (a plain column name does a partial match).

```php
$table->searchInput('name');

$table->searchInput(
    key: 'framework',
    label: 'Find your framework',
    defaultValue: 'Laravel',
);
```

`column(..., searchable: true)` is a shortcut for `searchInput($key, $label)`.

### Global search

```php
withGlobalSearch(?string $label = null): self
InertiaTable::defaultGlobalSearch(bool|string $label = true): void
```

Global search adds one input above the table that sends `filter[global]=<text>`. You must define the `global` filter yourself:

```php
use Illuminate\Support\Collection;
use Spatie\QueryBuilder\AllowedFilter;

$globalSearch = AllowedFilter::callback('global', function ($query, $value) {
    $query->where(function ($query) use ($value) {
        Collection::wrap($value)->each(function ($value) use ($query) {
            $query
                ->orWhere('name', 'LIKE', "%{$value}%")
                ->orWhere('email', 'LIKE', "%{$value}%");
        });
    });
});

$users = QueryBuilder::for(User::class)->allowedFilters(['name', 'email', $globalSearch]);

$table->withGlobalSearch();                              // placeholder from the `search` translation
$table->withGlobalSearch('Search through the data...');  // explicit placeholder
```

Without a label the backend sends `null` and the frontend uses its `search` translation (`"Search..."` by default), which you can change with `setTranslations({ search: "..." })`. An explicit label always wins. Laravel's `__()` is not applied to it for you.

To enable global search for every table, call the static method once, for example in `AppServiceProvider::boot()`:

```php
InertiaTable::defaultGlobalSearch();                       // enabled, placeholder from the `search` translation
InertiaTable::defaultGlobalSearch('Default placeholder');  // enabled with a label (passed through __())
InertiaTable::defaultGlobalSearch(false);                  // disabled (the default)
```

### Select filters

A `select` element with a predefined set of options. It sends `filter[<key>]=<option key>` and works with Spatie's built-in filters.

```php
selectFilter(
    string $key,
    array $options,
    ?string $label = null,
    ?string $defaultValue = null,
    bool $noFilterOption = true,
    ?string $noFilterOptionLabel = null,
): self
```

```php
$table->selectFilter('language_code', [
    'en' => 'English',
    'nl' => 'Dutch',
]);

$table->selectFilter(
    key: 'language_code',
    options: $languages,
    label: 'Language',
    defaultValue: 'nl',
    noFilterOption: true,
    noFilterOptionLabel: 'All languages', // defaults to "-"
);
```

With `noFilterOption: true` (default) an empty option is prepended so the user can clear the filter. Allow the filter on the Query Builder, for example with `AllowedFilter::exact('language_code')`.

### Toggle (boolean) filters

A toggle switch that sends `filter[<key>]=1` or `filter[<key>]=0`. Its value is `null` while unset.

```php
toggleFilter(string $key, ?string $label = null, ?bool $defaultValue = null): self
```

```php
$table->toggleFilter('is_verified');

$table->toggleFilter(key: 'is_verified', label: 'Is email verified', defaultValue: true);
```

Allow it with `AllowedFilter::exact('is_verified')`.

### Number range filters

A two-handle slider. The filter is not sent while the handles cover the full `min` to `max` range.

```php
numberRangeFilter(
    string $key,
    float $max,
    float $min = 0,
    string $prefix = '',
    string $suffix = '',
    float $step = 1,
    ?string $label = null,
    ?array $defaultValue = null,
): self
```

```php
use PonchRobles\InertiaTable\Filters\NumberRangeFilter;

$table->numberRangeFilter('invoice_recall_count', max: 5);

$table->numberRangeFilter(
    key: 'price',
    max: 1000,
    min: 0,
    prefix: '$',
    suffix: '',
    step: 1,
    label: 'Price',
    defaultValue: [100, 400],
);

$query->allowedFilters([NumberRangeFilter::getQueryBuilderFilter('price')]);
```

The custom filter runs a `whereBetween` with the two numeric values (in either order) and ignores the value unless it holds two numeric entries.

### Multi-select filters

A dropdown that supports selecting several options at once (with "Select all" and "Clear selection" actions). The custom filter runs a `whereIn` against the column, so it is meant for scalar columns (`category`, `status`), not JSON or array columns.

```php
multiSelectFilter(
    string $key,
    array $options,
    ?string $label = null,
    ?array $defaultValue = null,
    bool $noFilterOption = true,
    ?string $noFilterOptionLabel = null,
): self
```

```php
use PonchRobles\InertiaTable\Filters\MultiSelectFilter;

$table->multiSelectFilter('category', [
    'laravel' => 'Laravel',
    'vue'     => 'Vue',
    'devops'  => 'DevOps',
]);

$table->multiSelectFilter(
    key: 'category',
    options: $categories,
    label: 'Categories',
    defaultValue: ['laravel', 'vue'],
);

$posts = QueryBuilder::for(Post::class)
    ->allowedFilters([MultiSelectFilter::getQueryBuilderFilter('category')]);
```

The options are sent to the frontend exactly as you pass them (a key-value array), in that order. There is no separate ordering option. `noFilterOption` and `noFilterOptionLabel` are accepted for signature parity with `selectFilter` but do not change the data sent for a multi-select filter. Option values that contain the Query Builder delimiter (`,` by default) are rejoined by the filter so they match the literal value.

### Date range filters

Two native date inputs (start and end). The custom filter runs `whereBetween` from the start of the first day to the end of the last day, so it suits `date`, `datetime` and `timestamp` columns. It is ignored unless both dates are present and parseable.

```php
dateRangeFilter(
    string $key,
    ?string $label = null,
    ?array $defaultValue = null,   // [start, end]
    ?string $minDate = null,
    ?string $maxDate = null,
    string $format = 'Y-m-d',
): self
```

```php
use PonchRobles\InertiaTable\Filters\DateRangeFilter;

$table->dateRangeFilter('published_at');

$table->dateRangeFilter(
    key: 'published_at',
    label: 'Published between',
    defaultValue: ['2026-01-01', '2026-12-31'],
    minDate: '2020-01-01',
    maxDate: now()->toDateString(),
    format: 'Y-m-d',
);

$posts = QueryBuilder::for(Post::class)
    ->allowedFilters([DateRangeFilter::getQueryBuilderFilter('published_at')]);
```

`minDate` and `maxDate` become the `min` and `max` of the date inputs. `format` is passed to the frontend as `format` in the filter data; the built-in inputs are native `type="date"` inputs and do not use it.

### Pagination and the per-page value

`perPageOptions(array)` sets the options of the per-page selector (default `[15, 30, 50, 100]`, also available as `InertiaTable::DEFAULT_PER_PAGE_OPTIONS`). The chosen value arrives in the `perPage` query parameter, which comes from the user: never pass it straight to `paginate()`. Use the static `InertiaTable::perPage()` helper, which only returns an allowed value:

```php
InertiaTable::perPage(
    ?Request $request = null,           // defaults to the current request
    array $options = [15, 30, 50, 100], // allowed values
    ?int $default = null,               // fallback, defaults to the first option
    ?string $name = null,               // table name, see below
): int
```

- Only whole positive numbers present in `$options` are accepted. `-1`, `0`, `abc`, `15.5` and values not in the options fall back to `$default ?? $options[0]`.
- The default table reads `perPage`. A named table reads `{name}_perPage`, so several tables keep independent values: `InertiaTable::perPage(name: 'users')`.
- **Deprecated:** if `{name}_perPage` is absent, the helper falls back to the unprefixed `perPage` so existing URLs keep working. This fallback will be removed in the next release.
- An empty `$options` array throws an `InvalidArgumentException`.
- Keep the options in sync with the frontend:

```php
$users = QueryBuilder::for(User::class)
    ->paginate(InertiaTable::perPage(options: [10, 25, 50], default: 25))
    ->withQueryString();

$table->perPageOptions([10, 25, 50]);
```

`pageName(string)` sets the paginator page key for a table (default `page`); pass the same name to `paginate(pageName: ...)`. The `Table` component supports Eloquent, API Resource, simple and cursor paginators.

### Multiple tables per page

Name every table and give each its own page name. On the Query Builder side, call `InertiaTable::updateQueryBuilderParameters($name)` right before building that table's query: it prefixes the parameter names in Spatie's `query-builder.parameters` config (`filter` becomes `companies_filter`, `sort` becomes `companies_sort`, and so on).

```php
InertiaTable::updateQueryBuilderParameters('companies');

$companies = QueryBuilder::for(Company::query())
    ->defaultSort('name')
    ->allowedSorts(['name', 'email'])
    ->allowedFilters(['name', 'email'])
    ->paginate(InertiaTable::perPage(name: 'companies'), pageName: 'companiesPage')
    ->withQueryString();

InertiaTable::updateQueryBuilderParameters('users');

$users = QueryBuilder::for(User::query())
    ->defaultSort('name')
    ->allowedSorts(['name', 'email'])
    ->allowedFilters(['name', 'email'])
    ->paginate(InertiaTable::perPage(name: 'users'), pageName: 'usersPage')
    ->withQueryString();

return Inertia::render('TwoTables', [
    'companies' => $companies,
    'users'     => $users,
])->table(function (InertiaTable $table) {
    $table
        ->name('users')
        ->pageName('usersPage')
        ->defaultSort('name')
        ->column(key: 'name', searchable: true)
        ->column(key: 'email', searchable: true);
})->table(function (InertiaTable $table) {
    $table
        ->name('companies')
        ->pageName('companiesPage')
        ->defaultSort('name')
        ->column(key: 'name', searchable: true)
        ->column(key: 'address', searchable: true);
});
```

Then pass the matching `name` to each `Table` in the page (see [Multiple tables](#multiple-tables)). A complete example lives in the demo: `twoTables()` in `workbench/app/Http/Controllers/ProductController.php`.

### Complete example

```php
public function __invoke()
{
    $globalSearch = AllowedFilter::callback('global', function ($query, $value) {
        $query->where(function ($query) use ($value) {
            Collection::wrap($value)->each(fn ($term) => $query
                ->orWhere('name', 'LIKE', "%{$term}%")
                ->orWhere('email', 'LIKE', "%{$term}%"));
        });
    });

    $users = QueryBuilder::for(User::class)
        ->defaultSort('name')
        ->allowedSorts(['name', 'email', SortsNullsLast::getQueryBuilderSort('last_login_at')])
        ->allowedFilters([
            'name',
            'email',
            $globalSearch,
            AllowedFilter::exact('language_code'),
            AllowedFilter::exact('is_verified'),
            MultiSelectFilter::getQueryBuilderFilter('role'),
            NumberRangeFilter::getQueryBuilderFilter('invoice_recall_count'),
            DateRangeFilter::getQueryBuilderFilter('created_at'),
        ])
        ->paginate(InertiaTable::perPage())
        ->withQueryString();

    return Inertia::render('Users/Index', ['users' => $users])
        ->table(function (InertiaTable $table) {
            $table
                ->withGlobalSearch()
                ->defaultSort('name')
                ->column(key: 'name', searchable: true, sortable: true, canBeHidden: false)
                ->column(key: 'email', searchable: true, sortable: true)
                ->column(key: 'last_login_at', sortable: true, nullsLast: true)
                ->column(label: 'Actions')
                ->selectFilter(key: 'language_code', label: 'Language', options: ['en' => 'English', 'nl' => 'Dutch'])
                ->toggleFilter(key: 'is_verified', label: 'Verified')
                ->multiSelectFilter(key: 'role', options: ['admin' => 'Admin', 'editor' => 'Editor'])
                ->numberRangeFilter(key: 'invoice_recall_count', max: 5)
                ->dateRangeFilter(key: 'created_at');
        });
}
```

## Client-side guide

### The `Table` component

```vue
<script setup>
import { Table } from "@ponchrobles_/inertiajs-tables-laravel-query-builder";

defineProps(["users"]);
</script>

<template>
  <Table :resource="users" />
</template>
```

The `resource` prop accepts the paginator result and detects the rows and the pagination meta (including API Resources with `data`, `links` and `meta`). Alternatively pass them explicitly with `data` and `meta`:

```vue
<Table :data="users.data" :meta="users.meta" />
```

#### Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `resource` | Object | `{}` | A paginator result. Rows and meta are detected automatically. |
| `data` | Object/Array | `{}` | The rows, when not using `resource`. |
| `meta` | Object | `{}` | The pagination meta, when not using `resource`. |
| `name` | String | `"default"` | Table name. Must match the server-side `->name()`. |
| `striped` | Boolean | `false` | Adds a striped layout. |
| `preventOverlappingRequests` | Boolean | `true` | Cancels a previous visit on new input to avoid an inconsistent state. |
| `inputDebounceMs` | Number | `350` | Milliseconds to wait before refreshing on text input. |
| `preserveScroll` | Boolean/String | `false` | Inertia [scroll preservation](https://inertiajs.com/scroll-management#scroll-preservation). Pass `"table-top"` to scroll to the top of the table when new data arrives. |
| `withGroupedMenu` | Boolean | `false` | Replaces the separate add-search, toggle-columns and reset buttons with one grouped menu (`GroupedActions`). |
| `color` | String | `"primary"` | Name of the color variant used when resolving theme classes. |
| `ui` | Object | `undefined` | Per-instance theme overrides, see [Customization reference](#customization-reference). |

The component also declares an `inertia` prop (object, default `{}`), which is part of the type definitions but has no effect on rendering.

#### Events

| Event | Arguments | Description |
| ----- | --------- | ----------- |
| `rowClicked` | `(event, item, key)` | Fired when a row is clicked. `item` is the row, `key` its index. If a row contains clickable elements (an action button), call `event.stopPropagation()` on them. |

```vue
<Table :resource="users" @row-clicked="(event, user) => openUser(user)" />
```

#### Custom column cells

Use a `cell(<column key>)` slot to render a column yourself while the others stay untouched. The slot receives `item` (the row).

```vue
<Table :resource="users">
  <template #cell(actions)="{ item: user }">
    <a :href="`/users/${user.id}/edit`">Edit</a>
  </template>
</Table>
```

#### Custom header cells

Use a `header(<column key>)` slot. It receives `label` and `column` (the column data, including `sortable`, `sorted` and `onSort`).

```vue
<Table :resource="users">
  <template #header(email)="{ label }">
    <span class="lowercase">{{ label }}</span>
  </template>
</Table>
```

#### Rendering the table manually

Use the `head` and `body` slots (`head` receives `show`, `sortBy` and `header`; `body` receives `show`) and keep passing `meta` for the paginator. When you provide your own `head` or `body`, you provide the styling yourself.

```vue
<Table :meta="users">
  <template #head>
    <tr><th>User</th></tr>
  </template>

  <template #body>
    <tr v-for="(user, key) in users.data" :key="key">
      <td>{{ user.name }}</td>
    </tr>
  </template>
</Table>
```

#### Slots

Each slot can be overridden. Slot props are camelCase inside the template (`#tableFilter="{ hasFilters, onFilterChange }"`).

| Slot | Slot props | Description |
| ---- | ---------- | ----------- |
| `tableGlobalSearch` | `hasGlobalSearch`, `label`, `value`, `onChange` | The global search input. |
| `tableFilter` | `hasFilters`, `hasEnabledFilters`, `filters`, `onFilterChange` | The filters button and dropdown. |
| `tableAddSearchRow` | `hasSearchInputs`, `hasSearchInputsWithoutValue`, `searchInputs`, `onAdd` | The "add search field" button. Not rendered with `withGroupedMenu`. |
| `tableColumns` | `hasColumns`, `columns`, `hasHiddenColumns`, `onChange` | The "show / hide columns" button. Not rendered with `withGroupedMenu`. |
| `groupedAction` | `actions` | The grouped menu. Only with `withGroupedMenu`. |
| `tableReset` | `canBeReset`, `onClick` | The reset button. Not rendered with `withGroupedMenu`. |
| `tableSearchRows` | `hasSearchRowsWithValue`, `searchInputs`, `forcedVisibleSearchInputs`, `onChange` | The additional search rows. |
| `tableWrapper` | `meta` | Wraps the table and the paginator (overflow, shadow, padding). |
| `table` | none | The `<table>` element itself. |
| `head` | `show`, `sortBy`, `header` | The table header contents. |
| `header(<key>)` | `label`, `column` | A single header cell label. |
| `body` | `show` | The table body contents. |
| `cell(<key>)` | `item` | A single cell. |
| `empty` | none | Content of the "no results" row. Defaults to the `no_results_found` translation. |
| `pagination` | `onClick`, `hasData`, `meta`, `perPageOptions`, `onPerPageChange` | The paginator. |

```vue
<Table :resource="users">
  <template #tableGlobalSearch="{ onChange }">
    <input
      placeholder="Custom global search..."
      @input="onChange($event.target.value)"
    />
  </template>
</Table>
```

### Multiple tables

Give each table its server-side name. `preserve-scroll="table-top"` scrolls to the top of the table that changed, rather than the top of the page.

```vue
<script setup>
import { Table } from "@ponchrobles_/inertiajs-tables-laravel-query-builder";

defineProps(["companies", "users"]);
</script>

<template>
  <Table :resource="companies" name="companies" preserve-scroll="table-top" />
  <Table :resource="users" name="users" preserve-scroll="table-top" />
</template>
```

### Translations

All texts rendered by the package come from a single reactive object. Override them with `setTranslations` (for example in your main JavaScript file):

```js
import { setTranslations } from "@ponchrobles_/inertiajs-tables-laravel-query-builder";

setTranslations({
    next: "Siguiente",
    previous: "Anterior",
});
```

`setTranslations` merges with the built-in defaults, so you only pass the keys you want to change. Each call starts again from the defaults: it does not accumulate earlier overrides. `setTranslation(key, value)` changes a single key and `getTranslations()` returns the reactive object.

Because the translations are reactive, calling `setTranslations()` (or `setTranslation()`) while tables are mounted updates them immediately. That makes runtime language switching straightforward:

```js
import { setTranslations } from "@ponchrobles_/inertiajs-tables-laravel-query-builder";

const es = { next: "Siguiente", previous: "Anterior", search: "Buscar..." /* ... */ };

export function applyLanguage(language) {
    setTranslations(language === "es" ? es : {}); // {} restores the English defaults
}
```

Labels coming from the server (column labels, filter labels and options, the global search label) are plain strings: translate them in PHP (for example with `__()`), as the demo does.

Available keys and defaults:

| Key | Default |
| --- | ------- |
| `next` | `Next` |
| `previous` | `Previous` |
| `no_results_found` | `No results found` |
| `of` | `of` |
| `to` | `to` |
| `results` | `results` |
| `per_page` | `per page` |
| `reset` | `Reset` |
| `grouped_reset` | `Reset` |
| `search` | `Search...` (global search placeholder when the backend sends no label) |
| `select_all` | `Select all` |
| `clear_selection` | `Clear selection` |
| `start_date` | `Start date` |
| `end_date` | `End date` |
| `add_search_fields` | `Add search field` |
| `show_hide_columns` | `Show / Hide columns` |
| `number_range_min` | `Minimum value` |
| `number_range_max` | `Maximum value` |
| `remove_search` | `Remove search` |
| `toggle` | `Toggle` |

### Accessibility notes

- Sortable headers render as `<button type="button">`, non-sortable ones as plain elements.
- The toggle switch is a button with `aria-pressed` and a screen-reader label (the `toggle` translation).
- The number range handles have `role="slider"` with `aria-valuemin`, `aria-valuemax`, `aria-valuenow` and labels from `number_range_min` and `number_range_max`.
- Pagination has `aria-label="Pagination"`. The previous and next icon buttons have screen-reader text from the `previous` and `next` translations, and the remove-search button uses `remove_search`.
- Dropdowns use `role="menu"` and `role="menuitem"`.
- Translate the keys above for non-English interfaces so the screen-reader text matches the visible language.

### TypeScript

Type definitions ship with the npm package (`dist/index.d.ts`, generated from `js/index.d.ts`). They cover every exported component, its props and emits, the translation helpers and the shape of the data the backend sends:

```ts
import { Table, setTranslations } from "@ponchrobles_/inertiajs-tables-laravel-query-builder";
import type {
    Column,
    Filter,
    QueryBuilderProps,
    SearchInput,
    TableProps,
    Translations,
} from "@ponchrobles_/inertiajs-tables-laravel-query-builder";
```

`Column`, `SearchInput`, `Filter` (a union of `SelectFilterData`, `MultiSelectFilterData`, `NumberRangeFilterData`, `DateRangeFilterData` and `ToggleFilterData`) and `QueryBuilderProps` mirror the PHP `toArray()` output, and `Translations` lists the translation keys.

## Customization reference

The look of every component is built from default Tailwind classes, merged with your overrides through [`tailwind-merge`](https://github.com/dcastil/tailwind-merge). Overrides can be given globally (`themeVariables`) or per component instance (`ui` prop).

### Global overrides

Provide a `themeVariables` object with an `inertia_table` key:

```js
const themeVariables = {
    inertia_table: {
        per_page_selector: {
            select: {
                base: "block min-w-max shadow-sm text-sm rounded-md",
                color: {
                    primary: "border-gray-300 focus:ring-yellow-500 focus:border-yellow-500",
                },
            },
        },
    },
};

createInertiaApp({
    // ...
    setup({ el, App, props, plugin }) {
        return createApp({ render: () => h(App, props) })
            .use(plugin)
            .provide("themeVariables", themeVariables)
            .mount(el);
    },
});
```

Every themed part resolves two entries: `base` (always applied) and `color.<name>`, where `<name>` is the component's `color` prop (`"primary"` by default). Your classes are merged over the defaults. To add a new variant, define it under `color` and select it with the `color` prop:

```js
const themeVariables = {
    inertia_table: {
        per_page_selector: {
            select: { color: { red_style: "border-gray-300 focus:ring-red-500 focus:border-red-500" } },
        },
    },
};
```

```vue
<Table color="red_style" />
```

### Per-instance overrides (`ui` prop)

Most components accept a `ui` prop with the same structure as one component entry of `themeVariables` (without the component key). On `Table` it affects the table's own parts:

```vue
<Table :resource="users" :ui="{ td: { base: 'px-2 py-1 text-xs' } }" />
```

Priority, lowest to highest: built-in defaults, `themeVariables`, `ui`.

### Themeable parts

| `inertia_table.<key>` | Parts |
| --------------------- | ----- |
| `table` | `table`, `thead`, `tbody`, `tr_striped`, `tr_hover`, `tr_hover_striped`, `td`, `td_empty` |
| `table_wrapper` | `wrapper`, `scroll`, `align`, `inner` |
| `header_cell` | `th`, `sort_icon`, `sort_icon_active` |
| `pagination` | `nav`, `nav_button`, `nav_button_enabled`, `nav_button_disabled`, `info_text`, `page_button`, `page_button_enabled`, `page_button_disabled`, `page_link`, `page_link_active`, `page_link_inactive` |
| `per_page_selector` | `select` |
| `button_with_dropdown` | `button` |
| `global_search` | `input` |
| `reset_button` | `button` |
| `table_search_rows` | `input`, `remove_button` |
| `add_search_row` | `menu_item` |
| `grouped_actions` | `menu_item`, `search_item`, `reset_button` |
| `toggle_switch` | `toggle`, `toggle_on`, `toggle_off`, `toggle_dot`, `toggle_dot_on`, `toggle_dot_off` |
| `table_filter.select_filter` | `select` |
| `table_filter.multi_select_filter` | `option`, `checkbox` |
| `table_filter.date_range_filter` | `input` |
| `table_filter.number_range_filter` | `main_bar`, `selected_bar`, `button`, `popover`, `popover_arrow`, `text` |
| `table_filter.toggle_filter` | `toggle`, `reset_button` |

Example of a nested part:

```js
const themeVariables = {
    inertia_table: {
        table_filter: {
            number_range_filter: {
                selected_bar: {
                    base: "h-2 rounded-full",
                    color: { primary: "bg-indigo-600" },
                },
            },
        },
    },
};
```

For the exact default classes of each part, see the `fallbackTheme` object near the bottom of the matching file in [`js/Components`](js/Components).

## Local demo

A small Laravel + Inertia + Vue app ([Orchestra Workbench](https://packages.tools/workbench), SQLite) runs the package from the local source (`js/` and `src/`, not `dist/`). It has the full table (global search, search rows, sorting, pagination, per page, reset, column toggle), every filter type, a page with two named tables and an EN/ES language switcher that calls `setTranslations()` at runtime. It is a good place to see real, working usage: `workbench/app/Http/Controllers/ProductController.php` and `workbench/resources/js/Pages/`.

First time (needs `composer install` and `npm install`):

```bash
npm run demo:build      # builds the demo assets into workbench/public/build
composer demo:setup     # creates and seeds the SQLite database (about 100 products)
composer serve          # serves the demo, usually on http://127.0.0.1:8000
```

Open `/products` (full table) or `/two-tables`. For hot reload, run `npm run demo:dev` in a second terminal instead of `demo:build`. Run `composer demo:setup` again to reset the data. See [CONTRIBUTING](CONTRIBUTING.md#local-demo) for details.

## Testing

```bash
composer install
composer test            # PHPUnit (Orchestra Testbench), tests in tests/

npm install
npm test                 # Vitest, tests in tests/js/
npm run typecheck        # TypeScript definitions check
npm run lint             # ESLint
composer php-cs-fixer    # PHP code style
```

## Upgrading

### To v5

- The Composer package is `ponchrobles/inertiajs-tables-laravel-query-builder`, the PHP namespace is `PonchRobles\InertiaTable` and the npm package is `@ponchrobles_/inertiajs-tables-laravel-query-builder`.
- Global search no longer applies Laravel's `__()` to the default placeholder. Without a label, the frontend uses the `search` translation. Pass a translated label or use `setTranslations({ search: "..." })`.
- `setTranslations()` resets to the defaults on every call instead of accumulating previous overrides.
- Validate the per-page value with `InertiaTable::perPage()`. For named tables the frontend sends `{name}_perPage`; the fallback to the unprefixed `perPage` is deprecated and will be removed.
- Tailwind CSS v3 and the Forms plugin are required.
- `multiSelectFilter` and `dateRangeFilter` need their custom Query Builder filters (`MultiSelectFilter::getQueryBuilderFilter()` and `DateRangeFilter::getQueryBuilderFilter()`).

### Upgrading from v1 (upstream)

#### Server-side

* The `addColumn` method has been renamed to `column`.
* The `addFilter` method has been renamed to `selectFilter`.
* The `addSearch` method has been renamed to `searchInput`.
* For all renamed methods, check out the arguments as some have been changed.
* The `addColumns` and `addSearchRows` methods have been removed.
* Global Search is not enabled by default anymore.

#### Client-side

* The `InteractsWithQueryBuilder` mixin has been removed and is no longer needed.
* The `Table` component no longer needs the `filters`, `search`, `columns`, and `on-update` properties.
* When using a custom `thead` or `tbody` slot, you need to provide the styling manually.
* When using a custom `thead`, the `showColumn` method has been renamed to `show`.
* The `setTranslations` method is no longer part of the `Pagination` component, but should be imported.
* The templates and logic of the components are not separated anymore. Use slots to inject your own implementations.

## Changelog

Please see [CHANGELOG](CHANGELOG.md) for what has changed recently. Releases to npm and Packagist are automated, see [RELEASING](RELEASING.md) for details.

## Contributing

Please see [CONTRIBUTING](CONTRIBUTING.md) for details.

## Security

Please see [SECURITY](SECURITY.md) for our vulnerability disclosure policy.

## Credits

- [Pascal Baljet](https://github.com/protonemedia)
- [All Contributors](../../contributors)
- [Alfonso Rodríguez](https://github.com/PonchRobles)

## License

The MIT License (MIT). Please see the [License File](LICENSE) for more information.
