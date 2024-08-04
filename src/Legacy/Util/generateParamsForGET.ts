export default function generateParamsForGET(params: Record<string, any>) {
    return Object.entries(params).map(([key, value]) => {
        return `${key}=${encodeURIComponent(encodeURIComponent(value))}`;
    }).join('&');
}