import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../../../config/apiconfig";
import styles from "./Sales.module.css";
import { toast } from "react-toastify";

const SalesList = () => {
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("eBilling")) || {};
  const token = userData?.accessToken || "";
  const companyId = userData?.selectedCompany?.id || "";

  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedSaleId, setSelectedSaleId] = useState(null);
  const [remainingBalance, setRemainingBalance] = useState(0);

  const [paymentForm, setPaymentForm] = useState({
    receiptNo: "",
    paymentDate: new Date().toISOString().split("T")[0],
    amountPaid: "",
    paymentType: "CASH",
    referenceNumber: "",
    paymentDescription: "",
  });

  const paymentTypes = [
    "CASH", "UPI", "CREDIT_CARD", "DEBIT_CARD",
    "NET_BANKING", "WALLET", "CHEQUE", "OTHER"
  ];

  // Fetch Sales
  const fetchSales = async () => {
    if (!token || !companyId) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `${config.BASE_URL}/company/${companyId}/sales`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setSales(res.data);
      console.log("Fetched sales:", res.data);
    } catch (err) {
      toast.error("Failed to load sales");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, [token, companyId]);

  // Delete Sale
  const deleteSale = async (saleId) => {
    if (!window.confirm("Are you sure you want to delete this sale?")) return;

    try {
      await axios.delete(`${config.BASE_URL}/sale/${saleId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSales((prev) => prev.filter((s) => s.saleId !== saleId));
      toast.success("Sale deleted successfully");
      setSelectedSale(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete sale");
    }
  };

  // Edit Navigation
  const handleEdit = (saleId) => {
    navigate(`/createsale?edit=${saleId}`);
    setSelectedSale(null);
  };

  // Open Payment Modal
  const openPaymentModal = (sale) => {
    setSelectedSaleId(sale.saleId);
    setRemainingBalance(parseFloat(sale.balance) || 0);
    setPaymentForm({
      receiptNo: "",
      paymentDate: new Date().toISOString().split("T")[0],
      amountPaid: "",
      paymentType: "CASH",
      referenceNumber: "",
      paymentDescription: "",
    });
    setShowPaymentModal(true);
  };

  // Add Payment
  const handleAddPayment = async (e) => {
    e.preventDefault();
    if (!selectedSaleId) return;

    const amount = parseFloat(paymentForm.amountPaid);
    if (!paymentForm.paymentDate || !paymentForm.amountPaid || !paymentForm.paymentType) {
      toast.error("Payment Date, Amount, and Type are required");
      return;
    }
    if (isNaN(amount) || amount <= 0) {
      toast.error("Amount must be greater than 0");
      return;
    }
    if (amount > remainingBalance) {
      toast.error(`Payment amount (₹${amount}) exceeds remaining balance (₹${remainingBalance})`);
      return;
    }

    const paymentId = Date.now() * 1000 + Math.floor(Math.random() * 1000);

    const payload = {
      paymentId,
      receiptNo: paymentForm.receiptNo || null,
      paymentDate: paymentForm.paymentDate,
      amountPaid: amount,
      paymentType: paymentForm.paymentType,
      referenceNumber: paymentForm.referenceNumber || null,
      paymentDescription: paymentForm.paymentDescription || null,
    };

    try {
      setLoading(true);
      await axios.post(
        `${config.BASE_URL}/sale/${selectedSaleId}/add-payment`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Payment added successfully!");
      setShowPaymentModal(false);
      fetchSales();
      setSelectedSale(null);
    } catch (err) {
      console.error("Add payment error:", err.response?.data);
      toast.error(err.response?.data?.message || "Failed to add payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles["company-form-container"]}>
      {/* Header */}
      <div className={styles["form-header"]}>
        <div>
          <h1 className={styles["company-form-title"]}>Sales</h1>
          <p className={styles["form-subtitle"]}>Manage all your invoices</p>
        </div>
        <button
          onClick={() => navigate("/createsale")}
          className={styles["submit-button"]}
          disabled={loading}
        >
          Create Sale
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className={styles["loading-message"]}>
          <div className={styles.spinner}></div>
          <p>Loading sales...</p>
        </div>
      )}

      {/* Table */}
      {sales.length > 0 ? (
        <div className={styles["table-wrapper"]}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Invoice Number</th>
                <th>Invoice Date</th>
                <th>Due Date</th>
                <th>Party Name</th> {/* NEW COLUMN */}
                <th>Total Amount</th>
                <th>Received</th>
                <th>Balance</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((s) => (
                <tr key={s.saleId}>
                  <td>{s.invoiceNumber}</td>
                  <td>{new Date(s.invoceDate).toLocaleDateString()}</td>
                  <td>{new Date(s.dueDate).toLocaleDateString()}</td>
                  <td>
                    {s.partyResponseDto?.name || "—"}
                  </td>
                  <td>₹{parseFloat(s.totalAmount).toFixed(2)}</td>
                  <td>₹{parseFloat(s.receivedAmount).toFixed(2)}</td>
                  <td
                    style={{
                      color: s.balance > 0 ? "#e74c3c" : "#27ae60",
                      fontWeight: "500",
                    }}
                  >
                    ₹{parseFloat(s.balance).toFixed(2)}
                  </td>
                  <td className={styles["actions-cell"]}>
                    <button
                      onClick={() => setSelectedSale(s)}
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
          <p>No sales found</p>
          <p className={styles["no-data-subtitle"]}>
            Click "Create Sale" to add your first invoice.
          </p>
        </div>
      )}

      {/* VIEW MODAL WITH ACTIONS */}
      {selectedSale && (
        <div
          className={styles["modal-overlay"]}
          onClick={() => setSelectedSale(null)}
        >
          <div
            className={styles["detail-card"]}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles["card-header"]}>
              <div>
                <h3>Sale #{selectedSale.saleId}</h3>
                <div
                  className={`${styles["balance-badge"]} ${
                    selectedSale.balance <= 0 ? styles.paid : ""
                  }`}
                >
                  {selectedSale.balance > 0 ? "Warning" : "Check"} Balance: ₹
                  {parseFloat(selectedSale.balance).toFixed(2)}
                </div>
              </div>
              <div>
                <button
                  onClick={() => handleEdit(selectedSale.saleId)}
                  className={`${styles["action-button"]} ${styles["edit-button"]}`}
                  title="Edit sale"
                >
                  Edit
                </button>

                {selectedSale.balance > 0 && (
                  <button
                    onClick={() => openPaymentModal(selectedSale)}
                    className={`${styles["action-button"]} ${styles["payment-button"]}`}
                    title="Add Payment"
                  >
                    Add Payment
                  </button>
                )}

                <button
                  onClick={() => deleteSale(selectedSale.saleId)}
                  className={`${styles["action-button"]} ${styles["delete-button"]}`}
                  title="Delete sale"
                >
                  Delete
                </button>

                <button
                  className={styles["close-modal-btn"]}
                  onClick={() => setSelectedSale(null)}
                >
                  Close
                </button>
              </div>
            </div>

            {/* Invoice Details */}
            <section className={styles["card-section"]}>
              <h4>Invoice Details</h4>
              <div className={styles["detail-grid"]}>
                <p><strong>Invoice Number:</strong> {selectedSale.invoiceNumber || "—"}</p>
                <p><strong>Invoice Date:</strong> {new Date(selectedSale.invoceDate).toLocaleDateString()}</p>
                <p><strong>Due Date:</strong> {new Date(selectedSale.dueDate).toLocaleDateString()}</p>
                <p><strong>Sale Type:</strong> {selectedSale.saleType}</p>
                <p><strong>State of Supply:</strong> {selectedSale.stateOfSupply?.replace(/_/g, " ")}</p>
                <p><strong>Payment Type:</strong> {selectedSale.paymentType}</p>
                <p><strong>Payment Description:</strong> {selectedSale.paymentDescription || "—"}</p>
                <p><strong>Billing Address:</strong> {selectedSale.billingAddress || "—"}</p>
                <p><strong>Shipping Address:</strong> {selectedSale.shippingAddress || "—"}</p>
                <p><strong>Total (ex-tax):</strong> ₹{selectedSale.totalAmountWithoutTax}</p>
                <p><strong>Tax Amount:</strong> ₹{selectedSale.totalTaxAmount}</p>
                <p><strong>Delivery Charges:</strong> ₹{selectedSale.deliveryCharges}</p>
                <p><strong>Total Amount:</strong> ₹{selectedSale.totalAmount}</p>
                <p><strong>Received:</strong> ₹{selectedSale.receivedAmount}</p>
                <p><strong>Balance:</strong> <strong style={{ color: selectedSale.balance > 0 ? "#e74c3c" : "#27ae60" }}>
                  ₹{parseFloat(selectedSale.balance).toFixed(2)}
                </strong></p>
                <p><strong>Paid:</strong> {selectedSale.paid ? "Yes" : "No"}</p>
                <p><strong>Overdue:</strong> {selectedSale.overdue ? "Yes" : "No"}</p>
              </div>
            </section>

            {/* Party */}
            {selectedSale.partyResponseDto && (
              <section className={styles["card-section"]}>
                <h4>Party Details</h4>
                <div className={styles["detail-grid"]}>
                  <p><strong>Name:</strong> {selectedSale.partyResponseDto.name}</p>
                  <p><strong>Party ID:</strong> {selectedSale.partyResponseDto.partyId}</p>
                  <p><strong>GSTIN:</strong> {selectedSale.partyResponseDto.gstin || "—"}</p>
                  <p><strong>GST Type:</strong> {selectedSale.partyResponseDto.gstType?.replace(/_/g, " ")}</p>
                  <p><strong>Phone:</strong> {selectedSale.partyResponseDto.phoneNo || "—"}</p>
                  <p><strong>Email:</strong> {selectedSale.partyResponseDto.emailId || "—"}</p>
                  <p><strong>State:</strong> {selectedSale.partyResponseDto.state?.replace(/_/g, " ")}</p>
                  <p><strong>Billing Address:</strong> {selectedSale.partyResponseDto.billingAddress || "—"}</p>
                  <p><strong>Shipping Address:</strong> {selectedSale.partyResponseDto.shipingAddress || "—"}</p>
                </div>
              </section>
            )}

            {/* Items */}
            <section className={styles["card-section"]}>
              <h4>Items</h4>
              {selectedSale.saleItemResponses?.length > 0 ? (
                <table className={styles["items-table"]}>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>HSN</th>
                      <th>Desc</th>
                      <th>Qty</th>
                      <th>Unit</th>
                      <th>Price/Unit</th>
                      <th>Tax Type</th>
                      <th>Tax Rate</th>
                      <th>Tax</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedSale.saleItemResponses.map((it, i) => (
                      <tr key={i}>
                        <td>{it.itemName}</td>
                        <td>{it.itemHsnCode}</td>
                        <td>{it.itemDescription || "—"}</td>
                        <td>{it.quantity}</td>
                        <td>{it.unit}</td>
                        <td>₹{it.pricePerUnit}</td>
                        <td>{it.pricePerUnitTaxType}</td>
                        <td>{it.taxRate}</td>
                        <td>₹{it.taxAmount}</td>
                        <td>₹{it.totalAmount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No items</p>
              )}
            </section>

            {/* Payments */}
            <section className={styles["card-section"]}>
              <h4>Payments</h4>
              {selectedSale.salePaymentResponses?.length > 0 ? (
                <ul className={styles["payment-list"]}>
                  {selectedSale.salePaymentResponses.map((p, i) => (
                    <li key={i}>
                      <strong>₹{p.amountPaid}</strong> on{" "}
                      {new Date(p.paymentDate).toLocaleDateString()} – {p.paymentType}
                      <br />
                      <small>
                        Ref: {p.referenceNumber || "—"} | Receipt: {p.receiptNo || "—"}
                        {p.paymentDescription && ` | ${p.paymentDescription}`}
                      </small>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No payments recorded</p>
              )}
            </section>
          </div>
        </div>
      )}

      {/* ADD PAYMENT MODAL */}
      {showPaymentModal && (
        <div
          className={styles["modal-overlay"]}
          onClick={() => setShowPaymentModal(false)}
        >
          <div
            className={styles["payment-modal"]}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles["modal-header"]}>
              <h3>Add Payment for Sale #{selectedSaleId}</h3>
              <button
                className={styles["close-modal-btn"]}
                onClick={() => setShowPaymentModal(false)}
              >
                Close
              </button>
            </div>

            <form onSubmit={handleAddPayment} className={styles["payment-form"]}>
              <div className={styles["form-row"]}>
                <div className={styles["form-group"]}>
                  <label>Receipt No</label>
                  <input
                    type="text"
                    value={paymentForm.receiptNo}
                    onChange={(e) =>
                      setPaymentForm({ ...paymentForm, receiptNo: e.target.value })
                    }
                    className={styles["form-input"]}
                    placeholder="Optional"
                  />
                </div>

                <div className={styles["form-group"]}>
                  <label>Payment Date <span className={styles.required}>*</span></label>
                  <input
                    type="date"
                    value={paymentForm.paymentDate}
                    onChange={(e) =>
                      setPaymentForm({ ...paymentForm, paymentDate: e.target.value })
                    }
                    required
                    className={styles["form-input"]}
                  />
                </div>
              </div>

              <div className={styles["form-row"]}>
                <div className={styles["form-group"]}>
                  <label>Amount Paid <span className={styles.required}>*</span></label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={paymentForm.amountPaid}
                    onChange={(e) =>
                      setPaymentForm({ ...paymentForm, amountPaid: e.target.value })
                    }
                    required
                    className={styles["form-input"]}
                    placeholder={`Max: ₹${remainingBalance.toFixed(2)}`}
                  />
                  <small style={{ color: "#27ae60", marginTop: "4px", display: "block" }}>
                    Remaining Balance: ₹{remainingBalance.toFixed(2)}
                  </small>
                </div>

                <div className={styles["form-group"]}>
                  <label>Payment Type <span className={styles.required}>*</span></label>
                  <select
                    value={paymentForm.paymentType}
                    onChange={(e) =>
                      setPaymentForm({ ...paymentForm, paymentType: e.target.value })
                    }
                    required
                    className={styles["form-input"]}
                  >
                    {paymentTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles["form-row"]}>
                <div className={styles["form-group"]}>
                  <label>Reference Number</label>
                  <input
                    type="text"
                    value={paymentForm.referenceNumber}
                    onChange={(e) =>
                      setPaymentForm({ ...paymentForm, referenceNumber: e.target.value })
                    }
                    className={styles["form-input"]}
                    placeholder="UPI ID, Cheque #, etc."
                  />
                </div>

                <div className={styles["form-group"]}>
                  <label>Description</label>
                  <textarea
                    value={paymentForm.paymentDescription}
                    onChange={(e) =>
                      setPaymentForm({ ...paymentForm, paymentDescription: e.target.value })
                    }
                    className={`${styles["form-input"]} ${styles.textarea}`}
                    placeholder="Optional notes"
                  />
                </div>
              </div>

              <div className={styles["form-actions"]}>
                <button
                  type="submit"
                  className={styles["submit-button"]}
                  disabled={loading}
                >
                  {loading ? "Adding..." : "Add Payment"}
                </button>
                <button
                  type="button"
                  className={styles["cancel-button"]}
                  onClick={() => setShowPaymentModal(false)}
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesList;