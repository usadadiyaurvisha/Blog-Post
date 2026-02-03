import { Outlet } from "react-router-dom";
import { Navbar } from "../Component/Navbar";
import Footer from "../Component/Footer";
   export function RootLayout() {
  return (
    <>
      <Navbar/>
      <Outlet />
   <Footer/>
    </>
  );
}

export default RootLayout;

