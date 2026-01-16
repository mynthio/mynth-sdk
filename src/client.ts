class MynthClient {
  private readonly apiKey: string;

  constructor(options: { apiKey: string }) {
    this.apiKey = options.apiKey;
  }

  getAuthHeaders(override?: { accessToken?: string }) {
    return {
      Authorization: `Bearer ${override?.accessToken ?? this.apiKey}`,
    };
  }

  public async post<DataType>(url: string, data: unknown): Promise<DataType> {
    const json = await fetch(url, {
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
    url: string,
    { headers, accessToken }: { headers?: Record<string, string>; accessToken?: string } = {},
  ): Promise<{ data: DataType; status: number; ok: boolean }> {
    const response = await fetch(url, {
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
