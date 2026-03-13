import { APIRequestContext, APIResponse } from "@playwright/test";

export class ApiClient {
  constructor(private readonly request: APIRequestContext) {}

  async post<TResponse>(url: string, data: unknown): Promise<TResponse> {
    const response: APIResponse = await this.request.post(url, { data });
    return (await response.json()) as TResponse;
  }
}
