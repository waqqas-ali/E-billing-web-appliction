// // src/pages/sales/SalesReturns.jsx
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import config from "../../../config/apiconfig";
// import styles from "./Sales.module.css";
// import { toast } from "react-toastify";

// const SalesReturns = () => {
//   const navigate = useNavigate();
//   const userData = JSON.parse(localStorage.getItem("eBilling")) || {};
//   const token = userData?.accessToken || "";
//   const companyId = userData?.selectedCompany?.id || "";

//   const [returns, setReturns] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedReturn, setSelectedReturn] = useState(null);

//   // Date Filters
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");

//   // -------------------------------------------------
//   // FETCH RETURNS WITH DATE FILTER
//   // -------------------------------------------------
//   const fetchReturns = async () => {
//     if (!token || !companyId) return;
//     setLoading(true);

//     const params = new URLSearchParams();
//     if (startDate) params.append("startDate", startDate);
//     if (endDate) params.append("endDate", endDate);

//     try {
//       const res = await axios.get(
//         `${config.BASE_URL}/company/${companyId}/get/sale-return/list/according?${params.toString()}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       setReturns(res.data || []);
//     } catch (err) {
//       toast.error("Failed to load sale returns");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     const timer = setTimeout(fetchReturns, 300);
//     return () => clearTimeout(timer);
//   }, [startDate, endDate, token, companyId]);

//   // -------------------------------------------------
//   // DELETE RETURN
//   // -------------------------------------------------
//   const deleteReturn = async (saleReturnId) => {
//     if (!window.confirm("Are you sure you want to delete this sale return?")) return;

//     try {
//       setLoading(true);
//       await axios.delete(`${config.BASE_URL}/sale-return/${saleReturnId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setReturns((prev) => prev.filter((r) => r.saleReturnId !== saleReturnId));
//       setSelectedReturn(null);
//       toast.success("Sale return deleted successfully");
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to delete sale return");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // -------------------------------------------------
//   // EDIT NAVIGATION → /create-returns?edit=ID
//   // -------------------------------------------------
//   const handleEdit = (saleReturnId) => {
//     navigate(`/create-returns?edit=${saleReturnId}`);
//     setSelectedReturn(null);
//   };

//   // -------------------------------------------------
//   // CLEAR DATES
//   // -------------------------------------------------
//   const clearDates = () => {
//     setStartDate("");
//     setEndDate("");
//   };

//   // -------------------------------------------------
//   // RENDER
//   // -------------------------------------------------
//   return (
//     <div className={styles["company-form-container"]}>
//       {/* ==== HEADER ==== */}
//       <div className={styles["form-header"]}>
//         <div>
//           <h1 className={styles["company-form-title"]}>Sale Returns</h1>
//           <p className={styles["form-subtitle"]}>Manage all return invoices</p>
//         </div>
//         <button
//           onClick={() => navigate("/create-returns")}
//           className={styles["submit-button"]}
//           disabled={loading}
//         >
//           + New Return
//         </button>
//       </div>

//       {/* ==== DATE FILTER ==== */}
//       <div className={styles["filter-bar"]}>
//         <div className={styles["date-filter-group"]}>
//           <div className={styles["form-group"]}>
//             <label>Start Date</label>
//             <input
//               type="date"
//               value={startDate}
//               onChange={(e) => {
//                 const val = e.target.value;
//                 if (endDate && val > endDate) {
//                   toast.warn("Start date cannot be after end date");
//                   return;
//                 }
//                 setStartDate(val);
//               }}
//               className={styles["form-input"]}
//             />
//           </div>

//           <div className={styles["form-group"]}>
//             <label>End Date</label>
//             <input
//               type="date"
//               value={endDate}
//               onChange={(e) => {
//                 const val = e.target.value;
//                 if (startDate && val < startDate) {
//                   toast.warn("End date cannot be before start date");
//                   return;
//                 }
//                 setEndDate(val);
//               }}
//               className={styles["form-input"]}
//             />
//           </div>

//           {(startDate || endDate) && (
//             <button
//               onClick={clearDates}
//               className={styles["cancel-button"]}
//               style={{ height: "40px", alignSelf: "flex-end" }}
//             >
//               Clear
//             </button>
//           )}
//         </div>
//       </div>

//       {/* ==== LOADING ==== */}
//       {loading && (
//         <div className={styles["loading-message"]}>
//           <div className={styles.spinner}></div>
//           <p>Loading returns...</p>
//         </div>
//       )}

//       {/* ==== TABLE ==== */}
//       {returns.length > 0 ? (
//         <div className={styles["table-wrapper"]}>
//           <table className={styles.table}>
//             <thead>
//               <tr>
//                 <th>Return #</th>
//                 <th>Return Date</th>
//                 <th>Invoice #</th>
//                 <th>Party</th>
//                 <th>Qty</th>
//                 <th>Total</th>
//                 <th>Paid</th>
//                 <th>Balance</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {returns.map((r) => (
//                 <tr key={r.saleReturnId}>
//                   <td>{r.returnNo}</td>
//                   <td>{new Date(r.returnDate).toLocaleDateString()}</td>
//                   <td>{r.invoiceNo}</td>
//                   <td>{r.partyResponseDto?.name || "—"}</td>
//                   <td>{r.totalQuantity}</td>
//                   <td>₹{parseFloat(r.totalAmount).toFixed(2)}</td>
//                   <td>₹{parseFloat(r.paidAmount).toFixed(2)}</td>
//                   <td
//                     style={{
//                       color: r.balanceAmount > 0 ? "#e74c3c" : "#27ae60",
//                       fontWeight: "600",
//                     }}
//                   >
//                     ₹{parseFloat(r.balanceAmount).toFixed(2)}
//                   </td>
//                   <td className={styles["actions-cell"]}>
//                     <button
//                       onClick={() => setSelectedReturn(r)}
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
//           <p>No sale returns found</p>
//           <p className={styles["no-data-subtitle"]}>
//             {startDate || endDate
//               ? "Try adjusting the date range."
//               : "Click “+ New Return” to create your first return."}
//           </p>
//         </div>
//       )}

//       {/* ==== DETAIL MODAL ==== */}
//       {selectedReturn && (
//         <div
//           className={styles["modal-overlay"]}
//           onClick={() => setSelectedReturn(null)}
//         >
//           <div
//             className={styles["detail-card"]}
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className={styles["card-header"]}>
//               <div>
//                 <h3>Return #{selectedReturn.returnNo}</h3>
//                 <div
//                   className={`${styles["balance-badge"]} ${
//                     selectedReturn.balanceAmount <= 0 ? styles.paid : ""
//                   }`}
//                 >
//                   {selectedReturn.balanceAmount > 0 ? "Warning" : "Check"} Balance: ₹
//                   {parseFloat(selectedReturn.balanceAmount).toFixed(2)}
//                 </div>
//               </div>

//               <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
//                 {/* EDIT */}
//                 <button
//                   onClick={() => handleEdit(selectedReturn.saleReturnId)}
//                   className={`${styles["action-button"]} ${styles["edit-button"]}`}
//                   title="Edit return"
//                 >
//                   Edit
//                 </button>

//                 {/* DELETE */}
//                 <button
//                   onClick={() => deleteReturn(selectedReturn.saleReturnId)}
//                   className={`${styles["action-button"]} ${styles["delete-button"]}`}
//                   title="Delete return"
//                   disabled={loading}
//                 >
//                   Delete
//                 </button>

//                 {/* CLOSE */}
//                 <button
//                   className={styles["close-modal-btn"]}
//                   onClick={() => setSelectedReturn(null)}
//                   disabled={loading}
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>

//             {/* Return Summary */}
//             <section className={styles["card-section"]}>
//               <h4>Return Summary</h4>
//               <div className={styles["detail-grid"]}>
//                 <p><strong>Return ID:</strong> {selectedReturn.saleReturnId}</p>
//                 <p><strong>Return Date:</strong> {new Date(selectedReturn.returnDate).toLocaleDateString()}</p>
//                 <p><strong>Invoice Date:</strong> {new Date(selectedReturn.invoiceDate).toLocaleDateString()}</p>
//                 <p><strong>Invoice No:</strong> {selectedReturn.invoiceNo}</p>
//                 <p><strong>Phone:</strong> {selectedReturn.phoneNo}</p>
//                 <p><strong>State of Supply:</strong> {selectedReturn.stateOfSupply?.replace(/_/g, " ")}</p>
//                 <p><strong>Payment Type:</strong> {selectedReturn.paymentType}</p>
//                 <p><strong>Description:</strong> {selectedReturn.description || "—"}</p>
//                 <p><strong>Total Qty:</strong> {selectedReturn.totalQuantity}</p>
//                 <p><strong>Total Discount:</strong> ₹{selectedReturn.totalDiscount?.toFixed(2)}</p>
//                 <p><strong>Total Tax:</strong> ₹{selectedReturn.totalTaxAmount?.toFixed(2)}</p>
//                 <p><strong>Total Amount:</strong> ₹{selectedReturn.totalAmount?.toFixed(2)}</p>
//                 <p><strong>Paid Amount:</strong> ₹{selectedReturn.paidAmount?.toFixed(2)}</p>
//                 <p>
//                   <strong>Balance:</strong>{" "}
//                   <span
//                     style={{
//                       color: selectedReturn.balanceAmount > 0 ? "#e74c3c" : "#27ae60",
//                       fontWeight: "600",
//                     }}
//                   >
//                     ₹{selectedReturn.balanceAmount?.toFixed(2)}
//                   </span>
//                 </p>
//               </div>
//             </section>

//             {/* Party */}
//             {selectedReturn.partyResponseDto && (
//               <section className={styles["card-section"]}>
//                 <h4>Party Details</h4>
//                 <div className={styles["detail-grid"]}>
//                   <p><strong>Name:</strong> {selectedReturn.partyResponseDto.name}</p>
//                   <p><strong>Party ID:</strong> {selectedReturn.partyResponseDto.partyId}</p>
//                   <p><strong>GSTIN:</strong> {selectedReturn.partyResponseDto.gstin || "—"}</p>
//                   <p><strong>GST Type:</strong> {selectedReturn.partyResponseDto.gstType?.replace(/_/g, " ")}</p>
//                   <p><strong>Phone:</strong> {selectedReturn.partyResponseDto.phoneNo || "—"}</p>
//                   <p><strong>Email:</strong> {selectedReturn.partyResponseDto.emailId || "—"}</p>
//                   <p><strong>State:</strong> {selectedReturn.partyResponseDto.state?.replace(/_/g, " ")}</p>
//                   <p><strong>Billing Address:</strong> {selectedReturn.partyResponseDto.billingAddress || "—"}</p>
//                   <p><strong>Shipping Address:</strong> {selectedReturn.partyResponseDto.shipingAddress || "—"}</p>
//                 </div>
//               </section>
//             )}

//             {/* Items */}
//             <section className={styles["card-section"]}>
//               <h4>Returned Items</h4>
//               {selectedReturn.saleReturnItemResponses?.length > 0 ? (
//                 <table className={styles["items-table"]}>
//                   <thead>
//                     <tr>
//                       <th>Name</th>
//                       <th>Qty</th>
//                       <th>Unit</th>
//                       <th>Rate/Unit</th>
//                       <th>Tax Type</th>
//                       <th>Tax Rate</th>
//                       <th>Discount</th>
//                       <th>Tax</th>
//                       <th>Total</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {selectedReturn.saleReturnItemResponses.map((it, i) => (
//                       <tr key={i}>
//                         <td>{it.name}</td>
//                         <td>{it.quantity}</td>
//                         <td>{it.unit}</td>
//                         <td>₹{parseFloat(it.ratePerUnit).toFixed(2)}</td>
//                         <td>{it.taxType}</td>
//                         <td>{it.taxRate}</td>
//                         <td>₹{parseFloat(it.discountAmount).toFixed(2)}</td>
//                         <td>₹{parseFloat(it.totalTaxAmount).toFixed(2)}</td>
//                         <td>₹{parseFloat(it.totalAmount).toFixed(2)}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               ) : (
//                 <p>No items</p>
//               )}
//             </section>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SalesReturns;








// // src/components/sales/SalesReturns.jsx
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import config from "../../../config/apiconfig";
// import styles from "./Sales.module.css";
// import { toast } from "react-toastify";

// const SalesReturns = () => {
//   const navigate = useNavigate();
//   const userData = JSON.parse(localStorage.getItem("eBilling")) || {};
//   const token = userData?.accessToken || "";
//   const companyId = userData?.selectedCompany?.id || "";

//   const [returns, setReturns] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedReturn, setSelectedReturn] = useState(null);

//   // -------------------------------------------------
//   // FETCH SALE RETURNS
//   // -------------------------------------------------
//   const fetchReturns = async () => {
//     if (!token || !companyId) return;
//     setLoading(true);
//     try {
//       const res = await axios.get(
//         `${config.BASE_URL}/company/${companyId}/get/sale-return/list/according`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       setReturns(res.data || []);
//     } catch (err) {
//       toast.error("Failed to load sale returns");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchReturns();
//   }, [token, companyId]);

//   // -------------------------------------------------
//   // DELETE RETURN
//   // -------------------------------------------------
//   const deleteReturn = async (saleReturnId) => {
//     if (!window.confirm("Delete this sale return? This action cannot be undone.")) return;

//     try {
//       setLoading(true);
//       await axios.delete(`${config.BASE_URL}/sale-return/${saleReturnId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setReturns((prev) => prev.filter((r) => r.saleReturnId !== saleReturnId));
//       setSelectedReturn(null);
//       toast.success("Sale return deleted");
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to delete");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // -------------------------------------------------
//   // EDIT NAVIGATION
//   // -------------------------------------------------
//   const handleEdit = (saleReturnId) => {
//     navigate(`/create-sale-return?edit=${saleReturnId}`);
//     setSelectedReturn(null);
//   };

//   return (
//     <div className={styles["company-form-container"]}>
//       {/* ==================== HEADER ==================== */}
//       <div className={styles["form-header"]}>
//         <div>
//           <h1 className={styles["company-form-title"]}>Sale Returns</h1>
//           <p className={styles["form-subtitle"]}>Manage all return invoices</p>
//         </div>
//         <button
//           onClick={() => navigate("/create-sale-return")}
//           className={styles["submit-button"]}
//           disabled={loading}
//         >
//           + New Return
//         </button>
//       </div>

//       {/* ==================== LOADING ==================== */}
//       {loading && (
//         <div className={styles["loading-message"]}>
//           <div className={styles.spinner}></div>
//           <p>Loading returns...</p>
//         </div>
//       )}

//       {/* ==================== TABLE ==================== */}
//       {returns.length > 0 ? (
//         <div className={styles["table-wrapper"]}>
//           <table className={styles.table}>
//             <thead>
//               <tr>
//                 <th>Return #</th>
//                 <th>Return Date</th>
//                 <th>Invoice #</th>
//                 <th>Party</th>
//                 <th>Qty</th>
//                 <th>Total</th>
//                 <th>Paid</th>
//                 <th>Balance</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {returns.map((r) => (
//                 <tr key={r.saleReturnId}>
//                   <td>{r.returnNo}</td>
//                   <td>{new Date(r.returnDate).toLocaleDateString()}</td>
//                   <td>{r.invoiceNo}</td>
//                   <td>{r.partyResponseDto?.name || "—"}</td>
//                   <td>{r.totalQuantity}</td>
//                   <td>₹{r.totalAmount?.toFixed(2)}</td>
//                   <td>₹{r.paidAmount?.toFixed(2)}</td>
//                   <td
//                     style={{
//                       color: r.balanceAmount > 0 ? "#e74c3c" : "#27ae60",
//                       fontWeight: "600",
//                     }}
//                   >
//                     ₹{r.balanceAmount?.toFixed(2)}
//                   </td>
//                   <td className={styles["actions-cell"]}>
//                     <button
//                       onClick={() => setSelectedReturn(r)}
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
//           <p>No sale returns found</p>
//           <p className={styles["no-data-subtitle"]}>
//             Click “+ New Return” to create one.
//           </p>
//         </div>
//       )}

//       {/* ==================== VIEW MODAL ==================== */}
//       {selectedReturn && (
//         <div
//           className={styles["modal-overlay"]}
//           onClick={() => setSelectedReturn(null)}
//         >
//           <div
//             className={styles["detail-card"]}
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className={styles["card-header"]}>
//               <div>
//                 <h3>Return #{selectedReturn.returnNo}</h3>
//                 <div
//                   className={`${styles["balance-badge"]} ${
//                     selectedReturn.balanceAmount <= 0 ? styles.paid : ""
//                   }`}
//                 >
//                   {selectedReturn.balanceAmount > 0 ? "Warning" : "Check"} Balance: ₹
//                   {selectedReturn.balanceAmount?.toFixed(2)}
//                 </div>
//               </div>

//               <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
//                 {/* DELETE */}
//                 <button
//                   onClick={() => deleteReturn(selectedReturn.saleReturnId)}
//                   className={`${styles["action-button"]} ${styles["delete-button"]}`}
//                   title="Delete return"
//                   disabled={loading}
//                 >
//                   Delete
//                 </button>

//                 {/* EDIT – hidden when balance = 0 (or any other condition) */}
//                 {selectedReturn.balanceAmount > 0 && (
//                   <button
//                     onClick={() => handleEdit(selectedReturn.saleReturnId)}
//                     className={`${styles["action-button"]} ${styles["edit-button"]}`}
//                     title="Edit return"
//                     disabled={loading}
//                   >
//                     Edit
//                   </button>
//                 )}

//                 {/* CLOSE */}
//                 <button
//                   className={styles["close-modal-btn"]}
//                   onClick={() => setSelectedReturn(null)}
//                   disabled={loading}
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>

//             {/* ---------- RETURN SUMMARY ---------- */}
//             <section className={styles["card-section"]}>
//               <h4>Return Summary</h4>
//               <div className={styles["detail-grid"]}>
//                 <p><strong>Return ID:</strong> {selectedReturn.saleReturnId}</p>
//                 <p><strong>Return Date:</strong> {new Date(selectedReturn.returnDate).toLocaleDateString()}</p>
//                 <p><strong>Invoice #:</strong> {selectedReturn.invoiceNo}</p>
//                 <p><strong>Invoice Date:</strong> {new Date(selectedReturn.invoiceDate).toLocaleDateString()}</p>
//                 <p><strong>Payment Type:</strong> {selectedReturn.paymentType}</p>
//                 <p><strong>State of Supply:</strong> {selectedReturn.stateOfSupply?.replace(/_/g, " ")}</p>
//                 <p><strong>Description:</strong> {selectedReturn.description || "—"}</p>
//                 <p><strong>Total Qty:</strong> {selectedReturn.totalQuantity}</p>
//                 <p><strong>Total Discount:</strong> ₹{selectedReturn.totalDiscount?.toFixed(2)}</p>
//                 <p><strong>Total Tax:</strong> ₹{selectedReturn.totalTaxAmount?.toFixed(2)}</p>
//                 <p><strong>Total Amount:</strong> ₹{selectedReturn.totalAmount?.toFixed(2)}</p>
//                 <p><strong>Paid Amount:</strong> ₹{selectedReturn.paidAmount?.toFixed(2)}</p>
//                 <p>
//                   <strong>Balance:</strong>{" "}
//                   <span style={{ color: selectedReturn.balanceAmount > 0 ? "#e74c3c" : "#27ae60" }}>
//                     ₹{selectedReturn.balanceAmount?.toFixed(2)}
//                   </span>
//                 </p>
//               </div>
//             </section>

//             {/* ---------- PARTY ---------- */}
//             {selectedReturn.partyResponseDto && (
//               <section className={styles["card-section"]}>
//                 <h4>Party Details</h4>
//                 <div className={styles["detail-grid"]}>
//                   <p><strong>Name:</strong> {selectedReturn.partyResponseDto.name}</p>
//                   <p><strong>Party ID:</strong> {selectedReturn.partyResponseDto.partyId}</p>
//                   <p><strong>GSTIN:</strong> {selectedReturn.partyResponseDto.gstin || "—"}</p>
//                   <p><strong>GST Type:</strong> {selectedReturn.partyResponseDto.gstType?.replace(/_/g, " ")}</p>
//                   <p><strong>Phone:</strong> {selectedReturn.partyResponseDto.phoneNo || "—"}</p>
//                   <p><strong>Email:</strong> {selectedReturn.partyResponseDto.emailId || "—"}</p>
//                   <p><strong>State:</strong> {selectedReturn.partyResponseDto.state?.replace(/_/g, " ")}</p>
//                   <p><strong>Billing Address:</strong> {selectedReturn.partyResponseDto.billingAddress || "—"}</p>
//                   <p><strong>Shipping Address:</strong> {selectedReturn.partyResponseDto.shipingAddress || "—"}</p>
//                 </div>
//               </section>
//             )}

//             {/* ---------- ITEMS ---------- */}
//             <section className={styles["card-section"]}>
//               <h4>Returned Items</h4>
//               {selectedReturn.saleReturnItemResponses?.length > 0 ? (
//                 <table className={styles["items-table"]}>
//                   <thead>
//                     <tr>
//                       <th>Name</th>
//                       <th>Qty</th>
//                       <th>Unit</th>
//                       <th>Rate</th>
//                       <th>Tax Type</th>
//                       <th>Tax Rate</th>
//                       <th>Discount</th>
//                       <th>Tax</th>
//                       <th>Total</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {selectedReturn.saleReturnItemResponses.map((it, i) => (
//                       <tr key={i}>
//                         <td>{it.name}</td>
//                         <td>{it.quantity}</td>
//                         <td>{it.unit}</td>
//                         <td>₹{it.ratePerUnit?.toFixed(2)}</td>
//                         <td>{it.taxType}</td>
//                         <td>{it.taxRate}</td>
//                         <td>₹{it.discountAmount?.toFixed(2)}</td>
//                         <td>₹{it.totalTaxAmount?.toFixed(2)}</td>
//                         <td>₹{it.totalAmount?.toFixed(2)}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               ) : (
//                 <p>No items returned</p>
//               )}
//             </section>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SalesReturns;






// src/components/sales/SalesReturns.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../../../config/apiconfig";
import styles from "./Sales.module.css";
import { toast } from "react-toastify";

const SalesReturns = () => {
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
console.log("company Id",companyId)
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

  // FETCH SALE RETURNS
  const fetchReturns = async () => {
    // Validate login
    if (!token || !isTokenValid()) {
      toast.error("Session expired. Please log in again.");
      localStorage.removeItem("eBilling");
    //   navigate("/login");
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

    console.log("Fetching returns...");
    console.log("URL:", `${config.BASE_URL}/company/${companyId}/get/sale-return/list/according`);
    console.log("Params:", params);
    console.log("Token (preview):", token.substring(0, 20) + "...");

    setLoading(true);
    try {
      const res = await axios.get(
        `${config.BASE_URL}/company/${companyId}/get/sale-return/list/according`,
        {
          params,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          timeout: 10000,
        }
      );

      console.log("Success! Data received:", res.data);
      setReturns(res.data || []);
      toast.success("Sale returns loaded");
    } catch (err) {
      console.error("FULL ERROR:", err.response || err);

      if (err.response?.status === 401) {
        toast.error("Invalid or expired token. Logging out...");
        localStorage.removeItem("eBilling");
        // navigate("/login");
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
  const deleteReturn = async (saleReturnId) => {
    if (!window.confirm("Delete this sale return? This action cannot be undone.")) return;

    try {
      setLoading(true);
      await axios.delete(`${config.BASE_URL}/sale-return/${saleReturnId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setReturns((prev) => prev.filter((r) => r.saleReturnId !== saleReturnId));
      setSelectedReturn(null);
      toast.success("Sale return deleted");
    } catch (err) {
      console.error("Delete error:", err.response || err);
      toast.error(err.response?.data?.message || "Failed to delete");
    } finally {
      setLoading(false);
    }
  };

  // EDIT
  const handleEdit = (saleReturnId) => {
    navigate(`/create-returns?edit=${saleReturnId}`);
    setSelectedReturn(null);
  };

  return (
    <div className={styles["company-form-container"]}>
      {/* HEADER */}
      <div className={styles["form-header"]}>
        <div>
          <h1 className={styles["company-form-title"]}>Sale Returns</h1>
          <p className={styles["form-subtitle"]}>Manage all return invoices</p>
        </div>
        <button
          onClick={() => navigate("/create-returns")}
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
                <th>Invoice #</th>
                <th>Party</th>
                <th>Qty</th>
                <th>Total</th>
                <th>Paid</th>
                <th>Balance</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {returns.map((r) => (
                <tr key={r.saleReturnId}>
                  <td>{r.returnNo}</td>
                  <td>{new Date(r.returnDate).toLocaleDateString()}</td>
                  <td>{r.invoiceNo}</td>
                  <td>{r.partyResponseDto?.name || "—"}</td>
                  <td>{r.totalQuantity}</td>
                  <td>₹{r.totalAmount?.toFixed(2)}</td>
                  <td>₹{r.paidAmount?.toFixed(2)}</td>
                  <td
                    style={{
                      color: r.balanceAmount > 0 ? "#e74c3c" : "#27ae60",
                      fontWeight: "600",
                    }}
                  >
                    ₹{r.balanceAmount?.toFixed(2)}
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
            <p>No sale returns found</p>
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
                  {selectedReturn.balanceAmount?.toFixed(2)}
                </div>
              </div>

              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {/* DELETE */}
                <button
                  onClick={() => deleteReturn(selectedReturn.saleReturnId)}
                  className={`${styles["action-button"]} ${styles["delete-button"]}`}
                  title="Delete return"
                  disabled={loading}
                >
                  Delete
                </button>

                {/* EDIT – ONLY IF BALANCE > 0 */}
                {selectedReturn.balanceAmount > 0 && (
                  <button
                    onClick={() => handleEdit(selectedReturn.saleReturnId)}
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
                <p><strong>Return ID:</strong> {selectedReturn.saleReturnId}</p>
                <p><strong>Return Date:</strong> {new Date(selectedReturn.returnDate).toLocaleDateString()}</p>
                <p><strong>Invoice #:</strong> {selectedReturn.invoiceNo}</p>
                <p><strong>Invoice Date:</strong> {new Date(selectedReturn.invoiceDate).toLocaleDateString()}</p>
                <p><strong>Payment Type:</strong> {selectedReturn.paymentType}</p>
                <p><strong>State of Supply:</strong> {selectedReturn.stateOfSupply?.replace(/_/g, " ")}</p>
                <p><strong>Description:</strong> {selectedReturn.description || "—"}</p>
                <p><strong>Total Qty:</strong> {selectedReturn.totalQuantity}</p>
                <p><strong>Total Discount:</strong> ₹{selectedReturn.totalDiscount?.toFixed(2)}</p>
                <p><strong>Total Tax:</strong> ₹{selectedReturn.totalTaxAmount?.toFixed(2)}</p>
                <p><strong>Total Amount:</strong> ₹{selectedReturn.totalAmount?.toFixed(2)}</p>
                <p><strong>Paid Amount:</strong> ₹{selectedReturn.paidAmount?.toFixed(2)}</p>
                <p>
                  <strong>Balance:</strong>{" "}
                  <span style={{ color: selectedReturn.balanceAmount > 0 ? "#e74c3c" : "#27ae60" }}>
                    ₹{selectedReturn.balanceAmount?.toFixed(2)}
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
              {selectedReturn.saleReturnItemResponses?.length > 0 ? (
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
                    {selectedReturn.saleReturnItemResponses.map((it, i) => (
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

export default SalesReturns;