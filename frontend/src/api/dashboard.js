import api from "./auth";

/** Get dashboard statistics */
export const getDashboardStats = async () => {
  const response = await api.get("/analysis/dashboard/stats");
  return response.data;
};

/** Get sentiment trends */
export const getSentimentTrends = async () => {
  const response = await api.get("/analysis/dashboard/sentiment-trends");
  return response.data;
};

/** Get risk distribution */
export const getRiskDistribution = async () => {
  const response = await api.get("/analysis/dashboard/risk-distribution");
  return response.data;
};

/** Get topics frequency */
export const getTopicsFrequency = async () => {
  const response = await api.get("/analysis/dashboard/topics-frequency");
  return response.data;
};