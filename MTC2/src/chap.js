load("config.js");

function execute(url) {
    url = normalizeLink(url);
    
    try {
        const response = fetch(url, {
            headers: {
                'user-agent': UserAgent.android(),
                'referer': url
            }
        });

        if (!response.ok) {
            return Response.error("Không thể kết nối đến trang (HTTP " + response.status + ")");
        }

        const doc = response.html();
        const contentNode = doc.select("[data-x-bind=ChapterContent]").first();
        if (!contentNode) {
            return Response.error("Không lấy được nội dung (có thể chương bị khóa hoặc cần đăng nhập)");
        }
        
        const content = contentNode.html();
        if (!content || content.trim() === "") {
            return Response.error("Nội dung chương trống");
        }
        
        return Response.success(content);
    } catch (e) {
        return Response.error("Lỗi: " + e.toString());
    }
}