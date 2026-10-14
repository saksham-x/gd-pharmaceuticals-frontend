// ========================================
// APP CONFIG
//
// Addresses come from .env (VITE_*), so
// the same build points at local or
// deployed servers.
// ========================================

export const appConfig = {
  apiUrl: import.meta.env.VITE_API_URL || "http://localhost:5000",
  siteName: "G.D. Pharmaceuticals",
};
