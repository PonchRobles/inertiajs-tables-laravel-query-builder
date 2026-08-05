<template>
  <Transition>
    <fieldset
      ref="tableFieldset"
      :key="`table-${name}`"
      :dusk="`table-${name}`"
      class="min-w-0"
      :class="{'opacity-75': isVisiting}"
    >
      <div class="flex flex-row flex-wrap sm:flex-nowrap justify-start px-4 sm:px-0">
        <div
          v-if="queryBuilderProps.globalSearch"
          class="flex flex-row w-full sm:w-auto sm:grow mb-2 sm:mb-0 sm:mr-4"
        >
          <slot
            name="tableGlobalSearch"
            :has-global-search="queryBuilderProps.globalSearch"
            :label="queryBuilderProps.globalSearch ? queryBuilderProps.globalSearch.label : null"
            :value="queryBuilderProps.globalSearch ? queryBuilderProps.globalSearch.value : null"
            :on-change="changeGlobalSearchValue"
          >
            <TableGlobalSearch
              v-if="queryBuilderProps.globalSearch"
              class="grow"
              :label="queryBuilderProps.globalSearch.label"
              :value="queryBuilderProps.globalSearch.value"
              :on-change="changeGlobalSearchValue"
              :color="color"
            />
          </slot>
        </div>

        <div class="mr-2 sm:mr-4">
          <slot
            name="tableFilter"
            :has-filters="queryBuilderProps.hasFilters"
            :has-enabled-filters="queryBuilderProps.hasEnabledFilters"
            :filters="queryBuilderProps.filters"
            :on-filter-change="changeFilterValue"
          >
            <TableFilter
              v-if="queryBuilderProps.hasFilters"
              :has-enabled-filters="queryBuilderProps.hasEnabledFilters"
              :filters="queryBuilderProps.filters"
              :on-filter-change="changeFilterValue"
              :color="color"
            />
          </slot>
        </div>

        <slot
          v-if="!withGroupedMenu"
          name="tableAddSearchRow"
          :has-search-inputs="queryBuilderProps.hasSearchInputs"
          :has-search-inputs-without-value="queryBuilderProps.hasSearchInputsWithoutValue"
          :search-inputs="queryBuilderProps.searchInputsWithoutGlobal"
          :on-add="showSearchInput"
        >
          <TableAddSearchRow
            v-if="queryBuilderProps.hasSearchInputs"
            class="mr-2 sm:mr-4"
            :search-inputs="queryBuilderProps.searchInputsWithoutGlobal"
            :has-search-inputs-without-value="queryBuilderProps.hasSearchInputsWithoutValue"
            :on-add="showSearchInput"
            :color="color"
          />
        </slot>

        <slot
          v-if="!withGroupedMenu"
          name="tableColumns"
          :has-columns="queryBuilderProps.hasToggleableColumns"
          :columns="queryBuilderProps.columns"
          :has-hidden-columns="queryBuilderProps.hasHiddenColumns"
          :on-change="changeColumnStatus"
        >
          <TableColumns
            v-if="queryBuilderProps.hasToggleableColumns"
            :class="{ 'mr-2 sm:mr-4' : canBeReset }"
            :columns="queryBuilderProps.columns"
            :has-hidden-columns="queryBuilderProps.hasHiddenColumns"
            :on-change="changeColumnStatus"
            :color="color"
          />
        </slot>

        <slot
          v-if="withGroupedMenu"
          name="groupedAction"
          :actions="defaultActions"
        >
          <GroupedActions
            :color="color"
            :actions="defaultActions"
          />
        </slot>

        <slot
          v-if="!withGroupedMenu"
          name="tableReset"
          :can-be-reset="canBeReset"
          :on-click="resetQuery"
        >
          <div
            v-if="canBeReset"
            class="mr-4 sm:mr-0"
          >
            <TableReset
              :on-click="resetQuery"
              :color="color"
            />
          </div>
        </slot>
      </div>

      <slot
        name="tableSearchRows"
        :has-search-rows-with-value="queryBuilderProps.hasSearchInputsWithValue"
        :search-inputs="queryBuilderProps.searchInputsWithoutGlobal"
        :forced-visible-search-inputs="forcedVisibleSearchInputs"
        :on-change="changeSearchInputValue"
      >
        <TableSearchRows
          v-if="queryBuilderProps.hasSearchInputsWithValue || forcedVisibleSearchInputs.length > 0"
          :search-inputs="queryBuilderProps.searchInputsWithoutGlobal"
          :forced-visible-search-inputs="forcedVisibleSearchInputs"
          :on-change="changeSearchInputValue"
          :on-remove="disableSearchInput"
          :color="color"
        />
      </slot>

      <slot
        name="tableWrapper"
        :meta="resourceMeta"
      >
        <TableWrapper :class="{ 'mt-3': !hasOnlyData }">
          <slot name="table">
            <table :class="getTheme('table')">
              <thead :class="getTheme('thead')">
                <slot
                  name="head"
                  :show="show"
                  :sort-by="sortBy"
                  :header="header"
                >
                  <tr>
                    <HeaderCell
                      v-for="column in queryBuilderProps.columns"
                      :key="`table-${name}-header-${column.key}`"
                      :cell="header(column.key)"
                      :color="color"
                    >
                      <template #label>
                        <slot
                          :name="`header(${column.key})`"
                          :label="header(column.key).label"
                          :column="header(column.key)"
                        />
                      </template>
                    </HeaderCell>
                  </tr>
                </slot>
              </thead>
              <tbody :class="getTheme('tbody')">
                <slot
                  name="body"
                  :show="show"
                >
                  <tr
                    v-for="(item, key) in resourceData"
                    :key="`table-${name}-row-${key}`"
                    :class="[
                      striped && key % 2 ? getTheme('tr_striped') : '',
                      striped ? getTheme('tr_hover_striped') : getTheme('tr_hover'),
                    ]"
                    @click="rowClicked($event, item, key)"
                  >
                    <td
                      v-for="column in queryBuilderProps.columns"
                      v-show="show(column.key)"
                      :key="`table-${name}-row-${key}-column-${column.key}`"
                      :class="getTheme('td')"
                    >
                      <slot
                        :name="`cell(${column.key})`"
                        :item="item"
                      >
                        {{ item[column.key] }}
                      </slot>
                    </td>
                  </tr>

                  <tr v-if="!hasData">
                    <td
                      :colspan="queryBuilderProps.columns?.length || 1"
                      :class="getTheme('td_empty')"
                    >
                      <slot name="empty">
                        {{ translations.no_results_found }}
                      </slot>
                    </td>
                  </tr>
                </slot>
              </tbody>
            </table>
          </slot>

          <slot
            name="pagination"
            :on-click="visitPageFromUrl"
            :has-data="hasData"
            :meta="resourceMeta"
            :per-page-options="queryBuilderProps.perPageOptions"
            :on-per-page-change="onPerPageChange"
          >
            <Pagination
              :on-click="visitPageFromUrl"
              :has-data="hasData"
              :meta="resourceMeta"
              :per-page-options="queryBuilderProps.perPageOptions"
              :on-per-page-change="onPerPageChange"
              :color="color"
            />
          </slot>
        </TableWrapper>
      </slot>
    </fieldset>
  </Transition>
</template>

<script setup>
import Pagination from "./Pagination.vue";
import HeaderCell from "./HeaderCell.vue";
import TableAddSearchRow from "./TableAddSearchRow.vue";
import TableColumns from "./TableColumns.vue";
import TableFilter from "./TableFilter.vue";
import TableGlobalSearch from "./TableGlobalSearch.vue";
import TableSearchRows from "./TableSearchRows.vue";
import TableReset from "./TableReset.vue";
import TableWrapper from "./TableWrapper.vue";
import GroupedActions from "./GroupedActions.vue";
import { computed, ref, watch, inject, Transition } from "vue";
import { usePage } from "@inertiajs/vue3";
import { getTranslations } from "../translations.js";
import { twMerge } from "tailwind-merge";
import { get_theme_part } from "../helpers.js";
import { useTableQuery } from "../composables/useTableQuery.js";
import { useTableNavigation } from "../composables/useTableNavigation.js";
import { useTableState } from "../composables/useTableState.js";

const translations = getTranslations();
const emit = defineEmits(["rowClicked"]);

const props = defineProps({
    inertia: { type: Object, default: () => ({}) },
    name: { type: String, default: "default" },
    striped: { type: Boolean, default: false },
    preventOverlappingRequests: { type: Boolean, default: true },
    inputDebounceMs: { type: Number, default: 350 },
    preserveScroll: { type: [Boolean, String], default: false },
    resource: { type: Object, default: () => ({}) },
    meta: { type: Object, default: () => ({}) },
    data: { type: Object, default: () => ({}) },
    withGroupedMenu: { type: Boolean, default: false },
    color: { type: String, default: "primary" },
    ui: { type: Object, default: undefined },
});

const updates = ref(0);
const tableFieldset = ref(null);
const forcedVisibleSearchInputs = ref([]);

const tableName = computed(() => props.name);
const inputDebounceMs = computed(() => props.inputDebounceMs);
const preventOverlappingRequests = computed(() => props.preventOverlappingRequests);

const queryBuilderProps = computed(() => {
    const page = usePage();
    const pageProps = page?.props?.queryBuilderProps ?? {};
    const data = { ...(pageProps[props.name] ?? {}) };
    data._updates = updates.value;
    return data;
});

const queryBuilderData = ref(queryBuilderProps.value);
const pageName = computed(() => queryBuilderProps.value.pageName);

const { canBeReset, resetQuery, generateNewQueryString } = useTableQuery(
    queryBuilderData, queryBuilderProps, tableName, pageName, forcedVisibleSearchInputs
);

const { isVisiting, visitCancelToken, visitPageFromUrl, visitFromQueryString } = useTableNavigation(
    props, tableFieldset, updates, queryBuilderData, pageName, generateNewQueryString
);

const {
    changeSearchInputValue, changeGlobalSearchValue, changeFilterValue,
    onPerPageChange, changeColumnStatus, disableSearchInput, showSearchInput,
    sortBy, show, header,
} = useTableState(
    queryBuilderData, queryBuilderProps, inputDebounceMs,
    forcedVisibleSearchInputs, visitCancelToken, preventOverlappingRequests
);

const hasOnlyData = computed(() => {
    return !queryBuilderProps.value.hasToggleableColumns
        && !queryBuilderProps.value.hasFilters
        && !queryBuilderProps.value.hasSearchInputs
        && !queryBuilderProps.value.globalSearch;
});

const resourceData = computed(() => {
    if (Object.keys(props.resource).length === 0) return props.data;
    if ("data" in props.resource) return props.resource.data;
    return props.resource;
});

const resourceMeta = computed(() => {
    if (Object.keys(props.resource).length === 0) return props.meta;
    if ("links" in props.resource && "meta" in props.resource) {
        if (
            Object.keys(props.resource.links).length === 4
            && "next" in props.resource.links
        ) {
            return {
                ...props.resource.meta,
                next_page_url: props.resource.links.next,
                prev_page_url: props.resource.links.prev,
            };
        }
    }
    if ("meta" in props.resource) return props.resource.meta;
    return props.resource;
});

const hasData = computed(() => {
    if (Array.isArray(resourceData.value) && resourceData.value.length > 0) return true;
    if (resourceMeta.value?.total > 0) return true;
    return false;
});

const defaultActions = ref({
    reset: { onClick: resetQuery },
    toggleColumns: {
        show: queryBuilderProps.value.hasToggleableColumns,
        columns: queryBuilderProps.value.columns,
        onChange: changeColumnStatus,
    },
    searchFields: {
        show: queryBuilderProps.value.hasSearchInputs,
        searchInputs: queryBuilderProps.value.searchInputsWithoutGlobal,
        hasSearchInputsWithoutValue: queryBuilderProps.value.hasSearchInputsWithoutValue,
        onClick: showSearchInput,
    },
});

function rowClicked(event, item, key) {
    emit("rowClicked", event, item, key);
}

watch(queryBuilderData, () => {
    visitFromQueryString();
}, { deep: true });

// Theme
const fallbackTheme = {
    table: { base: "min-w-full divide-y divide-gray-300" },
    thead: { base: "bg-gray-50" },
    tbody: { base: "divide-y divide-gray-200 bg-white" },
    tr_striped: { base: "bg-gray-50" },
    tr_hover: { base: "hover:bg-gray-50" },
    tr_hover_striped: { base: "hover:bg-gray-100" },
    td: { base: "whitespace-nowrap px-3 py-4 text-sm text-gray-500" },
    td_empty: { base: "px-3 py-8 text-sm text-gray-500 text-center" },
};
const themeVariables = inject("themeVariables");
const getTheme = (item) => {
    return twMerge(
        get_theme_part([item, "base"], fallbackTheme, themeVariables?.inertia_table?.table, props.ui),
        get_theme_part([item, "color", props.color], fallbackTheme, themeVariables?.inertia_table?.table, props.ui),
    );
};
</script>
