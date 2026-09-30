# Changelog

All notable changes to `inertia-table` (formerly `inertiajs-tables-laravel-query-builder`) will be documented in this file.

This project is a fork of [protonemedia/inertiajs-tables-laravel-query-builder](https://github.com/protonemedia/inertiajs-tables-laravel-query-builder) (see [fork reason](https://github.com/protonemedia/inertiajs-tables-laravel-query-builder/issues/122)). Versions prior to `4.0.0` correspond to the upstream project's history.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [5.0.0](https://github.com/PonchRobles/inertiajs-tables-laravel-query-builder/compare/5.0.0...5.0.0) (2026-09-30)


### Features

* added missing translation ([#13](https://github.com/PonchRobles/inertiajs-tables-laravel-query-builder/issues/13)) ([3e231f6](https://github.com/PonchRobles/inertiajs-tables-laravel-query-builder/commit/3e231f69a782f9545df1cc0b079caa85697772ba))
* fix error eslint and update version build ([#14](https://github.com/PonchRobles/inertiajs-tables-laravel-query-builder/issues/14)) ([010c744](https://github.com/PonchRobles/inertiajs-tables-laravel-query-builder/commit/010c744c932a71e7b12a9c30901d1a440d31c042))
* update for vue 3 and laravel 11 and tailwind 3 ([#1](https://github.com/PonchRobles/inertiajs-tables-laravel-query-builder/issues/1)) ([c8bba08](https://github.com/PonchRobles/inertiajs-tables-laravel-query-builder/commit/c8bba08939e1ab4c032750d4676504662e97c7bb))
* update package public ([#4](https://github.com/PonchRobles/inertiajs-tables-laravel-query-builder/issues/4)) ([4d78b29](https://github.com/PonchRobles/inertiajs-tables-laravel-query-builder/commit/4d78b2940d6679893c67102a74b1619164b6e06c))
* update package public ([#6](https://github.com/PonchRobles/inertiajs-tables-laravel-query-builder/issues/6)) ([5556974](https://github.com/PonchRobles/inertiajs-tables-laravel-query-builder/commit/55569745856210c620618f5fa2afb3d8d0f6ef26))
* update readme ([#2](https://github.com/PonchRobles/inertiajs-tables-laravel-query-builder/issues/2)) ([60ae402](https://github.com/PonchRobles/inertiajs-tables-laravel-query-builder/commit/60ae402545e7fd073688826f895e2b690872c48a))
* update version ([8a3517c](https://github.com/PonchRobles/inertiajs-tables-laravel-query-builder/commit/8a3517cd2ac3ab2b369e96d1565c1bab67eedad8))
* update version ([#7](https://github.com/PonchRobles/inertiajs-tables-laravel-query-builder/issues/7)) ([6b21310](https://github.com/PonchRobles/inertiajs-tables-laravel-query-builder/commit/6b21310014b0b7d1586285b96490213583db8557))
* update version ([#8](https://github.com/PonchRobles/inertiajs-tables-laravel-query-builder/issues/8)) ([b7f031c](https://github.com/PonchRobles/inertiajs-tables-laravel-query-builder/commit/b7f031cac84c568cc1656ded877701a66f0288b2))
* update version ([#9](https://github.com/PonchRobles/inertiajs-tables-laravel-query-builder/issues/9)) ([df3dcea](https://github.com/PonchRobles/inertiajs-tables-laravel-query-builder/commit/df3dcea7a1f7da56c0357a26f5623b905317b464))
* v5.0 - modernize component architecture and extend filter system ([63e80f7](https://github.com/PonchRobles/inertiajs-tables-laravel-query-builder/commit/63e80f7550e355266c075513223a459c0d1d5179))


### Bug Fixes

* move file for files folder ([#17](https://github.com/PonchRobles/inertiajs-tables-laravel-query-builder/issues/17)) ([bd2e3a4](https://github.com/PonchRobles/inertiajs-tables-laravel-query-builder/commit/bd2e3a42845483a9baadedb651ba49b8d45c7deb))
* **pagination:** return array from perPageOptions default ([3b0c9b6](https://github.com/PonchRobles/inertiajs-tables-laravel-query-builder/commit/3b0c9b6990dd41e7232e05f8eb4c5558e08cf227)), closes [#21](https://github.com/PonchRobles/inertiajs-tables-laravel-query-builder/issues/21)
* rename file filterable ([#18](https://github.com/PonchRobles/inertiajs-tables-laravel-query-builder/issues/18)) ([9aad07e](https://github.com/PonchRobles/inertiajs-tables-laravel-query-builder/commit/9aad07e273d304a0ae623799344914f29ecafe99))


### Miscellaneous Chores

* **release:** release 5.0.0 as the first automated release ([ab42e2b](https://github.com/PonchRobles/inertiajs-tables-laravel-query-builder/commit/ab42e2b3d097a9da07e6ddf562ebaa7dc29cbe3f)), closes [#21](https://github.com/PonchRobles/inertiajs-tables-laravel-query-builder/issues/21)

## [Unreleased]

### Added
- Extended filter system: `MultiSelectFilter` and `DateRangeFilter`, alongside the existing select, toggle, and number range filters.
- New composables (`useTableQuery`, `useTableState`, `useTableNavigation`) to modernize and simplify the client-side component architecture.
- TypeScript typings (`index.d.ts`) covering all exported components, props, and translations.

### Changed
- Modernized component architecture (v5): logic extracted from `Table.vue` into composables, with dedicated sub-components per filter type.
- Bumped compatibility to Laravel 11–13, PHP 8.2+, Inertia.js v1/v2, and Spatie Laravel Query Builder v6.
- Updated build tooling to Vite 8 and ESLint 10.

### Fixed
- Corrected file naming/location for filterable classes (previously under `#17`/`#18`).
- Fixed missing translations for search and pagination labels.

## [5.0.0] - 2026-08-05

- Modernized component architecture and extended filter system (multi-select and date-range filters).
- See "Changed"/"Added" above — this release is tracked under Unreleased until published to Packagist/npm.

## Fork history (from `4.0.0`)

- **fix:** renamed and relocated filterable classes for consistency (#17, #18).
- **feat:** added missing translations, including the "Search..." label (#12, #13).
- **feat:** updated package for Vue 3, Laravel 11, and Tailwind 3 support (#1).
- **feat:** published the package publicly to Packagist and npm under the `ponchrobles` namespace (#4–#10).

## Upstream history (pre-fork, `protonemedia/inertiajs-tables-laravel-query-builder`)

See the [upstream CHANGELOG](https://github.com/protonemedia/inertiajs-tables-laravel-query-builder/blob/main/CHANGELOG.md) for versions `1.0.0` through `3.1.2`.
