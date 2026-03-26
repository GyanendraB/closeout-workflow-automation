import { env } from "../../src/config/env"; // Read runtime env values for dynamic expectations.

const normalizedApiBaseUrl = env.apiBaseUrl.replace(/\/$/, ""); // Normalize API base URL by removing trailing slash.

export const apiTestData = {
  login: {
    expectedRegionBaseUri: normalizedApiBaseUrl // Expected base URI returned by the login API.
  },
  account: {
    expectedUser: {
      id: 1054, // Expected user ID for account validation.
      firstName: "Gyanendra", // Expected first name.
      lastName: "Singh", // Expected last name.
      searchKey: "gyanendra singh sadev12783@devlug.com", // Expected search key value.
      email: "sadev12783@devlug.com", // Expected email address.
      company: {
        id: 2, // Expected company ID.
        name: "Testing only" // Expected company name.
      }
    }
  },
  placeholderPhotos: {
    requestPayload: {
      order: "status_asc", // Sort placeholders by status.
      statuses: ["accepted", "rejected", "not-needed", "initial"], // Statuses to include.
      locationId: 7920, // Location filter for placeholders.
      imageSize: "LARGE", // Size of images returned by the API.
      templateId: 119795 // Template filter for placeholders.
    }
  },
  registration: {
    expectedRegion: {
      name: "Region 1", // Expected region name.
      baseUri: normalizedApiBaseUrl, // Expected region base URI.
      tenant: {
        id: 13, // Expected tenant ID.
        name: "Testing only", // Expected tenant name.
        description: "Keep out", // Expected tenant description.
        schema: "closeout_sloba" // Expected tenant schema name.
      }
    }
  }
} as const; // Make the object deeply readonly for safer test usage.
