<template>
  <ButtonWithDropdown
    placement="bottom-end"
    dusk="columns-dropdown"
    :color="color"
  >
    <template #button>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5 text-gray-400"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
        <path
          fill-rule="evenodd"
          d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
          clip-rule="evenodd"
        />
      </svg>
      <span
        v-if="hasHiddenColumns"
        class="ml-1"
      >({{ hiddenColumnsCount }})</span>
    </template>

    <div
      role="menu"
      aria-orientation="horizontal"
      aria-labelledby="toggle-columns-menu"
      class="min-w-max"
    >
      <div class="px-2">
        <ul class="divide-y divide-gray-200">
          <li
            v-for="(column, key) in props.columns"
            v-show="column.can_be_hidden"
            :key="key"
            class="py-2 flex items-center justify-between"
          >
            <p class="text-sm text-gray-900">
              {{ column.label }}
            </p>

            <ToggleSwitch
              :model-value="!column.hidden"
              :aria-labelledby="`toggle-column-${column.key}`"
              :dusk="`toggle-column-${column.key}`"
              :color="color"
              @update:model-value="onChange(column.key, column.hidden)"
            />
          </li>
        </ul>
      </div>
    </div>
  </ButtonWithDropdown>
</template>

<script setup>
import ButtonWithDropdown from "./ButtonWithDropdown.vue";
import ToggleSwitch from "./ToggleSwitch.vue";
import { computed } from "vue";

const props = defineProps({
    columns: { type: Object, required: true },
    hasHiddenColumns: { type: Boolean, required: true },
    onChange: { type: Function, required: true },
    color: { type: String, default: "primary" },
});

const hiddenColumnsCount = computed(() => {
    return props.columns.filter((c) => c.hidden).length;
});
</script>
