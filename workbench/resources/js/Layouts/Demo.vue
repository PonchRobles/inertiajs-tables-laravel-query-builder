<template>
  <div class="max-w-7xl mx-auto px-4 py-6 space-y-6">
    <header class="flex flex-wrap items-center justify-between gap-4">
      <nav class="flex gap-4 text-sm font-medium">
        <Link
          href="/products"
          class="text-indigo-600 hover:underline"
        >
          {{ $page.props.demo.full_table }}
        </Link>
        <Link
          href="/two-tables"
          class="text-indigo-600 hover:underline"
        >
          {{ $page.props.demo.two_tables }}
        </Link>
      </nav>
      <label class="flex items-center gap-2 text-sm">
        {{ $page.props.demo.language }}
        <select
          :value="$page.props.locale"
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
import { watch } from "vue";
import { Link, router, usePage } from "@inertiajs/vue3";
import { languages, applyLanguage } from "../i18n.js";

const page = usePage();

// The server locale (cookie + middleware) is the single source of truth: it drives the package
// strings on the first load and after every visit, so a reload keeps the selected language.
watch(() => page.props.locale, (locale) => applyLanguage(locale), { immediate: true });

function changeLanguage(code) {
    document.cookie = `demo_locale=${code}; path=/; max-age=31536000; SameSite=Lax`;
    // Reload the current URL (query string included) so the server labels are rendered again.
    router.reload();
}
</script>
