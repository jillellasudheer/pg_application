
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ChatBot from "./ChatBot";

const PAYMENT_API = "http://localhost:8083/api/payments";

/* ================= COMMON FONT ================= */
const monoFont =
  'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Courier New", monospace';

const commonFontSize = "14px";

const Navbar = () => {
  const adminToken = localStorage.getItem("token");

  let parsedUser = null;
  try {
    const userStr = localStorage.getItem("user");
    parsedUser = userStr ? JSON.parse(userStr) : null;
  } catch {
    localStorage.removeItem("user");
  }

  const [showDropdown, setShowDropdown] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("DUE");
  const dropdownRef = useRef(null);

  /* ================= FETCH PAYMENT STATUS ================= */
  useEffect(() => {
    if (parsedUser?.userId) {
      axios
        .get(`${PAYMENT_API}/status/${parsedUser.userId}`)
        .then(res => setPaymentStatus(res.data))
        .catch(() => setPaymentStatus("DUE"));
    }
  }, [parsedUser]);

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  /* ================= CLOSE LOGIN DROPDOWN ================= */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ================= COMMON HOVER ================= */
  const hoverOn = (e) => (e.target.style.background = "#555");
  const hoverOff = (e) => (e.target.style.background = "transparent");

  const uploadDisabled =
    paymentStatus === "PAID" || paymentStatus === "INVOICE_UPLOADED";

  return (
    <>
      <nav style={navStyle}>
        <div style={centerBox}>
          {/* HOME */}
          <Link
            to="/"
            style={navBtn}
            onMouseEnter={hoverOn}
            onMouseLeave={hoverOff}
          >
            Home
          </Link>

          {/* GUEST */}
          {!adminToken && !parsedUser && (
            <>
              <Link
                to="/register"
                style={navBtn}
                onMouseEnter={hoverOn}
                onMouseLeave={hoverOff}
              >
                Register
              </Link>

              <div ref={dropdownRef} style={{ position: "relative" }}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  style={navBtn}
                  onMouseEnter={hoverOn}
                  onMouseLeave={hoverOff}
                >
                  Login ▼
                </button>

                {showDropdown && (
                  <div style={dropdownStyle}>
                    <Link
                      to="/login"
                      style={dropItem}
                      onMouseEnter={hoverOn}
                      onMouseLeave={hoverOff}
                    >
                      Admin Login
                    </Link>

                    <Link
                      to="/user-login"
                      style={dropItem}
                      onMouseEnter={hoverOn}
                      onMouseLeave={hoverOff}
                    >
                      User Login
                    </Link>
                  </div>
                )}
              </div>
            </>
          )}

          {/* ADMIN */}
          {adminToken && (
            <>
              <Link
                to="/user"
                style={navBtn}
                onMouseEnter={hoverOn}
                onMouseLeave={hoverOff}
              >
                Create User
              </Link>

              <Link
                to="/users"
                style={navBtn}
                onMouseEnter={hoverOn}
                onMouseLeave={hoverOff}
              >
                Users
              </Link>

              <button
                onClick={handleLogout}
                style={navBtn}
                onMouseEnter={hoverOn}
                onMouseLeave={hoverOff}
              >
                Logout
              </button>
            </>
          )}

          {/* USER */}
          {parsedUser && !adminToken && (
            <>
              <Link
                to={paymentStatus === "PAID" ? "#" : "/payment"}
                style={{
                  ...navBtn,
                  color: paymentStatus === "PAID" ? "#4CAF50" : "white",
                  fontWeight: paymentStatus === "PAID" ? "bold" : "normal",
                  pointerEvents: paymentStatus === "PAID" ? "none" : "auto",
                }}
                onMouseEnter={hoverOn}
                onMouseLeave={hoverOff}
              >
                {paymentStatus === "PAID" ? "✔ Paid" : "Payment"}
              </Link>

              <Link
                to={uploadDisabled ? "#" : "/upload-invoice"}
                style={{
                  ...navBtn,
                  opacity: uploadDisabled ? 0.5 : 1,
                  pointerEvents: uploadDisabled ? "none" : "auto",
                }}
                onMouseEnter={hoverOn}
                onMouseLeave={hoverOff}
              >
                Upload Invoice
              </Link>

              <Link
                to="/invoices"
                style={navBtn}
                onMouseEnter={hoverOn}
                onMouseLeave={hoverOff}
              >
                Download
              </Link>

              <button
                onClick={handleLogout}
                style={navBtn}
                onMouseEnter={hoverOn}
                onMouseLeave={hoverOff}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </nav>

      {/* CHATBOT */}
      <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 9999 }}>
        <ChatBot />
      </div>
    </>
  );
};

export default Navbar;

/* ================= STYLES ================= */

const navStyle = {
  padding: "15px 35px",
  width: "100%",
  position: "absolute",
  top: 0,
  backgroundColor: "#2b2b2b",
};

const centerBox = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "15px",
  marginLeft: "960px",
};

const navBtn = {
  background: "transparent",
  color: "white",
  border: "none",
  padding: "8px 16px",
  cursor: "pointer",
  textDecoration: "none",
  fontFamily: monoFont,
  fontSize: commonFontSize,
};

const dropdownStyle = {
  position: "absolute",
  top: "40px",
  right: 0,
  background: "white",
  border: "1px solid #ccc",
  minWidth: "160px",
};

const dropItem = {
  display: "block",
  padding: "10px",
  textDecoration: "none",
  color: "#333",
  fontFamily: monoFont,
  fontSize: commonFontSize,
};
