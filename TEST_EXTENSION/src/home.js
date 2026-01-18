function execute() {
    return Response.success([
        {
            title: "Test Tab",
            script: "test.js",
            input: "test"
        }
    ]);
}