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
    const contentNode = doc.select("[data-x-bind=ChapterContent]").first();
    if (!contentNode) {
        return Response.error("Không lấy được nội dung (có thể chương bị khóa hoặc cần đăng nhập)");
    }
    const content = contentNode.html();
    return Response.success(content);
}