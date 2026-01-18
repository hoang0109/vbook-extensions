let BASE_URL = 'https://metruyencv.biz';
let BASE_API = 'https://backend.metruyencv.biz';
try {
    if (CONFIG_URL) {
        BASE_URL = CONFIG_URL;
        const host = BASE_URL.match(/^https?:\/\/([^/]+)/);
        if (host && host[1].includes('metruyencv')) {
            BASE_API = 'https://backend.metruyencv.biz';
        } else if (host) {
            BASE_API = 'https://backend.' + host[1];
        }
    }
} catch (error) {
}

function normalizeLink(link) {
    return link.replace(/https?:\/\/[^/]+/i, BASE_URL);
}