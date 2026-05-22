const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
export const saveTokens = (tokens) => {
  if (tokens.access) localStorage.setItem("access_token", tokens.access);
  if (tokens.refresh) localStorage.setItem("refresh_token", tokens.refresh);
};

export const clearTokens = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
};

export const getAccessToken = () => localStorage.getItem("access_token");
export const getRefreshToken = () => localStorage.getItem("refresh_token");


const refreshAccessToken = async () => {
  const refresh = getRefreshToken();
  if (!refresh) return null;
  try {
    const res = await fetch(`${BASEURL}/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    saveTokens(data); // saves new access (refresh stays the same)
    return data.access;
  } catch {
    return null;
  }
};

const buildRequest = (token, options) => {
  const headers = options.headers ? { ...options.headers } : {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  headers["Content-Type"] = headers["Content-Type"] || "application/json";
  return { ...options, headers };
};

export const authFetch = async (url, options = {}) => {
  let token = getAccessToken();
  let res = await fetch(url, buildRequest(token, options));

  // If access token expired, try refreshing once and retry
  if (res.status === 401) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      res = await fetch(url, buildRequest(newToken, options));
    } else {
      // Refresh failed → clear and force re-login
      clearTokens();
      window.location.href = "/login";
    }
  }
  return res;
};

// export const authFetch = (url, options = {}) => {
//   const token = getAccessToken();
//   const headers = options.headers ? {...options.headers} : {};
//   if (token) headers['Authorization'] = `Bearer ${token}`;
//   headers['Content-Type'] = headers['Content-Type'] || 'application/json';
//   return fetch(url, {...options, headers});
// };