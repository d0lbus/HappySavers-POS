import api from "./client";

export function getInventory() {
  return api.get("/inventory");
}

export function getInventoryMovements() {
  return api.get("/inventory/movements");
}

export function getLowStock() {
  return api.get("/inventory/low-stock");
}

export function adjustInventory(payload) {
  return api.post("/inventory/adjust", payload);
}
