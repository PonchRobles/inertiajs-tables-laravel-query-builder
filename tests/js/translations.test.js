import { describe, it, expect, vi, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
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
});
