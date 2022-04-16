/*
    This is a wrapper for an element's scrollIntoView method. The second 'event' parameter is optional, it is only used
    to prevent default should this function be used with an anchor tag.
    params:
        REQUIRED
        targetId - String

        OPTIONAL
        scrollTargetTo - String - {'start', 'center', 'end', 'nearest'} <- mirrors native JS scrollIntoView (defaults to 'start')
            - https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView
        delay - Number - Time in MS to wait before scrolling
*/

export default function scrollToTarget(params, event) {
    // Abort on invalid params
    if(!params || typeof params !== 'object') {
        return;
    }

    // Cancel any event defaults
    event && event.preventDefault && event.preventDefault();

    // Abort if target ID not found
    if(!params.targetId) {
        return;
    }

    const scroll = function() {
        const questionModule = document.getElementById(params.targetId);

        const scrollBehavior = {
            behavior: 'smooth',
            block: params.scrollTargetTo || 'start'
        };
        questionModule && questionModule.scrollIntoView(scrollBehavior);
    };

    params.delay ? setTimeout(scroll, params.delay) : scroll();
}