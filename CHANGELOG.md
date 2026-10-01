# Changelog

All notable changes to `@ponchrobles_/inertiajs-tables-laravel-query-builder` (npm) / `ponchrobles/inertiajs-tables-laravel-query-builder` (Composer) will be documented in this file.

This project is a fork of [protonemedia/inertiajs-tables-laravel-query-builder](https://github.com/protonemedia/inertiajs-tables-laravel-query-builder) (see [fork reason](https://github.com/protonemedia/inertiajs-tables-laravel-query-builder/issues/122)). Versions prior to `4.0.0` correspond to the upstream project's history.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

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
- `perPage` is now prefixed per named table (`{name}_perPage`); the default table keeps `perPage`. **Compatibility:** bookmarked URLs of named tables using `perPage` no longer apply on the frontend; `InertiaTable::perPage(name: ...)` still falls back to the unprefixed `perPage` for one release (deprecated).
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
