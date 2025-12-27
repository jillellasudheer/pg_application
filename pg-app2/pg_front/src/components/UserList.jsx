
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const USER_API = "http://localhost:8081/api/admin/users";
const PAYMENT_STATUS_API = "http://localhost:8083/api/payments/status";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  /* ================= LOAD USERS (ONLY ONCE) ================= */
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);

      const userRes = await axios.get(USER_API);

      const usersWithStatus = await Promise.all(
        userRes.data.map(async (u) => {
          try {
            const statusRes = await axios.get(
              `${PAYMENT_STATUS_API}/${u.userId}`
            );
            return { ...u, paymentStatus: statusRes.data };
          } catch {
            return { ...u, paymentStatus: "DUE" };
          }
        })
      );

      setUsers(usersWithStatus);
    } catch (err) {
      console.error("Error loading users:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE USER ================= */
  const handleDelete = async (userId) => {
    try {
      await axios.delete(`${USER_API}/${userId}`);
      setUsers((prev) => prev.filter((u) => u.userId !== userId));
      setShowConfirm(false);
      setSelectedUser(null);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div style={container}>
      <h2 style={title}>All Users Details</h2>

      {loading ? (
        <p style={infoText}>Loading users...</p>
      ) : users.length === 0 ? (
        <p style={infoText}>No users found.</p>
      ) : (
        <table style={table}>
          <thead>
            <tr>
              <th style={th}>ID</th>
              <th style={th}>Name</th>
              <th style={th}>Room</th>
              <th style={th}>Mobile</th>
              <th style={th}>E-Bill</th>
              <th style={th}>Status</th>
              <th style={th}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u.userId}>
                <td style={td}>{u.userId}</td>
                <td style={td}>{u.userName}</td>
                <td style={td}>{u.userRoom}</td>
                <td style={td}>{u.userMobile}</td>
                <td style={td}>₹{u.userEbill}</td>

                <td style={td}>


                  {/* <span
                    style={
                      u.paymentStatus === "PAID"
                        ? statusPaid
                        : statusDue
                    }
                  >
                    {u.paymentStatus}
                  </span> */}

                  <span
                    style={
                      u.paymentStatus === "PAID"
                        ? statusPaid
                        : u.paymentStatus === "INVOICE_UPLOADED"
                          ? statusInvoice
                          : statusDue
                    }
                  >
                    {u.paymentStatus}
                  </span>





                </td>

                <td style={td}>
                  <div style={actionBox}>
                    <Link to={`/view-user/${u.userId}`} style={btnView}>
                      View
                    </Link>

                    <Link
                      to={`/update-bill/${u.userId}`}
                      style={btnUpdate}
                    >
                      Update
                    </Link>

                    <button
                      style={btnDelete}
                      onClick={() => {
                        setSelectedUser(u);
                        setShowConfirm(true);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ================= CONFIRM DELETE ================= */}
      {showConfirm && selectedUser && (
        <div style={overlay}>
          <div style={popup}>
            <h3>Confirm Delete</h3>
            <p>
              Are you sure you want to delete{" "}
              <b>{selectedUser.userName}</b>?
            </p>

            <button
              style={btnDelete}
              onClick={() => handleDelete(selectedUser.userId)}
            >
              Yes, Delete
            </button>

            <button
              style={btnCancel}
              onClick={() => {
                setShowConfirm(false);
                setSelectedUser(null);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;

/* ================= STYLES ================= */

const container = {
  margin: "10px 80px"
};

const title = {
  textAlign: "center",
  marginBottom: "20px",
};

const infoText = {
  textAlign: "center",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
  border: "2px solid black",
};

const th = {
  border: "2px solid black",
  padding: "10px",
  backgroundColor: "#e748fcff",
  color: "white",
  textAlign: "center",
  fontFamily:
    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Courier New", monospace',
};

const td = {
  border: "2px solid black",
  padding: "8px",
  textAlign: "center",
  fontFamily:
    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Courier New", monospace',
};

const actionBox = {
  display: "flex",
  justifyContent: "center",
  gap: "8px",
  flexWrap: "wrap",
};

const statusPaid = {
  background: "green",
  color: "white",
  padding: "5px 16px",
  borderRadius: "20px",
};

const statusDue = {
  background: "red",
  color: "white",
  padding: "5px 16px",
  borderRadius: "20px",
};

const btnView = {
  background: "#4CAF50",
  color: "white",
  padding: "6px 14px",
  borderRadius: "20px",
  textDecoration: "none",
};

const btnUpdate = {
  background: "#2575fc",
  color: "white",
  padding: "6px 14px",
  borderRadius: "20px",
  textDecoration: "none",
};

const btnDelete = {
  background: "#f44336",
  color: "white",
  padding: "6px 14px",
  border: "none",
  borderRadius: "20px",
  cursor: "pointer",
};

const btnCancel = {
  background: "gray",
  color: "white",
  padding: "6px 14px",
  border: "none",
  borderRadius: "20px",
  marginLeft: "10px",
};

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
  width: "320px",
};

const statusInvoice = {
  background: "orange",   // yellow
  color: "white",
  padding: "5px 16px",
  borderRadius: "20px",
  fontWeight: "bold",
};
