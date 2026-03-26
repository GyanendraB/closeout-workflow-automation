import { env } from "../../src/config/env"; // Read runtime env values for credentials.

export const uiLoginTestData = {
  validCredentials: {
    username: env.username, // Use configured username for success case.
    password: env.password // Use configured password for success case.
  },
  invalidCredentials: {
    username: env.username, // Keep username same to isolate password validation.
    password: `${env.password}-invalid` // Slightly modify password to force an auth failure.
  },
  expectedUnauthorizedMessage: "Failed to sign in! Unauthorized." // Expected error message on login failure.
} as const; // Make the object deeply readonly for safer test usage.
