/**
 * API Response Parser - Handles both camelCase and PascalCase JSON responses
 */
export const parseApiResponse = (data) => {
  if (!data || typeof data !== "object") return data;

  const isArray = Array.isArray(data);
  const items = isArray ? data : [data];

  const parsed = items.map((item) => {
    const result = {};

    for (const [key, value] of Object.entries(item)) {
      // Convert to camelCase for consistency
      const camelKey = key.charAt(0).toLowerCase() + key.slice(1);
      result[camelKey] = value;
    }

    return result;
  });

  return isArray ? parsed : parsed[0];
};

/**
 * Safe property access - checks both camelCase and PascalCase
 */
export const getProperty = (obj, camelCase, pascalCase) => {
  return obj[camelCase] ?? obj[pascalCase] ?? null;
};

/**
 * Format date for display
 */
export const formatDate = (dateString) => {
  if (!dateString) return "-";
  try {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "-";
  }
};

/**
 * Format image/video URLs
 */
export const getMediaUrl = (path, apiBase = "http://localhost:5149") => {
  if (!path) return "";
  return path.startsWith("http") ? path : `${apiBase}${path}`;
};

/**
 * Handle API errors
 */
export const handleApiError = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return "An error occurred. Please try again.";
};
