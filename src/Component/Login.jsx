import React, { useState } from "react";
import "./Login.css";
import login from "../assets/login.jpg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [mobile, setMobile] = useState("");
  const [role, setRole] = useState("");
  const [otp, setOtp] = useState("");
  const [generateOtp, setGenerateOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const [mobileValidation, setMobileValidation] = useState("");
  const [roleValidation, setRoleValidation] = useState("");
  const [otpValidation, setOtpValidation] = useState("");

  const navigate = useNavigate();

  const random = Math.floor(1000 + Math.random() * 9000);

  const handleGenerateOtp = (e) => {
    e.preventDefault();
    setOtp(random.toString());
    setGenerateOtp(random.toString());
    alert("One Time Password: " + random);
  };

  const handleMobileChange = (e) => {
    setMobile(e.target.value);
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const loginClick = async (e) => {
    e.preventDefault();

    let valid = true;

    if (!mobile) {
      setMobileValidation("Mobile is required");
      valid = false;
    } else if (!/^\d{10}$/.test(mobile)) {
      setMobileValidation("Mobile must be 10 digits");
      valid = false;
    } else {
      setMobileValidation("");
    }

    if (!role) {
      setRoleValidation("Role is required");
      valid = false;
    } else {
      setRoleValidation("");
    }

    if (!otp) {
      setOtpValidation("OTP is required");
      valid = false;
    } else {
      setOtpValidation("");
    }

    if (!valid) return;

    if (generateOtp !== otp) {
      toast.error("Invalid OTP");
      return;
    }

    try {
      setLoading(true);

      const url = "https://696b4b20624d7ddccaa0bb77.mockapi.io/users";

      //  Fetch existing users to check duplicates
      const existingRes = await fetch(url);
      const existingUsers = await existingRes.json();

      //  Check if user already exists (mobile + role)
      const existingUser = existingUsers.find(
        (user) => user.mobile === mobile && user.role === role
      );

      let data;
      if (existingUser) {
        // User exists, use existing data
        data = existingUser;
        toast.info("Welcome back!");
      } else {
        // User not exists, create new
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ mobile, role, otp }),
        });

        if (!response.ok) {
          toast.error("Invalid Request");
          setLoading(false);
          return;
        }

        data = await response.json();
        toast.success("Login successfully");
      }

      //  Save login data to localStorage
      localStorage.setItem("loginData", JSON.stringify(data));

      // Reset form
      setMobile("");
      setRole("");
      setOtp("");
      setGenerateOtp("");

      setLoading(false);

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      setLoading(false);
      toast.error("Something went wrong. Please try again.");
      console.error("Login error:", error);
    }
  };

  return (
    <div className="login-container">
      <ToastContainer />

      <div className="login-left">
        <img src={login} alt="login illustration" />
      </div>

      <div className="login-rigst">
        <h2>Hello Again,</h2>
        <p className="subtitle">Welcome back, let's get started!</p>

        <form>
          <input
            type="text"
            placeholder="Mobile number"
            className="input-field"
            maxLength={10}
            value={mobile}
            onChange={handleMobileChange}
          />
          {mobileValidation && <p className="error">{mobileValidation}</p>}

          <select className="input-field" onChange={handleRoleChange} value={role}>
            <option value="">Select a Role</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
          {roleValidation && <p className="error">{roleValidation}</p>}

          <button
            type="button"
            className="btn primary"
            onClick={handleGenerateOtp}
            disabled={loading}
          >
            Generate OTP
          </button>

          <input
            type="text"
            placeholder="Enter OTP"
            className="input-field"
            onChange={handleOtpChange}
            value={otp}
          />
          {otpValidation && <p className="error">{otpValidation}</p>}

          <button
            className="btn secondary"
            onClick={loginClick}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
