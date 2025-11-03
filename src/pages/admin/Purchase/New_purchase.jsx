// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import config from "../../../config/apiconfig";
// import styles from "./Purchases.module.css"; // or use Sales.module.css
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

//   // CORRECT ENDPOINT: /purchase/{purchaseId}/make-payment
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

//     const payload = {
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
//         `${config.BASE_URL}/purchase/${selectedPurchaseId}/make-payment`,
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
//       console.error("Make payment error:", err.response?.data);
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








// src/components/purchases/PurchasesList.jsx
"use client";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../../../config/apiconfig";
import styles from "../Styles/ScreenUI.module.css"; // Re-use same styles as SalesList
import { toast } from "react-toastify";
import {
  Plus,
  Eye,
  Edit2,
  Trash2,
  X,
  DollarSign,
  Package,
  AlertCircle,
  CheckCircle,
  ChevronDown,
  Search,
  Loader,
} from "lucide-react";

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
  const [searchTerm, setSearchTerm] = useState("");

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

  /* ----------------------- FILTER ----------------------- */
  const filteredPurchases = purchases.filter(
    (p) =>
      p.billNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.partyResponseDto?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* ----------------------- RENDER ----------------------- */
  return (
    <div className={styles["company-form-container"]}>
      {/* Header Section */}
      <div className={styles["form-header"]}>
        <div className={styles["header-content"]}>
          <div className={styles["header-text"]}>
            <h1 className={styles["company-form-title"]}>Purchase Bills</h1>
            <p className={styles["form-subtitle"]}>Manage all your purchase bills</p>
          </div>
        </div>
        <button
          onClick={() => navigate("/createpurchase")}
          className={styles["submit-button"]}
          disabled={loading}
        >
          <Plus size={18} />
          <span>Create Purchase</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className={styles["search-container"]}>
        <Search size={18} className={styles["search-icon"]} />
        <input
          type="text"
          placeholder="Search by bill number or party name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles["search-input"]}
        />
      </div>

      {/* Loading State */}
      {loading && (
        <div className={styles["loading-message"]}>
          <Loader size={32} className={styles["spinner"]} />
          <p>Loading purchases...</p>
        </div>
      )}

      {/* Purchases Grid/Table */}
      {filteredPurchases.length > 0 ? (
        <>
          {/* Desktop Table View */}
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
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredPurchases.map((p) => (
                  <tr key={p.purchaseId} className={styles["table-row"]}>
                    <td className={styles["invoice-cell"]}>
                      <span className={styles["invoice-badge"]}>{p.billNumber}</span>
                    </td>
                    <td>{new Date(p.billDate).toLocaleDateString()}</td>
                    <td>{new Date(p.dueDate).toLocaleDateString()}</td>
                    <td>
                      <span className={styles["party-name"]}>{p.partyResponseDto?.name || "—"}</span>
                    </td>
                    <td className={styles["amount-cell"]}>
                      <span className={styles["amount"]}>₹{parseFloat(p.totalAmount).toFixed(2)}</span>
                    </td>
                    <td className={styles["received-cell"]}>₹{parseFloat(p.sendAmount).toFixed(2)}</td>
                    <td className={styles["balance-cell"]}>
                      <span className={p.balance > 0 ? styles["balance-pending"] : styles["balance-paid"]}>
                        ₹{parseFloat(p.balance).toFixed(2)}
                      </span>
                    </td>
                    <td>
                      <span className={p.balance > 0 ? styles["status-pending"] : styles["status-paid"]}>
                        {p.balance > 0 ? "Pending" : "Paid"}
                      </span>
                    </td>
                    <td className={styles["actions-cell"]}>
                      <button
                        onClick={() => setSelectedPurchase(p)}
                        className={`${styles["action-button"]} ${styles["view-button"]}`}
                        title="View details"
                      >
                        <Eye size={16} />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className={styles["mobile-cards-container"]}>
            {filteredPurchases.map((p) => (
              <div key={p.purchaseId} className={styles["invoice-card"]}>
                <div className={styles["card-header-mobile"]}>
                  <div className={styles["card-title-section"]}>
                    <h3 className={styles["card-invoice-number"]}>{p.billNumber}</h3>
                    <span className={p.balance > 0 ? styles["status-badge-pending"] : styles["status-badge-paid"]}>
                      {p.balance > 0 ? "Pending" : "Paid"}
                    </span>
                  </div>
                  <button onClick={() => setSelectedPurchase(p)} className={styles["card-action-button"]}>
                    <ChevronDown size={20} />
                  </button>
                </div>

                <div className={styles["card-body"]}>
                  <div className={styles["card-info-row"]}>
                    <span className={styles["info-label"]}>Party:</span>
                    <span className={styles["info-value"]}>{p.partyResponseDto?.name || "—"}</span>
                  </div>

                  <div className={styles["card-info-row"]}>
                    <span className={styles["info-label"]}>Date:</span>
                    <span className={styles["info-value"]}>{new Date(p.billDate).toLocaleDateString()}</span>
                  </div>

                  <div className={styles["card-info-row"]}>
                    <span className={styles["info-label"]}>Total:</span>
                    <span className={styles["info-value-amount"]}>₹{parseFloat(p.totalAmount).toFixed(2)}</span>
                  </div>

                  <div className={styles["card-info-row"]}>
                    <span className={styles["info-label"]}>Balance:</span>
                    <span className={p.balance > 0 ? styles["info-value-pending"] : styles["info-value-paid"]}>
                      ₹{parseFloat(p.balance).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className={styles["card-footer"]}>
                  <button onClick={() => setSelectedPurchase(p)} className={styles["card-view-button"]}>
                    <Eye size={16} />
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className={styles["no-data"]}>
          <Package size={48} />
          <p>No purchases found</p>
          <p className={styles["no-data-subtitle"]}>
            {searchTerm ? "Try adjusting your search criteria" : 'Click "Create Purchase" to add your first bill.'}
          </p>
        </div>
      )}

      {/* VIEW MODAL WITH ACTIONS */}
      {selectedPurchase && (
        <div className={styles["modal-overlay"]} onClick={() => setSelectedPurchase(null)}>
          <div className={styles["detail-card"]} onClick={(e) => e.stopPropagation()}>
            <div className={styles["card-header"]}>
              <div className={styles["header-title-section"]}>
                <h3>Purchase #{selectedPurchase.purchaseId}</h3>
                <div className={`${styles["balance-badge"]} ${selectedPurchase.balance <= 0 ? styles.paid : ""}`}>
                  {selectedPurchase.balance > 0 ? (
                    <>
                      <AlertCircle size={16} />
                      Balance: ₹{parseFloat(selectedPurchase.balance).toFixed(2)}
                    </>
                  ) : (
                    <>
                      <CheckCircle size={16} />
                      Paid: ₹{parseFloat(selectedPurchase.balance).toFixed(2)}
                    </>
                  )}
                </div>
              </div>
              <div className={styles["header-actions"]}>
                <button
                  onClick={() => handleEdit(selectedPurchase.purchaseId)}
                  className={`${styles["action-button"]} ${styles["edit-button"]}`}
                  title="Edit purchase"
                >
                  <Edit2 size={16} />
                  <span>Edit</span>
                </button>

                {selectedPurchase.balance > 0 && (
                  <button
                    onClick={() => openPaymentModal(selectedPurchase)}
                    className={`${styles["action-button"]} ${styles["payment-button"]}`}
                    title="Add Payment"
                  >
                    <DollarSign size={16} />
                    <span>Add Payment</span>
                  </button>
                )}

                <button
                  onClick={() => deletePurchase(selectedPurchase.purchaseId)}
                  className={`${styles["action-button"]} ${styles["delete-button"]}`}
                  title="Delete purchase"
                >
                  <Trash2 size={16} />
                  <span>Delete</span>
                </button>

                <button className={styles["close-modal-btn"]} onClick={() => setSelectedPurchase(null)} title="Close">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Purchase Details */}
            <section className={styles["card-section"]}>
              <h4 className={styles["section-title"]}>Purchase Details</h4>
              <div className={styles["detail-grid"]}>
                <div className={styles["detail-item"]}>
                  <span className={styles["detail-label"]}>Bill Number:</span>
                  <span className={styles["detail-value"]}>{selectedPurchase.billNumber}</span>
                </div>
                <div className={styles["detail-item"]}>
                  <span className={styles["detail-label"]}>Bill Date:</span>
                  <span className={styles["detail-value"]}>{new Date(selectedPurchase.billDate).toLocaleDateString()}</span>
                </div>
                <div className={styles["detail-item"]}>
                  <span className={styles["detail-label"]}>Due Date:</span>
                  <span className={styles["detail-value"]}>{new Date(selectedPurchase.dueDate).toLocaleDateString()}</span>
                </div>
                <div className={styles["detail-item"]}>
                  <span className={styles["detail-label"]}>State of Supply:</span>
                  <span className={styles["detail-value"]}>{selectedPurchase.stateOfSupply?.replace(/_/g, " ")}</span>
                </div>
                <div className={styles["detail-item"]}>
                  <span className={styles["detail-label"]}>Payment Type:</span>
                  <span className={styles["detail-value"]}>{selectedPurchase.paymentType}</span>
                </div>
                <div className={styles["detail-item"]}>
                  <span className={styles["detail-label"]}>Payment Description:</span>
                  <span className={styles["detail-value"]}>{selectedPurchase.paymentDescription || "—"}</span>
                </div>
              </div>

              <div className={styles["amount-breakdown"]}>
                <div className={styles["breakdown-row"]}>
                  <span>Total (ex-tax):</span>
                  <span>₹{selectedPurchase.totalAmountWithoutTax}</span>
                </div>
                <div className={styles["breakdown-row"]}>
                  <span>Tax Amount:</span>
                  <span>₹{selectedPurchase.totalTaxAmount}</span>
                </div>
                <div className={styles["breakdown-row"]}>
                  <span>Delivery Charges:</span>
                  <span>₹{selectedPurchase.deliveryCharges}</span>
                </div>
                <div className={styles["breakdown-row"]}>
                  <span>Total Amount:</span>
                  <span className={styles["total-amount"]}>₹{selectedPurchase.totalAmount}</span>
                </div>
                <div className={styles["breakdown-row"]}>
                  <span>Paid:</span>
                  <span>₹{selectedPurchase.sendAmount}</span>
                </div>
                <div
                  className={`${styles["breakdown-row"]} ${
                    selectedPurchase.balance > 0 ? styles["balance-row-pending"] : styles["balance-row-paid"]
                  }`}
                >
                  <span>Balance:</span>
                  <span className={styles["balance-amount"]}>
                    ₹{parseFloat(selectedPurchase.balance).toFixed(2)}
                  </span>
                </div>
              </div>
            </section>

            {/* Party */}
            {selectedPurchase.partyResponseDto && (
              <section className={styles["card-section"]}>
                <h4 className={styles["section-title"]}>Party Details</h4>
                <div className={styles["detail-grid"]}>
                  <div className={styles["detail-item"]}>
                    <span className={styles["detail-label"]}>Name:</span>
                    <span className={styles["detail-value"]}>{selectedPurchase.partyResponseDto.name}</span>
                  </div>
                  <div className={styles["detail-item"]}>
                    <span className={styles["detail-label"]}>Party ID:</span>
                    <span className={styles["detail-value"]}>{selectedPurchase.partyResponseDto.partyId}</span>
                  </div>
                  <div className={styles["detail-item"]}>
                    <span className={styles["detail-label"]}>GSTIN:</span>
                    <span className={styles["detail-value"]}>{selectedPurchase.partyResponseDto.gstin || "—"}</span>
                  </div>
                  <div className={styles["detail-item"]}>
                    <span className={styles["detail-label"]}>GST Type:</span>
                    <span className={styles["detail-value"]}>
                      {selectedPurchase.partyResponseDto.gstType?.replace(/_/g, " ")}
                    </span>
                  </div>
                  <div className={styles["detail-item"]}>
                    <span className={styles["detail-label"]}>Phone:</span>
                    <span className={styles["detail-value"]}>{selectedPurchase.partyResponseDto.phoneNo || "—"}</span>
                  </div>
                  <div className={styles["detail-item"]}>
                    <span className={styles["detail-label"]}>Email:</span>
                    <span className={styles["detail-value"]}>{selectedPurchase.partyResponseDto.emailId || "—"}</span>
                  </div>
                  <div className={styles["detail-item"]}>
                    <span className={styles["detail-label"]}>State:</span>
                    <span className={styles["detail-value"]}>
                      {selectedPurchase.partyResponseDto.state?.replace(/_/g, " ")}
                    </span>
                  </div>
                  <div className={styles["detail-item"]}>
                    <span className={styles["detail-label"]}>Billing Address:</span>
                    <span className={styles["detail-value"]}>
                      {selectedPurchase.partyResponseDto.billingAddress || "—"}
                    </span>
                  </div>
                  <div className={styles["detail-item"]}>
                    <span className={styles["detail-label"]}>Shipping Address:</span>
                    <span className={styles["detail-value"]}>
                      {selectedPurchase.partyResponseDto.shipingAddress || "—"}
                    </span>
                  </div>
                </div>
              </section>
            )}

            {/* Items */}
            <section className={styles["card-section"]}>
              <h4 className={styles["section-title"]}>Items</h4>
              {selectedPurchase.purchaseItemResponses?.length > 0 ? (
                <div className={styles["items-table-wrapper"]}>
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
                </div>
              ) : (
                <p>No items</p>
              )}
            </section>

            {/* Payments */}
            <section className={styles["card-section"]}>
              <h4 className={styles["section-title"]}>Payments</h4>
              {selectedPurchase.purchasePaymentResponses?.length > 0 ? (
                <ul className={styles["payment-list"]}>
                  {selectedPurchase.purchasePaymentResponses.map((p, i) => (
                    <li key={i} className={styles["payment-item"]}>
                      <div className={styles["payment-info"]}>
                        <span className={styles["payment-amount"]}>₹{p.amountPaid}</span>
                        <span className={styles["payment-date"]}>{new Date(p.paymentDate).toLocaleDateString()}</span>
                      </div>
                      <div className={styles["payment-type"]}>{p.paymentType}</div>
                      {p.referenceNumber && <div className={styles["payment-ref"]}>Ref: {p.referenceNumber}</div>}
                      {p.receiptNo && <div className={styles["payment-receipt"]}>Receipt: {p.receiptNo}</div>}
                      {p.paymentDescription && <div className={styles["payment-desc"]}>{p.paymentDescription}</div>}
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
        <div className={styles["modal-overlay"]} onClick={() => setShowPaymentModal(false)}>
          <div className={styles["payment-modal"]} onClick={(e) => e.stopPropagation()}>
            <div className={styles["modal-header"]}>
              <h3>Add Payment for Purchase #{selectedPurchaseId}</h3>
              <button className={styles["close-modal-btn"]} onClick={() => setShowPaymentModal(false)}>
                <X size={20} />
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
                  <label>
                    Payment Date <span className={styles.required}>*</span>
                  </label>
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
                  <label>
                    Amount Paid <span className={styles.required}>*</span>
                  </label>
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
                  <small className={styles["balance-info"]}>
                    Remaining Balance: ₹{remainingBalance.toFixed(2)}
                  </small>
                </div>

                <div className={styles["form-group"]}>
                  <label>
                    Payment Type <span className={styles.required}>*</span>
                  </label>
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
                <button type="submit" className={styles["submit-button"]} disabled={loading}>
                  {loading ? (
                    <>
                      <Loader size={16} className={styles["button-spinner"]} />
                      Adding...
                    </>
                  ) : (
                    <>
                      <DollarSign size={16} />
                      Add Payment
                    </>
                  )}
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