import { describe, it, expect, vi, afterEach } from "vitest";
import { mount } from "@vue/test-utils";

const { get, usePage } = vi.hoisted(() => ({ get: vi.fn(), usePage: vi.fn() }));
vi.mock("@inertiajs/vue3", () => ({ router: { get }, usePage }));

import Table from "../../js/Components/Table.vue";
import { setTranslations } from "../../js/translations.js";

function mountTable(label) {
    const globalSearch = { key: "global", label, value: "" };
    usePage.mockReturnValue({
        props: {
            queryBuilderProps: {
                default: {
                    pageName: "page",
                    defaultSort: null,
                    defaultVisibleToggleableColumns: ["id"],
                    columns: [{ key: "id", label: "ID", sortable: false, hidden: false, can_be_hidden: false }],
                    filters: [],
                    searchInputs: [globalSearch],
                    searchInputsWithoutGlobal: [],
                    perPageOptions: [15],
                    hasFilters: false,
                    hasEnabledFilters: false,
                    hasSearchInputs: false,
                    hasToggleableColumns: false,
                    globalSearch,
                    sort: null,
                    cursor: null,
                    page: 1,
                },
            },
        },
    });
    return mount(Table, {
        global: { provide: { themeVariables: {} } },
        props: { resource: { data: [{ id: 1 }], links: [], meta: {} } },
    });
}

describe("Table global search placeholder", () => {
    afterEach(() => setTranslations({}));

    it("uses the search translation when the backend sends a null label", () => {
        setTranslations({ search: "Buscar..." });
        const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
        const wrapper = mountTable(null);
        expect(wrapper.find("input[name='global']").attributes("placeholder")).toBe("Buscar...");
        expect(warn).not.toHaveBeenCalled();
        warn.mockRestore();
    });

    it("uses the default English translation when nothing is customised", () => {
        const wrapper = mountTable(null);
        expect(wrapper.find("input[name='global']").attributes("placeholder")).toBe("Search...");
    });

    it("an explicit backend label wins over the translation", () => {
        setTranslations({ search: "Buscar..." });
        const wrapper = mountTable("Find users");
        expect(wrapper.find("input[name='global']").attributes("placeholder")).toBe("Find users");
    });
});
