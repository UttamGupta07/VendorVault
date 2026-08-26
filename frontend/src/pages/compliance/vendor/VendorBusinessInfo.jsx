import React from "react";
import { FileText } from "lucide-react";

const VendorBusinessInfo = ({
  formData,
  handleChange,
}) => {
  return (
    <section>

      <div className="mb-4 flex items-center gap-2">

        <FileText
          size={18}
          className="text-indigo-600"
        />

        <div>
          <h3 className="text-sm font-semibold text-slate-800">
            Business Information
          </h3>

          <p className="text-xs text-slate-400">
            GST and PAN details
          </p>
        </div>

      </div>

      <div className="grid gap-4 sm:grid-cols-2">

        {/* GSTIN */}
        <div>

          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            GSTIN
          </label>

          <input
            type="text"
            name="gstin"
            value={formData.gstin}
            onChange={handleChange}
            placeholder="Enter GSTIN"
            className="
              w-full
              rounded-xl
              border
              border-slate-200
              px-4
              py-2.5
              text-sm
              uppercase
              outline-none
              focus:border-indigo-500
            "
          />

        </div>

        {/* PAN */}
        <div>

          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            PAN
          </label>

          <input
            type="text"
            name="pan"
            value={formData.pan}
            onChange={handleChange}
            placeholder="Enter PAN"
            className="
              w-full
              rounded-xl
              border
              border-slate-200
              px-4
              py-2.5
              text-sm
              uppercase
              outline-none
              focus:border-indigo-500
            "
          />

        </div>

      </div>

    </section>
  );
};

export default VendorBusinessInfo;