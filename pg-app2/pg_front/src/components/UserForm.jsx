
import React, { useState, useEffect } from "react";
import axios from "axios";

const UserForm = () => {
  const [user, setUser] = useState({
    userName: "",
    userRoom: "",
    userAadhar: "",
    userPlace: "",
    userMonthlyRent: "",
    userEbill: "",
    userMobile: "",
    userPassword: "",
  });

  const [message, setMessage] = useState("");

  const [rooms, setRooms] = useState([
    { id: "R1B1", allocated: false },
    { id: "R1B2", allocated: false },
    { id: "R1B3", allocated: false },
    { id: "R1B4", allocated: false },
    { id: "R2B1", allocated: false },
    { id: "R2B2", allocated: false },
    { id: "R2B3", allocated: false },
    { id: "R2B4", allocated: false },
    { id: "R3B1", allocated: false },
    { id: "R3B2", allocated: false },
    { id: "R3B3", allocated: false },
    { id: "R3B4", allocated: false },
  ]);

  /* Fetch allocated rooms */
  useEffect(() => {
    axios
      .get("http://localhost:8081/api/admin/users/rooms")
      .then((res) => {
        setRooms((prev) =>
          prev.map((room) => ({
            ...room,
            allocated: res.data.includes(room.id),
          }))
        );
      })
      .catch(() => console.error("Failed to fetch rooms"));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoomSelect = (e) => {
    setUser((prev) => ({ ...prev, userRoom: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:8081/api/admin/users",
        user
      );
      setMessage(`User created Successfully with ID: ${res.data.userId}`);
      setTimeout(() => setMessage(""), 3000);

      setRooms((prev) =>
        prev.map((room) =>
          room.id === user.userRoom ? { ...room, allocated: true } : room
        )
      );

      setUser({
        userName: "",
        userRoom: "",
        userAadhar: "",
        userPlace: "",
        userMonthlyRent: "",
        userEbill: "",
        userMobile: "",
        userPassword: "",
      });
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to create user");
    }
  };

  return (
    <div style={pageWrapper}>
      <div style={card}>
        <h2 style={title}>Create User</h2>

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div style={row}>
            <label style={rowLabel}>Name</label>
            <input
              style={rowInput}
              name="userName"
              value={user.userName}
              onChange={handleChange}
              required
            />
          </div>

          {/* Room */}
          <div style={row}>
            <label style={rowLabel}>Room</label>
            <input
              style={{ ...rowInput, width: "100px" }}
              value={user.userRoom}
              readOnly
            />
            <select style={select} onChange={handleRoomSelect}>
              <option value="">Select</option>
              {rooms.map((r) => (
                <option key={r.id} value={r.id} disabled={r.allocated}>
                  {r.id} {r.allocated ? "(Allocated)" : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Aadhar */}
          <div style={row}>
            <label style={rowLabel}>Aadhar</label>
            <input
              style={rowInput}
              name="userAadhar"
              value={user.userAadhar}
              onChange={handleChange}
            />
          </div>

          {/* Place */}
          <div style={row}>
            <label style={rowLabel}>Place</label>
            <input
              style={rowInput}
              name="userPlace"
              value={user.userPlace}
              onChange={handleChange}
              required
            />
          </div>

          {/* Rent */}
          <div style={row}>
            <label style={rowLabel}>Monthly Rent</label>
            <input
              style={rowInput}
              type="number"
              name="userMonthlyRent"
              value={user.userMonthlyRent}
              onChange={handleChange}
              required
            />
          </div>

          {/* Bill */}
          <div style={row}>
            <label style={rowLabel}>Electricity</label>
            <input
              style={rowInput}
              type="number"
              name="userEbill"
              value={user.userEbill}
              onChange={handleChange}
              required
            />
          </div>

          {/* Mobile */}
          <div style={row}>
            <label style={rowLabel}>Mobile</label>
            <input
              style={rowInput}
              name="userMobile"
              value={user.userMobile}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div style={row}>
            <label style={rowLabel}>Password</label>
            <input
              style={rowInput}
              type="password"
              name="userPassword"
              value={user.userPassword}
              onChange={handleChange}
              required
            />
          </div>

          {/* BUTTONS */}
          <div style={btnWrapper}>
            

            <button
              type="button"
              style={submitBtn}
              onClick={() => (window.location.href = "/")}
            >
              Back to Home
            </button>

            <button style={submitBtn} type="submit">
              Create User
            </button>


          </div>

          {message && <p style={messageStyle}>{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default UserForm;

/* ================= STYLES ================= */

const pageWrapper = {
  height: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const card = {
  backgroundColor: "#fff",
  padding: "30px 40px",
  borderRadius: "10px",
  minWidth: "420px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
  border: "2px solid black",
};

const title = {
  marginBottom: "20px",
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
  width: "120px",
  fontWeight: "bold",
  fontFamily:
    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Courier New", monospace',
};

const rowInput = {
  padding: "8px",
  border: "1px solid #ccc",
  borderRadius: "4px",
  width: "220px",
};

const select = {
  marginLeft: "10px",
  padding: "8px",
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

const messageStyle = {
  textAlign: "center",
  color: "#32cb3cff",
  marginTop: "10px",
  fontFamily:
    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Courier New", monospace',
};
