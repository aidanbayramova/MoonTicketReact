const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5149";

let productsCache = null;
let productsPromise = null;

const pick = (obj, keys) => {
  for (const key of keys) {
    if (obj?.[key] !== undefined && obj[key] !== null) return obj[key];
  }
  return undefined;
};

const normalizeProduct = (raw = {}) => {
  const id = pick(raw, ["id", "Id"]);
  const name = pick(raw, ["name", "Name"]) || "Untitled";
  const description = pick(raw, ["description", "Description"]) || "";
  const image = pick(raw, ["image", "Image"]) || "";
  const video = pick(raw, ["video", "Video"]) || "";
  const address = pick(raw, ["address", "Address"]) || "";
  const ageRestriction = pick(raw, ["ageRestriction", "AgeRestriction"]) ?? null;
  const startDateRaw = pick(raw, ["startDate", "StartDate"]) || null;
  const endDateRaw = pick(raw, ["endDate", "EndDate"]) || null;
  const startTime = pick(raw, ["startTime", "StartTime"]) || null;
  const categoryName = pick(raw, ["categoryName", "CategoryName"]) || "";
  const subCategoryName = pick(raw, ["subCategoryName", "SubCategoryName"]) || "";
  const personName = pick(raw, ["personName", "PersonName"]) || "";
  const languages = pick(raw, ["languages", "Languages"]) || [];

  const parseDate = (value) => {
    if (!value) return null;
    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date;
  };

  return {
    id,
    name,
    description,
    image,
    video,
    address,
    ageRestriction,
    startDate: parseDate(startDateRaw),
    endDate: parseDate(endDateRaw),
    startTime,
    categoryName,
    subCategoryName,
    personName,
    languages,
    raw,
  };
};

export const buildAssetUrl = (path) => (path ? `${API_BASE}${path}` : "");

export async function fetchProducts({ force = false } = {}) {
  if (!force && productsCache) return productsCache;
  if (!force && productsPromise) return productsPromise;

  productsPromise = (async () => {
    try {
      const res = await fetch(`${API_BASE}/api/ProductGetAll`);
      if (!res.ok) throw new Error(`Failed to load products (${res.status})`);
      const data = await res.json();
      const list = Array.isArray(data) ? data : [];
      productsCache = list
        .map(normalizeProduct)
        .filter((p) => p.id !== undefined && p.id !== null);
      return productsCache;
    } catch (error) {
      console.error("fetchProducts error", error);
      productsCache = [];
      return productsCache;
    } finally {
      productsPromise = null;
    }
  })();

  return productsPromise;
}

export async function fetchProductById(id) {
  if (!id) return null;
  try {
    const res = await fetch(`${API_BASE}/api/ProductGetById/${id}`);
    if (!res.ok) throw new Error(`Failed to load product ${id} (${res.status})`);
    const data = await res.json();
    return normalizeProduct(data);
  } catch (error) {
    console.error("fetchProductById error", error);
    return null;
  }
}

export function formatDate(date) {
  if (!date) return "";
  try {
    return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return "";
  }
}

export function formatDateTime(date) {
  if (!date) return "";
  try {
    return date.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

export const apiBase = API_BASE;

const normalize = (str) => (str || "").toString().trim().toLowerCase();

export const filterProductsByCategory = (products, allowed = []) => {
  if (!Array.isArray(products)) return [];
  const allowedSet = new Set(allowed.map(normalize).filter(Boolean));
  if (!allowedSet.size) return products;

  return products.filter((p) => {
    const cat = normalize(p.categoryName);
    const sub = normalize(p.subCategoryName);
    return allowedSet.has(cat) || allowedSet.has(sub);
  });
};
