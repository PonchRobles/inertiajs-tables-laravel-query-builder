import { twMerge } from "tailwind-merge";

export function get_theme_part(keys, fallbackTheme, themeVariables, ui) {
    let fallbackThemeClasses = resolveNested(fallbackTheme, keys);
    let themeVariableClasses = resolveNested(themeVariables, keys);
    let uiClasses = resolveNested(ui, keys);

    return twMerge(fallbackThemeClasses, themeVariableClasses, uiClasses);
}

function resolveNested(obj, keys) {
    if (!obj || typeof obj !== "object") {
        return null;
    }

    let current = obj;

    for (const key of keys) {
        if (current === null || current === undefined || typeof current !== "object" || !(key in current)) {
            return null;
        }

        current = current[key];

        if (typeof current === "string") {
            return current;
        }
    }

    return typeof current === "string" ? current : null;
}
