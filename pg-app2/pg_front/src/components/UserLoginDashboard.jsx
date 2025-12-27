
import React, { useState, useEffect } from "react";
import axios from "axios";

const UserLoginDashboard = () => {
  const [loginData, setLoginData] = useState({
    userName: "",
    userPassword: "",
  });
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  /* Load logged-in user */
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(
        "http://localhost:8082/api/users/login",
        loginData
      );
      localStorage.setItem("user", JSON.stringify(response.data));
      setUser(response.data);
      setMessage("Login successful");
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Login failed. Check username/password."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= USER DASHBOARD ================= */
  if (user) {
    return (
      <div style={pageWrapper}>
        <div style={card}>
          <h2 style={title}>User Details</h2>

          <h2 style={wel}> <b> Welcome, {user.userName} </b>  </h2>


          <div style={infoBox}>
            <b>Name:</b>  {user.userName} <br />
            <b>Room:</b> {user.userRoom} <br />
            <b>Aadhar:</b> {user.userAadhar} <br />
            <b>Place:</b> {user.userPlace} <br />
            <b>Monthly Rent:</b> ₹{user.userMonthlyRent} <br />
            <b>Electricity Bill:</b> ₹{user.userEbill} <br />
            <b>Mobile:</b> {user.userMobile}
          </div>
        </div>
      </div>
    );
  }

  /* ================= LOGIN FORM ================= */
  return (
    <div style={pageWrapper}>
      <div style={card}>
        <h2 style={title}>User Login</h2>

        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div style={row}>
            <label style={rowLabel}>Username</label>
            <input
              type="text"
              name="userName"
              value={loginData.userName}
              onChange={handleChange}
              disabled={loading}
              required
              style={rowInput}
            />
          </div>

          {/* Password */}
          <div style={row}>
            <label style={rowLabel}>Password</label>
            <input
              type="password"
              name="userPassword"
              value={loginData.userPassword}
              onChange={handleChange}
              disabled={loading}
              required
              style={rowInput}
            />
          </div>

          {/* Button */}
          <div style={btnWrapper}>
            <button type="submit" disabled={loading} style={submitBtn}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
          {message && <p style={messageStyle}>{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default UserLoginDashboard;

/* ================= STYLES ================= */

/* Page center */
const pageWrapper = {
  height: "80%",
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

/* Title */
const title = {
  marginBottom: "20px",
  color: "#333",
  fontWeight: "normal",
  borderBottom: "1px solid #e0e0e0",
  paddingBottom: "10px",
  textAlign: "center",
};

/* User info */
const infoBox = {
  fontSize: "16px",
  color: "#444",
  lineHeight: "1.9",

  width: "250px",
  fontFamily:
    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Courier New", monospace',

};

const wel = {
  fontFamily:
    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Courier New", monospace',

}


/* Form row */
const row = {
  display: "flex",
  alignItems: "center",
  marginBottom: "16px",
};

// const rowLabel = {
//   width: "110px",
//   // fontWeight: "bold",
//   //fontFamily: '"Lucida Console", "Courier New", monospace',
//    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Courier New", monospace',



// };

const rowLabel = {
  width: "110px",
  fontFamily:
    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Courier New", monospace',
  fontSize: "14px",
};


const rowInput = {
  padding: "8px 10px",
  borderRadius: "4px",
  border: "1px solid #ccc",
  width: "220px",
};

/* Button */
const btnWrapper = {
  display: "flex",
  justifyContent: "center",
  marginTop: "20px",
};

const submitBtn = {
  padding: "8px 30px",
  backgroundColor: "#2b2b2b",
  color: "white",
  border: "none", // no border as requested
  cursor: "pointer",
};

/* Message */
const messageStyle = {
  marginBottom: "14px",
  color: "#d9534f",
  textAlign: "center",
};
