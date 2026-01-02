#!/usr/bin/env node

/**
 * GitHub Actions CI Pipeline Test Script
 * This script simulates the CI pipeline locally to validate configuration
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("🚀 Testing CI Pipeline Configuration...\n");

// Test 1: Verify workflow files exist
console.log("📁 Checking workflow files...");
const workflowDir = path.join(process.cwd(), ".github", "workflows");
const requiredWorkflows = ["ci.yml", "integration-tests.yml", "docker.yml"];

requiredWorkflows.forEach((workflow) => {
  const workflowPath = path.join(workflowDir, workflow);
  if (fs.existsSync(workflowPath)) {
    console.log(`✅ ${workflow} found`);
  } else {
    console.log(`❌ ${workflow} missing`);
  }
});

// Test 2: Validate package.json scripts
console.log("\n📦 Checking package.json scripts...");
try {
  const packagePath = path.join(process.cwd(), "rurallite", "package.json");
  const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));

  const requiredScripts = ["dev", "build", "start", "lint", "test"];
  requiredScripts.forEach((script) => {
    if (packageJson.scripts[script]) {
      console.log(`✅ Script "${script}" found`);
    } else {
      console.log(`❌ Script "${script}" missing`);
    }
  });
} catch (error) {
  console.log(`❌ Error reading package.json: ${error.message}`);
}

// Test 3: Run lint check
console.log("\n🔍 Running lint check...");
try {
  process.chdir(path.join(process.cwd(), "rurallite"));
  execSync("npm run lint", { stdio: "inherit" });
  console.log("✅ Lint check passed");
} catch (error) {
  console.log("❌ Lint check failed");
}

// Test 4: Check for health endpoint
console.log("\n🏥 Checking health endpoint...");
const healthPath = path.join(process.cwd(), "app", "api", "health", "route.js");
if (fs.existsSync(healthPath)) {
  console.log("✅ Health endpoint found");
} else {
  console.log("❌ Health endpoint missing");
}

// Test 5: Verify Dockerfile
console.log("\n🐳 Checking Docker configuration...");
const dockerfilePath = path.join(process.cwd(), "..", "Dockerfile");
if (fs.existsSync(dockerfilePath)) {
  console.log("✅ Dockerfile found");
} else {
  console.log("❌ Dockerfile missing");
}

console.log("\n🎯 CI Pipeline test completed!");
console.log("📋 Next steps:");
console.log("1. Commit and push to trigger GitHub Actions");
console.log("2. Check Actions tab for pipeline execution");
console.log("3. Configure deployment secrets if needed");
console.log("4. Review and adjust workflow triggers as needed");
