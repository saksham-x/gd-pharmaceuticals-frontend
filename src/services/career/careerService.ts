import api from "../base/api";

export type Career = {
  _id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  summary: string;
  responsibilities: string[];
  // Optional yellow pill, e.g. "Demo entry".
  badge: string;
};

// Active openings only.
export async function getCareers() {
  const response = await api.get<Career[]>("/api/careers");

  return response.data;
}
