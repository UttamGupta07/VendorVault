 import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import axiosInstance from "../api/axiosInstance";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // GET CURRENT USER
  // ==========================================

  const getCurrentUser = async () => {
    try {
      setLoading(true);

      const response = await axiosInstance.get(
        "/api/auth/me"
      );

      if (response.data.success) {
        setUser(response.data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOGIN
  // ==========================================

  const login = async (email, password) => {
    try {
      const response = await axiosInstance.post(
        "/api/auth/login",
        {
          email,
          password,
        }
      );

      if (response.data.success) {
        setUser(response.data.user);
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // ==========================================
  // REGISTER ORGANIZATION
  // ==========================================

  const registerOrganization = async (
    organizationData
  ) => {
    try {
      const response = await axiosInstance.post(
        "/api/auth/register-organization",
        organizationData
      );

      if (response.data.success) {
        /*
         * Backend has already:
         *
         * 1. Created organization
         * 2. Created SUPER_ADMIN
         * 3. Generated JWT
         * 4. Stored JWT in HTTP-only cookie
         *
         * We only need to update React state.
         */

        setUser(response.data.user);
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const logout = async () => {
    try {
      await axiosInstance.post("/api/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
    }
  };

  // ==========================================
  // CHECK AUTH ON APP LOAD
  // ==========================================

  useEffect(() => {
    getCurrentUser();
  }, []);

  // ==========================================
  // PROVIDER
  // ==========================================

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,

        login,
        logout,
        registerOrganization,

        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ==========================================
// useAuth
// ==========================================

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};

export default AuthContext;