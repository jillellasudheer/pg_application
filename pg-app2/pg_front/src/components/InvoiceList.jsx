

import React, { useEffect, useState } from "react";
import axios from "axios";

const PAYMENT_API = "http://localhost:8083/api/payments";

const InvoiceList = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    axios
      .get(`${PAYMENT_API}/${user.userId}/invoices`)
      .then(res => setInvoices(res.data))
      .catch(() => setInvoices([]))
      .finally(() => setLoading(false));
  }, [user]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const downloadInvoice = async (invoiceId) => {
    try {
      const res = await axios.get(
        `${PAYMENT_API}/invoice/${invoiceId}/download`,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${invoiceId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch {
      alert("❌ Invoice download failed");
    }
  };

  if (loading) {
    return <p style={{ textAlign: "center" }}>Loading invoices...</p>;
  }

  return (
    <div style={pageWrapper}>
      <div style={card}>
        <div style={card1}>
        <h2 style={title}>📄 My Invoices</h2>

        <p style={userText}>User: {user?.userName}</p>

        {invoices.length === 0 ? (
          <p>No invoices available</p>
        ) : (
          <table style={table}>
            <thead>
              <tr>
                <th style={th}>S.No</th>
                <th style={th}>Date</th>
                <th style={th}>Action</th>
              </tr>
            </thead>

            <tbody>
              {invoices.map((inv, index) => (
                <tr key={inv.invoiceId} style={row}>
                  <td style={td}>{index + 1}</td>
                  <td style={td}>{formatDate(inv.invoiceDate)}</td>
                  <td style={td}>
                    <button
                      style={btn}
                      onClick={() => downloadInvoice(inv.invoiceId)}
                    >
                      Get Invoice
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceList;




/* ================= STYLES ================= */

const pageWrapper = {
   paddingTop: "50px",
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
  backgroundColor: "#f2f2f2",
 
};

const card = {
  width: "620px",
  padding: "25px",
  border: "2px solid #000",
  borderRadius: "12px",
  textAlign: "center",
  background: "#fff",
  
};




const card1 ={
  fontFamily:
    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Courier New", monospace',
}

const title = {
  marginBottom: "10px",
  color: "#333",
};

const userText = {
  fontWeight: "bold",
  marginBottom: "15px",
  color: "#444",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "15px",
};

const th = {
  padding: "12px",
  background: "#2575fc",
  color: "white",
  fontWeight: "bold",
  borderBottom: "2px solid #ddd",
};

const td = {
  padding: "10px",
  borderBottom: "1px solid #eee",
};

const row = {
  transition: "background 0.3s",
};

const btn = {
  padding: "6px 18px",
  borderRadius: "16px",
  border: "none",
  background: "#4CAF50",
  color: "white",
  cursor: "pointer",
};
