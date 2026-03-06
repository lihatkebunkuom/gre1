import { apiClient } from "./api-client";

export const analyticsService = {
  getSummary: async () => {
    // Karena api-client.ts sudah memiliki interceptor yang mengembalikan response.data,
    // maka kita langsung mengembalikan hasil panggilannya.
    return apiClient.get("/analytics/summary");
  },
  getFinanceTrend: async () => {
    return apiClient.get("/analytics/finance-trend");
  },
  getDemographics: async () => {
    return apiClient.get("/analytics/demographics");
  },
};
