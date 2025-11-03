// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import config from "../../../config/apiconfig";
// import styles from "../Styles/ScreenUI.module.css";
// import { toast } from "react-toastify";

// const SalesList = () => {
//   const navigate = useNavigate();
//   const userData = JSON.parse(localStorage.getItem("eBilling")) || {};
//   const token = userData?.accessToken || "";
//   const companyId = userData?.selectedCompany?.id || "";

//   const [sales, setSales] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedSale, setSelectedSale] = useState(null);
//   const [showPaymentModal, setShowPaymentModal] = useState(false);
//   const [selectedSaleId, setSelectedSaleId] = useState(null);
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
//     "CASH", "UPI", "CREDIT_CARD", "DEBIT_CARD",
//     "NET_BANKING", "WALLET", "CHEQUE", "OTHER"
//   ];

//   // Fetch Sales
//   const fetchSales = async () => {
//     if (!token || !companyId) return;
//     setLoading(true);
//     try {
//       const res = await axios.get(
//         `${config.BASE_URL}/company/${companyId}/sales`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       setSales(res.data);
//       console.log("Fetched sales:", res.data);
//     } catch (err) {
//       toast.error("Failed to load sales");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchSales();
//   }, [token, companyId]);

//   // Delete Sale
//   const deleteSale = async (saleId) => {
//     if (!window.confirm("Are you sure you want to delete this sale?")) return;

//     try {
//       await axios.delete(`${config.BASE_URL}/sale/${saleId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setSales((prev) => prev.filter((s) => s.saleId !== saleId));
//       toast.success("Sale deleted successfully");
//       setSelectedSale(null);
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to delete sale");
//     }
//   };

//   // Edit Navigation
//   const handleEdit = (saleId) => {
//     navigate(`/createsale?edit=${saleId}`);
//     setSelectedSale(null);
//   };

//   // Open Payment Modal
//   const openPaymentModal = (sale) => {
//     setSelectedSaleId(sale.saleId);
//     setRemainingBalance(parseFloat(sale.balance) || 0);
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

//   // Add Payment
//   const handleAddPayment = async (e) => {
//     e.preventDefault();
//     if (!selectedSaleId) return;

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
//       toast.error(`Payment amount (₹${amount}) exceeds remaining balance (₹${remainingBalance})`);
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
//         `${config.BASE_URL}/sale/${selectedSaleId}/add-payment`,
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
//       fetchSales();
//       setSelectedSale(null);
//     } catch (err) {
//       console.error("Add payment error:", err.response?.data);
//       toast.error(err.response?.data?.message || "Failed to add payment");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className={styles["company-form-container"]}>
//       {/* Header */}
//       <div className={styles["form-header"]}>
//         <div>
//           <h1 className={styles["company-form-title"]}>Sales</h1>
//           <p className={styles["form-subtitle"]}>Manage all your invoices</p>
//         </div>
//         <button
//           onClick={() => navigate("/createsale")}
//           className={styles["submit-button"]}
//           disabled={loading}
//         >
//           Create Sale
//         </button>
//       </div>

//       {/* Loading */}
//       {loading && (
//         <div className={styles["loading-message"]}>
//           <div className={styles.spinner}></div>
//           <p>Loading sales...</p>
//         </div>
//       )}

//       {/* Table */}
//       {sales.length > 0 ? (
//         <div className={styles["table-wrapper"]}>
//           <table className={styles.table}>
//             <thead>
//               <tr>
//                 <th>Invoice Number</th>
//                 <th>Invoice Date</th>
//                 <th>Due Date</th>
//                 <th>Party Name</th> {/* NEW COLUMN */}
//                 <th>Total Amount</th>
//                 <th>Received</th>
//                 <th>Balance</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {sales.map((s) => (
//                 <tr key={s.saleId}>
//                   <td>{s.invoiceNumber}</td>
//                   <td>{new Date(s.invoceDate).toLocaleDateString()}</td>
//                   <td>{new Date(s.dueDate).toLocaleDateString()}</td>
//                   <td>
//                     {s.partyResponseDto?.name || "—"}
//                   </td>
//                   <td>₹{parseFloat(s.totalAmount).toFixed(2)}</td>
//                   <td>₹{parseFloat(s.receivedAmount).toFixed(2)}</td>
//                   <td
//                     style={{
//                       color: s.balance > 0 ? "#e74c3c" : "#27ae60",
//                       fontWeight: "500",
//                     }}
//                   >
//                     ₹{parseFloat(s.balance).toFixed(2)}
//                   </td>
//                   <td className={styles["actions-cell"]}>
//                     <button
//                       onClick={() => setSelectedSale(s)}
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
//           <p>No sales found</p>
//           <p className={styles["no-data-subtitle"]}>
//             Click "Create Sale" to add your first invoice.
//           </p>
//         </div>
//       )}

//       {/* VIEW MODAL WITH ACTIONS */}
//       {selectedSale && (
//         <div
//           className={styles["modal-overlay"]}
//           onClick={() => setSelectedSale(null)}
//         >
//           <div
//             className={styles["detail-card"]}
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className={styles["card-header"]}>
//               <div>
//                 <h3>Sale #{selectedSale.saleId}</h3>
//                 <div
//                   className={`${styles["balance-badge"]} ${
//                     selectedSale.balance <= 0 ? styles.paid : ""
//                   }`}
//                 >
//                   {selectedSale.balance > 0 ? "Warning" : "Check"} Balance: ₹
//                   {parseFloat(selectedSale.balance).toFixed(2)}
//                 </div>
//               </div>
//               <div>
//                 <button
//                   onClick={() => handleEdit(selectedSale.saleId)}
//                   className={`${styles["action-button"]} ${styles["edit-button"]}`}
//                   title="Edit sale"
//                 >
//                   Edit
//                 </button>

//                 {selectedSale.balance > 0 && (
//                   <button
//                     onClick={() => openPaymentModal(selectedSale)}
//                     className={`${styles["action-button"]} ${styles["payment-button"]}`}
//                     title="Add Payment"
//                   >
//                     Add Payment
//                   </button>
//                 )}

//                 <button
//                   onClick={() => deleteSale(selectedSale.saleId)}
//                   className={`${styles["action-button"]} ${styles["delete-button"]}`}
//                   title="Delete sale"
//                 >
//                   Delete
//                 </button>

//                 <button
//                   className={styles["close-modal-btn"]}
//                   onClick={() => setSelectedSale(null)}
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>

//             {/* Invoice Details */}
//             <section className={styles["card-section"]}>
//               <h4>Invoice Details</h4>
//               <div className={styles["detail-grid"]}>
//                 <p><strong>Invoice Number:</strong> {selectedSale.invoiceNumber || "—"}</p>
//                 <p><strong>Invoice Date:</strong> {new Date(selectedSale.invoceDate).toLocaleDateString()}</p>
//                 <p><strong>Due Date:</strong> {new Date(selectedSale.dueDate).toLocaleDateString()}</p>
//                 <p><strong>Sale Type:</strong> {selectedSale.saleType}</p>
//                 <p><strong>State of Supply:</strong> {selectedSale.stateOfSupply?.replace(/_/g, " ")}</p>
//                 <p><strong>Payment Type:</strong> {selectedSale.paymentType}</p>
//                 <p><strong>Payment Description:</strong> {selectedSale.paymentDescription || "—"}</p>
//                 <p><strong>Billing Address:</strong> {selectedSale.billingAddress || "—"}</p>
//                 <p><strong>Shipping Address:</strong> {selectedSale.shippingAddress || "—"}</p>
//                 <p><strong>Total (ex-tax):</strong> ₹{selectedSale.totalAmountWithoutTax}</p>
//                 <p><strong>Tax Amount:</strong> ₹{selectedSale.totalTaxAmount}</p>
//                 <p><strong>Delivery Charges:</strong> ₹{selectedSale.deliveryCharges}</p>
//                 <p><strong>Total Amount:</strong> ₹{selectedSale.totalAmount}</p>
//                 <p><strong>Received:</strong> ₹{selectedSale.receivedAmount}</p>
//                 <p><strong>Balance:</strong> <strong style={{ color: selectedSale.balance > 0 ? "#e74c3c" : "#27ae60" }}>
//                   ₹{parseFloat(selectedSale.balance).toFixed(2)}
//                 </strong></p>
//                 <p><strong>Paid:</strong> {selectedSale.paid ? "Yes" : "No"}</p>
//                 <p><strong>Overdue:</strong> {selectedSale.overdue ? "Yes" : "No"}</p>
//               </div>
//             </section>

//             {/* Party */}
//             {selectedSale.partyResponseDto && (
//               <section className={styles["card-section"]}>
//                 <h4>Party Details</h4>
//                 <div className={styles["detail-grid"]}>
//                   <p><strong>Name:</strong> {selectedSale.partyResponseDto.name}</p>
//                   <p><strong>Party ID:</strong> {selectedSale.partyResponseDto.partyId}</p>
//                   <p><strong>GSTIN:</strong> {selectedSale.partyResponseDto.gstin || "—"}</p>
//                   <p><strong>GST Type:</strong> {selectedSale.partyResponseDto.gstType?.replace(/_/g, " ")}</p>
//                   <p><strong>Phone:</strong> {selectedSale.partyResponseDto.phoneNo || "—"}</p>
//                   <p><strong>Email:</strong> {selectedSale.partyResponseDto.emailId || "—"}</p>
//                   <p><strong>State:</strong> {selectedSale.partyResponseDto.state?.replace(/_/g, " ")}</p>
//                   <p><strong>Billing Address:</strong> {selectedSale.partyResponseDto.billingAddress || "—"}</p>
//                   <p><strong>Shipping Address:</strong> {selectedSale.partyResponseDto.shipingAddress || "—"}</p>
//                 </div>
//               </section>
//             )}

//             {/* Items */}
//             <section className={styles["card-section"]}>
//               <h4>Items</h4>
//               {selectedSale.saleItemResponses?.length > 0 ? (
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
//                     {selectedSale.saleItemResponses.map((it, i) => (
//                       <tr key={i}>
//                         <td>{it.itemName}</td>
//                         <td>{it.itemHsnCode}</td>
//                         <td>{it.itemDescription || "—"}</td>
//                         <td>{it.quantity}</td>
//                         <td>{it.unit}</td>
//                         <td>₹{it.pricePerUnit}</td>
//                         <td>{it.pricePerUnitTaxType}</td>
//                         <td>{it.taxRate}</td>
//                         <td>₹{it.taxAmount}</td>
//                         <td>₹{it.totalAmount}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               ) : (
//                 <p>No items</p>
//               )}
//             </section>

//             {/* Payments */}
//             <section className={styles["card-section"]}>
//               <h4>Payments</h4>
//               {selectedSale.salePaymentResponses?.length > 0 ? (
//                 <ul className={styles["payment-list"]}>
//                   {selectedSale.salePaymentResponses.map((p, i) => (
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

//       {/* ADD PAYMENT MODAL */}
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
//               <h3>Add Payment for Sale #{selectedSaleId}</h3>
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

// export default SalesList;









// // import React, { useEffect, useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import axios from "axios";
// // import config from "../../../config/apiconfig";
// // import { toast } from "react-toastify";
// // import styles from "./Sales.module.css";
// // import { Search, Plus, Eye, Edit, Trash2, DollarSign, Calendar, User, Filter, X, Download, CheckCircle, AlertCircle, TrendingUp, TrendingDown } from "lucide-react";

// // const SalesListEnhanced = () => {
// //   const navigate = useNavigate();
// //   const userData = JSON.parse(localStorage.getItem("eBilling")) || {};
// //   const token = userData?.accessToken || "";
// //   const companyId = userData?.selectedCompany?.id || "";

// //   const [sales, setSales] = useState([]);
// //   const [loading, setLoading] = useState(false);
// //   const [selectedSale, setSelectedSale] = useState(null);
// //   const [showPaymentModal, setShowPaymentModal] = useState(false);
// //   const [selectedSaleId, setSelectedSaleId] = useState(null);
// //   const [remainingBalance, setRemainingBalance] = useState(0);
// //   const [searchTerm, setSearchTerm] = useState("");
// //   const [filterStatus, setFilterStatus] = useState("all");
// //   const [showFilters, setShowFilters] = useState(false);

// //   const [paymentForm, setPaymentForm] = useState({
// //     receiptNo: "",
// //     paymentDate: new Date().toISOString().split("T")[0],
// //     amountPaid: "",
// //     paymentType: "CASH",
// //     referenceNumber: "",
// //     paymentDescription: "",
// //   });

// //   const paymentTypes = [
// //     "CASH", "UPI", "CREDIT_CARD", "DEBIT_CARD",
// //     "NET_BANKING", "WALLET", "CHEQUE", "OTHER"
// //   ];

// //   // Fetch Sales
// //   const fetchSales = async () => {
// //     if (!token || !companyId) return;
// //     setLoading(true);
// //     try {
// //       const res = await axios.get(
// //         `${config.BASE_URL}/company/${companyId}/sales`,
// //         {
// //           headers: {
// //             Authorization: `Bearer ${token}`,
// //             "Content-Type": "application/json",
// //           },
// //         }
// //       );
// //       setSales(res.data);
// //       console.log("Fetched sales:", res.data);
// //     } catch (err) {
// //       toast.error("Failed to load sales");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchSales();
// //   }, [token, companyId]);

// //   // Delete Sale
// //   const deleteSale = async (saleId) => {
// //     if (!window.confirm("Are you sure you want to delete this sale?")) return;

// //     try {
// //       await axios.delete(`${config.BASE_URL}/sale/${saleId}`, {
// //         headers: { Authorization: `Bearer ${token}` },
// //       });
// //       setSales((prev) => prev.filter((s) => s.saleId !== saleId));
// //       toast.success("Sale deleted successfully");
// //       setSelectedSale(null);
// //     } catch (err) {
// //       toast.error(err.response?.data?.message || "Failed to delete sale");
// //     }
// //   };

// //   // Edit Navigation
// //   const handleEdit = (saleId) => {
// //     navigate(`/createsale?edit=${saleId}`);
// //     setSelectedSale(null);
// //   };

// //   // Open Payment Modal
// //   const openPaymentModal = (sale) => {
// //     setSelectedSaleId(sale.saleId);
// //     setRemainingBalance(parseFloat(sale.balance) || 0);
// //     setPaymentForm({
// //       receiptNo: "",
// //       paymentDate: new Date().toISOString().split("T")[0],
// //       amountPaid: "",
// //       paymentType: "CASH",
// //       referenceNumber: "",
// //       paymentDescription: "",
// //     });
// //     setShowPaymentModal(true);
// //   };

// //   // Add Payment
// //   const handleAddPayment = async (e) => {
// //     e.preventDefault();
// //     if (!selectedSaleId) return;

// //     const amount = parseFloat(paymentForm.amountPaid);
// //     if (!paymentForm.paymentDate || !paymentForm.amountPaid || !paymentForm.paymentType) {
// //       toast.error("Payment Date, Amount, and Type are required");
// //       return;
// //     }
// //     if (isNaN(amount) || amount <= 0) {
// //       toast.error("Amount must be greater than 0");
// //       return;
// //     }
// //     if (amount > remainingBalance) {
// //       toast.error(`Payment amount (₹${amount}) exceeds remaining balance (₹${remainingBalance})`);
// //       return;
// //     }

// //     const paymentId = Date.now() * 1000 + Math.floor(Math.random() * 1000);

// //     const payload = {
// //       paymentId,
// //       receiptNo: paymentForm.receiptNo || null,
// //       paymentDate: paymentForm.paymentDate,
// //       amountPaid: amount,
// //       paymentType: paymentForm.paymentType,
// //       referenceNumber: paymentForm.referenceNumber || null,
// //       paymentDescription: paymentForm.paymentDescription || null,
// //     };

// //     try {
// //       setLoading(true);
// //       await axios.post(
// //         `${config.BASE_URL}/sale/${selectedSaleId}/add-payment`,
// //         payload,
// //         {
// //           headers: {
// //             Authorization: `Bearer ${token}`,
// //             "Content-Type": "application/json",
// //           },
// //         }
// //       );

// //       toast.success("Payment added successfully!");
// //       setShowPaymentModal(false);
// //       fetchSales();
// //       setSelectedSale(null);
// //     } catch (err) {
// //       console.error("Add payment error:", err.response?.data);
// //       toast.error(err.response?.data?.message || "Failed to add payment");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // Filter sales based on search and status
// //   const filteredSales = sales.filter(sale => {
// //     const matchesSearch = sale.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //                          sale.partyResponseDto?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
// //     const matchesStatus = filterStatus === "all" || 
// //                          (filterStatus === "paid" && sale.paid) ||
// //                          (filterStatus === "unpaid" && !sale.paid) ||
// //                          (filterStatus === "overdue" && sale.overdue);
    
// //     return matchesSearch && matchesStatus;
// //   });

// //   // Calculate summary statistics
// //   const stats = {
// //     total: sales.reduce((sum, s) => sum + parseFloat(s.totalAmount || 0), 0),
// //     received: sales.reduce((sum, s) => sum + parseFloat(s.receivedAmount || 0), 0),
// //     pending: sales.reduce((sum, s) => sum + parseFloat(s.balance || 0), 0),
// //     count: sales.length,
// //     overdueCount: sales.filter(s => s.overdue).length
// //   };

// //   return (
// //     <div className={styles["company-form-container"]}>
// //       <div className={styles["container-wrapper"]}>
        
// //         {/* Header Section */}
// //         <div className={styles["form-header"]}>
// //           <div className={styles["header-content"]}>
// //             <h1 className={styles["company-form-title"]}>Sales Dashboard</h1>
// //             <p className={styles["form-subtitle"]}>Manage and track all your invoices</p>
// //           </div>
// //           <button 
// //             onClick={() => navigate("/createsale")}
// //             disabled={loading}
// //             className={styles["submit-button"]}
// //           >
// //             <Plus size={20} />
// //             <span>Create Sale</span>
// //           </button>
// //         </div>

// //         {/* Stats Cards */}
// //         <div className={styles["stats-grid"]}>
// //           <div className={styles["stat-card"]}>
// //             <div className={styles["stat-header"]}>
// //               <span className={styles["stat-label"]}>Total Sales</span>
// //               <div className={`${styles["stat-icon"]} ${styles.blue}`}>
// //                 <TrendingUp size={18} />
// //               </div>
// //             </div>
// //             <p className={styles["stat-value"]}>₹{stats.total.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
// //             <p className={styles["stat-meta"]}>{stats.count} invoices</p>
// //           </div>

// //           <div className={styles["stat-card"]}>
// //             <div className={styles["stat-header"]}>
// //               <span className={styles["stat-label"]}>Received</span>
// //               <div className={`${styles["stat-icon"]} ${styles.green}`}>
// //                 <CheckCircle size={18} />
// //               </div>
// //             </div>
// //             <p className={styles["stat-value"]}>₹{stats.received.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
// //             <p className={styles["stat-meta"]}>{stats.total > 0 ? ((stats.received/stats.total)*100).toFixed(1) : 0}% collected</p>
// //           </div>

// //           <div className={styles["stat-card"]}>
// //             <div className={styles["stat-header"]}>
// //               <span className={styles["stat-label"]}>Pending</span>
// //               <div className={`${styles["stat-icon"]} ${styles.orange}`}>
// //                 <TrendingDown size={18} />
// //               </div>
// //             </div>
// //             <p className={styles["stat-value"]}>₹{stats.pending.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
// //             <p className={styles["stat-meta"]}>{stats.total > 0 ? ((stats.pending/stats.total)*100).toFixed(1) : 0}% pending</p>
// //           </div>

// //           <div className={styles["stat-card"]}>
// //             <div className={styles["stat-header"]}>
// //               <span className={styles["stat-label"]}>Overdue</span>
// //               <div className={`${styles["stat-icon"]} ${styles.red}`}>
// //                 <Calendar size={18} />
// //               </div>
// //             </div>
// //             <p className={styles["stat-value"]}>{stats.overdueCount}</p>
// //             <p className={styles["stat-meta"]}>Invoices overdue</p>
// //           </div>
// //         </div>

// //         {/* Search and Filter Bar */}
// //         <div className={styles["search-filter-bar"]}>
// //           <div className={styles["search-filter-row"]}>
// //             <div className={styles["search-input-wrapper"]}>
// //               <Search className={styles["search-icon"]} size={20} />
// //               <input
// //                 type="text"
// //                 placeholder="Search by invoice number or party name..."
// //                 value={searchTerm}
// //                 onChange={(e) => setSearchTerm(e.target.value)}
// //                 className={styles["search-input"]}
// //               />
// //             </div>
            
// //             <div className={styles["filter-actions"]}>
// //               <button
// //                 onClick={() => setShowFilters(!showFilters)}
// //                 className={styles["filter-button"]}
// //               >
// //                 <Filter size={18} />
// //                 <span>Filters</span>
// //               </button>
              
// //               <button className={styles["export-button"]}>
// //                 <Download size={18} />
// //                 <span>Export</span>
// //               </button>
// //             </div>
// //           </div>

// //           {showFilters && (
// //             <div className={styles["filter-pills"]}>
// //               {["all", "paid", "unpaid", "overdue"].map((status) => (
// //                 <button
// //                   key={status}
// //                   onClick={() => setFilterStatus(status)}
// //                   className={`${styles["filter-pill"]} ${filterStatus === status ? styles.active : ""}`}
// //                 >
// //                   {status.charAt(0).toUpperCase() + status.slice(1)}
// //                 </button>
// //               ))}
// //             </div>
// //           )}
// //         </div>

// //         {/* Loading State */}
// //         {loading && (
// //           <div className={styles["loading-container"]}>
// //             <div className={styles.spinner}></div>
// //             <p className={styles["loading-text"]}>Loading sales...</p>
// //           </div>
// //         )}

// //         {/* Sales Table - Desktop */}
// //         {!loading && filteredSales.length > 0 && (
// //           <div className={styles["table-wrapper"]}>
// //             <div className={styles["table-container"]}>
// //               <table className={styles.table}>
// //                 <thead>
// //                   <tr>
// //                     <th>Invoice</th>
// //                     <th>Party</th>
// //                     <th>Date</th>
// //                     <th className={styles["text-right"]}>Amount</th>
// //                     <th className={styles["text-right"]}>Received</th>
// //                     <th className={styles["text-right"]}>Balance</th>
// //                     <th className={styles["text-center"]}>Status</th>
// //                     <th className={styles["text-center"]}>Actions</th>
// //                   </tr>
// //                 </thead>
// //                 <tbody>
// //                   {filteredSales.map((sale) => (
// //                     <tr key={sale.saleId}>
// //                       <td>
// //                         <div className={styles["invoice-cell"]}>
// //                           <span className={styles["invoice-number"]}>{sale.invoiceNumber || "—"}</span>
// //                           <span className={styles["invoice-id"]}>ID: {sale.saleId}</span>
// //                         </div>
// //                       </td>
// //                       <td>
// //                         <div className={styles["party-cell"]}>
// //                           <div className={styles["party-icon"]}>
// //                             <User size={16} />
// //                           </div>
// //                           <span className={styles["party-name"]}>{sale.partyResponseDto?.name || "—"}</span>
// //                         </div>
// //                       </td>
// //                       <td>
// //                         <div className={styles["date-cell"]}>
// //                           <span className={styles["date-primary"]}>
// //                             {new Date(sale.invoceDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
// //                           </span>
// //                           <span className={styles["date-secondary"]}>
// //                             Due: {new Date(sale.dueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
// //                           </span>
// //                         </div>
// //                       </td>
// //                       <td className={styles["text-right"]}>
// //                         <span className={styles["amount-primary"]}>₹{parseFloat(sale.totalAmount).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
// //                       </td>
// //                       <td className={styles["text-right"]}>
// //                         <span className={styles["amount-success"]}>₹{parseFloat(sale.receivedAmount).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
// //                       </td>
// //                       <td className={styles["text-right"]}>
// //                         <span className={sale.balance > 0 ? styles["amount-warning"] : styles["amount-paid"]}>
// //                           ₹{parseFloat(sale.balance).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
// //                         </span>
// //                       </td>
// //                       <td className={styles["text-center"]}>
// //                         {sale.paid ? (
// //                           <span className={`${styles["status-badge"]} ${styles.paid}`}>
// //                             <CheckCircle size={14} /> Paid
// //                           </span>
// //                         ) : sale.overdue ? (
// //                           <span className={`${styles["status-badge"]} ${styles.overdue}`}>
// //                             <AlertCircle size={14} /> Overdue
// //                           </span>
// //                         ) : (
// //                           <span className={`${styles["status-badge"]} ${styles.pending}`}>
// //                             <AlertCircle size={14} /> Pending
// //                           </span>
// //                         )}
// //                       </td>
// //                       <td>
// //                         <div className={styles["actions-cell"]}>
// //                           <button
// //                             onClick={() => setSelectedSale(sale)}
// //                             className={`${styles["action-button"]} ${styles.view}`}
// //                             title="View details"
// //                           >
// //                             <Eye size={18} />
// //                           </button>
// //                           <button
// //                             onClick={() => handleEdit(sale.saleId)}
// //                             className={`${styles["action-button"]} ${styles.edit}`}
// //                             title="Edit"
// //                           >
// //                             <Edit size={18} />
// //                           </button>
// //                           {sale.balance > 0 && (
// //                             <button
// //                               onClick={() => openPaymentModal(sale)}
// //                               className={`${styles["action-button"]} ${styles.payment}`}
// //                               title="Add payment"
// //                             >
// //                               <DollarSign size={18} />
// //                             </button>
// //                           )}
// //                           <button
// //                             onClick={() => deleteSale(sale.saleId)}
// //                             className={`${styles["action-button"]} ${styles.delete}`}
// //                             title="Delete"
// //                           >
// //                             <Trash2 size={18} />
// //                           </button>
// //                         </div>
// //                       </td>
// //                     </tr>
// //                   ))}
// //                 </tbody>
// //               </table>
// //             </div>
// //           </div>
// //         )}

// //         {/* Sales Cards - Mobile */}
// //         {!loading && filteredSales.length > 0 && (
// //           <div className={styles["mobile-cards-container"]}>
// //             {filteredSales.map((sale) => (
// //               <div key={sale.saleId} className={styles["sale-card"]}>
// //                 <div className={styles["card-content"]}>
// //                   <div className={styles["card-header"]}>
// //                     <div className={styles["card-title"]}>
// //                       <h3 className={styles["card-invoice-number"]}>{sale.invoiceNumber || "—"}</h3>
// //                       <p className={styles["card-party-name"]}>{sale.partyResponseDto?.name || "—"}</p>
// //                     </div>
// //                     {sale.paid ? (
// //                       <span className={`${styles["status-badge"]} ${styles.paid}`}>Paid</span>
// //                     ) : sale.overdue ? (
// //                       <span className={`${styles["status-badge"]} ${styles.overdue}`}>Overdue</span>
// //                     ) : (
// //                       <span className={`${styles["status-badge"]} ${styles.pending}`}>Pending</span>
// //                     )}
// //                   </div>

// //                   <div className={styles["card-amounts"]}>
// //                     <div className={styles["amount-box"]}>
// //                       <p className={styles["amount-label"]}>Total Amount</p>
// //                       <p className={`${styles["amount-value"]} ${styles["text-primary"]}`}>
// //                         ₹{parseFloat(sale.totalAmount).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
// //                       </p>
// //                     </div>
// //                     <div className={styles["amount-box"]}>
// //                       <p className={styles["amount-label"]}>Balance</p>
// //                       <p className={`${styles["amount-value"]} ${sale.balance > 0 ? styles["text-warning"] : styles["text-success"]}`}>
// //                         ₹{parseFloat(sale.balance).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
// //                       </p>
// //                     </div>
// //                   </div>

// //                   <div className={styles["card-dates"]}>
// //                     <span>Date: {new Date(sale.invoceDate).toLocaleDateString('en-IN')}</span>
// //                     <span>Due: {new Date(sale.dueDate).toLocaleDateString('en-IN')}</span>
// //                   </div>

// //                   <div className={styles["card-actions"]}>
// //                     <button
// //                       onClick={() => setSelectedSale(sale)}
// //                       className={`${styles["card-action-button"]} ${styles.view}`}
// //                     >
// //                       <Eye size={14} />
// //                       <span>View</span>
// //                     </button>
// //                     <button 
// //                       onClick={() => handleEdit(sale.saleId)}
// //                       className={`${styles["card-action-button"]} ${styles.edit}`}
// //                     >
// //                       <Edit size={14} />
// //                       <span>Edit</span>
// //                     </button>
// //                     {sale.balance > 0 && (
// //                       <button
// //                         onClick={() => openPaymentModal(sale)}
// //                         className={`${styles["card-action-button"]} ${styles.payment}`}
// //                       >
// //                         <DollarSign size={14} />
// //                         <span>Pay</span>
// //                       </button>
// //                     )}
// //                     <button 
// //                       onClick={() => deleteSale(sale.saleId)}
// //                       className={`${styles["card-action-button"]} ${styles.delete}`}
// //                     >
// //                       <Trash2 size={14} />
// //                       <span>Del</span>
// //                     </button>
// //                   </div>
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         )}

// //         {/* Empty State */}
// //         {!loading && filteredSales.length === 0 && (
// //           <div className={styles["empty-state"]}>
// //             <div className={styles["empty-icon"]}>
// //               <Search size={32} />
// //             </div>
// //             <h3 className={styles["empty-title"]}>No sales found</h3>
// //             <p className={styles["empty-subtitle"]}>
// //               {searchTerm || filterStatus !== "all" 
// //                 ? "Try adjusting your search or filters" 
// //                 : "Click 'Create Sale' to add your first invoice"}
// //             </p>
// //             {(searchTerm || filterStatus !== "all") && (
// //               <button 
// //                 onClick={() => {
// //                   setSearchTerm("");
// //                   setFilterStatus("all");
// //                 }}
// //                 className={styles["submit-button"]}
// //               >
// //                 Clear Filters
// //               </button>
// //             )}
// //           </div>
// //         )}

// //         {/* View Modal */}
// //         {selectedSale && (
// //           <div className={styles["modal-overlay"]} onClick={() => setSelectedSale(null)}>
// //             <div className={styles["modal-container"]} onClick={(e) => e.stopPropagation()}>
// //               <div className={styles["modal-header"]}>
// //                 <div>
// //                   <h2 className={styles["modal-title"]}>Invoice Details</h2>
// //                   <p className={styles["modal-subtitle"]}>Sale #{selectedSale.saleId}</p>
// //                 </div>
// //                 <button
// //                   onClick={() => setSelectedSale(null)}
// //                   className={styles["modal-close"]}
// //                 >
// //                   <X size={24} />
// //                 </button>
// //               </div>
              
// //               <div className={styles["modal-body"]}>
// //                 {/* Invoice Information */}
// //                 <div className={styles["modal-section"]}>
// //                   <h3 className={styles["section-title"]}>Invoice Information</h3>
// //                   <div className={styles["detail-grid"]}>
// //                     <div className={styles["detail-item"]}>
// //                       <p className={styles["detail-label"]}>Invoice Number</p>
// //                       <p className={styles["detail-value"]}>{selectedSale.invoiceNumber || "—"}</p>
// //                     </div>
// //                     <div className={styles["detail-item"]}>
// //                       <p className={styles["detail-label"]}>Party Name</p>
// //                       <p className={styles["detail-value"]}>{selectedSale.partyResponseDto?.name || "—"}</p>
// //                     </div>
// //                     <div className={styles["detail-item"]}>
// //                       <p className={styles["detail-label"]}>Invoice Date</p>
// //                       <p className={styles["detail-value"]}>{new Date(selectedSale.invoceDate).toLocaleDateString('en-IN')}</p>
// //                     </div>
// //                     <div className={styles["detail-item"]}>
// //                       <p className={styles["detail-label"]}>Due Date</p>
// //                       <p className={styles["detail-value"]}>{new Date(selectedSale.dueDate).toLocaleDateString('en-IN')}</p>
// //                     </div>
// //                     <div className={styles["detail-item"]}>
// //                       <p className={styles["detail-label"]}>Sale Type</p>
// //                       <p className={styles["detail-value"]}>{selectedSale.saleType || "—"}</p>
// //                     </div>
// //                     <div className={styles["detail-item"]}>
// //                       <p className={styles["detail-label"]}>State of Supply</p>
// //                       <p className={styles["detail-value"]}>{selectedSale.stateOfSupply?.replace(/_/g, " ") || "—"}</p>
// //                     </div>
// //                   </div>
// //                 </div>

// //                 {/* Payment Summary */}
// //                 <div className={styles["modal-section"]}>
// //                   <h3 className={styles["section-title"]}>Payment Summary</h3>
// //                   <div className={styles["payment-summary"]}>
// //                     <div className={`${styles["summary-card"]} ${styles.total}`}>
// //                       <p className={styles["summary-label"]}>Total Amount</p>
// //                       <p className={`${styles["summary-amount"]} ${styles["text-primary"]}`}>
// //                         ₹{parseFloat(selectedSale.totalAmount).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
// //                       </p>
// //                     </div>
// //                     <div className={`${styles["summary-card"]} ${styles.received}`}>
// //                       <p className={styles["summary-label"]}>Received</p>
// //                       <p className={`${styles["summary-amount"]} ${styles["text-success"]}`}>
// //                         ₹{parseFloat(selectedSale.receivedAmount).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
// //                       </p>
// //                     </div>
// //                     <div className={`${styles["summary-card"]} ${styles.balance}`}>
// //                       <p className={styles["summary-label"]}>Balance</p>
// //                       <p className={`${styles["summary-amount"]} ${selectedSale.balance > 0 ? styles["text-warning"] : styles["text-success"]}`}>
// //                         ₹{parseFloat(selectedSale.balance).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
// //                       </p>
// //                     </div>
// //                   </div>
// //                   <div className={styles["detail-grid"]}>
// //                     <div className={styles["detail-item"]}>
// //                       <p className={styles["detail-label"]}>Total (ex-tax)</p>
// //                       <p className={styles["detail-value"]}>₹{selectedSale.totalAmountWithoutTax || "—"}</p>
// //                     </div>
// //                     <div className={styles["detail-item"]}>
// //                       <p className={styles["detail-label"]}>Tax Amount</p>
// //                       <p className={styles["detail-value"]}>₹{selectedSale.totalTaxAmount || "—"}</p>
// //                     </div>
// //                     <div className={styles["detail-item"]}>
// //                       <p className={styles["detail-label"]}>Delivery Charges</p>
// //                       <p className={styles["detail-value"]}>₹{selectedSale.deliveryCharges || "0.00"}</p>
// //                     </div>
// //                     <div className={styles["detail-item"]}>
// //                       <p className={styles["detail-label"]}>Payment Type</p>
// //                       <p className={styles["detail-value"]}>{selectedSale.paymentType || "—"}</p>
// //                     </div>
// //                   </div>
// //                 </div>

// //                 {/* Party Details */}
// //                 {selectedSale.partyResponseDto && (
// //                   <div className={styles["modal-section"]}>
// //                     <h3 className={styles["section-title"]}>Party Details</h3>
// //                     <div className={styles["detail-grid"]}>
// //                       <div className={styles["detail-item"]}>
// //                         <p className={styles["detail-label"]}>Name</p>
// //                         <p className={styles["detail-value"]}>{selectedSale.partyResponseDto.name}</p>
// //                       </div>
// //                       <div className={styles["detail-item"]}>
// //                         <p className={styles["detail-label"]}>GSTIN</p>
// //                         <p className={styles["detail-value"]}>{selectedSale.partyResponseDto.gstin || "—"}</p>
// //                       </div>
// //                       <div className={styles["detail-item"]}>
// //                         <p className={styles["detail-label"]}>Phone</p>
// //                         <p className={styles["detail-value"]}>{selectedSale.partyResponseDto.phoneNo || "—"}</p>
// //                       </div>
// //                       <div className={styles["detail-item"]}>
// //                         <p className={styles["detail-label"]}>Email</p>
// //                         <p className={styles["detail-value"]}>{selectedSale.partyResponseDto.emailId || "—"}</p>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 )}

// //                 {/* Items */}
// //                 {selectedSale.saleItemResponses?.length > 0 && (
// //                   <div className={styles["modal-section"]}>
// //                     <h3 className={styles["section-title"]}>Items</h3>
// //                     <div className={styles["items-table-wrapper"]}>
// //                       <table className={styles["items-table"]}>
// //                         <thead>
// //                           <tr>
// //                             <th>Item</th>
// //                             <th className={styles["text-center"]}>Qty</th>
// //                             <th className={styles["text-right"]}>Price</th>
// //                             <th className={styles["text-right"]}>Tax</th>
// //                             <th className={styles["text-right"]}>Total</th>
// //                           </tr>
// //                         </thead>
// //                         <tbody>
// //                           {selectedSale.saleItemResponses.map((item, idx) => (
// //                             <tr key={idx}>
// //                               <td>
// //                                 <p className={styles["item-name"]}>{item.itemName}</p>
// //                                 <p className={styles["item-meta"]}>HSN: {item.itemHsnCode}</p>
// //                               </td>
// //                               <td className={styles["text-center"]}>
// //                                 {item.quantity} {item.unit}
// //                               </td>
// //                               <td className={styles["text-right"]}>
// //                                 ₹{item.pricePerUnit}
// //                               </td>
// //                               <td className={styles["text-right"]}>
// //                                 ₹{item.taxAmount}
// //                               </td>
// //                               <td className={`${styles["text-right"]} ${styles["font-semibold"]}`}>
// //                                 ₹{item.totalAmount}
// //                               </td>
// //                             </tr>
// //                           ))}
// //                         </tbody>
// //                       </table>
// //                     </div>
// //                   </div>
// //                 )}

// //                 {/* Payments */}
// //                 {selectedSale.salePaymentResponses?.length > 0 && (
// //                   <div className={styles["modal-section"]}>
// //                     <h3 className={styles["section-title"]}>Payment History</h3>
// //                     <div className={styles["payment-history"]}>
// //                       {selectedSale.salePaymentResponses.map((payment, idx) => (
// //                         <div key={idx} className={styles["payment-item"]}>
// //                           <div className={styles["payment-header"]}>
// //                             <span className={styles["payment-amount"]}>₹{payment.amountPaid}</span>
// //                             <span className={styles["payment-date"]}>
// //                               {new Date(payment.paymentDate).toLocaleDateString('en-IN')}
// //                             </span>
// //                           </div>
// //                           <div className={styles["payment-details"]}>
// //                             <span className={styles["payment-type"]}>{payment.paymentType}</span>
// //                             {payment.referenceNumber && (
// //                               <span> • Ref: {payment.referenceNumber}</span>
// //                             )}
// //                           </div>
// //                           {payment.paymentDescription && (
// //                             <p className={styles["payment-description"]}>{payment.paymentDescription}</p>
// //                           )}
// //                         </div>
// //                       ))}
// //                     </div>
// //                   </div>
// //                 )}

// //                 {/* Action Buttons */}
// //                 <div className={styles["modal-actions"]}>
// //                   <button 
// //                     onClick={() => handleEdit(selectedSale.saleId)}
// //                     className={`${styles["modal-action-button"]} ${styles.edit}`}
// //                   >
// //                     <Edit size={18} />
// //                     Edit Sale
// //                   </button>
// //                   {selectedSale.balance > 0 && (
// //                     <button
// //                       onClick={() => {
// //                         openPaymentModal(selectedSale);
// //                         setSelectedSale(null);
// //                       }}
// //                       className={`${styles["modal-action-button"]} ${styles.payment}`}
// //                     >
// //                       <DollarSign size={18} />
// //                       Add Payment
// //                     </button>
// //                   )}
// //                   <button 
// //                     onClick={() => deleteSale(selectedSale.saleId)}
// //                     className={`${styles["modal-action-button"]} ${styles.delete}`}
// //                   >
// //                     <Trash2 size={18} />
// //                     Delete
// //                   </button>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         )}

// //         {/* Payment Modal */}
// //         {showPaymentModal && (
// //           <div className={styles["modal-overlay"]} onClick={() => setShowPaymentModal(false)}>
// //             <div className={styles["modal-container"]} onClick={(e) => e.stopPropagation()}>
// //               <div className={`${styles["modal-header"]} ${styles.success}`}>
// //                 <div>
// //                   <h2 className={styles["modal-title"]}>Add Payment</h2>
// //                   <p className={styles["modal-subtitle"]}>Sale #{selectedSaleId}</p>
// //                 </div>
// //                 <button
// //                   onClick={() => setShowPaymentModal(false)}
// //                   className={styles["modal-close"]}
// //                 >
// //                   <X size={24} />
// //                 </button>
// //               </div>
              
// //               <form onSubmit={handleAddPayment} className={styles["payment-form"]}>
// //                 {/* Balance Info */}
// //                 <div className={styles["balance-info"]}>
// //                   <p className={styles["balance-label"]}>Remaining Balance</p>
// //                   <p className={styles["balance-amount"]}>₹{remainingBalance.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
// //                 </div>

// //                 <div className={styles["form-grid"]}>
// //                   <div className={styles["form-group"]}>
// //                     <label className={styles["form-label"]}>
// //                       Receipt No
// //                     </label>
// //                     <input
// //                       type="text"
// //                       value={paymentForm.receiptNo}
// //                       onChange={(e) => setPaymentForm({ ...paymentForm, receiptNo: e.target.value })}
// //                       placeholder="Optional"
// //                       className={styles["form-input"]}
// //                     />
// //                   </div>

// //                   <div className={styles["form-group"]}>
// //                     <label className={styles["form-label"]}>
// //                       Payment Date <span className={styles.required}>*</span>
// //                     </label>
// //                     <input
// //                       type="date"
// //                       value={paymentForm.paymentDate}
// //                       onChange={(e) => setPaymentForm({ ...paymentForm, paymentDate: e.target.value })}
// //                       required
// //                       className={styles["form-input"]}
// //                     />
// //                   </div>

// //                   <div className={styles["form-group"]}>
// //                     <label className={styles["form-label"]}>
// //                       Amount Paid <span className={styles.required}>*</span>
// //                     </label>
// //                     <input
// //                       type="number"
// //                       step="0.01"
// //                       min="0"
// //                       value={paymentForm.amountPaid}
// //                       onChange={(e) => setPaymentForm({ ...paymentForm, amountPaid: e.target.value })}
// //                       required
// //                       placeholder={`Max: ₹${remainingBalance.toFixed(2)}`}
// //                       className={styles["form-input"]}
// //                     />
// //                   </div>

// //                   <div className={styles["form-group"]}>
// //                     <label className={styles["form-label"]}>
// //                       Payment Type <span className={styles.required}>*</span>
// //                     </label>
// //                     <select
// //                       value={paymentForm.paymentType}
// //                       onChange={(e) => setPaymentForm({ ...paymentForm, paymentType: e.target.value })}
// //                       required
// //                       className={styles["form-select"]}
// //                     >
// //                       {paymentTypes.map((type) => (
// //                         <option key={type} value={type}>
// //                           {type}
// //                         </option>
// //                       ))}
// //                     </select>
// //                   </div>

// //                   <div className={`${styles["form-group"]} ${styles["full-width"]}`}>
// //                     <label className={styles["form-label"]}>
// //                       Reference Number
// //                     </label>
// //                     <input
// //                       type="text"
// //                       value={paymentForm.referenceNumber}
// //                       onChange={(e) => setPaymentForm({ ...paymentForm, referenceNumber: e.target.value })}
// //                       placeholder="UPI ID, Cheque #, Transaction ID, etc."
// //                       className={styles["form-input"]}
// //                     />
// //                   </div>

// //                   <div className={`${styles["form-group"]} ${styles["full-width"]}`}>
// //                     <label className={styles["form-label"]}>
// //                       Description
// //                     </label>
// //                     <textarea
// //                       rows="3"
// //                       value={paymentForm.paymentDescription}
// //                       onChange={(e) => setPaymentForm({ ...paymentForm, paymentDescription: e.target.value })}
// //                       placeholder="Optional notes about this payment"
// //                       className={styles["form-textarea"]}
// //                     ></textarea>
// //                   </div>
// //                 </div>

// //                 <div className={styles["form-actions"]}>
// //                   <button
// //                     type="submit"
// //                     disabled={loading}
// //                     className={styles["form-submit"]}
// //                   >
// //                     {loading ? (
// //                       <>
// //                         <div className={styles["loading-spinner"]}></div>
// //                         Adding...
// //                       </>
// //                     ) : (
// //                       <>
// //                         <DollarSign size={18} />
// //                         Add Payment
// //                       </>
// //                     )}
// //                   </button>
// //                   <button
// //                     type="button"
// //                     onClick={() => setShowPaymentModal(false)}
// //                     disabled={loading}
// //                     className={styles["form-cancel"]}
// //                   >
// //                     Cancel
// //                   </button>
// //                 </div>
// //               </form>
// //             </div>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default SalesListEnhanced;










// "use client"

// import { useEffect, useState } from "react"
// import { useNavigate } from "react-router-dom"
// import axios from "axios"
// import config from "../../../config/apiconfig"
// import styles from "../Styles/ScreenUI.module.css"
// import { toast } from "react-toastify"
// import {
//   Plus,
//   Eye,
//   Edit2,
//   Trash2,
//   X,
//   DollarSign,
//   Package,
//   AlertCircle,
//   CheckCircle,
//   ChevronDown,
//   Search,
//   Loader,
// } from "lucide-react"

// const SalesList = () => {
//   const navigate = useNavigate()
//   const userData = JSON.parse(localStorage.getItem("eBilling")) || {}
//   const token = userData?.accessToken || ""
//   const companyId = userData?.selectedCompany?.id || ""

//   const [sales, setSales] = useState([])
//   const [loading, setLoading] = useState(false)
//   const [selectedSale, setSelectedSale] = useState(null)
//   const [showPaymentModal, setShowPaymentModal] = useState(false)
//   const [selectedSaleId, setSelectedSaleId] = useState(null)
//   const [remainingBalance, setRemainingBalance] = useState(0)
//   const [searchTerm, setSearchTerm] = useState("")

//   const [paymentForm, setPaymentForm] = useState({
//     receiptNo: "",
//     paymentDate: new Date().toISOString().split("T")[0],
//     amountPaid: "",
//     paymentType: "CASH",
//     referenceNumber: "",
//     paymentDescription: "",
//   })

//   const paymentTypes = ["CASH", "UPI", "CREDIT_CARD", "DEBIT_CARD", "NET_BANKING", "WALLET", "CHEQUE", "OTHER"]

//   const fetchSales = async () => {
//     if (!token || !companyId) return
//     setLoading(true)
//     try {
//       const res = await axios.get(`${config.BASE_URL}/company/${companyId}/sales`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       })
//       setSales(res.data)
//       console.log("Fetched sales:", res.data)
//     } catch (err) {
//       toast.error("Failed to load sales")
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchSales()
//   }, [token, companyId])

//   const deleteSale = async (saleId) => {
//     if (!window.confirm("Are you sure you want to delete this sale?")) return

//     try {
//       await axios.delete(`${config.BASE_URL}/sale/${saleId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       setSales((prev) => prev.filter((s) => s.saleId !== saleId))
//       toast.success("Sale deleted successfully")
//       setSelectedSale(null)
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to delete sale")
//     }
//   }

//   const handleEdit = (saleId) => {
//     navigate(`/createsale?edit=${saleId}`)
//     setSelectedSale(null)
//   }

//   const openPaymentModal = (sale) => {
//     setSelectedSaleId(sale.saleId)
//     setRemainingBalance(Number.parseFloat(sale.balance) || 0)
//     setPaymentForm({
//       receiptNo: "",
//       paymentDate: new Date().toISOString().split("T")[0],
//       amountPaid: "",
//       paymentType: "CASH",
//       referenceNumber: "",
//       paymentDescription: "",
//     })
//     setShowPaymentModal(true)
//   }

//   const handleAddPayment = async (e) => {
//     e.preventDefault()
//     if (!selectedSaleId) return

//     const amount = Number.parseFloat(paymentForm.amountPaid)
//     if (!paymentForm.paymentDate || !paymentForm.amountPaid || !paymentForm.paymentType) {
//       toast.error("Payment Date, Amount, and Type are required")
//       return
//     }
//     if (isNaN(amount) || amount <= 0) {
//       toast.error("Amount must be greater than 0")
//       return
//     }
//     if (amount > remainingBalance) {
//       toast.error(`Payment amount (₹${amount}) exceeds remaining balance (₹${remainingBalance})`)
//       return
//     }

//     const paymentId = Date.now() * 1000 + Math.floor(Math.random() * 1000)

//     const payload = {
//       paymentId,
//       receiptNo: paymentForm.receiptNo || null,
//       paymentDate: paymentForm.paymentDate,
//       amountPaid: amount,
//       paymentType: paymentForm.paymentType,
//       referenceNumber: paymentForm.referenceNumber || null,
//       paymentDescription: paymentForm.paymentDescription || null,
//     }

//     try {
//       setLoading(true)
//       await axios.post(`${config.BASE_URL}/sale/${selectedSaleId}/add-payment`, payload, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       })

//       toast.success("Payment added successfully!")
//       setShowPaymentModal(false)
//       fetchSales()
//       setSelectedSale(null)
//     } catch (err) {
//       console.error("Add payment error:", err.response?.data)
//       toast.error(err.response?.data?.message || "Failed to add payment")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const filteredSales = sales.filter(
//     (s) =>
//       s.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       s.partyResponseDto?.name?.toLowerCase().includes(searchTerm.toLowerCase()),
//   )

//   return (
//     <div className={styles["company-form-container"]}>
//       {/* Header Section */}
//       <div className={styles["form-header"]}>
//         <div className={styles["header-content"]}>
//           <div className={styles["header-text"]}>
//             <h1 className={styles["company-form-title"]}>Sales Invoices</h1>
//             <p className={styles["form-subtitle"]}>Manage all your invoices</p>
//           </div>
//         </div>
//         <button onClick={() => navigate("/createsale")} className={styles["submit-button"]} disabled={loading}>
//           <Plus size={18} />
//           <span>Create Sale</span>
//         </button>
//       </div>

//       {/* Search Bar */}
//       <div className={styles["search-container"]}>
//         <Search size={18} className={styles["search-icon"]} />
//         <input
//           type="text"
//           placeholder="Search by invoice number or party name..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className={styles["search-input"]}
//         />
//       </div>

//       {/* Loading State */}
//       {loading && (
//         <div className={styles["loading-message"]}>
//           <Loader size={32} className={styles["spinner"]} />
//           <p>Loading sales...</p>
//         </div>
//       )}

//       {/* Sales Grid/Table */}
//       {filteredSales.length > 0 ? (
//         <>
//           {/* Desktop Table View */}
//           <div className={styles["table-wrapper"]}>
//             <table className={styles.table}>
//               <thead>
//                 <tr>
//                   <th>Invoice Number</th>
//                   <th>Invoice Date</th>
//                   <th>Due Date</th>
//                   <th>Party Name</th>
//                   <th>Total Amount</th>
//                   <th>Received</th>
//                   <th>Balance</th>
//                   <th>Status</th>
//                   <th>Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredSales.map((s) => (
//                   <tr key={s.saleId} className={styles["table-row"]}>
//                     <td className={styles["invoice-cell"]}>
//                       <span className={styles["invoice-badge"]}>{s.invoiceNumber}</span>
//                     </td>
//                     <td>{new Date(s.invoceDate).toLocaleDateString()}</td>
//                     <td>{new Date(s.dueDate).toLocaleDateString()}</td>
//                     <td>
//                       <span className={styles["party-name"]}>{s.partyResponseDto?.name || "—"}</span>
//                     </td>
//                     <td className={styles["amount-cell"]}>
//                       <span className={styles["amount"]}>₹{Number.parseFloat(s.totalAmount).toFixed(2)}</span>
//                     </td>
//                     <td className={styles["received-cell"]}>₹{Number.parseFloat(s.receivedAmount).toFixed(2)}</td>
//                     <td className={styles["balance-cell"]}>
//                       <span className={s.balance > 0 ? styles["balance-pending"] : styles["balance-paid"]}>
//                         ₹{Number.parseFloat(s.balance).toFixed(2)}
//                       </span>
//                     </td>
//                     <td>
//                       <span className={s.balance > 0 ? styles["status-pending"] : styles["status-paid"]}>
//                         {s.balance > 0 ? "Pending" : "Paid"}
//                       </span>
//                     </td>
//                     <td className={styles["actions-cell"]}>
//                       <button
//                         onClick={() => setSelectedSale(s)}
//                         className={`${styles["action-button"]} ${styles["view-button"]}`}
//                         title="View details"
//                       >
//                         <Eye size={16} />
//                         <span>View</span>
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Mobile Card View */}
//           <div className={styles["mobile-cards-container"]}>
//             {filteredSales.map((s) => (
//               <div key={s.saleId} className={styles["invoice-card"]}>
//                 <div className={styles["card-header-mobile"]}>
//                   <div className={styles["card-title-section"]}>
//                     <h3 className={styles["card-invoice-number"]}>{s.invoiceNumber}</h3>
//                     <span className={s.balance > 0 ? styles["status-badge-pending"] : styles["status-badge-paid"]}>
//                       {s.balance > 0 ? "Pending" : "Paid"}
//                     </span>
//                   </div>
//                   <button onClick={() => setSelectedSale(s)} className={styles["card-action-button"]}>
//                     <ChevronDown size={20} />
//                   </button>
//                 </div>

//                 <div className={styles["card-body"]}>
//                   <div className={styles["card-info-row"]}>
//                     <span className={styles["info-label"]}>Party:</span>
//                     <span className={styles["info-value"]}>{s.partyResponseDto?.name || "—"}</span>
//                   </div>

//                   <div className={styles["card-info-row"]}>
//                     <span className={styles["info-label"]}>Date:</span>
//                     <span className={styles["info-value"]}>{new Date(s.invoceDate).toLocaleDateString()}</span>
//                   </div>

//                   <div className={styles["card-info-row"]}>
//                     <span className={styles["info-label"]}>Total:</span>
//                     <span className={styles["info-value-amount"]}>₹{Number.parseFloat(s.totalAmount).toFixed(2)}</span>
//                   </div>

//                   <div className={styles["card-info-row"]}>
//                     <span className={styles["info-label"]}>Balance:</span>
//                     <span className={s.balance > 0 ? styles["info-value-pending"] : styles["info-value-paid"]}>
//                       ₹{Number.parseFloat(s.balance).toFixed(2)}
//                     </span>
//                   </div>
//                 </div>

//                 <div className={styles["card-footer"]}>
//                   <button onClick={() => setSelectedSale(s)} className={styles["card-view-button"]}>
//                     <Eye size={16} />
//                     View Details
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </>
//       ) : (
//         <div className={styles["no-data"]}>
//           <Package size={48} />
//           <p>No sales found</p>
//           <p className={styles["no-data-subtitle"]}>
//             {searchTerm ? "Try adjusting your search criteria" : 'Click "Create Sale" to add your first invoice.'}
//           </p>
//         </div>
//       )}

//       {/* VIEW MODAL WITH ACTIONS */}
//       {selectedSale && (
//         <div className={styles["modal-overlay"]} onClick={() => setSelectedSale(null)}>
//           <div className={styles["detail-card"]} onClick={(e) => e.stopPropagation()}>
//             <div className={styles["card-header"]}>
//               <div className={styles["header-title-section"]}>
//                 <h3>Sale #{selectedSale.saleId}</h3>
//                 <div className={`${styles["balance-badge"]} ${selectedSale.balance <= 0 ? styles.paid : ""}`}>
//                   {selectedSale.balance > 0 ? (
//                     <>
//                       <AlertCircle size={16} />
//                       Balance: ₹{Number.parseFloat(selectedSale.balance).toFixed(2)}
//                     </>
//                   ) : (
//                     <>
//                       <CheckCircle size={16} />
//                       Paid: ₹{Number.parseFloat(selectedSale.balance).toFixed(2)}
//                     </>
//                   )}
//                 </div>
//               </div>
//               <div className={styles["header-actions"]}>
//                 <button
//                   onClick={() => handleEdit(selectedSale.saleId)}
//                   className={`${styles["action-button"]} ${styles["edit-button"]}`}
//                   title="Edit sale"
//                 >
//                   <Edit2 size={16} />
//                   <span>Edit</span>
//                 </button>

//                 {selectedSale.balance > 0 && (
//                   <button
//                     onClick={() => openPaymentModal(selectedSale)}
//                     className={`${styles["action-button"]} ${styles["payment-button"]}`}
//                     title="Add Payment"
//                   >
//                     <DollarSign size={16} />
//                     <span>Add Payment</span>
//                   </button>
//                 )}

//                 <button
//                   onClick={() => deleteSale(selectedSale.saleId)}
//                   className={`${styles["action-button"]} ${styles["delete-button"]}`}
//                   title="Delete sale"
//                 >
//                   <Trash2 size={16} />
//                   <span>Delete</span>
//                 </button>

//                 <button className={styles["close-modal-btn"]} onClick={() => setSelectedSale(null)} title="Close">
//                   <X size={20} />
//                 </button>
//               </div>
//             </div>

//             {/* Invoice Details */}
//             <section className={styles["card-section"]}>
//               <h4 className={styles["section-title"]}>Invoice Details</h4>
//               <div className={styles["detail-grid"]}>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>Invoice Number:</span>
//                   <span className={styles["detail-value"]}>{selectedSale.invoiceNumber || "—"}</span>
//                 </div>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>Invoice Date:</span>
//                   <span className={styles["detail-value"]}>
//                     {new Date(selectedSale.invoceDate).toLocaleDateString()}
//                   </span>
//                 </div>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>Due Date:</span>
//                   <span className={styles["detail-value"]}>{new Date(selectedSale.dueDate).toLocaleDateString()}</span>
//                 </div>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>Sale Type:</span>
//                   <span className={styles["detail-value"]}>{selectedSale.saleType}</span>
//                 </div>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>State of Supply:</span>
//                   <span className={styles["detail-value"]}>{selectedSale.stateOfSupply?.replace(/_/g, " ")}</span>
//                 </div>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>Payment Type:</span>
//                   <span className={styles["detail-value"]}>{selectedSale.paymentType}</span>
//                 </div>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>Billing Address:</span>
//                   <span className={styles["detail-value"]}>{selectedSale.billingAddress || "—"}</span>
//                 </div>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>Shipping Address:</span>
//                   <span className={styles["detail-value"]}>{selectedSale.shippingAddress || "—"}</span>
//                 </div>
//               </div>

//               <div className={styles["amount-breakdown"]}>
//                 <div className={styles["breakdown-row"]}>
//                   <span>Total (ex-tax):</span>
//                   <span>₹{selectedSale.totalAmountWithoutTax}</span>
//                 </div>
//                 <div className={styles["breakdown-row"]}>
//                   <span>Tax Amount:</span>
//                   <span>₹{selectedSale.totalTaxAmount}</span>
//                 </div>
//                 <div className={styles["breakdown-row"]}>
//                   <span>Delivery Charges:</span>
//                   <span>₹{selectedSale.deliveryCharges}</span>
//                 </div>
//                 <div className={styles[("breakdown-row", "total")]}>
//                   <span>Total Amount:</span>
//                   <span className={styles["total-amount"]}>₹{selectedSale.totalAmount}</span>
//                 </div>
//                 <div className={styles["breakdown-row"]}>
//                   <span>Received:</span>
//                   <span>₹{selectedSale.receivedAmount}</span>
//                 </div>
//                 <div
//                   className={`${styles["breakdown-row"]} ${
//                     selectedSale.balance > 0 ? styles["balance-row-pending"] : styles["balance-row-paid"]
//                   }`}
//                 >
//                   <span>Balance:</span>
//                   <span className={styles["balance-amount"]}>
//                     ₹{Number.parseFloat(selectedSale.balance).toFixed(2)}
//                   </span>
//                 </div>
//               </div>
//             </section>

//             {/* Party */}
//             {selectedSale.partyResponseDto && (
//               <section className={styles["card-section"]}>
//                 <h4 className={styles["section-title"]}>Party Details</h4>
//                 <div className={styles["detail-grid"]}>
//                   <div className={styles["detail-item"]}>
//                     <span className={styles["detail-label"]}>Name:</span>
//                     <span className={styles["detail-value"]}>{selectedSale.partyResponseDto.name}</span>
//                   </div>
//                   <div className={styles["detail-item"]}>
//                     <span className={styles["detail-label"]}>Party ID:</span>
//                     <span className={styles["detail-value"]}>{selectedSale.partyResponseDto.partyId}</span>
//                   </div>
//                   <div className={styles["detail-item"]}>
//                     <span className={styles["detail-label"]}>GSTIN:</span>
//                     <span className={styles["detail-value"]}>{selectedSale.partyResponseDto.gstin || "—"}</span>
//                   </div>
//                   <div className={styles["detail-item"]}>
//                     <span className={styles["detail-label"]}>GST Type:</span>
//                     <span className={styles["detail-value"]}>
//                       {selectedSale.partyResponseDto.gstType?.replace(/_/g, " ")}
//                     </span>
//                   </div>
//                   <div className={styles["detail-item"]}>
//                     <span className={styles["detail-label"]}>Phone:</span>
//                     <span className={styles["detail-value"]}>{selectedSale.partyResponseDto.phoneNo || "—"}</span>
//                   </div>
//                   <div className={styles["detail-item"]}>
//                     <span className={styles["detail-label"]}>Email:</span>
//                     <span className={styles["detail-value"]}>{selectedSale.partyResponseDto.emailId || "—"}</span>
//                   </div>
//                   <div className={styles["detail-item"]}>
//                     <span className={styles["detail-label"]}>State:</span>
//                     <span className={styles["detail-value"]}>
//                       {selectedSale.partyResponseDto.state?.replace(/_/g, " ")}
//                     </span>
//                   </div>
//                   <div className={styles["detail-item"]}>
//                     <span className={styles["detail-label"]}>Billing Address:</span>
//                     <span className={styles["detail-value"]}>
//                       {selectedSale.partyResponseDto.billingAddress || "—"}
//                     </span>
//                   </div>
//                 </div>
//               </section>
//             )}

//             {/* Items */}
//             <section className={styles["card-section"]}>
//               <h4 className={styles["section-title"]}>Items</h4>
//               {selectedSale.saleItemResponses?.length > 0 ? (
//                 <div className={styles["items-table-wrapper"]}>
//                   <table className={styles["items-table"]}>
//                     <thead>
//                       <tr>
//                         <th>Name</th>
//                         <th>HSN</th>
//                         <th>Desc</th>
//                         <th>Qty</th>
//                         <th>Unit</th>
//                         <th>Price/Unit</th>
//                         <th>Tax Type</th>
//                         <th>Tax Rate</th>
//                         <th>Tax</th>
//                         <th>Total</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {selectedSale.saleItemResponses.map((it, i) => (
//                         <tr key={i}>
//                           <td>{it.itemName}</td>
//                           <td>{it.itemHsnCode}</td>
//                           <td>{it.itemDescription || "—"}</td>
//                           <td>{it.quantity}</td>
//                           <td>{it.unit}</td>
//                           <td>₹{it.pricePerUnit}</td>
//                           <td>{it.pricePerUnitTaxType}</td>
//                           <td>{it.taxRate}</td>
//                           <td>₹{it.taxAmount}</td>
//                           <td>₹{it.totalAmount}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               ) : (
//                 <p>No items</p>
//               )}
//             </section>

//             {/* Payments */}
//             <section className={styles["card-section"]}>
//               <h4 className={styles["section-title"]}>Payments</h4>
//               {selectedSale.salePaymentResponses?.length > 0 ? (
//                 <ul className={styles["payment-list"]}>
//                   {selectedSale.salePaymentResponses.map((p, i) => (
//                     <li key={i} className={styles["payment-item"]}>
//                       <div className={styles["payment-info"]}>
//                         <span className={styles["payment-amount"]}>₹{p.amountPaid}</span>
//                         <span className={styles["payment-date"]}>{new Date(p.paymentDate).toLocaleDateString()}</span>
//                       </div>
//                       <div className={styles["payment-type"]}>{p.paymentType}</div>
//                       {p.referenceNumber && <div className={styles["payment-ref"]}>Ref: {p.referenceNumber}</div>}
//                       {p.receiptNo && <div className={styles["payment-receipt"]}>Receipt: {p.receiptNo}</div>}
//                       {p.paymentDescription && <div className={styles["payment-desc"]}>{p.paymentDescription}</div>}
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

//       {/* ADD PAYMENT MODAL */}
//       {showPaymentModal && (
//         <div className={styles["modal-overlay"]} onClick={() => setShowPaymentModal(false)}>
//           <div className={styles["payment-modal"]} onClick={(e) => e.stopPropagation()}>
//             <div className={styles["modal-header"]}>
//               <h3>Add Payment for Sale #{selectedSaleId}</h3>
//               <button className={styles["close-modal-btn"]} onClick={() => setShowPaymentModal(false)}>
//                 <X size={20} />
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
//                       setPaymentForm({
//                         ...paymentForm,
//                         receiptNo: e.target.value,
//                       })
//                     }
//                     className={styles["form-input"]}
//                     placeholder="Optional"
//                   />
//                 </div>

//                 <div className={styles["form-group"]}>
//                   <label>
//                     Payment Date <span className={styles.required}>*</span>
//                   </label>
//                   <input
//                     type="date"
//                     value={paymentForm.paymentDate}
//                     onChange={(e) =>
//                       setPaymentForm({
//                         ...paymentForm,
//                         paymentDate: e.target.value,
//                       })
//                     }
//                     required
//                     className={styles["form-input"]}
//                   />
//                 </div>
//               </div>

//               <div className={styles["form-row"]}>
//                 <div className={styles["form-group"]}>
//                   <label>
//                     Amount Paid <span className={styles.required}>*</span>
//                   </label>
//                   <input
//                     type="number"
//                     step="0.01"
//                     min="0"
//                     value={paymentForm.amountPaid}
//                     onChange={(e) =>
//                       setPaymentForm({
//                         ...paymentForm,
//                         amountPaid: e.target.value,
//                       })
//                     }
//                     required
//                     className={styles["form-input"]}
//                     placeholder={`Max: ₹${remainingBalance.toFixed(2)}`}
//                   />
//                   <small className={styles["balance-info"]}>Remaining Balance: ₹{remainingBalance.toFixed(2)}</small>
//                 </div>

//                 <div className={styles["form-group"]}>
//                   <label>
//                     Payment Type <span className={styles.required}>*</span>
//                   </label>
//                   <select
//                     value={paymentForm.paymentType}
//                     onChange={(e) =>
//                       setPaymentForm({
//                         ...paymentForm,
//                         paymentType: e.target.value,
//                       })
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
//                       setPaymentForm({
//                         ...paymentForm,
//                         referenceNumber: e.target.value,
//                       })
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
//                       setPaymentForm({
//                         ...paymentForm,
//                         paymentDescription: e.target.value,
//                       })
//                     }
//                     className={`${styles["form-input"]} ${styles.textarea}`}
//                     placeholder="Optional notes"
//                   />
//                 </div>
//               </div>

//               <div className={styles["form-actions"]}>
//                 <button type="submit" className={styles["submit-button"]} disabled={loading}>
//                   {loading ? (
//                     <>
//                       <Loader size={16} className={styles["button-spinner"]} />
//                       Adding...
//                     </>
//                   ) : (
//                     <>
//                       <DollarSign size={16} />
//                       Add Payment
//                     </>
//                   )}
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
//   )
// }

// export default SalesList








"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import config from "../../../config/apiconfig"
import styles from "../Styles/ScreenUI.module.css"
import { toast } from "react-toastify"
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
} from "lucide-react"

const SalesList = () => {
  const navigate = useNavigate()
  const userData = JSON.parse(localStorage.getItem("eBilling")) || {}
  const token = userData?.accessToken || ""
  const companyId = userData?.selectedCompany?.id || ""

  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedSale, setSelectedSale] = useState(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedSaleId, setSelectedSaleId] = useState(null)
  const [remainingBalance, setRemainingBalance] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")

  const [paymentForm, setPaymentForm] = useState({
    receiptNo: "",
    paymentDate: new Date().toISOString().split("T")[0],
    amountPaid: "",
    paymentType: "CASH",
    referenceNumber: "",
    paymentDescription: "",
  })

  const paymentTypes = ["CASH", "UPI", "CREDIT_CARD", "DEBIT_CARD", "NET_BANKING", "WALLET", "CHEQUE", "OTHER"]

  const fetchSales = async () => {
    if (!token || !companyId) return
    setLoading(true)
    try {
      const res = await axios.get(`${config.BASE_URL}/company/${companyId}/sales`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      setSales(res.data)
      console.log("Fetched sales:", res.data)
    } catch (err) {
      toast.error("Failed to load sales")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSales()
  }, [token, companyId])

  const deleteSale = async (saleId) => {
    if (!window.confirm("Are you sure you want to delete this sale?")) return

    try {
      await axios.delete(`${config.BASE_URL}/sale/${saleId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setSales((prev) => prev.filter((s) => s.saleId !== saleId))
      toast.success("Sale deleted successfully")
      setSelectedSale(null)
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete sale")
    }
  }

  const handleEdit = (saleId) => {
    navigate(`/createsale?edit=${saleId}`)
    setSelectedSale(null)
  }

  const openPaymentModal = (sale) => {
    setSelectedSaleId(sale.saleId)
    setRemainingBalance(Number.parseFloat(sale.balance) || 0)
    setPaymentForm({
      receiptNo: "",
      paymentDate: new Date().toISOString().split("T")[0],
      amountPaid: "",
      paymentType: "CASH",
      referenceNumber: "",
      paymentDescription: "",
    })
    setShowPaymentModal(true)
  }

  const handleAddPayment = async (e) => {
    e.preventDefault()
    if (!selectedSaleId) return

    const amount = Number.parseFloat(paymentForm.amountPaid)
    if (!paymentForm.paymentDate || !paymentForm.amountPaid || !paymentForm.paymentType) {
      toast.error("Payment Date, Amount, and Type are required")
      return
    }
    if (isNaN(amount) || amount <= 0) {
      toast.error("Amount must be greater than 0")
      return
    }
    if (amount > remainingBalance) {
      toast.error(`Payment amount (₹${amount}) exceeds remaining balance (₹${remainingBalance})`)
      return
    }

    const paymentId = Date.now() * 1000 + Math.floor(Math.random() * 1000)

    const payload = {
      paymentId,
      receiptNo: paymentForm.receiptNo || null,
      paymentDate: paymentForm.paymentDate,
      amountPaid: amount,
      paymentType: paymentForm.paymentType,
      referenceNumber: paymentForm.referenceNumber || null,
      paymentDescription: paymentForm.paymentDescription || null,
    }

    try {
      setLoading(true)
      await axios.post(`${config.BASE_URL}/sale/${selectedSaleId}/add-payment`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      toast.success("Payment added successfully!")
      setShowPaymentModal(false)
      fetchSales()
      setSelectedSale(null)
    } catch (err) {
      console.error("Add payment error:", err.response?.data)
      toast.error(err.response?.data?.message || "Failed to add payment")
    } finally {
      setLoading(false)
    }
  }

  const filteredSales = sales.filter(
    (s) =>
      s.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.partyResponseDto?.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className={styles["company-form-container"]}>
      {/* Header Section */}
      <div className={styles["form-header"]}>
        <div className={styles["header-content"]}>
          <div className={styles["header-text"]}>
            <h1 className={styles["company-form-title"]}>Sales Invoices</h1>
            <p className={styles["form-subtitle"]}>Manage all your invoices</p>
          </div>
        </div>
        <button onClick={() => navigate("/createsale")} className={styles["submit-button"]} disabled={loading}>
          <Plus size={18} />
          <span>Create Sale</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className={styles["search-container"]}>
        <Search size={18} className={styles["search-icon"]} />
        <input
          type="text"
          placeholder="Search by invoice number or party name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles["search-input"]}
        />
      </div>

      {/* Loading State */}
      {loading && (
        <div className={styles["loading-message"]}>
          <Loader size={32} className={styles["spinner"]} />
          <p>Loading sales...</p>
        </div>
      )}

      {/* Sales Grid/Table */}
      {filteredSales.length > 0 ? (
        <>
          {/* Desktop Table View */}
          <div className={styles["table-wrapper"]}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Invoice Number</th>
                  <th>Invoice Date</th>
                  <th>Due Date</th>
                  <th>Party Name</th>
                  <th>Total Amount</th>
                  <th>Received</th>
                  <th>Balance</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.map((s) => (
                  <tr key={s.saleId} className={styles["table-row"]}>
                    <td className={styles["invoice-cell"]}>
                      <span className={styles["invoice-badge"]}>{s.invoiceNumber}</span>
                    </td>
                    <td>{new Date(s.invoceDate).toLocaleDateString()}</td>
                    <td>{new Date(s.dueDate).toLocaleDateString()}</td>
                    <td>
                      <span className={styles["party-name"]}>{s.partyResponseDto?.name || "—"}</span>
                    </td>
                    <td className={styles["amount-cell"]}>
                      <span className={styles["amount"]}>₹{Number.parseFloat(s.totalAmount).toFixed(2)}</span>
                    </td>
                    <td className={styles["received-cell"]}>₹{Number.parseFloat(s.receivedAmount).toFixed(2)}</td>
                    <td className={styles["balance-cell"]}>
                      <span className={s.balance > 0 ? styles["balance-pending"] : styles["balance-paid"]}>
                        ₹{Number.parseFloat(s.balance).toFixed(2)}
                      </span>
                    </td>
                    <td>
                      <span className={s.balance > 0 ? styles["status-pending"] : styles["status-paid"]}>
                        {s.balance > 0 ? "Pending" : "Paid"}
                      </span>
                    </td>
                    <td className={styles["actions-cell"]}>
                      <button
                        onClick={() => setSelectedSale(s)}
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
            {filteredSales.map((s) => (
              <div key={s.saleId} className={styles["invoice-card"]}>
                <div className={styles["card-header-mobile"]}>
                  <div className={styles["card-title-section"]}>
                    <h3 className={styles["card-invoice-number"]}>{s.invoiceNumber}</h3>
                    <span className={s.balance > 0 ? styles["status-badge-pending"] : styles["status-badge-paid"]}>
                      {s.balance > 0 ? "Pending" : "Paid"}
                    </span>
                  </div>
                  <button onClick={() => setSelectedSale(s)} className={styles["card-action-button"]}>
                    <ChevronDown size={20} />
                  </button>
                </div>

                <div className={styles["card-body"]}>
                  <div className={styles["card-info-row"]}>
                    <span className={styles["info-label"]}>Party:</span>
                    <span className={styles["info-value"]}>{s.partyResponseDto?.name || "—"}</span>
                  </div>

                  <div className={styles["card-info-row"]}>
                    <span className={styles["info-label"]}>Date:</span>
                    <span className={styles["info-value"]}>{new Date(s.invoceDate).toLocaleDateString()}</span>
                  </div>

                  <div className={styles["card-info-row"]}>
                    <span className={styles["info-label"]}>Total:</span>
                    <span className={styles["info-value-amount"]}>₹{Number.parseFloat(s.totalAmount).toFixed(2)}</span>
                  </div>

                  <div className={styles["card-info-row"]}>
                    <span className={styles["info-label"]}>Balance:</span>
                    <span className={s.balance > 0 ? styles["info-value-pending"] : styles["info-value-paid"]}>
                      ₹{Number.parseFloat(s.balance).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className={styles["card-footer"]}>
                  <button onClick={() => setSelectedSale(s)} className={styles["card-view-button"]}>
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
          <p>No sales found</p>
          <p className={styles["no-data-subtitle"]}>
            {searchTerm ? "Try adjusting your search criteria" : 'Click "Create Sale" to add your first invoice.'}
          </p>
        </div>
      )}

      {/* VIEW MODAL WITH ACTIONS */}
      {selectedSale && (
        <div className={styles["modal-overlay"]} onClick={() => setSelectedSale(null)}>
          <div className={styles["detail-card"]} onClick={(e) => e.stopPropagation()}>
            <div className={styles["card-header"]}>
              <div className={styles["header-title-section"]}>
                <h3>Sale #{selectedSale.saleId}</h3>
                <div className={`${styles["balance-badge"]} ${selectedSale.balance <= 0 ? styles.paid : ""}`}>
                  {selectedSale.balance > 0 ? (
                    <>
                      <AlertCircle size={16} />
                      Balance: ₹{Number.parseFloat(selectedSale.balance).toFixed(2)}
                    </>
                  ) : (
                    <>
                      <CheckCircle size={16} />
                      Paid: ₹{Number.parseFloat(selectedSale.balance).toFixed(2)}
                    </>
                  )}
                </div>
              </div>
              <div className={styles["header-actions"]}>
                <button
                  onClick={() => handleEdit(selectedSale.saleId)}
                  className={`${styles["action-button"]} ${styles["edit-button"]}`}
                  title="Edit sale"
                >
                  <Edit2 size={16} />
                  <span>Edit</span>
                </button>

                {selectedSale.balance > 0 && (
                  <button
                    onClick={() => openPaymentModal(selectedSale)}
                    className={`${styles["action-button"]} ${styles["payment-button"]}`}
                    title="Add Payment"
                  >
                    <DollarSign size={16} />
                    <span>Add Payment</span>
                  </button>
                )}

                <button
                  onClick={() => deleteSale(selectedSale.saleId)}
                  className={`${styles["action-button"]} ${styles["delete-button"]}`}
                  title="Delete sale"
                >
                  <Trash2 size={16} />
                  <span>Delete</span>
                </button>

                <button className={styles["close-modal-btn"]} onClick={() => setSelectedSale(null)} title="Close">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Invoice Details */}
            <section className={styles["card-section"]}>
              <h4 className={styles["section-title"]}>Invoice Details</h4>
              <div className={styles["detail-grid"]}>
                <div className={styles["detail-item"]}>
                  <span className={styles["detail-label"]}>Invoice Number:</span>
                  <span className={styles["detail-value"]}>{selectedSale.invoiceNumber || "—"}</span>
                </div>
                <div className={styles["detail-item"]}>
                  <span className={styles["detail-label"]}>Invoice Date:</span>
                  <span className={styles["detail-value"]}>
                    {new Date(selectedSale.invoceDate).toLocaleDateString()}
                  </span>
                </div>
                <div className={styles["detail-item"]}>
                  <span className={styles["detail-label"]}>Due Date:</span>
                  <span className={styles["detail-value"]}>{new Date(selectedSale.dueDate).toLocaleDateString()}</span>
                </div>
                <div className={styles["detail-item"]}>
                  <span className={styles["detail-label"]}>Sale Type:</span>
                  <span className={styles["detail-value"]}>{selectedSale.saleType}</span>
                </div>
                <div className={styles["detail-item"]}>
                  <span className={styles["detail-label"]}>State of Supply:</span>
                  <span className={styles["detail-value"]}>{selectedSale.stateOfSupply?.replace(/_/g, " ")}</span>
                </div>
                <div className={styles["detail-item"]}>
                  <span className={styles["detail-label"]}>Payment Type:</span>
                  <span className={styles["detail-value"]}>{selectedSale.paymentType}</span>
                </div>
                <div className={styles["detail-item"]}>
                  <span className={styles["detail-label"]}>Billing Address:</span>
                  <span className={styles["detail-value"]}>{selectedSale.billingAddress || "—"}</span>
                </div>
                <div className={styles["detail-item"]}>
                  <span className={styles["detail-label"]}>Shipping Address:</span>
                  <span className={styles["detail-value"]}>{selectedSale.shippingAddress || "—"}</span>
                </div>
              </div>

              <div className={styles["amount-breakdown"]}>
                <div className={styles["breakdown-row"]}>
                  <span>Total (ex-tax):</span>
                  <span>₹{selectedSale.totalAmountWithoutTax}</span>
                </div>
                <div className={styles["breakdown-row"]}>
                  <span>Tax Amount:</span>
                  <span>₹{selectedSale.totalTaxAmount}</span>
                </div>
                <div className={styles["breakdown-row"]}>
                  <span>Delivery Charges:</span>
                  <span>₹{selectedSale.deliveryCharges}</span>
                </div>
                <div className={styles["breakdown-row"]}>
                  <span>Total Amount:</span>
                  <span className={styles["total-amount"]}>₹{selectedSale.totalAmount}</span>
                </div>
                <div className={styles["breakdown-row"]}>
                  <span>Received:</span>
                  <span>₹{selectedSale.receivedAmount}</span>
                </div>
                <div
                  className={`${styles["breakdown-row"]} ${
                    selectedSale.balance > 0 ? styles["balance-row-pending"] : styles["balance-row-paid"]
                  }`}
                >
                  <span>Balance:</span>
                  <span className={styles["balance-amount"]}>
                    ₹{Number.parseFloat(selectedSale.balance).toFixed(2)}
                  </span>
                </div>
              </div>
            </section>

            {/* Party */}
            {selectedSale.partyResponseDto && (
              <section className={styles["card-section"]}>
                <h4 className={styles["section-title"]}>Party Details</h4>
                <div className={styles["detail-grid"]}>
                  <div className={styles["detail-item"]}>
                    <span className={styles["detail-label"]}>Name:</span>
                    <span className={styles["detail-value"]}>{selectedSale.partyResponseDto.name}</span>
                  </div>
                  <div className={styles["detail-item"]}>
                    <span className={styles["detail-label"]}>Party ID:</span>
                    <span className={styles["detail-value"]}>{selectedSale.partyResponseDto.partyId}</span>
                  </div>
                  <div className={styles["detail-item"]}>
                    <span className={styles["detail-label"]}>GSTIN:</span>
                    <span className={styles["detail-value"]}>{selectedSale.partyResponseDto.gstin || "—"}</span>
                  </div>
                  <div className={styles["detail-item"]}>
                    <span className={styles["detail-label"]}>GST Type:</span>
                    <span className={styles["detail-value"]}>
                      {selectedSale.partyResponseDto.gstType?.replace(/_/g, " ")}
                    </span>
                  </div>
                  <div className={styles["detail-item"]}>
                    <span className={styles["detail-label"]}>Phone:</span>
                    <span className={styles["detail-value"]}>{selectedSale.partyResponseDto.phoneNo || "—"}</span>
                  </div>
                  <div className={styles["detail-item"]}>
                    <span className={styles["detail-label"]}>Email:</span>
                    <span className={styles["detail-value"]}>{selectedSale.partyResponseDto.emailId || "—"}</span>
                  </div>
                  <div className={styles["detail-item"]}>
                    <span className={styles["detail-label"]}>State:</span>
                    <span className={styles["detail-value"]}>
                      {selectedSale.partyResponseDto.state?.replace(/_/g, " ")}
                    </span>
                  </div>
                  <div className={styles["detail-item"]}>
                    <span className={styles["detail-label"]}>Billing Address:</span>
                    <span className={styles["detail-value"]}>
                      {selectedSale.partyResponseDto.billingAddress || "—"}
                    </span>
                  </div>
                </div>
              </section>
            )}

            {/* Items */}
            <section className={styles["card-section"]}>
              <h4 className={styles["section-title"]}>Items</h4>
              {selectedSale.saleItemResponses?.length > 0 ? (
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
                </div>
              ) : (
                <p>No items</p>
              )}
            </section>

            {/* Payments */}
            <section className={styles["card-section"]}>
              <h4 className={styles["section-title"]}>Payments</h4>
              {selectedSale.salePaymentResponses?.length > 0 ? (
                <ul className={styles["payment-list"]}>
                  {selectedSale.salePaymentResponses.map((p, i) => (
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
              <h3>Add Payment for Sale #{selectedSaleId}</h3>
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
                      setPaymentForm({
                        ...paymentForm,
                        receiptNo: e.target.value,
                      })
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
                      setPaymentForm({
                        ...paymentForm,
                        paymentDate: e.target.value,
                      })
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
                      setPaymentForm({
                        ...paymentForm,
                        amountPaid: e.target.value,
                      })
                    }
                    required
                    className={styles["form-input"]}
                    placeholder={`Max: ₹${remainingBalance.toFixed(2)}`}
                  />
                  <small className={styles["balance-info"]}>💰 Remaining Balance: ₹{remainingBalance.toFixed(2)}</small>
                </div>

                <div className={styles["form-group"]}>
                  <label>
                    Payment Type <span className={styles.required}>*</span>
                  </label>
                  <select
                    value={paymentForm.paymentType}
                    onChange={(e) =>
                      setPaymentForm({
                        ...paymentForm,
                        paymentType: e.target.value,
                      })
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
                      setPaymentForm({
                        ...paymentForm,
                        referenceNumber: e.target.value,
                      })
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
                      setPaymentForm({
                        ...paymentForm,
                        paymentDescription: e.target.value,
                      })
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
  )
}

export default SalesList
