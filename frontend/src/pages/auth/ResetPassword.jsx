import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Lock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import axiosInstance from "../../api/axiosInstance";

const ResetPassword = () => {
  const navigate = useNavigate();

  const [searchParams] =
    useSearchParams();

  const token =
    searchParams.get("token");

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [success, setSuccess] =
    useState("");

  const [error, setError] =
    useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!token) {
      setError(
        "Invalid or missing password reset link."
      );
      return;
    }

    if (!password || !confirmPassword) {
      setError(
        "Please fill in both password fields."
      );
      return;
    }

    if (password.length < 8) {
      setError(
        "Password must be at least 8 characters long."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError(
        "Passwords do not match."
      );
      return;
    }

    try {
      setLoading(true);

      const response =
        await axiosInstance.post(
          "/api/auth/reset-password",
          {
            token,
            password,
            confirmPassword,
          }
        );

      if (response.data.success) {
        setSuccess(
          "Password reset successfully. Redirecting to login..."
        );

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to reset password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="
      min-h-screen
      bg-[#F4EFF3]
      flex
      items-center
      justify-center
      px-4
    ">

      <div className="w-full max-w-md">

        <div className="
          rounded-2xl
          bg-white
          p-8
          shadow-lg
          border
          border-[#DCD3E0]
        ">

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
              <Lock size={25} />
            </div>

            <h1 className="
              text-2xl
              font-bold
              text-[#3A3550]
            ">
              Reset Password
            </h1>

            <p className="
              mt-2
              text-sm
              text-[#8A82A6]
            ">
              Create a new password for your
              VendorVault account.
            </p>

          </div>

          {/* SUCCESS */}
          {success && (
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

              <span>{success}</span>
            </div>
          )}

          {/* ERROR */}
          {error && (
            <div className="
              mb-5
              flex
              gap-3
              rounded-lg
              border
              border-red-200
              bg-red-50
              p-3
              text-sm
              text-red-600
            ">
              <AlertCircle
                size={18}
                className="shrink-0"
              />

              <span>{error}</span>
            </div>
          )}

          {!success && (
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* PASSWORD */}
              <div>

                <label className="
                  mb-2
                  block
                  text-sm
                  font-medium
                  text-[#585272]
                ">
                  New Password
                </label>

                <div className="relative">

                  <Lock
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
                    type="password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="Enter new password"
                    className="
                      w-full
                      rounded-lg
                      border
                      border-[#DCD3E0]
                      py-3
                      pl-10
                      pr-4
                      text-sm
                      text-[#3A3550]
                      outline-none
                      focus:border-[#585272]
                      focus:ring-2
                      focus:ring-[#585272]/10
                    "
                  />

                </div>

                <p className="
                  mt-1.5
                  text-xs
                  text-[#B7AFC9]
                ">
                  Minimum 8 characters
                </p>

              </div>

              {/* CONFIRM PASSWORD */}
              <div>

                <label className="
                  mb-2
                  block
                  text-sm
                  font-medium
                  text-[#585272]
                ">
                  Confirm Password
                </label>

                <div className="relative">

                  <Lock
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
                    type="password"
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(
                        e.target.value
                      )
                    }
                    placeholder="Confirm new password"
                    className="
                      w-full
                      rounded-lg
                      border
                      border-[#DCD3E0]
                      py-3
                      pl-10
                      pr-4
                      text-sm
                      text-[#3A3550]
                      outline-none
                      focus:border-[#585272]
                      focus:ring-2
                      focus:ring-[#585272]/10
                    "
                  />

                </div>

              </div>

              {/* SUBMIT */}
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
                  ? "Resetting..."
                  : "Reset Password"}
              </button>

            </form>
          )}

          {/* LOGIN */}
          <div className="mt-6 text-center">

            <Link
              to="/login"
              className="
                text-sm
                font-medium
                text-[#585272]
                hover:text-[#3A3550]
              "
            >
              Back to Login
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
};

export default ResetPassword;