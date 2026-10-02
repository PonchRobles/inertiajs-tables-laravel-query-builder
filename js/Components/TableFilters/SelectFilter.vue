<template>
  <select
    :name="filter.key"
    :value="filter.value"
    :class="getTheme('select')"
    @change="onFilterChange(filter.key, $event.target.value)"
  >
    <option
      v-for="option in options"
      :key="option.value"
      :value="option.value"
    >
      {{ option.label }}
    </option>
  </select>
</template>

<script setup>
import { computed, inject } from "vue";
import { twMerge } from "tailwind-merge";
import { get_theme_part } from "../../helpers.js";

const props = defineProps({
    filter: {
        type: Object,
        required: true,
    },

    onFilterChange: {
        type: Function,
        required: true,
    },

    color: {
        type: String,
        default: "primary",
        required: false,
    },

    ui: {
        required: false,
        type: Object,
    },
});

// PHP sends `ordered_options` because JS reorders integer-like keys of `options`.
const options = computed(() => {
    if (Array.isArray(props.filter.ordered_options)) {
        return props.filter.ordered_options;
    }
    return Object.entries(props.filter.options ?? {}).map(([value, label]) => ({ value, label }));
});

// Theme
const fallbackTheme = {
    select: {
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
        get_theme_part([item, "base"], fallbackTheme, themeVariables?.inertia_table?.table_filter?.select_filter, props.ui),
        get_theme_part([item, "color", props.color], fallbackTheme, themeVariables?.inertia_table?.table_filter?.select_filter, props.ui),
    );
};
</script>
