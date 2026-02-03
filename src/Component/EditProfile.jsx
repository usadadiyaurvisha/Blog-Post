import { useEffect, useState } from "react";
import "./EditProfile.css";
import { toast } from "react-toastify";

export default function EditProfile({ userId, onClose }) {
  const [loading, setLoading] = useState(false);

  const loginData = JSON.parse(localStorage.getItem("loginData")) || {};

  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    otp: "",
    role: "",
  });

  useEffect(() => {
    if (userId) {
      fetchUserById();
    }
  }, [userId]);

  //  GET USER DATA
  const fetchUserById = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `https://696b4b20624d7ddccaa0bb77.mockapi.io/users/${userId}`
      );
      const data = await response.json();

      setFormData({
        fullName: data?.fullName || data?.name || "",
        mobile: data?.mobile || data?.mobileNumber || "",
        otp: loginData?.otp || "",
        role: loginData?.role || "",
      });
    } catch (error) {
      console.error("Fetch user error:", error);
    } finally {
      setLoading(false);
    }
  };

  //  INPUT CHANGE (ONLY NUMBERS, MAX 10 FOR MOBILE)
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "mobile" && !/^\d{0,10}$/.test(value)) return;

    setFormData({ ...formData, [name]: value });
  };

  //  SAVE (PUT + localStorage update)
  const handleSave = async () => {
    if (!formData.fullName.trim()) {
      toast.warning("Please enter full name");
      return;
    }

    if (!/^\d{10}$/.test(formData.mobile)) {
      toast.warning("Mobile number must be 10 digits");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `https://696b4b20624d7ddccaa0bb77.mockapi.io/users/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName: formData.fullName,
            mobile: formData.mobile,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Update failed");
      }

      toast.success("Profile updated successfully");

      //  Update localStorage
      const updatedLoginData = {
        ...loginData,
        fullName: formData.fullName,
        mobile: formData.mobile,
        mobileNumber: formData.mobile,
        phone: formData.mobile,
      };
      localStorage.setItem("loginData", JSON.stringify(updatedLoginData));

      onClose();
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (                     
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>Edit Profile</h2>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {/* FULL NAME */}
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Full Name"
            />

            {/* MOBILE (10 DIGIT ONLY) */}
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Mobile Number"
              maxLength={10}
            />

            {/* ROLE */}
            <select value={formData.role} disabled>
              <option value="Admin">Admin</option>
              <option value="User">User</option>
            </select>

            {/* OTP */}
            <input type="text" value={formData.otp} disabled />

            <div className="modal-actions">
              <button className="btn cancel" onClick={onClose}>
                Cancel
              </button>
              <button className="btn save" onClick={handleSave}>
                Save
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
