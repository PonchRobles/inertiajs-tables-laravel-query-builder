<template>
  <div :class="getTheme('wrapper')">
    <div :class="getTheme('scroll')">
      <div :class="getTheme('align')">
        <div :class="getTheme('inner')">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject } from "vue";
import { twMerge } from "tailwind-merge";
import { get_theme_part } from "../helpers.js";

const props = defineProps({
    color: { type: String, default: "primary" },
    ui: { type: Object, default: undefined },
});

const fallbackTheme = {
    wrapper: { base: "flow-root" },
    scroll: { base: "-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8" },
    align: { base: "inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8" },
    inner: { base: "overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg" },
};
const themeVariables = inject("themeVariables");
const getTheme = (item) => {
    return twMerge(
        get_theme_part([item, "base"], fallbackTheme, themeVariables?.inertia_table?.table_wrapper, props.ui),
        get_theme_part([item, "color", props.color], fallbackTheme, themeVariables?.inertia_table?.table_wrapper, props.ui),
    );
};
</script>
