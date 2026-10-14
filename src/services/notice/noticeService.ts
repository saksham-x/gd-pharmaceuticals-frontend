import api from "../base/api";

// ========================================
// NOTICE
//
// Company notices and investor documents.
// The same record can show on the home
// page, News & Events and Investors.
// ========================================

export type NoticeCategory = "notice" | "financial-report" | "ipo-update" | "governance";

export type Notice = {
  _id: string;
  title: string;
  summary: string;
  type: string;
  date: string;
  category: NoticeCategory;
  subject: string;
  outcome: string;
  documentUrl: string;
  showOnNews: boolean;
  newsTitle: string;
  newsSummary: string;
  image: string;
  showOnHome: boolean;
};

export async function getNotices(params: { news?: boolean; home?: boolean } = {}) {
  const response = await api.get<Notice[]>("/api/notices", {
    params: {
      ...(params.news && { news: "true" }),
      ...(params.home && { home: "true" }),
    },
  });

  return response.data;
}
