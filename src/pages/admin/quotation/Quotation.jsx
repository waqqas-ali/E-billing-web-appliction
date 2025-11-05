// import React from 'react'
// import styles from "./Quotation.module.css"; 
// export default function Quotation() {
//   return (
//     <div>Quotation</div>
//   )
// }




// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import config from "../../../config/apiconfig";
// import styles from "./Quotation.module.css";  // Reuse existing styles
// import { toast } from "react-toastify";

// const QuotationList = () => {
//   const navigate = useNavigate();
//   const userData = JSON.parse(localStorage.getItem("eBilling")) || {};
//   const token = userData?.accessToken || "";
//   const companyId = userData?.selectedCompany?.id || "";

//   const [quotations, setQuotations] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedQuotation, setSelectedQuotation] = useState(null);

//   const fetchQuotations = async () => {
//     if (!token || !companyId) return;
//     setLoading(true);
//     try {
//       const res = await axios.get(
//         `${config.BASE_URL}/company/${companyId}/quotations`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       setQuotations(res.data || []);
//     } catch (err) {
//       toast.error("Failed to load quotations");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchQuotations();
//   }, [token, companyId]);

//   const deleteQuotation = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this quotation?")) return;

//     try {
//       await axios.delete(`${config.BASE_URL}/quotation/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setQuotations((prev) => prev.filter((q) => q.quotationId !== id));
//       toast.success("Quotation deleted successfully");
//       setSelectedQuotation(null);
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to delete quotation");
//     }
//   };

//   const handleEdit = (id) => {
//     navigate(`/create_quotation?edit=${id}`);
//     setSelectedQuotation(null);
//   };

//   return (
//     <div className={styles["company-form-container"]}>
//       {/* Header */}
//       <div className={styles["form-header"]}>
//         <div>
//           <h1 className={styles["company-form-title"]}>Quotations</h1>
//           <p className={styles["form-subtitle"]}>Manage all your quotations</p>
//         </div>
//         <button
//           onClick={() => navigate("/create_quotation")}
//           className={styles["submit-button"]}
//           disabled={loading}
//         >
//           Create Quotation
//         </button>
//       </div>

//       {/* Loading */}
//       {loading && (
//         <div className={styles["loading-message"]}>
//           <div className={styles.spinner}></div>
//           <p>Loading quotations...</p>
//         </div>
//       )}

//       {/* Table */}
//       {quotations.length > 0 ? (
//         <div className={styles["table-wrapper"]}>
//           <table className={styles.table}>
//             <thead>
//               <tr>
//                 <th>Ref No</th>
//                 <th>Date</th>
//                 <th>Party</th>
//                 <th>Items</th>
//                 <th>Total (w/o Tax)</th>
//                 <th>Tax</th>
//                 <th>Delivery</th>
//                 <th>Total</th>
//                 <th>Type</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {quotations.map((q) => (
//                 <tr key={q.quotationId}>
//                   <td>{q.referenceNo}</td>
//                   <td>{new Date(q.invoiceDate).toLocaleDateString()}</td>
//                   <td>{q.partyResponseDto?.name || "—"}</td>
//                   <td>{q.quotationItemResponses?.length || 0}</td>
//                   <td>₹{parseFloat(q.totalAmountWithoutTax).toFixed(2)}</td>
//                   <td>₹{parseFloat(q.totalTaxAmount).toFixed(2)}</td>
//                   <td>₹{parseFloat(q.deliveryCharges).toFixed(2)}</td>
//                   <td>₹{parseFloat(q.totalAmount).toFixed(2)}</td>
//                   <td>
//                     <span
//                       className={`${styles["status-badge"]} ${
//                         q.quotationType === "CLOSE" ? styles.closed : styles.open
//                       }`}
//                     >
//                       {q.quotationType}
//                     </span>
//                   </td>
//                   <td className={styles["actions-cell"]}>
//                     <button
//                       onClick={() => setSelectedQuotation(q)}
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
//             <p>No quotations found</p>
//             <p className={styles["no-data-subtitle"]}>
//               Click "Create Quotation" to add your first one.
//             </p>
//           </div>
//         )
//       )}

//       {/* VIEW MODAL */}
//       {selectedQuotation && (
//         <div
//           className={styles["modal-overlay"]}
//           onClick={() => setSelectedQuotation(null)}
//         >
//           <div
//             className={styles["detail-card"]}
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className={styles["card-header"]}>
//               <div>
//                 <h3>Quotation #{selectedQuotation.referenceNo}</h3>
//                 <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
//                   <div
//                     className={`${styles["status-badge"]} ${
//                       selectedQuotation.quotationType === "CLOSE"
//                         ? styles.closed
//                         : styles.open
//                     }`}
//                     style={{ fontSize: "0.8rem", padding: "4px 8px" }}
//                   >
//                     {selectedQuotation.quotationType}
//                   </div>
//                 </div>
//               </div>
//               <div>
//                 {selectedQuotation.quotationType !== "CLOSE" && (
//                   <button
//                     onClick={() => handleEdit(selectedQuotation.quotationId)}
//                     className={`${styles["action-button"]} ${styles["edit-button"]}`}
//                     title="Edit quotation"
//                   >
//                     Edit
//                   </button>
//                 )}
//                 <button
//                   onClick={() => deleteQuotation(selectedQuotation.quotationId)}
//                   className={`${styles["action-button"]} ${styles["delete-button"]}`}
//                   title="Delete quotation"
//                 >
//                   Delete
//                 </button>
//                 <button
//                   className={styles["close-modal-btn"]}
//                   onClick={() => setSelectedQuotation(null)}
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>

//             {/* Details */}
//             <section className={styles["card-section"]}>
//               <h4>Quotation Details</h4>
//               <div className={styles["detail-grid"]}>
//                 <p><strong>Reference No:</strong> {selectedQuotation.referenceNo}</p>
//                 <p><strong>Date:</strong> {new Date(selectedQuotation.invoiceDate).toLocaleDateString()}</p>
//                 <p><strong>State of Supply:</strong> {selectedQuotation.stateOfSupply.replace(/_/g, " ")}</p>
//                 <p><strong>Description:</strong> {selectedQuotation.description || "—"}</p>
//                 <p><strong>Total (w/o Tax):</strong> ₹{parseFloat(selectedQuotation.totalAmountWithoutTax).toFixed(2)}</p>
//                 <p><strong>Tax Amount:</strong> ₹{parseFloat(selectedQuotation.totalTaxAmount).toFixed(2)}</p>
//                 <p><strong>Delivery Charges:</strong> ₹{parseFloat(selectedQuotation.deliveryCharges).toFixed(2)}</p>
//                 <p><strong>Total Amount:</strong> ₹{parseFloat(selectedQuotation.totalAmount).toFixed(2)}</p>
//               </div>
//             </section>

//             {/* Party */}
//             {selectedQuotation.partyResponseDto && (
//               <section className={styles["card-section"]}>
//                 <h4>Party Details</h4>
//                 <div className={styles["detail-grid"]}>
//                   <p><strong>Name:</strong> {selectedQuotation.partyResponseDto.name}</p>
//                   <p><strong>GSTIN:</strong> {selectedQuotation.partyResponseDto.gstin || "—"}</p>
//                   <p><strong>Phone:</strong> {selectedQuotation.partyResponseDto.phoneNo || "—"}</p>
//                   <p><strong>Email:</strong> {selectedQuotation.partyResponseDto.emailId || "—"}</p>
//                   <p><strong>State:</strong> {selectedQuotation.partyResponseDto.state.replace(/_/g, " ")}</p>
//                   <p><strong>Billing Address:</strong> {selectedQuotation.partyResponseDto.billingAddress || "—"}</p>
//                   <p><strong>Shipping Address:</strong> {selectedQuotation.partyResponseDto.shipingAddress || "—"}</p>
//                 </div>
//               </section>
//             )}

//             {/* Items */}
//             <section className={styles["card-section"]}>
//               <h4>Items</h4>
//               {selectedQuotation.quotationItemResponses?.length > 0 ? (
//                 <table className={styles["items-table"]}>
//                   <thead>
//                     <tr>
//                       <th>Name</th>
//                       <th>HSN</th>
//                       <th>Qty</th>
//                       <th>Unit</th>
//                       <th>Rate/Unit</th>
//                       <th>Tax Type</th>
//                       <th>Tax Rate</th>
//                       <th>Tax</th>
//                       <th>Total</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {selectedQuotation.quotationItemResponses.map((it, i) => (
//                       <tr key={i}>
//                         <td>{it.itemName}</td>
//                         <td>{it.itemHsnCode || "—"}</td>
//                         <td>{it.quantity}</td>
//                         <td>{it.unit}</td>
//                         <td>₹{parseFloat(it.pricePerUnit).toFixed(2)}</td>
//                         <td>{it.pricePerUnitTaxType}</td>
//                         <td>{it.taxRate}</td>
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

// export default QuotationList;










// // src/pages/quotation/QuotationList.jsx
// "use client";

// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import config from "../../../config/apiconfig";
// import styles from "../Styles/ScreenUI.module.css"; // Using same styles as SalesHistory
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

// const QuotationList = () => {
//   const navigate = useNavigate();
//   const userData = JSON.parse(localStorage.getItem("eBilling")) || {};
//   const token = userData?.accessToken || "";
//   const companyId = userData?.selectedCompany?.id || "";

//   const [quotations, setQuotations] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedQuotation, setSelectedQuotation] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");

//   const fetchQuotations = async () => {
//     if (!token || !companyId) {
//       toast.error("Session expired or no company selected.");
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await axios.get(
//         `${config.BASE_URL}/company/${companyId}/quotations`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       setQuotations(res.data || []);
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to load quotations");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchQuotations();
//   }, [token, companyId]);

//   const deleteQuotation = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this quotation? This action cannot be undone.")) {
//       return;
//     }

//     try {
//       setLoading(true);
//       await axios.delete(`${config.BASE_URL}/quotation/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setQuotations((prev) => prev.filter((q) => q.quotationId !== id));
//       setSelectedQuotation(null);
//       toast.success("Quotation deleted successfully");
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to delete quotation");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (id) => {
//     navigate(`/create_quotation?edit=${id}`);
//     setSelectedQuotation(null);
//   };

//   const filteredQuotations = quotations.filter((q) => {
//     const matchesSearch =
//       q.referenceNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       q.partyResponseDto?.name?.toLowerCase().includes(searchTerm.toLowerCase());
//     return matchesSearch;
//   });

//   return (
//     <div className={styles["company-form-container"]}>
//       {/* HEADER */}
//       <div className={styles["form-header"]}>
//         <div className={styles["header-content"]}>
//           <div className={styles["header-icon"]}>
//             <Package size={32} style={{ color: "var(--primary-color)" }} />
//           </div>
//           <div className={styles["header-text"]}>
//             <h1 className={styles["company-form-title"]}>Quotations</h1>
//             <p className={styles["form-subtitle"]}>Manage all your quotations</p>
//           </div>
//         </div>
//         <button
//           onClick={() => navigate("/create_quotation")}
//           className={styles["submit-button"]}
//           disabled={loading}
//         >
//           <Plus size={18} />
//           <span>New Quotation</span>
//         </button>
//       </div>

//       {/* SEARCH BAR */}
//       <div className={styles["search-container"]}>
//         <Search size={18} className={styles["search-icon"]} />
//         <input
//           type="text"
//           placeholder="Search by reference # or party name..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className={styles["search-input"]}
//         />
//       </div>

//       {/* LOADING */}
//       {loading && (
//         <div className={styles["loading-message"]}>
//           <Loader size={32} className={styles["spinner"]} />
//           <p>Loading quotations...</p>
//         </div>
//       )}

//       {/* TABLE / CARDS */}
//       {filteredQuotations.length > 0 ? (
//         <>
//           {/* Desktop Table */}
//           <div className={styles["table-wrapper"]}>
//             <table className={styles.table}>
//               <thead>
//                 <tr>
//                   <th>Ref No</th>
//                   <th>Date</th>
//                   <th>Party</th>
//                   <th>Items</th>
//                   <th>Total (w/o Tax)</th>
//                   <th>Tax</th>
//                   <th>Delivery</th>
//                   <th>Total</th>
//                   <th>Type</th>
//                   <th>Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredQuotations.map((q) => (
//                   <tr key={q.quotationId} className={styles["table-row"]}>
//                     <td className={styles["invoice-cell"]}>
//                       <span className={styles["invoice-badge"]}>{q.referenceNo}</span>
//                     </td>
//                     <td>{new Date(q.invoiceDate).toLocaleDateString()}</td>
//                     <td>
//                       <span className={styles["party-name"]}>{q.partyResponseDto?.name || "—"}</span>
//                     </td>
//                     <td>{q.quotationItemResponses?.length || 0}</td>
//                     <td className={styles["amount-cell"]}>
//                       <span className={styles["amount"]}>
//                         ₹{Number.parseFloat(q.totalAmountWithoutTax || 0).toFixed(2)}
//                       </span>
//                     </td>
//                     <td className={styles["received-cell"]}>
//                       ₹{Number.parseFloat(q.totalTaxAmount || 0).toFixed(2)}
//                     </td>
//                     <td className={styles["balance-cell"]}>
//                       <span className={styles["amount"]}>
//                         ₹{Number.parseFloat(q.deliveryCharges || 0).toFixed(2)}
//                       </span>
//                     </td>
//                     <td className={styles["amount-cell"]}>
//                       <span className={styles["total-amount"]}>
//                         ₹{Number.parseFloat(q.totalAmount || 0).toFixed(2)}
//                       </span>
//                     </td>
//                     <td>
//                       <span
//                         className={`${styles["status-badge"]} ${
//                           q.quotationType === "OPEN" ? styles["status-open"] : styles["status-closed"]
//                         }`}
//                       >
//                         {q.quotationType}
//                       </span>
//                     </td>
//                     <td className={styles["actions-cell"]}>
//                       <button
//                         onClick={() => setSelectedQuotation(q)}
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
//             {filteredQuotations.map((q) => (
//               <div key={q.quotationId} className={styles["invoice-card"]}>
//                 <div className={styles["card-header-mobile"]}>
//                   <div className={styles["card-title-section"]}>
//                     <h3 className={styles["card-invoice-number"]}>{q.referenceNo}</h3>
//                     <span
//                       className={`${styles["status-badge"]} ${
//                         q.quotationType === "OPEN" ? styles["status-open"] : styles["status-closed"]
//                       }`}
//                     >
//                       {q.quotationType}
//                     </span>
//                   </div>
//                   <button onClick={() => setSelectedQuotation(q)} className={styles["card-action-button"]}>
//                     <ChevronDown size={20} />
//                   </button>
//                 </div>

//                 <div className={styles["card-body"]}>
//                   <div className={styles["card-info-row"]}>
//                     <span className={styles["info-label"]}>Party:</span>
//                     <span className={styles["info-value"]}>{q.partyResponseDto?.name || "—"}</span>
//                   </div>
//                   <div className={styles["card-info-row"]}>
//                     <span className={styles["info-label"]}>Date:</span>
//                     <span className={styles["info-value"]}>
//                       {new Date(q.invoiceDate).toLocaleDateString()}
//                     </span>
//                   </div>
//                   <div className={styles["card-info-row"]}>
//                     <span className={styles["info-label"]}>Total:</span>
//                     <span className={styles["info-value-amount"]}>
//                       ₹{Number.parseFloat(q.totalAmount || 0).toFixed(2)}
//                     </span>
//                   </div>
//                   <div className={styles["card-info-row"]}>
//                     <span className={styles["info-label"]}>Tax:</span>
//                     <span className={styles["info-value"]}>
//                       ₹{Number.parseFloat(q.totalTaxAmount || 0).toFixed(2)}
//                     </span>
//                   </div>
//                 </div>

//                 <div className={styles["card-footer"]}>
//                   <button onClick={() => setSelectedQuotation(q)} className={styles["card-view-button"]}>
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
//             <p>No quotations found</p>
//             <p className={styles["no-data-subtitle"]}>
//               {searchTerm
//                 ? "Try adjusting your search"
//                 : 'Click "New Quotation" to create your first quotation.'}
//             </p>
//           </div>
//         )
//       )}

//       {/* VIEW MODAL */}
//       {selectedQuotation && (
//         <div className={styles["modal-overlay"]} onClick={() => setSelectedQuotation(null)}>
//           <div className={styles["detail-card"]} onClick={(e) => e.stopPropagation()}>
//             <div className={styles["card-header"]}>
//               <div className={styles["header-title-section"]}>
//                 <h3>Quotation #{selectedQuotation.referenceNo}</h3>
//                 <div className={`${styles["balance-badge"]} ${selectedQuotation.quotationType === "CLOSE" ? styles.paid : ""}`}>
//                   {selectedQuotation.quotationType === "OPEN" ? (
//                     <>
//                       <AlertCircle size={16} />
//                       Open
//                     </>
//                   ) : (
//                     <>
//                       <CheckCircle size={16} />
//                       Closed
//                     </>
//                   )}
//                 </div>
//               </div>
//               <div className={styles["header-actions"]}>
//                 {/* EDIT: Only if not CLOSED */}
//                 {selectedQuotation.quotationType !== "CLOSE" && (
//                   <button
//                     onClick={() => handleEdit(selectedQuotation.quotationId)}
//                     className={`${styles["action-button"]} ${styles["edit-button"]}`}
//                     title="Edit quotation"
//                   >
//                     <Edit2 size={16} />
//                     <span>Edit</span>
//                   </button>
//                 )}
//                 <button
//                   onClick={() => deleteQuotation(selectedQuotation.quotationId)}
//                   className={`${styles["action-button"]} ${styles["delete-button"]}`}
//                   title="Delete quotation"
//                 >
//                   <Trash2 size={16} />
//                   <span>Delete</span>
//                 </button>
//                 <button
//                   className={styles["close-modal-btn"]}
//                   onClick={() => setSelectedQuotation(null)}
//                   title="Close"
//                 >
//                   <X size={20} />
//                 </button>
//               </div>
//             </div>

//             {/* Quotation Summary */}
//             <section className={styles["card-section"]}>
//               <h4 className={styles["section-title"]}>Quotation Summary</h4>
//               <div className={styles["detail-grid"]}>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>Reference No:</span>
//                   <span className={styles["detail-value"]}>{selectedQuotation.referenceNo}</span>
//                 </div>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>Date:</span>
//                   <span className={styles["detail-value"]}>
//                     {new Date(selectedQuotation.invoiceDate).toLocaleDateString()}
//                   </span>
//                 </div>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>State of Supply:</span>
//                   <span className={styles["detail-value"]}>
//                     {selectedQuotation.stateOfSupply?.replace(/_/g, " ")}
//                   </span>
//                 </div>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>Description:</span>
//                   <span className={styles["detail-value"]}>{selectedQuotation.description || "—"}</span>
//                 </div>
//               </div>

//               <div className={styles["amount-breakdown"]}>
//                 <div className={styles["breakdown-row"]}>
//                   <span>Total (w/o Tax):</span>
//                   <span>₹{Number.parseFloat(selectedQuotation.totalAmountWithoutTax || 0).toFixed(2)}</span>
//                 </div>
//                 <div className={styles["breakdown-row"]}>
//                   <span>Tax Amount:</span>
//                   <span>₹{Number.parseFloat(selectedQuotation.totalTaxAmount || 0).toFixed(2)}</span>
//                 </div>
//                 <div className={styles["breakdown-row"]}>
//                   <span>Delivery Charges:</span>
//                   <span>₹{Number.parseFloat(selectedQuotation.deliveryCharges || 0).toFixed(2)}</span>
//                 </div>
//                 <div className={styles["breakdown-row"]}>
//                   <span>Total Amount:</span>
//                   <span className={styles["total-amount"]}>
//                     ₹{Number.parseFloat(selectedQuotation.totalAmount || 0).toFixed(2)}
//                   </span>
//                 </div>
//               </div>
//             </section>

//             {/* Party Details */}
//             {selectedQuotation.partyResponseDto && (
//               <section className={styles["card-section"]}>
//                 <h4 className={styles["section-title"]}>Party Details</h4>
//                 <div className={styles["detail-grid"]}>
//                   <div className={styles["detail-item"]}>
//                     <span className={styles["detail-label"]}>Name:</span>
//                     <span className={styles["detail-value"]}>{selectedQuotation.partyResponseDto.name}</span>
//                   </div>
//                   <div className={styles["detail-item"]}>
//                     <span className={styles["detail-label"]}>GSTIN:</span>
//                     <span className={styles["detail-value"]}>{selectedQuotation.partyResponseDto.gstin || "—"}</span>
//                   </div>
//                   <div className={styles["detail-item"]}>
//                     <span className={styles["detail-label"]}>Phone:</span>
//                     <span className={styles["detail-value"]}>{selectedQuotation.partyResponseDto.phoneNo || "—"}</span>
//                   </div>
//                   <div className={styles["detail-item"]}>
//                     <span className={styles["detail-label"]}>Email:</span>
//                     <span className={styles["detail-value"]}>{selectedQuotation.partyResponseDto.emailId || "—"}</span>
//                   </div>
//                   <div className={styles["detail-item"]}>
//                     <span className={styles["detail-label"]}>State:</span>
//                     <span className={styles["detail-value"]}>
//                       {selectedQuotation.partyResponseDto.state?.replace(/_/g, " ")}
//                     </span>
//                   </div>
//                   <div className={styles["detail-item"]}>
//                     <span className={styles["detail-label"]}>Billing Address:</span>
//                     <span className={styles["detail-value"]}>
//                       {selectedQuotation.partyResponseDto.billingAddress || "—"}
//                     </span>
//                   </div>
//                   <div className={styles["detail-item"]}>
//                     <span className={styles["detail-label"]}>Shipping Address:</span>
//                     <span className={styles["detail-value"]}>
//                       {selectedQuotation.partyResponseDto.shipingAddress || "—"}
//                     </span>
//                   </div>
//                 </div>
//               </section>
//             )}

//             {/* Items */}
//             <section className={styles["card-section"]}>
//               <h4 className={styles["section-title"]}>Items</h4>
//               {selectedQuotation.quotationItemResponses?.length > 0 ? (
//                 <div className={styles["items-table-wrapper"]}>
//                   <table className={styles["items-table"]}>
//                     <thead>
//                       <tr>
//                         <th>Name</th>
//                         <th>HSN</th>
//                         <th>Qty</th>
//                         <th>Unit</th>
//                         <th>Rate</th>
//                         <th>Tax Type</th>
//                         <th>Tax Rate</th>
//                         <th>Tax</th>
//                         <th>Total</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {selectedQuotation.quotationItemResponses.map((it, i) => (
//                         <tr key={i}>
//                           <td>{it.itemName}</td>
//                           <td>{it.itemHsnCode || "—"}</td>
//                           <td>{it.quantity}</td>
//                           <td>{it.unit}</td>
//                           <td>₹{Number.parseFloat(it.pricePerUnit || 0).toFixed(2)}</td>
//                           <td>{it.pricePerUnitTaxType}</td>
//                           <td>{it.taxRate}</td>
//                           <td>₹{Number.parseFloat(it.totalTaxAmount || 0).toFixed(2)}</td>
//                           <td>₹{Number.parseFloat(it.totalAmount || 0).toFixed(2)}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
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

// export default QuotationList;









"use client";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../../../config/apiconfig";
import styles from "../Styles/ScreenUI.module.css";
import { toast } from "react-toastify";
import {
  Plus,
  Eye,
  Edit2,
  Trash2,
  X,
  Package,
  AlertCircle,
  CheckCircle,
  ChevronDown,
  Search,
  Loader,
} from "lucide-react";

// Helper: Map Quotation to Sale Payload
const mapQuotationToSalePayload = (quotation) => {
  const items = quotation.quotationItemResponses?.map((it) => ({
    itemName: it.itemName,
    itemHsnCode: it.itemHsnCode || "",
    itemDescription: it.itemDescription || "",
    quantity: it.quantity,
    unit: it.unit,
    pricePerUnit: it.pricePerUnit,
    pricePerUnitTaxType: it.pricePerUnitTaxType,
    taxRate: it.taxRate,
    taxAmount: it.totalTaxAmount,
    totalAmount: it.totalAmount,
  })) ?? [];

  return {
    partyId: quotation.partyResponseDto?.partyId,
    billingAddress: quotation.partyResponseDto?.billingAddress || "",
    shippingAddress: quotation.partyResponseDto?.shipingAddress || "",
    invoiceNumber: `${quotation.referenceNo}-INV`,
    invoiceDate: quotation.invoiceDate, // Fixed typo
    dueDate: quotation.invoiceDate, // Use same as invoice date or add field
    saleType: "CASH", // or derive from party/payment
    stateOfSupply: quotation.stateOfSupply,
    paymentType: "CASH",
    paymentDescription: quotation.description || "",
    totalAmountWithoutTax: quotation.totalAmountWithoutTax,
    totalTaxAmount: quotation.totalTaxAmount,
    deliveryCharges: quotation.deliveryCharges,
    totalAmount: quotation.totalAmount,
    receivedAmount: 0, // Quotation has no payment
    balance: quotation.totalAmount,
    saleItems: items,
    paid: false,
    overdue: false,
  };
};

const QuotationList = () => {
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("eBilling") || "{}");
  const token = userData?.accessToken || "";
  const companyId = userData?.selectedCompany?.id || "";

  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [converting, setConverting] = useState(false);

  const fetchQuotations = async () => {
    if (!token || !companyId) {
      toast.error("Session expired or no company selected.");
      return;
    }

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
      toast.error(err.response?.data?.message || "Failed to load quotations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotations();
  }, [token, companyId]);

  const deleteQuotation = async (id) => {
    if (!window.confirm("Are you sure you want to delete this quotation? This action cannot be undone.")) {
      return;
    }

    try {
      setLoading(true);
      await axios.delete(`${config.BASE_URL}/quotation/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuotations((prev) => prev.filter((q) => q.quotationId !== id));
      setSelectedQuotation(null);
      toast.success("Quotation deleted successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete quotation");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    navigate(`/create_quotation?edit=${id}`);
    setSelectedQuotation(null);
  };

  const handleConvert = async (quotationId) => {
    if (converting) return;

    if (!window.confirm("Convert this quotation to a sale invoice? This action cannot be undone.")) {
      return;
    }

    setConverting(true);

    try {
      const res = await axios.get(`${config.BASE_URL}/quotation/${quotationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const quotation = res.data;

      const payload = mapQuotationToSalePayload(quotation);

      const convertRes = await axios.post(
        `${config.BASE_URL}/quotation/${quotationId}/convert-to-sale`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Quotation converted to Sale Invoice successfully!");

      if (convertRes.data?.saleId) {
        // navigate(`/sales/${convertRes.data.saleId}`);
      } else {
        fetchQuotations();
      }
      setSelectedQuotation(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to convert to sale");
    } finally {
      setConverting(false);
    }
  };

  const filteredQuotations = quotations.filter((q) => {
    const matchesSearch =
      q.referenceNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.partyResponseDto?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className={styles["company-form-container"]}>
      {/* HEADER */}
      <div className={styles["form-header"]}>
        <div className={styles["header-content"]}>
          <div className={styles["header-icon"]}>
            <Package size={32} style={{ color: "var(--primary-color)" }} />
          </div>
          <div className={styles["header-text"]}>
            <h1 className={styles["company-form-title"]}>Quotations</h1>
            <p className={styles["form-subtitle"]}>Manage all your quotations</p>
          </div>
        </div>
        <button
          onClick={() => navigate("/create_quotation")}
          className={styles["submit-button"]}
          disabled={loading}
        >
          <Plus size={18} />
          <span>New Quotation</span>
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className={styles["search-container"]}>
        <Search size={18} className={styles["search-icon"]} />
        <input
          type="text"
          placeholder="Search by reference # or party name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles["search-input"]}
        />
      </div>

      {/* LOADING */}
      {loading && !converting && (
        <div className={styles["loading-message"]}>
          <Loader size={32} className={styles["spinner"]} />
          <p>Loading quotations...</p>
        </div>
      )}

      {/* TABLE / CARDS */}
      {filteredQuotations.length > 0 ? (
        <>
          {/* Desktop Table */}
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
                {filteredQuotations.map((q) => (
                  <tr key={q.quotationId} className={styles["table-row"]}>
                    <td className={styles["invoice-cell"]}>
                      <span className={styles["invoice-badge"]}>{q.referenceNo}</span>
                    </td>
                    <td>{new Date(q.invoiceDate).toLocaleDateString()}</td>
                    <td>
                      <span className={styles["party-name"]}>{q.partyResponseDto?.name || "—"}</span>
                    </td>
                    <td>{q.quotationItemResponses?.length || 0}</td>
                    <td className={styles["amount-cell"]}>
                      <span className={styles["amount"]}>
                        ₹{Number.parseFloat(q.totalAmountWithoutTax || 0).toFixed(2)}
                      </span>
                    </td>
                    <td className={styles["received-cell"]}>
                      ₹{Number.parseFloat(q.totalTaxAmount || 0).toFixed(2)}
                    </td>
                    <td className={styles["balance-cell"]}>
                      <span className={styles["amount"]}>
                        ₹{Number.parseFloat(q.deliveryCharges || 0).toFixed(2)}
                      </span>
                    </td>
                    <td className={styles["amount-cell"]}>
                      <span className={styles["total-amount"]}>
                        ₹{Number.parseFloat(q.totalAmount || 0).toFixed(2)}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`${styles["status-badge"]} ${
                          q.quotationType === "OPEN" ? styles["status-open"] : styles["status-closed"]
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
            {filteredQuotations.map((q) => (
              <div key={q.quotationId} className={styles["invoice-card"]}>
                <div className={styles["card-header-mobile"]}>
                  <div className={styles["card-title-section"]}>
                    <h3 className={styles["card-invoice-number"]}>{q.referenceNo}</h3>
                    <span
                      className={`${styles["status-badge"]} ${
                        q.quotationType === "OPEN" ? styles["status-open"] : styles["status-closed"]
                      }`}
                    >
                      {q.quotationType}
                    </span>
                  </div>
                  <button onClick={() => setSelectedQuotation(q)} className={styles["card-action-button"]}>
                    <ChevronDown size={20} />
                  </button>
                </div>

                <div className={styles["card-body"]}>
                  <div className={styles["card-info-row"]}>
                    <span className={styles["info-label"]}>Party:</span>
                    <span className={styles["info-value"]}>{q.partyResponseDto?.name || "—"}</span>
                  </div>
                  <div className={styles["card-info-row"]}>
                    <span className={styles["info-label"]}>Date:</span>
                    <span className={styles["info-value"]}>
                      {new Date(q.invoiceDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className={styles["card-info-row"]}>
                    <span className={styles["info-label"]}>Total:</span>
                    <span className={styles["info-value-amount"]}>
                      ₹{Number.parseFloat(q.totalAmount || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className={styles["card-info-row"]}>
                    <span className={styles["info-label"]}>Tax:</span>
                    <span className={styles["info-value"]}>
                      ₹{Number.parseFloat(q.totalTaxAmount || 0).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className={styles["card-footer"]}>
                  <button onClick={() => setSelectedQuotation(q)} className={styles["card-view-button"]}>
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
            <p>No quotations found</p>
            <p className={styles["no-data-subtitle"]}>
              {searchTerm
                ? "Try adjusting your search"
                : 'Click "New Quotation" to create your first quotation.'}
            </p>
          </div>
        )
      )}

      {/* VIEW MODAL */}
      {selectedQuotation && (
        <div className={styles["modal-overlay"]} onClick={() => setSelectedQuotation(null)}>
          <div className={styles["detail-card"]} onClick={(e) => e.stopPropagation()}>
            <div className={styles["card-header"]}>
              <div className={styles["header-title-section"]}>
                <h3>Quotation #{selectedQuotation.referenceNo}</h3>
                <div
                  className={`${styles["balance-badge"]} ${
                    selectedQuotation.quotationType === "CLOSE" ? styles.paid : ""
                  }`}
                >
                  {selectedQuotation.quotationType === "OPEN" ? (
                    <>
                      <AlertCircle size={16} />
                      Open
                    </>
                  ) : (
                    <>
                      <CheckCircle size={16} />
                      Closed
                    </>
                  )}
                </div>
              </div>
              <div className={styles["header-actions"]}>
                {selectedQuotation.quotationType !== "CLOSE" && (
                  <>
                    <button
                      onClick={() => handleEdit(selectedQuotation.quotationId)}
                      className={`${styles["action-button"]} ${styles["edit-button"]}`}
                      title="Edit"
                    >
                      <Edit2 size={16} />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => handleConvert(selectedQuotation.quotationId)}
                      className={`${styles["action-button"]} ${styles["convert-button"]}`}
                      title="Convert to Sale"
                      disabled={converting}
                    >
                      {converting ? (
                        <Loader size={16} className={styles.spinner} />
                      ) : (
                        <Package size={16} />
                      )}
                      <span>{converting ? "Converting…" : "Convert to Sale"}</span>
                    </button>
                  </>
                )}

                <button
                  onClick={() => deleteQuotation(selectedQuotation.quotationId)}
                  className={`${styles["action-button"]} ${styles["delete-button"]}`}
                  title="Delete"
                >
                  <Trash2 size={16} />
                  <span>Delete</span>
                </button>

                <button
                  className={styles["close-modal-btn"]}
                  onClick={() => setSelectedQuotation(null)}
                  title="Close"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Quotation Summary */}
            <section className={styles["card-section"]}>
              <h4 className={styles["section-title"]}>Quotation Summary</h4>
              <div className={styles["detail-grid"]}>
                <div className={styles["detail-item"]}>
                  <span className={styles["detail-label"]}>Reference No:</span>
                  <span className={styles["detail-value"]}>{selectedQuotation.referenceNo}</span>
                </div>
                <div className={styles["detail-item"]}>
                  <span className={styles["detail-label"]}>Date:</span>
                  <span className={styles["detail-value"]}>
                    {new Date(selectedQuotation.invoiceDate).toLocaleDateString()}
                  </span>
                </div>
                <div className={styles["detail-item"]}>
                  <span className={styles["detail-label"]}>State of Supply:</span>
                  <span className={styles["detail-value"]}>
                    {selectedQuotation.stateOfSupply?.replace(/_/g, " ")}
                  </span>
                </div>
                <div className={styles["detail-item"]}>
                  <span className={styles["detail-label"]}>Description:</span>
                  <span className={styles["detail-value"]}>{selectedQuotation.description || "—"}</span>
                </div>
              </div>

              <div className={styles["amount-breakdown"]}>
                <div className={styles["breakdown-row"]}>
                  <span>Total (w/o Tax):</span>
                  <span>₹{Number.parseFloat(selectedQuotation.totalAmountWithoutTax || 0).toFixed(2)}</span>
                </div>
                <div className={styles["breakdown-row"]}>
                  <span>Tax Amount:</span>
                  <span>₹{Number.parseFloat(selectedQuotation.totalTaxAmount || 0).toFixed(2)}</span>
                </div>
                <div className={styles["breakdown-row"]}>
                  <span>Delivery Charges:</span>
                  <span>₹{Number.parseFloat(selectedQuotation.deliveryCharges || 0).toFixed(2)}</span>
                </div>
                <div className={styles["breakdown-row"]}>
                  <span>Total Amount:</span>
                  <span className={styles["total-amount"]}>
                    ₹{Number.parseFloat(selectedQuotation.totalAmount || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </section>

            {/* Party Details */}
            {selectedQuotation.partyResponseDto && (
              <section className={styles["card-section"]}>
                <h4 className={styles["section-title"]}>Party Details</h4>
                <div className={styles["detail-grid"]}>
                  <div className={styles["detail-item"]}>
                    <span className={styles["detail-label"]}>Name:</span>
                    <span className={styles["detail-value"]}>{selectedQuotation.partyResponseDto.name}</span>
                  </div>
                  <div className={styles["detail-item"]}>
                    <span className={styles["detail-label"]}>GSTIN:</span>
                    <span className={styles["detail-value"]}>{selectedQuotation.partyResponseDto.gstin || "—"}</span>
                  </div>
                  <div className={styles["detail-item"]}>
                    <span className={styles["detail-label"]}>Phone:</span>
                    <span className={styles["detail-value"]}>{selectedQuotation.partyResponseDto.phoneNo || "—"}</span>
                  </div>
                  <div className={styles["detail-item"]}>
                    <span className={styles["detail-label"]}>Email:</span>
                    <span className={styles["detail-value"]}>{selectedQuotation.partyResponseDto.emailId || "—"}</span>
                  </div>
                  <div className={styles["detail-item"]}>
                    <span className={styles["detail-label"]}>State:</span>
                    <span className={styles["detail-value"]}>
                      {selectedQuotation.partyResponseDto.state?.replace(/_/g, " ")}
                    </span>
                  </div>
                  <div className={styles["detail-item"]}>
                    <span className={styles["detail-label"]}>Billing Address:</span>
                    <span className={styles["detail-value"]}>
                      {selectedQuotation.partyResponseDto.billingAddress || "—"}
                    </span>
                  </div>
                  <div className={styles["detail-item"]}>
                    <span className={styles["detail-label"]}>Shipping Address:</span>
                    <span className={styles["detail-value"]}>
                      {selectedQuotation.partyResponseDto.shipingAddress || "—"}
                    </span>
                  </div>
                </div>
              </section>
            )}

            {/* Items */}
            <section className={styles["card-section"]}>
              <h4 className={styles["section-title"]}>Items</h4>
              {selectedQuotation.quotationItemResponses?.length > 0 ? (
                <div className={styles["items-table-wrapper"]}>
                  <table className={styles["items-table"]}>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>HSN</th>
                        <th>Qty</th>
                        <th>Unit</th>
                        <th>Rate</th>
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
                          <td>₹{Number.parseFloat(it.pricePerUnit || 0).toFixed(2)}</td>
                          <td>{it.pricePerUnitTaxType}</td>
                          <td>{it.taxRate}</td>
                          <td>₹{Number.parseFloat(it.totalTaxAmount || 0).toFixed(2)}</td>
                          <td>₹{Number.parseFloat(it.totalAmount || 0).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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