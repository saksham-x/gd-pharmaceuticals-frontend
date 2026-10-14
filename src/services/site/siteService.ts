import api from "../base/api";

import type { SiteContent } from "../../data/defaultContent";

// GET /api/site-settings — every page's
// copy, merged over the launch defaults
// by the API.
export async function getSiteContent(): Promise<SiteContent> {
  const response = await api.get<SiteContent>("/api/site-settings");

  return response.data;
}
