

import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [admin, setAdmin] = useState(null);
  const [error, setError] = useState("");

  const fetchAdmin = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8081/api/admin/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdmin(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch admin details");
    }
  };

  useEffect(() => {
    fetchAdmin();
  }, []);

  return (
    <div style={pageWrapper}>
      <div style={card}>
        <h2 style={title}>Admin Dashboard</h2>

        {error && <p style={errorText}>{error}</p>}

        {admin ? (
          <div style={infoBox}>
            <p><span style={label}>ID:</span> {admin.adminId}</p>
            <p><span style={label}>Name:</span> {admin.adminName}</p>
            <p><span style={label}>Role:</span> {admin.role}</p>
          </div>
        ) : (
          <p style={loadingText}>Loading admin details...</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

/* ================= STYLES (SAME AS BEFORE) ================= */

/* Page wrapper */
const pageWrapper = {
  height: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

/* Card box */
const card = {
  backgroundColor: "#ffffff",
  padding: "30px 40px",
  borderRadius: "10px",
  minWidth: "360px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
  border: "2px solid black"
};

/* Title (font unchanged) */
const title = {
  marginBottom: "20px",
  color: "#333",
  fontWeight: "normal",
  borderBottom: "1px solid #e0e0e0",
  paddingBottom: "10px",
  textAlign: "center",
};

/* Info box */
const infoBox = {
  fontSize: "15px",
  color: "#444",
  lineHeight: "1.9",
};

/* Label (font unchanged) */
const label = {
  color: "#666",
  fontWeight: "500",
};

const loadingText = {
  color: "#888",
  textAlign: "center",
};

const errorText = {
  color: "#d9534f",
  marginBottom: "15px",
  textAlign: "center",
};
