
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const USER_API = "http://localhost:8081/api/admin/users";
const PAYMENT_API = "http://localhost:8083/api/payments";

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [paymentStatus, setPaymentStatus] = useState("DUE");
  const [latestPaymentId, setLatestPaymentId] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [message, setMessage] = useState("");

  const [showApproveConfirm, setShowApproveConfirm] = useState(false);

  /* ================= LOAD USER + PAYMENT ================= */
  useEffect(() => {
    const loadData = async () => {
      try {
        const userRes = await axios.get(`${USER_API}/${id}`);
        setUser(userRes.data);

        const statusRes = await axios.get(`${PAYMENT_API}/status/${id}`);
        setPaymentStatus(statusRes.data);

        const latestRes = await axios.get(`${PAYMENT_API}/latest/${id}`);
        setLatestPaymentId(latestRes.data.paymentId);
      } catch (err) {
        console.error("Error loading user:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  /* ================= PREVIEW ================= */
  const handlePreview = async () => {
    try {
      const res = await axios.get(
        `${PAYMENT_API}/${latestPaymentId}/invoice/download`,
        { responseType: "blob" }
      );
      setPreviewUrl(URL.createObjectURL(res.data));
    } catch {
      alert("❌ Invoice not found");
    }
  };

  /* ================= APPROVE ================= */
  const handleApprove = async () => {
    try {
      await axios.post(`${PAYMENT_API}/${latestPaymentId}/approve`);
      setPaymentStatus("PAID");
      setMessage("✅ Payment Approved Successfully");
      setPreviewUrl(null);
      setShowApproveConfirm(false);
    } catch {
      alert("❌ Approval failed");
    }
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading user...</p>;
  if (!user) return <p style={{ textAlign: "center" }}>User not found</p>;

  return (
    <div style={pageWrapper}>
      <div style={card}>
        <div style={cardInner}>
          <h2>User Details</h2>

          <p><b>ID:</b> {user.userId}</p>
          <p><b>Name:</b> {user.userName}</p>
          <p><b>Room:</b> {user.userRoom}</p>
          <p><b>Mobile:</b> {user.userMobile}</p>
          <p><b>Electricity Bill:</b> ₹{user.userEbill}</p>

          <p>
            <b>Status:</b>{" "}
            <span style={paymentStatus === "PAID" ? paid : due}>
              {paymentStatus}
            </span>
          </p>
          {/* <button style={btnBack} onClick={() => navigate("/users")}>
                ⬅ Back to Users
              </button> */}

          {message && <p style={success}>{message}</p>}
        </div>

        {/* ================= ACTION BUTTONS ================= */}
        <div style={btnBox}>
          {paymentStatus === "INVOICE_UPLOADED" && (
            <>
              <button style={btnBack} onClick={() => navigate("/users")}>
                ⬅ Back to Users
              </button>
              <button style={btnPreview} onClick={handlePreview}>
                Preview Invoice
              </button>

              <button
                style={btnApprove}
                onClick={() => setShowApproveConfirm(true)}
              >
                Approve Payment
              </button>
            </>
          )}


        </div>

        {/* ================= CONFIRM POPUP ================= */}
        {showApproveConfirm && (
          <div style={overlay}>
            <div style={popup}>
              <h3>Confirm Approval</h3>
              <p>Are you sure you want to approve this payment?</p>

              <div style={confirmBtnBox}>
                <button style={btnApprove} onClick={handleApprove}>
                  Yes, Approve
                </button>

                <button
                  style={btnCancel}
                  onClick={() => setShowApproveConfirm(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= INVOICE PREVIEW ================= */}
        {previewUrl && (
          <iframe src={previewUrl} title="Invoice Preview" style={iframe} />
        )}
      </div>
    </div>
  );
};

export default UserDetail;

/* ================= STYLES ================= */

const pageWrapper = {
  minHeight: "60vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#f2f2f2",
};

const card = {
  width: "520px",
  padding: "25px",
  border: "2px solid #000",
  borderRadius: "12px",
  background: "#fff",
};

const cardInner = {
  fontFamily:
    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Courier New", monospace',
  marginLeft: "120px",
};

const btnBox = {
  display: "flex",
  justifyContent: "center",
  gap: "14px",
  marginTop: "20px",
};

const confirmBtnBox = {
  display: "flex",
  justifyContent: "center",
  gap: "15px",
  marginTop: "20px",
};

const baseBtn = {
  padding: "8px 18px",
  borderRadius: "6px",
  border: "none",
  cursor: "pointer",
  fontFamily:
    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Courier New", monospace',
};

const btnPreview = {
  ...baseBtn,
  background: "#f4b400",
  color: "white",
};

const btnApprove = {
  ...baseBtn,
  background: "#4CAF50",
  color: "white",
};

const btnBack = {
  ...baseBtn,
  background: "#2b2b2b",
  color: "white",
};

const btnCancel = {
  ...baseBtn,
  background: "#999",
  color: "white",
};

const iframe = {
  width: "100%",
  height: "400px",
  marginTop: "15px",
  border: "1px solid #ccc",
  borderRadius: "8px",
};

const paid = { color: "green", fontWeight: "bold" };
const due = { color: "red", fontWeight: "bold" };
const success = { marginTop: "15px", color: "green", fontWeight: "bold" };

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const popup = {
  background: "white",
  padding: "25px",
  borderRadius: "12px",
  textAlign: "center",
  width: "300px",
};
