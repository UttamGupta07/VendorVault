import React, { useState } from "react";
import { X, Building2 } from "lucide-react";
import VendorBusinessInfo from "./VendorBasicInfo";
import VendorContactInfo from "./VendorContactInfo";
import VendorBasicInfo from "./VendorBasicInfo";

const AddVendorModel = ({ onClose }) => {

  const [formData, setFormData] = useState({
    name: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    gstin: "",
    pan: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      console.log("Vendor payload:", formData);

      // Axios API will be connected here.

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">

      <div
        className="
          max-h-[90vh]
          w-full
          max-w-2xl
          overflow-y-auto
          rounded-2xl
          bg-white
          shadow-2xl
        "
      >

        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
              <Building2
                size={20}
                className="text-indigo-600"
              />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">
                Add New Vendor
              </h2>

              <p className="text-xs text-slate-400">
                Register a vendor in your organization
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
          >
            <X size={20} />
          </button>

        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 p-6"
        >

          <VendorBasicInfo
            formData={formData}
            handleChange={handleChange}
          />

          <VendorContactInfo
            formData={formData}
            handleChange={handleChange}
          />

          <VendorBusinessInfo
            formData={formData}
            handleChange={handleChange}
          />

          {/* Footer */}
          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">

            <button
              type="button"
              onClick={onClose}
              className="
                rounded-xl
                border
                border-slate-200
                px-4
                py-2.5
                text-sm
                font-medium
                text-slate-600
                hover:bg-slate-50
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="
                rounded-xl
                bg-indigo-600
                px-5
                py-2.5
                text-sm
                font-semibold
                text-white
                hover:bg-indigo-700
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {loading ? "Creating..." : "Create Vendor"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default AddVendorModel;