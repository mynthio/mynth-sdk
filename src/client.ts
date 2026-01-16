import { API_URL } from "./constants";

class MynthClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(options: { apiKey: string; baseUrl?: string }) {
    this.apiKey = options.apiKey;
    this.baseUrl = options.baseUrl
      ? options.baseUrl.endsWith("/")
        ? options.baseUrl.slice(0, -1)
        : options.baseUrl
      : API_URL;
  }

  getAuthHeaders(override?: { accessToken?: string }) {
    return {
      Authorization: `Bearer ${override?.accessToken ?? this.apiKey}`,
    };
  }

  getUrl(path: string) {
    return `${this.baseUrl}${path}`;
  }

  public async post<DataType>(path: string, data: unknown): Promise<DataType> {
    const json = await fetch(this.getUrl(path), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify(data),
    }).then((response) => response.json());

    return json as DataType;
  }

  public async get<DataType>(
    path: string,
    { headers, accessToken }: { headers?: Record<string, string>; accessToken?: string } = {},
  ): Promise<{ data: DataType; status: number; ok: boolean }> {
    const response = await fetch(this.getUrl(path), {
      headers: {
        ...this.getAuthHeaders({ accessToken }),
        ...headers,
      },
    });

    const data = (await response.json()) as DataType;

    return { data, status: response.status, ok: response.ok };
  }
}

export { MynthClient };
