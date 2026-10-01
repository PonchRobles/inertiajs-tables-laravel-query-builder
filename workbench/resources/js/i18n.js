import { setTranslations } from "@ponchrobles_/inertiajs-tables-laravel-query-builder";

const es = {
    next: "Siguiente",
    no_results_found: "No se encontraron resultados",
    of: "de",
    per_page: "por pagina",
    previous: "Anterior",
    results: "resultados",
    to: "a",
    reset: "Reiniciar",
    search: "Buscar...",
    select_all: "Seleccionar todo",
    clear_selection: "Limpiar seleccion",
    start_date: "Fecha de inicio",
    end_date: "Fecha de fin",
    add_search_fields: "Anadir campo de busqueda",
    show_hide_columns: "Mostrar / ocultar columnas",
    grouped_reset: "Reiniciar",
    number_range_min: "Valor minimo",
    number_range_max: "Valor maximo",
};

export const languages = { en: "English", es: "Espanol" };

// Runtime switch: translations are reactive, so mounted tables update immediately.
export function applyLanguage(language) {
    setTranslations(language === "es" ? es : {});
}
