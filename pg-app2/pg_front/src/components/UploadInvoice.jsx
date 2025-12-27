
import React, { useState } from "react";
import axios from "axios";
import { AlignCenter } from "lucide-react";

const PAYMENT_API = "http://localhost:8083/api/payments";

const UploadInvoice = () => {
  const paymentId = localStorage.getItem("paymentId");

  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");
  const [uploading, setUploading] = useState(false);

  const uploadInvoice = async () => {
    if (!file) {
      setMsg("❌ Please select a PDF file");
      return;
    }

    setUploading(true);
    setMsg("");

    const fd = new FormData();
    fd.append("file", file);

    try {
      await axios.post(
        `${PAYMENT_API}/${paymentId}/invoice/upload`,
        fd
      );

      setMsg("✅ Invoice uploaded successfully. Waiting for approval");

      setTimeout(() => setMsg(""), 3000);

    } catch {
      setMsg("❌ Upload failed");
    } finally {
      setUploading(false);
    }
  };

  if (!paymentId) {
    return <p style={{ textAlign: "center" }}>No payment found</p>;
  }

  return (
    <div style={pageWrapper}>
      <div style={card}>
        <div style={cardContent}>

          <h2 style={title}>Upload Invoice</h2>


          <input
            type="file"
            accept="application/pdf"
            onChange={e => setFile(e.target.files[0])}
            style={fileInput}
          />


          <button
            onClick={uploadInvoice}
            disabled={uploading}
            style={{
              ...btn,
              opacity: uploading ? 0.6 : 1,
              cursor: uploading ? "not-allowed" : "pointer",
            }}
          >
            {uploading ? "Uploading..." : "Upload Invoice"}
          </button>

          {msg && (
            <p style={message}>
              {msg}
            </p>
          )}

        </div>
      </div>
    </div>
  );
};

export default UploadInvoice;


/* ================= STYLES ================= */

const pageWrapper = {
  height: "50%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#f2f2f2",
};

const card = {
  width: "420px",
  padding: "26px",
  border: "2px solid #000",
  borderRadius: "12px",
  background: "#fff",
  textAlign: "center",
};

const cardContent = {
  fontFamily:
    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Courier New", monospace',

};

const title = {
  marginBottom: "18px",
  fontSize: "20px",
  fontWeight: "700",
};

const fileInput = {
  marginBottom: "18px",
  marginLeft: "120px",
};

const btn = {
  padding: "10px 22px",
  borderRadius: "20px",
  background: "#ff9800",
  color: "white",
  border: "none",
  fontWeight: "600",
};

const message = {
  marginTop: "15px",
  fontWeight: "bold",
};
