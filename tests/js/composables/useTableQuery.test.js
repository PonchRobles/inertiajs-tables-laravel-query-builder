import { describe, it, expect, beforeEach, vi } from "vitest";
import { ref, reactive } from "vue";
const { usePage } = vi.hoisted(() => ({ usePage: vi.fn() }));
vi.mock("@inertiajs/vue3", () => ({ usePage }));

import { useTableQuery } from "../../../js/composables/useTableQuery.js";

function setup({ data = {}, props = {}, name = "default", pageName = "page", forced = [] } = {}) {
    const queryBuilderData = ref({
        filters: {},
        searchInputs: {},
        columns: {},
        sort: null,
        cursor: null,
        page: 1,
        perPage: null,
        ...data,
    });
    const queryBuilderProps = ref({
        defaultSort: null,
        defaultVisibleToggleableColumns: [],
        ...props,
    });
    const forcedVisibleSearchInputs = ref(forced);
    const api = useTableQuery(
        queryBuilderData,
        queryBuilderProps,
        ref(name),
        ref(pageName),
        forcedVisibleSearchInputs
    );
    return { queryBuilderData, queryBuilderProps, forcedVisibleSearchInputs, ...api };
}

// Inertia's reactive page: its url changes after every visit.
const inertiaPage = reactive({ url: "/" });
usePage.mockReturnValue(inertiaPage);

function setUrl(search) {
    window.history.replaceState({}, "", "/" + search);
    inertiaPage.url = "/" + search;
}

describe("useTableQuery", () => {
    beforeEach(() => setUrl(""));

    describe("generateNewQueryString", () => {
        it("returns an empty string with no state", () => {
            expect(setup().generateNewQueryString()).toBe("");
        });

        it("adds the sort", () => {
            const { generateNewQueryString } = setup({ data: { sort: "-name" } });
            expect(generateNewQueryString()).toBe("sort=-name");
        });

        it("adds the page only when greater than 1", () => {
            expect(setup({ data: { page: 1 } }).generateNewQueryString()).toBe("");
            expect(setup({ data: { page: 3 } }).generateNewQueryString()).toBe("page=3");
        });

        it("uses the custom page name", () => {
            const { generateNewQueryString } = setup({ data: { page: 2 }, pageName: "usersPage" });
            expect(generateNewQueryString()).toBe("usersPage=2");
        });

        it("adds perPage only when greater than 1", () => {
            expect(setup({ data: { perPage: 1 } }).generateNewQueryString()).toBe("");
            expect(setup({ data: { perPage: 0 } }).generateNewQueryString()).toBe("");
            expect(setup({ data: { perPage: null } }).generateNewQueryString()).toBe("");
            expect(setup({ data: { perPage: 30 } }).generateNewQueryString()).toBe("perPage=30");
        });

        it("adds the cursor", () => {
            const { generateNewQueryString } = setup({ data: { cursor: "abc" } });
            expect(generateNewQueryString()).toBe("cursor=abc");
        });

        it("adds filters and search inputs with a value, skipping nulls and empty strings", () => {
            const { generateNewQueryString } = setup({
                data: {
                    searchInputs: {
                        0: { key: "global", value: "foo" },
                        1: { key: "name", value: null },
                    },
                    filters: {
                        0: { key: "role", type: "select", value: "admin" },
                        1: { key: "empty", type: "select", value: "" },
                        2: { key: "unset", type: "select", value: null },
                    },
                },
            });
            const query = decodeURIComponent(generateNewQueryString());
            expect(query).toContain("filter[global]=foo");
            expect(query).toContain("filter[role]=admin");
            expect(query).not.toContain("name");
            expect(query).not.toContain("empty");
            expect(query).not.toContain("unset");
        });

        it("omits a number_range filter that spans its full range", () => {
            const full = setup({
                data: { filters: { 0: { key: "age", type: "number_range", value: [0, 100], min: 0, max: 100 } } },
            });
            expect(full.generateNewQueryString()).toBe("");

            const partial = setup({
                data: { filters: { 0: { key: "age", type: "number_range", value: [10, 100], min: 0, max: 100 } } },
            });
            const query = decodeURIComponent(partial.generateNewQueryString());
            expect(query).toContain("filter[age][0]=10");
            expect(query).toContain("filter[age][1]=100");
        });

        it("adds visible columns only when they differ from the defaults", () => {
            const columns = {
                0: { key: "a", hidden: false },
                1: { key: "b", hidden: true },
            };
            const same = setup({ data: { columns }, props: { defaultVisibleToggleableColumns: ["a"] } });
            expect(same.generateNewQueryString()).toBe("");

            const different = setup({ data: { columns }, props: { defaultVisibleToggleableColumns: ["a", "b"] } });
            expect(decodeURIComponent(different.generateNewQueryString())).toBe("columns[0]=a");
        });

        it("prefixes filter, sort, columns and cursor and perPage for named tables", () => {
            const { generateNewQueryString } = setup({
                name: "users",
                data: { sort: "name", cursor: "c1", perPage: 50, page: 2 },
            });
            const query = decodeURIComponent(generateNewQueryString());
            expect(query).toContain("users_sort=name");
            expect(query).toContain("users_cursor=c1");
            expect(query).toContain("users_perPage=50");
            expect(query).not.toMatch(/(^|&)perPage=/);
            expect(query).toContain("page=2");
        });

        it("keeps the plain perPage for the default table", () => {
            const query = setup({ data: { perPage: 50 } }).generateNewQueryString();
            expect(query).toBe("perPage=50");
        });

        it("keeps independent perPage values for two named tables", () => {
            setUrl("?posts_perPage=30");
            const users = setup({ name: "users", data: { perPage: 50 } });
            const query = decodeURIComponent(users.generateNewQueryString());
            expect(query).toContain("users_perPage=50");
            expect(query).toContain("posts_perPage=30");

            setUrl("?users_perPage=50&posts_perPage=30");
            const posts = setup({ name: "posts", data: { perPage: 100 } });
            const query2 = decodeURIComponent(posts.generateNewQueryString());
            expect(query2).toContain("users_perPage=50");
            expect(query2).toContain("posts_perPage=100");
        });

        it("preserves unrelated query params and drops stale table params", () => {
            setUrl("?foo=bar&sort=old&page=4&filter[x]=1");
            const { generateNewQueryString } = setup({ data: { sort: "new" } });
            const query = decodeURIComponent(generateNewQueryString());
            expect(query).toContain("foo=bar");
            expect(query).toContain("sort=new");
            expect(query).not.toContain("old");
            expect(query).not.toContain("page=4");
            expect(query).not.toContain("filter");
        });

        it("only touches params of its own named table", () => {
            setUrl("?other_sort=zzz&users_sort=old");
            const { generateNewQueryString } = setup({ name: "users", data: { sort: "name" } });
            const query = decodeURIComponent(generateNewQueryString());
            expect(query).toContain("other_sort=zzz");
            expect(query).toContain("users_sort=name");
            expect(query).not.toContain("old");
        });
    });

    describe("resetQuery", () => {
        it("clears filters, search inputs, sort, cursor and resets the page", () => {
            const { resetQuery, queryBuilderData, forcedVisibleSearchInputs } = setup({
                forced: ["name"],
                data: {
                    filters: { 0: { key: "role", value: "admin" } },
                    searchInputs: { 0: { key: "name", value: "foo" } },
                    sort: "-name",
                    cursor: "abc",
                    page: 5,
                },
            });
            resetQuery();
            expect(queryBuilderData.value.filters[0].value).toBeNull();
            expect(queryBuilderData.value.searchInputs[0].value).toBeNull();
            expect(queryBuilderData.value.sort).toBeNull();
            expect(queryBuilderData.value.cursor).toBeNull();
            expect(queryBuilderData.value.page).toBe(1);
            expect(forcedVisibleSearchInputs.value).toEqual([]);
        });

        it("restores default column visibility", () => {
            const { resetQuery, queryBuilderData } = setup({
                data: {
                    columns: {
                        0: { key: "a", can_be_hidden: true, hidden: true },
                        1: { key: "b", can_be_hidden: true, hidden: false },
                        2: { key: "c", can_be_hidden: false, hidden: true },
                    },
                },
                props: { defaultVisibleToggleableColumns: ["a"] },
            });
            resetQuery();
            expect(queryBuilderData.value.columns[0].hidden).toBe(false);
            expect(queryBuilderData.value.columns[1].hidden).toBe(true);
            expect(queryBuilderData.value.columns[2].hidden).toBe(false);
        });
    });

    describe("canBeReset (reactive Inertia page url)", () => {
        it("is false on a clean URL", () => {
            expect(setup().canBeReset.value).toBe(false);
        });

        it("is true when a search input is forced visible", () => {
            expect(setup({ forced: ["name"] }).canBeReset.value).toBe(true);
        });

        it("is true for page > 1 and false for page 1", () => {
            setUrl("?page=2");
            expect(setup().canBeReset.value).toBe(true);
            setUrl("?page=1");
            expect(setup().canBeReset.value).toBe(false);
        });

        it("is true for filter, columns, cursor or sort in the URL", () => {
            for (const search of ["?filter[a]=1", "?columns[0]=a", "?cursor=x", "?sort=name"]) {
                setUrl(search);
                expect(setup().canBeReset.value, search).toBe(true);
            }
        });

        it("ignores a sort equal to the default sort", () => {
            setUrl("?sort=name");
            expect(setup({ props: { defaultSort: "name" } }).canBeReset.value).toBe(false);
        });

        it("respects the table prefix and custom page name", () => {
            setUrl("?sort=name");
            expect(setup({ name: "users" }).canBeReset.value).toBe(false);
            setUrl("?users_sort=name");
            expect(setup({ name: "users" }).canBeReset.value).toBe(true);
            setUrl("?usersPage=3");
            expect(setup({ pageName: "usersPage" }).canBeReset.value).toBe(true);
        });

        it("ignores the hash and works with a full path url", () => {
            inertiaPage.url = "/products?sort=name#top";
            expect(setup().canBeReset.value).toBe(true);
            inertiaPage.url = "/products#top";
            expect(setup().canBeReset.value).toBe(false);
        });

        it("is not fooled by server-side default values on a clean URL", () => {
            const { canBeReset } = setup({
                props: {
                    hasEnabledFilters: true,
                    searchInputs: [{ key: "name", value: "x" }],
                },
            });
            expect(canBeReset.value).toBe(false);
        });

        it("follows the page url through reset and later navigation", () => {
            setUrl("?filter[name]=john");
            const { canBeReset } = setup();
            expect(canBeReset.value).toBe(true);

            // The reset visit completed: Inertia updates the page url.
            setUrl("");
            expect(canBeReset.value).toBe(false);

            // Navigating with new params brings the button back.
            setUrl("?sort=name");
            expect(canBeReset.value).toBe(true);
        });

        it("does not read location.search", () => {
            window.history.replaceState({}, "", "/?sort=name&page=3");
            inertiaPage.url = "/";
            expect(setup().canBeReset.value).toBe(false);
        });
    });
});
