<template>
  <button
    type="button"
    :class="[
      getTheme('toggle'),
      modelValue ? getTheme('toggle_on') : getTheme('toggle_off'),
    ]"
    :aria-pressed="modelValue"
    :aria-labelledby="ariaLabelledby"
    :aria-describedby="ariaLabelledby"
    :dusk="dusk"
    @click.prevent="$emit('update:modelValue', !modelValue)"
  >
    <span class="sr-only">Toggle</span>
    <span
      aria-hidden="true"
      :class="[
        getTheme('toggle_dot'),
        modelValue ? getTheme('toggle_dot_on') : getTheme('toggle_dot_off'),
      ]"
    />
  </button>
</template>

<script setup>
import { inject } from "vue";
import { twMerge } from "tailwind-merge";
import { get_theme_part } from "../helpers.js";

defineEmits(["update:modelValue"]);

const props = defineProps({
    modelValue: { type: Boolean, required: true },
    ariaLabelledby: { type: String, default: null },
    dusk: { type: String, default: null },
    color: { type: String, default: "primary" },
    ui: { type: Object, default: undefined },
});

const fallbackTheme = {
    toggle: {
        base: "ml-4 relative inline-flex shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-light-blue-500",
    },
    toggle_on: { base: "bg-green-500" },
    toggle_off: { base: "bg-gray-200" },
    toggle_dot: {
        base: "inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition ease-in-out duration-200",
    },
    toggle_dot_on: { base: "translate-x-5" },
    toggle_dot_off: { base: "translate-x-0" },
};
const themeVariables = inject("themeVariables");
const getTheme = (item) => {
    return twMerge(
        get_theme_part([item, "base"], fallbackTheme, themeVariables?.inertia_table?.toggle_switch, props.ui),
        get_theme_part([item, "color", props.color], fallbackTheme, themeVariables?.inertia_table?.toggle_switch, props.ui),
    );
};
</script>
