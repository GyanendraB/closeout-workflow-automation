import { test, expect } from "@playwright/test";
import { env } from "../../src/config/env";

type AuthResponse = Array<{
  tokens?: Array<{
    access_token?: string;
  }>;
}>;

type PlaceholderPhoto = {
  id: number;
  locationId: number;
  templateId: number;
  createdBy: number;
  createdDate: string;
  createdComment?: string;
  document?: {
    id: number;
    name: string;
    createdDate: string;
  };
  documentId?: number;
  placeholderStatus?: {
    id: number;
    name: string;
  };
  placeholderItemType?: string;
};

test("get placeholder photos", async ({ request }) => {
  const payload = {
    order: "status_asc",
    statuses: ["accepted", "rejected", "not-needed", "initial"],
    locationId: 7920,
    imageSize: "LARGE",
    templateId: 119795
  };

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
    `${env.apiBaseUrl}control-panel/api/placeholders/photos`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      data: payload
    }
  );

  const responseBodyText = await response.text();
  expect(
    response.status(),
    `Placeholder photos request failed with status ${response.status()} and body: ${responseBodyText}`
  ).toBe(200);

  const contentType = response.headers()["content-type"];
  expect(contentType).toContain("application/json");

  const responseBody = JSON.parse(responseBodyText) as PlaceholderPhoto[];
  expect(Array.isArray(responseBody)).toBeTruthy();
  expect(responseBody.length).toBeGreaterThan(0);

  const firstPhoto = responseBody[0];
  expect(firstPhoto.id).toBeTruthy();
  expect(firstPhoto.locationId).toBe(payload.locationId);
  expect(firstPhoto.templateId).toBe(payload.templateId);
  expect(firstPhoto.createdBy).toBeTruthy();
  expect(firstPhoto.createdDate).toBeTruthy();
  expect(firstPhoto.createdComment).toBeTruthy();

  expect(firstPhoto.document?.id).toBeTruthy();
  expect(firstPhoto.document?.name).toBeTruthy();
  expect(firstPhoto.document?.createdDate).toBeTruthy();
  expect(firstPhoto.documentId).toBeTruthy();

  expect(firstPhoto.placeholderStatus?.id).toBeTruthy();
  expect(firstPhoto.placeholderStatus?.name).toBeTruthy();
  expect(payload.statuses.map((status) => status.toUpperCase())).toContain(firstPhoto.placeholderStatus?.name ?? "");
  expect(firstPhoto.placeholderItemType).toBeTruthy();
});
