load("config.js");
function execute(url, page) {
    if (!page) page = '1';
    let limitParam = url.includes('limit=') ? '' : '&limit=20';
    let tocUrl = BASE_URL2.replace("https://", "https://backend.") + url + limitParam + "&page=" + page;

    let response = fetch(tocUrl, {
        headers: {
            "X-App": "MeTruyenChu"
        },
    });
    if (response.ok) {
        let json = response.json();
        let novelList = [];
        let next = json.pagination && json.pagination.next ? json.pagination.next + "" : null;
        json.data.forEach(book => {
            novelList.push({
                name: book.book.name,
                link: book.book.link,
                description: book.book.author && book.book.author.name ? book.book.author.name : "Không rõ",
                cover: book.book.poster && book.book.poster['default'] ? book.book.poster['default'] : "",
                host: BASE_URL
            })
        });
        return Response.success(novelList, next);
    }

    return null;
}