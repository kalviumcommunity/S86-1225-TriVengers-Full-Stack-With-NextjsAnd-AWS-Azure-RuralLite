// API Routes Test Script
const baseUrl = "http://localhost:3001";

const endpoints = [
  "/api/testdb",
  "/api/users",
  "/api/lessons",
  "/api/quizzes",
  "/api/progress",
  "/api/quiz-results",
  "/api/notes",
];

console.log("\n🧪 Testing RuralLite API Routes");
console.log("================================\n");

async function testEndpoint(endpoint) {
  const url = `${baseUrl}${endpoint}`;
  console.log(`Testing: ${endpoint}`);

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (response.ok && data.success) {
      const count = data.count !== undefined ? data.count : "N/A";
      const counts = data.counts ? JSON.stringify(data.counts) : "";
      console.log(
        `  ✓ PASS - Status: ${response.status} | Count: ${count}${counts ? " | " + counts : ""}`
      );
      return { endpoint, status: "PASS", statusCode: response.status };
    } else {
      console.log(`  ✗ FAIL - Error: ${data.error || "Unknown error"}`);
      return { endpoint, status: "FAIL", statusCode: response.status };
    }
  } catch (error) {
    console.log(`  ✗ ERROR - ${error.message}`);
    return { endpoint, status: "ERROR", statusCode: "N/A" };
  }
}

async function runTests() {
  const results = [];

  for (const endpoint of endpoints) {
    const result = await testEndpoint(endpoint);
    results.push(result);
    console.log("");
  }

  console.log("================================");
  console.log("📊 Test Summary");
  console.log("================================\n");

  console.table(results);

  const passCount = results.filter((r) => r.status === "PASS").length;
  const totalCount = results.length;
  const passRate = ((passCount / totalCount) * 100).toFixed(2);

  console.log(`\nTotal Tests: ${totalCount}`);
  console.log(`Passed: ${passCount}`);
  console.log(`Failed: ${totalCount - passCount}`);
  console.log(`Pass Rate: ${passRate}%\n`);

  if (passRate === "100.00") {
    console.log("🎉 All API routes are working correctly!\n");
  } else {
    console.log("⚠️  Some API routes failed. Please check the errors above.\n");
  }
}

runTests().catch(console.error);
