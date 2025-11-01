// import React from 'react'
// import styles from "./Quotation.module.css"; 
// export default function Quotation() {
//   return (
//     <div>Quotation</div>
//   )
// }




import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../../../config/apiconfig";
import styles from "./Quotation.module.css";  // Reuse existing styles
import { toast } from "react-toastify";

const QuotationList = () => {
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("eBilling")) || {};
  const token = userData?.accessToken || "";
  const companyId = userData?.selectedCompany?.id || "";

  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState(null);

  const fetchQuotations = async () => {
    if (!token || !companyId) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `${config.BASE_URL}/company/${companyId}/quotations`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setQuotations(res.data || []);
    } catch (err) {
      toast.error("Failed to load quotations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotations();
  }, [token, companyId]);

  const deleteQuotation = async (id) => {
    if (!window.confirm("Are you sure you want to delete this quotation?")) return;

    try {
      await axios.delete(`${config.BASE_URL}/quotation/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuotations((prev) => prev.filter((q) => q.quotationId !== id));
      toast.success("Quotation deleted successfully");
      setSelectedQuotation(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete quotation");
    }
  };

  const handleEdit = (id) => {
    navigate(`/create_quotation?edit=${id}`);
    setSelectedQuotation(null);
  };

  return (
    <div className={styles["company-form-container"]}>
      {/* Header */}
      <div className={styles["form-header"]}>
        <div>
          <h1 className={styles["company-form-title"]}>Quotations</h1>
          <p className={styles["form-subtitle"]}>Manage all your quotations</p>
        </div>
        <button
          onClick={() => navigate("/create_quotation")}
          className={styles["submit-button"]}
          disabled={loading}
        >
          Create Quotation
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className={styles["loading-message"]}>
          <div className={styles.spinner}></div>
          <p>Loading quotations...</p>
        </div>
      )}

      {/* Table */}
      {quotations.length > 0 ? (
        <div className={styles["table-wrapper"]}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Ref No</th>
                <th>Date</th>
                <th>Party</th>
                <th>Items</th>
                <th>Total (w/o Tax)</th>
                <th>Tax</th>
                <th>Delivery</th>
                <th>Total</th>
                <th>Type</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {quotations.map((q) => (
                <tr key={q.quotationId}>
                  <td>{q.referenceNo}</td>
                  <td>{new Date(q.invoiceDate).toLocaleDateString()}</td>
                  <td>{q.partyResponseDto?.name || "—"}</td>
                  <td>{q.quotationItemResponses?.length || 0}</td>
                  <td>₹{parseFloat(q.totalAmountWithoutTax).toFixed(2)}</td>
                  <td>₹{parseFloat(q.totalTaxAmount).toFixed(2)}</td>
                  <td>₹{parseFloat(q.deliveryCharges).toFixed(2)}</td>
                  <td>₹{parseFloat(q.totalAmount).toFixed(2)}</td>
                  <td>
                    <span
                      className={`${styles["status-badge"]} ${
                        q.quotationType === "CLOSE" ? styles.closed : styles.open
                      }`}
                    >
                      {q.quotationType}
                    </span>
                  </td>
                  <td className={styles["actions-cell"]}>
                    <button
                      onClick={() => setSelectedQuotation(q)}
                      className={`${styles["action-button"]} ${styles["view-button"]}`}
                      title="View details"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !loading && (
          <div className={styles["no-data"]}>
            <p>No quotations found</p>
            <p className={styles["no-data-subtitle"]}>
              Click "Create Quotation" to add your first one.
            </p>
          </div>
        )
      )}

      {/* VIEW MODAL */}
      {selectedQuotation && (
        <div
          className={styles["modal-overlay"]}
          onClick={() => setSelectedQuotation(null)}
        >
          <div
            className={styles["detail-card"]}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles["card-header"]}>
              <div>
                <h3>Quotation #{selectedQuotation.referenceNo}</h3>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <div
                    className={`${styles["status-badge"]} ${
                      selectedQuotation.quotationType === "CLOSE"
                        ? styles.closed
                        : styles.open
                    }`}
                    style={{ fontSize: "0.8rem", padding: "4px 8px" }}
                  >
                    {selectedQuotation.quotationType}
                  </div>
                </div>
              </div>
              <div>
                {selectedQuotation.quotationType !== "CLOSE" && (
                  <button
                    onClick={() => handleEdit(selectedQuotation.quotationId)}
                    className={`${styles["action-button"]} ${styles["edit-button"]}`}
                    title="Edit quotation"
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={() => deleteQuotation(selectedQuotation.quotationId)}
                  className={`${styles["action-button"]} ${styles["delete-button"]}`}
                  title="Delete quotation"
                >
                  Delete
                </button>
                <button
                  className={styles["close-modal-btn"]}
                  onClick={() => setSelectedQuotation(null)}
                >
                  Close
                </button>
              </div>
            </div>

            {/* Details */}
            <section className={styles["card-section"]}>
              <h4>Quotation Details</h4>
              <div className={styles["detail-grid"]}>
                <p><strong>Reference No:</strong> {selectedQuotation.referenceNo}</p>
                <p><strong>Date:</strong> {new Date(selectedQuotation.invoiceDate).toLocaleDateString()}</p>
                <p><strong>State of Supply:</strong> {selectedQuotation.stateOfSupply.replace(/_/g, " ")}</p>
                <p><strong>Description:</strong> {selectedQuotation.description || "—"}</p>
                <p><strong>Total (w/o Tax):</strong> ₹{parseFloat(selectedQuotation.totalAmountWithoutTax).toFixed(2)}</p>
                <p><strong>Tax Amount:</strong> ₹{parseFloat(selectedQuotation.totalTaxAmount).toFixed(2)}</p>
                <p><strong>Delivery Charges:</strong> ₹{parseFloat(selectedQuotation.deliveryCharges).toFixed(2)}</p>
                <p><strong>Total Amount:</strong> ₹{parseFloat(selectedQuotation.totalAmount).toFixed(2)}</p>
              </div>
            </section>

            {/* Party */}
            {selectedQuotation.partyResponseDto && (
              <section className={styles["card-section"]}>
                <h4>Party Details</h4>
                <div className={styles["detail-grid"]}>
                  <p><strong>Name:</strong> {selectedQuotation.partyResponseDto.name}</p>
                  <p><strong>GSTIN:</strong> {selectedQuotation.partyResponseDto.gstin || "—"}</p>
                  <p><strong>Phone:</strong> {selectedQuotation.partyResponseDto.phoneNo || "—"}</p>
                  <p><strong>Email:</strong> {selectedQuotation.partyResponseDto.emailId || "—"}</p>
                  <p><strong>State:</strong> {selectedQuotation.partyResponseDto.state.replace(/_/g, " ")}</p>
                  <p><strong>Billing Address:</strong> {selectedQuotation.partyResponseDto.billingAddress || "—"}</p>
                  <p><strong>Shipping Address:</strong> {selectedQuotation.partyResponseDto.shipingAddress || "—"}</p>
                </div>
              </section>
            )}

            {/* Items */}
            <section className={styles["card-section"]}>
              <h4>Items</h4>
              {selectedQuotation.quotationItemResponses?.length > 0 ? (
                <table className={styles["items-table"]}>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>HSN</th>
                      <th>Qty</th>
                      <th>Unit</th>
                      <th>Rate/Unit</th>
                      <th>Tax Type</th>
                      <th>Tax Rate</th>
                      <th>Tax</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedQuotation.quotationItemResponses.map((it, i) => (
                      <tr key={i}>
                        <td>{it.itemName}</td>
                        <td>{it.itemHsnCode || "—"}</td>
                        <td>{it.quantity}</td>
                        <td>{it.unit}</td>
                        <td>₹{parseFloat(it.pricePerUnit).toFixed(2)}</td>
                        <td>{it.pricePerUnitTaxType}</td>
                        <td>{it.taxRate}</td>
                        <td>₹{parseFloat(it.totalTaxAmount).toFixed(2)}</td>
                        <td>₹{parseFloat(it.totalAmount).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No items</p>
              )}
            </section>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuotationList;
