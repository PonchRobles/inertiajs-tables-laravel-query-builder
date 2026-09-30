import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import DateRangeFilter from "../../../js/Components/TableFilters/DateRangeFilter.vue";

function make(value = null, extra = {}) {
    const onFilterChange = vi.fn();
    const wrapper = mount(DateRangeFilter, {
        props: { filter: { key: "created", value, ...extra }, onFilterChange },
    });
    return { wrapper, onFilterChange };
}

describe("DateRangeFilter", () => {
    it("renders start and end date inputs", () => {
        const { wrapper } = make();
        expect(wrapper.find("#created-start").attributes("type")).toBe("date");
        expect(wrapper.find("#created-end").attributes("type")).toBe("date");
    });

    it("shows the current range", () => {
        const { wrapper } = make(["2024-01-01", "2024-01-31"]);
        expect(wrapper.find("#created-start").element.value).toBe("2024-01-01");
        expect(wrapper.find("#created-end").element.value).toBe("2024-01-31");
    });

    it("applies min and max attributes", () => {
        const { wrapper } = make(null, { minDate: "2020-01-01", maxDate: "2030-01-01" });
        expect(wrapper.find("#created-start").attributes("min")).toBe("2020-01-01");
        expect(wrapper.find("#created-end").attributes("max")).toBe("2030-01-01");
    });

    it("emits [start, null] when only the start date is set", async () => {
        const { wrapper, onFilterChange } = make();
        await wrapper.find("#created-start").setValue("2024-01-01");
        expect(onFilterChange).toHaveBeenCalledWith("created", ["2024-01-01", null]);
    });

    it("keeps the other bound when one changes", async () => {
        const { wrapper, onFilterChange } = make(["2024-01-01", null]);
        await wrapper.find("#created-end").setValue("2024-02-01");
        expect(onFilterChange).toHaveBeenCalledWith("created", ["2024-01-01", "2024-02-01"]);
    });

    it("resets to null when both dates are cleared", async () => {
        const { wrapper, onFilterChange } = make(["2024-01-01", null]);
        await wrapper.find("#created-start").setValue("");
        expect(onFilterChange).toHaveBeenCalledWith("created", null);
    });
});
