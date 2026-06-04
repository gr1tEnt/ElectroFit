import { ApiError } from "@/lib/apiError";

const API_UNAVAILABLE_MESSAGE =
  "Cannot reach the API at {base}. Start the backend: mvn spring-boot:run";

export function getApiBase(): string {
  return process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";
}

async function parseErrorMessage(response: Response): Promise<{ message: string; title?: string }> {
  const text = await response.text();
  if (!text) {
    return { message: `Request failed (${response.status})` };
  }

  try {
    const json = JSON.parse(text) as {
      detail?: string;
      title?: string;
      message?: string;
    };
    return {
      message: json.detail ?? json.message ?? json.title ?? text,
      title: json.title,
    };
  } catch {
    return { message: text };
  }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const base = getApiBase();
  const url = path.startsWith("http") ? path : `${base}${path.startsWith("/") ? path : `/${path}`}`;

  let response: Response;
  try {
    response = await fetch(url, {
      cache: "no-store",
      ...init,
      headers: {
        Accept: "application/json",
        ...init?.headers,
      },
    });
  } catch {
    throw new ApiError(
      API_UNAVAILABLE_MESSAGE.replace("{base}", base),
      0,
      "API unavailable",
    );
  }

  if (response.ok) {
    if (response.status === 204) {
      return undefined as T;
    }
    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
      return undefined as T;
    }
    return response.json() as Promise<T>;
  }

  const { message, title } = await parseErrorMessage(response);
  throw new ApiError(message, response.status, title);
}

const HEALTH_PROBE_PATHS = ["/api/health", "/api/admin/stats", "/api/products"];

export async function checkApiHealth(): Promise<boolean> {
  const base = getApiBase();

  for (const path of HEALTH_PROBE_PATHS) {
    try {
      const response = await fetch(`${base}${path}`, {
        cache: "no-store",
        signal: AbortSignal.timeout(4000),
      });
      if (response.ok) {
        return true;
      }
    } catch {
      // try next probe
    }
  }

  return false;
}
