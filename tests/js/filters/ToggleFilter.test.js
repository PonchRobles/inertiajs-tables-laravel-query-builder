import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import ToggleFilter from "../../../js/Components/TableFilters/ToggleFilter.vue";

function make(value = null) {
    const onFilterChange = vi.fn();
    const wrapper = mount(ToggleFilter, {
        props: { filter: { key: "active", value }, onFilterChange },
    });
    return { wrapper, onFilterChange };
}

describe("ToggleFilter", () => {
    it("renders a checkbox and a reset button", () => {
        const { wrapper } = make();
        expect(wrapper.find("input[type=checkbox]").exists()).toBe(true);
        expect(wrapper.find("button").exists()).toBe(true);
    });

    it("is checked when the filter value is truthy", () => {
        expect(make("1").wrapper.find("input").element.checked).toBe(true);
        expect(make(null).wrapper.find("input").element.checked).toBe(false);
    });

    it("reports '1' when checked and '0' when unchecked", async () => {
        const { wrapper, onFilterChange } = make(null);
        await wrapper.find("input").setValue(true);
        expect(onFilterChange).toHaveBeenLastCalledWith("active", "1");
        await wrapper.find("input").setValue(false);
        expect(onFilterChange).toHaveBeenLastCalledWith("active", "0");
    });

    it("resets the value to null via the reset button", async () => {
        const { wrapper, onFilterChange } = make("1");
        await wrapper.find("button").trigger("click");
        expect(onFilterChange).toHaveBeenCalledWith("active", null);
    });
});
