import { ref, onMounted, onUnmounted } from "vue";
import { router, usePage } from "@inertiajs/vue3";

export function useTableNavigation(tableProps, tableFieldset, updates, queryBuilderData, pageName, generateNewQueryString) {
    const isVisiting = ref(false);
    const visitCancelToken = ref(null);

    function visit(url) {
        if (!url) return;

        router.get(
            url,
            {},
            {
                replace: true,
                preserveState: true,
                preserveScroll: tableProps.preserveScroll !== false,
                onBefore() {
                    isVisiting.value = true;
                },
                onCancelToken(cancelToken) {
                    visitCancelToken.value = cancelToken;
                },
                onFinish() {
                    isVisiting.value = false;
                },
                onSuccess() {
                    if (tableProps.preserveScroll === "table-top" && tableFieldset.value) {
                        const offset = -8;
                        const top = tableFieldset.value.getBoundingClientRect().top + window.pageYOffset + offset;
                        window.scrollTo({ top });
                    }
                    updates.value++;
                },
            }
        );
    }

    function visitPageFromUrl(url) {
        if (!url) return null;

        const pName = usePage()?.props?.queryBuilderProps?.[tableProps.name]?.pageName ?? "page";
        const page = new URL(url)?.searchParams?.get(pName);

        if (page !== null) {
            queryBuilderData.value.page = page;
        } else {
            visit(url);
        }
    }

    function visitFromQueryString() {
        visit(location.pathname + "?" + generateNewQueryString());
    }

    const inertiaListener = () => {
        updates.value++;
    };

    onMounted(() => {
        document.addEventListener("inertia:success", inertiaListener);
    });

    onUnmounted(() => {
        document.removeEventListener("inertia:success", inertiaListener);
    });

    return {
        isVisiting,
        visitCancelToken,
        visit,
        visitPageFromUrl,
        visitFromQueryString,
    };
}
