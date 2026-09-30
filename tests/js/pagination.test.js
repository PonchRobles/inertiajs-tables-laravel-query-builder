import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";

const { get, usePage } = vi.hoisted(() => ({ get: vi.fn(), usePage: vi.fn() }));
vi.mock("@inertiajs/vue3", () => ({ router: { get }, usePage }));

import Table from "../../js/Components/Table.vue";

function queryBuilderProps() {
    return {
        pageName: "page",
        defaultSort: null,
        defaultVisibleToggleableColumns: ["id"],
        columns: [{ key: "id", label: "ID", sortable: false, hidden: false, can_be_hidden: false }],
        filters: [],
        searchInputs: [],
        searchInputsWithoutGlobal: [],
        perPageOptions: [15, 30],
        hasFilters: false,
        hasEnabledFilters: false,
        hasSearchInputs: false,
        hasToggleableColumns: false,
        globalSearch: null,
        sort: null,
        cursor: null,
        page: 1,
        perPage: 15,
    };
}

function mountTable() {
    usePage.mockReturnValue({ props: { queryBuilderProps: { default: queryBuilderProps() } } });
    return mount(Table, {
        global: { provide: { themeVariables: {} } },
        props: {
            resource: {
                data: [{ id: 1 }, { id: 2 }],
                links: [],
                meta: {
                    total: 30,
                    per_page: 15,
                    from: 1,
                    to: 15,
                    prev_page_url: null,
                    next_page_url: "http://localhost/users?page=2",
                    links: [],
                },
            },
        },
    });
}

describe("pagination (upstream protonemedia#119)", () => {
    beforeEach(() => {
        get.mockReset();
        window.history.replaceState({}, "", "/users");
    });

    it("renders the next page link", () => {
        const wrapper = mountTable();
        expect(wrapper.find("[dusk='pagination-simple-next']").exists()).toBe(true);
    });

    // Upstream protonemedia/inertiajs-tables-laravel-query-builder#119: a page change
    // must trigger exactly ONE Inertia visit. If this fails, the bug is present here.
    it("changing page triggers exactly one router visit", async () => {
        const wrapper = mountTable();
        await wrapper.find("[dusk='pagination-simple-next']").trigger("click");
        await new Promise((resolve) => setTimeout(resolve, 0));
        expect(get).toHaveBeenCalledTimes(1);
        expect(get.mock.calls[0][0]).toBe("/users?page=2&perPage=15");
    });
});
