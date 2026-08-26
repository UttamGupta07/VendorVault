 import { BrowserRouter, Routes, Route } from "react-router-dom";

import ProtectedRoute from "./Component/ProtectedRoute";
import PublicRoute from "./Component/PublicRoute";

import PublicLayout from "./layout/PublicLayout";
import SuperAdminLayout from "./layout/SuperAdminLayout";

import LandingPage from "./pages/public/LandingPage";
import RegisterPage from "./pages/public/RegisterPage";
import LoginPage from "./pages/public/LoginPage";
import RegisterOrganization from "./pages/RegisterOrganization";

import SuperAdminDashboard from "./pages/superAdminPages/SuperAdminDashboard";
import Users from "./pages/superAdminPages/Users";
import Home from "./pages/public/Home";
import ComplianceOfficer from "./pages/superAdminPages/ComplianceOfficer";
import ComplianceOfficerLayout from "./layout/ComplianceOfficerLayout";
import ComplianceDashboard from "./pages/compliance/ComplianceDashboard";
import ComplianceVendor from "./pages/compliance/ComplianceVendor";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* =========================================
            PUBLIC ROUTES
        ========================================= */}

        <Route element={<PublicRoute />}>
          <Route element={<PublicLayout />}>

            <Route
              path="/"
              element={<Home />}
            />

            <Route
              path="/organization-register"
              element={<RegisterOrganization />}
            />

            <Route
              path="/register"
              element={<RegisterPage />}
            />

            <Route
              path="/login"
              element={<LoginPage />}
            />

          </Route>
        </Route>


        {/* =========================================
            PROTECTED ROUTES
        ========================================= */}

        <Route element={<ProtectedRoute />}>

          <Route element={<SuperAdminLayout />}>

            <Route
              path="/super-admin/dashboard"
              element={<SuperAdminDashboard />}
            />

            <Route
              path="/super-admin/organizations"
              element={<div>Organizations</div>}
            />

            <Route
              path="/super-admin/users"
              element={<Users/>}
            />

            <Route
              path="/super-admin/roles"
              element={<ComplianceOfficer/>}
            />

            <Route
              path="/super-admin/vendors"
              element={<div>Vendors</div>}
            />

            <Route
              path="/super-admin/auditors"
              element={<div>Auditors</div>}
            />

            <Route
              path="/super-admin/compliance-teams"
              element={<div>Compliance Teams</div>}
            />

            <Route
              path="/super-admin/documents"
              element={<div>Documents Overview</div>}
            />

            <Route
              path="/super-admin/alerts"
              element={<div>System Alerts</div>}
            />

            <Route
              path="/super-admin/reports"
              element={<div>Reports & Analytics</div>}
            />

            <Route
              path="/super-admin/activity-logs"
              element={<div>Activity Logs</div>}
            />

            <Route
              path="/super-admin/settings"
              element={<div>Settings</div>}
            />

          </Route>
           <Route element={<ComplianceOfficerLayout />}>
           <Route path="/compliance/dashboard" element={<ComplianceDashboard/>}/>
           <Route
              path="/compliance/vendors"
              element={<ComplianceVendor />}
            />

           </Route>

        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default App;