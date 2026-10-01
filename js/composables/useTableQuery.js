import { computed } from "vue";
import qs from "qs";

export function useTableQuery(queryBuilderData, queryBuilderProps, tableName, pageName, forcedVisibleSearchInputs) {

    // Derived from the server state (queryBuilderProps, which is reactive and replaced after every
    // Inertia visit), not from `location.search`, which is not reactive.
    const canBeReset = computed(() => {
        if (forcedVisibleSearchInputs.value.length > 0) {
            return true;
        }

        const props = queryBuilderProps.value;

        if (props.page > 1) {
            return true;
        }

        if (props.cursor) {
            return true;
        }

        if (props.sort && props.sort !== props.defaultSort) {
            return true;
        }

        if (props.hasEnabledFilters) {
            return true;
        }

        if (Object.values(props.searchInputs ?? {}).some((input) => input.value !== null && input.value !== undefined)) {
            return true;
        }

        if (props.columns && props.defaultVisibleToggleableColumns) {
            const visibleKeys = Object.values(props.columns)
                .filter((column) => !column.hidden)
                .map((column) => column.key)
                .sort();
            const defaultKeys = [...props.defaultVisibleToggleableColumns].sort();

            if (visibleKeys.length !== defaultKeys.length || visibleKeys.some((key, i) => key !== defaultKeys[i])) {
                return true;
            }
        }

        return false;
    });

    function resetQuery() {
        forcedVisibleSearchInputs.value = [];

        if (queryBuilderData.value.filters) {
            for (const key of Object.keys(queryBuilderData.value.filters)) {
                queryBuilderData.value.filters[key].value = null;
            }
        }

        if (queryBuilderData.value.searchInputs) {
            for (const key of Object.keys(queryBuilderData.value.searchInputs)) {
                queryBuilderData.value.searchInputs[key].value = null;
            }
        }

        if (queryBuilderData.value.columns) {
            for (const key of Object.keys(queryBuilderData.value.columns)) {
                const column = queryBuilderData.value.columns[key];
                queryBuilderData.value.columns[key].hidden = column.can_be_hidden
                    ? !queryBuilderProps.value.defaultVisibleToggleableColumns.includes(column.key)
                    : false;
            }
        }

        queryBuilderData.value.sort = null;
        queryBuilderData.value.cursor = null;
        queryBuilderData.value.page = 1;
    }

    function getFilterForQuery() {
        const filtersWithValue = {};

        if (queryBuilderData.value.searchInputs) {
            for (const searchInput of Object.values(queryBuilderData.value.searchInputs)) {
                if (searchInput.value !== null) {
                    filtersWithValue[searchInput.key] = searchInput.value;
                }
            }
        }

        if (queryBuilderData.value.filters) {
            for (const filter of Object.values(queryBuilderData.value.filters)) {
                let value = filter.value;
                if (value !== null) {
                    if (
                        filter.type === "number_range"
                        && Number(Math.max(...filter.value)) === Number(filter.max)
                        && Number(Math.min(...filter.value)) === Number(filter.min)
                    ) {
                        value = null;
                    }
                    filtersWithValue[filter.key] = value;
                }
            }
        }

        return filtersWithValue;
    }

    function getColumnsForQuery() {
        const columns = queryBuilderData.value.columns;
        if (!columns) return {};

        const visibleColumnKeys = Object.values(columns)
            .filter((column) => !column.hidden)
            .map((column) => column.key)
            .sort();

        const defaultKeys = [...queryBuilderProps.value.defaultVisibleToggleableColumns].sort();

        if (
            visibleColumnKeys.length === defaultKeys.length
            && visibleColumnKeys.every((key, i) => key === defaultKeys[i])
        ) {
            return {};
        }

        return visibleColumnKeys;
    }

    function dataForNewQueryString() {
        const filterForQuery = getFilterForQuery();
        const columnsForQuery = getColumnsForQuery();
        const queryData = {};

        if (Object.keys(filterForQuery).length > 0) {
            queryData.filter = filterForQuery;
        }

        if (Array.isArray(columnsForQuery) ? columnsForQuery.length > 0 : Object.keys(columnsForQuery).length > 0) {
            queryData.columns = columnsForQuery;
        }

        const cursor = queryBuilderData.value.cursor;
        const page = queryBuilderData.value.page;
        const sort = queryBuilderData.value.sort;
        const perPage = queryBuilderData.value.perPage;

        if (cursor) queryData.cursor = cursor;
        if (page > 1) queryData.page = page;
        if (perPage > 1) queryData.perPage = perPage;
        if (sort) queryData.sort = sort;

        return queryData;
    }

    function generateNewQueryString() {
        const queryStringData = qs.parse(location.search.substring(1));
        const prefix = tableName.value === "default" ? "" : (tableName.value + "_");

        for (const key of ["filter", "columns", "cursor", "sort", "perPage"]) {
            delete queryStringData[prefix + key];
        }

        delete queryStringData[pageName.value];

        const newData = dataForNewQueryString();
        for (const [key, value] of Object.entries(newData)) {
            if (key === "page") {
                queryStringData[pageName.value] = value;
            } else if (key === "perPage") {
                queryStringData[prefix + "perPage"] = value;
            } else {
                queryStringData[prefix + key] = value;
            }
        }

        let query = qs.stringify(queryStringData, {
            filter(prefix, value) {
                if (typeof value === "object" && value !== null) {
                    return Object.fromEntries(
                        Object.entries(value).filter(([, v]) => v !== null && v !== undefined && v !== "")
                    );
                }
                return value;
            },
            skipNulls: true,
            strictNullHandling: true,
        });

        if (!query || query === (pageName.value + "=1")) {
            query = "";
        }

        return query;
    }

    return {
        canBeReset,
        resetQuery,
        generateNewQueryString,
    };
}
