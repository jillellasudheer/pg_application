
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const UpdateElectricityBill = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [ebill, setEbill] = useState("");
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  const API_BASE = "http://localhost:8081/api/admin/users";

  /* ================= LOAD USER ================= */
  useEffect(() => {
    axios
      .get(`${API_BASE}/${id}`)
      .then((res) => {
        setUser(res.data);
        setEbill(res.data.userEbill ?? "");
      })
      .catch(() => alert("Failed to load user"));
  }, [id]);

  /* ================= UPDATE EBILL ================= */
  const handleUpdate = () => {
    if (ebill === "" || isNaN(ebill)) {
      alert("Please enter a valid electricity bill amount");
      return;
    }

    axios
      .patch(`${API_BASE}/${id}/ebill`, null, {
        params: { ebill },
      })
      .then(() => {
        setMessage("Bill updated. Payment status reset to DUE.");
        setShowMessage(true);
      })
      .catch(() => {
        setMessage("Failed to update electricity bill");
        setShowMessage(true);
      });
  };

  const handleOk = () => {
    setShowMessage(false);
    navigate("/users");
  };

  if (!user) {
    return <p style={{ textAlign: "center" }}>Loading user...</p>;
  }

  return (
    <div style={pageWrapper}>
      <div style={card}>
        <h2 style={title}>Update Electricity Bill</h2>

        <div style={row}>
          <label style={rowLabel}>User ID</label>
          <input value={user.userId} disabled style={rowInput} />
        </div>

        <div style={row}>
          <label style={rowLabel}>Name</label>
          <input value={user.userName} disabled style={rowInput} />
        </div>

        <div style={row}>
          <label style={rowLabel}>Room</label>
          <input value={user.userRoom} disabled style={rowInput} />
        </div>

        <div style={row}>
          <label style={rowLabel}>Mobile</label>
          <input value={user.userMobile} disabled style={rowInput} />
        </div>

        <div style={row}>
          <label style={rowLabel}>Electricity Bill</label>
          <input
            type="number"
            value={ebill}
            onChange={(e) => setEbill(e.target.value)}
            style={rowInput}
          />
        </div>

        {/* BUTTONS */}
        <div style={btnWrapper}>
          

          <button
            onClick={() => navigate("/users")}
            style={submitBtn}
          >
            Back to Users
          </button>

          <button onClick={handleUpdate} style={submitBtn}>
            Update Bill
          </button>
        </div>

        {showMessage && (
          <div style={messageBox}>
            <p>{message}</p>
            <button onClick={handleOk} style={okBtn}>
              OK
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdateElectricityBill;

/* ================= STYLES ================= */

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
  minWidth: "380px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
  border: "2px solid black",
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
  marginBottom: "14px",
};

const rowLabel = {
  width: "140px",
  color: "#333",
  fontFamily:
    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Courier New", monospace',
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
  gap: "15px",
  marginTop: "20px",
};

const submitBtn = {
  padding: "8px 30px",
  backgroundColor: "#2b2b2b",
  color: "white",
  border: "none",
  cursor: "pointer",
  fontFamily:
    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Courier New", monospace',
};

const messageBox = {
  marginTop: "20px",
  padding: "15px",
  background: "#d4edda",
  color: "#155724",
  borderRadius: "6px",
  textAlign: "center",
};

const okBtn = {
  marginTop: "10px",
  padding: "6px 16px",
  backgroundColor: "#2b2b2b",
  color: "white",
  border: "none",
  cursor: "pointer",
};
