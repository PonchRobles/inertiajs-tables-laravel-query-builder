import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import NumberRangeFilter from "../../../js/Components/TableFilters/NumberRangeFilter.vue";

function make(props = {}) {
    return mount(NumberRangeFilter, {
        attachTo: document.body,
        props: { min: 0, max: 100, modelValue: [20, 80], ...props },
    });
}

describe("NumberRangeFilter", () => {
    beforeEach(() => {
        // jsdom has no layout: fake a 0..100px wide track so 1px == 1 unit.
        vi.spyOn(HTMLElement.prototype, "getClientRects").mockReturnValue([
            { x: 0, y: 0, width: 100, height: 8, left: 0, right: 100, top: 0, bottom: 8 },
        ]);
    });

    afterEach(() => vi.restoreAllMocks());

    it("renders the current values and the bounds", () => {
        const text = make().text();
        expect(text).toContain("20");
        expect(text).toContain("80");
        expect(text).toContain("0");
        expect(text).toContain("100");
    });

    it("renders prefix and suffix", () => {
        const text = make({ prefix: "$", suffix: "kg" }).text();
        expect(text).toContain("$");
        expect(text).toContain("kg");
    });

    it("falls back to the full range when the model value is not a pair", () => {
        const wrapper = make({ modelValue: [] });
        const bar = wrapper.find("[style*='width']");
        expect(bar.attributes("style")).toContain("width: 100%");
    });

    it("sizes the selected bar from the value", () => {
        const bar = make().find("[style*='width']");
        expect(bar.attributes("style")).toContain("width: 60%");
        expect(bar.attributes("style")).toContain("left: 20%");
    });

    it("emits update:modelValue on mouse up after dragging the min handle", async () => {
        const wrapper = make();
        const handles = wrapper.findAll(".cursor-pointer");
        await handles[0].trigger("mousedown");
        window.dispatchEvent(new MouseEvent("mousemove", { clientX: 40 }));
        window.dispatchEvent(new MouseEvent("mouseup"));
        expect(wrapper.emitted("update:modelValue")).toEqual([[[40, 80]]]);
    });

    it("emits the new max after dragging the max handle", async () => {
        const wrapper = make();
        const handles = wrapper.findAll(".cursor-pointer");
        await handles[1].trigger("mousedown");
        window.dispatchEvent(new MouseEvent("mousemove", { clientX: 90 }));
        window.dispatchEvent(new MouseEvent("mouseup"));
        expect(wrapper.emitted("update:modelValue")).toEqual([[[20, 90]]]);
    });

    it("does not let the min handle pass the max value", async () => {
        const wrapper = make();
        await wrapper.findAll(".cursor-pointer")[0].trigger("mousedown");
        window.dispatchEvent(new MouseEvent("mousemove", { clientX: 95 }));
        window.dispatchEvent(new MouseEvent("mouseup"));
        expect(wrapper.emitted("update:modelValue")).toEqual([[[20, 80]]]);
    });
});
