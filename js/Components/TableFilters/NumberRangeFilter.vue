<template>
  <div>
    <div
      ref="range"
      class="flex w-full my-4 items-center justify-center"
      unselectable="on"
      onselectstart="return false;"
    >
      <div class="py-1 relative min-w-full">
        <div :class="getTheme('main_bar')">
          <div
            class="absolute"
            :class="getTheme('selected_bar')"
            :style="`width: ${rangeWidth}% !important; left: ${currentMinValueInPercent}% !important;`"
          />
          <div
            :class="getTheme('button')"
            class="absolute flex items-center justify-center -ml-2 top-0 cursor-pointer"
            :style="`left: ${currentMinValueInPercent}%;`"
            style="touch-action: none;"
            tabindex="0"
            role="slider"
            :aria-valuemin="min"
            :aria-valuemax="currentMaxValue"
            :aria-valuenow="currentMinValue"
            :aria-label="translations.number_range_min"
            @pointerdown="handlePointerDown($event, true)"
            @keydown="handleKeyDown($event, true)"
          >
            <div class="z-40">
              <div
                ref="popoverMin"
                class="relative shadow-md"
              >
                <div
                  :class="getTheme('popover')"
                  :style="getMarginTop(hasOverlap && displayFirstDown)"
                >
                  <span v-if="prefix">{{ prefix }}</span>
                  {{ currentMinValue ?? 0 }}
                  <span v-if="suffix">{{ suffix }}</span>
                </div>
                <svg
                  class="absolute w-full h-2 left-0"
                  x="0px"
                  y="0px"
                  viewBox="0 0 255 255"
                  xml:space="preserve"
                  :class="[hasOverlap && displayFirstDown ? 'bottom-6 rotate-180' : '', getTheme('popover_arrow')]"
                >
                  <polygon
                    class="fill-current"
                    points="0,0 127.5,127.5 255,0"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div
            :class="getTheme('button')"
            class="absolute flex items-center justify-center -ml-2 top-0 cursor-pointer"
            :style="`left: ${currentMaxValueInPercent}%;`"
            style="touch-action: none;"
            tabindex="0"
            role="slider"
            :aria-valuemin="currentMinValue"
            :aria-valuemax="max"
            :aria-valuenow="currentMaxValue"
            :aria-label="translations.number_range_max"
            @pointerdown="handlePointerDown($event, false)"
            @keydown="handleKeyDown($event, false)"
          >
            <div class="z-40">
              <div
                ref="popoverMax"
                class="relative shadow-md"
              >
                <div
                  :class="getTheme('popover')"
                  :style="getMarginTop(hasOverlap && !displayFirstDown)"
                >
                  <span v-if="prefix">{{ prefix }}</span>
                  {{ currentMaxValue ?? 0 }}
                  <span v-if="suffix">{{ suffix }}</span>
                </div>
                <div draggable="true">
                  <svg
                    class="absolute w-full h-2 left-0"
                    x="0px"
                    y="0px"
                    viewBox="0 0 255 255"
                    xml:space="preserve"
                    :class="[hasOverlap && !displayFirstDown ? 'bottom-6 rotate-180' : '', getTheme('popover_arrow')]"
                  >
                    <polygon
                      class="fill-current"
                      points="0,0 127.5,127.5 255,0"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div
            class="absolute -ml-1 bottom-0 left-0 -mb-6"
            :class="getTheme('text')"
          >
            <span v-if="prefix">{{ prefix }}</span>
            {{ min ?? 0 }}
            <span v-if="suffix">{{ suffix }}</span>
          </div>
          <div
            class="absolute -mr-1 bottom-0 right-0 -mb-6"
            :class="getTheme('text')"
          >
            <span v-if="prefix">{{ prefix }}</span>
            {{ max ?? 0 }}
            <span v-if="suffix">{{ suffix }}</span>
          </div>
        </div>
      </div>
    </div>
    <button
      type="button"
      class="cursor-pointer text-xs text-gray-500 hover:text-gray-700"
      @click.prevent="reset"
    >
      {{ translations.reset }}
    </button>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, inject } from "vue";
import { twMerge } from "tailwind-merge";
import { get_theme_part } from "../../helpers.js";
import { getTranslations } from "../../translations.js";

const translations = getTranslations();

// Matches the default of Table's `inputDebounceMs`.
const KEYBOARD_EMIT_DEBOUNCE_MS = 350;

const emit = defineEmits(["update:modelValue"]);

const props = defineProps({
    max: { type: Number, required: true },
    modelValue: { type: Array, required: true },
    min: { type: Number, default: 0 },
    prefix: { type: String, default: "" },
    suffix: { type: String, default: "" },
    step: { type: Number, default: 1 },
    color: { type: String, default: "primary" },
    ui: { type: Object, default: undefined },
});

const range = ref(null);
const popoverMin = ref(null);
const popoverMax = ref(null);
const rangePositions = ref(null);
const moveMin = ref(false);
const moveMax = ref(false);
const hasOverlap = ref(false);
const internalValue = ref(props.modelValue ? [...props.modelValue] : null);

function checkedValue(value) {
    if (value < Number(props.min)) return Number(props.min);
    if (value > Number(props.max)) return Number(props.max);
    return value;
}

const currentMinValue = computed(() => {
    if (Array.isArray(internalValue.value) && internalValue.value.length === 2) {
        const val = Number(Math.min(...internalValue.value));
        if (!Number.isNaN(val)) return checkedValue(val);
    }
    return Number(props.min);
});

const currentMaxValue = computed(() => {
    if (Array.isArray(internalValue.value) && internalValue.value.length === 2) {
        const val = Number(Math.max(...internalValue.value));
        if (!Number.isNaN(val)) return checkedValue(val);
    }
    return Number(props.max);
});

const currentMinValueInPercent = computed(() => {
    return (currentMinValue.value - Number(props.min)) / (Number(props.max) - Number(props.min)) * 100;
});

const currentMaxValueInPercent = computed(() => {
    return (currentMaxValue.value - Number(props.min)) / (Number(props.max) - Number(props.min)) * 100;
});

const rangeWidth = computed(() => {
    return currentMaxValueInPercent.value - currentMinValueInPercent.value;
});

const displayFirstDown = computed(() => {
    return ((currentMinValueInPercent.value + currentMaxValueInPercent.value) / 2) > 50;
});

function detectIfOverlap() {
    const pMin = popoverMin.value?.getClientRects()[0];
    const pMax = popoverMax.value?.getClientRects()[0];
    if (pMin && pMax) {
        hasOverlap.value = pMin.right > pMax.left;
    }
}

function getMarginTop(isDown) {
    const buttonTheme = getTheme("button");
    const match = buttonTheme.match(/h-(\d+)/);
    const defaultNumber = 4;
    const number = match?.[1] ? Number(match[1]) : defaultNumber;

    if (isDown) {
        return `margin-top: ${((number - defaultNumber) + 12) * 0.25}rem`;
    }
    return `margin-top: -${(((number - defaultNumber) / 2) + 9) * 0.25}rem`;
}

function handlePointerDown(event, isMin) {
    moveMin.value = isMin;
    moveMax.value = !isMin;
    rangePositions.value = range.value.getClientRects()[0];
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);
}

function handlePointerMove(event) {
    const posX = event.clientX - rangePositions.value.x;
    const posInPercent = (posX / rangePositions.value.width * 100);
    const value = (posInPercent / 100) * (Number(props.max) - Number(props.min)) + Number(props.min);
    const roundedValue = Number(Math.round(value / props.step) * props.step).toFixed(2);
    if (roundedValue >= props.min && roundedValue <= props.max) {
        if (moveMin.value && roundedValue !== currentMinValue.value && roundedValue <= currentMaxValue.value) {
            internalValue.value = [roundedValue, currentMaxValue.value];
        }
        if (moveMax.value && roundedValue !== currentMaxValue.value && roundedValue >= currentMinValue.value) {
            internalValue.value = [currentMinValue.value, roundedValue];
        }
    }
    detectIfOverlap();
}

function handlePointerUp() {
    moveMin.value = moveMax.value = false;
    window.removeEventListener("pointermove", handlePointerMove);
    window.removeEventListener("pointerup", handlePointerUp);
    window.removeEventListener("pointercancel", handlePointerUp);
    emit("update:modelValue", [currentMinValue.value, currentMaxValue.value]);
}

function roundToStep(value) {
    const step = Number(props.step) || 1;
    return Number((Math.round(value / step) * step).toFixed(10));
}

// PageUp/PageDown move 10% of the range, rounded to a multiple of the step (at least one step).
const pageStep = computed(() => {
    const step = Number(props.step) || 1;
    const tenPercent = (Number(props.max) - Number(props.min)) * 0.1;
    return Math.max(step, roundToStep(tenPercent));
});

let keyboardEmitTimeout = null;

function clearKeyboardEmit() {
    clearTimeout(keyboardEmitTimeout);
    keyboardEmitTimeout = null;
}

function setHandleValue(isMin, value) {
    const next = Math.min(Math.max(roundToStep(value), Number(props.min)), Number(props.max));

    if (isMin) {
        internalValue.value = [Math.min(next, currentMaxValue.value), currentMaxValue.value];
    } else {
        internalValue.value = [currentMinValue.value, Math.max(next, currentMinValue.value)];
    }

    clearKeyboardEmit();
    keyboardEmitTimeout = setTimeout(() => {
        keyboardEmitTimeout = null;
        emit("update:modelValue", [currentMinValue.value, currentMaxValue.value]);
    }, KEYBOARD_EMIT_DEBOUNCE_MS);
}

function handleKeyDown(event, isMin) {
    const current = isMin ? currentMinValue.value : currentMaxValue.value;
    const step = Number(props.step) || 1;
    let value;

    switch (event.key) {
    case "ArrowRight":
    case "ArrowUp":
        value = current + step;
        break;
    case "ArrowLeft":
    case "ArrowDown":
        value = current - step;
        break;
    case "PageUp":
        value = current + pageStep.value;
        break;
    case "PageDown":
        value = current - pageStep.value;
        break;
    case "Home":
        value = Number(props.min);
        break;
    case "End":
        value = Number(props.max);
        break;
    default:
        return;
    }

    event.preventDefault();
    setHandleValue(isMin, value);
}

function reset() {
    clearKeyboardEmit();
    internalValue.value = null;
    emit("update:modelValue", [Number(props.min), Number(props.max)]);
}

watch(internalValue, () => {
    detectIfOverlap();
});

watch(() => props.modelValue, (value) => {
    if (moveMin.value || moveMax.value) return;
    internalValue.value = Array.isArray(value) ? [...value] : null;
}, { deep: true });

onMounted(() => {
    detectIfOverlap();
});

onUnmounted(() => {
    window.removeEventListener("pointermove", handlePointerMove);
    window.removeEventListener("pointerup", handlePointerUp);
    window.removeEventListener("pointercancel", handlePointerUp);
    clearKeyboardEmit();
});

// Theme
const fallbackTheme = {
    main_bar: {
        base: "h-2 rounded-full",
        color: { primary: "bg-gray-200", dootix: "bg-gray-200" },
    },
    selected_bar: {
        base: "h-2 rounded-full",
        color: { primary: "bg-indigo-600", dootix: "bg-gradient-to-r from-cyan-500 to-blue-600" },
    },
    button: {
        base: "h-4 w-4 rounded-full shadow-[0_1px_3px_0_rgb(0_0_0/0.1),0_1px_2px_-1px_rgb(0_0_0/0.1)] border",
        color: { primary: "bg-white border-gray-300", dootix: "bg-white border-gray-300" },
    },
    popover: {
        base: "truncate text-xs rounded py-1 px-4",
        color: { primary: "bg-gray-600 text-white", dootix: "bg-gray-600 text-white" },
    },
    popover_arrow: {
        color: { primary: "text-gray-600", dootix: "text-gray-600" },
    },
    text: {
        color: { primary: "text-gray-700", dootix: "text-gray-700" },
    },
};
const themeVariables = inject("themeVariables");
const getTheme = (item) => {
    return twMerge(
        get_theme_part([item, "base"], fallbackTheme, themeVariables?.inertia_table?.table_filter?.number_range_filter, props.ui),
        get_theme_part([item, "color", props.color], fallbackTheme, themeVariables?.inertia_table?.table_filter?.number_range_filter, props.ui),
    );
};
</script>
