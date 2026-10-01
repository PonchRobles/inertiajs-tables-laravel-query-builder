import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";

const { get, usePage } = vi.hoisted(() => ({ get: vi.fn(), usePage: vi.fn() }));
vi.mock("@inertiajs/vue3", () => ({ router: { get }, usePage }));

import Table from "../../js/Components/Table.vue";
import Pagination from "../../js/Components/Pagination.vue";

const emptyMeta = { total: 0, per_page: 15, from: null, to: null, prev_page_url: null, next_page_url: null, links: [] };

function mountEmptyTable() {
    usePage.mockReturnValue({
        props: {
            queryBuilderProps: {
                default: {
                    pageName: "page",
                    defaultSort: null,
                    defaultVisibleToggleableColumns: ["id"],
                    columns: [{ key: "id", label: "ID", sortable: false, hidden: false, can_be_hidden: false }],
                    filters: [],
                    searchInputs: [],
                    searchInputsWithoutGlobal: [],
                    perPageOptions: [15],
                    hasFilters: false,
                    hasEnabledFilters: false,
                    hasSearchInputs: false,
                    hasToggleableColumns: false,
                    globalSearch: null,
                    sort: null,
                    cursor: null,
                    page: 1,
                },
            },
        },
    });
    return mount(Table, {
        global: { provide: { themeVariables: {} } },
        props: { resource: { data: [], links: [], meta: emptyMeta } },
    });
}

const count = (text) => text.split("No results found").length - 1;

describe("empty message", () => {
    it("an empty Table shows the message exactly once", () => {
        const wrapper = mountEmptyTable();
        expect(count(wrapper.text())).toBe(1);
        // ...in the table row, not in the pagination bar.
        expect(wrapper.find("td").text()).toContain("No results found");
        expect(wrapper.find("nav").exists()).toBe(true);
        expect(wrapper.find("nav").text()).not.toContain("No results found");
    });

    it("standalone Pagination with no data still shows the message", () => {
        const wrapper = mount(Pagination, {
            props: { hasData: false, meta: emptyMeta },
            global: { provide: { themeVariables: {} } },
        });
        expect(count(wrapper.text())).toBe(1);
    });

    it("standalone Pagination can hide the message with showEmptyMessage=false", () => {
        const wrapper = mount(Pagination, {
            props: { hasData: false, meta: emptyMeta, showEmptyMessage: false },
            global: { provide: { themeVariables: {} } },
        });
        expect(count(wrapper.text())).toBe(0);
    });
});
