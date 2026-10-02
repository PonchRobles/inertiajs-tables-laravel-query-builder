import { h } from "vue";
import {
    ButtonWithDropdown,
    GroupedActions,
    HeaderCell,
    OnClickOutside,
    Pagination,
    PerPageSelector,
    Table,
    TableAddSearchRow,
    TableColumns,
    TableFilter,
    TableGlobalSearch,
    TableReset,
    TableSearchRows,
    TableWrapper,
    ToggleSwitch,
    getTranslations,
    setTranslation,
    setTranslations,
} from "@ponchrobles_/inertiajs-tables-laravel-query-builder";
import type {
    Column,
    Filter,
    QueryBuilderProps,
    SearchInput,
} from "@ponchrobles_/inertiajs-tables-laravel-query-builder";

const column: Column = {
    key: "name",
    label: "Name",
    can_be_hidden: true,
    hidden: false,
    sortable: true,
    sorted: "asc",
    nulls_last: false,
};
const searchInput: SearchInput = { key: "name", label: "Name", value: null };
const filters: Filter[] = [
    { key: "role", label: "Role", type: "select", options: { a: "A" }, value: null },
    { key: "tags", label: "Tags", type: "multi_select", options: { a: "A" }, value: ["a"] },
    { key: "price", label: "Price", type: "number_range", min: 0, max: 10, prefix: "", suffix: "", step: 1, value: [0, 10] },
    { key: "date", label: "Date", type: "date_range", minDate: null, maxDate: null, format: "Y-m-d", value: null },
    { key: "active", label: "Active", type: "toggle", value: true },
];
const queryBuilderProps: QueryBuilderProps = {
    defaultVisibleToggleableColumns: ["name"],
    columns: [column],
    hasHiddenColumns: false,
    hasToggleableColumns: true,
    filters,
    hasFilters: true,
    hasEnabledFilters: false,
    searchInputs: [searchInput],
    searchInputsWithoutGlobal: [searchInput],
    hasSearchInputs: true,
    hasSearchInputsWithValue: false,
    hasSearchInputsWithoutValue: true,
    globalSearch: null,
    cursor: null,
    sort: null,
    defaultSort: null,
    page: 1,
    pageName: "page",
    perPageOptions: [15, 30],
};
void queryBuilderProps;

// Valid usages: every component, with its required props.
h(Table, { name: "users", striped: true, inputDebounceMs: 200, preserveScroll: "table-top", onRowClicked: (event, item, key) => void [event, item, key] });
h(ButtonWithDropdown, { placement: "bottom-end", active: true, dusk: null, disabled: false, onClosed: () => {} });
h(GroupedActions, { actions: { reset: { onClick: () => {} }, toggleColumns: { show: true, columns: [column], onChange: (key, hidden) => void [key, hidden] } } });
h(HeaderCell, { cell: { ...column, onSort: (key) => void key } });
h(OnClickOutside, { do: () => {} });
h(Pagination, { hasData: true, meta: { total: 1, per_page: 15, links: [] }, onClick: (url) => void url, perPageOptions: [10, 20], showEmptyMessage: false });
h(PerPageSelector, { onChange: (value) => void value, value: 30, options: [30, 60] });
h(TableAddSearchRow, { searchInputs: [searchInput], hasSearchInputsWithoutValue: true, onAdd: (key) => void key });
h(TableColumns, { columns: [column], hasHiddenColumns: false, onChange: (key, hidden) => void [key, hidden] });
h(TableFilter, { hasEnabledFilters: false, filters, onFilterChange: (key, value) => void [key, value] });
h(TableGlobalSearch, { onChange: (value) => void value, label: "Find", value: "x" });
h(TableReset, { onClick: () => {} });
h(TableSearchRows, { searchInputs: [searchInput], forcedVisibleSearchInputs: ["name"], onChange: (key, value) => void [key, value], onRemove: (key) => void key });
h(TableWrapper, { color: "primary", ui: {} });
h(ToggleSwitch, { modelValue: true, ariaLabelledby: "id", "onUpdate:modelValue": (value) => void value });

getTranslations().next.toUpperCase();
setTranslation("next", "Siguiente");
setTranslations({ next: "Siguiente" });

// Invalid usages must be rejected.
// @ts-expect-error striped must be a boolean
h(Table, { striped: "yes" });
// @ts-expect-error inputDebounceMs must be a number
h(Table, { inputDebounceMs: "fast" });
// @ts-expect-error onClick is required
h(TableReset, {});
// @ts-expect-error modelValue must be a boolean
h(ToggleSwitch, { modelValue: "on" });
// @ts-expect-error filters are required
h(TableFilter, { hasEnabledFilters: false, onFilterChange: () => {} });
// @ts-expect-error sorted must be "asc", "desc" or false
const badColumn: Column = { ...column, sorted: "up" };
void badColumn;
// @ts-expect-error snake_case is the serialized key
const camelColumn: Column = { ...column, canBeHidden: true };
void camelColumn;
// @ts-expect-error perPageOptions must be numbers
h(Pagination, { hasData: true, perPageOptions: ["10"] });
// @ts-expect-error showEmptyMessage must be a boolean
h(Pagination, { hasData: true, showEmptyMessage: "no" });
