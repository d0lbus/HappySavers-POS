import api from "./client";

export const getCategories = () => {
  return api.get("/categories");
};

export const createCategory = (payload) => {
  return api.post("/categories", payload);
};

export const updateCategory = (id, payload) => {
  return api.put(`/categories/${id}`, payload);
};
