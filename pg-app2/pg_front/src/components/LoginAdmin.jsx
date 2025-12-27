

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginAdmin = () => {
  const [form, setForm] = useState({ adminName: "", password: "" });
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
        "http://localhost:8081/api/admin/login",
        JSON.stringify(form),
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.status === 200 && res.data?.token) {
        localStorage.setItem("token", res.data.token);
        setMessage("Login successful");
        setTimeout(() => navigate("/user"), 1000);
      } else {
        setMessage(res.data?.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("Login failed. Check backend logs.");
    }
  };

  return (
    <div style={pageWrapper}>
      <div style={card}>
        <h2 style={title}>Admin Login</h2>

       

        <form onSubmit={handleSubmit}>
          {/* Admin Name */}
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

          {/* Button */}
          <div style={btnWrapper}>
            <button type="submit" style={submitBtn}>
              Login
            </button>

            <p>
              

            </p>

             




          </div>
          {message && <p style={messageStyle}>{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default LoginAdmin;

/* ================= STYLES (SAME AS USER LOGIN / ADMIN DASHBOARD) ================= */

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
   fontFamily:
    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Courier New", monospace',
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
  border: "none", // no border (same as user login)
  cursor: "pointer",
};

const messageStyle = {
  marginBottom: "14px",
  color: "#43e86cff",
  textAlign: "center",
};
