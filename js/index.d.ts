import { DefineComponent } from "vue";

export interface TableProps {
    /** @default {} */
    inertia?: Record<string, unknown>;
    /** @default "default" */
    name?: string;
    /** @default false */
    striped?: boolean;
    /** @default true */
    preventOverlappingRequests?: boolean;
    /** @default 350 */
    inputDebounceMs?: number;
    /** @default false */
    preserveScroll?: boolean | string;
    /** @default {} */
    resource?: Record<string, unknown>;
    /** @default {} */
    meta?: Record<string, unknown>;
    /** @default {} */
    data?: Record<string, unknown>;
    /** @default false */
    withGroupedMenu?: boolean;
    /** @default "primary" */
    color?: string;
    ui?: UiOverrides;
}

/** Mirrors `PonchRobles\InertiaTable\Column::toArray()`. */
export interface Column {
    key: string;
    label: string;
    can_be_hidden: boolean;
    hidden: boolean;
    sortable: boolean;
    sorted: "asc" | "desc" | false;
    nulls_last: boolean;
}

/** Mirrors `PonchRobles\InertiaTable\SearchInput::toArray()`. */
export interface SearchInput {
    key: string;
    /** `null` for the global search input when no label was set on the backend. */
    label: string | null;
    value: string | null;
}

/** Mirrors `Filters\Filter::toArray()` (select filter). */
export interface SelectFilterData {
    key: string;
    label: string;
    type: "select";
    options: Record<string, string>;
    value: string | null;
}

/** Mirrors `Filters\MultiSelectFilter::toArray()`. */
export interface MultiSelectFilterData {
    key: string;
    label: string;
    type: "multi_select";
    options: Record<string, string>;
    value: string[] | null;
}

/** Mirrors `Filters\NumberRangeFilter::toArray()`. */
export interface NumberRangeFilterData {
    key: string;
    label: string;
    type: "number_range";
    min: number;
    max: number;
    prefix: string;
    suffix: string;
    step: number;
    value: [number | string, number | string];
}

/** Mirrors `Filters\DateRangeFilter::toArray()`. */
export interface DateRangeFilterData {
    key: string;
    label: string;
    type: "date_range";
    minDate: string | null;
    maxDate: string | null;
    format: string;
    value: [string | null, string | null] | null;
}

/** Mirrors `Filters\ToggleFilter::toArray()`. */
export interface ToggleFilterData {
    key: string;
    label: string;
    type: "toggle";
    value: boolean | null;
}

export type Filter = SelectFilterData | MultiSelectFilterData | NumberRangeFilterData | DateRangeFilterData | ToggleFilterData;

/** The `queryBuilderProps[name]` object built by `InertiaTable::getQueryBuilderProps()`. */
export interface QueryBuilderProps {
    defaultVisibleToggleableColumns: string[];
    columns: Column[];
    hasHiddenColumns: boolean;
    hasToggleableColumns: boolean;
    filters: Filter[];
    hasFilters: boolean;
    hasEnabledFilters: boolean;
    searchInputs: SearchInput[];
    searchInputsWithoutGlobal: SearchInput[];
    hasSearchInputs: boolean;
    hasSearchInputsWithValue: boolean;
    hasSearchInputsWithoutValue: boolean;
    globalSearch: SearchInput | null;
    cursor: string | null;
    sort: string | null;
    defaultSort: string | null;
    page: number;
    pageName: string;
    perPageOptions: number[];
}

/** Theme overrides accepted by the `ui` prop of most components. */
export type UiOverrides = Record<string, unknown>;

/** A column as handed to `HeaderCell`: the column data plus the sort callback. */
export interface HeaderCellData extends Column {
    onSort: (key: string) => void;
}

export interface GroupedActionsConfig {
    reset?: { onClick: () => void };
    toggleColumns?: {
        show: boolean;
        columns: Column[];
        onChange: (key: string, hidden: boolean) => void;
    };
    searchFields?: {
        show: boolean;
        searchInputs: SearchInput[];
        hasSearchInputsWithoutValue?: boolean;
        onClick: (key: string) => void;
    };
}

/** Laravel paginator meta (the keys `Pagination` reads). */
export interface PaginationMeta {
    from?: number | null;
    to?: number | null;
    total?: number;
    per_page?: number | string;
    prev_page_url?: string | null;
    next_page_url?: string | null;
    links?: Array<{ url: string | null; label: string; active: boolean }>;
    [key: string]: unknown;
}

export interface Translations {
    next: string;
    no_results_found: string;
    of: string;
    per_page: string;
    previous: string;
    results: string;
    to: string;
    reset: string;
    search: string;
    select_all?: string;
    clear_selection?: string;
    start_date?: string;
    end_date?: string;
    add_search_fields?: string;
    show_hide_columns?: string;
    grouped_reset?: string;
    number_range_min?: string;
    number_range_max?: string;
    remove_search?: string;
    toggle?: string;
    [key: string]: string | undefined;
}

export interface ButtonWithDropdownProps {
    /** @default "bottom-start" */
    placement?: string;
    /** @default false */
    active?: boolean;
    /** @default null */
    dusk?: string | null;
    /** @default false */
    disabled?: boolean;
    /** @default "primary" */
    color?: string;
    ui?: UiOverrides;
}

export interface GroupedActionsProps {
    actions: GroupedActionsConfig;
    /** @default "primary" */
    color?: string;
    ui?: UiOverrides;
}

export interface HeaderCellProps {
    cell: HeaderCellData;
    /** @default "primary" */
    color?: string;
    ui?: UiOverrides;
}

export interface OnClickOutsideProps {
    do: () => void;
}

export interface PaginationProps {
    onClick?: (url: string | null) => void;
    /** @default [15, 30, 50, 100] */
    perPageOptions?: number[];
    /** @default () => {} */
    onPerPageChange?: (value: string) => void;
    hasData: boolean;
    /** Show "No results found" when there is no data. `Table` passes false: its empty row shows it. @default true */
    showEmptyMessage?: boolean;
    meta?: PaginationMeta;
    /** @default "primary" */
    color?: string;
    ui?: UiOverrides;
}

export interface PerPageSelectorProps {
    /** @default null */
    dusk?: string | null;
    /** @default 15 */
    value?: number;
    /** @default [15, 30, 50, 100] */
    options?: number[];
    onChange: (value: string) => void;
    /** @default "primary" */
    color?: string;
    ui?: UiOverrides;
}

export interface TableAddSearchRowProps {
    searchInputs: SearchInput[];
    hasSearchInputsWithoutValue: boolean;
    onAdd: (key: string) => void;
    /** @default "primary" */
    color?: string;
    ui?: UiOverrides;
}

export interface TableColumnsProps {
    columns: Column[];
    hasHiddenColumns: boolean;
    onChange: (key: string, hidden: boolean) => void;
    /** @default "primary" */
    color?: string;
}

export interface TableFilterProps {
    hasEnabledFilters: boolean;
    filters: Filter[];
    onFilterChange: (key: string, value: unknown) => void;
    /** @default "primary" */
    color?: string;
    ui?: UiOverrides;
}

export interface TableGlobalSearchProps {
    /** Placeholder. Defaults to the `search` translation. */
    label?: string;
    /** @default "" */
    value?: string;
    onChange: (value: string) => void;
    /** @default "primary" */
    color?: string;
    ui?: UiOverrides;
}

export interface TableResetProps {
    onClick: () => void;
    /** @default "primary" */
    color?: string;
    ui?: UiOverrides;
}

export interface TableSearchRowsProps {
    searchInputs: SearchInput[];
    forcedVisibleSearchInputs: string[];
    onChange: (key: string, value: string) => void;
    onRemove: (key: string) => void;
    /** @default "primary" */
    color?: string;
    ui?: UiOverrides;
}

export interface TableWrapperProps {
    /** @default "primary" */
    color?: string;
    ui?: UiOverrides;
}

export interface ToggleSwitchProps {
    modelValue: boolean;
    /** @default null */
    ariaLabelledby?: string | null;
    /** @default null */
    dusk?: string | null;
    /** @default "primary" */
    color?: string;
    ui?: UiOverrides;
}

export type TableEmits = {
    rowClicked: (event: Event, item: Record<string, unknown>, key: number) => void;
};
export type ButtonWithDropdownEmits = { closed: () => void };
export type ToggleSwitchEmits = { "update:modelValue": (value: boolean) => void };

export declare const Table: DefineComponent<TableProps, {}, {}, {}, {}, {}, {}, TableEmits>;
export declare const ButtonWithDropdown: DefineComponent<ButtonWithDropdownProps, { hide: () => void }, {}, {}, {}, {}, {}, ButtonWithDropdownEmits>;
export declare const GroupedActions: DefineComponent<GroupedActionsProps>;
export declare const HeaderCell: DefineComponent<HeaderCellProps>;
export declare const OnClickOutside: DefineComponent<OnClickOutsideProps>;
export declare const Pagination: DefineComponent<PaginationProps>;
export declare const PerPageSelector: DefineComponent<PerPageSelectorProps>;
export declare const TableAddSearchRow: DefineComponent<TableAddSearchRowProps>;
export declare const TableColumns: DefineComponent<TableColumnsProps>;
export declare const TableFilter: DefineComponent<TableFilterProps>;
export declare const TableGlobalSearch: DefineComponent<TableGlobalSearchProps>;
export declare const TableReset: DefineComponent<TableResetProps>;
export declare const TableSearchRows: DefineComponent<TableSearchRowsProps>;
export declare const TableWrapper: DefineComponent<TableWrapperProps>;
export declare const ToggleSwitch: DefineComponent<ToggleSwitchProps, {}, {}, {}, {}, {}, {}, ToggleSwitchEmits>;

export declare function getTranslations(): Translations;
export declare function setTranslation(key: string, value: string): void;
export declare function setTranslations(translations: Partial<Translations>): void;
