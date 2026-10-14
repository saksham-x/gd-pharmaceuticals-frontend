import api from "../base/api";

// ========================================
// PRODUCT
// ========================================

export type Product = {
  _id: string;
  name: string;
  slug: string;
  genericName: string;
  // Catalogue filter group, e.g. "Tablets".
  form: string;
  dosageForm: string;
  // e.g. "Syrup · 100 ml".
  subtitle: string;
  packSize: string;
  composition: string;
  registration: string;
  medicineInfo: string;
  color: "blue" | "green";
  featured: boolean;
};

// Published products, catalogue order.
export async function getProducts(options: { featured?: boolean } = {}) {
  const response = await api.get<Product[]>("/api/products", {
    params: options.featured ? { featured: "true" } : undefined,
  });

  return response.data;
}

export async function getProduct(slug: string) {
  const response = await api.get<Product>(`/api/products/${encodeURIComponent(slug)}`);

  return response.data;
}
