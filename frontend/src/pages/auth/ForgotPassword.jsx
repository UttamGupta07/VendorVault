import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  CheckCircle2,
} from "lucide-react";

import axiosInstance from "../../api/axiosInstance";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   setError("");
  //   setMessage("");

  //   if (!email.trim()) {
  //     setError("Please enter your email address.");
  //     return;
  //   }

  //   try {
  //     setLoading(true);

  //     const response =
  //       await axiosInstance.post(
  //         "/api/auth/forgot-password",
  //         {
  //           email: email.trim(),
  //         }
  //       );

  //     if (response.data.success) {
  //       setMessage(response.data.message);
  //     }
  //   } catch (error) {
  //     setError(
  //       error.response?.data?.message ||
  //         "Something went wrong. Please try again."
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (e) => {
  e.preventDefault();

  console.log("1️⃣ Forgot password form submitted");
  console.log("📧 Email:", email);

  setError("");
  setMessage("");

  if (!email.trim()) {
    setError("Please enter your email address.");
    return;
  }

  try {
    setLoading(true);

    console.log("2️⃣ Sending API request...");

    const response = await axiosInstance.post(
      "/api/auth/forgot-password",
      {
        email: email.trim(),
      }
    );

    console.log(
      "3️⃣ API response:",
      response.data
    );

    if (response.data.success) {
      setMessage(response.data.message);
    }

  } catch (error) {
    console.error(
      "❌ Forgot password API error:",
      error
    );

    console.error(
      "❌ Server response:",
      error.response?.data
    );

    setError(
      error.response?.data?.message ||
        "Something went wrong. Please try again."
    );

  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-[#F4EFF3] flex items-center justify-center px-4">

      <div className="w-full max-w-md">

        <div className="rounded-2xl bg-white p-8 shadow-lg border border-[#DCD3E0]">

          {/* HEADER */}
          <div className="mb-8 text-center">

            <div className="
              mx-auto
              mb-4
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
              bg-[#585272]
              text-white
            ">
              <Mail size={25} />
            </div>

            <h1 className="
              text-2xl
              font-bold
              text-[#3A3550]
            ">
              Forgot Password?
            </h1>

            <p className="
              mt-2
              text-sm
              text-[#8A82A6]
            ">
              Enter your email and we'll send you
              a password reset link.
            </p>

          </div>

          {/* SUCCESS */}
          {message && (
            <div className="
              mb-5
              flex
              gap-3
              rounded-lg
              border
              border-green-200
              bg-green-50
              p-3
              text-sm
              text-green-700
            ">
              <CheckCircle2
                size={18}
                className="shrink-0"
              />

              <span>{message}</span>
            </div>
          )}

          {/* ERROR */}
          {error && (
            <div className="
              mb-5
              rounded-lg
              border
              border-red-200
              bg-red-50
              p-3
              text-sm
              text-red-600
            ">
              {error}
            </div>
          )}

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            <div>

              <label className="
                mb-2
                block
                text-sm
                font-medium
                text-[#585272]
              ">
                Email Address
              </label>

              <div className="relative">

                <Mail
                  size={18}
                  className="
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    text-[#B7AFC9]
                  "
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="Enter your email"
                  className="
                    w-full
                    rounded-lg
                    border
                    border-[#DCD3E0]
                    bg-white
                    py-3
                    pl-10
                    pr-4
                    text-sm
                    text-[#3A3550]
                    outline-none
                    transition
                    focus:border-[#585272]
                    focus:ring-2
                    focus:ring-[#585272]/10
                  "
                />

              </div>

            </div>

            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                rounded-lg
                bg-[#585272]
                px-4
                py-3
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-[#3A3550]
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {loading
                ? "Sending..."
                : "Send Reset Link"}
            </button>

          </form>

          {/* BACK */}
          <div className="mt-6 text-center">

            <Link
              to="/login"
              className="
                inline-flex
                items-center
                gap-2
                text-sm
                font-medium
                text-[#585272]
                hover:text-[#3A3550]
              "
            >
              <ArrowLeft size={16} />
              Back to Login
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
};

export default ForgotPassword;