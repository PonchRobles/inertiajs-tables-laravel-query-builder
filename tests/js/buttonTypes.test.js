import { describe, it, expect, vi, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import { h } from "vue";
import GroupedActions from "../../js/Components/GroupedActions.vue";
import TableSearchRows from "../../js/Components/TableSearchRows.vue";
import TableAddSearchRow from "../../js/Components/TableAddSearchRow.vue";
import ToggleFilter from "../../js/Components/TableFilters/ToggleFilter.vue";
import MultiSelectFilter from "../../js/Components/TableFilters/MultiSelectFilter.vue";
import HeaderCell from "../../js/Components/HeaderCell.vue";
import ButtonWithDropdown from "../../js/Components/ButtonWithDropdown.vue";
import ToggleSwitch from "../../js/Components/ToggleSwitch.vue";
import TableReset from "../../js/Components/TableReset.vue";

vi.mock("@floating-ui/dom", () => ({
    computePosition: vi.fn(() => new Promise(() => {})),
    flip: vi.fn(),
    shift: vi.fn(),
}));

const noop = () => {};

function expectAllButtonsTyped(wrapper, minimum = 1) {
    const buttons = wrapper.findAll("button");
    expect(buttons.length).toBeGreaterThanOrEqual(minimum);
    for (const button of buttons) {
        expect(button.attributes("type")).toBe("button");
    }
}

const searchInputs = [
    { key: "name", label: "Name", value: "foo" },
    { key: "email", label: "Email", value: null },
];

describe("button types", () => {
    it("GroupedActions buttons are type=button", () => {
        const wrapper = mount(GroupedActions, {
            props: {
                actions: {
                    searchFields: { show: true, searchInputs, onClick: noop },
                    toggleColumns: {
                        show: true,
                        columns: [{ key: "name", label: "Name", hidden: false, can_be_hidden: true }],
                        onChange: noop,
                    },
                    reset: { onClick: noop },
                },
            },
        });
        // dropdown toggle + 3 menu items + 2 back buttons + 1 search field + 1 toggle switch
        expectAllButtonsTyped(wrapper, 8);
    });

    it("TableSearchRows buttons are type=button", () => {
        const wrapper = mount(TableSearchRows, {
            props: { searchInputs, forcedVisibleSearchInputs: [], onChange: noop, onRemove: noop },
        });
        expectAllButtonsTyped(wrapper, 2);
    });

    it("TableAddSearchRow buttons are type=button", () => {
        const wrapper = mount(TableAddSearchRow, {
            props: { searchInputs, hasSearchInputsWithoutValue: true, onAdd: noop },
        });
        expectAllButtonsTyped(wrapper, 3);
    });

    it("ToggleFilter buttons are type=button", () => {
        const wrapper = mount(ToggleFilter, {
            props: { filter: { key: "active", value: null }, onFilterChange: noop },
        });
        expectAllButtonsTyped(wrapper);
    });

    it("MultiSelectFilter buttons are type=button", () => {
        const wrapper = mount(MultiSelectFilter, {
            props: {
                filter: { key: "status", value: null, options: { a: "A", b: "B" } },
                onFilterChange: noop,
            },
        });
        expectAllButtonsTyped(wrapper, 2);
    });

    it("HeaderCell sortable renders a button with type=button", () => {
        const wrapper = mount(HeaderCell, {
            props: { cell: { key: "name", label: "Name", sortable: true, sorted: false, onSort: noop } },
            attachTo: document.body,
        });
        expectAllButtonsTyped(wrapper, 1);
        wrapper.unmount();
    });

    it("HeaderCell not sortable renders no button and no type attribute", () => {
        const wrapper = mount(HeaderCell, {
            props: { cell: { key: "name", label: "Name", sortable: false, sorted: false, onSort: noop } },
        });
        expect(wrapper.find("button").exists()).toBe(false);
        const root = wrapper.find("th > *");
        expect(root.element.tagName).not.toBe("BUTTON");
        expect(root.attributes("type")).toBeUndefined();
    });

    it("ButtonWithDropdown button is type=button", () => {
        const wrapper = mount(ButtonWithDropdown, { slots: { button: "x", default: "content" } });
        expectAllButtonsTyped(wrapper, 1);
    });

    it("ToggleSwitch button is type=button", () => {
        const wrapper = mount(ToggleSwitch, { props: { modelValue: false } });
        expectAllButtonsTyped(wrapper, 1);
    });

    it("TableReset button is type=button", () => {
        const wrapper = mount(TableReset, { props: { onClick: noop } });
        expectAllButtonsTyped(wrapper, 1);
    });
});

describe("buttons inside a form", () => {
    afterEach(() => {
        document.body.innerHTML = "";
    });

    function mountInForm(child) {
        const onSubmit = vi.fn((e) => e.preventDefault());
        const wrapper = mount(
            { render: () => h("form", { onSubmit }, [child()]) },
            { attachTo: document.body },
        );
        return { wrapper, onSubmit };
    }

    it("TableSearchRows remove button does not submit the form", async () => {
        const onRemove = vi.fn();
        const { wrapper, onSubmit } = mountInForm(() =>
            h(TableSearchRows, { searchInputs, forcedVisibleSearchInputs: [], onChange: noop, onRemove }),
        );
        await wrapper.find("button").trigger("click");
        expect(onRemove).toHaveBeenCalledWith("name");
        expect(onSubmit).not.toHaveBeenCalled();
        wrapper.unmount();
    });

    it("GroupedActions reset button does not submit the form", async () => {
        const onClick = vi.fn();
        const { wrapper, onSubmit } = mountInForm(() =>
            h(GroupedActions, {
                actions: {
                    searchFields: { show: false, searchInputs: [], onClick: noop },
                    toggleColumns: { show: false, columns: [], onChange: noop },
                    reset: { onClick },
                },
            }),
        );
        await wrapper.find("[dusk=reset-button]").trigger("click");
        expect(onClick).toHaveBeenCalled();
        expect(onSubmit).not.toHaveBeenCalled();
        wrapper.unmount();
    });
});
