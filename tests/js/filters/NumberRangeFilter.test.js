import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import { setTranslations } from "../../../js/translations.js";
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

    afterEach(() => {
        vi.useRealTimers();
        vi.restoreAllMocks();
    });

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
        await handles[0].trigger("pointerdown");
        window.dispatchEvent(new MouseEvent("pointermove", { clientX: 40 }));
        window.dispatchEvent(new MouseEvent("pointerup"));
        expect(wrapper.emitted("update:modelValue")).toEqual([[[40, 80]]]);
    });

    it("emits the new max after dragging the max handle", async () => {
        const wrapper = make();
        const handles = wrapper.findAll(".cursor-pointer");
        await handles[1].trigger("pointerdown");
        window.dispatchEvent(new MouseEvent("pointermove", { clientX: 90 }));
        window.dispatchEvent(new MouseEvent("pointerup"));
        expect(wrapper.emitted("update:modelValue")).toEqual([[[20, 90]]]);
    });

    it("does not let the min handle pass the max value", async () => {
        const wrapper = make();
        await wrapper.findAll(".cursor-pointer")[0].trigger("pointerdown");
        window.dispatchEvent(new MouseEvent("pointermove", { clientX: 95 }));
        window.dispatchEvent(new MouseEvent("pointerup"));
        expect(wrapper.emitted("update:modelValue")).toEqual([[[20, 80]]]);
    });

    describe("accessibility and keyboard", () => {
        const handles = (wrapper) => wrapper.findAll("[role='slider']");

        beforeEach(() => vi.useFakeTimers());

        it("exposes two focusable sliders with ARIA values and labels", () => {
            const [minHandle, maxHandle] = handles(make());
            expect(minHandle.attributes("tabindex")).toBe("0");
            expect(minHandle.attributes("aria-valuemin")).toBe("0");
            expect(minHandle.attributes("aria-valuemax")).toBe("80");
            expect(minHandle.attributes("aria-valuenow")).toBe("20");
            expect(minHandle.attributes("aria-label")).toBe("Minimum value");
            expect(maxHandle.attributes("tabindex")).toBe("0");
            expect(maxHandle.attributes("aria-valuemin")).toBe("20");
            expect(maxHandle.attributes("aria-valuemax")).toBe("100");
            expect(maxHandle.attributes("aria-valuenow")).toBe("80");
            expect(maxHandle.attributes("aria-label")).toBe("Maximum value");
        });

        it("uses overridden translations for the aria labels", () => {
            setTranslations({ number_range_min: "Minimo", number_range_max: "Maximo" });
            const [minHandle, maxHandle] = handles(make());
            expect(minHandle.attributes("aria-label")).toBe("Minimo");
            expect(maxHandle.attributes("aria-label")).toBe("Maximo");
            setTranslations({});
        });

        it("moves one step with the arrow keys", async () => {
            const wrapper = make({ step: 5 });
            const [minHandle, maxHandle] = handles(wrapper);
            await minHandle.trigger("keydown", { key: "ArrowRight" });
            expect(minHandle.attributes("aria-valuenow")).toBe("25");
            vi.advanceTimersByTime(350);
            await maxHandle.trigger("keydown", { key: "ArrowLeft" });
            vi.advanceTimersByTime(350);
            expect(wrapper.emitted("update:modelValue")).toEqual([[[25, 80]], [[25, 75]]]);
        });

        it("moves 10% of the range with PageUp and PageDown", async () => {
            const wrapper = make();
            const [minHandle, maxHandle] = handles(wrapper);
            await minHandle.trigger("keydown", { key: "PageUp" });
            vi.advanceTimersByTime(350);
            await maxHandle.trigger("keydown", { key: "PageDown" });
            vi.advanceTimersByTime(350);
            expect(wrapper.emitted("update:modelValue")).toEqual([[[30, 80]], [[30, 70]]]);
        });

        it("jumps to the bounds with Home and End", async () => {
            const wrapper = make();
            const [minHandle, maxHandle] = handles(wrapper);
            await minHandle.trigger("keydown", { key: "Home" });
            vi.advanceTimersByTime(350);
            await maxHandle.trigger("keydown", { key: "End" });
            vi.advanceTimersByTime(350);
            expect(wrapper.emitted("update:modelValue")).toEqual([[[0, 80]], [[0, 100]]]);
        });

        it("does not let the handles cross with the keyboard", async () => {
            const wrapper = make({ modelValue: [40, 60] });
            const [minHandle, maxHandle] = handles(wrapper);
            await minHandle.trigger("keydown", { key: "End" });
            vi.advanceTimersByTime(350);
            expect(wrapper.emitted("update:modelValue")[0]).toEqual([[60, 60]]);
            await maxHandle.trigger("keydown", { key: "Home" });
            vi.advanceTimersByTime(350);
            expect(wrapper.emitted("update:modelValue")[1]).toEqual([[60, 60]]);
        });

        it("emits once, after the delay, when keys are repeated", async () => {
            const wrapper = make();
            const [minHandle] = handles(wrapper);
            for (let i = 0; i < 5; i++) {
                await minHandle.trigger("keydown", { key: "ArrowRight" });
            }
            expect(minHandle.attributes("aria-valuenow")).toBe("25");
            expect(wrapper.emitted("update:modelValue")).toBeUndefined();
            vi.advanceTimersByTime(349);
            expect(wrapper.emitted("update:modelValue")).toBeUndefined();
            vi.advanceTimersByTime(1);
            expect(wrapper.emitted("update:modelValue")).toEqual([[[25, 80]]]);
        });

        it("does not emit after unmount", async () => {
            const wrapper = make();
            await handles(wrapper)[0].trigger("keydown", { key: "ArrowRight" });
            wrapper.unmount();
            vi.advanceTimersByTime(1000);
            expect(wrapper.emitted("update:modelValue")).toBeUndefined();
        });

        it("reset cancels a pending keyboard emit", async () => {
            const wrapper = make();
            await handles(wrapper)[0].trigger("keydown", { key: "ArrowRight" });
            await wrapper.find("button").trigger("click");
            vi.advanceTimersByTime(1000);
            expect(wrapper.emitted("update:modelValue")).toEqual([[[0, 100]]]);
        });

        it("ignores other keys", async () => {
            const wrapper = make();
            await handles(wrapper)[0].trigger("keydown", { key: "a" });
            expect(wrapper.emitted("update:modelValue")).toBeUndefined();
        });
    });

    describe("reset and modelValue sync", () => {
        it("resets to the full range", async () => {
            const wrapper = make();
            await wrapper.find("button").trigger("click");
            expect(wrapper.emitted("update:modelValue")).toEqual([[[0, 100]]]);
            const bar = wrapper.find("[style*='width']");
            expect(bar.attributes("style")).toContain("width: 100%");
            expect(bar.attributes("style")).toContain("left: 0%");
        });

        it("updates the slider when modelValue changes after mount", async () => {
            const wrapper = make();
            await wrapper.setProps({ modelValue: [10, 50] });
            const bar = wrapper.find("[style*='width']");
            expect(bar.attributes("style")).toContain("width: 40%");
            expect(bar.attributes("style")).toContain("left: 10%");
            expect(wrapper.findAll("[role='slider']")[0].attributes("aria-valuenow")).toBe("10");
        });

        it("goes back to the full range when modelValue becomes null", async () => {
            const wrapper = make();
            await wrapper.setProps({ modelValue: null });
            expect(wrapper.find("[style*='width']").attributes("style")).toContain("width: 100%");
        });
    });

    describe("pointer lifecycle", () => {
        it("removes the window listeners when unmounted mid-drag", async () => {
            const removeSpy = vi.spyOn(window, "removeEventListener");
            const wrapper = make();
            await wrapper.findAll(".cursor-pointer")[0].trigger("pointerdown");
            wrapper.unmount();
            const removed = removeSpy.mock.calls.map(([type]) => type);
            expect(removed).toEqual(expect.arrayContaining(["pointermove", "pointerup", "pointercancel"]));

            window.dispatchEvent(new MouseEvent("pointermove", { clientX: 40 }));
            window.dispatchEvent(new MouseEvent("pointerup"));
            expect(wrapper.emitted("update:modelValue")).toBeUndefined();
        });

        it("ignores modelValue changes while dragging", async () => {
            const wrapper = make();
            await wrapper.findAll(".cursor-pointer")[0].trigger("pointerdown");
            window.dispatchEvent(new MouseEvent("pointermove", { clientX: 30 }));
            await wrapper.setProps({ modelValue: [10, 50] });
            window.dispatchEvent(new MouseEvent("pointerup"));
            expect(wrapper.emitted("update:modelValue")).toEqual([[[30, 80]]]);
        });
    });
});
