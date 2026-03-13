import { test, expect } from "@playwright/test";
import { env } from "../../src/config/env";

type AuthResponse = Array<{
  name?: string;
  base_uri?: string;
  tokens?: Array<{
    access_token?: string;
    refresh_token?: string;
    token_type?: string;
  }>;
}>;

test.describe("Login API", () => {
  test("should authenticate with valid credentials", async ({ request }) => {
    const response = await request.post(env.authUrl, {
      data: {
        username: env.username,
        password: env.password,
        deviceId: env.deviceId
      }
    });

    expect(response.ok()).toBeTruthy();

    const body = (await response.json()) as AuthResponse;
    expect(body[0]?.base_uri).toBeTruthy();
    expect(body[0]?.tokens?.[0]?.access_token).toBeTruthy();
  });
});
