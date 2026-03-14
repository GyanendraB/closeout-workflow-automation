import { env } from "../../src/config/env";

export const uiLoginTestData = {
  validCredentials: {
    username: env.username,
    password: env.password
  },
  invalidCredentials: {
    username: env.username,
    password: `${env.password}-invalid`
  },
  expectedUnauthorizedMessage: "Failed to sign in! Unauthorized."
} as const;
