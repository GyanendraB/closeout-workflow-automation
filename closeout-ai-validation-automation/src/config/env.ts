export const env = {
  baseUrl: process.env.BASE_URL ?? "https://closeout-r1fe.enetelsolutions.com/", // UI base URL with a safe default.
  apiBaseUrl: process.env.API_BASE_URL ?? "https://closeout-r1.enetelsolutions.com/", // API base URL for backend calls.
  authUrl: process.env.AUTH_URL ?? "https://closeout-r1.enetelsolutions.com/regions/oauth2/token", // Auth endpoint used to fetch tokens.
  accessToken: process.env.ACCESS_TOKEN, // Optional pre-provided token to skip login in API tests.
  deviceId: process.env.DEVICE_ID ?? "52058587-798f-4d25-ba3f-b166a120bf44", // Device identifier required by the auth API.
  username: process.env.CLOSEOUT_USERNAME ?? "sadev12783@devlug.com", // Default username used for UI/API login.
  password: process.env.CLOSEOUT_PASSWORD ?? "Closeout!123" // Default password used for UI/API login.
};
