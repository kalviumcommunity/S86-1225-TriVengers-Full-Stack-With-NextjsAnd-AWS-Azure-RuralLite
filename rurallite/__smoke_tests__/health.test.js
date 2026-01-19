describe("Smoke Test - Health Endpoint", () => {
  it("should return 200 from /api/health", async () => {
    const res = await fetch("http://localhost:3000/api/health");
    expect(res.status).toBe(200);
  });
});
