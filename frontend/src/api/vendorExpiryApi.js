import axiosInstance from "./axiosInstance";

export const getVendorExpiryDocuments = async () => {
  const response = await axiosInstance.get(
    "/api/documents/vendor/expiry"
  );

  return response.data;
};