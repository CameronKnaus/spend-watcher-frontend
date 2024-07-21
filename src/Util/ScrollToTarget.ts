/*
    This is a wrapper for an element's scrollIntoView method. The second 'event' parameter is optional, it is only used
    to prevent default should this function be used with an anchor tag.
*/

type ScrollToParamsType = {
    targetId: string;
    scrollTargetTo?: 'start' | 'center' | 'end' | 'nearest';
    delay?: number;
};

export default function scrollToTarget(params: ScrollToParamsType, event: Event) {
    // Abort on invalid params
    if (!params || typeof params !== 'object') {
        return;
    }

    // Cancel any event defaults
    event && event.preventDefault && event.preventDefault();

    // Abort if target ID not found
    if (!params.targetId) {
        return;
    }

    const scroll = function () {
        const questionModule = document.getElementById(params.targetId);

        const scrollBehavior = {
            behavior: 'smooth',
            block: params.scrollTargetTo || 'start',
        };
        // @ts-expect-error <description-needed>
        questionModule && questionModule.scrollIntoView(scrollBehavior);
    };

    params.delay ? setTimeout(scroll, params.delay) : scroll();
}
