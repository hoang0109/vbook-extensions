load("config.js");

function execute(key, page) {
    if (!page) page = '1';
    let searchUrl = BASE_URL2.replace("https://", "https://backend.") + "/api/books/search";

    let response = fetch(searchUrl, {
        headers: {
            "X-App": "MeTruyenChu"
        },
        queries: {
            "keyword": key,
            "page": page,
        }
    });
    if (response.ok) {
        let json = response.json();
        let novelList = [];
        let next = json.pagination && json.pagination.next ? json.pagination.next + "" : null;
        json.data.forEach(book => {
            novelList.push({
                name: book.name,
                link: book.link,
                description: book.author && book.author.name ? book.author.name : "Không rõ",
                cover: book.poster && book.poster['default'] ? book.poster['default'] : "",
                host: BASE_URL
            })
        });
        return Response.success(novelList, next);
    }

    return null;
}