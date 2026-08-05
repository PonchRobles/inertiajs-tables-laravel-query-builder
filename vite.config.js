import { resolve } from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
    plugins: [vue()],

    build: {
        lib: {
            entry: resolve(import.meta.dirname, "js/main.js"),
            name: "InertiaTable",
            fileName: (format) => `inertia-table.${format}.js`,
        },
        rollupOptions: {
            external: [
                /^@inertiajs.*/,
                /^@floating-ui.*/,
                /^tailwind-merge.*/,
                "qs",
                "vue",
            ],
            output: {
                globals: {
                    vue: "Vue",
                    qs: "qs",
                    "@inertiajs/vue3": "InertiaVue3",
                    "tailwind-merge": "tailwindMerge",
                    "@floating-ui/dom": "FloatingUIDOM",
                },
            },
        },
    },
});
