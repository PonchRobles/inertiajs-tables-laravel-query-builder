import pluginVue from "eslint-plugin-vue";

export default [
    ...pluginVue.configs["flat/recommended"],
    {
        rules: {
            "no-undef": "off",
            "no-unused-vars": "off",
            "vue/multi-word-component-names": "off",
            "vue/no-v-html": "off",
            "vue/require-default-prop": "off",
            "indent": ["error", 4],
            "quotes": ["error", "double"],
            "semi": ["error", "always"],
            "comma-spacing": ["error", { "before": false, "after": true }],
        },
    },
];
