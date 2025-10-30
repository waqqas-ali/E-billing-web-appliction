import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../../../config/apiconfig";
import styles from "./Purchases.module.css"; // reuse Sales.module.css
import { toast } from "react-toastify";

const PurchaseReturns = () => {
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("eBilling")) || {};
  const token = userData?.accessToken || "";
  const companyId = userData?.selectedCompany?.id || "";

  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");

  // Default: last 30 days
  const getDefaultDateRange = () => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 30);
    return {
      startDate: start.toISOString().split("T")[0],
      endDate: end.toISOString().split("T")[0],
    };
  };

  // Token validation
  const isTokenValid = () => {
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const now = Date.now() / 1000;
      return payload.exp > now;
    } catch {
      return false;
    }
  };

  // FETCH PURCHASE RETURNS
  const fetchReturns = async () => {
    if (!token || !isTokenValid()) {
      toast.error("Session expired. Please log in again.");
      localStorage.removeItem("eBilling");
      navigate("/login");
      return;
    }

    if (!companyId) {
      toast.error("No company selected.");
      return;
    }

    const { startDate: defaultStart, endDate: defaultEnd } = getDefaultDateRange();
    const params = {
      startDate: filterStartDate || defaultStart,
      endDate: filterEndDate || defaultEnd,
    };

    setLoading(true);
    try {
      const res = await axios.get(
        `${config.BASE_URL}/company/${companyId}/get/purchase/return/list/according`,
        {
          params,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          timeout: 10000,
        }
      );

      setReturns(res.data || []);
      toast.success("Purchase returns loaded");
    } catch (err) {
      console.error("FULL ERROR:", err.response || err);

      if (err.response?.status === 401) {
        toast.error("Invalid or expired token. Logging out...");
        localStorage.removeItem("eBilling");
        navigate("/login");
      } else {
        toast.error(err.response?.data?.message || "Failed to load returns");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturns();
    // eslint-disable-next-line
  }, [token, companyId]);

  // DELETE
  const deleteReturn = async (purchaseReturnId) => {
    if (!window.confirm("Delete this purchase return? This action cannot be undone.")) return;

    try {
      setLoading(true);
      await axios.delete(`${config.BASE_URL}/purchase-return/${purchaseReturnId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setReturns((prev) => prev.filter((r) => r.purchaseReturnId !== purchaseReturnId));
      setSelectedReturn(null);
      toast.success("Purchase return deleted");
    } catch (err) {
      console.error("Delete error:", err.response || err);
      toast.error(err.response?.data?.message || "Failed to delete");
    } finally {
      setLoading(false);
    }
  };

  // EDIT
  const handleEdit = (purchaseReturnId) => {
    navigate(`/create_purchase_return?edit=${purchaseReturnId}`);
    setSelectedReturn(null);
  };

  return (
    <div className={styles["company-form-container"]}>
      {/* HEADER */}
      <div className={styles["form-header"]}>
        <div>
          <h1 className={styles["company-form-title"]}>Purchase Returns</h1>
          <p className={styles["form-subtitle"]}>Manage all return bills from suppliers</p>
        </div>
        <button
          onClick={() => navigate("/create_purchase_return")}
          className={styles["submit-button"]}
          disabled={loading}
        >
          + New Return
        </button>
      </div>

      {/* DATE FILTER */}
      <div style={{ marginBottom: "16px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <div>
          <label style={{ fontSize: "0.9rem", fontWeight: "500" }}>Start Date</label>
          <input
            type="date"
            value={filterStartDate}
            onChange={(e) => setFilterStartDate(e.target.value)}
            className={styles["form-input"]}
            style={{ width: "160px" }}
          />
        </div>
        <div>
          <label style={{ fontSize: "0.9rem", fontWeight: "500" }}>End Date</label>
          <input
            type="date"
            value={filterEndDate}
            onChange={(e) => setFilterEndDate(e.target.value)}
            className={styles["form-input"]}
            style={{ width: "160px" }}
          />
        </div>
        <button
          onClick={fetchReturns}
          className={styles["submit-button"]}
          style={{ alignSelf: "end", height: "40px" }}
          disabled={loading}
        >
          Apply Filter
        </button>
      </div>

      {/* LOADING */}
      {loading && (
        <div className={styles["loading-message"]}>
          <div className={styles.spinner}></div>
          <p>Loading returns...</p>
        </div>
      )}

      {/* TABLE */}
      {returns.length > 0 ? (
        <div className={styles["table-wrapper"]}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Return #</th>
                <th>Return Date</th>
                <th>Bill #</th>
                <th>Party</th>
                <th>Qty</th>
                <th>Total</th>
                <th>Received</th>
                <th>Balance</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {returns.map((r) => (
                <tr key={r.purchaseReturnId}>
                  <td>{r.returnNo}</td>
                  <td>{new Date(r.returnDate).toLocaleDateString()}</td>
                  <td>{r.billNo}</td>
                  <td>{r.partyResponseDto?.name || "—"}</td>
                  <td>{r.totalQuantity}</td>
                  <td>₹{parseFloat(r.totalAmount).toFixed(2)}</td>
                  <td>₹{parseFloat(r.receivedAmount).toFixed(2)}</td>
                  <td
                    style={{
                      color: r.balanceAmount > 0 ? "#e74c3c" : "#27ae60",
                      fontWeight: "600",
                    }}
                  >
                    ₹{parseFloat(r.balanceAmount).toFixed(2)}
                  </td>
                  <td className={styles["actions-cell"]}>
                    <button
                      onClick={() => setSelectedReturn(r)}
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
            <p>No purchase returns found</p>
            <p className={styles["no-data-subtitle"]}>
              Click “+ New Return” to create one.
            </p>
          </div>
        )
      )}

      {/* VIEW MODAL */}
      {selectedReturn && (
        <div
          className={styles["modal-overlay"]}
          onClick={() => setSelectedReturn(null)}
        >
          <div
            className={styles["detail-card"]}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles["card-header"]}>
              <div>
                <h3>Return #{selectedReturn.returnNo}</h3>
                <div
                  className={`${styles["balance-badge"]} ${
                    selectedReturn.balanceAmount <= 0 ? styles.paid : ""
                  }`}
                >
                  {selectedReturn.balanceAmount > 0 ? "Warning" : "Check"} Balance: ₹
                  {parseFloat(selectedReturn.balanceAmount).toFixed(2)}
                </div>
              </div>

              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {/* DELETE */}
                <button
                  onClick={() => deleteReturn(selectedReturn.purchaseReturnId)}
                  className={`${styles["action-button"]} ${styles["delete-button"]}`}
                  title="Delete return"
                  disabled={loading}
                >
                  Delete
                </button>

                {/* EDIT – ONLY IF BALANCE > 0 */}
                {selectedReturn.balanceAmount > 0 && (
                  <button
                    onClick={() => handleEdit(selectedReturn.purchaseReturnId)}
                    className={`${styles["action-button"]} ${styles["edit-button"]}`}
                    title="Edit return"
                    disabled={loading}
                  >
                    Edit
                  </button>
                )}

                {/* CLOSE */}
                <button
                  className={styles["close-modal-btn"]}
                  onClick={() => setSelectedReturn(null)}
                  disabled={loading}
                >
                  Close
                </button>
              </div>
            </div>

            {/* RETURN SUMMARY */}
            <section className={styles["card-section"]}>
              <h4>Return Summary</h4>
              <div className={styles["detail-grid"]}>
                <p><strong>Return ID:</strong> {selectedReturn.purchaseReturnId}</p>
                <p><strong>Return Date:</strong> {new Date(selectedReturn.returnDate).toLocaleDateString()}</p>
                <p><strong>Bill #:</strong> {selectedReturn.billNo}</p>
                <p><strong>Bill Date:</strong> {new Date(selectedReturn.billDate).toLocaleDateString()}</p>
                <p><strong>Payment Type:</strong> {selectedReturn.paymentType}</p>
                <p><strong>State of Supply:</strong> {selectedReturn.stateOfSupply?.replace(/_/g, " ")}</p>
                <p><strong>Description:</strong> {selectedReturn.description || "—"}</p>
                <p><strong>Total Qty:</strong> {selectedReturn.totalQuantity}</p>
                <p><strong>Total Discount:</strong> ₹{selectedReturn.totalDiscount?.toFixed(2)}</p>
                <p><strong>Total Tax:</strong> ₹{selectedReturn.totalTaxAmount?.toFixed(2)}</p>
                <p><strong>Total Amount:</strong> ₹{selectedReturn.totalAmount?.toFixed(2)}</p>
                <p><strong>Received Amount:</strong> ₹{selectedReturn.receivedAmount?.toFixed(2)}</p>
                <p>
                  <strong>Balance:</strong>{" "}
                  <span style={{ color: selectedReturn.balanceAmount > 0 ? "#e74c3c" : "#27ae60" }}>
                    ₹{parseFloat(selectedReturn.balanceAmount).toFixed(2)}
                  </span>
                </p>
              </div>
            </section>

            {/* PARTY */}
            {selectedReturn.partyResponseDto && (
              <section className={styles["card-section"]}>
                <h4>Party Details</h4>
                <div className={styles["detail-grid"]}>
                  <p><strong>Name:</strong> {selectedReturn.partyResponseDto.name}</p>
                  <p><strong>Party ID:</strong> {selectedReturn.partyResponseDto.partyId}</p>
                  <p><strong>GSTIN:</strong> {selectedReturn.partyResponseDto.gstin || "—"}</p>
                  <p><strong>GST Type:</strong> {selectedReturn.partyResponseDto.gstType?.replace(/_/g, " ")}</p>
                  <p><strong>Phone:</strong> {selectedReturn.partyResponseDto.phoneNo || "—"}</p>
                  <p><strong>Email:</strong> {selectedReturn.partyResponseDto.emailId || "—"}</p>
                  <p><strong>State:</strong> {selectedReturn.partyResponseDto.state?.replace(/_/g, " ")}</p>
                  <p><strong>Billing Address:</strong> {selectedReturn.partyResponseDto.billingAddress || "—"}</p>
                  <p><strong>Shipping Address:</strong> {selectedReturn.partyResponseDto.shipingAddress || "—"}</p>
                </div>
              </section>
            )}

            {/* ITEMS */}
            <section className={styles["card-section"]}>
              <h4>Returned Items</h4>
              {selectedReturn.purchaseReturnItemResponses?.length > 0 ? (
                <table className={styles["items-table"]}>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Qty</th>
                      <th>Unit</th>
                      <th>Rate</th>
                      <th>Tax Type</th>
                      <th>Tax Rate</th>
                      <th>Discount</th>
                      <th>Tax</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedReturn.purchaseReturnItemResponses.map((it, i) => (
                      <tr key={i}>
                        <td>{it.name}</td>
                        <td>{it.quantity}</td>
                        <td>{it.unit}</td>
                        <td>₹{it.ratePerUnit?.toFixed(2)}</td>
                        <td>{it.taxType}</td>
                        <td>{it.taxRate}</td>
                        <td>₹{it.discountAmount?.toFixed(2)}</td>
                        <td>₹{it.totalTaxAmount?.toFixed(2)}</td>
                        <td>₹{it.totalAmount?.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No items returned</p>
              )}
            </section>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseReturns;
