import React from "react";
import { Building2 } from "lucide-react";

const VendorBasicInfo = ({
  formData,
  handleChange,
}) => {
  return (
    <section>

      <div className="mb-4 flex items-center gap-2">

        <Building2
          size={18}
          className="text-indigo-600"
        />

        <div>
          <h3 className="text-sm font-semibold text-slate-800">
            Vendor Information
          </h3>

          <p className="text-xs text-slate-400">
            Basic business information
          </p>
        </div>

      </div>

      <div className="grid gap-4 sm:grid-cols-2">

        {/* Vendor Name */}
        <div className="sm:col-span-2">

          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Vendor Name
          </label>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter vendor/company name"
            className="
              w-full
              rounded-xl
              border
              border-slate-200
              px-4
              py-2.5
              text-sm
              outline-none
              focus:border-indigo-500
            "
          />

        </div>

      </div>

    </section>
  );
};

export default VendorBasicInfo;