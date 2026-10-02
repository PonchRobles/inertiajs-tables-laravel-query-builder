import forms from "@tailwindcss/forms";

// Tailwind v3 config for the local demo only (never published).
export default {
    content: [
        "./workbench/resources/**/*.{vue,js,blade.php}",
        "./js/**/*.{vue,js}",
    ],
    plugins: [forms],
};
