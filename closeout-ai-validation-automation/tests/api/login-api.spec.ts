import { test, expect } from "@playwright/test"; // Playwright test runner and assertions.
import { env } from "../../src/config/env"; // Environment settings for auth URL and credentials.
import { apiTestData } from "../../test-data/payloads/api-test-data"; // Expected API payloads and responses.

type AuthResponse = Array<{
  name?: string; // Region name or environment name.
  base_uri?: string; // Base URI returned by the auth service.
  tokens?: Array<{
    access_token?: string; // Access token for authenticated requests.
    refresh_token?: string; // Refresh token for renewing access.
    token_type?: string; // Token type string.
  }>;
}>;

test.describe("Login API", () => {
  test("should authenticate with valid credentials", async ({ request }) => {
    const response = await request.post(env.authUrl, {
      data: {
        username: env.username, // Username used for authentication.
        password: env.password, // Password used for authentication.
        deviceId: env.deviceId // Device identifier expected by auth API.
      }
    });

    expect(response.ok()).toBeTruthy(); // Ensure the HTTP response is successful.

    const body = (await response.json()) as AuthResponse; // Parse the JSON body.
    expect(body[0]?.base_uri).toBe(apiTestData.login.expectedRegionBaseUri); // Validate base URI.
    expect(body[0]?.tokens?.[0]?.access_token).toBeTruthy(); // Ensure a token is returned.
  });
});
