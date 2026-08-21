import { useState } from "react";
import { useNavigate } from "react-router-dom";
const API_URL = "http://localhost:3000/api/auth";

const RegisterOrganization = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    organizationName: "",
    officialEmail: "",
    phone: "",
    industry: "",
    companySize: "",
    country: "India",
    state: "",
    city: "",
    website: "",
    adminName: "",
    adminEmail: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage({
      type: "",
      text: "",
    });

    try {
      const response = await fetch(
        `${API_URL}/register-organization`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Registration failed"
        );
      }

      setMessage({
        type: "success",
        text: "Organization registered successfully.",
      });

      // Reset form
      setFormData({
        organizationName: "",
        officialEmail: "",
        phone: "",
        industry: "",
        companySize: "",
        country: "India",
        state: "",
        city: "",
        website: "",

        adminName: "",
        adminEmail: "",
        password: "",
      });
      navigate("/admin-dashboard");
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EDEAE0] text-[#1C2B3A]">
      <main className="mx-auto max-w-7xl px-6 py-10 lg:px-10 lg:py-16">

        <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">

          <section className="flex flex-col justify-center">

            <div className="mb-6 inline-flex w-fit items-center gap-2 border border-[#C9C2AE] bg-[#F5F3EB] px-3 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#8B631F]">
              <span className="h-2 w-2 rounded-full bg-[#33604F]" />
              Organization Registration
            </div>

            <h2 className="max-w-xl text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
              Bring your vendor compliance
              <span className="text-[#A8792C]">
                {" "}under control.
              </span>
            </h2>

            <p className="mt-6 max-w-lg text-base leading-7 text-[#54636F]">
              Register your organization and create your primary
              administrator account. Once registered, you can invite
              compliance officers and auditors to your workspace.
            </p>

            <div className="mt-10 space-y-5">

              <Feature
                number="01"
                title="Centralized Documents"
                description="Keep vendor compliance documents organized in one place."
              />

              <Feature
                number="02"
                title="Expiry Monitoring"
                description="Track documents that are expiring or already expired."
              />

              <Feature
                number="03"
                title="Role-Based Access"
                description="Give compliance officers and auditors the right level of access."
              />

            </div>

          </section>

          <section className="border border-[#C9C2AE] bg-[#F5F3EB] shadow-[8px_8px_0px_#C9C2AE]">

            <div className="border-b border-[#C9C2AE] px-6 py-5 sm:px-8">

              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#A8792C]">
                Get started
              </p>

              <h3 className="mt-1 text-2xl font-bold">
                Register your organization
              </h3>

              <p className="mt-1 text-sm text-[#54636F]">
                Your primary admin account will be created automatically.
              </p>

            </div>

            <form
              onSubmit={handleSubmit}
              className="px-6 py-7 sm:px-8"
            >

              <FormSection title="Organization details">

                <div className="grid gap-5 sm:grid-cols-2">

                  <Input
                    label="Organization name"
                    name="organizationName"
                    value={formData.organizationName}
                    onChange={handleChange}
                    placeholder="ABC Manufacturing Pvt. Ltd."
                    required
                  />

                  <Input
                    label="Official email"
                    type="email"
                    name="officialEmail"
                    value={formData.officialEmail}
                    onChange={handleChange}
                    placeholder="admin@company.com"
                    required
                  />

                  <Input
                    label="Phone number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    required
                  />

                  <Input
                    label="Industry"
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    placeholder="Manufacturing"
                    required
                  />

                  <Select
                    label="Company size"
                    name="companySize"
                    value={formData.companySize}
                    onChange={handleChange}
                    required
                    options={[
                      "1-10",
                      "11-50",
                      "51-200",
                      "201-500",
                      "501-1000",
                      "1000+",
                    ]}
                  />

                  <Input
                    label="Country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="India"
                    required
                  />

                  <Input
                    label="State"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Uttar Pradesh"
                    required
                  />

                  <Input
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Lucknow"
                    required
                  />

                  <div className="sm:col-span-2">
                    <Input
                      label="Website"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      placeholder="https://company.com"
                    />
                  </div>

                </div>

              </FormSection>

              <FormSection title="Primary administrator">

                <div className="mb-5 border-l-2 border-[#A8792C] bg-[#EDEAE0] px-4 py-3">

                  <p className="text-sm font-medium">
                    You are registering as the organization's
                    primary administrator.
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#54636F]">
                    You will manage users, compliance officers,
                    auditors and organization settings.
                  </p>

                </div>

                <div className="grid gap-5 sm:grid-cols-2">

                  <Input
                    label="Admin name"
                    name="adminName"
                    value={formData.adminName}
                    onChange={handleChange}
                    placeholder="Rahul Sharma"
                    required
                  />

                  <Input
                    label="Admin email"
                    type="email"
                    name="adminEmail"
                    value={formData.adminEmail}
                    onChange={handleChange}
                    placeholder="rahul@company.com"
                    required
                  />

                  <div className="sm:col-span-2">
                    <Input
                      label="Password"
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a strong password"
                      required
                    />
                  </div>

                </div>

              </FormSection>

        
              {message.text && (
                <div
                  className={`mb-5 border px-4 py-3 text-sm ${
                    message.type === "success"
                      ? "border-[#33604F] bg-[#EDEAE0] text-[#33604F]"
                      : "border-[#A6402B] bg-[#EDEAE0] text-[#A6402B]"
                  }`}
                >
                  {message.text}
                </div>
              )}

              <div className="mb-6 flex items-start gap-3">

                <input
                  type="checkbox"
                  required
                  className="mt-1 h-4 w-4 accent-[#A8792C]"
                />

                <p className="text-xs leading-5 text-[#54636F]">
                  I agree to the VendorVault terms of service
                  and privacy policy.
                </p>

              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1C2B3A] px-5 py-3.5 text-sm font-semibold text-[#F5F3EB] transition hover:bg-[#8B631F] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Creating organization..."
                  : "Register organization"}
              </button>

              <p className="mt-4 text-center text-xs text-[#54636F]">
                Your organization and primary admin account
                will be created together.
              </p>

            </form>

          </section>

        </div>

      </main>
    </div>
  );
};



const Input = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  required = false,
}) => {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#54636F]">
        {label}
        {required && (
          <span className="ml-1 text-[#A6402B]">*</span>
        )}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full border border-[#C9C2AE] bg-[#EDEAE0] px-4 py-3 text-sm text-[#1C2B3A] outline-none placeholder:text-[#54636F]/60 focus:border-[#A8792C] focus:ring-1 focus:ring-[#A8792C]"
      />
    </div>
  );
};


const Select = ({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
}) => {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#54636F]">
        {label}
        {required && (
          <span className="ml-1 text-[#A6402B]">*</span>
        )}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full border border-[#C9C2AE] bg-[#EDEAE0] px-4 py-3 text-sm text-[#1C2B3A] outline-none focus:border-[#A8792C] focus:ring-1 focus:ring-[#A8792C]"
      >
        <option value="">
          Select company size
        </option>

        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option} employees
          </option>
        ))}
      </select>
    </div>
  );
};


const FormSection = ({
  title,
  children,
}) => {
  return (
    <div className="mb-8">

      <h4 className="mb-5 flex items-center gap-3 text-sm font-bold uppercase tracking-[0.12em]">

        <span className="h-px w-5 bg-[#A8792C]" />

        {title}

      </h4>

      {children}

    </div>
  );
};



const Feature = ({
  number,
  title,
  description,
}) => {
  return (
    <div className="flex gap-4">

      <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#C9C2AE] bg-[#F5F3EB] text-xs font-bold text-[#A8792C]">
        {number}
      </div>

      <div>
        <h4 className="text-sm font-bold">
          {title}
        </h4>

        <p className="mt-1 max-w-md text-sm leading-6 text-[#54636F]">
          {description}
        </p>
      </div>

    </div>
  );
};

export default RegisterOrganization;