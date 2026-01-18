function execute(url, page) {
    return Response.success([
        {
            name: "Test Book",
            link: "test",
            description: "This is a test",
            cover: "https://example.com/image.jpg",
            host: "https://example.com"
        }
    ], null);
}