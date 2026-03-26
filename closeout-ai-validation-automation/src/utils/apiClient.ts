import { APIRequestContext, APIResponse } from "@playwright/test"; // Playwright types for API request handling.

export class ApiClient {
  constructor(private readonly request: APIRequestContext) {} // Store the Playwright request context for reuse.

  async post<TResponse>(url: string, data: unknown): Promise<TResponse> {
    const response: APIResponse = await this.request.post(url, { data }); // Send a POST request with a JSON body.
    return (await response.json()) as TResponse; // Parse and return JSON as the typed response.
  }
}
