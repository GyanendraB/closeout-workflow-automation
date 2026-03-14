import { env } from "../../src/config/env";

const normalizedApiBaseUrl = env.apiBaseUrl.replace(/\/$/, "");

export const apiTestData = {
  login: {
    expectedRegionBaseUri: normalizedApiBaseUrl
  },
  account: {
    expectedUser: {
      id: 1054,
      firstName: "Gyanendra",
      lastName: "Singh",
      searchKey: "gyanendra singh sadev12783@devlug.com",
      email: "sadev12783@devlug.com",
      company: {
        id: 2,
        name: "Testing only"
      }
    }
  },
  placeholderPhotos: {
    requestPayload: {
      order: "status_asc",
      statuses: ["accepted", "rejected", "not-needed", "initial"],
      locationId: 7920,
      imageSize: "LARGE",
      templateId: 119795
    }
  },
  registration: {
    expectedRegion: {
      name: "Region 1",
      baseUri: normalizedApiBaseUrl,
      tenant: {
        id: 13,
        name: "Testing only",
        description: "Keep out",
        schema: "closeout_sloba"
      }
    }
  }
} as const;
