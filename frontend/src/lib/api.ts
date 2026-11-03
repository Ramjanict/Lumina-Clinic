export class ApiError extends Error {}

type Options = {
  method?: string;
  json?: unknown;
  form?: FormData;
  token?: string | null;
};

export async function api<T>(path: string, options?: Options): Promise<T> {
  const headers: Record<string, string> = {};
  if (options?.token) headers.Authorization = `Bearer ${options.token}`;

  let body: BodyInit | undefined;
  if (options?.form) {
    body = options.form;
  } else if (options?.json !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(options.json);
  }

  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  const response = await fetch(`${base}/api${path}`, {
    method: options?.method ?? (body ? "POST" : "GET"),
    headers,
    body,
  });

  const data = (await response.json().catch(() => ({}))) as { message?: string };
  if (!response.ok) {
    throw new ApiError(data.message || "Something went wrong");
  }
  return data as T;
}
