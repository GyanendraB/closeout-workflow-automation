import { test, expect } from "@playwright/test"; // Playwright test runner and assertions.
import { env } from "../../src/config/env"; // Environment settings for auth URL and credentials.
import { apiTestData } from "../../test-data/payloads/api-test-data"; // Expected API payloads and responses.

type AuthResponse = Array<{
  tokens?: Array<{
    access_token?: string; // Access token for authenticated requests.
  }>;
}>;

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

test("get user account", async ({ request }) => {
  let accessToken = env.accessToken; // Reuse a provided token if available.

  if (!accessToken) {
    const authResponse = await request.post(env.authUrl, {
      data: {
        username: env.username, // Username used for authentication.
        password: env.password, // Password used for authentication.
        deviceId: env.deviceId // Device identifier expected by auth API.
      }
    });

    expect(authResponse.ok()).toBeTruthy(); // Ensure the auth call succeeded.

    const authBody = (await authResponse.json()) as AuthResponse; // Parse the JSON body.
    accessToken = authBody[0]?.tokens?.[0]?.access_token; // Extract the token.
  }

  expect(accessToken).toBeTruthy(); // Ensure we have a valid token.

  const response = await request.post(
    `${env.apiBaseUrl}project-administration-service/api/user/account`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`, // Attach bearer token for auth.
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
