
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import RegisterAdmin from "./components/RegisterAdmin";
import LoginAdmin from "./components/LoginAdmin";
import UserLoginDashboard from "./components/UserLoginDashboard";
import UserForm from "./components/UserForm";
import PaymentInvoice from "./components/PaymentInvoice";
import UpdateElectricityBill from "./components/UpdateElectricityBill";
import UserList from "./components/UserList";
import UserDetail from "./components/UserDetail";
import UploadInvoice from "./components/UploadInvoice";
import InvoiceList from "./components/InvoiceList";

/* =======================
   PROTECTED ROUTES
======================= */

const AdminProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

const UserProtectedRoute = ({ children }) => {
  const user = localStorage.getItem("user");
  if (!user) return <Navigate to="/user-login" replace />;

  try {
    JSON.parse(user);
    return children;
  } catch {
    localStorage.removeItem("user");
    return <Navigate to="/user-login" replace />;
  }
};

/* =======================
   APP
======================= */

const App = () => {
  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
    //document.body.style.margin = "0";
  }, []);

  return (
    <Router>
      <Navbar />

      <div style={contentWrapper}>
        <Routes>

          {/* ================= HOME ================= */}
          <Route
            path="/"
            element={
              <div style={fixedPage}>
                <>
                  {/* 🔥 KEYFRAMES */}
                  <style>
                    {`
                      @keyframes typing {
                        from { width: 0 }
                        to { width: 100% }
                      }

                      @keyframes blink {
                        50% { border-color: transparent }
                      }

                      @keyframes gradientMove {
                        0% { background-position: 0% 50%; }
                        50% { background-position: 100% 50%; }
                        100% { background-position: 0% 50%; }
                      }
                    `}
                  </style>

                  {/* 🔥 ANIMATED HOME TEXT */}
                  <h1
                    style={{
                      fontFamily: "'Poppins', 'Segoe UI', sans-serif",
                      fontSize: "clamp(28px, 5vw, 42px)",
                      fontWeight: "600",
                      letterSpacing: "1px",
                      textAlign: "center",

                      background:
                        "linear-gradient(270deg, #ff8a00, #e52e71, #6a11cb, #8cfa4c)",
                      backgroundSize: "600% 600%",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",

                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      borderRight: "3px solid rgba(255,255,255,0.8)",
                      width: "0",
                      margin: "0 auto",

                      animation: `
                        typing 3s steps(30, end) forwards,
                        blink 0.7s step-end infinite,
                        gradientMove 8s ease infinite
                      `,
                    }}
                  >
                    Welcome to AK Men's PG-Hostel
                  </h1>
                </>
              </div>
            }
          />

          {/* ================= ADMIN ================= */}
          <Route path="/register" element={<RegisterAdmin />} />
          <Route path="/login" element={<LoginAdmin />} />

          <Route
            path="/user"
            element={
              <AdminProtectedRoute>
                <UserForm />
              </AdminProtectedRoute>
            }
          />

          <Route
            path="/users"
            element={
              <AdminProtectedRoute>
                <UserList />
              </AdminProtectedRoute>
            }
          />

          <Route
            path="/view-user/:id"
            element={
              <AdminProtectedRoute>
                <UserDetail />
              </AdminProtectedRoute>
            }
          />

          <Route
            path="/update-bill/:id"
            element={
              <AdminProtectedRoute>
                <UpdateElectricityBill />
              </AdminProtectedRoute>
            }
          />

          {/* ================= USER ================= */}
          <Route path="/user-login" element={<UserLoginDashboard />} />

          <Route
            path="/payment"
            element={
              <UserProtectedRoute>
                <PaymentInvoice />
              </UserProtectedRoute>
            }
          />

          <Route
            path="/upload-invoice"
            element={
              <UserProtectedRoute>
                <UploadInvoice />
              </UserProtectedRoute>
            }
          />

          <Route
            path="/invoices"
            element={
              <UserProtectedRoute>
                <InvoiceList />
              </UserProtectedRoute>
            }
          />

          {/* ================= FALLBACK ================= */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </div>
    </Router>
  );
};

export default App;

/* =======================
   STYLES
======================= */

const contentWrapper = {
  height: "calc(100vh - 70px)",
  marginTop: "70px",
  backgroundColor: "#f2f2f2",
};

const fixedPage = {
  height: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  overflow: "hidden",
};
