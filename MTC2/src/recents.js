load("config.js")

function execute(url, page) {
    if (!page) page = '1';

    const match = /ho-so\/(\d+)\/?/.exec(url);
    if (!match || !match[1]) {
        return Response.error("URL không hợp lệ");
    }
    
    const id = match[1];
    const filterUrl = BASE_API + "/api/books";
    let response = fetch(filterUrl, {
        headers: {
            "X-App": "MeTruyenChu"
        },
        queries: {
            "filter[creator]": id,
            "filter[gender]": "1",
            "filter[kind]": "1",
            "filter[state]": "published",
            "include": "author,genres,creator",
            "limit": "5",
            "page": page,
            "sort": "-new_chap_at"
        }
    });
    if (response.ok) {
        let json = response.json();
        let novelList = [];
        let next = json.pagination && json.pagination.next ? (json.pagination.next + "") : "";
        json.data.forEach(book => {
            novelList.push({
                name: book.name || "N/A",
                link: normalizeLink(book.link),
                description: book.author && book.author.name ? book.author.name : "",
                cover: book.poster && book.poster['default'] ? book.poster['default'] : null,
                host: BASE_URL
            })
        });
        return Response.success(novelList, next);
    }

    return null;
}