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

const translationsObject = {
    translations: { ...defaultTranslations },
};

export default translationsObject.translations;

export function getTranslations() {
    return translationsObject.translations;
}

export function setTranslation(key, value) {
    translationsObject.translations[key] = value;
}

export function setTranslations(translations) {
    translationsObject.translations = { ...defaultTranslations, ...translations };
}
