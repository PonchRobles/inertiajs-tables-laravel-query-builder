import { describe, it, expect, vi, beforeEach } from "vitest";
import { ref, defineComponent, h } from "vue";
import { mount } from "@vue/test-utils";

const { get, usePage } = vi.hoisted(() => ({ get: vi.fn(), usePage: vi.fn() }));
vi.mock("@inertiajs/vue3", () => ({ router: { get }, usePage }));

import { useTableNavigation } from "../../../js/composables/useTableNavigation.js";

function setup({ tableProps = { name: "default", preserveScroll: false }, fieldset = ref(null) } = {}) {
    const updates = ref(0);
    const queryBuilderData = ref({ page: 1 });
    const generateNewQueryString = vi.fn(() => "sort=name");
    let api;
    const wrapper = mount(defineComponent({
        setup() {
            api = useTableNavigation(tableProps, fieldset, updates, queryBuilderData, ref("page"), generateNewQueryString);
            return () => h("div");
        },
    }));
    return { api, wrapper, updates, queryBuilderData, generateNewQueryString };
}

function callbacks() {
    return get.mock.calls[0][2];
}

describe("useTableNavigation", () => {
    beforeEach(() => {
        get.mockReset();
        usePage.mockReset();
        usePage.mockReturnValue({ props: { queryBuilderProps: { default: { pageName: "page" } } } });
        window.history.replaceState({}, "", "/users");
    });

    it("visit does nothing without a url", () => {
        setup().api.visit(null);
        expect(get).not.toHaveBeenCalled();
    });

    it("visit calls router.get once with replace and preserveState", () => {
        setup().api.visit("/users?page=2");
        expect(get).toHaveBeenCalledOnce();
        expect(get.mock.calls[0][0]).toBe("/users?page=2");
        expect(get.mock.calls[0][2]).toMatchObject({ replace: true, preserveState: true, preserveScroll: false });
    });

    it("preserveScroll defaults to true unless explicitly false", () => {
        setup({ tableProps: { name: "default" } }).api.visit("/x");
        expect(callbacks().preserveScroll).toBe(true);
    });

    it("tracks isVisiting and the cancel token through visit callbacks", () => {
        const { api } = setup();
        api.visit("/x");
        callbacks().onBefore();
        expect(api.isVisiting.value).toBe(true);
        const token = { cancel: vi.fn() };
        callbacks().onCancelToken(token);
        expect(api.visitCancelToken.value).toEqual(token);
        callbacks().onFinish();
        expect(api.isVisiting.value).toBe(false);
    });

    it("bumps updates on success", () => {
        const { api, updates } = setup();
        api.visit("/x");
        callbacks().onSuccess();
        expect(updates.value).toBe(1);
    });

    it("scrolls to the table top on success with preserveScroll table-top", () => {
        const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
        const fieldset = ref({ getBoundingClientRect: () => ({ top: 100 }) });
        const { api } = setup({ tableProps: { name: "default", preserveScroll: "table-top" }, fieldset });
        api.visit("/x");
        callbacks().onSuccess();
        expect(scrollTo).toHaveBeenCalledWith({ top: 100 + window.pageYOffset - 8 });
        scrollTo.mockRestore();
    });

    it("visitFromQueryString visits the current path with the generated query string", () => {
        const { api } = setup();
        api.visitFromQueryString();
        expect(get.mock.calls[0][0]).toBe("/users?sort=name");
    });

    it("visitPageFromUrl sets the page in the query data instead of visiting when the url has a page", () => {
        const { api, queryBuilderData } = setup();
        api.visitPageFromUrl("http://localhost/users?page=3");
        expect(queryBuilderData.value.page).toBe("3");
        expect(get).not.toHaveBeenCalled();
    });

    it("visitPageFromUrl visits the url directly when it has no page param (cursor pagination)", () => {
        const { api } = setup();
        api.visitPageFromUrl("http://localhost/users?cursor=abc");
        expect(get).toHaveBeenCalledOnce();
        expect(get.mock.calls[0][0]).toBe("http://localhost/users?cursor=abc");
    });

    it("visitPageFromUrl ignores an empty url", () => {
        const { api } = setup();
        expect(api.visitPageFromUrl(null)).toBeNull();
        expect(get).not.toHaveBeenCalled();
    });

    it("bumps updates on inertia:success while mounted, and stops after unmount", () => {
        const { wrapper, updates } = setup();
        document.dispatchEvent(new Event("inertia:success"));
        expect(updates.value).toBe(1);
        wrapper.unmount();
        document.dispatchEvent(new Event("inertia:success"));
        expect(updates.value).toBe(1);
    });
});
