/**
 * Test script for Authentication APIs
 * Tests signup, login, and protected routes
 * 
 * Usage: node test-auth-api.js
 */

const BASE_URL = "http://localhost:3000/api";

// Test data
const testUser = {
    name: "Alice Test",
    email: "alice.test@example.com",
    password: "test123456",
    role: "STUDENT"
};

let authToken = null;

// Helper function to make HTTP requests
async function makeRequest(url, method = "GET", body = null, token = null) {
    const options = {
        method,
        headers: {
            "Content-Type": "application/json",
        },
    };

    if (token) {
        options.headers["Authorization"] = `Bearer ${token}`;
    }

    if (body) {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        return {
            status: response.status,
            data,
        };
    } catch (error) {
        console.error("Request failed:", error);
        return { status: 500, data: { error: error.message } };
    }
}

// Test 1: Signup
async function testSignup() {
    console.log("\n🧪 Test 1: User Signup");
    console.log("=".repeat(50));

    const result = await makeRequest(
        `${BASE_URL}/auth/signup`,
        "POST",
        testUser
    );

    console.log(`Status: ${result.status}`);
    console.log("Response:", JSON.stringify(result.data, null, 2));

    if (result.status === 201 || result.status === 409) {
        console.log("✅ Signup test passed");
        return true;
    } else {
        console.log("❌ Signup test failed");
        return false;
    }
}

// Test 2: Login
async function testLogin() {
    console.log("\n🧪 Test 2: User Login");
    console.log("=".repeat(50));

    const result = await makeRequest(
        `${BASE_URL}/auth/login`,
        "POST",
        {
            email: testUser.email,
            password: testUser.password,
        }
    );

    console.log(`Status: ${result.status}`);
    console.log("Response:", JSON.stringify(result.data, null, 2));

    if (result.status === 200 && result.data.data?.token) {
        authToken = result.data.data.token;
        console.log("✅ Login test passed");
        console.log(`🔑 Token: ${authToken.substring(0, 50)}...`);
        return true;
    } else {
        console.log("❌ Login test failed");
        return false;
    }
}

// Test 3: Get Current User Profile (Protected)
async function testGetProfile() {
    console.log("\n🧪 Test 3: Get Current User Profile (Protected)");
    console.log("=".repeat(50));

    const result = await makeRequest(
        `${BASE_URL}/auth/me`,
        "GET",
        null,
        authToken
    );

    console.log(`Status: ${result.status}`);
    console.log("Response:", JSON.stringify(result.data, null, 2));

    if (result.status === 200) {
        console.log("✅ Get profile test passed");
        return true;
    } else {
        console.log("❌ Get profile test failed");
        return false;
    }
}

// Test 4: Access Protected Route without Token
async function testProtectedWithoutToken() {
    console.log("\n🧪 Test 4: Access Protected Route Without Token");
    console.log("=".repeat(50));

    const result = await makeRequest(
        `${BASE_URL}/auth/me`,
        "GET",
        null,
        null // No token
    );

    console.log(`Status: ${result.status}`);
    console.log("Response:", JSON.stringify(result.data, null, 2));

    if (result.status === 401) {
        console.log("✅ Protected route correctly rejected unauthorized access");
        return true;
    } else {
        console.log("❌ Protected route test failed - should return 401");
        return false;
    }
}

// Test 5: List Users (Protected)
async function testListUsers() {
    console.log("\n🧪 Test 5: List Users (Protected)");
    console.log("=".repeat(50));

    const result = await makeRequest(
        `${BASE_URL}/users`,
        "GET",
        null,
        authToken
    );

    console.log(`Status: ${result.status}`);
    console.log("Response:", JSON.stringify(result.data, null, 2));

    if (result.status === 200) {
        console.log("✅ List users test passed");
        return true;
    } else {
        console.log("❌ List users test failed");
        return false;
    }
}

// Test 6: Invalid Login Credentials
async function testInvalidLogin() {
    console.log("\n🧪 Test 6: Invalid Login Credentials");
    console.log("=".repeat(50));

    const result = await makeRequest(
        `${BASE_URL}/auth/login`,
        "POST",
        {
            email: testUser.email,
            password: "wrongpassword",
        }
    );

    console.log(`Status: ${result.status}`);
    console.log("Response:", JSON.stringify(result.data, null, 2));

    if (result.status === 401) {
        console.log("✅ Invalid login test passed - correctly rejected");
        return true;
    } else {
        console.log("❌ Invalid login test failed");
        return false;
    }
}

// Run all tests
async function runTests() {
    console.log("\n" + "=".repeat(50));
    console.log("🚀 Starting Authentication API Tests");
    console.log("=".repeat(50));
    console.log(`Base URL: ${BASE_URL}`);

    const results = [];

    // Run tests sequentially
    results.push(await testSignup());
    results.push(await testLogin());

    if (authToken) {
        results.push(await testGetProfile());
        results.push(await testProtectedWithoutToken());
        results.push(await testListUsers());
    }

    results.push(await testInvalidLogin());

    // Summary
    console.log("\n" + "=".repeat(50));
    console.log("📊 Test Summary");
    console.log("=".repeat(50));
    const passed = results.filter(r => r).length;
    const total = results.length;
    console.log(`Passed: ${passed}/${total}`);
    console.log(`Failed: ${total - passed}/${total}`);

    if (passed === total) {
        console.log("\n✅ All tests passed!");
    } else {
        console.log("\n❌ Some tests failed");
    }
}

// Execute tests
runTests().catch(console.error);
