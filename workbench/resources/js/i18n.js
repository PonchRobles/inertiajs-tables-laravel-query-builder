import { setTranslations } from "@ponchrobles_/inertiajs-tables-laravel-query-builder";

const es = {
    next: "Siguiente",
    no_results_found: "No se encontraron resultados",
    of: "de",
    per_page: "por página",
    previous: "Anterior",
    results: "resultados",
    to: "a",
    reset: "Reiniciar",
    search: "Buscar...",
    select_all: "Seleccionar todo",
    clear_selection: "Limpiar selección",
    start_date: "Fecha de inicio",
    end_date: "Fecha de fin",
    add_search_fields: "Añadir campo de búsqueda",
    show_hide_columns: "Mostrar / ocultar columnas",
    grouped_reset: "Reiniciar",
    number_range_min: "Valor mínimo",
    number_range_max: "Valor máximo",
    remove_search: "Quitar búsqueda",
    toggle: "Alternar",
};

export const languages = { en: "English", es: "Español" };

// Package strings: translations are reactive, so mounted tables update immediately. The locale
// comes from the shared Inertia `locale` prop (see Layouts/Demo.vue).
export function applyLanguage(language) {
    setTranslations(language === "es" ? es : {});
}
