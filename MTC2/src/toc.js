load("config.js");

function execute(url) {
    url = normalizeLink(url);

    const slugMatch = /truyen\/([^/?#]+)/i.exec(url);
    const slug = slugMatch ? slugMatch[1] : "";

    const htmlResponse = fetch(url, {
        headers: {
            'user-agent': UserAgent.android(),
            'referer': url
        }
    });
    if (!htmlResponse.ok) {
        return null;
    }

    const html = htmlResponse.html().html();

    function extractIdFromHtml() {
        const patterns = [
            /"id":\s*(\d+)/i,
            /book_id\s*[:=]\s*(\d+)/i,
            /data-book-id=["'](\d+)["']/i
        ];
        for (let i = 0; i < patterns.length; i++) {
            const m = patterns[i].exec(html);
            if (m && m[1]) return m[1];
        }
        return null;
    }

    function fetchBookMeta() {
        if (!slug) return null;
        let metaResp = fetch(BASE_API + "/api/books/" + slug, {
            headers: { "X-App": "MeTruyenChu" }
        });
        if (metaResp.ok) {
            const data = metaResp.json();
            if (data && data.data && data.data.id) return data.data.id;
        }

        metaResp = fetch(BASE_API + "/api/books", {
            headers: { "X-App": "MeTruyenChu" },
            queries: { "filter[slug]": slug, "limit": "1" }
        });
        if (metaResp.ok) {
            const data = metaResp.json();
            if (data && data.data && data.data.length > 0 && data.data[0].id) return data.data[0].id;
        }
        return null;
    }

    const bookId = extractIdFromHtml() || fetchBookMeta();
    if (!bookId) {
        return null;
    }

    const chapters = [];
    let page = 1;
    let hasNext = true;

    while (hasNext) {
        const tocUrl = BASE_API + "/api/chapters";
        const resp = fetch(tocUrl, {
            headers: { "X-App": "MeTruyenChu" },
            queries: {
                "filter[book_id]": bookId,
                "filter[type]": "published",
                "page": page,
                "limit": 200
            }
        });

        if (!resp.ok) break;
        const data = resp.json();
        if (!data || !data.data) break;

        data.data.forEach(chapter => {
            chapters.push({
                name: chapter.name,
                url: "chuong-" + chapter.index,
                host: url,
                lock: chapter.is_locked === true
            });
        });

        if (data.pagination && data.pagination.next) {
            page = data.pagination.next;
            hasNext = true;
        } else {
            hasNext = false;
        }
    }

    return Response.success(chapters);
}