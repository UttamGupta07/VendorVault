
// 1. Import Routes instead of Router
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/public/Home'
// import RegisterOrganization from './Component/RegisterOrganization'
// import SuperAdminDashboard from './Component/SuperAdminDashboard'
import ProtectedRoute from './Component/ProtectedRoute'
import PublicLayout from './layout/PublicLayout'
import RegisterOrganization from "./pages/RegisterOrganization"
import LandingPage from './pages/public/LandingPage'
import RegisterPage from './pages/public/RegisterPage'
import LoginPage from './pages/public/LoginPage'
import SuperAdminDashboard from './pages/superAdminPages/SuperAdminDashboard'
import SuperAdminLayout from './layout/SuperAdminLayout'

const App = () => {
  return (
    <BrowserRouter>
      {/* <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/organization-register' element={<RegisterOrganization />} />
        <Route path='/admin-dashboard' element={<SuperAdminDashboard/>} />

      </Routes> */}
      <Routes>
         <Route element={<PublicLayout />}>

          <Route path="/" element={<LandingPage />} />
          <Route path="/organization-register" element={<RegisterOrganization/>}/>
          <Route path="/register" element={<RegisterPage/>}/>
          <Route path="/login" element={<LoginPage/>}/>


           

        </Route>

        
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
          element={<div>Users</div>}
        />

        <Route
          path="/super-admin/roles"
          element={<div>Roles & Permissions</div>}
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


       



      </Routes>
    </BrowserRouter>
  )
}

export default App
