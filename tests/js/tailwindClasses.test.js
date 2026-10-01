import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { twMerge } from "tailwind-merge";

function vueFiles(dir) {
    return readdirSync(dir).flatMap((name) => {
        const path = join(dir, name);
        if (statSync(path).isDirectory()) {
            return vueFiles(path);
        }
        return path.endsWith(".vue") ? [path] : [];
    });
}

const sources = vueFiles("js/Components").map((file) => [file, readFileSync(file, "utf8")]);

// Utilities removed or renamed in Tailwind v4 that render differently (or not at all) there.
// Every replacement used in the components must render the same in v3 and v4.
const forbidden = [
    [/(?<![\w-])(bg|text|border|divide|ring|placeholder)-opacity-\d+/, "the *-opacity-* utilities (use the slash syntax, e.g. ring-black/5)"],
    [/(?<![\w-])flex-(shrink|grow)(-\d+)?(?![\w-])/, "flex-shrink/flex-grow (use shrink/grow)"],
    [/(?<![\w-])overflow-ellipsis(?![\w-])/, "overflow-ellipsis (use text-ellipsis or truncate)"],
    [/(?<![\w-])decoration-(slice|clone)(?![\w-])/, "decoration-slice/clone (use box-decoration-*)"],
    [/(?<![\w:-])shadow-sm(?![\w-])/, "shadow-sm (renamed in v4: use the explicit arbitrary shadow)"],
    [/(?<![\w:-])shadow(?![\w[-])/, "bare shadow (renamed in v4: use the explicit arbitrary shadow)"],
    [/(?<![\w:-])rounded-sm(?![\w-])/, "rounded-sm (renamed in v4)"],
    [/(?<![\w:-])blur(?![\w-])/, "bare blur (renamed in v4)"],
    [/(?<![\w:-])drop-shadow(?![\w-])/, "bare drop-shadow (renamed in v4)"],
    [/(?<![\w:-])ring(?![\w-])/, "bare ring (3px in v3, 1px in v4: use ring-1/ring-2)"],
    [/ring-light-blue-/, "ring-light-blue-* (not a color in v3 or v4)"],
    [/(?<![\w-])top-100(?![\w-])/, "top-100 (no-op in v3 but 25rem in v4)"],
];

describe("tailwind v3/v4 compatible classes", () => {
    it("scans the component sources", () => {
        expect(sources.length).toBeGreaterThan(10);
    });

    for (const [pattern, reason] of forbidden) {
        it(`does not use ${reason}`, () => {
            const offenders = sources
                .filter(([, source]) => pattern.test(source))
                .map(([file]) => file);
            expect(offenders).toEqual([]);
        });
    }

    it("tailwind-merge still resolves conflicts between the explicit shadows and user overrides", () => {
        expect(twMerge("shadow-[0_1px_2px_0_rgb(0_0_0/0.05)]", "shadow-md")).toBe("shadow-md");
        expect(twMerge("ring-1 ring-black/5", "ring-gray-200")).toBe("ring-1 ring-gray-200");
        expect(twMerge("cursor-pointer", "cursor-default")).toBe("cursor-default");
    });
});
