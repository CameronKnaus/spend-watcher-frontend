export default function generateParamsForGET(params) {
    return Object.entries(params).map(([key, value]) => {
        return `${key}=${encodeURIComponent(encodeURIComponent(value))}`;
    }).join('&');
}