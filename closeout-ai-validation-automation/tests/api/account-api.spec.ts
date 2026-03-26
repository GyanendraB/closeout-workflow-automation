import { test, expect } from "../../src/fixtures/auth.fixture"; // Use auth fixture to supply tokens.
import { env } from "../../src/config/env"; // Environment settings for API base URL.
import { apiTestData } from "../../test-data/payloads/api-test-data"; // Expected API payloads and responses.

type AccountResponse = {
  id: number; // User ID.
  firstName: string; // User first name.
  lastName: string; // User last name.
  searchKey: string; // Search key from backend.
  email: string; // User email.
  company?: {
    id: number; // Company ID.
    name: string; // Company name.
  };
};

test("get user account", async ({ request, authToken }) => {
  expect(authToken).toBeTruthy(); // Ensure we have a valid token from the fixture.

  const response = await request.post(
    `${env.apiBaseUrl}project-administration-service/api/user/account`,
    {
      headers: {
        Authorization: `Bearer ${authToken}`, // Attach bearer token for auth.
        "Content-Type": "application/json" // Explicit JSON content type.
      },
      data: {}
    }
  );

  const responseBodyText = await response.text(); // Read response as text for debugging.
  expect(
    response.status(),
    `User account request failed with status ${response.status()} and body: ${responseBodyText}`
  ).toBe(200); // Validate the response status.

  const contentType = response.headers()["content-type"]; // Read response content type.
  expect(contentType).toContain("application/json"); // Ensure response is JSON.

  const responseBody = JSON.parse(responseBodyText) as AccountResponse; // Parse JSON response.
  const { expectedUser } = apiTestData.account; // Load expected values from test data.

  expect(responseBody.id).toBe(expectedUser.id); // Validate user ID.
  expect(responseBody.firstName).toBe(expectedUser.firstName); // Validate first name.
  expect(responseBody.lastName).toBe(expectedUser.lastName); // Validate last name.
  expect(responseBody.searchKey).toBe(expectedUser.searchKey); // Validate search key.
  expect(responseBody.email).toBe(expectedUser.email); // Validate email.
  expect(responseBody.company?.id).toBe(expectedUser.company.id); // Validate company ID.
  expect(responseBody.company?.name).toBe(expectedUser.company.name); // Validate company name.
});
