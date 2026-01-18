load("config.js");

function execute(url, page) {
    if (!page) page = '1';
    const res = fetch(BASE_URL + url, {
        headers: {
            'user-agent': UserAgent.android(),
            'referer': BASE_URL
        }
    });
    const cookie = res.request && res.request.headers ? res.request.headers.cookie : null;
    if (!cookie) {
        return Response.error("Cần đăng nhập để xem truyện đã bookmark");
    }

    const tokenMatch = /accessToken=([^;]+)/i.exec(cookie);
    if (!tokenMatch) {
        return Response.error("Không tìm thấy accessToken. Vui lòng đăng nhập lại.");
    }

    const authorization = "Bearer " + tokenMatch[1];
    const response = fetch(BASE_API + "/api/bookmarks?filter[gender]=1&limit=15&page=" + page, {
        headers: {
            "authorization": authorization,
            "X-App": "MeTruyenChu"
        }
    });
    if (response.ok) {
        const json = response.json();
        const novelList = [];
        const next = json.pagination && json.pagination.next ? (json.pagination.next + "") : "";
        json.data.forEach(e => {
            novelList.push({
                name: e.book.name,
                link: normalizeLink(e.book.link),
                cover: e.book.poster['default'],
                host: BASE_URL
            })
        });
        if (novelList.length === 0) {
            return Response.error("Chưa có truyện đã bookmark");
        }
        return Response.success(novelList, next);
    }
    return Response.error("Đăng nhập MTC để xem truyện đã bookmark");
}