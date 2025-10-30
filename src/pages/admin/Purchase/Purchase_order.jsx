import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../../../config/apiconfig";
import styles from "./Purchases.module.css";
import { toast } from "react-toastify";

const PurchaseOrderList = () => {
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("eBilling")) || {};
  const token = userData?.accessToken || "";
  const companyId = userData?.selectedCompany?.id || "";

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchPurchaseOrders = async () => {
    if (!token || !companyId) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `${config.BASE_URL}/company/${companyId}/purchase-order/list/according`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setOrders(res.data || []);
    } catch (err) {
      toast.error("Failed to load purchase orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchaseOrders();
  }, [token, companyId]);

  const deleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this purchase order?")) return;

    try {
      await axios.delete(`${config.BASE_URL}/purchase-order/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders((prev) => prev.filter((o) => o.purchaseOrderId !== orderId));
      toast.success("Purchase order deleted successfully");
      setSelectedOrder(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete order");
    }
  };

  const handleEdit = (orderId) => {
    navigate(`/create_purchase_order?edit=${orderId}`);
    setSelectedOrder(null);
  };

  return (
    <div className={styles["company-form-container"]}>
      {/* Header */}
      <div className={styles["form-header"]}>
        <div>
          <h1 className={styles["company-form-title"]}>Purchase Orders</h1>
          <p className={styles["form-subtitle"]}>Manage all your purchase orders</p>
        </div>
        <button
          onClick={() => navigate("/create_purchase_order")}
          className={styles["submit-button"]}
          disabled={loading}
        >
          Create Purchase Order
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className={styles["loading-message"]}>
          <div className={styles.spinner}></div>
          <p>Loading purchase orders...</p>
        </div>
      )}

      {/* Table */}
      {orders.length > 0 ? (
        <div className={styles["table-wrapper"]}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order No</th>
                <th>Purchase Date</th>
                <th>Due Date</th>
                <th>Party Name</th>
                <th>Total Qty</th>
                <th>Total Amount</th>
                <th>Advance</th>
                <th>Balance</th>
                <th>Order Type</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.purchaseOrderId}>
                  <td>{o.orderNo}</td>
                  <td>{new Date(o.purchaseDate).toLocaleDateString()}</td>
                  <td>{new Date(o.dueDate).toLocaleDateString()}</td>
                  <td>{o.partyResponseDto?.name || "—"}</td>
                  <td>{o.totalQuantity}</td>
                  <td>₹{parseFloat(o.totalAmount).toFixed(2)}</td>
                  <td>₹{parseFloat(o.advanceAmount).toFixed(2)}</td>
                  <td
                    style={{
                      color: o.balanceAmount > 0 ? "#e74c3c" : "#27ae60",
                      fontWeight: "500",
                    }}
                  >
                    ₹{parseFloat(o.balanceAmount).toFixed(2)}
                  </td>
                  <td>
                    <span
                      className={`${styles["status-badge"]} ${
                        o.orderType === "CLOSE" ? styles.closed : styles.open
                      }`}
                    >
                      {o.orderType}
                    </span>
                  </td>
                  <td className={styles["actions-cell"]}>
                    <button
                      onClick={() => setSelectedOrder(o)}
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
        <div className={styles["no-data"]}>
          <p>No purchase orders found</p>
          <p className={styles["no-data-subtitle"]}>
            Click "Create Purchase Order" to add your first order.
          </p>
        </div>
      )}

      {/* VIEW MODAL */}
      {selectedOrder && (
        <div className={styles["modal-overlay"]} onClick={() => setSelectedOrder(null)}>
          <div className={styles["detail-card"]} onClick={(e) => e.stopPropagation()}>
            <div className={styles["card-header"]}>
              <div>
                <h3>Purchase Order #{selectedOrder.purchaseOrderId}</h3>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <div
                    className={`${styles["balance-badge"]} ${
                      selectedOrder.balanceAmount <= 0 ? styles.paid : ""
                    }`}
                  >
                    {selectedOrder.balanceAmount > 0 ? "Warning" : "Check"} Balance: ₹
                    {parseFloat(selectedOrder.balanceAmount).toFixed(2)}
                  </div>
                  <div
                    className={`${styles["status-badge"]} ${
                      selectedOrder.orderType === "CLOSE" ? styles.closed : styles.open
                    }`}
                    style={{ fontSize: "0.8rem", padding: "4px 8px" }}
                  >
                    {selectedOrder.orderType}
                  </div>
                </div>
              </div>
              <div>
                {/* EDIT BUTTON: Hidden if orderType === "CLOSE" */}
                {selectedOrder.orderType !== "CLOSE" && (
                  <button
                    onClick={() => handleEdit(selectedOrder.purchaseOrderId)}
                    className={`${styles["action-button"]} ${styles["edit-button"]}`}
                    title="Edit order"
                  >
                    Edit
                  </button>
                )}

                <button
                  onClick={() => deleteOrder(selectedOrder.purchaseOrderId)}
                  className={`${styles["action-button"]} ${styles["delete-button"]}`}
                  title="Delete order"
                >
                  Delete
                </button>

                <button
                  className={styles["close-modal-btn"]}
                  onClick={() => setSelectedOrder(null)}
                >
                  Close
                </button>
              </div>
            </div>

            {/* Order Details */}
            <section className={styles["card-section"]}>
              <h4>Order Details</h4>
              <div className={styles["detail-grid"]}>
                <p><strong>Order No:</strong> {selectedOrder.orderNo}</p>
                <p><strong>Purchase Date:</strong> {new Date(selectedOrder.purchaseDate).toLocaleDateString()}</p>
                <p><strong>Due Date:</strong> {new Date(selectedOrder.dueDate).toLocaleDateString()}</p>
                <p><strong>Order Type:</strong>
                  <span
                    className={`${styles["status-badge"]} ${
                      selectedOrder.orderType === "CLOSE" ? styles.closed : styles.open
                    }`}
                  >
                    {selectedOrder.orderType}
                  </span>
                </p>
                <p><strong>State of Supply:</strong> {selectedOrder.stateOfSupply?.replace(/_/g, " ")}</p>
                <p><strong>Payment Type:</strong> {selectedOrder.paymentType}</p>
                <p><strong>Description:</strong> {selectedOrder.description || "—"}</p>
                <p><strong>Total Quantity:</strong> {selectedOrder.totalQuantity}</p>
                <p><strong>Total Discount:</strong> ₹{selectedOrder.totalDiscount}</p>
                <p><strong>Tax Amount:</strong> ₹{selectedOrder.totalTaxAmount}</p>
                <p><strong>Total Amount:</strong> ₹{selectedOrder.totalAmount}</p>
                <p><strong>Advance Paid:</strong> ₹{selectedOrder.advanceAmount}</p>
                <p><strong>Balance:</strong>
                  <strong style={{ color: selectedOrder.balanceAmount > 0 ? "#e74c3c" : "#27ae60" }}>
                    ₹{parseFloat(selectedOrder.balanceAmount).toFixed(2)}
                  </strong>
                </p>
              </div>
            </section>

            {/* Party */}
            {selectedOrder.partyResponseDto && (
              <section className={styles["card-section"]}>
                <h4>Party Details</h4>
                <div className={styles["detail-grid"]}>
                  <p><strong>Name:</strong> {selectedOrder.partyResponseDto.name}</p>
                  <p><strong>Party ID:</strong> {selectedOrder.partyResponseDto.partyId}</p>
                  <p><strong>GSTIN:</strong> {selectedOrder.partyResponseDto.gstin || "—"}</p>
                  <p><strong>GST Type:</strong> {selectedOrder.partyResponseDto.gstType?.replace(/_/g, " ")}</p>
                  <p><strong>Phone:</strong> {selectedOrder.partyResponseDto.phoneNo || "—"}</p>
                  <p><strong>Email:</strong> {selectedOrder.partyResponseDto.emailId || "—"}</p>
                  <p><strong>State:</strong> {selectedOrder.partyResponseDto.state?.replace(/_/g, " ")}</p>
                  <p><strong>Billing Address:</strong> {selectedOrder.partyResponseDto.billingAddress || "—"}</p>
                  <p><strong>Shipping Address:</strong> {selectedOrder.partyResponseDto.shipingAddress || "—"}</p>
                </div>
              </section>
            )}

            {/* Items */}
            <section className={styles["card-section"]}>
              <h4>Items</h4>
              {selectedOrder.purchaseOrderItemResponseList?.length > 0 ? (
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
                    {selectedOrder.purchaseOrderItemResponseList.map((it, i) => (
                      <tr key={i}>
                        <td>{it.itemName}</td>
                        <td>{it.quantity}</td>
                        <td>{it.unit}</td>
                        <td>₹{it.perUnitRate}</td>
                        <td>₹{it.discountAmount}</td>
                        <td>{it.taxType}</td>
                        <td>{it.taxRate}</td>
                        <td>₹{it.totalTaxAmount}</td>
                        <td>₹{it.totalAmount}</td>
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

export default PurchaseOrderList;