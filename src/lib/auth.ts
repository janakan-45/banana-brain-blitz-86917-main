export type LogoutEndpoint = "logout" | "logout-all";

interface LogoutResult {
  ok: boolean;
  status: number;
  message?: string;
}

const BANANA_USER_KEY = "banana-user";

export const clearStoredSession = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem(BANANA_USER_KEY);
};

export const invokeLogoutEndpoint = async (apiBaseUrl: string, endpoint: LogoutEndpoint): Promise<LogoutResult> => {
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  if (!accessToken && !refreshToken) {
    return {
      ok: false,
      status: 0,
      message: "No session tokens found.",
    };
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  try {
    const response = await fetch(`${apiBaseUrl}/banana/${endpoint}/`, {
      method: "POST",
      headers,
      body: refreshToken ? JSON.stringify({ refresh: refreshToken }) : undefined,
    });

    if (response.ok) {
      return { ok: true, status: response.status };
    }

    if (response.status === 401) {
      return { ok: true, status: response.status, message: "Session already invalid." };
    }

    let errorMessage: string | undefined;
    try {
      const data = await response.json();
      errorMessage = data?.detail || data?.message;
    } catch (parseError) {
      errorMessage = undefined;
    }

    return {
      ok: false,
      status: response.status,
      message: errorMessage || "Failed to log out.",
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      message: error instanceof Error ? error.message : "Network error",
    };
  }
};
