import { test as base } from "./base.fixture"; // Extend the project-specific base fixtures.
import { env } from "../config/env"; // Read auth settings from centralized env config.

type AuthFixtures = {
  authToken: string; // Provide a token string to API tests when needed.
};

type AuthResponse = Array<{
  tokens?: Array<{
    access_token?: string; // Token used for authenticated requests.
    refresh_token?: string; // Token used to refresh the access token.
    token_type?: string; // Token type returned by the auth service.
  }>;
}>;

export const test = base.extend<AuthFixtures>({
  authToken: async ({ request }, use) => { // Use Playwright's APIRequestContext to fetch a token.
    const response = await request.post(env.authUrl, {
      data: {
        username: env.username, // Username for authentication.
        password: env.password, // Password for authentication.
        deviceId: env.deviceId // Device identifier expected by the auth API.
      }
    });

    const body = (await response.json().catch(() => [])) as AuthResponse; // Parse JSON response or fall back to empty.
    const authToken = body[0]?.tokens?.[0]?.access_token ?? ""; // Safely extract token or use empty string.
    await use(authToken); // Supply the token to tests that depend on this fixture.
  }
});

export { expect } from "@playwright/test"; // Re-export expect for consistent imports.
