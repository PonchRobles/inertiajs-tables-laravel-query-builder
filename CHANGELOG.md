# Changelog

All notable changes to `@ponchrobles_/inertiajs-tables-laravel-query-builder` (npm) / `ponchrobles/inertiajs-tables-laravel-query-builder` (Composer) will be documented in this file.

This project is a fork of [protonemedia/inertiajs-tables-laravel-query-builder](https://github.com/protonemedia/inertiajs-tables-laravel-query-builder) (see [fork reason](https://github.com/protonemedia/inertiajs-tables-laravel-query-builder/issues/122)). Versions prior to `4.0.0` correspond to the upstream project's history.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [5.1.0](https://github.com/PonchRobles/inertiajs-tables-laravel-query-builder/compare/5.0.0...5.1.0) (2026-10-02)


### Features

* add ordered_options and a SelectFilter component for select filters ([#93](https://github.com/PonchRobles/inertiajs-tables-laravel-query-builder/issues/93)) ([4ba27c8](https://github.com/PonchRobles/inertiajs-tables-laravel-query-builder/commit/4ba27c82526d4d8ac86259bf9b3a16a594fb15a7))
* sort NULL values last ([#60](https://github.com/PonchRobles/inertiajs-tables-laravel-query-builder/issues/60)) ([4d9292a](https://github.com/PonchRobles/inertiajs-tables-laravel-query-builder/commit/4d9292aaafacee66d1e43e174edfcb4bbc4830f2))
* type the props and emits of every exported component ([#63](https://github.com/PonchRobles/inertiajs-tables-laravel-query-builder/issues/63)) ([4d9292a](https://github.com/PonchRobles/inertiajs-tables-laravel-query-builder/commit/4d9292aaafacee66d1e43e174edfcb4bbc4830f2))


### Bug Fixes

* add explicit type to non-submit buttons ([#39](https://github.com/PonchRobles/inertiajs-tables-laravel-query-builder/issues/39)) ([4d9292a](https://github.com/PonchRobles/inertiajs-tables-laravel-query-builder/commit/4d9292aaafacee66d1e43e174edfcb4bbc4830f2))
* derive canBeReset from the reactive server props ([#68](https://github.com/PonchRobles/inertiajs-tables-laravel-query-builder/issues/68)) ([4d9292a](https://github.com/PonchRobles/inertiajs-tables-laravel-query-builder/commit/4d9292aaafacee66d1e43e174edfcb4bbc4830f2))
* do not throw on multi-select options containing a comma ([#65](https://github.com/PonchRobles/inertiajs-tables-laravel-query-builder/issues/65)) ([4d9292a](https://github.com/PonchRobles/inertiajs-tables-laravel-query-builder/commit/4d9292aaafacee66d1e43e174edfcb4bbc4830f2))
* **i18n:** define missing translation keys ([#47](https://github.com/PonchRobles/inertiajs-tables-laravel-query-builder/issues/47)) ([4d9292a](https://github.com/PonchRobles/inertiajs-tables-laravel-query-builder/commit/4d9292aaafacee66d1e43e174edfcb4bbc4830f2))
* let the JS search translation drive the global search placeholder ([#66](https://github.com/PonchRobles/inertiajs-tables-laravel-query-builder/issues/66)) ([4d9292a](https://github.com/PonchRobles/inertiajs-tables-laravel-query-builder/commit/4d9292aaafacee66d1e43e174edfcb4bbc4830f2))
* make NumberRangeFilter keyboard and touch accessible ([#57](https://github.com/PonchRobles/inertiajs-tables-laravel-query-builder/issues/57)) ([4d9292a](https://github.com/PonchRobles/inertiajs-tables-laravel-query-builder/commit/4d9292aaafacee66d1e43e174edfcb4bbc4830f2))
* make the remove search label translatable ([#82](https://github.com/PonchRobles/inertiajs-tables-laravel-query-builder/issues/82)) ([4d9292a](https://github.com/PonchRobles/inertiajs-tables-laravel-query-builder/commit/4d9292aaafacee66d1e43e174edfcb4bbc4830f2))
* make the ToggleSwitch label translatable ([#85](https://github.com/PonchRobles/inertiajs-tables-laravel-query-builder/issues/85)) ([4d9292a](https://github.com/PonchRobles/inertiajs-tables-laravel-query-builder/commit/4d9292aaafacee66d1e43e174edfcb4bbc4830f2))
* make translations reactive so mounted components update ([#70](https://github.com/PonchRobles/inertiajs-tables-laravel-query-builder/issues/70)) ([4d9292a](https://github.com/PonchRobles/inertiajs-tables-laravel-query-builder/commit/4d9292aaafacee66d1e43e174edfcb4bbc4830f2))
* merge setTranslations with the default translations ([#55](https://github.com/PonchRobles/inertiajs-tables-laravel-query-builder/issues/55)) ([4d9292a](https://github.com/PonchRobles/inertiajs-tables-laravel-query-builder/commit/4d9292aaafacee66d1e43e174edfcb4bbc4830f2))
* prefix perPage per named table ([#54](https://github.com/PonchRobles/inertiajs-tables-laravel-query-builder/issues/54)) ([4d9292a](https://github.com/PonchRobles/inertiajs-tables-laravel-query-builder/commit/4d9292aaafacee66d1e43e174edfcb4bbc4830f2))
* show the empty message once when the table has no rows ([#83](https://github.com/PonchRobles/inertiajs-tables-laravel-query-builder/issues/83)) ([4d9292a](https://github.com/PonchRobles/inertiajs-tables-laravel-query-builder/commit/4d9292aaafacee66d1e43e174edfcb4bbc4830f2))
* validate perPage on the server ([#50](https://github.com/PonchRobles/inertiajs-tables-laravel-query-builder/issues/50)) ([4d9292a](https://github.com/PonchRobles/inertiajs-tables-laravel-query-builder/commit/4d9292aaafacee66d1e43e174edfcb4bbc4830f2))

## [5.0.0](https://github.com/PonchRobles/inertiajs-tables-laravel-query-builder/compare/3.1.2...5.0.0) (2026-09-30)

### Added
- Extended filter system: `MultiSelectFilter` and `DateRangeFilter`, alongside the existing select, toggle, and number range filters.
- New composables (`useTableQuery`, `useTableState`, `useTableNavigation`) to modernize and simplify the client-side component architecture.
- TypeScript typings (`index.d.ts`) covering all exported components, props, and translations.
- Release automation: release-please, npm trusted publishing and the Packagist update API, chained from `release-please.yml`.
- CI now runs on PHP 8.5 and Node 24.

### Changed
- Modernized component architecture (v5): logic extracted from `Table.vue` into composables, with dedicated sub-components per filter type.
- Compatibility widened to Laravel 11-13, PHP 8.2-8.5, Inertia.js v1/v2/v3, and Spatie Laravel Query Builder v6/v7.
- Updated build tooling to Vite 8 and ESLint 10.

### Fixed
- Corrected file naming/location for filterable classes (previously under `#17`/`#18`).
- Fixed missing translations for search and pagination labels.
- Fixed the `perPageOptions` default in `Pagination.vue`, which returned a function instead of an array.

## Fork history (from `4.0.0`)

- **fix:** renamed and relocated filterable classes for consistency (#17, #18).
- **feat:** added missing translations, including the "Search..." label (#12, #13).
- **feat:** updated package for Vue 3, Laravel 11, and Tailwind 3 support (#1).
- **feat:** published the package publicly to Packagist and npm under the `ponchrobles` namespace (#4–#10).

## Upstream history (pre-fork, `protonemedia/inertiajs-tables-laravel-query-builder`)

See the [upstream CHANGELOG](https://github.com/protonemedia/inertiajs-tables-laravel-query-builder/blob/main/CHANGELOG.md) for versions `1.0.0` through `3.1.2`.
