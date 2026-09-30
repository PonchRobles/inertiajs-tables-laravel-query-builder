import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ref } from "vue";
import { useTableState } from "../../../js/composables/useTableState.js";

function setup({ token = null, prevent = true, debounce = 100 } = {}) {
    const queryBuilderData = ref({
        filters: { 0: { key: "role", value: null } },
        searchInputs: {
            0: { key: "global", value: null },
            1: { key: "name", value: null },
        },
        columns: {
            0: { key: "id", hidden: false },
            1: { key: "email", hidden: true },
        },
        sort: null,
        cursor: "cur",
        page: 4,
        perPage: 15,
    });
    const queryBuilderProps = ref({
        columns: { 0: { key: "id", label: "ID" }, 1: { key: "email", label: "Email" } },
    });
    const forced = ref([]);
    const visitCancelToken = ref(token);
    const api = useTableState(
        queryBuilderData,
        queryBuilderProps,
        ref(debounce),
        forced,
        visitCancelToken,
        ref(prevent)
    );
    return { queryBuilderData, forced, visitCancelToken, ...api };
}

describe("useTableState", () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    it("changeFilterValue sets the value and resets cursor and page", () => {
        const { changeFilterValue, queryBuilderData } = setup();
        changeFilterValue("role", "admin");
        expect(queryBuilderData.value.filters[0].value).toBe("admin");
        expect(queryBuilderData.value.cursor).toBeNull();
        expect(queryBuilderData.value.page).toBe(1);
    });

    it("changeSearchInputValue is debounced and resets cursor and page", () => {
        const { changeSearchInputValue, queryBuilderData } = setup();
        changeSearchInputValue("name", "foo");
        vi.advanceTimersByTime(99);
        expect(queryBuilderData.value.searchInputs[1].value).toBeNull();
        vi.advanceTimersByTime(1);
        expect(queryBuilderData.value.searchInputs[1].value).toBe("foo");
        expect(queryBuilderData.value.cursor).toBeNull();
        expect(queryBuilderData.value.page).toBe(1);
    });

    it("only applies the last value of rapid search changes", () => {
        const { changeSearchInputValue, queryBuilderData } = setup();
        changeSearchInputValue("name", "a");
        vi.advanceTimersByTime(50);
        changeSearchInputValue("name", "ab");
        vi.advanceTimersByTime(100);
        expect(queryBuilderData.value.searchInputs[1].value).toBe("ab");
    });

    it("changeGlobalSearchValue targets the global search input", () => {
        const { changeGlobalSearchValue, queryBuilderData } = setup();
        changeGlobalSearchValue("hello");
        vi.advanceTimersByTime(100);
        expect(queryBuilderData.value.searchInputs[0].value).toBe("hello");
    });

    it("cancels the in-flight visit when overlapping requests are prevented", () => {
        const cancel = vi.fn();
        const { changeSearchInputValue } = setup({ token: { cancel } });
        changeSearchInputValue("name", "x");
        vi.advanceTimersByTime(100);
        expect(cancel).toHaveBeenCalledOnce();
    });

    it("does not cancel the in-flight visit when overlapping requests are allowed", () => {
        const cancel = vi.fn();
        const { changeSearchInputValue } = setup({ token: { cancel }, prevent: false });
        changeSearchInputValue("name", "x");
        vi.advanceTimersByTime(100);
        expect(cancel).not.toHaveBeenCalled();
    });

    it("onPerPageChange sets perPage and resets cursor and page", () => {
        const { onPerPageChange, queryBuilderData } = setup();
        onPerPageChange(50);
        expect(queryBuilderData.value.perPage).toBe(50);
        expect(queryBuilderData.value.cursor).toBeNull();
        expect(queryBuilderData.value.page).toBe(1);
    });

    it("sortBy sorts ascending, then descending on the same column, and resets the page", () => {
        const { sortBy, queryBuilderData } = setup();
        sortBy("id");
        expect(queryBuilderData.value.sort).toBe("id");
        expect(queryBuilderData.value.page).toBe(1);
        expect(queryBuilderData.value.cursor).toBeNull();
        sortBy("id");
        expect(queryBuilderData.value.sort).toBe("-id");
        sortBy("email");
        expect(queryBuilderData.value.sort).toBe("email");
    });

    it("changeColumnStatus toggles the hidden flag", () => {
        const { changeColumnStatus, show, queryBuilderData } = setup();
        changeColumnStatus("id", false);
        expect(queryBuilderData.value.columns[0].hidden).toBe(true);
        expect(show("id")).toBe(false);
        changeColumnStatus("email", true);
        expect(show("email")).toBe(true);
    });

    it("header returns column data with the sort callback", () => {
        const { header, sortBy } = setup();
        const column = header("email");
        expect(column.label).toBe("Email");
        expect(column.onSort).toBe(sortBy);
    });

    it("showSearchInput adds and disableSearchInput removes a forced-visible input and clears its value", () => {
        const { showSearchInput, disableSearchInput, forced, queryBuilderData } = setup();
        showSearchInput("name");
        expect(forced.value).toEqual(["name"]);
        queryBuilderData.value.searchInputs[1].value = "foo";
        disableSearchInput("name");
        expect(forced.value).toEqual([]);
        vi.advanceTimersByTime(100);
        expect(queryBuilderData.value.searchInputs[1].value).toBeNull();
    });
});
