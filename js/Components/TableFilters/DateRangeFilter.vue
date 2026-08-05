<template>
  <div class="flex flex-col gap-2">
    <div class="flex items-center gap-2">
      <label
        :for="`${filter.key}-start`"
        class="text-xs text-gray-500 whitespace-nowrap"
      >{{ translations.start_date ?? 'Start date' }}</label>
      <input
        :id="`${filter.key}-start`"
        type="date"
        :class="getTheme('input')"
        :value="startDate"
        :min="filter.minDate || undefined"
        :max="filter.maxDate || undefined"
        @change="onStartChange($event.target.value)"
      >
    </div>
    <div class="flex items-center gap-2">
      <label
        :for="`${filter.key}-end`"
        class="text-xs text-gray-500 whitespace-nowrap"
      >{{ translations.end_date ?? 'End date' }}</label>
      <input
        :id="`${filter.key}-end`"
        type="date"
        :class="getTheme('input')"
        :value="endDate"
        :min="filter.minDate || undefined"
        :max="filter.maxDate || undefined"
        @change="onEndChange($event.target.value)"
      >
    </div>
  </div>
</template>

<script setup>
import { computed, inject } from "vue";
import { getTranslations } from "../../translations.js";
import { twMerge } from "tailwind-merge";
import { get_theme_part } from "../../helpers.js";

const translations = getTranslations();

const props = defineProps({
    filter: { type: Object, required: true },
    onFilterChange: { type: Function, required: true },
    color: { type: String, default: "primary" },
    ui: { type: Object, default: undefined },
});

const startDate = computed(() => {
    if (Array.isArray(props.filter.value) && props.filter.value[0]) {
        return props.filter.value[0];
    }
    return "";
});

const endDate = computed(() => {
    if (Array.isArray(props.filter.value) && props.filter.value[1]) {
        return props.filter.value[1];
    }
    return "";
});

function onStartChange(value) {
    const newValue = value || endDate.value
        ? [value || null, endDate.value || null]
        : null;
    props.onFilterChange(props.filter.key, newValue);
}

function onEndChange(value) {
    const newValue = startDate.value || value
        ? [startDate.value || null, value || null]
        : null;
    props.onFilterChange(props.filter.key, newValue);
}

// Theme
const fallbackTheme = {
    input: {
        base: "block w-full shadow-sm text-sm rounded-md",
        color: {
            primary: "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500",
            dootix: "border-gray-300 focus:ring-cyan-500 focus:border-blue-500",
        },
    },
};
const themeVariables = inject("themeVariables");
const getTheme = (item) => {
    return twMerge(
        get_theme_part([item, "base"], fallbackTheme, themeVariables?.inertia_table?.table_filter?.date_range_filter, props.ui),
        get_theme_part([item, "color", props.color], fallbackTheme, themeVariables?.inertia_table?.table_filter?.date_range_filter, props.ui),
    );
};
</script>
