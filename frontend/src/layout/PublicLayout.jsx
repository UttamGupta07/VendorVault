import { Outlet } from "react-router-dom";
import Navbar from "../Component/Navbar";
import Footer from "../Component/Footer";

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main>
        <Outlet />
      </main>
      <Footer/>
    </div>
  );
};

export default PublicLayout;