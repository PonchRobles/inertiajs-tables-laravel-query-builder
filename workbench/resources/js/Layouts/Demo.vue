<template>
  <div class="max-w-7xl mx-auto px-4 py-6 space-y-6">
    <header class="flex flex-wrap items-center justify-between gap-4">
      <nav class="flex gap-4 text-sm font-medium">
        <Link
          href="/products"
          class="text-indigo-600 hover:underline"
        >
          Full table
        </Link>
        <Link
          href="/two-tables"
          class="text-indigo-600 hover:underline"
        >
          Two named tables
        </Link>
      </nav>
      <label class="flex items-center gap-2 text-sm">
        Language
        <select
          :value="language"
          class="rounded-md border-gray-300 text-sm"
          @change="changeLanguage($event.target.value)"
        >
          <option
            v-for="(label, code) in languages"
            :key="code"
            :value="code"
          >
            {{ label }}
          </option>
        </select>
      </label>
    </header>
    <slot />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Link } from "@inertiajs/vue3";
import { languages, applyLanguage } from "../i18n.js";

const language = ref("en");

function changeLanguage(code) {
    language.value = code;
    applyLanguage(code);
    try {
        localStorage.setItem("demo-language", code);
    } catch {
        // storage is optional
    }
}

onMounted(() => {
    try {
        const saved = localStorage.getItem("demo-language");
        if (saved && saved in languages) {
            changeLanguage(saved);
        }
    } catch {
        // storage is optional
    }
});
</script>
