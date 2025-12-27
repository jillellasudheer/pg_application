
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const PAYMENT_API = "http://localhost:8083/api/payments";

const PaymentInvoice = () => {
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [paymentId, setPaymentId] = useState(null);

  const [status, setStatus] = useState("DUE");
  const [processing, setProcessing] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);

  const [successMsg, setSuccessMsg] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const [downloadMsg, setDownloadMsg] = useState("");
  const [invoiceDownloaded, setInvoiceDownloaded] = useState(false);

  const [showUpload, setShowUpload] = useState(false);
  const [invoiceFile, setInvoiceFile] = useState(null);

  /* ================= LOAD USER ================= */
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) return;

    const u = JSON.parse(stored);
    setUser(u);

    setTotalAmount(
      Number(u.userMonthlyRent || 0) + Number(u.userEbill || 0)
    );

    axios
      .get(`${PAYMENT_API}/status/${u.userId}`)
      .then(res => setStatus(res.data))
      .catch(() => setStatus("DUE"));
  }, []);

  /* ================= SHOW UPLOAD FROM NAV ================= */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("upload") === "true") {
      setShowUpload(true);
    }
  }, [location]);

  /* ================= PAYMENT ================= */
  const handlePayment = (method) => {
    if (!user || processing || paymentDone) return;

    setProcessing(true);
    setShowSuccess(false);
    setSuccessMsg("");

    setTimeout(async () => {
      try {
        const res = await axios.post(
          `${PAYMENT_API}/${user.userId}`,
          null,
          { params: { method } }
        );

        setPaymentId(res.data.paymentId);
        localStorage.setItem("paymentId", res.data.paymentId);

        setPaymentDone(true);
        setStatus("DUE");

        setSuccessMsg(`Payment successful! Method: ${method}`);
        setShowSuccess(true);

        setTimeout(() => {
          setShowSuccess(false);
          setSuccessMsg("");
        }, 3000);

      } catch {
        setSuccessMsg("❌ Payment failed");
        setShowSuccess(true);
      } finally {
        setProcessing(false);
      }
    }, 3000);
  };

  /* ================= DOWNLOAD ================= */
  const downloadInvoice = async () => {
    try {
      const res = await axios.get(
        `${PAYMENT_API}/${paymentId}/invoice/download`,
        { responseType: "blob" }
      );

      const url = URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${paymentId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setInvoiceDownloaded(true);
      setDownloadMsg("✅ Invoice downloaded successfully");

      setTimeout(() => setDownloadMsg(""), 3000);
    } catch {
      setDownloadMsg("❌ Invoice download failed");
      setTimeout(() => setDownloadMsg(""), 3000);
    }
  };

  /* ================= UPLOAD ================= */
  const uploadInvoice = async () => {
    if (!invoiceFile || !paymentId) return;

    const fd = new FormData();
    fd.append("file", invoiceFile);

    try {
      await axios.post(
        `${PAYMENT_API}/${paymentId}/invoice/upload`,
        fd
      );

      setStatus("INVOICE_UPLOADED");
      setShowUpload(false);
      setInvoiceFile(null);

    } catch {
      alert("❌ Upload failed");
    }
  };

  if (!user) return <p style={{ textAlign: "center" }}>Please login</p>;

  return (
    <div style={pageWrapper}>
      <div style={card}>
        <h2>Payment for {user.userName}</h2>
        <p><b>Total Amount:</b> ₹{totalAmount}</p>

        <p>
          <b>Status:</b>{" "}
          <span style={{
            ...statusText,
            color:
              status === "PAID"
                ? "green"
                : status === "INVOICE_UPLOADED"
                  ? "#f4b400"
                  : "red"
          }}>
            {status}
          </span>
        </p>

        {/* PAYMENT BUTTONS */}
        <div>
          {["CreditCard", "UPI", "NetBanking"].map(m => (
            <button
              key={m}
              onClick={() => handlePayment(m)}
              disabled={processing || paymentDone || status !== "DUE"}
              style={{
                ...btn,
                opacity: processing || paymentDone || status !== "DUE" ? 0.6 : 1,
                cursor: processing ? "not-allowed" : "pointer"
              }}
            >
              {m}
            </button>
          ))}
        </div>

        {/* PROCESSING */}
        {processing && (
          <p style={processingText}>⏳ Processing payment...</p>
        )}

        {/* SUCCESS ANIMATION */}
        {showSuccess && (
          <div style={{ marginTop: 15 }}>
            <div style={successCircle}>✔</div>
            <p style={successText}>{successMsg}</p>
          </div>
        )}

        {/* DOWNLOAD */}
        {paymentDone && (
          <>
            <button
              onClick={downloadInvoice}
              disabled={invoiceDownloaded}
              style={{
                ...downloadBtn,
                opacity: invoiceDownloaded ? 0.6 : 1
              }}
            >
              Download Invoice
            </button>

            {downloadMsg && <p style={successText}>{downloadMsg}</p>}
          </>
        )}

        {/* UPLOAD */}
        {showUpload && paymentDone && (
          <div style={{ marginTop: 20 }}>
            <input
              type="file"
              accept="application/pdf"
              onChange={e => setInvoiceFile(e.target.files[0])}
            />
            <br />
            <button onClick={uploadInvoice} style={uploadBtn}>
              Upload Invoice
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentInvoice;


const pageWrapper = {
  height: "90%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#f2f2f2",
  fontFamily:
    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Courier New", monospace',
};

const card = {
  width: "500px",
  padding: "25px",
  border: "2px solid #000",
  borderRadius: "12px",
  textAlign: "center",
  background: "#fff",
};

const btn = {
  margin: "6px",
  padding: "10px 18px",
  borderRadius: "5px",
  //gap: "14px",
  border: "none",
  background: "#2575fc",
  color: "white",
};

const downloadBtn = {
  marginTop: "15px",
  padding: "10px 20px",
  borderRadius: "20px",
  background: "#4CAF50",
  color: "white",
  border: "none",
};

const uploadBtn = {
  marginTop: "10px",
  padding: "10px 20px",
  borderRadius: "20px",
  background: "#ff9800",
  color: "white",
  border: "none",
};

const successCircle = {
  width: "70px",
  height: "70px",
  borderRadius: "50%",
  background: "green",
  color: "white",
  fontSize: "36px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "10px auto",
  animation: "pop 0.4s ease",
};

const processingText = {
  color: "#f4b400",
  fontWeight: "bold",
  marginTop: "10px",
};

const successText = {
  color: "green",
  fontWeight: "bold",
  marginTop: "8px",
};

const statusText = {
  fontWeight: "bold",
};
