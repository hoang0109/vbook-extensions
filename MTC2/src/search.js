load("config.js");

function execute(key, page) {
    if (!page) page = '1';
    const searchUrl = BASE_API + "/api/books/search";

    const response = fetch(searchUrl, {
        headers: {
            "X-App": "MeTruyenChu"
        },
        queries: {
            "keyword": key,
            "page": page,
        }
    });
    if (response.ok) {
        const json = response.json();
        const novelList = [];
        const next = json.pagination && json.pagination.next ? (json.pagination.next + "") : "";
        json.data.forEach(book => {
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

    return null;
}