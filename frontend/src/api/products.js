import api from "./client"; // adjust if your axios file is named differently

export const getProducts = (params = {}) => {
  return api.get("/products", { params });
};

export const getProductById = (id) => {
  return api.get(`/products/${id}`);
};

export const createProduct = (payload) => {
  return api.post("/products", payload);
};

export const updateProduct = (id, payload) => {
  return api.put(`/products/${id}`, payload);
};

export const toggleProductStatus = (id) => {
  return api.patch(`/products/${id}/status`);
};

export const archiveProduct = (id) => {
  return api.delete(`/products/${id}`);
};

export const restoreProduct = (id) => {
  return api.patch(`/products/${id}/restore`);
};
