// // src/pages/purchases/PurchasesList.jsx
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import config from "../../../config/apiconfig";
// import styles from "./Purchases.module.css";   // <-- create a copy of Sales.module.css
// import { toast } from "react-toastify";

// const PurchasesList = () => {
//   const navigate = useNavigate();
//   const userData = JSON.parse(localStorage.getItem("eBilling")) || {};
//   const token = userData?.accessToken || "";
//   const companyId = userData?.selectedCompany?.id || "";

//   /* ----------------------- STATE ----------------------- */
//   const [purchases, setPurchases] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedPurchase, setSelectedPurchase] = useState(null);
//   const [showPaymentModal, setShowPaymentModal] = useState(false);
//   const [selectedPurchaseId, setSelectedPurchaseId] = useState(null);
//   const [remainingBalance, setRemainingBalance] = useState(0);

//   const [paymentForm, setPaymentForm] = useState({
//     receiptNo: "",
//     paymentDate: new Date().toISOString().split("T")[0],
//     amountPaid: "",
//     paymentType: "CASH",
//     referenceNumber: "",
//     paymentDescription: "",
//   });

//   const paymentTypes = [
//     "CASH",
//     "UPI",
//     "CREDIT_CARD",
//     "DEBIT_CARD",
//     "NET_BANKING",
//     "WALLET",
//     "CHEQUE",
//     "OTHER",
//   ];

//   /* ----------------------- FETCH PURCHASES ----------------------- */
//   const fetchPurchases = async () => {
//     if (!token || !companyId) return;
//     setLoading(true);
//     try {
//       const res = await axios.get(
//         `${config.BASE_URL}/company/${companyId}/purchases`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       setPurchases(res.data);
//     } catch (err) {
//       toast.error("Failed to load purchases");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPurchases();
//   }, [token, companyId]);

//   /* ----------------------- DELETE ----------------------- */
//   const deletePurchase = async (purchaseId) => {
//     if (!window.confirm("Are you sure you want to delete this purchase?")) return;

//     try {
//       await axios.delete(`${config.BASE_URL}/purchase/${purchaseId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setPurchases((prev) => prev.filter((p) => p.purchaseId !== purchaseId));
//       toast.success("Purchase deleted successfully");
//       setSelectedPurchase(null);
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to delete purchase");
//     }
//   };

//   /* ----------------------- EDIT NAV ----------------------- */
//   const handleEdit = (purchaseId) => {
//     navigate(`/createpurchase?edit=${purchaseId}`);
//     setSelectedPurchase(null);
//   };

//   /* ----------------------- PAYMENT MODAL ----------------------- */
//   const openPaymentModal = (purchase) => {
//     setSelectedPurchaseId(purchase.purchaseId);
//     setRemainingBalance(parseFloat(purchase.balance) || 0);
//     setPaymentForm({
//       receiptNo: "",
//       paymentDate: new Date().toISOString().split("T")[0],
//       amountPaid: "",
//       paymentType: "CASH",
//       referenceNumber: "",
//       paymentDescription: "",
//     });
//     setShowPaymentModal(true);
//   };

//   const handleAddPayment = async (e) => {
//     e.preventDefault();
//     if (!selectedPurchaseId) return;

//     const amount = parseFloat(paymentForm.amountPaid);
//     if (!paymentForm.paymentDate || !paymentForm.amountPaid || !paymentForm.paymentType) {
//       toast.error("Payment Date, Amount, and Type are required");
//       return;
//     }
//     if (isNaN(amount) || amount <= 0) {
//       toast.error("Amount must be greater than 0");
//       return;
//     }
//     if (amount > remainingBalance) {
//       toast.error(
//         `Payment amount (₹${amount}) exceeds remaining balance (₹${remainingBalance})`
//       );
//       return;
//     }

//     const paymentId = Date.now() * 1000 + Math.floor(Math.random() * 1000);
//     const payload = {
//       paymentId,
//       receiptNo: paymentForm.receiptNo || null,
//       paymentDate: paymentForm.paymentDate,
//       amountPaid: amount,
//       paymentType: paymentForm.paymentType,
//       referenceNumber: paymentForm.referenceNumber || null,
//       paymentDescription: paymentForm.paymentDescription || null,
//     };

//     try {
//       setLoading(true);
//       await axios.post(
//         `${config.BASE_URL}/purchase/${selectedPurchaseId}/add-payment`,
//         payload,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       toast.success("Payment added successfully!");
//       setShowPaymentModal(false);
//       fetchPurchases();
//       setSelectedPurchase(null);
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to add payment");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ----------------------- RENDER ----------------------- */
//   return (
//     <div className={styles["company-form-container"]}>
//       {/* ---------- Header ---------- */}
//       <div className={styles["form-header"]}>
//         <div>
//           <h1 className={styles["company-form-title"]}>Purchases</h1>
//           <p className={styles["form-subtitle"]}>Manage all your purchase bills</p>
//         </div>
//         <button
//           onClick={() => navigate("/createpurchase")}
//           className={styles["submit-button"]}
//           disabled={loading}
//         >
//           Create Purchase
//         </button>
//       </div>

//       {/* ---------- Loading ---------- */}
//       {loading && (
//         <div className={styles["loading-message"]}>
//           <div className={styles.spinner}></div>
//           <p>Loading purchases...</p>
//         </div>
//       )}

//       {/* ---------- Table ---------- */}
//       {purchases.length > 0 ? (
//         <div className={styles["table-wrapper"]}>
//           <table className={styles.table}>
//             <thead>
//               <tr>
//                 <th>Bill Number</th>
//                 <th>Bill Date</th>
//                 <th>Due Date</th>
//                 <th>Party Name</th>
//                 <th>Total Amount</th>
//                 <th>Paid</th>
//                 <th>Balance</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {purchases.map((p) => (
//                 <tr key={p.purchaseId}>
//                   <td>{p.billNumber}</td>
//                   <td>{new Date(p.billDate).toLocaleDateString()}</td>
//                   <td>{new Date(p.dueDate).toLocaleDateString()}</td>
//                   <td>{p.partyResponseDto?.name || "—"}</td>
//                   <td>₹{parseFloat(p.totalAmount).toFixed(2)}</td>
//                   <td>₹{parseFloat(p.sendAmount).toFixed(2)}</td>
//                   <td
//                     style={{
//                       color: p.balance > 0 ? "#e74c3c" : "#27ae60",
//                       fontWeight: "500",
//                     }}
//                   >
//                     ₹{parseFloat(p.balance).toFixed(2)}
//                   </td>
//                   <td className={styles["actions-cell"]}>
//                     <button
//                       onClick={() => setSelectedPurchase(p)}
//                       className={`${styles["action-button"]} ${styles["view-button"]}`}
//                       title="View details"
//                     >
//                       View
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       ) : (
//         <div className={styles["no-data"]}>
//           <p>No purchases found</p>
//           <p className={styles["no-data-subtitle"]}>
//             Click "Create Purchase" to add your first bill.
//           </p>
//         </div>
//       )}

//       {/* ---------- VIEW MODAL ---------- */}
//       {selectedPurchase && (
//         <div
//           className={styles["modal-overlay"]}
//           onClick={() => setSelectedPurchase(null)}
//         >
//           <div
//             className={styles["detail-card"]}
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className={styles["card-header"]}>
//               <div>
//                 <h3>Purchase #{selectedPurchase.purchaseId}</h3>
//                 <div
//                   className={`${styles["balance-badge"]} ${
//                     selectedPurchase.balance <= 0 ? styles.paid : ""
//                   }`}
//                 >
//                   {selectedPurchase.balance > 0 ? "Warning" : "Check"} Balance: ₹
//                   {parseFloat(selectedPurchase.balance).toFixed(2)}
//                 </div>
//               </div>
//               <div>
//                 <button
//                   onClick={() => handleEdit(selectedPurchase.purchaseId)}
//                   className={`${styles["action-button"]} ${styles["edit-button"]}`}
//                   title="Edit purchase"
//                 >
//                   Edit
//                 </button>

//                 {selectedPurchase.balance > 0 && (
//                   <button
//                     onClick={() => openPaymentModal(selectedPurchase)}
//                     className={`${styles["action-button"]} ${styles["payment-button"]}`}
//                     title="Add Payment"
//                   >
//                     Add Payment
//                   </button>
//                 )}

//                 <button
//                   onClick={() => deletePurchase(selectedPurchase.purchaseId)}
//                   className={`${styles["action-button"]} ${styles["delete-button"]}`}
//                   title="Delete purchase"
//                 >
//                   Delete
//                 </button>

//                 <button
//                   className={styles["close-modal-btn"]}
//                   onClick={() => setSelectedPurchase(null)}
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>

//             {/* ---------- Purchase Details ---------- */}
//             <section className={styles["card-section"]}>
//               <h4>Purchase Details</h4>
//               <div className={styles["detail-grid"]}>
//                 <p><strong>Bill Number:</strong> {selectedPurchase.billNumber}</p>
//                 <p><strong>Bill Date:</strong> {new Date(selectedPurchase.billDate).toLocaleDateString()}</p>
//                 <p><strong>Due Date:</strong> {new Date(selectedPurchase.dueDate).toLocaleDateString()}</p>
//                 <p><strong>State of Supply:</strong> {selectedPurchase.stateOfSupply?.replace(/_/g, " ")}</p>
//                 <p><strong>Payment Type:</strong> {selectedPurchase.paymentType}</p>
//                 <p><strong>Payment Description:</strong> {selectedPurchase.paymentDescription || "—"}</p>
//                 <p><strong>Total (ex-tax):</strong> ₹{selectedPurchase.totalAmountWithoutTax}</p>
//                 <p><strong>Tax Amount:</strong> ₹{selectedPurchase.totalTaxAmount}</p>
//                 <p><strong>Delivery Charges:</strong> ₹{selectedPurchase.deliveryCharges}</p>
//                 <p><strong>Total Amount:</strong> ₹{selectedPurchase.totalAmount}</p>
//                 <p><strong>Paid:</strong> ₹{selectedPurchase.sendAmount}</p>
//                 <p><strong>Balance:</strong>
//                   <strong style={{ color: selectedPurchase.balance > 0 ? "#e74c3c" : "#27ae60" }}>
//                     ₹{parseFloat(selectedPurchase.balance).toFixed(2)}
//                   </strong>
//                 </p>
//                 <p><strong>Paid Fully:</strong> {selectedPurchase.isPaid ? "Yes" : "No"}</p>
//                 <p><strong>Overdue:</strong> {selectedPurchase.overdue ? "Yes" : "No"}</p>
//               </div>
//             </section>

//             {/* ---------- Party ---------- */}
//             {selectedPurchase.partyResponseDto && (
//               <section className={styles["card-section"]}>
//                 <h4>Party Details</h4>
//                 <div className={styles["detail-grid"]}>
//                   <p><strong>Name:</strong> {selectedPurchase.partyResponseDto.name}</p>
//                   <p><strong>Party ID:</strong> {selectedPurchase.partyResponseDto.partyId}</p>
//                   <p><strong>GSTIN:</strong> {selectedPurchase.partyResponseDto.gstin || "—"}</p>
//                   <p><strong>GST Type:</strong> {selectedPurchase.partyResponseDto.gstType?.replace(/_/g, " ")}</p>
//                   <p><strong>Phone:</strong> {selectedPurchase.partyResponseDto.phoneNo || "—"}</p>
//                   <p><strong>Email:</strong> {selectedPurchase.partyResponseDto.emailId || "—"}</p>
//                   <p><strong>State:</strong> {selectedPurchase.partyResponseDto.state?.replace(/_/g, " ")}</p>
//                   <p><strong>Billing Address:</strong> {selectedPurchase.partyResponseDto.billingAddress || "—"}</p>
//                   <p><strong>Shipping Address:</strong> {selectedPurchase.partyResponseDto.shipingAddress || "—"}</p>
//                 </div>
//               </section>
//             )}

//             {/* ---------- Items ---------- */}
//             <section className={styles["card-section"]}>
//               <h4>Items</h4>
//               {selectedPurchase.purchaseItemResponses?.length > 0 ? (
//                 <table className={styles["items-table"]}>
//                   <thead>
//                     <tr>
//                       <th>Name</th>
//                       <th>HSN</th>
//                       <th>Desc</th>
//                       <th>Qty</th>
//                       <th>Unit</th>
//                       <th>Price/Unit</th>
//                       <th>Tax Type</th>
//                       <th>Tax Rate</th>
//                       <th>Tax</th>
//                       <th>Total</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {selectedPurchase.purchaseItemResponses.map((it, i) => (
//                       <tr key={i}>
//                         <td>{it.itemName}</td>
//                         <td>{it.itemHsnCode}</td>
//                         <td>{it.itemDescription || "—"}</td>
//                         <td>{it.quantity}</td>
//                         <td>{it.unit}</td>
//                         <td>₹{it.pricePerUnit}</td>
//                         <td>{it.pricePerUnitTaxType}</td>
//                         <td>{it.taxRate}</td>
//                         <td>₹{it.totalTaxAmount}</td>
//                         <td>₹{it.totalAmount}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               ) : (
//                 <p>No items</p>
//               )}
//             </section>

//             {/* ---------- Payments ---------- */}
//             <section className={styles["card-section"]}>
//               <h4>Payments</h4>
//               {selectedPurchase.purchasePaymentResponses?.length > 0 ? (
//                 <ul className={styles["payment-list"]}>
//                   {selectedPurchase.purchasePaymentResponses.map((p, i) => (
//                     <li key={i}>
//                       <strong>₹{p.amountPaid}</strong> on{" "}
//                       {new Date(p.paymentDate).toLocaleDateString()} – {p.paymentType}
//                       <br />
//                       <small>
//                         Ref: {p.referenceNumber || "—"} | Receipt: {p.receiptNo || "—"}
//                         {p.paymentDescription && ` | ${p.paymentDescription}`}
//                       </small>
//                     </li>
//                   ))}
//                 </ul>
//               ) : (
//                 <p>No payments recorded</p>
//               )}
//             </section>
//           </div>
//         </div>
//       )}

//       {/* ---------- ADD PAYMENT MODAL ---------- */}
//       {showPaymentModal && (
//         <div
//           className={styles["modal-overlay"]}
//           onClick={() => setShowPaymentModal(false)}
//         >
//           <div
//             className={styles["payment-modal"]}
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className={styles["modal-header"]}>
//               <h3>Add Payment for Purchase #{selectedPurchaseId}</h3>
//               <button
//                 className={styles["close-modal-btn"]}
//                 onClick={() => setShowPaymentModal(false)}
//               >
//                 Close
//               </button>
//             </div>

//             <form onSubmit={handleAddPayment} className={styles["payment-form"]}>
//               <div className={styles["form-row"]}>
//                 <div className={styles["form-group"]}>
//                   <label>Receipt No</label>
//                   <input
//                     type="text"
//                     value={paymentForm.receiptNo}
//                     onChange={(e) =>
//                       setPaymentForm({ ...paymentForm, receiptNo: e.target.value })
//                     }
//                     className={styles["form-input"]}
//                     placeholder="Optional"
//                   />
//                 </div>

//                 <div className={styles["form-group"]}>
//                   <label>Payment Date <span className={styles.required}>*</span></label>
//                   <input
//                     type="date"
//                     value={paymentForm.paymentDate}
//                     onChange={(e) =>
//                       setPaymentForm({ ...paymentForm, paymentDate: e.target.value })
//                     }
//                     required
//                     className={styles["form-input"]}
//                   />
//                 </div>
//               </div>

//               <div className={styles["form-row"]}>
//                 <div className={styles["form-group"]}>
//                   <label>Amount Paid <span className={styles.required}>*</span></label>
//                   <input
//                     type="number"
//                     step="0.01"
//                     min="0"
//                     value={paymentForm.amountPaid}
//                     onChange={(e) =>
//                       setPaymentForm({ ...paymentForm, amountPaid: e.target.value })
//                     }
//                     required
//                     className={styles["form-input"]}
//                     placeholder={`Max: ₹${remainingBalance.toFixed(2)}`}
//                   />
//                   <small style={{ color: "#27ae60", marginTop: "4px", display: "block" }}>
//                     Remaining Balance: ₹{remainingBalance.toFixed(2)}
//                   </small>
//                 </div>

//                 <div className={styles["form-group"]}>
//                   <label>Payment Type <span className={styles.required}>*</span></label>
//                   <select
//                     value={paymentForm.paymentType}
//                     onChange={(e) =>
//                       setPaymentForm({ ...paymentForm, paymentType: e.target.value })
//                     }
//                     required
//                     className={styles["form-input"]}
//                   >
//                     {paymentTypes.map((type) => (
//                       <option key={type} value={type}>
//                         {type}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               <div className={styles["form-row"]}>
//                 <div className={styles["form-group"]}>
//                   <label>Reference Number</label>
//                   <input
//                     type="text"
//                     value={paymentForm.referenceNumber}
//                     onChange={(e) =>
//                       setPaymentForm({ ...paymentForm, referenceNumber: e.target.value })
//                     }
//                     className={styles["form-input"]}
//                     placeholder="UPI ID, Cheque #, etc."
//                   />
//                 </div>

//                 <div className={styles["form-group"]}>
//                   <label>Description</label>
//                   <textarea
//                     value={paymentForm.paymentDescription}
//                     onChange={(e) =>
//                       setPaymentForm({ ...paymentForm, paymentDescription: e.target.value })
//                     }
//                     className={`${styles["form-input"]} ${styles.textarea}`}
//                     placeholder="Optional notes"
//                   />
//                 </div>
//               </div>

//               <div className={styles["form-actions"]}>
//                 <button
//                   type="submit"
//                   className={styles["submit-button"]}
//                   disabled={loading}
//                 >
//                   {loading ? "Adding..." : "Add Payment"}
//                 </button>
//                 <button
//                   type="button"
//                   className={styles["cancel-button"]}
//                   onClick={() => setShowPaymentModal(false)}
//                   disabled={loading}
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PurchasesList;








import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../../../config/apiconfig";
import styles from "./Purchases.module.css"; // or use Sales.module.css
import { toast } from "react-toastify";

const PurchasesList = () => {
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("eBilling")) || {};
  const token = userData?.accessToken || "";
  const companyId = userData?.selectedCompany?.id || "";

  /* ----------------------- STATE ----------------------- */
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPurchaseId, setSelectedPurchaseId] = useState(null);
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
    "CASH",
    "UPI",
    "CREDIT_CARD",
    "DEBIT_CARD",
    "NET_BANKING",
    "WALLET",
    "CHEQUE",
    "OTHER",
  ];

  /* ----------------------- FETCH PURCHASES ----------------------- */
  const fetchPurchases = async () => {
    if (!token || !companyId) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `${config.BASE_URL}/company/${companyId}/purchases`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setPurchases(res.data);
    } catch (err) {
      toast.error("Failed to load purchases");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, [token, companyId]);

  /* ----------------------- DELETE ----------------------- */
  const deletePurchase = async (purchaseId) => {
    if (!window.confirm("Are you sure you want to delete this purchase?")) return;

    try {
      await axios.delete(`${config.BASE_URL}/purchase/${purchaseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPurchases((prev) => prev.filter((p) => p.purchaseId !== purchaseId));
      toast.success("Purchase deleted successfully");
      setSelectedPurchase(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete purchase");
    }
  };

  /* ----------------------- EDIT NAV ----------------------- */
  const handleEdit = (purchaseId) => {
    navigate(`/createpurchase?edit=${purchaseId}`);
    setSelectedPurchase(null);
  };

  /* ----------------------- PAYMENT MODAL ----------------------- */
  const openPaymentModal = (purchase) => {
    setSelectedPurchaseId(purchase.purchaseId);
    setRemainingBalance(parseFloat(purchase.balance) || 0);
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

  // CORRECT ENDPOINT: /purchase/{purchaseId}/make-payment
  const handleAddPayment = async (e) => {
    e.preventDefault();
    if (!selectedPurchaseId) return;

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
      toast.error(
        `Payment amount (₹${amount}) exceeds remaining balance (₹${remainingBalance})`
      );
      return;
    }

    const payload = {
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
        `${config.BASE_URL}/purchase/${selectedPurchaseId}/make-payment`,
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
      fetchPurchases();
      setSelectedPurchase(null);
    } catch (err) {
      console.error("Make payment error:", err.response?.data);
      toast.error(err.response?.data?.message || "Failed to add payment");
    } finally {
      setLoading(false);
    }
  };

  /* ----------------------- RENDER ----------------------- */
  return (
    <div className={styles["company-form-container"]}>
      {/* ---------- Header ---------- */}
      <div className={styles["form-header"]}>
        <div>
          <h1 className={styles["company-form-title"]}>Purchases</h1>
          <p className={styles["form-subtitle"]}>Manage all your purchase bills</p>
        </div>
        <button
          onClick={() => navigate("/createpurchase")}
          className={styles["submit-button"]}
          disabled={loading}
        >
          Create Purchase
        </button>
      </div>

      {/* ---------- Loading ---------- */}
      {loading && (
        <div className={styles["loading-message"]}>
          <div className={styles.spinner}></div>
          <p>Loading purchases...</p>
        </div>
      )}

      {/* ---------- Table ---------- */}
      {purchases.length > 0 ? (
        <div className={styles["table-wrapper"]}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Bill Number</th>
                <th>Bill Date</th>
                <th>Due Date</th>
                <th>Party Name</th>
                <th>Total Amount</th>
                <th>Paid</th>
                <th>Balance</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((p) => (
                <tr key={p.purchaseId}>
                  <td>{p.billNumber}</td>
                  <td>{new Date(p.billDate).toLocaleDateString()}</td>
                  <td>{new Date(p.dueDate).toLocaleDateString()}</td>
                  <td>{p.partyResponseDto?.name || "—"}</td>
                  <td>₹{parseFloat(p.totalAmount).toFixed(2)}</td>
                  <td>₹{parseFloat(p.sendAmount).toFixed(2)}</td>
                  <td
                    style={{
                      color: p.balance > 0 ? "#e74c3c" : "#27ae60",
                      fontWeight: "500",
                    }}
                  >
                    ₹{parseFloat(p.balance).toFixed(2)}
                  </td>
                  <td className={styles["actions-cell"]}>
                    <button
                      onClick={() => setSelectedPurchase(p)}
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
          <p>No purchases found</p>
          <p className={styles["no-data-subtitle"]}>
            Click "Create Purchase" to add your first bill.
          </p>
        </div>
      )}

      {/* ---------- VIEW MODAL ---------- */}
      {selectedPurchase && (
        <div
          className={styles["modal-overlay"]}
          onClick={() => setSelectedPurchase(null)}
        >
          <div
            className={styles["detail-card"]}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles["card-header"]}>
              <div>
                <h3>Purchase #{selectedPurchase.purchaseId}</h3>
                <div
                  className={`${styles["balance-badge"]} ${
                    selectedPurchase.balance <= 0 ? styles.paid : ""
                  }`}
                >
                  {selectedPurchase.balance > 0 ? "Warning" : "Check"} Balance: ₹
                  {parseFloat(selectedPurchase.balance).toFixed(2)}
                </div>
              </div>
              <div>
                <button
                  onClick={() => handleEdit(selectedPurchase.purchaseId)}
                  className={`${styles["action-button"]} ${styles["edit-button"]}`}
                  title="Edit purchase"
                >
                  Edit
                </button>

                {selectedPurchase.balance > 0 && (
                  <button
                    onClick={() => openPaymentModal(selectedPurchase)}
                    className={`${styles["action-button"]} ${styles["payment-button"]}`}
                    title="Add Payment"
                  >
                    Add Payment
                  </button>
                )}

                <button
                  onClick={() => deletePurchase(selectedPurchase.purchaseId)}
                  className={`${styles["action-button"]} ${styles["delete-button"]}`}
                  title="Delete purchase"
                >
                  Delete
                </button>

                <button
                  className={styles["close-modal-btn"]}
                  onClick={() => setSelectedPurchase(null)}
                >
                  Close
                </button>
              </div>
            </div>

            {/* ---------- Purchase Details ---------- */}
            <section className={styles["card-section"]}>
              <h4>Purchase Details</h4>
              <div className={styles["detail-grid"]}>
                <p><strong>Bill Number:</strong> {selectedPurchase.billNumber}</p>
                <p><strong>Bill Date:</strong> {new Date(selectedPurchase.billDate).toLocaleDateString()}</p>
                <p><strong>Due Date:</strong> {new Date(selectedPurchase.dueDate).toLocaleDateString()}</p>
                <p><strong>State of Supply:</strong> {selectedPurchase.stateOfSupply?.replace(/_/g, " ")}</p>
                <p><strong>Payment Type:</strong> {selectedPurchase.paymentType}</p>
                <p><strong>Payment Description:</strong> {selectedPurchase.paymentDescription || "—"}</p>
                <p><strong>Total (ex-tax):</strong> ₹{selectedPurchase.totalAmountWithoutTax}</p>
                <p><strong>Tax Amount:</strong> ₹{selectedPurchase.totalTaxAmount}</p>
                <p><strong>Delivery Charges:</strong> ₹{selectedPurchase.deliveryCharges}</p>
                <p><strong>Total Amount:</strong> ₹{selectedPurchase.totalAmount}</p>
                <p><strong>Paid:</strong> ₹{selectedPurchase.sendAmount}</p>
                <p><strong>Balance:</strong>
                  <strong style={{ color: selectedPurchase.balance > 0 ? "#e74c3c" : "#27ae60" }}>
                    ₹{parseFloat(selectedPurchase.balance).toFixed(2)}
                  </strong>
                </p>
                <p><strong>Paid Fully:</strong> {selectedPurchase.isPaid ? "Yes" : "No"}</p>
                <p><strong>Overdue:</strong> {selectedPurchase.overdue ? "Yes" : "No"}</p>
              </div>
            </section>

            {/* ---------- Party ---------- */}
            {selectedPurchase.partyResponseDto && (
              <section className={styles["card-section"]}>
                <h4>Party Details</h4>
                <div className={styles["detail-grid"]}>
                  <p><strong>Name:</strong> {selectedPurchase.partyResponseDto.name}</p>
                  <p><strong>Party ID:</strong> {selectedPurchase.partyResponseDto.partyId}</p>
                  <p><strong>GSTIN:</strong> {selectedPurchase.partyResponseDto.gstin || "—"}</p>
                  <p><strong>GST Type:</strong> {selectedPurchase.partyResponseDto.gstType?.replace(/_/g, " ")}</p>
                  <p><strong>Phone:</strong> {selectedPurchase.partyResponseDto.phoneNo || "—"}</p>
                  <p><strong>Email:</strong> {selectedPurchase.partyResponseDto.emailId || "—"}</p>
                  <p><strong>State:</strong> {selectedPurchase.partyResponseDto.state?.replace(/_/g, " ")}</p>
                  <p><strong>Billing Address:</strong> {selectedPurchase.partyResponseDto.billingAddress || "—"}</p>
                  <p><strong>Shipping Address:</strong> {selectedPurchase.partyResponseDto.shipingAddress || "—"}</p>
                </div>
              </section>
            )}

            {/* ---------- Items ---------- */}
            <section className={styles["card-section"]}>
              <h4>Items</h4>
              {selectedPurchase.purchaseItemResponses?.length > 0 ? (
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
                    {selectedPurchase.purchaseItemResponses.map((it, i) => (
                      <tr key={i}>
                        <td>{it.itemName}</td>
                        <td>{it.itemHsnCode}</td>
                        <td>{it.itemDescription || "—"}</td>
                        <td>{it.quantity}</td>
                        <td>{it.unit}</td>
                        <td>₹{it.pricePerUnit}</td>
                        <td>{it.pricePerUnitTaxType}</td>
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

            {/* ---------- Payments ---------- */}
            <section className={styles["card-section"]}>
              <h4>Payments</h4>
              {selectedPurchase.purchasePaymentResponses?.length > 0 ? (
                <ul className={styles["payment-list"]}>
                  {selectedPurchase.purchasePaymentResponses.map((p, i) => (
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

      {/* ---------- ADD PAYMENT MODAL ---------- */}
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
              <h3>Add Payment for Purchase #{selectedPurchaseId}</h3>
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

export default PurchasesList;