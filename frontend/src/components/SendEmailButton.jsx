import React, { useState } from "react";
import toast from "react-hot-toast";
import axiosInstance from "../lib/axios";

const SendEmailButton = ({ className = "" }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSendEmail = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await axiosInstance.post("email/send-segmented-email");
      setResult(res.data);
      toast.success("Segmented emails sent successfully!");
    } catch (err) {
      setResult({ success: false, error: err.message });
    }
    setLoading(false);
  };

  return (
    <div className={`my-4 ${className}`}>
      <button
        onClick={handleSendEmail}
        disabled={loading}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        {loading ? "Sending..." : "Send Segmented Email"}
      </button>
      {result && (
        <div className="mt-2">
          {result.success ? (
            <span className="text-green-600">Emails sent successfully!</span>
          ) : (
            <span className="text-red-600">Error: {result.error}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default SendEmailButton;
