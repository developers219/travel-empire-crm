const BASE_URL = "http://localhost:3333/api";

export const TOKEN_KEY = "crm_token";

export const request = async (path, options = {}) => {
  const token = localStorage.getItem(TOKEN_KEY);

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    // Login page ke apne 401 (galat password) pe logout nahi karna
    if (response.status === 401 && path !== "/auth/login") {
      localStorage.removeItem(TOKEN_KEY);
      window.dispatchEvent(new Event("auth:expired"));
    }
    throw new Error(result.message || "Something went wrong");
  }

  return result.data ?? result;
};
