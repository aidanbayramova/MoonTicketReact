const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5149";

const extractErrorMessage = (data, status) => {
  if (!data) {
    return `Request failed with status ${status}`;
  }

  if (typeof data === "string") {
    return data;
  }

  if (Array.isArray(data?.errors) && data.errors.length > 0) {
    return data.errors[0];
  }

  if (data?.errors && typeof data.errors === "object") {
    const firstFieldErrors = Object.values(data.errors).find(
      (value) => Array.isArray(value) && value.length > 0
    );

    if (firstFieldErrors) {
      return firstFieldErrors[0];
    }
  }

  return data?.message || data?.error || `Request failed with status ${status}`;
};

const parseResponse = async (res) => {
  try {
    const text = await res.text();
    let data = null;

    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
    }
    
    if (!res.ok) {
      const message = extractErrorMessage(data, res.status);
      console.error(`API Error: ${res.status}`, { data, message });
      const error = new Error(message);
      error.status = res.status;
      error.responseData = data;
      throw error;
    }
    return data;
  } catch (err) {
    console.error("Response parsing error:", err);
    throw err;
  }
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
    try {
      const endpoint = `${API_BASE}/api/auth/login`;
      const body = JSON.stringify(payload);
      
      console.log("=== LOGIN REQUEST ===");
      console.log("Endpoint:", endpoint);
      console.log("Payload:", payload);
      console.log("Stringified body:", body);
      
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: body
      });
      
      console.log("Response status:", res.status);
      
      // Response body'yi oku
      const responseText = await res.text();
      console.log("Response body:", responseText);
      
      // Manuel parse et
      let responseData = null;
      try {
        responseData = responseText ? JSON.parse(responseText) : null;
      } catch {
        console.error("Failed to parse response:", responseText);
      }
      
      if (!res.ok) {
        const message = responseData?.message || responseData?.error || `Status ${res.status}: ${responseText}`;
        console.error("Login failed:", message);
        throw new Error(message);
      }
      
      return responseData;
    } catch (err) {
      console.error("Login error:", err);
      throw err;
    }
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

  async adminRefundRequests(token, status = "") {
    const query = status ? `?status=${encodeURIComponent(status)}` : "";
    const res = await fetch(`${API_BASE}/api/admin/refund-requests${query}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return parseResponse(res);
  },

  async approveRefundRequest(token, id, payload = {}) {
    const res = await fetch(`${API_BASE}/api/admin/refund-requests/${id}/approve`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    return parseResponse(res);
  },

  async rejectRefundRequest(token, id, payload = {}) {
    const res = await fetch(`${API_BASE}/api/admin/refund-requests/${id}/reject`, {
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
  },

  async createStripeCheckoutSession(token, payload) {
    const res = await fetch(`${API_BASE}/api/payments/create-checkout-session`, {
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
