load("config.js");
function execute(url, page) {
    if (!page) page = '1';
    const tocUrl = BASE_API + url + "&limit=20&page=" + page;

    const response = fetch(tocUrl, {
        headers: {
            "X-App": "MeTruyenChu"
        },
    });
    if (response.ok) {
        const json = response.json();
        const novelList = [];
        const next = json.pagination && json.pagination.next ? (json.pagination.next + "") : "";
        json.data.forEach(book => {
            novelList.push({
                name: book.book.name,
                link: normalizeLink(book.book.link),
                description: book.book.author.name,
                cover: book.book.poster['default'],
                host: BASE_URL
            })
        });
        return Response.success(novelList, next);
    }

    return null;
}