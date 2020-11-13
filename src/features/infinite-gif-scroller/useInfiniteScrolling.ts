import React, { useEffect } from 'react';

const LOAD_WHEN_REMAINING_SCROLL_LESS_THAN = 400;

/**
 * Hook to add infinite scrolling support to a component. Monitors for scroll
 * and resizing events that may require loading more data, and notifies when
 * loading more data is necessary.
 * 
 * `scrollElement` must be the HTML element that produces a scrollbar when the
 * content overflows.
 * `containerRef` must be an HTML element whose bounds define the region where
 * the scrollable content is displayed.
 */
export function useInfiniteScrolling(
    containerRef: React.RefObject<HTMLElement>, scrollElement: HTMLElement,
    loadMoreCallback: () => void) {

    // TODO: write tests
    function shouldFetchMore(scrollHeight: number,
        scrollTop: number,
        clientHeight: number,
        loadWhenRemainingScrollLessThan: number
    ) {
        const remainingScrollHeight = scrollHeight - scrollTop - clientHeight;
        return remainingScrollHeight < loadWhenRemainingScrollLessThan;
    }

    function requestMoreGifsIfNeeded() {
        if (shouldFetchMore(
            scrollElement.scrollHeight,
            scrollElement.scrollTop,
            scrollElement.clientHeight,
            LOAD_WHEN_REMAINING_SCROLL_LESS_THAN)
        ) {
            loadMoreCallback();
        }
    }

    useEffect(() => {
        window.addEventListener('scroll', requestMoreGifsIfNeeded);
        return () => {
            window.removeEventListener('scroll', requestMoreGifsIfNeeded);
        };
    });

    // Monitor for scrolling in overflow:scroll elements.
    useEffect(() => {
        scrollElement.addEventListener('scroll', requestMoreGifsIfNeeded);
        return () => {
            scrollElement.removeEventListener('scroll', requestMoreGifsIfNeeded);
        };
    });

    // Monitor for increased client size dimensions in overflow:scroll elements.
    useEffect(() => {
        // Unit test environment does not support ResizeObserver.
        if (navigator.userAgent.includes("jsdom")) return;

        const resizeObserver = new ResizeObserver(requestMoreGifsIfNeeded);
        let current: Element | null = containerRef.current;
        resizeObserver.observe(current!);

        return () => {
            resizeObserver.unobserve(current!);
            current = null;
        }
    });

    // Window dimensions can grow and change client size on top-level elements
    // without `ResizeObserver` firing on any top-level elements.
    useEffect(() => {
        window.addEventListener("resize", requestMoreGifsIfNeeded);
        return () => {
            window.removeEventListener("resize", requestMoreGifsIfNeeded);
        }
    });

    useEffect(() => {
        requestMoreGifsIfNeeded();
    });
}