 
import React, { useEffect, useState } from "react";
import {
  X,
  User,
  Building2,
  Mail,
  Phone,
  Lock,
  MapPin,
  FileText,
  Loader2,
  CheckCircle2,
} from "lucide-react";

import axiosInstance from "../../../api/axiosInstance";

const AddVendorModel = ({ onClose, onVendorAdded }) => {
  const [loading, setLoading] = useState(false);
  const [serviceLoading, setServiceLoading] = useState(true);

  const [serviceTypes, setServiceTypes] = useState([]);
  const [requiredDocuments, setRequiredDocuments] = useState([]);

  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    companyName: "",
    email: "",
    password: "",
    phone: "",
    serviceTypeId: "",

    address: {
      street: "",
      city: "",
      state: "",
      country: "India",
      pincode: "",
    },
  });

  // =====================================================
  // FETCH SERVICE TYPES
  // =====================================================

  useEffect(() => {
    const fetchServiceTypes = async () => {
      try {
        setServiceLoading(true);
        setError("");

        const response = await axiosInstance.get(
          "/api/service-types"
        );

        if (response.data.success) {
          setServiceTypes(
            response.data.serviceTypes || []
          );
        }
      } catch (error) {
        console.error(
          "Error fetching service types:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load service types"
        );
      } finally {
        setServiceLoading(false);
      }
    };

    fetchServiceTypes();
  }, []);

  // =====================================================
  // NORMAL INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // ADDRESS CHANGE
  // =====================================================

  const handleAddressChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,

      address: {
        ...prev.address,
        [name]: value,
      },
    }));
  };

  // =====================================================
  // SERVICE TYPE CHANGE
  // =====================================================

  const handleServiceTypeChange = (e) => {
    const serviceTypeId = e.target.value;

    setFormData((prev) => ({
      ...prev,
      serviceTypeId,
    }));

    setError("");

    // No service selected
    if (!serviceTypeId) {
      setRequiredDocuments([]);
      return;
    }

    // Find selected service type
    const selectedServiceType = serviceTypes.find(
      (serviceType) =>
        serviceType._id === serviceTypeId
    );

    if (!selectedServiceType) {
      setRequiredDocuments([]);
      return;
    }

    // Get required documents
    const documents =
      selectedServiceType.requiredDocuments || [];

    setRequiredDocuments(documents);
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // Required validation
    if (
      !formData.name.trim() ||
      !formData.companyName.trim() ||
      !formData.email.trim() ||
      !formData.password ||
      !formData.serviceTypeId
    ) {
      setError(
        "Name, company name, email, password and service type are required."
      );

      return;
    }

    // Password validation
    if (formData.password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );

      return;
    }

    try {
      setLoading(true);

      const response = await axiosInstance.post(
        "/api/vendor/auth/register",
        formData
      );
  
      if (response.data.success) {
        if (onVendorAdded) {
          onVendorAdded(response.data.vendor);
        }

        onClose();
      }
    } catch (error) {
      console.error(
        "Vendor registration error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to register vendor."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {/* =================================================
          MODAL
      ================================================= */}

      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">

          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Add Vendor
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Create a new vendor account
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 transition"
          >
            <X size={20} />
          </button>

        </div>

        {/* =================================================
            FORM
        ================================================= */}

        <form
          onSubmit={handleSubmit}
          className="p-6"
        >

          {/* ERROR */}
          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* =================================================
              BASIC INFORMATION
          ================================================= */}

          <div className="mb-7">

            <h3 className="flex items-center gap-2 text-base font-semibold text-gray-900 mb-4">
              <Building2 size={18} />
              Vendor Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Vendor Name */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Contact Person Name{" "}
                  <span className="text-red-500">*</span>
                </label>

                <div className="relative">

                  <User
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                </div>
              </div>

              {/* Company Name */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Company Name{" "}
                  <span className="text-red-500">*</span>
                </label>

                <div className="relative">

                  <Building2
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="ABC Technologies Pvt Ltd"
                    className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                </div>
              </div>

              {/* Email */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email{" "}
                  <span className="text-red-500">*</span>
                </label>

                <div className="relative">

                  <Mail
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="vendor@company.com"
                    className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                </div>
              </div>

              {/* Phone */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Phone
                </label>

                <div className="relative">

                  <Phone
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 9876543210"
                    className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                </div>
              </div>

              {/* Password */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Initial Password{" "}
                  <span className="text-red-500">*</span>
                </label>

                <div className="relative">

                  <Lock
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Minimum 6 characters"
                    className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                </div>
              </div>

              {/* Service Type */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Service Type{" "}
                  <span className="text-red-500">*</span>
                </label>

                <select
                  name="serviceTypeId"
                  value={formData.serviceTypeId}
                  onChange={handleServiceTypeChange}
                  disabled={serviceLoading}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
                >
                  <option value="">
                    {serviceLoading
                      ? "Loading service types..."
                      : "Select service type"}
                  </option>

                  {serviceTypes.map(
                    (serviceType) => (
                      <option
                        key={serviceType._id}
                        value={serviceType._id}
                      >
                        {serviceType.name}
                      </option>
                    )
                  )}
                </select>
              </div>

            </div>

          </div>

          {/* =================================================
              REQUIRED DOCUMENTS
          ================================================= */}

          {formData.serviceTypeId && (
            <div className="mb-7">

              <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-5">

                {/* Header */}

                <div className="flex items-start justify-between mb-4">

                  <div className="flex items-start gap-3">

                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText
                        size={20}
                        className="text-blue-600"
                      />
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Required Documents
                      </h3>

                      <p className="text-sm text-gray-500 mt-1">
                        Documents required from this vendor
                        based on the selected service type.
                      </p>
                    </div>

                  </div>

                  <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full">
                    {requiredDocuments.length}{" "}
                    {requiredDocuments.length === 1
                      ? "Document"
                      : "Documents"}
                  </span>

                </div>

                {/* Documents */}

                {requiredDocuments.length > 0 ? (

                  <div className="space-y-2">

                    {requiredDocuments.map(
                      (document, index) => {

                        /*
                          Your ServiceType stores:

                          requiredDocuments: [
                            {
                              documentTypeId: ObjectId,
                              isRequired: Boolean
                            }
                          ]

                          Because your controller populates
                          documentTypeId, it becomes:

                          document.documentTypeId = {
                            _id,
                            name,
                            description,
                            isActive
                          }
                        */

                        const documentType =
                          document.documentTypeId;

                        if (!documentType) {
                          return null;
                        }

                        return (
                          <div
                            key={
                              documentType._id ||
                              index
                            }
                            className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-3"
                          >

                            <div className="flex items-center gap-3">

                              <div className="p-2 bg-gray-100 rounded-lg">
                                <FileText
                                  size={18}
                                  className="text-gray-600"
                                />
                              </div>

                              <div>

                                <p className="text-sm font-medium text-gray-900">
                                  {documentType.name}
                                </p>

                                {documentType.description && (
                                  <p className="text-xs text-gray-500 mt-0.5">
                                    {
                                      documentType.description
                                    }
                                  </p>
                                )}

                              </div>

                            </div>

                            {/* Required badge */}

                            {document.isRequired !==
                              false && (
                              <div className="flex items-center gap-1.5 text-xs font-medium text-red-600">

                                <CheckCircle2
                                  size={15}
                                />

                                Required

                              </div>
                            )}

                          </div>
                        );
                      }
                    )}

                  </div>

                ) : (

                  <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">

                    <FileText
                      size={28}
                      className="mx-auto text-gray-400 mb-2"
                    />

                    <p className="text-sm font-medium text-gray-700">
                      No documents configured
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      This service type currently has no
                      required documents.
                    </p>

                  </div>

                )}

              </div>

            </div>
          )}

          {/* =================================================
              ADDRESS
          ================================================= */}

          <div className="mb-7">

            <h3 className="flex items-center gap-2 text-base font-semibold text-gray-900 mb-4">
              <MapPin size={18} />
              Address
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Street */}

              <div className="md:col-span-2">

                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Street Address
                </label>

                <input
                  type="text"
                  name="street"
                  value={formData.address.street}
                  onChange={handleAddressChange}
                  placeholder="123 Business Street"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

              </div>

              {/* City */}

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  City
                </label>

                <input
                  type="text"
                  name="city"
                  value={formData.address.city}
                  onChange={handleAddressChange}
                  placeholder="Lucknow"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

              </div>

              {/* State */}

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  State
                </label>

                <input
                  type="text"
                  name="state"
                  value={formData.address.state}
                  onChange={handleAddressChange}
                  placeholder="Uttar Pradesh"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

              </div>

              {/* Country */}

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Country
                </label>

                <input
                  type="text"
                  name="country"
                  value={formData.address.country}
                  onChange={handleAddressChange}
                  placeholder="India"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

              </div>

              {/* Pincode */}

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Pincode
                </label>

                <input
                  type="text"
                  name="pincode"
                  value={formData.address.pincode}
                  onChange={handleAddressChange}
                  placeholder="226001"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

              </div>

            </div>

          </div>

          {/* =================================================
              FOOTER
          ================================================= */}

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition disabled:opacity-60"
            >

              {loading && (
                <Loader2
                  size={17}
                  className="animate-spin"
                />
              )}

              {loading
                ? "Creating..."
                : "Create Vendor"}

            </button>

          </div>

        </form>

      </div>
    </div>
  );
};

export default AddVendorModel;

