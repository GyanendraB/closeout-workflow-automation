import { test, expect } from "../../src/fixtures/auth.fixture"; // Use auth fixture to supply tokens.
import { env } from "../../src/config/env"; // Environment settings for API base URL.
import { apiTestData } from "../../test-data/payloads/api-test-data"; // Expected API payloads and responses.

type PlaceholderPhoto = {
  id: number; // Placeholder ID.
  locationId: number; // Site or location ID.
  templateId: number; // Template ID used by the placeholder.
  createdBy: number; // User ID that created the placeholder.
  createdDate: string; // Timestamp of creation.
  createdComment?: string; // Optional comment associated with the placeholder.
  document?: {
    id: number; // Document ID.
    name: string; // Document name.
    createdDate: string; // Document creation timestamp.
  };
  documentId?: number; // Document ID reference.
  placeholderStatus?: {
    id: number; // Status ID.
    name: string; // Status name.
  };
  placeholderItemType?: string; // Placeholder type string.
};

test("get placeholder photos", async ({ request, authToken }) => {
  const payload = apiTestData.placeholderPhotos.requestPayload; // Request payload with filters.

  expect(authToken).toBeTruthy(); // Ensure we have a valid token from the fixture.

  const response = await request.post(
    `${env.apiBaseUrl}control-panel/api/placeholders/photos`,
    {
      headers: {
        Authorization: `Bearer ${authToken}`, // Attach bearer token for auth.
        "Content-Type": "application/json" // Explicit JSON content type.
      },
      data: payload // Payload filters for placeholder photos.
    }
  );

  const responseBodyText = await response.text(); // Read response as text for debugging.
  expect(
    response.status(),
    `Placeholder photos request failed with status ${response.status()} and body: ${responseBodyText}`
  ).toBe(200); // Validate the response status.

  const contentType = response.headers()["content-type"]; // Read response content type.
  expect(contentType).toContain("application/json"); // Ensure response is JSON.

  const responseBody = JSON.parse(responseBodyText) as PlaceholderPhoto[]; // Parse JSON response.
  expect(Array.isArray(responseBody)).toBeTruthy(); // Confirm array response.
  expect(responseBody.length).toBeGreaterThan(0); // Ensure at least one placeholder photo is returned.

  const firstPhoto = responseBody[0]; // Inspect the first placeholder photo.
  expect(firstPhoto.id).toBeTruthy(); // Validate ID is present.
  expect(firstPhoto.locationId).toBe(payload.locationId); // Validate location ID matches request.
  expect(firstPhoto.templateId).toBe(payload.templateId); // Validate template ID matches request.
  expect(firstPhoto.createdBy).toBeTruthy(); // Validate createdBy is present.
  expect(firstPhoto.createdDate).toBeTruthy(); // Validate createdDate is present.
  expect(firstPhoto.createdComment).toBeTruthy(); // Validate comment exists.

  expect(firstPhoto.document?.id).toBeTruthy(); // Validate document ID is present.
  expect(firstPhoto.document?.name).toBeTruthy(); // Validate document name is present.
  expect(firstPhoto.document?.createdDate).toBeTruthy(); // Validate document creation timestamp.
  expect(firstPhoto.documentId).toBeTruthy(); // Validate documentId is present.

  expect(firstPhoto.placeholderStatus?.id).toBeTruthy(); // Validate status ID is present.
  expect(firstPhoto.placeholderStatus?.name).toBeTruthy(); // Validate status name is present.
  expect(payload.statuses.map((status) => status.toUpperCase())).toContain(firstPhoto.placeholderStatus?.name ?? ""); // Validate status is expected.
  expect(firstPhoto.placeholderItemType).toBeTruthy(); // Validate placeholder type is present.
});
