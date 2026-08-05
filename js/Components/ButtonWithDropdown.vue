<template>
  <OnClickOutside :do="hide">
    <div class="relative">
      <button
        ref="button"
        type="button"
        :dusk="dusk"
        :disabled="disabled"
        :class="getTheme('button')"
        aria-haspopup="true"
        @click.prevent="toggle"
      >
        <slot name="button" />
      </button>

      <div
        v-show="opened"
        ref="tooltip"
        class="absolute z-10"
      >
        <div class="mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <slot />
        </div>
      </div>
    </div>
  </OnClickOutside>
</template>

<script setup>
import OnClickOutside from "./OnClickOutside.vue";
import { computePosition, flip, shift } from "@floating-ui/dom";
import { ref, watch, onMounted, onBeforeUnmount, inject } from "vue";
import { get_theme_part } from "../helpers.js";
import { twMerge } from "tailwind-merge";

const emit = defineEmits(["closed"]);

const props = defineProps({
    placement: {
        type: String,
        default: "bottom-start",
        required: false,
    },

    active: {
        type: Boolean,
        default: false,
        required: false,
    },

    dusk: {
        type: String,
        default: null,
        required: false,
    },

    disabled: {
        type: Boolean,
        default: false,
        required: false,
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

const opened = ref(false);

function toggle() {
    opened.value = !opened.value;
}

function hide() {
    opened.value = false;
}

const button = ref(null);
const tooltip = ref(null);

function updatePosition() {
    if (!button.value || !tooltip.value) return;
    computePosition(button.value, tooltip.value, {
        placement: props.placement,
        middleware: [flip(), shift()],
    }).then(({ x, y }) => {
        Object.assign(tooltip.value.style, {
            left: `${x}px`,
            top: `${y}px`,
        });
    });
}

watch(opened, (val) => {
    if (val) {
        updatePosition();
    } else {
        emit("closed");
    }
});

onMounted(() => {
    updatePosition();
});

onBeforeUnmount(() => {
    opened.value = false;
});

defineExpose({ hide });

// Theme
const fallbackTheme = {
    button: {
        base: "w-full border rounded-md shadow-sm px-4 py-2 inline-flex justify-center text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2",
        color: {
            primary: "bg-white text-gray-700 hover:bg-gray-50 border-gray-300 focus:ring-indigo-500",
            dootix: "bg-white text-gray-700 hover:bg-gray-50 border-gray-300 focus:ring-cyan-500",
        },
    },
};
const themeVariables = inject("themeVariables");
const getTheme = (item) => {
    let additionalClasses = "";
    if (item === "button" && props.disabled) {
        additionalClasses = "cursor-not-allowed";
    }
    return twMerge(
        additionalClasses,
        get_theme_part([item, "base"], fallbackTheme, themeVariables?.inertia_table?.button_with_dropdown, props.ui),
        get_theme_part([item, "color", props.color], fallbackTheme, themeVariables?.inertia_table?.button_with_dropdown, props.ui),
    );
};
</script>
