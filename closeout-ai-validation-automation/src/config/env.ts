export const env = {
  baseUrl: process.env.BASE_URL ?? "https://closeout-r1fe.enetelsolutions.com/",
  apiBaseUrl: process.env.API_BASE_URL ?? "https://closeout-r1.enetelsolutions.com/",
  authUrl: process.env.AUTH_URL ?? "https://closeout-r1.enetelsolutions.com/regions/oauth2/token",
  accessToken: process.env.ACCESS_TOKEN,
  deviceId: process.env.DEVICE_ID ?? "52058587-798f-4d25-ba3f-b166a120bf44",
  username: process.env.CLOSEOUT_USERNAME ?? "sadev12783@devlug.com",
  password: process.env.CLOSEOUT_PASSWORD ?? "Closeout!123"
};
