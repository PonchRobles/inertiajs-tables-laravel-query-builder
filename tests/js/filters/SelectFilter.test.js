import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import SelectFilter from "../../../js/Components/TableFilters/SelectFilter.vue";

function make(value = null, options = { "": "-", active: "Active", inactive: "Inactive" }) {
    const onFilterChange = vi.fn();
    const wrapper = mount(SelectFilter, {
        props: { filter: { key: "status", value, options }, onFilterChange },
    });
    return { wrapper, onFilterChange };
}

describe("SelectFilter", () => {
    it("renders a select named after the filter key", () => {
        const { wrapper } = make();
        expect(wrapper.find("select").attributes("name")).toBe("status");
    });

    it("renders one option per entry with its label", () => {
        const options = make().wrapper.findAll("option");
        expect(options.map((o) => o.text())).toEqual(["-", "Active", "Inactive"]);
        expect(options.map((o) => o.element.value)).toEqual(["", "active", "inactive"]);
    });

    it("reflects the selected value", () => {
        expect(make("inactive").wrapper.find("select").element.value).toBe("inactive");
    });

    it("selects the empty option when the value is an empty string", () => {
        expect(make("").wrapper.find("select").element.value).toBe("");
    });

    it("calls onFilterChange with key and value on change", async () => {
        const { wrapper, onFilterChange } = make("");
        await wrapper.find("select").setValue("active");
        expect(onFilterChange).toHaveBeenCalledWith("status", "active");
    });

    it("reports an empty string when the empty option is chosen", async () => {
        const { wrapper, onFilterChange } = make("active");
        await wrapper.find("select").setValue("");
        expect(onFilterChange).toHaveBeenCalledWith("status", "");
    });
});
