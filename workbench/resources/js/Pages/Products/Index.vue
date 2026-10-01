<template>
  <Demo>
    <h1 class="text-xl font-semibold mb-4">
      Products
    </h1>
    <Table
      :resource="products"
      striped
    >
      <template #cell(price)="{ item }">
        ${{ Number(item.price).toFixed(2) }}
      </template>
      <template #cell(stock)="{ item }">
        {{ item.stock ?? "-" }}
      </template>
      <template #cell(is_active)="{ item }">
        {{ item.is_active ? "Yes" : "No" }}
      </template>
      <template #cell(released_at)="{ item }">
        {{ item.released_at ?? "-" }}
      </template>
    </Table>
  </Demo>
</template>

<script setup>
import { Table } from "@ponchrobles_/inertiajs-tables-laravel-query-builder";
import Demo from "../../Layouts/Demo.vue";

defineProps({ products: { type: Object, required: true } });
</script>
