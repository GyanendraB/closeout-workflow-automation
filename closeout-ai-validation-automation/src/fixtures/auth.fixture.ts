import { test as base } from "./base.fixture";
import { env } from "../config/env";

type AuthFixtures = {
  authToken: string;
};

type AuthResponse = Array<{
  tokens?: Array<{
    access_token?: string;
    refresh_token?: string;
    token_type?: string;
  }>;
}>;

export const test = base.extend<AuthFixtures>({
  authToken: async ({ request }, use) => {
    const response = await request.post(env.authUrl, {
      data: {
        username: env.username,
        password: env.password,
        deviceId: env.deviceId
      }
    });

    const body = (await response.json().catch(() => [])) as AuthResponse;
    const authToken = body[0]?.tokens?.[0]?.access_token ?? "";
    await use(authToken);
  }
});

export { expect } from "@playwright/test";
