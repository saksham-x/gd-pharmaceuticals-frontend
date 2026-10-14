import api from "../base/api";

export type LegalPage = {
  _id: string;
  slug: string;
  title: string;
  // Plain text; a blank line starts a
  // new paragraph.
  content: string;
  updatedAt: string;
};

export async function getLegalPage(slug: string) {
  const response = await api.get<LegalPage>(`/api/legal-pages/${encodeURIComponent(slug)}`);

  return response.data;
}
