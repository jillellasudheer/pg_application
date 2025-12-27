
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterAdmin = () => {
  const [form, setForm] = useState({
    adminName: "",
    password: "",
    role: "ADMIN",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:8081/api/admin/register",
        form,
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.status === 200 && res.data?.adminName) {
        setMessage(
          `Registered successfully: ${res.data.adminName} (Role: ${res.data.role})`
        );
        setForm({ adminName: "", password: "", role: "ADMIN" });
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setMessage(res.data?.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setMessage("Registration failed. Check backend logs.");
    }
  };

  return (
    <div style={pageWrapper}>
      <div style={card}>
        <h2 style={title}>Register Admin / Manager</h2>

        

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div style={row}>
            <label style={rowLabel}>Name</label>
            <input
              type="text"
              name="adminName"
              value={form.adminName}
              onChange={handleChange}
              required
              style={rowInput}
            />
          </div>

          {/* Password */}
          <div style={row}>
            <label style={rowLabel}>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              style={rowInput}
            />
          </div>

          {/* Role */}
          <div style={row}>
            <label style={rowLabel}>Role</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              required
              style={rowInput}
            >
              <option value="ADMIN">ADMIN</option>
              <option value="MANAGER">MANAGER</option>
            </select>
          </div>

          {/* Button */}
          <div style={btnWrapper}>
            <button type="submit" style={submitBtn}>
              Register
            </button>
          </div>

          {message && <p style={messageStyle}>{message}</p>}



        </form>
      </div>
    </div>
  );
};

export default RegisterAdmin;

/* ================= STYLES (SAME ACROSS APP) ================= */

const pageWrapper = {
  height: "80%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const card = {
  backgroundColor: "#ffffff",
  padding: "30px 40px",
  borderRadius: "10px",
  minWidth: "360px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
  border:"2px solid black"
};

const title = {
  marginBottom: "20px",
  color: "#333",
  fontWeight: "normal",
  borderBottom: "1px solid #e0e0e0",
  paddingBottom: "10px",
  textAlign: "center",
};

const row = {
  display: "flex",
  alignItems: "center",
  marginBottom: "16px",
};

const rowLabel = {
  width: "110px",
  color: "#333",
};

const rowInput = {
  padding: "8px 10px",
  borderRadius: "4px",
  border: "1px solid #ccc",
  outline: "none",
  width: "220px",
};

const btnWrapper = {
  display: "flex",
  justifyContent: "center",
  marginTop: "20px",
};

const submitBtn = {
  padding: "8px 30px",
  backgroundColor: "#2b2b2b",
  color: "white",
  border: "none",
  cursor: "pointer",
};

const messageStyle = {
  marginBottom: "14px",
  color: "#d9534f",
  textAlign: "center",
};
