import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../../../config/apiconfig";
import styles from "./Delivery.module.css";
import { toast } from "react-toastify";

const Delivery = () => {
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("eBilling")) || {};
  const token = userData?.accessToken || "";
  const companyId = userData?.selectedCompany?.id || "";

  const [challans, setChallans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedChallan, setSelectedChallan] = useState(null);

  const fetchDeliveryChallans = async () => {
    if (!token || !companyId) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `${config.BASE_URL}/company/${companyId}/get/delivery-challan/list/by`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setChallans(res.data || []);
    } catch (err) {
      toast.error("Failed to load delivery challans");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveryChallans();
  }, [token, companyId]);

  const deleteChallan = async (challanId) => {
    if (!window.confirm("Are you sure you want to delete this delivery challan?")) return;

    try {
      await axios.delete(`${config.BASE_URL}/delivery-challan/${challanId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setChallans((prev) => prev.filter((c) => c.deliveryChallanId !== challanId));
      toast.success("Delivery challan deleted successfully");
      setSelectedChallan(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete challan");
    }
  };

  const handleEdit = (challanId) => {
    navigate(`/create_delivery?edit=${challanId}`);
    setSelectedChallan(null);
  };

  return (
    <div className={styles["company-form-container"]}>
      {/* Header */}
      <div className={styles["form-header"]}>
        <div>
          <h1 className={styles["company-form-title"]}>Delivery Challans</h1>
          <p className={styles["form-subtitle"]}>Manage all your delivery challans</p>
        </div>
        <button
          onClick={() => navigate("/create_delivery")}
          className={styles["submit-button"]}
          disabled={loading}
        >
          Create Delivery Challan
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className={styles["loading-message"]}>
          <div className={styles.spinner}></div>
          <p>Loading delivery challans...</p>
        </div>
      )}

      {/* Table */}
      {challans.length > 0 ? (
        <div className={styles["table-wrapper"]}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Challan No</th>
                <th>Challan Date</th>
                <th>Due Date</th>
                <th>Party Name</th>
                <th>Total Qty</th>
                <th>Total Amount</th>
                <th>Discount</th>
                <th>Tax</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {challans.map((c) => (
                <tr key={c.deliveryChallanId}>
                  <td>{c.challanNo}</td>
                  <td>{new Date(c.challanDate).toLocaleDateString()}</td>
                  <td>{new Date(c.dueDate).toLocaleDateString()}</td>
                  <td>{c.partyResponseDto?.name || "—"}</td>
                  <td>{c.totalQuantity}</td>
                  <td>₹{parseFloat(c.totalAmount).toFixed(2)}</td>
                  <td>₹{parseFloat(c.totalDiscountAmount).toFixed(2)}</td>
                  <td>₹{parseFloat(c.totalTaxAmount).toFixed(2)}</td>
                  <td>
                    <span
                      className={`${styles["status-badge"]} ${
                        c.challanType === "CLOSE" ? styles.closed : styles.open
                      }`}
                    >
                      {c.challanType}
                    </span>
                  </td>
                  <td className={styles["actions-cell"]}>
                    <button
                      onClick={() => setSelectedChallan(c)}
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
            <p>No delivery challans found</p>
            <p className={styles["no-data-subtitle"]}>
              Click "Create Delivery Challan" to add your first one.
            </p>
          </div>
        )
      )}

      {/* VIEW MODAL */}
      {selectedChallan && (
        <div className={styles["modal-overlay"]} onClick={() => setSelectedChallan(null)}>
          <div className={styles["detail-card"]} onClick={(e) => e.stopPropagation()}>
            <div className={styles["card-header"]}>
              <div>
                <h3>Delivery Challan #{selectedChallan.challanNo}</h3>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <div
                    className={`${styles["status-badge"]} ${
                      selectedChallan.challanType === "CLOSE" ? styles.closed : styles.open
                    }`}
                    style={{ fontSize: "0.8rem", padding: "4px 8px" }}
                  >
                    {selectedChallan.challanType}
                  </div>
                </div>
              </div>
              <div>
                {/* Edit Button: Hidden if challanType === "CLOSE" */}
                {selectedChallan.challanType !== "CLOSE" && (
                  <button
                    onClick={() => handleEdit(selectedChallan.deliveryChallanId)}
                    className={`${styles["action-button"]} ${styles["edit-button"]}`}
                    title="Edit challan"
                  >
                    Edit
                  </button>
                )}

                <button
                  onClick={() => deleteChallan(selectedChallan.deliveryChallanId)}
                  className={`${styles["action-button"]} ${styles["delete-button"]}`}
                  title="Delete challan"
                >
                  Delete
                </button>

                <button
                  className={styles["close-modal-btn"]}
                  onClick={() => setSelectedChallan(null)}
                >
                  Close
                </button>
              </div>
            </div>

            {/* Challan Details */}
            <section className={styles["card-section"]}>
              <h4>Challan Details</h4>
              <div className={styles["detail-grid"]}>
                <p><strong>Challan No:</strong> {selectedChallan.challanNo}</p>
                <p><strong>Challan Date:</strong> {new Date(selectedChallan.challanDate).toLocaleDateString()}</p>
                <p><strong>Due Date:</strong> {new Date(selectedChallan.dueDate).toLocaleDateString()}</p>
                <p><strong>Challan Type:</strong>
                  <span
                    className={`${styles["status-badge"]} ${
                      selectedChallan.challanType === "CLOSE" ? styles.closed : styles.open
                    }`}
                  >
                    {selectedChallan.challanType}
                  </span>
                </p>
                <p><strong>State of Supply:</strong> {selectedChallan.stateOfSupply?.replace(/_/g, " ")}</p>
                <p><strong>Description:</strong> {selectedChallan.description || "—"}</p>
                <p><strong>Total Quantity:</strong> {selectedChallan.totalQuantity}</p>
                <p><strong>Total Discount:</strong> ₹{selectedChallan.totalDiscountAmount.toFixed(2)}</p>
                <p><strong>Total Tax:</strong> ₹{selectedChallan.totalTaxAmount.toFixed(2)}</p>
                <p><strong>Total Amount:</strong> ₹{selectedChallan.totalAmount.toFixed(2)}</p>
              </div>
            </section>

            {/* Party */}
            {selectedChallan.partyResponseDto && (
              <section className={styles["card-section"]}>
                <h4>Party Details</h4>
                <div className={styles["detail-grid"]}>
                  <p><strong>Name:</strong> {selectedChallan.partyResponseDto.name}</p>
                  <p><strong>Party ID:</strong> {selectedChallan.partyResponseDto.partyId}</p>
                  <p><strong>GSTIN:</strong> {selectedChallan.partyResponseDto.gstin || "—"}</p>
                  <p><strong>GST Type:</strong> {selectedChallan.partyResponseDto.gstType?.replace(/_/g, " ")}</p>
                  <p><strong>Phone:</strong> {selectedChallan.partyResponseDto.phoneNo || "—"}</p>
                  <p><strong>Email:</strong> {selectedChallan.partyResponseDto.emailId || "—"}</p>
                  <p><strong>State:</strong> {selectedChallan.partyResponseDto.state?.replace(/_/g, " ")}</p>
                  <p><strong>Billing Address:</strong> {selectedChallan.partyResponseDto.billingAddress || "—"}</p>
                  <p><strong>Shipping Address:</strong> {selectedChallan.partyResponseDto.shipingAddress || "—"}</p>
                </div>
              </section>
            )}

            {/* Items */}
            <section className={styles["card-section"]}>
              <h4>Items</h4>
              {selectedChallan.deliveryChallanItemResponses?.length > 0 ? (
                <table className={styles["items-table"]}>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Qty</th>
                      <th>Unit</th>
                      <th>Rate/Unit</th>
                      <th>Discount</th>
                      <th>Tax Type</th>
                      <th>Tax Rate</th>
                      <th>Tax</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedChallan.deliveryChallanItemResponses.map((item, i) => (
                      <tr key={i}>
                        <td>{item.name}</td>
                        <td>{item.quantity}</td>
                        <td>{item.unit}</td>
                        <td>₹{item.ratePerUnit.toFixed(2)}</td>
                        <td>₹{item.discountAmount.toFixed(2)}</td>
                        <td>{item.taxType}</td>
                        <td>{item.taxRate}</td>
                        <td>₹{item.totalTaxAmount.toFixed(2)}</td>
                        <td>₹{item.totalAmount.toFixed(2)}</td>
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

export default Delivery;