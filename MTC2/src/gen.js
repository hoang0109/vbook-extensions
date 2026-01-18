load("config.js")

function execute(url, page) {
    if (!page) page = '1';
    const requestUrl = BASE_API + url + (url.indexOf("?") >= 0 ? "&" : "?") + "limit=20&page=" + page;

    const response = fetch(requestUrl, {
        headers: {
            "X-App": "MeTruyenChu"
        }
    });

    if (!response.ok) {
        return null;
    }

    const data = response.json();
    const next = data.pagination && data.pagination.next ? (requestUrl.replace(/page=\d+/i, "page=" + data.pagination.next)) : "";
    const novelList = [];

    data.data.forEach(book => {
        novelList.push({
            name: book.name,
            link: normalizeLink(book.link),
            description: book.author ? book.author.name : "",
            cover: book.poster ? book.poster['default'] : null,
            host: BASE_URL
        });
    });

    return Response.success(novelList, next);
}