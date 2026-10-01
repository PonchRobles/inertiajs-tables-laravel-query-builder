import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import MultiSelectFilter from "../../../js/Components/TableFilters/MultiSelectFilter.vue";

function make(value = null) {
    const onFilterChange = vi.fn();
    const wrapper = mount(MultiSelectFilter, {
        props: {
            filter: { key: "role", value, options: { admin: "Admin", user: "User", guest: "Guest" } },
            onFilterChange,
        },
    });
    return { wrapper, onFilterChange };
}

describe("MultiSelectFilter", () => {
    it("renders one checkbox per option with its label", () => {
        const { wrapper } = make();
        expect(wrapper.findAll("input[type=checkbox]")).toHaveLength(3);
        expect(wrapper.text()).toContain("Admin");
        expect(wrapper.text()).toContain("Guest");
    });

    it("checks the selected options", () => {
        const boxes = make(["user"]).wrapper.findAll("input[type=checkbox]");
        expect(boxes.map((b) => b.element.checked)).toEqual([false, true, false]);
    });

    it("adds an option when checked", async () => {
        const { wrapper, onFilterChange } = make(["admin"]);
        await wrapper.findAll("input")[1].setValue(true);
        expect(onFilterChange).toHaveBeenCalledWith("role", ["admin", "user"]);
    });

    it("removes an option when unchecked and reports null when nothing is left", async () => {
        const { wrapper, onFilterChange } = make(["admin", "user"]);
        await wrapper.findAll("input")[0].setValue(false);
        expect(onFilterChange).toHaveBeenLastCalledWith("role", ["user"]);

        const single = make(["admin"]);
        await single.wrapper.findAll("input")[0].setValue(false);
        expect(single.onFilterChange).toHaveBeenLastCalledWith("role", null);
    });

    it("select all reports every option key", async () => {
        const { wrapper, onFilterChange } = make();
        await wrapper.findAll("button")[0].trigger("click");
        expect(onFilterChange).toHaveBeenCalledWith("role", ["admin", "user", "guest"]);
    });

    it("clear selection resets to null", async () => {
        const { wrapper, onFilterChange } = make(["admin"]);
        await wrapper.findAll("button")[1].trigger("click");
        expect(onFilterChange).toHaveBeenCalledWith("role", null);
    });
});
