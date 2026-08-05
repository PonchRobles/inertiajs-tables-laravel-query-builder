import { ref } from "vue";

export function useTableState(queryBuilderData, queryBuilderProps, inputDebounceMs, forcedVisibleSearchInputs, visitCancelToken, preventOverlappingRequests) {

    const debounceTimeouts = {};

    function findDataKey(dataKey, key) {
        const items = queryBuilderData.value[dataKey];
        if (!items) return -1;

        for (const idx of Object.keys(items)) {
            if (items[idx].key === key) {
                return idx;
            }
        }
        return -1;
    }

    function changeSearchInputValue(key, value) {
        clearTimeout(debounceTimeouts[key]);

        debounceTimeouts[key] = setTimeout(() => {
            if (visitCancelToken.value && preventOverlappingRequests.value) {
                visitCancelToken.value.cancel();
            }

            const intKey = findDataKey("searchInputs", key);

            queryBuilderData.value.searchInputs[intKey].value = value;
            queryBuilderData.value.cursor = null;
            queryBuilderData.value.page = 1;
        }, inputDebounceMs.value);
    }

    function changeGlobalSearchValue(value) {
        changeSearchInputValue("global", value);
    }

    function changeFilterValue(key, value) {
        const intKey = findDataKey("filters", key);
        queryBuilderData.value.filters[intKey].value = value;
        queryBuilderData.value.cursor = null;
        queryBuilderData.value.page = 1;
    }

    function onPerPageChange(value) {
        queryBuilderData.value.cursor = null;
        queryBuilderData.value.perPage = value;
        queryBuilderData.value.page = 1;
    }

    function changeColumnStatus(key, visible) {
        const intKey = findDataKey("columns", key);
        queryBuilderData.value.columns[intKey].hidden = !visible;
    }

    function disableSearchInput(key) {
        forcedVisibleSearchInputs.value = forcedVisibleSearchInputs.value.filter((search) => search !== key);
        changeSearchInputValue(key, null);
    }

    function showSearchInput(key) {
        forcedVisibleSearchInputs.value.push(key);
    }

    function sortBy(column) {
        if (queryBuilderData.value.sort === column) {
            queryBuilderData.value.sort = `-${column}`;
        } else {
            queryBuilderData.value.sort = column;
        }
        queryBuilderData.value.cursor = null;
        queryBuilderData.value.page = 1;
    }

    function show(key) {
        const intKey = findDataKey("columns", key);
        return !queryBuilderData.value.columns[intKey]?.hidden;
    }

    function header(key) {
        const intKey = findDataKey("columns", key);
        const columnData = { ...queryBuilderProps.value.columns[intKey] };
        columnData.onSort = sortBy;
        return columnData;
    }

    return {
        changeSearchInputValue,
        changeGlobalSearchValue,
        changeFilterValue,
        onPerPageChange,
        changeColumnStatus,
        disableSearchInput,
        showSearchInput,
        sortBy,
        show,
        header,
    };
}
