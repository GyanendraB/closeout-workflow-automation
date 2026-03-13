import { test, expect } from "@playwright/test";
import { env } from "../../src/config/env";

type AuthResponse = Array<{
  tokens?: Array<{
    access_token?: string;
  }>;
}>;

type AccountResponse = {
  id: number;
  firstName: string;
  lastName: string;
  searchKey: string;
  email: string;
  company?: {
    id: number;
    name: string;
  };
};

test("get user account", async ({ request }) => {
  let accessToken = env.accessToken;

  if (!accessToken) {
    const authResponse = await request.post(env.authUrl, {
      data: {
        username: env.username,
        password: env.password,
        deviceId: env.deviceId
      }
    });

    expect(authResponse.ok()).toBeTruthy();

    const authBody = (await authResponse.json()) as AuthResponse;
    accessToken = authBody[0]?.tokens?.[0]?.access_token;
  }

  expect(accessToken).toBeTruthy();

  const response = await request.post(
    `${env.apiBaseUrl}project-administration-service/api/user/account`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      data: {}
    }
  );

  const responseBodyText = await response.text();
  expect(
    response.status(),
    `User account request failed with status ${response.status()} and body: ${responseBodyText}`
  ).toBe(200);

  const contentType = response.headers()["content-type"];
  expect(contentType).toContain("application/json");

  const responseBody = JSON.parse(responseBodyText) as AccountResponse;
  expect(responseBody.id).toBe(1054);
  expect(responseBody.firstName).toBe("Gyanendra");
  expect(responseBody.lastName).toBe("Singh");
  expect(responseBody.searchKey).toBe("gyanendra singh sadev12783@devlug.com");
  expect(responseBody.email).toBe("sadev12783@devlug.com");
  expect(responseBody.company?.id).toBe(2);
  expect(responseBody.company?.name).toBe("Testing only");
});
