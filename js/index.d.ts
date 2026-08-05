import { DefineComponent } from "vue";

export interface TableProps {
    inertia?: Record<string, unknown>;
    name?: string;
    striped?: boolean;
    preventOverlappingRequests?: boolean;
    inputDebounceMs?: number;
    preserveScroll?: boolean | string;
    resource?: Record<string, unknown>;
    meta?: Record<string, unknown>;
    data?: Record<string, unknown>;
    withGroupedMenu?: boolean;
    color?: string;
    ui?: Record<string, unknown>;
}

export interface Column {
    key: string;
    label: string;
    canBeHidden: boolean;
    hidden: boolean;
    sortable: boolean;
    sorted: string | false;
}

export interface SearchInput {
    key: string;
    label: string;
    value: string | null;
}

export interface Filter {
    key: string;
    label: string;
    type: string;
    value: unknown;
    options?: Record<string, string>;
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
    [key: string]: string | undefined;
}

export declare const Table: DefineComponent<TableProps>;
export declare const ButtonWithDropdown: DefineComponent;
export declare const GroupedActions: DefineComponent;
export declare const HeaderCell: DefineComponent;
export declare const OnClickOutside: DefineComponent;
export declare const Pagination: DefineComponent;
export declare const PerPageSelector: DefineComponent;
export declare const TableAddSearchRow: DefineComponent;
export declare const TableColumns: DefineComponent;
export declare const TableFilter: DefineComponent;
export declare const TableGlobalSearch: DefineComponent;
export declare const TableReset: DefineComponent;
export declare const TableSearchRows: DefineComponent;
export declare const TableWrapper: DefineComponent;
export declare const ToggleSwitch: DefineComponent;

export declare function getTranslations(): Translations;
export declare function setTranslation(key: string, value: string): void;
export declare function setTranslations(translations: Translations): void;
