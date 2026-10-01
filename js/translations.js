import { reactive } from "vue";

const defaultTranslations = Object.freeze({
    next: "Next",
    no_results_found: "No results found",
    of: "of",
    per_page: "per page",
    previous: "Previous",
    results: "results",
    to: "to",
    reset: "Reset",
    search: "Search...",
    select_all: "Select all",
    clear_selection: "Clear selection",
    start_date: "Start date",
    end_date: "End date",
    add_search_fields: "Add search field",
    show_hide_columns: "Show / Hide columns",
    grouped_reset: "Reset",
    number_range_min: "Minimum value",
    number_range_max: "Maximum value",
});

// One stable reactive object: components read it at setup (`getTranslations()`) and, being reactive,
// their templates update whenever `setTranslation(s)` is called, even after they are mounted.
const translations = reactive({ ...defaultTranslations });

export default translations;

export function getTranslations() {
    return translations;
}

export function setTranslation(key, value) {
    translations[key] = value;
}

export function setTranslations(newTranslations) {
    // Merge with the defaults and drop keys set by an earlier call, mutating in place.
    for (const key of Object.keys(translations)) {
        if (!(key in defaultTranslations)) {
            delete translations[key];
        }
    }

    Object.assign(translations, defaultTranslations, newTranslations);
}
