load("config.js");

function execute(url) {
    url = normalizeLink(url);
    
    const response = fetch(url, {
        headers: {
            'user-agent': UserAgent.android(),
            'referer': url
        }
    });

    if (!response.ok) {
        return null;
    }

    const doc = response.html();
    
    // Bảo vệ: nếu không lấy được dữ liệu, trả error
    const nameNode = doc.select("h1 a.text-lg.text-title").first();
    if (!nameNode) {
        return Response.error("Không tìm thấy truyện. Có thể trang bị lỗi hoặc URL không hợp lệ");
    }

    let genres = [];
    doc.select("a[href*=danh-sach].inline-flex").forEach(e => {
        genres.push({
            title: e.text(),
            input: e.attr("href"),
            script: "gen.js"
        });
    });

    let info = "";
    const tocBtn = doc.select("button[data-x-bind*=toc]").first();
    if (tocBtn) {
        const chapCount = tocBtn.select(".rounded-full").first();
        if (chapCount) {
            info = chapCount.text() + " chương";
        }
    }
    
    doc.select("div.justify-center.mb-6.text-title > div").forEach(e => {
        const key = e.select("div > div").first();
        const val = e.select("div > div").last();
        if (key && val) {
            info += "<br>" + key.text() + " " + val.text();
        }
    });

    const authorNode = doc.select("a[href*=tac-gia]").first();
    const descNode = doc.select("#synopsis .text-base").first();

    return Response.success({
        name: nameNode.text(),
        cover: doc.select("img.shadow-lg").first()?.attr("src") || null,
        host: BASE_URL,
        author: authorNode ? authorNode.text() : "",
        description: descNode ? descNode.html() : "",
        detail: info,
        ongoing: doc.select("a[href*=danh-sach]").text().indexOf("Còn tiếp") >= 0,
        genres: genres
    });
