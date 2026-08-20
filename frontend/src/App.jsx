import Home from './Component/Home'
// 1. Import Routes instead of Router
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import RegisterOrganization from './Component/RegisterOrganization'
import SuperAdminDashboard from './Component/SuperAdminDashboard'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/organization-register' element={<RegisterOrganization />} />
        <Route path='/admin-dashboard' element={<SuperAdminDashboard/>} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
