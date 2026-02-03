import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";
import ConfirmationModal from "./ConfirmationModal";
import EditProfile from "./EditProfile";
import ModeContext from "../context/ModeContext";
import { useContext, useState } from "react";

export function Navbar(props) {
  const navigate = useNavigate();
  const ctx = useContext(ModeContext);

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("loginData")) || {}
  );

  const handleLogout = () => {
    localStorage.removeItem("loginData");
    localStorage.removeItem("user");
    setShowLogoutModal(false);
    navigate("/login");
  };

  return (
    <>
      <nav className={`nav ${ctx.mode === "dark" ? "nav-dark" : "nav-light"}`}>
        <div className="logo">
          <h1>BlogPost</h1>
        </div>

        <div className="menu">
          <NavLink to="/" className={({ isActive }) => (isActive ? "active Link" : "Link")}>
            Home
          </NavLink>

          {user?.role === "admin" && (
            <NavLink to="/new-post" className={({ isActive }) => (isActive ? "active Link" : "Link")}>
              NewPost
            </NavLink>
          )}

          <NavLink to="/Explore" className={({ isActive }) => (isActive ? "active Link" : "Link")}>
            Explore
          </NavLink>

          <button className="logout-btn Link" onClick={() => setShowLogoutModal(true)}>
            Logout
          </button>
        </div>

        <div className="dark">
          <span onClick={ctx.toggleMode}>
            <div className="icon">{props.icon}</div>
            {ctx.mode === "dark" ? "Light" : "Dark"}
          </span>

          <div
            onClick={() => setShowProfileModal(true)}
            className={`role-badge ${user?.role === "admin" ? "admin" : "user"}`}
          >
            {user?.role === "admin" ? "A" : "U"}
          </div>
        </div>
      </nav>

      {showLogoutModal && (
        <ConfirmationModal
          title="Logout?"
          desc="You are about to log out, are you sure?"
          onClose={() => setShowLogoutModal(false)}
          onConfirm={handleLogout}
          confirmBtnText="Logout"
        />
      )}

      {showProfileModal && (
        <EditProfile
          onClose={() => setShowProfileModal(false)}
          userId={user?.id}
        />
      )}
    </>
  );
}
