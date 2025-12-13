import api from "./client";

/**
 * Supports 2 backend response shapes:
 * A) Paginated: { data: [...], meta: {...} }
 * B) Plain list: [...]
 */
export async function getPromotions(params = {}) {
  const res = await api.get("/promotions", { params });

  const payload = res.data;

  // Shape A
  if (payload && Array.isArray(payload.data) && payload.meta) {
    return payload;
  }

  // Shape B (no pagination from backend yet)
  if (Array.isArray(payload)) {
    return {
      data: payload,
      meta: {
        page: 1,
        totalPages: 1,
        total: payload.length,
        limit: payload.length,
      },
    };
  }

  // fallback
  return { data: [], meta: { page: 1, totalPages: 1, total: 0, limit: 20 } };
}

export function createPromotion(body) {
  return api.post("/promotions", body);
}

export function updatePromotion(id, body) {
  return api.put(`/promotions/${id}`, body);
}

export function deletePromotion(id) {
  return api.delete(`/promotions/${id}`);
}

// optional (Phase B targets)
export function setPromotionProducts(id, productIds = []) {
  return api.post(`/promotions/${id}/products`, { productIds });
}

export function setPromotionCategories(id, categoryIds = []) {
  return api.post(`/promotions/${id}/categories`, { categoryIds });
}
