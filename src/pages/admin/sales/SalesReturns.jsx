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
//   const [filterStartDate, setFilterStartDate] = useState("");
//   const [filterEndDate, setFilterEndDate] = useState("");

//   // Default: last 30 days
//   const getDefaultDateRange = () => {
//     const end = new Date();
//     const start = new Date();
//     start.setDate(end.getDate() - 30);
//     return {
//       startDate: start.toISOString().split("T")[0],
//       endDate: end.toISOString().split("T")[0],
//     };
//   };
// console.log("company Id",companyId)
//   // Token validation
//   const isTokenValid = () => {
//     if (!token) return false;
//     try {
//       const payload = JSON.parse(atob(token.split(".")[1]));
//       const now = Date.now() / 1000;
//       return payload.exp > now;
//     } catch {
//       return false;
//     }
//   };

//   // FETCH SALE RETURNS
//   const fetchReturns = async () => {
//     // Validate login
//     if (!token || !isTokenValid()) {
//       toast.error("Session expired. Please log in again.");
//       localStorage.removeItem("eBilling");
//     //   navigate("/login");
//       return;
//     }

//     if (!companyId) {
//       toast.error("No company selected.");
//       return;
//     }

//     const { startDate: defaultStart, endDate: defaultEnd } = getDefaultDateRange();
//     const params = {
//       startDate: filterStartDate || defaultStart,
//       endDate: filterEndDate || defaultEnd,
//     };

//     console.log("Fetching returns...");
//     console.log("URL:", `${config.BASE_URL}/company/${companyId}/get/sale-return/list/according`);
//     console.log("Params:", params);
//     console.log("Token (preview):", token.substring(0, 20) + "...");

//     setLoading(true);
//     try {
//       const res = await axios.get(
//         `${config.BASE_URL}/company/${companyId}/get/sale-return/list/according`,
//         {
//           params,
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//           timeout: 10000,
//         }
//       );

//       console.log("Success! Data received:", res.data);
//       setReturns(res.data || []);
//       toast.success("Sale returns loaded");
//     } catch (err) {
//       console.error("FULL ERROR:", err.response || err);

//       if (err.response?.status === 401) {
//         toast.error("Invalid or expired token. Logging out...");
//         localStorage.removeItem("eBilling");
//         // navigate("/login");
//       } else {
//         toast.error(err.response?.data?.message || "Failed to load returns");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchReturns();
//     // eslint-disable-next-line
//   }, [token, companyId]);

//   // DELETE
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
//       console.error("Delete error:", err.response || err);
//       toast.error(err.response?.data?.message || "Failed to delete");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // EDIT
//   const handleEdit = (saleReturnId) => {
//     navigate(`/create-returns?edit=${saleReturnId}`);
//     setSelectedReturn(null);
//   };

//   return (
//     <div className={styles["company-form-container"]}>
//       {/* HEADER */}
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

//       {/* DATE FILTER */}
//       <div style={{ marginBottom: "16px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
//         <div>
//           <label style={{ fontSize: "0.9rem", fontWeight: "500" }}>Start Date</label>
//           <input
//             type="date"
//             value={filterStartDate}
//             onChange={(e) => setFilterStartDate(e.target.value)}
//             className={styles["form-input"]}
//             style={{ width: "160px" }}
//           />
//         </div>
//         <div>
//           <label style={{ fontSize: "0.9rem", fontWeight: "500" }}>End Date</label>
//           <input
//             type="date"
//             value={filterEndDate}
//             onChange={(e) => setFilterEndDate(e.target.value)}
//             className={styles["form-input"]}
//             style={{ width: "160px" }}
//           />
//         </div>
//         <button
//           onClick={fetchReturns}
//           className={styles["submit-button"]}
//           style={{ alignSelf: "end", height: "40px" }}
//           disabled={loading}
//         >
//           Apply Filter
//         </button>
//       </div>

//       {/* LOADING */}
//       {loading && (
//         <div className={styles["loading-message"]}>
//           <div className={styles.spinner}></div>
//           <p>Loading returns...</p>
//         </div>
//       )}

//       {/* TABLE */}
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
//         !loading && (
//           <div className={styles["no-data"]}>
//             <p>No sale returns found</p>
//             <p className={styles["no-data-subtitle"]}>
//               Click “+ New Return” to create one.
//             </p>
//           </div>
//         )
//       )}

//       {/* VIEW MODAL */}
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

//                 {/* EDIT – ONLY IF BALANCE > 0 */}
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

//             {/* RETURN SUMMARY */}
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

//             {/* PARTY */}
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

//             {/* ITEMS */}
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






// // src/components/sales/SalesReturns.jsx
// "use client";

// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import config from "../../../config/apiconfig";
// import styles from "../Styles/ScreenUI.module.css"; // SAME AS SalesList
// import { toast } from "react-toastify";
// import {
//   Plus,
//   Eye,
//   Edit2,
//   Trash2,
//   X,
//   Package,
//   AlertCircle,
//   CheckCircle,
//   ChevronDown,
//   Search,
//   Loader,
// } from "lucide-react";

// const SalesReturns = () => {
//   const navigate = useNavigate();
//   const userData = JSON.parse(localStorage.getItem("eBilling")) || {};
//   const token = userData?.accessToken || "";
//   const companyId = userData?.selectedCompany?.id || "";

//   const [returns, setReturns] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedReturn, setSelectedReturn] = useState(null);
//   const [filterStartDate, setFilterStartDate] = useState("");
//   const [filterEndDate, setFilterEndDate] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");

//   // Default: last 30 days
//   const getDefaultDateRange = () => {
//     const end = new Date();
//     const start = new Date();
//     start.setDate(end.getDate() - 30);
//     return {
//       startDate: start.toISOString().split("T")[0],
//       endDate: end.toISOString().split("T")[0],
//     };
//   };

//   // Token validation
//   const isTokenValid = () => {
//     if (!token) return false;
//     try {
//       const payload = JSON.parse(atob(token.split(".")[1]));
//       const now = Date.now() / 1000;
//       return payload.exp > now;
//     } catch {
//       return false;
//     }
//   };

//   // FETCH SALE RETURNS (UNCHANGED LOGIC)
//   const fetchReturns = async () => {
//     if (!token || !isTokenValid()) {
//       toast.error("Session expired. Please log in again.");
//       localStorage.removeItem("eBilling");
//       return;
//     }

//     if (!companyId) {
//       toast.error("No company selected.");
//       return;
//     }

//     const { startDate: defaultStart, endDate: defaultEnd } = getDefaultDateRange();
//     const params = {
//       startDate: filterStartDate || defaultStart,
//       endDate: filterEndDate || defaultEnd,
//     };

//     setLoading(true);
//     try {
//       const res = await axios.get(
//         `${config.BASE_URL}/company/${companyId}/get/sale-return/list/according`,
//         {
//           params,
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//           timeout: 10000,
//         }
//       );

//       setReturns(res.data || []);
//       toast.success("Sale returns loaded");
//     } catch (err) {
//       if (err.response?.status === 401) {
//         toast.error("Invalid or expired token. Logging out...");
//         localStorage.removeItem("eBilling");
//       } else {
//         toast.error(err.response?.data?.message || "Failed to load returns");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchReturns();
//     // eslint-disable-next-line
//   }, [token, companyId]);

//   // DELETE
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

//   // EDIT
//   const handleEdit = (saleReturnId) => {
//     navigate(`/create-returns?edit=${saleReturnId}`);
//     setSelectedReturn(null);
//   };

//   // FILTER + SEARCH
//   const filteredReturns = returns.filter((r) => {
//     const matchesSearch =
//       r.returnNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       r.partyResponseDto?.name?.toLowerCase().includes(searchTerm.toLowerCase());
//     return matchesSearch;
//   });

//   return (
//     <div className={styles["company-form-container"]}>
//       {/* HEADER */}
//       <div className={styles["form-header"]}>
//         <div className={styles["header-content"]}>
//           <div className={styles["header-text"]}>
//             <h1 className={styles["company-form-title"]}>Sale Returns</h1>
//             <p className={styles["form-subtitle"]}>Manage all return invoices</p>
//           </div>
//         </div>
//         <button
//           onClick={() => navigate("/create-returns")}
//           className={styles["submit-button"]}
//           disabled={loading}
//         >
//           <Plus size={18} />
//           <span>New Return</span>
//         </button>
//       </div>

//       {/* SEARCH + DATE FILTER */}
//       <div className={styles["search-container"]}>
//         <Search size={18} className={styles["search-icon"]} />
//         <input
//           type="text"
//           placeholder="Search by return # or party name..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className={styles["search-input"]}
//         />
//       </div>

//       <div style={{ margin: "16px 0", display: "flex", gap: "12px", flexWrap: "wrap" }}>
//         <div>
//           <label className={styles["form-label"]}>Start Date</label>
//           <input
//             type="date"
//             value={filterStartDate}
//             onChange={(e) => setFilterStartDate(e.target.value)}
//             className={styles["form-input"]}
//             style={{ width: "160px" }}
//           />
//         </div>
//         <div>
//           <label className={styles["form-label"]}>End Date</label>
//           <input
//             type="date"
//             value={filterEndDate}
//             onChange={(e) => setFilterEndDate(e.target.value)}
//             className={styles["form-input"]}
//             style={{ width: "160px" }}
//           />
//         </div>
//         <button
//           onClick={fetchReturns}
//           className={styles["submit-button"]}
//           style={{ alignSelf: "end", height: "40px" }}
//           disabled={loading}
//         >
//           Apply Filter
//         </button>
//       </div>

//       {/* LOADING */}
//       {loading && (
//         <div className={styles["loading-message"]}>
//           <Loader size={32} className={styles["spinner"]} />
//           <p>Loading returns...</p>
//         </div>
//       )}

//       {/* TABLE / CARDS */}
//       {filteredReturns.length > 0 ? (
//         <>
//           {/* Desktop Table */}
//           <div className={styles["table-wrapper"]}>
//             <table className={styles.table}>
//               <thead>
//                 <tr>
//                   <th>Return #</th>
//                   <th>Return Date</th>
//                   <th>Invoice #</th>
//                   <th>Party</th>
//                   <th>Qty</th>
//                   <th>Total</th>
//                   <th>Paid</th>
//                   <th>Balance</th>
//                   <th>Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredReturns.map((r) => (
//                   <tr key={r.saleReturnId} className={styles["table-row"]}>
//                     <td className={styles["invoice-cell"]}>
//                       <span className={styles["invoice-badge"]}>{r.returnNo}</span>
//                     </td>
//                     <td>{new Date(r.returnDate).toLocaleDateString()}</td>
//                     <td>{r.invoiceNo}</td>
//                     <td>
//                       <span className={styles["party-name"]}>{r.partyResponseDto?.name || "—"}</span>
//                     </td>
//                     <td>{r.totalQuantity}</td>
//                     <td className={styles["amount-cell"]}>
//                       <span className={styles["amount"]}>₹{Number.parseFloat(r.totalAmount).toFixed(2)}</span>
//                     </td>
//                     <td className={styles["received-cell"]}>
//                       ₹{Number.parseFloat(r.paidAmount).toFixed(2)}
//                     </td>
//                     <td className={styles["balance-cell"]}>
//                       <span
//                         className={
//                           r.balanceAmount > 0 ? styles["balance-pending"] : styles["balance-paid"]
//                         }
//                       >
//                         ₹{Number.parseFloat(r.balanceAmount).toFixed(2)}
//                       </span>
//                     </td>
//                     <td className={styles["actions-cell"]}>
//                       <button
//                         onClick={() => setSelectedReturn(r)}
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

//           {/* Mobile Cards */}
//           <div className={styles["mobile-cards-container"]}>
//             {filteredReturns.map((r) => (
//               <div key={r.saleReturnId} className={styles["invoice-card"]}>
//                 <div className={styles["card-header-mobile"]}>
//                   <div className={styles["card-title-section"]}>
//                     <h3 className={styles["card-invoice-number"]}>{r.returnNo}</h3>
//                     <span
//                       className={
//                         r.balanceAmount > 0
//                           ? styles["status-badge-pending"]
//                           : styles["status-badge-paid"]
//                       }
//                     >
//                       {r.balanceAmount > 0 ? "Pending" : "Paid"}
//                     </span>
//                   </div>
//                   <button onClick={() => setSelectedReturn(r)} className={styles["card-action-button"]}>
//                     <ChevronDown size={20} />
//                   </button>
//                 </div>

//                 <div className={styles["card-body"]}>
//                   <div className={styles["card-info-row"]}>
//                     <span className={styles["info-label"]}>Invoice:</span>
//                     <span className={styles["info-value"]}>{r.invoiceNo}</span>
//                   </div>
//                   <div className={styles["card-info-row"]}>
//                     <span className={styles["info-label"]}>Party:</span>
//                     <span className={styles["info-value"]}>{r.partyResponseDto?.name || "—"}</span>
//                   </div>
//                   <div className={styles["card-info-row"]}>
//                     <span className={styles["info-label"]}>Date:</span>
//                     <span className={styles["info-value"]}>{new Date(r.returnDate).toLocaleDateString()}</span>
//                   </div>
//                   <div className={styles["card-info-row"]}>
//                     <span className={styles["info-label"]}>Total:</span>
//                     <span className={styles["info-value-amount"]}>
//                       ₹{Number.parseFloat(r.totalAmount).toFixed(2)}
//                     </span>
//                   </div>
//                   <div className={styles["card-info-row"]}>
//                     <span className={styles["info-label"]}>Balance:</span>
//                     <span
//                       className={
//                         r.balanceAmount > 0
//                           ? styles["info-value-pending"]
//                           : styles["info-value-paid"]
//                       }
//                     >
//                       ₹{Number.parseFloat(r.balanceAmount).toFixed(2)}
//                     </span>
//                   </div>
//                 </div>

//                 <div className={styles["card-footer"]}>
//                   <button onClick={() => setSelectedReturn(r)} className={styles["card-view-button"]}>
//                     <Eye size={16} />
//                     View Details
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </>
//       ) : (
//         !loading && (
//           <div className={styles["no-data"]}>
//             <Package size={48} />
//             <p>No sale returns found</p>
//             <p className={styles["no-data-subtitle"]}>
//               {searchTerm || filterStartDate || filterEndDate
//                 ? "Try adjusting your filters"
//                 : 'Click "New Return" to create one.'}
//             </p>
//           </div>
//         )
//       )}

//       {/* VIEW MODAL */}
//       {selectedReturn && (
//         <div className={styles["modal-overlay"]} onClick={() => setSelectedReturn(null)}>
//           <div className={styles["detail-card"]} onClick={(e) => e.stopPropagation()}>
//             <div className={styles["card-header"]}>
//               <div className={styles["header-title-section"]}>
//                 <h3>Return #{selectedReturn.returnNo}</h3>
//                 <div
//                   className={`${styles["balance-badge"]} ${
//                     selectedReturn.balanceAmount <= 0 ? styles.paid : ""
//                   }`}
//                 >
//                   {selectedReturn.balanceAmount > 0 ? (
//                     <>
//                       <AlertCircle size={16} />
//                       Balance: ₹{Number.parseFloat(selectedReturn.balanceAmount).toFixed(2)}
//                     </>
//                   ) : (
//                     <>
//                       <CheckCircle size={16} />
//                       Paid
//                     </>
//                   )}
//                 </div>
//               </div>
//               <div className={styles["header-actions"]}>
//                 <button
//                   onClick={() => handleEdit(selectedReturn.saleReturnId)}
//                   className={`${styles["action-button"]} ${styles["edit-button"]}`}
//                   title="Edit return"
//                 >
//                   <Edit2 size={16} />
//                   <span>Edit</span>
//                 </button>
//                 <button
//                   onClick={() => deleteReturn(selectedReturn.saleReturnId)}
//                   className={`${styles["action-button"]} ${styles["delete-button"]}`}
//                   title="Delete return"
//                 >
//                   <Trash2 size={16} />
//                   <span>Delete</span>
//                 </button>
//                 <button
//                   className={styles["close-modal-btn"]}
//                   onClick={() => setSelectedReturn(null)}
//                   title="Close"
//                 >
//                   <X size={20} />
//                 </button>
//               </div>
//             </div>

//             {/* Summary */}
//             <section className={styles["card-section"]}>
//               <h4 className={styles["section-title"]}>Return Summary</h4>
//               <div className={styles["detail-grid"]}>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>Return ID:</span>
//                   <span className={styles["detail-value"]}>{selectedReturn.saleReturnId}</span>
//                 </div>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>Return Date:</span>
//                   <span className={styles["detail-value"]}>
//                     {new Date(selectedReturn.returnDate).toLocaleDateString()}
//                   </span>
//                 </div>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>Invoice #:</span>
//                   <span className={styles["detail-value"]}>{selectedReturn.invoiceNo}</span>
//                 </div>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>Invoice Date:</span>
//                   <span className={styles["detail-value"]}>
//                     {new Date(selectedReturn.invoiceDate).toLocaleDateString()}
//                   </span>
//                 </div>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>Payment Type:</span>
//                   <span className={styles["detail-value"]}>{selectedReturn.paymentType}</span>
//                 </div>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>State of Supply:</span>
//                   <span className={styles["detail-value"]}>
//                     {selectedReturn.stateOfSupply?.replace(/_/g, " ")}
//                   </span>
//                 </div>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>Description:</span>
//                   <span className={styles["detail-value"]}>{selectedReturn.description || "—"}</span>
//                 </div>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>Total Qty:</span>
//                   <span className={styles["detail-value"]}>{selectedReturn.totalQuantity}</span>
//                 </div>
//               </div>

//               <div className={styles["amount-breakdown"]}>
//                 <div className={styles["breakdown-row"]}>
//                   <span>Total (ex-tax):</span>
//                   <span>₹{Number.parseFloat(selectedReturn.totalAmountWithoutTax || 0).toFixed(2)}</span>
//                 </div>
//                 <div className={styles["breakdown-row"]}>
//                   <span>Tax Amount:</span>
//                   <span>₹{Number.parseFloat(selectedReturn.totalTaxAmount || 0).toFixed(2)}</span>
//                 </div>
//                 <div className={styles["breakdown-row"]}>
//                   <span>Total Discount:</span>
//                   <span>₹{Number.parseFloat(selectedReturn.totalDiscount || 0).toFixed(2)}</span>
//                 </div>
//                 <div className={styles[("breakdown-row", "total")]}>
//                   <span>Total Amount:</span>
//                   <span className={styles["total-amount"]}>
//                     ₹{Number.parseFloat(selectedReturn.totalAmount).toFixed(2)}
//                   </span>
//                 </div>
//                 <div className={styles["breakdown-row"]}>
//                   <span>Paid:</span>
//                   <span>₹{Number.parseFloat(selectedReturn.paidAmount).toFixed(2)}</span>
//                 </div>
//                 <div
//                   className={`${styles["breakdown-row"]} ${
//                     selectedReturn.balanceAmount > 0
//                       ? styles["balance-row-pending"]
//                       : styles["balance-row-paid"]
//                   }`}
//                 >
//                   <span>Balance:</span>
//                   <span className={styles["balance-amount"]}>
//                     ₹{Number.parseFloat(selectedReturn.balanceAmount).toFixed(2)}
//                   </span>
//                 </div>
//               </div>
//             </section>

//             {/* Party */}
//             {selectedReturn.partyResponseDto && (
//               <section className={styles["card-section"]}>
//                 <h4 className={styles["section-title"]}>Party Details</h4>
//                 <div className={styles["detail-grid"]}>
//                   <div className={styles["detail-item"]}>
//                     <span className={styles["detail-label"]}>Name:</span>
//                     <span className={styles["detail-value"]}>{selectedReturn.partyResponseDto.name}</span>
//                   </div>
//                   <div className={styles["detail-item"]}>
//                     <span className={styles["detail-label"]}>Party ID:</span>
//                     <span className={styles["detail-value"]}>{selectedReturn.partyResponseDto.partyId}</span>
//                   </div>
//                   <div className={styles["detail-item"]}>
//                     <span className={styles["detail-label"]}>GSTIN:</span>
//                     <span className={styles["detail-value"]}>{selectedReturn.partyResponseDto.gstin || "—"}</span>
//                   </div>
//                   <div className={styles["detail-item"]}>
//                     <span className={styles["detail-label"]}>GST Type:</span>
//                     <span className={styles["detail-value"]}>
//                       {selectedReturn.partyResponseDto.gstType?.replace(/_/g, " ")}
//                     </span>
//                   </div>
//                   <div className={styles["detail-item"]}>
//                     <span className={styles["detail-label"]}>Phone:</span>
//                     <span className={styles["detail-value"]}>{selectedReturn.partyResponseDto.phoneNo || "—"}</span>
//                   </div>
//                   <div className={styles["detail-item"]}>
//                     <span className={styles["detail-label"]}>Email:</span>
//                     <span className={styles["detail-value"]}>{selectedReturn.partyResponseDto.emailId || "—"}</span>
//                   </div>
//                   <div className={styles["detail-item"]}>
//                     <span className={styles["detail-label"]}>State:</span>
//                     <span className={styles["detail-value"]}>
//                       {selectedReturn.partyResponseDto.state?.replace(/_/g, " ")}
//                     </span>
//                   </div>
//                   <div className={styles["detail-item"]}>
//                     <span className={styles["detail-label"]}>Billing Address:</span>
//                     <span className={styles["detail-value"]}>
//                       {selectedReturn.partyResponseDto.billingAddress || "—"}
//                     </span>
//                   </div>
//                 </div>
//               </section>
//             )}

//             {/* Items */}
//             <section className={styles["card-section"]}>
//               <h4 className={styles["section-title"]}>Returned Items</h4>
//               {selectedReturn.saleReturnItemResponses?.length > 0 ? (
//                 <div className={styles["items-table-wrapper"]}>
//                   <table className={styles["items-table"]}>
//                     <thead>
//                       <tr>
//                         <th>Name</th>
//                         <th>Qty</th>
//                         <th>Unit</th>
//                         <th>Rate</th>
//                         <th>Tax Type</th>
//                         <th>Tax Rate</th>
//                         <th>Discount</th>
//                         <th>Tax</th>
//                         <th>Total</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {selectedReturn.saleReturnItemResponses.map((it, i) => (
//                         <tr key={i}>
//                           <td>{it.name}</td>
//                           <td>{it.quantity}</td>
//                           <td>{it.unit}</td>
//                           <td>₹{Number.parseFloat(it.ratePerUnit || 0).toFixed(2)}</td>
//                           <td>{it.taxType}</td>
//                           <td>{it.taxRate}</td>
//                           <td>₹{Number.parseFloat(it.discountAmount || 0).toFixed(2)}</td>
//                           <td>₹{Number.parseFloat(it.totalTaxAmount || 0).toFixed(2)}</td>
//                           <td>₹{Number.parseFloat(it.totalAmount || 0).toFixed(2)}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
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
//   Package,
//   AlertCircle,
//   CheckCircle,
//   ChevronDown,
//   Search,
//   Loader,
//   Calendar,
//   Filter,
// } from "lucide-react"

// const SalesReturns = () => {
//   const navigate = useNavigate()
//   const userData = JSON.parse(localStorage.getItem("eBilling")) || {}
//   const token = userData?.accessToken || ""
//   const companyId = userData?.selectedCompany?.id || ""

//   const [returns, setReturns] = useState([])
//   const [loading, setLoading] = useState(false)
//   const [selectedReturn, setSelectedReturn] = useState(null)
//   const [filterStartDate, setFilterStartDate] = useState("")
//   const [filterEndDate, setFilterEndDate] = useState("")
//   const [searchTerm, setSearchTerm] = useState("")

//   const getDefaultDateRange = () => {
//     const end = new Date()
//     const start = new Date()
//     start.setDate(end.getDate() - 30)
//     return {
//       startDate: start.toISOString().split("T")[0],
//       endDate: end.toISOString().split("T")[0],
//     }
//   }

//   const isTokenValid = () => {
//     if (!token) return false
//     try {
//       const payload = JSON.parse(atob(token.split(".")[1]))
//       const now = Date.now() / 1000
//       return payload.exp > now
//     } catch {
//       return false
//     }
//   }

//   const fetchReturns = async () => {
//     if (!token || !isTokenValid()) {
//       toast.error("Session expired. Please log in again.")
//       localStorage.removeItem("eBilling")
//       return
//     }

//     if (!companyId) {
//       toast.error("No company selected.")
//       return
//     }

//     const { startDate: defaultStart, endDate: defaultEnd } = getDefaultDateRange()
//     const params = {
//       startDate: filterStartDate || defaultStart,
//       endDate: filterEndDate || defaultEnd,
//     }

//     setLoading(true)
//     try {
//       const res = await axios.get(`${config.BASE_URL}/company/${companyId}/get/sale-return/list/according`, {
//         params,
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         timeout: 10000,
//       })

//       setReturns(res.data || [])
//       toast.success("Sale returns loaded")
//     } catch (err) {
//       if (err.response?.status === 401) {
//         toast.error("Invalid or expired token. Logging out...")
//         localStorage.removeItem("eBilling")
//       } else {
//         toast.error(err.response?.data?.message || "Failed to load returns")
//       }
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchReturns()
//     // eslint-disable-next-line
//   }, [token, companyId])

//   const deleteReturn = async (saleReturnId) => {
//     if (!window.confirm("Delete this sale return? This action cannot be undone.")) return

//     try {
//       setLoading(true)
//       await axios.delete(`${config.BASE_URL}/sale-return/${saleReturnId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })

//       setReturns((prev) => prev.filter((r) => r.saleReturnId !== saleReturnId))
//       setSelectedReturn(null)
//       toast.success("Sale return deleted")
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to delete")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleEdit = (saleReturnId) => {
//     navigate(`/create-returns?edit=${saleReturnId}`)
//     setSelectedReturn(null)
//   }

//   const filteredReturns = returns.filter((r) => {
//     const matchesSearch =
//       r.returnNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       r.partyResponseDto?.name?.toLowerCase().includes(searchTerm.toLowerCase())
//     return matchesSearch
//   })

//   return (
//     <div className={styles["company-form-container"]}>
//       <div className={styles["form-header"]}>
//         <div className={styles["header-content"]}>
//           <div className={styles["header-icon"]}>
//             <Package size={32} style={{ color: "var(--primary-color)" }} />
//           </div>
//           <div className={styles["header-text"]}>
//             <h1 className={styles["company-form-title"]}>Sale Returns</h1>
//             <p className={styles["form-subtitle"]}>Track and manage all return invoices efficiently</p>
//           </div>
//         </div>
//         <button onClick={() => navigate("/create-returns")} className={styles["submit-button"]} disabled={loading}>
//           <Plus size={18} />
//           <span>New Return</span>
//         </button>
//       </div>

//       <div className={styles["filter-section"]}>
//         <div className={styles["search-container"]}>
//           <Search size={18} className={styles["search-icon"]} />
//           <input
//             type="text"
//             placeholder="Search by return # or party name..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className={styles["search-input"]}
//           />
//         </div>

//         <div className={styles["date-filter-group"]}>
//           <div className={styles["date-input-wrapper"]}>
//             <label className={styles["form-label"]}>
//               <Calendar size={14} className={styles["label-icon"]} />
//               Start Date
//             </label>
//             <input
//               type="date"
//               value={filterStartDate}
//               onChange={(e) => setFilterStartDate(e.target.value)}
//               className={styles["form-input"]}
//             />
//           </div>
//           <div className={styles["date-input-wrapper"]}>
//             <label className={styles["form-label"]}>
//               <Calendar size={14} className={styles["label-icon"]} />
//               End Date
//             </label>
//             <input
//               type="date"
//               value={filterEndDate}
//               onChange={(e) => setFilterEndDate(e.target.value)}
//               className={styles["form-input"]}
//             />
//           </div>
//           <button
//             onClick={fetchReturns}
//             className={styles["submit-button"]}
//             disabled={loading}
//             style={{ alignSelf: "flex-end" }}
//           >
//             <Filter size={16} />
//             Apply Filter
//           </button>
//         </div>
//       </div>

//       {loading && (
//         <div className={styles["loading-message"]}>
//           <Loader size={32} className={styles["spinner"]} />
//           <p>Loading returns...</p>
//         </div>
//       )}

//       {filteredReturns.length > 0 ? (
//         <>
//           {/* Desktop Table */}
//           <div className={styles["table-wrapper"]}>
//             <table className={styles.table}>
//               <thead>
//                 <tr>
//                   <th>Return #</th>
//                   <th>Return Date</th>
//                   <th>Invoice #</th>
//                   <th>Party</th>
//                   <th>Qty</th>
//                   <th>Total</th>
//                   <th>Paid</th>
//                   <th>Balance</th>
//                   <th>Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredReturns.map((r) => (
//                   <tr key={r.saleReturnId} className={styles["table-row"]}>
//                     <td className={styles["invoice-cell"]}>
//                       <span className={styles["invoice-badge"]}>{r.returnNo}</span>
//                     </td>
//                     <td>{new Date(r.returnDate).toLocaleDateString()}</td>
//                     <td>{r.invoiceNo}</td>
//                     <td>
//                       <span className={styles["party-name"]}>{r.partyResponseDto?.name || "—"}</span>
//                     </td>
//                     <td>{r.totalQuantity}</td>
//                     <td className={styles["amount-cell"]}>
//                       <span className={styles["amount"]}>₹{Number.parseFloat(r.totalAmount).toFixed(2)}</span>
//                     </td>
//                     <td className={styles["received-cell"]}>₹{Number.parseFloat(r.paidAmount).toFixed(2)}</td>
//                     <td className={styles["balance-cell"]}>
//                       <span className={r.balanceAmount > 0 ? styles["balance-pending"] : styles["balance-paid"]}>
//                         ₹{Number.parseFloat(r.balanceAmount).toFixed(2)}
//                       </span>
//                     </td>
//                     <td className={styles["actions-cell"]}>
//                       <button
//                         onClick={() => setSelectedReturn(r)}
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

//           {/* Mobile Cards */}
//           <div className={styles["mobile-cards-container"]}>
//             {filteredReturns.map((r) => (
//               <div key={r.saleReturnId} className={styles["invoice-card"]}>
//                 <div className={styles["card-header-mobile"]}>
//                   <div className={styles["card-title-section"]}>
//                     <h3 className={styles["card-invoice-number"]}>{r.returnNo}</h3>
//                     <span
//                       className={r.balanceAmount > 0 ? styles["status-badge-pending"] : styles["status-badge-paid"]}
//                     >
//                       {r.balanceAmount > 0 ? "Pending" : "Paid"}
//                     </span>
//                   </div>
//                   <button onClick={() => setSelectedReturn(r)} className={styles["card-action-button"]}>
//                     <ChevronDown size={20} />
//                   </button>
//                 </div>

//                 <div className={styles["card-body"]}>
//                   <div className={styles["card-info-row"]}>
//                     <span className={styles["info-label"]}>Invoice:</span>
//                     <span className={styles["info-value"]}>{r.invoiceNo}</span>
//                   </div>
//                   <div className={styles["card-info-row"]}>
//                     <span className={styles["info-label"]}>Party:</span>
//                     <span className={styles["info-value"]}>{r.partyResponseDto?.name || "—"}</span>
//                   </div>
//                   <div className={styles["card-info-row"]}>
//                     <span className={styles["info-label"]}>Date:</span>
//                     <span className={styles["info-value"]}>{new Date(r.returnDate).toLocaleDateString()}</span>
//                   </div>
//                   <div className={styles["card-info-row"]}>
//                     <span className={styles["info-label"]}>Total:</span>
//                     <span className={styles["info-value-amount"]}>₹{Number.parseFloat(r.totalAmount).toFixed(2)}</span>
//                   </div>
//                   <div className={styles["card-info-row"]}>
//                     <span className={styles["info-label"]}>Balance:</span>
//                     <span className={r.balanceAmount > 0 ? styles["info-value-pending"] : styles["info-value-paid"]}>
//                       ₹{Number.parseFloat(r.balanceAmount).toFixed(2)}
//                     </span>
//                   </div>
//                 </div>

//                 <div className={styles["card-footer"]}>
//                   <button onClick={() => setSelectedReturn(r)} className={styles["card-view-button"]}>
//                     <Eye size={16} />
//                     View Details
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </>
//       ) : (
//         !loading && (
//           <div className={styles["no-data"]}>
//             <Package size={48} />
//             <p>No sale returns found</p>
//             <p className={styles["no-data-subtitle"]}>
//               {searchTerm || filterStartDate || filterEndDate
//                 ? "Try adjusting your filters"
//                 : 'Click "New Return" to create one.'}
//             </p>
//           </div>
//         )
//       )}

//       {selectedReturn && (
//         <div className={styles["modal-overlay"]} onClick={() => setSelectedReturn(null)}>
//           <div className={styles["detail-card"]} onClick={(e) => e.stopPropagation()}>
//             <div className={styles["card-header"]}>
//               <div className={styles["header-title-section"]}>
//                 <h3>Return #{selectedReturn.returnNo}</h3>
//                 <div className={`${styles["balance-badge"]} ${selectedReturn.balanceAmount <= 0 ? styles.paid : ""}`}>
//                   {selectedReturn.balanceAmount > 0 ? (
//                     <>
//                       <AlertCircle size={16} />
//                       Balance: ₹{Number.parseFloat(selectedReturn.balanceAmount).toFixed(2)}
//                     </>
//                   ) : (
//                     <>
//                       <CheckCircle size={16} />
//                       Paid
//                     </>
//                   )}
//                 </div>
//               </div>
//               <div className={styles["header-actions"]}>
//                 <button
//                   onClick={() => handleEdit(selectedReturn.saleReturnId)}
//                   className={`${styles["action-button"]} ${styles["edit-button"]}`}
//                   title="Edit return"
//                 >
//                   <Edit2 size={16} />
//                   <span>Edit</span>
//                 </button>
//                 <button
//                   onClick={() => deleteReturn(selectedReturn.saleReturnId)}
//                   className={`${styles["action-button"]} ${styles["delete-button"]}`}
//                   title="Delete return"
//                 >
//                   <Trash2 size={16} />
//                   <span>Delete</span>
//                 </button>
//                 <button className={styles["close-modal-btn"]} onClick={() => setSelectedReturn(null)} title="Close">
//                   <X size={20} />
//                 </button>
//               </div>
//             </div>

//             <section className={styles["card-section"]}>
//               <h4 className={styles["section-title"]}>Return Summary</h4>
//               <div className={styles["detail-grid"]}>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>Return ID:</span>
//                   <span className={styles["detail-value"]}>{selectedReturn.saleReturnId}</span>
//                 </div>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>Return Date:</span>
//                   <span className={styles["detail-value"]}>
//                     {new Date(selectedReturn.returnDate).toLocaleDateString()}
//                   </span>
//                 </div>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>Invoice #:</span>
//                   <span className={styles["detail-value"]}>{selectedReturn.invoiceNo}</span>
//                 </div>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>Invoice Date:</span>
//                   <span className={styles["detail-value"]}>
//                     {new Date(selectedReturn.invoiceDate).toLocaleDateString()}
//                   </span>
//                 </div>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>Payment Type:</span>
//                   <span className={styles["detail-value"]}>{selectedReturn.paymentType}</span>
//                 </div>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>State of Supply:</span>
//                   <span className={styles["detail-value"]}>{selectedReturn.stateOfSupply?.replace(/_/g, " ")}</span>
//                 </div>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>Description:</span>
//                   <span className={styles["detail-value"]}>{selectedReturn.description || "—"}</span>
//                 </div>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>Total Qty:</span>
//                   <span className={styles["detail-value"]}>{selectedReturn.totalQuantity}</span>
//                 </div>
//               </div>

//               <div className={styles["amount-breakdown"]}>
//                 <div className={styles["breakdown-row"]}>
//                   <span>Total (ex-tax):</span>
//                   <span>₹{Number.parseFloat(selectedReturn.totalAmountWithoutTax || 0).toFixed(2)}</span>
//                 </div>
//                 <div className={styles["breakdown-row"]}>
//                   <span>Tax Amount:</span>
//                   <span>₹{Number.parseFloat(selectedReturn.totalTaxAmount || 0).toFixed(2)}</span>
//                 </div>
//                 <div className={styles["breakdown-row"]}>
//                   <span>Total Discount:</span>
//                   <span>₹{Number.parseFloat(selectedReturn.totalDiscount || 0).toFixed(2)}</span>
//                 </div>
//                 <div className={styles["breakdown-row"]}>
//                   <span>Total Amount:</span>
//                   <span className={styles["total-amount"]}>
//                     ₹{Number.parseFloat(selectedReturn.totalAmount).toFixed(2)}
//                   </span>
//                 </div>
//                 <div className={styles["breakdown-row"]}>
//                   <span>Paid:</span>
//                   <span>₹{Number.parseFloat(selectedReturn.paidAmount).toFixed(2)}</span>
//                 </div>
//                 <div
//                   className={`${styles["breakdown-row"]} ${
//                     selectedReturn.balanceAmount > 0 ? styles["balance-row-pending"] : styles["balance-row-paid"]
//                   }`}
//                 >
//                   <span>Balance:</span>
//                   <span className={styles["balance-amount"]}>
//                     ₹{Number.parseFloat(selectedReturn.balanceAmount).toFixed(2)}
//                   </span>
//                 </div>
//               </div>
//             </section>

//             {selectedReturn.partyResponseDto && (
//               <section className={styles["card-section"]}>
//                 <h4 className={styles["section-title"]}>Party Details</h4>
//                 <div className={styles["detail-grid"]}>
//                   <div className={styles["detail-item"]}>
//                     <span className={styles["detail-label"]}>Name:</span>
//                     <span className={styles["detail-value"]}>{selectedReturn.partyResponseDto.name}</span>
//                   </div>
//                   <div className={styles["detail-item"]}>
//                     <span className={styles["detail-label"]}>Party ID:</span>
//                     <span className={styles["detail-value"]}>{selectedReturn.partyResponseDto.partyId}</span>
//                   </div>
//                   <div className={styles["detail-item"]}>
//                     <span className={styles["detail-label"]}>GSTIN:</span>
//                     <span className={styles["detail-value"]}>{selectedReturn.partyResponseDto.gstin || "—"}</span>
//                   </div>
//                   <div className={styles["detail-item"]}>
//                     <span className={styles["detail-label"]}>GST Type:</span>
//                     <span className={styles["detail-value"]}>
//                       {selectedReturn.partyResponseDto.gstType?.replace(/_/g, " ")}
//                     </span>
//                   </div>
//                   <div className={styles["detail-item"]}>
//                     <span className={styles["detail-label"]}>Phone:</span>
//                     <span className={styles["detail-value"]}>{selectedReturn.partyResponseDto.phoneNo || "—"}</span>
//                   </div>
//                   <div className={styles["detail-item"]}>
//                     <span className={styles["detail-label"]}>Email:</span>
//                     <span className={styles["detail-value"]}>{selectedReturn.partyResponseDto.emailId || "—"}</span>
//                   </div>
//                   <div className={styles["detail-item"]}>
//                     <span className={styles["detail-label"]}>State:</span>
//                     <span className={styles["detail-value"]}>
//                       {selectedReturn.partyResponseDto.state?.replace(/_/g, " ")}
//                     </span>
//                   </div>
//                   <div className={styles["detail-item"]}>
//                     <span className={styles["detail-label"]}>Billing Address:</span>
//                     <span className={styles["detail-value"]}>
//                       {selectedReturn.partyResponseDto.billingAddress || "—"}
//                     </span>
//                   </div>
//                 </div>
//               </section>
//             )}

//             <section className={styles["card-section"]}>
//               <h4 className={styles["section-title"]}>Returned Items</h4>
//               {selectedReturn.saleReturnItemResponses?.length > 0 ? (
//                 <div className={styles["items-table-wrapper"]}>
//                   <table className={styles["items-table"]}>
//                     <thead>
//                       <tr>
//                         <th>Name</th>
//                         <th>Qty</th>
//                         <th>Unit</th>
//                         <th>Rate</th>
//                         <th>Tax Type</th>
//                         <th>Tax Rate</th>
//                         <th>Discount</th>
//                         <th>Tax</th>
//                         <th>Total</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {selectedReturn.saleReturnItemResponses.map((it, i) => (
//                         <tr key={i}>
//                           <td>{it.name}</td>
//                           <td>{it.quantity}</td>
//                           <td>{it.unit}</td>
//                           <td>₹{Number.parseFloat(it.ratePerUnit || 0).toFixed(2)}</td>
//                           <td>{it.taxType}</td>
//                           <td>{it.taxRate}</td>
//                           <td>₹{Number.parseFloat(it.discountAmount || 0).toFixed(2)}</td>
//                           <td>₹{Number.parseFloat(it.totalTaxAmount || 0).toFixed(2)}</td>
//                           <td>₹{Number.parseFloat(it.totalAmount || 0).toFixed(2)}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               ) : (
//                 <p>No items returned</p>
//               )}
//             </section>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default SalesReturns




















"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/axiosInstance"; // Shared API with interceptors
import { toast } from "react-toastify";
import styles from "../Styles/ScreenUI.module.css";
import {
  Plus,
  Eye,
  Edit2,
  Trash2,
  X,
  Package,
  Printer,
  AlertCircle,
  CheckCircle,
  ChevronDown,
  Search,
  Loader,
  Calendar,
  Filter,
} from "lucide-react";

const SalesReturns = () => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("eBilling") || "{}")
  );

  const token = userData?.accessToken;
  const companyId = userData?.selectedCompany?.id;

  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const getDefaultDateRange = () => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 30);
    return {
      startDate: start.toISOString().split("T")[0],
      endDate: end.toISOString().split("T")[0],
    };
  };

  // Sync userData
  useEffect(() => {
    const handleStorageChange = () => {
      const updated = JSON.parse(localStorage.getItem("eBilling") || "{}");
      setUserData(updated);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Fetch returns + auth check
  useEffect(() => {
    if (!token) {
      toast.info("Please log in to continue.");
      navigate("/login");
      return;
    }
    if (!companyId) {
      toast.info("Please select a company first.");
      navigate("/company-list");
      return;
    }

    const fetchReturns = async () => {
      setLoading(true);
      try {
        const { startDate: defaultStart, endDate: defaultEnd } = getDefaultDateRange();
        const params = new URLSearchParams({
          startDate: filterStartDate || defaultStart,
          endDate: filterEndDate || defaultEnd,
        });

        const res = await api.get(`/company/${companyId}/get/sale-return/list/according?${params}`);
        setReturns(res.data || []);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load returns");
      } finally {
        setLoading(false);
      }
    };

    fetchReturns();
  }, [token, companyId, filterStartDate, filterEndDate, navigate]);

  const deleteReturn = async (saleReturnId) => {
    if (!window.confirm("Delete this sale return? This action cannot be undone.")) return;

    try {
      setLoading(true);
      await api.delete(`/sale-return/${saleReturnId}`);
      setReturns((prev) => prev.filter((r) => r.saleReturnId !== saleReturnId));
      setSelectedReturn(null);
      toast.success("Sale return deleted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (saleReturnId) => {
    navigate(`/create-returns?edit=${saleReturnId}`);
    setSelectedReturn(null);
  };

  const filteredReturns = returns.filter((r) => {
    const matchesSearch =
      r.returnNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.partyResponseDto?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });
  const handlePrint = (returnData) => {
    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      toast.error("Please allow popups for this site to enable printing");
      return;
    }

    // Safe date formatting
    const formatDate = (dateStr) => {
      return dateStr
        ? new Date(dateStr).toLocaleDateString('en-IN', {
          day: '2-digit', month: 'short', year: 'numeric'
        })
        : "—";
    };

    // Basic HTML escape to prevent XSS
    const escapeHtml = (unsafe = "") => {
      return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    };

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Sale Return ${escapeHtml(returnData.returnNo || '—')}</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 1.2cm;
          }
          body {
            font-family: Arial, Helvetica, sans-serif;
            margin: 0;
            padding: 0;
            color: #000;
            font-size: 10pt;
            line-height: 1.4;
            background: white;
          }
          .container {
            max-width: 19cm;
            margin: 0 auto;
            padding: 0.8cm;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #000;
            padding-bottom: 0.6cm;
            margin-bottom: 0.8cm;
          }
          .header h1 {
            margin: 0;
            font-size: 18pt;
            color: #000;
          }
          .info-section {
            display: flex;
            justify-content: space-between;
            margin-bottom: 1cm;
          }
          .info-box {
            width: 48%;
          }
          .info-box h3 {
            font-size: 12pt;
            margin: 0 0 6px 0;
            border-bottom: 1px solid #000;
            padding-bottom: 4px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 0.8cm 0;
            font-size: 9.5pt;
          }
          th, td {
            border: 1px solid #000;
            padding: 6px 8px;
            text-align: left;
          }
          th {
            background-color: #f5f5f5;
            font-weight: bold;
          }
          .text-right {
            text-align: right;
          }
          .total-section {
            display: flex;
            justify-content: flex-end;
            margin: 1cm 0;
          }
          .total-box {
            width: 45%;
            border: 1px solid #000;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            padding: 6px 10px;
            border-bottom: 1px solid #eee;
          }
          .total-row:last-child {
            border-bottom: none;
            background-color: #f5f5f5;
            font-weight: bold;
          }
          .footer {
            text-align: center;
            font-size: 8.5pt;
            color: #555;
            border-top: 1px solid #000;
            padding-top: 0.6cm;
            margin-top: 1.5cm;
          }
          @media print {
            body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>SALE RETURN</h1>
            <p>
              <strong>Return No:</strong> ${escapeHtml(returnData.returnNo || '—')} 
              | <strong>Return Date:</strong> ${formatDate(returnData.returnDate)}
              | <strong>Original Invoice:</strong> ${escapeHtml(returnData.invoiceNo || '—')}
            </p>
            <p><strong>Status:</strong> ${returnData.balanceAmount > 0 ? 'Pending' : 'Settled'}</p>
          </div>
  
          <div class="info-section">
            <div class="info-box">
              <h3>From (Company):</h3>
              <p><strong>${escapeHtml(userData?.selectedCompany?.name || 'Your Company')}</strong></p>
              <p>${escapeHtml(userData?.selectedCompany?.billingAddress || '—')}</p>
              <p><strong>GSTIN:</strong> ${escapeHtml(userData?.selectedCompany?.gstin || '—')}</p>
            </div>
            <div class="info-box">
              <h3>Return From (Party):</h3>
              <p><strong>${escapeHtml(returnData.partyResponseDto?.name || '—')}</strong></p>
              <p>${escapeHtml(returnData.partyResponseDto?.billingAddress || '—')}</p>
              <p><strong>GSTIN:</strong> ${escapeHtml(returnData.partyResponseDto?.gstin || '—')}</p>
            </div>
          </div>
  
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Item</th>
                <th>Qty Returned</th>
                <th>Unit</th>
                <th>Rate (₹)</th>
                <th>Tax (%)</th>
                <th>Tax Amt (₹)</th>
                <th>Discount (₹)</th>
                <th>Total (₹)</th>
              </tr>
            </thead>
            <tbody>
              ${(returnData.saleReturnItemResponses || []).map((item, i) => `
                <tr>
                  <td>${i + 1}</td>
                  <td>${escapeHtml(item.name || item.itemName || '—')}<br>
                      <small>${escapeHtml(item.description || '')}</small></td>
                  <td class="text-right">${item.quantity || '—'}</td>
                  <td>${escapeHtml(item.unit || 'PCS')}</td>
                  <td class="text-right">${Number(item.ratePerUnit || item.pricePerUnit || 0).toFixed(2)}</td>
                  <td class="text-right">${item.taxRate || '—'}</td>
                  <td class="text-right">${Number(item.totalTaxAmount || 0).toFixed(2)}</td>
                  <td class="text-right">${Number(item.discountAmount || 0).toFixed(2)}</td>
                  <td class="text-right">${Number(item.totalAmount || 0).toFixed(2)}</td>
                </tr>
              `).join('') || '<tr><td colspan="9" class="text-center">No returned items</td></tr>'}
            </tbody>
          </table>
  
          <div class="total-section">
            <div class="total-box">
              <div class="total-row">
                <span>Subtotal (ex-tax):</span>
                <span>₹${Number((returnData.totalAmount || 0) - (returnData.totalTaxAmount || 0)).toFixed(2)}</span>
              </div>
              <div class="total-row">
                <span>Total Tax:</span>
                <span>₹${Number(returnData.totalTaxAmount || 0).toFixed(2)}</span>
              </div>
              <div class="total-row">
                <span>Total Discount:</span>
                <span>₹${Number(returnData.totalDiscount || 0).toFixed(2)}</span>
              </div>
              <div class="total-row">
                <span>Grand Total (Credit Note):</span>
                <span>₹${Number(returnData.totalAmount || 0).toFixed(2)}</span>
              </div>
              <div class="total-row">
                <span>Amount Paid/Settled:</span>
                <span>₹${Number(returnData.paidAmount || 0).toFixed(2)}</span>
              </div>
              <div class="total-row">
                <span>Balance Due:</span>
                <span>₹${Number(returnData.balanceAmount || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>
  
          <div class="footer">
            <p>This is a computer-generated credit note / sale return document</p>
            <p>Goods returned as per original invoice ${escapeHtml(returnData.invoiceNo || '—')}</p>
          </div>
        </div>
  
        <script>
          window.onload = function() {
            setTimeout(() => {
              window.focus();
              window.print();
            }, 600);
          }
        </script>
      </body>
      </html>
    `);

    printWindow.document.close();
  };

  return (
    <div className={styles["company-form-container"]}>
      <div className={styles["form-header"]}>
        <div className={styles["header-content"]}>
          <div className={styles["header-icon"]}>
            <Package size={32} style={{ color: "var(--primary-color)" }} />
          </div>
          <div className={styles["header-text"]}>
            <h1 className={styles["company-form-title"]}>Sale Returns</h1>
            <p className={styles["form-subtitle"]}>Track and manage all return invoices efficiently</p>
          </div>
        </div>
        <button onClick={() => navigate("/create-returns")} className={styles["submit-button"]} disabled={loading}>
          <Plus size={18} />
          <span>New Return</span>
        </button>
      </div>

      <div className={styles["filter-section"]}>
        <div className={styles["search-container"]}>
          <Search size={18} className={styles["search-icon"]} />
          <input
            type="text"
            placeholder="Search by return # or party name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles["search-input"]}
          />
        </div>

        <div className={styles["date-filter-group"]}>
          <div className={styles["date-input-wrapper"]}>
            <label className={styles["form-label"]}>
              <Calendar size={14} className={styles["label-icon"]} />
              Start Date
            </label>
            <input
              type="date"
              value={filterStartDate}
              onChange={(e) => setFilterStartDate(e.target.value)}
              className={styles["form-input"]}
            />
          </div>
          <div className={styles["date-input-wrapper"]}>
            <label className={styles["form-label"]}>
              <Calendar size={14} className={styles["label-icon"]} />
              End Date
            </label>
            <input
              type="date"
              value={filterEndDate}
              onChange={(e) => setFilterEndDate(e.target.value)}
              className={styles["form-input"]}
            />
          </div>
          <button
            onClick={() => fetchReturns()}
            className={styles["submit-button"]}
            disabled={loading}
            style={{ alignSelf: "flex-end" }}
          >
            <Filter size={16} />
            Apply Filter
          </button>
        </div>
      </div>

      {loading && (
        <div className={styles["loading-message"]}>
          <Loader size={32} className={styles["spinner"]} />
          <p>Loading returns...</p>
        </div>
      )}

      {filteredReturns.length > 0 ? (
        <>
          {/* Desktop Table */}
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
                {filteredReturns.map((r) => (
                  <tr key={r.saleReturnId} className={styles["table-row"]}>
                    <td className={styles["invoice-cell"]}>
                      <span className={styles["invoice-badge"]}>{r.returnNo}</span>
                    </td>
                    <td>{new Date(r.returnDate).toLocaleDateString()}</td>
                    <td>{r.invoiceNo}</td>
                    <td>
                      <span className={styles["party-name"]}>{r.partyResponseDto?.name || "—"}</span>
                    </td>
                    <td>{r.totalQuantity}</td>
                    <td className={styles["amount-cell"]}>
                      <span className={styles["amount"]}>₹{Number.parseFloat(r.totalAmount).toFixed(2)}</span>
                    </td>
                    <td className={styles["received-cell"]}>₹{Number.parseFloat(r.paidAmount).toFixed(2)}</td>
                    <td className={styles["balance-cell"]}>
                      <span className={r.balanceAmount > 0 ? styles["balance-pending"] : styles["balance-paid"]}>
                        ₹{Number.parseFloat(r.balanceAmount).toFixed(2)}
                      </span>
                    </td>
                    <td className={styles["actions-cell"]}>
                      <button
                        onClick={() => setSelectedReturn(r)}
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

          {/* Mobile Cards */}
          <div className={styles["mobile-cards-container"]}>
            {filteredReturns.map((r) => (
              <div key={r.saleReturnId} className={styles["invoice-card"]}>
                <div className={styles["card-header-mobile"]}>
                  <div className={styles["card-title-section"]}>
                    <h3 className={styles["card-invoice-number"]}>{r.returnNo}</h3>
                    <span
                      className={r.balanceAmount > 0 ? styles["status-badge-pending"] : styles["status-badge-paid"]}
                    >
                      {r.balanceAmount > 0 ? "Pending" : "Paid"}
                    </span>
                  </div>
                  <button onClick={() => setSelectedReturn(r)} className={styles["card-action-button"]}>
                    <ChevronDown size={20} />
                  </button>
                </div>

                <div className={styles["card-body"]}>
                  <div className={styles["card-info-row"]}>
                    <span className={styles["info-label"]}>Invoice:</span>
                    <span className={styles["info-value"]}>{r.invoiceNo}</span>
                  </div>
                  <div className={styles["card-info-row"]}>
                    <span className={styles["info-label"]}>Party:</span>
                    <span className={styles["info-value"]}>{r.partyResponseDto?.name || "—"}</span>
                  </div>
                  <div className={styles["card-info-row"]}>
                    <span className={styles["info-label"]}>Date:</span>
                    <span className={styles["info-value"]}>{new Date(r.returnDate).toLocaleDateString()}</span>
                  </div>
                  <div className={styles["card-info-row"]}>
                    <span className={styles["info-label"]}>Total:</span>
                    <span className={styles["info-value-amount"]}>₹{Number.parseFloat(r.totalAmount).toFixed(2)}</span>
                  </div>
                  <div className={styles["card-info-row"]}>
                    <span className={styles["info-label"]}>Balance:</span>
                    <span className={r.balanceAmount > 0 ? styles["info-value-pending"] : styles["info-value-paid"]}>
                      ₹{Number.parseFloat(r.balanceAmount).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className={styles["card-footer"]}>
                  <button onClick={() => setSelectedReturn(r)} className={styles["card-view-button"]}>
                    <Eye size={16} />
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        !loading && (
          <div className={styles["no-data"]}>
            <Package size={48} />
            <p>No sale returns found</p>
            <p className={styles["no-data-subtitle"]}>
              {searchTerm || filterStartDate || filterEndDate
                ? "Try adjusting your filters"
                : 'Click "New Return" to create one.'}
            </p>
          </div>
        )
      )}

      {selectedReturn && (
        <div className={styles["modal-overlay"]} onClick={() => setSelectedReturn(null)}>
          <div className={styles["detail-card"]} onClick={(e) => e.stopPropagation()}>
            <div className={styles["card-header"]}>
              <div className={styles["header-title-section"]}>
                <h3>Return #{selectedReturn.returnNo}</h3>
                <div className={`${styles["balance-badge"]} ${selectedReturn.balanceAmount <= 0 ? styles.paid : ""}`}>
                  {selectedReturn.balanceAmount > 0 ? (
                    <>
                      <AlertCircle size={16} />
                      Balance: ₹{Number.parseFloat(selectedReturn.balanceAmount).toFixed(2)}
                    </>
                  ) : (
                    <>
                      <CheckCircle size={16} />
                      Paid
                    </>
                  )}
                </div>
              </div>
              <div className={styles["header-actions"]}>
                <button
                  onClick={() => handleEdit(selectedReturn.saleReturnId)}
                  className={`${styles["action-button"]} ${styles["edit-button"]}`}
                  title="Edit return"
                >
                  <Edit2 size={16} />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handlePrint(selectedReturn)}
                  className={`${styles["action-button"]} ${styles["print-button"]}`}
                  title="Print Return / Credit Note"
                >
                  <Printer size={16} />
                  <span>Print</span>
                </button>
                <button
                  onClick={() => deleteReturn(selectedReturn.saleReturnId)}
                  className={`${styles["action-button"]} ${styles["delete-button"]}`}
                  title="Delete return"
                >
                  <Trash2 size={16} />
                  <span>Delete</span>
                </button>
                <button className={styles["close-modal-btn"]} onClick={() => setSelectedReturn(null)} title="Close">
                  <X size={20} />
                </button>
              </div>
            </div>

            <section className={styles["card-section"]}>
              <h4 className={styles["section-title"]}>Return Summary</h4>
              <div className={styles["detail-grid"]}>
                <div className={styles["detail-item"]}>
                  <span className={styles["detail-label"]}>Return ID:</span>
                  <span className={styles["detail-value"]}>{selectedReturn.saleReturnId}</span>
                </div>
                <div className={styles["detail-item"]}>
                  <span className={styles["detail-label"]}>Return Date:</span>
                  <span className={styles["detail-value"]}>
                    {new Date(selectedReturn.returnDate).toLocaleDateString()}
                  </span>
                </div>
                <div className={styles["detail-item"]}>
                  <span className={styles["detail-label"]}>Invoice #:</span>
                  <span className={styles["detail-value"]}>{selectedReturn.invoiceNo}</span>
                </div>
                <div className={styles["detail-item"]}>
                  <span className={styles["detail-label"]}>Invoice Date:</span>
                  <span className={styles["detail-value"]}>
                    {new Date(selectedReturn.invoiceDate).toLocaleDateString()}
                  </span>
                </div>
                <div className={styles["detail-item"]}>
                  <span className={styles["detail-label"]}>Payment Type:</span>
                  <span className={styles["detail-value"]}>{selectedReturn.paymentType}</span>
                </div>
                <div className={styles["detail-item"]}>
                  <span className={styles["detail-label"]}>State of Supply:</span>
                  <span className={styles["detail-value"]}>{selectedReturn.stateOfSupply?.replace(/_/g, " ")}</span>
                </div>
                <div className={styles["detail-item"]}>
                  <span className={styles["detail-label"]}>Description:</span>
                  <span className={styles["detail-value"]}>{selectedReturn.description || "—"}</span>
                </div>
                <div className={styles["detail-item"]}>
                  <span className={styles["detail-label"]}>Total Qty:</span>
                  <span className={styles["detail-value"]}>{selectedReturn.totalQuantity}</span>
                </div>
              </div>

              <div className={styles["amount-breakdown"]}>
                <div className={styles["breakdown-row"]}>
                  <span>Total (ex-tax):</span>
                  <span>₹{Number.parseFloat(selectedReturn.totalAmountWithoutTax || 0).toFixed(2)}</span>
                </div>
                <div className={styles["breakdown-row"]}>
                  <span>Tax Amount:</span>
                  <span>₹{Number.parseFloat(selectedReturn.totalTaxAmount || 0).toFixed(2)}</span>
                </div>
                <div className={styles["breakdown-row"]}>
                  <span>Total Discount:</span>
                  <span>₹{Number.parseFloat(selectedReturn.totalDiscount || 0).toFixed(2)}</span>
                </div>
                <div className={styles["breakdown-row"]}>
                  <span>Total Amount:</span>
                  <span className={styles["total-amount"]}>
                    ₹{Number.parseFloat(selectedReturn.totalAmount).toFixed(2)}
                  </span>
                </div>
                <div className={styles["breakdown-row"]}>
                  <span>Paid:</span>
                  <span>₹{Number.parseFloat(selectedReturn.paidAmount).toFixed(2)}</span>
                </div>
                <div
                  className={`${styles["breakdown-row"]} ${selectedReturn.balanceAmount > 0 ? styles["balance-row-pending"] : styles["balance-row-paid"]
                    }`}
                >
                  <span>Balance:</span>
                  <span className={styles["balance-amount"]}>
                    ₹{Number.parseFloat(selectedReturn.balanceAmount).toFixed(2)}
                  </span>
                </div>
              </div>
            </section>

            {selectedReturn.partyResponseDto && (
              <section className={styles["card-section"]}>
                <h4 className={styles["section-title"]}>Party Details</h4>
                <div className={styles["detail-grid"]}>
                  <div className={styles["detail-item"]}>
                    <span className={styles["detail-label"]}>Name:</span>
                    <span className={styles["detail-value"]}>{selectedReturn.partyResponseDto.name}</span>
                  </div>
                  <div className={styles["detail-item"]}>
                    <span className={styles["detail-label"]}>Party ID:</span>
                    <span className={styles["detail-value"]}>{selectedReturn.partyResponseDto.partyId}</span>
                  </div>
                  <div className={styles["detail-item"]}>
                    <span className={styles["detail-label"]}>GSTIN:</span>
                    <span className={styles["detail-value"]}>{selectedReturn.partyResponseDto.gstin || "—"}</span>
                  </div>
                  <div className={styles["detail-item"]}>
                    <span className={styles["detail-label"]}>GST Type:</span>
                    <span className={styles["detail-value"]}>
                      {selectedReturn.partyResponseDto.gstType?.replace(/_/g, " ")}
                    </span>
                  </div>
                  <div className={styles["detail-item"]}>
                    <span className={styles["detail-label"]}>Phone:</span>
                    <span className={styles["detail-value"]}>{selectedReturn.partyResponseDto.phoneNo || "—"}</span>
                  </div>
                  <div className={styles["detail-item"]}>
                    <span className={styles["detail-label"]}>Email:</span>
                    <span className={styles["detail-value"]}>{selectedReturn.partyResponseDto.emailId || "—"}</span>
                  </div>
                  <div className={styles["detail-item"]}>
                    <span className={styles["detail-label"]}>State:</span>
                    <span className={styles["detail-value"]}>
                      {selectedReturn.partyResponseDto.state?.replace(/_/g, " ")}
                    </span>
                  </div>
                  <div className={styles["detail-item"]}>
                    <span className={styles["detail-label"]}>Billing Address:</span>
                    <span className={styles["detail-value"]}>
                      {selectedReturn.partyResponseDto.billingAddress || "—"}
                    </span>
                  </div>
                </div>
              </section>
            )}

            <section className={styles["card-section"]}>
              <h4 className={styles["section-title"]}>Returned Items</h4>
              {selectedReturn.saleReturnItemResponses?.length > 0 ? (
                <div className={styles["items-table-wrapper"]}>
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
                          <td>₹{Number.parseFloat(it.ratePerUnit || 0).toFixed(2)}</td>
                          <td>{it.taxType}</td>
                          <td>{it.taxRate}</td>
                          <td>₹{Number.parseFloat(it.discountAmount || 0).toFixed(2)}</td>
                          <td>₹{Number.parseFloat(it.totalTaxAmount || 0).toFixed(2)}</td>
                          <td>₹{Number.parseFloat(it.totalAmount || 0).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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