const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5149";

const parseResponse = async (res) => {
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    const message = data?.message || "Request failed";
    throw new Error(message);
  }
  return data;
};

export const authStorage = {
  set(auth) {
    localStorage.setItem("auth", JSON.stringify(auth));
  },
  get() {
    const raw = localStorage.getItem("auth");
    return raw ? JSON.parse(raw) : null;
  },
  clear() {
    localStorage.removeItem("auth");
  }
};

export const authApi = {
  async register(payload) {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    return parseResponse(res);
  },

  async login(payload) {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    return parseResponse(res);
  },

  async confirmEmail(email, token) {
    const query = new URLSearchParams({ email, token });
    const res = await fetch(`${API_BASE}/api/auth/confirm-email?${query.toString()}`);
    return parseResponse(res);
  },

  async forgotPassword(email) {
    const res = await fetch(`${API_BASE}/api/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });
    return parseResponse(res);
  },

  async resetPassword(payload) {
    const res = await fetch(`${API_BASE}/api/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    return parseResponse(res);
  }
};

export const profileApi = {
  async me(token) {
    const res = await fetch(`${API_BASE}/api/profile/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return parseResponse(res);
  },

  async update(token, payload) {
    const res = await fetch(`${API_BASE}/api/profile/me`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    return parseResponse(res);
  },

  async uploadPhoto(token, file) {
    const formData = new FormData();
    formData.append("photo", file);
    const res = await fetch(`${API_BASE}/api/profile/upload-photo`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    });
    return parseResponse(res);
  },

  async tickets(token) {
    const res = await fetch(`${API_BASE}/api/profile/tickets`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return parseResponse(res);
  },

  async refund(token, payload) {
    const res = await fetch(`${API_BASE}/api/profile/refund-request`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    return parseResponse(res);
  },

  async purchase(token, payload) {
    const res = await fetch(`${API_BASE}/api/profile/purchase`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    return parseResponse(res);
  }
};

export const toAbsoluteImage = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_BASE}${path}`;
};
