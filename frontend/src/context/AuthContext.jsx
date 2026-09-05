//  import {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
// } from "react";

// import axiosInstance from "../api/axiosInstance";

// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [organization, setOrganization] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // ==========================================
//   // GET CURRENT USER
//   // ==========================================

//   const getCurrentUser = async () => {
//     try {
//       const response = await axiosInstance.get(
//         "/api/auth/me"
//       );

//       if (response.data.success) {
//         setUser(response.data.user);
//         setOrganization(
//           response.data.organization || null
//         );
//       } else {
//         setUser(null);
//         setOrganization(null);
//       }
//     } catch (error) {
//       // 401 is expected when there is no valid cookie.
//       setUser(null);
//       setOrganization(null);

//       console.log(
//         "No authenticated session found."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ==========================================
//   // LOGIN
//   // ==========================================

//   const login = async (email, password) => {
//     try {
//       const response = await axiosInstance.post(
//         "/api/auth/login",
//         {
//           email,
//           password,
//         }
//       );

//       if (response.data.success) {
//         setUser(response.data.user);

//         setOrganization(
//           response.data.organization || null
//         );
//       }

//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   };

//   // ==========================================
//   // REGISTER ORGANIZATION
//   // ==========================================

//   const registerOrganization = async (
//     organizationData
//   ) => {
//     try {
//       const response = await axiosInstance.post(
//         "/api/auth/register-organization",
//         organizationData
//       );

//       if (response.data.success) {
//         setUser(response.data.user);

//         setOrganization(
//           response.data.organization || null
//         );
//       }

//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   };

//   // ==========================================
//   // LOGOUT
//   // ==========================================

//   const logout = async () => {
//     try {
//       await axiosInstance.post(
//         "/api/auth/logout"
//       );
//     } catch (error) {
//       console.error(
//         "Logout error:",
//         error.response?.data || error.message
//       );
//     } finally {
//       setUser(null);
//       setOrganization(null);
//     }
//   };

//   // ==========================================
//   // CHECK AUTH ON APP LOAD
//   // ==========================================

//   useEffect(() => {
//     getCurrentUser();
//   }, []);

//   // ==========================================
//   // PROVIDER
//   // ==========================================

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         organization,

//         setUser,
//         setOrganization,

//         loading,

//         login,
//         logout,
//         registerOrganization,
//         getCurrentUser,

//         isAuthenticated: !!user,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // ==========================================
// // useAuth
// // ==========================================

// export const useAuth = () => {
//   const context = useContext(AuthContext);

//   if (!context) {
//     throw new Error(
//       "useAuth must be used inside AuthProvider"
//     );
//   }

//   return context;
// };

// export default AuthContext;

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
  const [vendor, setVendor] = useState(null);
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
        setVendor(null);

        setOrganization(
          response.data.organization || null
        );

        return true;
      }

      return false;
    } catch (error) {
      return false;
    }
  };

  // ==========================================
  // GET CURRENT VENDOR
  // ==========================================
  const getCurrentVendor = async () => {
    try {
      const response = await axiosInstance.get(
        "/api/vendor/auth/me"
      );

      if (response.data.success) {
        setVendor();
        setUser(response.data.vendor);

        setOrganization(null);

        return true;
      }

      return false;
    } catch (error) {
      return false;
    }
  };

  // ==========================================
  // CHECK CURRENT AUTHENTICATED ACCOUNT
  // ==========================================
  const checkAuth = async () => {
    try {
      // First check internal user
      const isUserAuthenticated =
        await getCurrentUser();

      if (isUserAuthenticated) {
        return;
      }

      // If not user, check vendor
      await getCurrentVendor();
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // USER LOGIN
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
        setVendor(null);

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
  // VENDOR LOGIN
  // ==========================================
  const vendorLogin = async (email, password) => {
    try {
      const response = await axiosInstance.post(
        "/api/vendor-auth/login",
        {
          email,
          password,
        }
      );

      if (response.data.success) {
        setVendor(response.data.vendor);
        setUser(null);
        setOrganization(null);
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
        setVendor(null);

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
      setVendor(null);
      setOrganization(null);
    }
  };

  // ==========================================
  // CHECK AUTH ON APP LOAD
  // ==========================================
  useEffect(() => {
    checkAuth();
  }, []);

  // ==========================================
  // PROVIDER
  // ==========================================
  return (
    <AuthContext.Provider
      value={{
        // Internal user
        user,

        // Vendor
        vendor,

        // Organization
        organization,

        // Setters
        setUser,
        setVendor,
        setOrganization,

        // Loading
        loading,

        // Authentication
        login,
        vendorLogin,

        // Organization registration
        registerOrganization,

        // Current account
        getCurrentUser,
        getCurrentVendor,
        checkAuth,

        // Logout
        logout,

        // Authentication status
        isAuthenticated: !!user || !!vendor,

        // Role helpers
        isVendor: !!vendor,
        isUser: !!user,
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

