const translationsObject = {
    translations: {
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
    }
};

export default translationsObject.translations;

export function getTranslations() {
    return translationsObject.translations;
}

export function setTranslation(key, value) {
    translationsObject.translations[key] = value;
}

export function setTranslations(translations) {
    translationsObject.translations = translations;
}
