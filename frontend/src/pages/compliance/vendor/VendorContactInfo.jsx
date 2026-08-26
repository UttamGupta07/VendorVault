import React from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const VendorContactInfo = ({
  formData,
  handleChange,
}) => {
  return (
    <section>

      <div className="mb-4 flex items-center gap-2">

        <User
          size={18}
          className="text-indigo-600"
        />

        <div>
          <h3 className="text-sm font-semibold text-slate-800">
            Contact Information
          </h3>

          <p className="text-xs text-slate-400">
            Primary vendor contact details
          </p>
        </div>

      </div>

      <div className="grid gap-4 sm:grid-cols-2">

        {/* Contact Person */}
        <div>

          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Contact Person
          </label>

          <input
            type="text"
            name="contactPerson"
            value={formData.contactPerson}
            onChange={handleChange}
            required
            placeholder="Full name"
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

        {/* Email */}
        <div>

          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Email
          </label>

          <div className="relative">

            <Mail
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="vendor@example.com"
              className="
                w-full
                rounded-xl
                border
                border-slate-200
                py-2.5
                pl-9
                pr-4
                text-sm
                outline-none
                focus:border-indigo-500
              "
            />

          </div>

        </div>

        {/* Phone */}
        <div>

          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Phone
          </label>

          <div className="relative">

            <Phone
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="+91 XXXXX XXXXX"
              className="
                w-full
                rounded-xl
                border
                border-slate-200
                py-2.5
                pl-9
                pr-4
                text-sm
                outline-none
                focus:border-indigo-500
              "
            />

          </div>

        </div>

        {/* Address */}
        <div>

          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Address
          </label>

          <div className="relative">

            <MapPin
              size={16}
              className="absolute left-3 top-3 text-slate-400"
            />

            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              rows={3}
              placeholder="Business address"
              className="
                w-full
                resize-none
                rounded-xl
                border
                border-slate-200
                py-2.5
                pl-9
                pr-4
                text-sm
                outline-none
                focus:border-indigo-500
              "
            />

          </div>

        </div>

      </div>

    </section>
  );
};

export default VendorContactInfo;