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
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // GET CURRENT USER
  // ==========================================

  const getCurrentUser = async () => {
    try {
      const response = await axiosInstance.get(
        "/api/auth/me"
      );

      if (response.data.success) {
        setUser(response.data.user);
        setOrganization(
          response.data.organization || null
        );
      } else {
        setUser(null);
        setOrganization(null);
      }
    } catch (error) {
      // 401 is expected when there is no valid cookie.
      setUser(null);
      setOrganization(null);

      console.log(
        "No authenticated session found."
      );
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

        setOrganization(
          response.data.organization || null
        );
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
        setUser(response.data.user);

        setOrganization(
          response.data.organization || null
        );
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
      await axiosInstance.post(
        "/api/auth/logout"
      );
    } catch (error) {
      console.error(
        "Logout error:",
        error.response?.data || error.message
      );
    } finally {
      setUser(null);
      setOrganization(null);
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
        organization,

        setUser,
        setOrganization,

        loading,

        login,
        logout,
        registerOrganization,
        getCurrentUser,

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