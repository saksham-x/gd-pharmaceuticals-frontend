import api from "../base/api";

// The "Enquiry type" choices; the API
// accepts exactly these.
export const ENQUIRY_TYPES = [
  "General enquiry",
  "Product enquiry",
  "Distributor enquiry",
  "Investor enquiry",
  "Careers",
  "Pharmacovigilance",
] as const;

export type EnquiryType = (typeof ENQUIRY_TYPES)[number];

export type EnquiryPayload = {
  name: string;
  email: string;
  phone: string;
  type: EnquiryType;
  message: string;
  product?: string;
};

// POST /api/enquiries — returns the
// reference staff will quote, e.g.
// "ENQ-1048".
export async function sendEnquiry(payload: EnquiryPayload) {
  const response = await api.post<{ message: string; reference: string }>("/api/enquiries", payload);

  return response.data;
}
