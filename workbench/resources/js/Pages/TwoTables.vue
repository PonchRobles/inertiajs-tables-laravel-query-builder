<template>
  <Demo>
    <h1 class="text-xl font-semibold mb-4">
      {{ $page.props.demo.two_tables }}
    </h1>
    <p class="text-sm text-gray-600 mb-6">
      {{ $page.props.demo.two_tables_description }}
    </p>
    <h2 class="font-medium mb-2">
      {{ $page.props.demo.gadgets }}
    </h2>
    <Table
      :resource="gadgets"
      name="gadgets"
      preserve-scroll="table-top"
    />
    <h2 class="font-medium mt-10 mb-2">
      {{ $page.props.demo.household }}
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
