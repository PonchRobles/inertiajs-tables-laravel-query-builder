import { describe, it, expect, vi, afterEach } from "vitest";
import { nextTick } from "vue";
import { mount } from "@vue/test-utils";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import TableSearchRows from "../../js/Components/TableSearchRows.vue";
import ToggleFilter from "../../js/Components/TableFilters/ToggleFilter.vue";
import ToggleSwitch from "../../js/Components/ToggleSwitch.vue";
import TableReset from "../../js/Components/TableReset.vue";
import Pagination from "../../js/Components/Pagination.vue";
import TableGlobalSearch from "../../js/Components/TableGlobalSearch.vue";
import GroupedActions from "../../js/Components/GroupedActions.vue";
import defaults, { getTranslations, setTranslation, setTranslations } from "../../js/translations.js";

vi.mock("@floating-ui/dom", () => ({
    computePosition: vi.fn(() => new Promise(() => {})),
    flip: vi.fn(),
    shift: vi.fn(),
}));

function vueFiles(dir) {
    return readdirSync(dir).flatMap((name) => {
        const path = join(dir, name);
        if (statSync(path).isDirectory()) {
            return vueFiles(path);
        }
        return path.endsWith(".vue") ? [path] : [];
    });
}

function usedKeys() {
    const keys = new Set();
    for (const file of vueFiles("js/Components")) {
        const source = readFileSync(file, "utf8");
        for (const match of source.matchAll(/translations\.(?!js\b)([A-Za-z_]\w*)/g)) {
            keys.add(match[1]);
        }
        for (const match of source.matchAll(/translations\[\s*['"]([^'"]+)['"]\s*\]/g)) {
            keys.add(match[1]);
        }
    }
    return [...keys];
}

const defaultKeys = Object.keys(defaults);
const originalDefaults = { ...defaults };

afterEach(() => {
    setTranslations({});
});

describe("translations", () => {
    it("finds keys referenced in components", () => {
        expect(usedKeys().length).toBeGreaterThan(0);
    });

    it("defines a default for every key used in components", () => {
        const missing = usedKeys().filter((key) => !defaultKeys.includes(key));
        expect(missing).toEqual([]);
    });

    it("defines the grouped actions keys", () => {
        expect(originalDefaults.add_search_fields).toBe("Add search field");
        expect(originalDefaults.show_hide_columns).toBe("Show / Hide columns");
        expect(originalDefaults.grouped_reset).toBe("Reset");
    });

    it("GroupedActions falls back to English when setTranslations gets an empty object", () => {
        setTranslations({});

        const wrapper = mount(GroupedActions, {
            props: {
                actions: {
                    searchFields: { show: true, searchInputs: [], onClick: () => {} },
                    toggleColumns: { show: true, columns: [], onChange: () => {} },
                    reset: { onClick: () => {} },
                },
            },
        });
        const text = wrapper.text();
        expect(text).toContain("Add search field");
        expect(text).toContain("Show / Hide columns");
        expect(text).toContain("Reset");
    });

    it("GroupedActions renders overridden translations", () => {
        setTranslations({
            ...originalDefaults,
            add_search_fields: "Anadir campo",
            show_hide_columns: "Mostrar u ocultar",
            grouped_reset: "Restablecer",
        });
        expect(getTranslations().grouped_reset).toBe("Restablecer");

        const wrapper = mount(GroupedActions, {
            props: {
                actions: {
                    searchFields: { show: true, searchInputs: [], onClick: () => {} },
                    toggleColumns: { show: true, columns: [], onChange: () => {} },
                    reset: { onClick: () => {} },
                },
            },
        });
        const text = wrapper.text();
        expect(text).toContain("Anadir campo");
        expect(text).toContain("Mostrar u ocultar");
        expect(text).toContain("Restablecer");
    });

    it("a partial setTranslations keeps defaults for missing keys", () => {
        setTranslations({ next: "Siguiente" });

        expect(getTranslations().next).toBe("Siguiente");
        expect(getTranslations().previous).toBe(originalDefaults.previous);
        expect(getTranslations().of).toBe(originalDefaults.of);
        expect(getTranslations().search).toBe(originalDefaults.search);
    });

    it("a full setTranslations overrides every key", () => {
        const full = Object.fromEntries(defaultKeys.map((key) => [key, `x-${key}`]));
        setTranslations(full);

        expect(getTranslations()).toEqual(full);
    });

    it("setTranslations does not carry over overrides from a previous call", () => {
        setTranslations({ next: "Siguiente" });
        setTranslations({ previous: "Anterior" });

        expect(getTranslations().next).toBe(originalDefaults.next);
        expect(getTranslations().previous).toBe("Anterior");
    });

    it("setTranslation overrides a single key", () => {
        setTranslation("next", "Siguiente");

        expect(getTranslations().next).toBe("Siguiente");
        expect(getTranslations().previous).toBe(originalDefaults.previous);
    });

    it("restores defaults between tests", () => {
        expect(getTranslations()).toEqual(originalDefaults);
    });

    it("TableGlobalSearch uses the search translation as placeholder", () => {
        setTranslations({ search: "Buscar..." });

        const wrapper = mount(TableGlobalSearch, { props: { onChange: () => {} } });
        expect(wrapper.find("input").attributes("placeholder")).toBe("Buscar...");
    });

    it("TableGlobalSearch label prop wins over the search translation", () => {
        setTranslations({ search: "Buscar..." });

        const wrapper = mount(TableGlobalSearch, { props: { label: "Find users", onChange: () => {} } });
        expect(wrapper.find("input").attributes("placeholder")).toBe("Find users");
    });

    it("keeps one stable object across calls (default export and getTranslations)", () => {
        const before = getTranslations();
        setTranslations({ next: "Siguiente" });
        setTranslation("previous", "Anterior");
        expect(getTranslations()).toBe(before);
        expect(defaults).toBe(before);
    });

    it("does not keep keys from an earlier setTranslations call, even custom ones", () => {
        setTranslations({ custom_key: "x", next: "Siguiente" });
        expect(getTranslations().custom_key).toBe("x");

        setTranslations({ previous: "Anterior" });
        expect(getTranslations().custom_key).toBeUndefined();
        expect(getTranslations().next).toBe(originalDefaults.next);
        expect(getTranslations().previous).toBe("Anterior");
    });

    describe("mounted components update", () => {
        const paginationProps = {
            hasData: true,
            meta: { total: 30, per_page: 15, from: 1, to: 15, prev_page_url: null, next_page_url: "/p?page=2", links: [] },
        };

        it("TableReset follows setTranslations() called after mount", async () => {
            const wrapper = mount(TableReset, { props: { onClick: () => {} } });
            expect(wrapper.text()).toContain("Reset");

            setTranslations({ reset: "Reiniciar" });
            await nextTick();
            expect(wrapper.text()).toContain("Reiniciar");
            expect(wrapper.text()).not.toContain("Reset");
        });

        it("TableReset follows setTranslation() called after mount", async () => {
            const wrapper = mount(TableReset, { props: { onClick: () => {} } });

            setTranslation("reset", "Restablecer");
            await nextTick();
            expect(wrapper.text()).toContain("Restablecer");
        });

        it("Pagination follows setTranslations() and setTranslation() called after mount", async () => {
            const wrapper = mount(Pagination, { props: paginationProps, global: { provide: { themeVariables: {} } } });
            expect(wrapper.text()).toContain("Next");
            expect(wrapper.text()).toContain("per page");

            setTranslations({ next: "Siguiente", per_page: "por pagina" });
            await nextTick();
            expect(wrapper.text()).toContain("Siguiente");
            expect(wrapper.text()).toContain("por pagina");

            setTranslation("next", "Proxima");
            await nextTick();
            expect(wrapper.text()).toContain("Proxima");
        });

        const searchRows = () => mount(TableSearchRows, {
            props: {
                searchInputs: [{ key: "name", label: "Name", value: "x" }],
                forcedVisibleSearchInputs: [],
                onChange: () => {},
                onRemove: () => {},
            },
        });
        const toggleFilter = () => mount(ToggleFilter, {
            props: { filter: { key: "active", value: null }, onFilterChange: () => {} },
        });

        it("the remove search label defaults to English in TableSearchRows and ToggleFilter", () => {
            expect(searchRows().text()).toContain("Remove search");
            expect(toggleFilter().text()).toContain("Remove search");
        });

        it("the remove search label follows setTranslations() and setTranslation() after mount", async () => {
            const rows = searchRows();
            const toggle = toggleFilter();

            setTranslations({ remove_search: "Quitar busqueda" });
            await nextTick();
            expect(rows.text()).toContain("Quitar busqueda");
            expect(toggle.text()).toContain("Quitar busqueda");

            setTranslation("remove_search", "Eliminar");
            await nextTick();
            expect(rows.text()).toContain("Eliminar");
            expect(toggle.text()).toContain("Eliminar");
        });

        it("the ToggleSwitch label defaults to English and follows setTranslations() after mount", async () => {
            const wrapper = mount(ToggleSwitch, { props: { modelValue: false } });
            expect(wrapper.find(".sr-only").text()).toBe("Toggle");

            setTranslations({ toggle: "Alternar" });
            await nextTick();
            expect(wrapper.find(".sr-only").text()).toBe("Alternar");

            setTranslation("toggle", "Cambiar");
            await nextTick();
            expect(wrapper.find(".sr-only").text()).toBe("Cambiar");
        });

        it("TableGlobalSearch placeholder follows the search translation after mount", async () => {
            const wrapper = mount(TableGlobalSearch, { props: { onChange: () => {} } });
            expect(wrapper.find("input").attributes("placeholder")).toBe("Search...");

            setTranslation("search", "Buscar...");
            await nextTick();
            expect(wrapper.find("input").attributes("placeholder")).toBe("Buscar...");
        });
    });
});
