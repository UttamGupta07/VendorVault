
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


          {/* <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          /> */}

        </Route>
       



      </Routes>
    </BrowserRouter>
  )
}

export default App
