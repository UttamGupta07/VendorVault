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
import RolesPermissions from "./pages/superAdminPages/RolesPermissions";
import DocumentTypes from "./pages/superAdminPages/DocumentTypes";
import ServiceTypes from "./pages/superAdminPages/ServiceTypes";
import VendorManagement from "./pages/compliance/VendorManagement";
import ComplianceDocuments from "./pages/compliance/ComplianceDocuments";
import DocumentReview from "./pages/compliance/DocumentReview";


import VendorLayout from "./layout/VendorLayout";
import VendorDashboard from "./pages/vendor/VendorDashboard";
import VendorDocuments from "./pages/vendor/VendorDocuments";

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
              element={<Users />}
            />

            <Route
              path="/super-admin/roles"
              element={<RolesPermissions />}
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
              element={<DocumentTypes />}
            />

            <Route
              path="/super-admin/service"
              element={<ServiceTypes />}
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
            <Route path="/compliance/dashboard" element={<ComplianceDashboard />} />
            <Route
              path="/compliance/vendors"
              element={<VendorManagement />}
            />
            <Route path="/compliance/documents" element={<ComplianceDocuments />} />

            <Route
              path="/compliance/documents/:id"
              element={

                <DocumentReview />}
            />


          </Route>
          <Route element={<VendorLayout />}>
            <Route path="/vendor/dashboard" element={<VendorDashboard />} />
            <Route path="/vendor/documents" element={<VendorDocuments />} />
            <Route path="/vendor/requests" element={<div>Vendor Requests</div>} />
            <Route path="/vendor/notifications" element={<div>Vendor Notifications</div>} />
            <Route path="/vendor/profile" element={<div>Vendor Profile</div>} />
          </Route>

        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default App;