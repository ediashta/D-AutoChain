import axiosInstance from "../api/axiosInstance";

const FinancingService = () => {
  const getLimit = async () => {
    const { data } = await axiosInstance.get("/api/financing/limit");
    return data;
  };

  const requestFinancingReceivable = async (request) => {
    const { data } = await axiosInstance.post(
      "/api/financing/receivable",
      request
    );
    return data;
  };

  const fetchPaymentOngoing = async (queryParams) => {
    const { data } = await axiosInstance.get(`/api/payments/ongoing`, {
      params: queryParams,
    });
    return data;
  };

  const fetchPaymentHistory = async (queryParams) => {
    const { data } = await axiosInstance.get(`/api/payments/history`, {
      params: queryParams,
    });
    return data;
  };

  const fetchPartnership = async (id, queryParams) => {
    const { data } = await axiosInstance.get(`/api/partnerships/${id}`, {
      params: queryParams,
    });
    return data;
  };

  const getReceivableById = async (id) => {
    const { data } = await axiosInstance.get(`/api/financing/receivable/${id}`);
    return data;
  };

  const updateStatusInvoice = async (payload) => {
    const { data } = await axiosInstance.put("/api/invoice/update", payload);
    return data;
  };

  return {
    fetchPaymentOngoing,
    fetchPaymentHistory,
    requestFinancingReceivable,
    fetchPartnership,
    getReceivableById,
    updateStatusInvoice,
    getLimit,
  };
};

export default FinancingService;
