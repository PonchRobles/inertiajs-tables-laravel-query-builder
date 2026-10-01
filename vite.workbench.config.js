import { resolve } from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import laravel from "laravel-vite-plugin";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

// Config of the local demo (Orchestra Workbench). The published library is built with vite.config.js.
export default defineConfig({
    plugins: [
        laravel({
            input: ["workbench/resources/js/app.js"],
            publicDirectory: "workbench/public",
            buildDirectory: "build",
            hotFile: "workbench/public/hot",
        }),
        vue(),
    ],

    resolve: {
        alias: {
            // Use the local source of the package, not dist/.
            "@ponchrobles_/inertiajs-tables-laravel-query-builder": resolve(import.meta.dirname, "js/main.js"),
        },
        dedupe: ["vue", "@inertiajs/vue3"],
    },

    css: {
        postcss: {
            plugins: [
                tailwindcss(resolve(import.meta.dirname, "tailwind.workbench.config.js")),
                autoprefixer(),
            ],
        },
    },
});
