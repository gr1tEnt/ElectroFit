import { ApiError } from "@/lib/apiError";
import { getAuthToken } from "@/lib/authStorage";

const API_UNAVAILABLE_MESSAGE =
  "Упс! Бекенд тимчасово недоступний — ми на безкоштовному хостингу, тому сервер інколи «засинає». Зачекайте хвилину і спробуйте ще раз.";

const DEFAULT_API_BASE = "http://localhost:8080";

/**
 * Base API origin from NEXT_PUBLIC_API_URL (no trailing slash, no /api suffix).
 * Paths passed to apiFetch must start with /api/...
 */
export function getApiBase(): string {
  const raw = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (!raw) {
    return DEFAULT_API_BASE;
  }

  let base = raw.replace(/\/+$/, "");
  if (base.endsWith("/api")) {
    base = base.slice(0, -4);
  }

  return base;
}

/** Builds a full API URL from a path such as `/api/admin/orders/1/status`. */
export function buildApiUrl(path: string): string {
  const base = getApiBase();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}

async function parseErrorMessage(response: Response): Promise<{ message: string; title?: string }> {
  const text = await response.text();
  if (!text) {
    return { message: `Запит не вдався (${response.status})` };
  }

  try {
    const json = JSON.parse(text) as {
      detail?: string;
      title?: string;
      message?: string;
      error?: string;
      path?: string;
      status?: number;
    };

    if (json.detail) {
      return { message: json.detail, title: json.title };
    }

    if (json.error && json.path) {
      const status = json.status ?? response.status;
      if (status === 404 && json.path.startsWith("/api/auth")) {
        return {
          message:
            "API автентифікації не знайдено. Перезапустіть backend з кореня проєкту: mvn spring-boot:run (потім зареєструйтеся знову).",
          title: "API застарів",
        };
      }
      return {
        message: `${json.error} (${json.path})`,
        title: json.title,
      };
    }

    return {
      message: json.message ?? json.title ?? text,
      title: json.title,
    };
  } catch {
    return { message: text };
  }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const base = getApiBase();
  const url = path.startsWith("http") ? path : buildApiUrl(path);

  const token = getAuthToken();
  const authHeaders: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

  let response: Response;
  try {
    response = await fetch(url, {
      cache: "no-store",
      ...init,
      headers: {
        Accept: "application/json",
        ...authHeaders,
        ...init?.headers,
      },
    });
  } catch {
    throw new ApiError(
      API_UNAVAILABLE_MESSAGE,
      0,
      "API недоступний",
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
      const response = await fetch(buildApiUrl(path), {
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
