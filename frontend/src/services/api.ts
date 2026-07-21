// frontend/src/services/api.ts

declare global {
  interface ImportMetaEnv {
    readonly VITE_API_URL: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

// ============================================================
// API CONFIGURATION
// ============================================================

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error(
    'VITE_API_URL is not configured.'
  );
}

// ============================================================
// API ERROR
// ============================================================

export class ApiError extends Error {
  status: number;

  constructor(
    message: string,
    status: number
  ) {
    super(message);

    this.name = 'ApiError';
    this.status = status;
  }
}

// ============================================================
// API REQUEST
// ============================================================

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string | null
): Promise<T> {

  const headers = new Headers(
    options.headers
  );

  // Add JSON content type when body exists
  if (options.body) {
    headers.set(
      'Content-Type',
      'application/json'
    );
  }

  // Add JWT token
  if (token) {
    headers.set(
      'Authorization',
      `Bearer ${token}`
    );
  }

  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,
      headers
    }
  );

  // ==========================================================
  // RESPONSE PARSING
  // ==========================================================

  const contentType =
    response.headers.get(
      'content-type'
    );

  let data: unknown;

  if (
    contentType?.includes(
      'application/json'
    )
  ) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  // ==========================================================
  // ERROR HANDLING
  // ==========================================================

  if (!response.ok) {

    let message =
      'Something went wrong';

    if (
      typeof data === 'object' &&
      data !== null
    ) {
      const errorData =
        data as {
          error?: string;
          message?: string;
        };

      message =
        errorData.error ||
        errorData.message ||
        message;
    }

    throw new ApiError(
      message,
      response.status
    );
  }

  return data as T;
}

// ============================================================
// API CLIENT
// ============================================================

export const api = {

  // GET
  get<T>(
    endpoint: string,
    token?: string | null
  ): Promise<T> {

    return request<T>(
      endpoint,
      {
        method: 'GET'
      },
      token
    );
  },

  // POST
  post<T>(
    endpoint: string,
    body?: unknown,
    token?: string | null
  ): Promise<T> {

    return request<T>(
      endpoint,
      {
        method: 'POST',
        body:
          body !== undefined
            ? JSON.stringify(body)
            : undefined
      },
      token
    );
  },

  // PUT
  put<T>(
    endpoint: string,
    body?: unknown,
    token?: string | null
  ): Promise<T> {

    return request<T>(
      endpoint,
      {
        method: 'PUT',
        body:
          body !== undefined
            ? JSON.stringify(body)
            : undefined
      },
      token
    );
  },

  // PATCH
  patch<T>(
    endpoint: string,
    body?: unknown,
    token?: string | null
  ): Promise<T> {

    return request<T>(
      endpoint,
      {
        method: 'PATCH',
        body:
          body !== undefined
            ? JSON.stringify(body)
            : undefined
      },
      token
    );
  },

  // DELETE
  delete<T>(
    endpoint: string,
    token?: string | null
  ): Promise<T> {

    return request<T>(
      endpoint,
      {
        method: 'DELETE'
      },
      token
    );
  }
};