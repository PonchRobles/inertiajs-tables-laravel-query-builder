<template>
  <Demo>
    <h1 class="text-xl font-semibold mb-4">
      Two named tables
    </h1>
    <p class="text-sm text-gray-600 mb-6">
      Each table has prefixed query keys (<code>gadgets_*</code>, <code>household_*</code>) and its own per page value.
    </p>
    <h2 class="font-medium mb-2">
      Gadgets
    </h2>
    <Table
      :resource="gadgets"
      name="gadgets"
      preserve-scroll="table-top"
    />
    <h2 class="font-medium mt-10 mb-2">
      Household
    </h2>
    <Table
      :resource="household"
      name="household"
      preserve-scroll="table-top"
    />
  </Demo>
</template>

<script setup>
import { Table } from "@ponchrobles_/inertiajs-tables-laravel-query-builder";
import Demo from "../Layouts/Demo.vue";

defineProps({
    gadgets: { type: Object, required: true },
    household: { type: Object, required: true },
});
</script>
