<template>
  <div class="flex flex-col gap-1">
    <div class="flex justify-between text-xs text-gray-500 mb-1">
      <button
        type="button"
        class="hover:text-gray-700"
        @click.prevent="selectAll"
      >
        {{ translations.select_all ?? 'Select all' }}
      </button>
      <button
        type="button"
        class="hover:text-gray-700"
        @click.prevent="clearSelection"
      >
        {{ translations.clear_selection ?? 'Clear selection' }}
      </button>
    </div>
    <label
      v-for="(optionLabel, optionKey) in filter.options"
      :key="optionKey"
      :class="getTheme('option')"
    >
      <input
        type="checkbox"
        :class="getTheme('checkbox')"
        :value="optionKey"
        :checked="isSelected(optionKey)"
        @change="onToggle(optionKey, $event.target.checked)"
      >
      <span class="ml-2">{{ optionLabel }}</span>
    </label>
  </div>
</template>

<script setup>
import { inject } from "vue";
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

function isSelected(key) {
    return Array.isArray(props.filter.value) && props.filter.value.includes(key);
}

function onToggle(key, checked) {
    const current = Array.isArray(props.filter.value) ? [...props.filter.value] : [];
    let newValue;
    if (checked) {
        newValue = [...current, key];
    } else {
        newValue = current.filter((k) => k !== key);
    }
    props.onFilterChange(props.filter.key, newValue.length > 0 ? newValue : null);
}

function selectAll() {
    const allKeys = Object.keys(props.filter.options);
    props.onFilterChange(props.filter.key, allKeys);
}

function clearSelection() {
    props.onFilterChange(props.filter.key, null);
}

// Theme
const fallbackTheme = {
    option: {
        base: "flex items-center text-sm text-gray-700 cursor-pointer py-0.5",
    },
    checkbox: {
        base: "rounded",
        color: {
            primary: "text-indigo-600 border-gray-300 focus:ring-indigo-500",
            dootix: "text-cyan-600 border-gray-300 focus:ring-cyan-500",
        },
    },
};
const themeVariables = inject("themeVariables");
const getTheme = (item) => {
    return twMerge(
        get_theme_part([item, "base"], fallbackTheme, themeVariables?.inertia_table?.table_filter?.multi_select_filter, props.ui),
        get_theme_part([item, "color", props.color], fallbackTheme, themeVariables?.inertia_table?.table_filter?.multi_select_filter, props.ui),
    );
};
</script>
