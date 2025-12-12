import api from "./client";

export const uploadProductImage = (file) => {
  const formData = new FormData();
  formData.append("image", file);

  return api.post("/uploads/products", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
