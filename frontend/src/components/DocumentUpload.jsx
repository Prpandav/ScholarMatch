/**
 * components/DocumentUpload.jsx
 * --------------------------------
 * OCR document upload and verification UI.
 * Uploads to /api/documents/verify and shows result inline.
 */
import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { useToast } from "../context/ToastContext";

const DOC_TYPES = [
  "Income Certificate",
  "Caste Certificate",
  "Marksheet",
  "Aadhaar Card",
  "PAN Card",
  "Bank Passbook",
];

function VerifyResult({ result }) {
  if (!result) return null;
  const { verified, document_type, confidence, message } = result;
  return (
    <div
      className={`mt-4 p-4 rounded-xl border text-sm ${
        verified
          ? "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:text-green-300"
          : "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:text-red-300"
      }`}
    >
      <div className="font-bold mb-1">
        {verified ? "✅ Document Verified" : "❌ Verification Failed"}
      </div>
      {verified && (
        <div className="flex flex-wrap gap-2 mb-1">
          <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs dark:bg-green-800 dark:text-green-200">
            {document_type}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs dark:bg-blue-800 dark:text-blue-200">
            {Math.round(confidence * 100)}% confidence
          </span>
        </div>
      )}
      <p className="text-xs opacity-80">{message}</p>
    </div>
  );
}

export default function DocumentUpload() {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef();

  const handleFile = (f) => {
    setFile(f);
    setResult(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  };

  const verify = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const form = new FormData();
      form.append("document", file);
      const res = await axios.post("/api/documents/verify", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data);
      showToast(
        res.data.verified
          ? "Document verified successfully!"
          : "Verification failed.",
        res.data.verified ? "success" : "error",
      );
    } catch (e) {
      showToast(e.response?.data?.message || "Upload failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-6 mb-6">
      <h3 className="text-lg font-extrabold text-slate-800 dark:text-white mb-1 flex items-center gap-2">
        📄 {t("doc_upload_title")}
      </h3>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
        {t("doc_upload_desc")}
      </p>

      {/* Accepted document types */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {DOC_TYPES.map((d) => (
          <span
            key={d}
            className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600
                                    border border-indigo-100 dark:bg-indigo-900 dark:text-indigo-300 dark:border-indigo-800"
          >
            {d}
          </span>
        ))}
      </div>

      {/* Drop zone */}
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors
          ${dragOver ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20" : "border-slate-200 dark:border-slate-600 hover:border-indigo-300"}`}
        onClick={() => inputRef.current.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.pdf"
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />
        <div className="text-3xl mb-2">📎</div>
        {file ? (
          <div>
            <p className="font-semibold text-slate-700 dark:text-slate-200">
              {file.name}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              {(file.size / 1024).toFixed(1)} KB
            </p>
          </div>
        ) : (
          <div>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              Drop file here or click to upload
            </p>
            <p className="text-xs text-slate-400 mt-1">
              JPG, PNG, PDF • Max 10 MB
            </p>
          </div>
        )}
      </div>

      {file && (
        <button
          onClick={verify}
          disabled={loading}
          className="btn-primary w-full mt-4 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />{" "}
              Verifying…
            </>
          ) : (
            "🔍 Verify Document"
          )}
        </button>
      )}

      <VerifyResult result={result} />
    </div>
  );
}
