// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import config from "../../../config/apiconfig";
// import styles from "./Delivery.module.css";
// import { toast } from "react-toastify";

// const Delivery = () => {
//   const navigate = useNavigate();
//   const userData = JSON.parse(localStorage.getItem("eBilling")) || {};
//   const token = userData?.accessToken || "";
//   const companyId = userData?.selectedCompany?.id || "";

//   const [challans, setChallans] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedChallan, setSelectedChallan] = useState(null);

//   const fetchDeliveryChallans = async () => {
//     if (!token || !companyId) return;
//     setLoading(true);
//     try {
//       const res = await axios.get(
//         `${config.BASE_URL}/company/${companyId}/get/delivery-challan/list/by`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       setChallans(res.data || []);
//     } catch (err) {
//       toast.error("Failed to load delivery challans");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDeliveryChallans();
//   }, [token, companyId]);

//   const deleteChallan = async (challanId) => {
//     if (!window.confirm("Are you sure you want to delete this delivery challan?")) return;

//     try {
//       await axios.delete(`${config.BASE_URL}/delivery-challan/${challanId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setChallans((prev) => prev.filter((c) => c.deliveryChallanId !== challanId));
//       toast.success("Delivery challan deleted successfully");
//       setSelectedChallan(null);
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to delete challan");
//     }
//   };

//   const handleEdit = (challanId) => {
//     navigate(`/create_delivery?edit=${challanId}`);
//     setSelectedChallan(null);
//   };

//   return (
//     <div className={styles["company-form-container"]}>
//       {/* Header */}
//       <div className={styles["form-header"]}>
//         <div>
//           <h1 className={styles["company-form-title"]}>Delivery Challans</h1>
//           <p className={styles["form-subtitle"]}>Manage all your delivery challans</p>
//         </div>
//         <button
//           onClick={() => navigate("/create_delivery")}
//           className={styles["submit-button"]}
//           disabled={loading}
//         >
//           Create Delivery Challan
//         </button>
//       </div>

//       {/* Loading */}
//       {loading && (
//         <div className={styles["loading-message"]}>
//           <div className={styles.spinner}></div>
//           <p>Loading delivery challans...</p>
//         </div>
//       )}

//       {/* Table */}
//       {challans.length > 0 ? (
//         <div className={styles["table-wrapper"]}>
//           <table className={styles.table}>
//             <thead>
//               <tr>
//                 <th>Challan No</th>
//                 <th>Challan Date</th>
//                 <th>Due Date</th>
//                 <th>Party Name</th>
//                 <th>Total Qty</th>
//                 <th>Total Amount</th>
//                 <th>Discount</th>
//                 <th>Tax</th>
//                 <th>Status</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {challans.map((c) => (
//                 <tr key={c.deliveryChallanId}>
//                   <td>{c.challanNo}</td>
//                   <td>{new Date(c.challanDate).toLocaleDateString()}</td>
//                   <td>{new Date(c.dueDate).toLocaleDateString()}</td>
//                   <td>{c.partyResponseDto?.name || "—"}</td>
//                   <td>{c.totalQuantity}</td>
//                   <td>₹{parseFloat(c.totalAmount).toFixed(2)}</td>
//                   <td>₹{parseFloat(c.totalDiscountAmount).toFixed(2)}</td>
//                   <td>₹{parseFloat(c.totalTaxAmount).toFixed(2)}</td>
//                   <td>
//                     <span
//                       className={`${styles["status-badge"]} ${
//                         c.challanType === "CLOSE" ? styles.closed : styles.open
//                       }`}
//                     >
//                       {c.challanType}
//                     </span>
//                   </td>
//                   <td className={styles["actions-cell"]}>
//                     <button
//                       onClick={() => setSelectedChallan(c)}
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
//             <p>No delivery challans found</p>
//             <p className={styles["no-data-subtitle"]}>
//               Click "Create Delivery Challan" to add your first one.
//             </p>
//           </div>
//         )
//       )}

//       {/* VIEW MODAL */}
//       {selectedChallan && (
//         <div className={styles["modal-overlay"]} onClick={() => setSelectedChallan(null)}>
//           <div className={styles["detail-card"]} onClick={(e) => e.stopPropagation()}>
//             <div className={styles["card-header"]}>
//               <div>
//                 <h3>Delivery Challan #{selectedChallan.challanNo}</h3>
//                 <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
//                   <div
//                     className={`${styles["status-badge"]} ${
//                       selectedChallan.challanType === "CLOSE" ? styles.closed : styles.open
//                     }`}
//                     style={{ fontSize: "0.8rem", padding: "4px 8px" }}
//                   >
//                     {selectedChallan.challanType}
//                   </div>
//                 </div>
//               </div>
//               <div>
//                 {/* Edit Button: Hidden if challanType === "CLOSE" */}
//                 {selectedChallan.challanType !== "CLOSE" && (
//                   <button
//                     onClick={() => handleEdit(selectedChallan.deliveryChallanId)}
//                     className={`${styles["action-button"]} ${styles["edit-button"]}`}
//                     title="Edit challan"
//                   >
//                     Edit
//                   </button>
//                 )}

//                 <button
//                   onClick={() => deleteChallan(selectedChallan.deliveryChallanId)}
//                   className={`${styles["action-button"]} ${styles["delete-button"]}`}
//                   title="Delete challan"
//                 >
//                   Delete
//                 </button>

//                 <button
//                   className={styles["close-modal-btn"]}
//                   onClick={() => setSelectedChallan(null)}
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>

//             {/* Challan Details */}
//             <section className={styles["card-section"]}>
//               <h4>Challan Details</h4>
//               <div className={styles["detail-grid"]}>
//                 <p><strong>Challan No:</strong> {selectedChallan.challanNo}</p>
//                 <p><strong>Challan Date:</strong> {new Date(selectedChallan.challanDate).toLocaleDateString()}</p>
//                 <p><strong>Due Date:</strong> {new Date(selectedChallan.dueDate).toLocaleDateString()}</p>
//                 <p><strong>Challan Type:</strong>
//                   <span
//                     className={`${styles["status-badge"]} ${
//                       selectedChallan.challanType === "CLOSE" ? styles.closed : styles.open
//                     }`}
//                   >
//                     {selectedChallan.challanType}
//                   </span>
//                 </p>
//                 <p><strong>State of Supply:</strong> {selectedChallan.stateOfSupply?.replace(/_/g, " ")}</p>
//                 <p><strong>Description:</strong> {selectedChallan.description || "—"}</p>
//                 <p><strong>Total Quantity:</strong> {selectedChallan.totalQuantity}</p>
//                 <p><strong>Total Discount:</strong> ₹{selectedChallan.totalDiscountAmount.toFixed(2)}</p>
//                 <p><strong>Total Tax:</strong> ₹{selectedChallan.totalTaxAmount.toFixed(2)}</p>
//                 <p><strong>Total Amount:</strong> ₹{selectedChallan.totalAmount.toFixed(2)}</p>
//               </div>
//             </section>

//             {/* Party */}
//             {selectedChallan.partyResponseDto && (
//               <section className={styles["card-section"]}>
//                 <h4>Party Details</h4>
//                 <div className={styles["detail-grid"]}>
//                   <p><strong>Name:</strong> {selectedChallan.partyResponseDto.name}</p>
//                   <p><strong>Party ID:</strong> {selectedChallan.partyResponseDto.partyId}</p>
//                   <p><strong>GSTIN:</strong> {selectedChallan.partyResponseDto.gstin || "—"}</p>
//                   <p><strong>GST Type:</strong> {selectedChallan.partyResponseDto.gstType?.replace(/_/g, " ")}</p>
//                   <p><strong>Phone:</strong> {selectedChallan.partyResponseDto.phoneNo || "—"}</p>
//                   <p><strong>Email:</strong> {selectedChallan.partyResponseDto.emailId || "—"}</p>
//                   <p><strong>State:</strong> {selectedChallan.partyResponseDto.state?.replace(/_/g, " ")}</p>
//                   <p><strong>Billing Address:</strong> {selectedChallan.partyResponseDto.billingAddress || "—"}</p>
//                   <p><strong>Shipping Address:</strong> {selectedChallan.partyResponseDto.shipingAddress || "—"}</p>
//                 </div>
//               </section>
//             )}

//             {/* Items */}
//             <section className={styles["card-section"]}>
//               <h4>Items</h4>
//               {selectedChallan.deliveryChallanItemResponses?.length > 0 ? (
//                 <table className={styles["items-table"]}>
//                   <thead>
//                     <tr>
//                       <th>Name</th>
//                       <th>Qty</th>
//                       <th>Unit</th>
//                       <th>Rate/Unit</th>
//                       <th>Discount</th>
//                       <th>Tax Type</th>
//                       <th>Tax Rate</th>
//                       <th>Tax</th>
//                       <th>Total</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {selectedChallan.deliveryChallanItemResponses.map((item, i) => (
//                       <tr key={i}>
//                         <td>{item.name}</td>
//                         <td>{item.quantity}</td>
//                         <td>{item.unit}</td>
//                         <td>₹{item.ratePerUnit.toFixed(2)}</td>
//                         <td>₹{item.discountAmount.toFixed(2)}</td>
//                         <td>{item.taxType}</td>
//                         <td>{item.taxRate}</td>
//                         <td>₹{item.totalTaxAmount.toFixed(2)}</td>
//                         <td>₹{item.totalAmount.toFixed(2)}</td>
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

// export default Delivery;







// // src/pages/delivery/Delivery.jsx
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

// const Delivery = () => {
//   const navigate = useNavigate();
//   const userData = JSON.parse(localStorage.getItem("eBilling")) || {};
//   const token = userData?.accessToken || "";
//   const companyId = userData?.selectedCompany?.id || "";

//   const [challans, setChallans] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedChallan, setSelectedChallan] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");

//   const fetchDeliveryChallans = async () => {
//     if (!token || !companyId) {
//       toast.error("Session expired or no company selected.");
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await axios.get(
//         `${config.BASE_URL}/company/${companyId}/get/delivery-challan/list/by`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       setChallans(res.data || []);
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to load delivery challans");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDeliveryChallans();
//   }, [token, companyId]);

//   const deleteChallan = async (challanId) => {
//     if (!window.confirm("Are you sure you want to delete this delivery challan? This action cannot be undone.")) {
//       return;
//     }

//     try {
//       setLoading(true);
//       await axios.delete(`${config.BASE_URL}/delivery-challan/${challanId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setChallans((prev) => prev.filter((c) => c.deliveryChallanId !== challanId));
//       setSelectedChallan(null);
//       toast.success("Delivery challan deleted successfully");
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to delete challan");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (challanId) => {
//     navigate(`/create_delivery?edit=${challanId}`);
//     setSelectedChallan(null);
//   };

//   const filteredChallans = challans.filter((c) => {
//     const matchesSearch =
//       c.challanNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       c.partyResponseDto?.name?.toLowerCase().includes(searchTerm.toLowerCase());
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
//             <h1 className={styles["company-form-title"]}>Delivery Challans</h1>
//             <p className={styles["form-subtitle"]}>Manage all your delivery challans</p>
//           </div>
//         </div>
//         <button
//           onClick={() => navigate("/create_delivery")}
//           className={styles["submit-button"]}
//           disabled={loading}
//         >
//           <Plus size={18} />
//           <span>New Challan</span>
//         </button>
//       </div>

//       {/* SEARCH BAR */}
//       <div className={styles["search-container"]}>
//         <Search size={18} className={styles["search-icon"]} />
//         <input
//           type="text"
//           placeholder="Search by challan # or party name..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className={styles["search-input"]}
//         />
//       </div>

//       {/* LOADING */}
//       {loading && (
//         <div className={styles["loading-message"]}>
//           <Loader size={32} className={styles["spinner"]} />
//           <p>Loading challans...</p>
//         </div>
//       )}

//       {/* TABLE / CARDS */}
//       {filteredChallans.length > 0 ? (
//         <>
//           {/* Desktop Table */}
//           <div className={styles["table-wrapper"]}>
//             <table className={styles.table}>
//               <thead>
//                 <tr>
//                   <th>Challan #</th>
//                   <th>Challan Date</th>
//                   <th>Due Date</th>
//                   <th>Party</th>
//                   <th>Total Qty</th>
//                   <th>Total</th>
//                   <th>Discount</th>
//                   <th>Tax</th>
//                   <th>Status</th>
//                   <th>Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredChallans.map((c) => (
//                   <tr key={c.deliveryChallanId} className={styles["table-row"]}>
//                     <td className={styles["invoice-cell"]}>
//                       <span className={styles["invoice-badge"]}>{c.challanNo}</span>
//                     </td>
//                     <td>{new Date(c.challanDate).toLocaleDateString()}</td>
//                     <td>{new Date(c.dueDate).toLocaleDateString()}</td>
//                     <td>
//                       <span className={styles["party-name"]}>{c.partyResponseDto?.name || "—"}</span>
//                     </td>
//                     <td>{c.totalQuantity}</td>
//                     <td className={styles["amount-cell"]}>
//                       <span className={styles["amount"]}>
//                         ₹{Number.parseFloat(c.totalAmount || 0).toFixed(2)}
//                       </span>
//                     </td>
//                     <td className={styles["received-cell"]}>
//                       ₹{Number.parseFloat(c.totalDiscountAmount || 0).toFixed(2)}
//                     </td>
//                     <td className={styles["balance-cell"]}>
//                       <span className={styles["amount"]}>
//                         ₹{Number.parseFloat(c.totalTaxAmount || 0).toFixed(2)}
//                       </span>
//                     </td>
//                     <td>
//                       <span
//                         className={`${styles["status-badge"]} ${
//                           c.challanType === "OPEN" ? styles["status-open"] : styles["status-closed"]
//                         }`}
//                       >
//                         {c.challanType}
//                       </span>
//                     </td>
//                     <td className={styles["actions-cell"]}>
//                       <button
//                         onClick={() => setSelectedChallan(c)}
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
//             {filteredChallans.map((c) => (
//               <div key={c.deliveryChallanId} className={styles["invoice-card"]}>
//                 <div className={styles["card-header-mobile"]}>
//                   <div className={styles["card-title-section"]}>
//                     <h3 className={styles["card-invoice-number"]}>{c.challanNo}</h3>
//                     <span
//                       className={`${styles["status-badge"]} ${
//                         c.challanType === "OPEN" ? styles["status-open"] : styles["status-closed"]
//                       }`}
//                     >
//                       {c.challanType}
//                     </span>
//                   </div>
//                   <button onClick={() => setSelectedChallan(c)} className={styles["card-action-button"]}>
//                     <ChevronDown size={20} />
//                   </button>
//                 </div>

//                 <div className={styles["card-body"]}>
//                   <div className={styles["card-info-row"]}>
//                     <span className={styles["info-label"]}>Party:</span>
//                     <span className={styles["info-value"]}>{c.partyResponseDto?.name || "—"}</span>
//                   </div>
//                   <div className={styles["card-info-row"]}>
//                     <span className={styles["info-label"]}>Date:</span>
//                     <span className={styles["info-value"]}>
//                       {new Date(c.challanDate).toLocaleDateString()}
//                     </span>
//                   </div>
//                   <div className={styles["card-info-row"]}>
//                     <span className={styles["info-label"]}>Total:</span>
//                     <span className={styles["info-value-amount"]}>
//                       ₹{Number.parseFloat(c.totalAmount || 0).toFixed(2)}
//                     </span>
//                   </div>
//                   <div className={styles["card-info-row"]}>
//                     <span className={styles["info-label"]}>Tax:</span>
//                     <span className={styles["info-value"]}>
//                       ₹{Number.parseFloat(c.totalTaxAmount || 0).toFixed(2)}
//                     </span>
//                   </div>
//                 </div>

//                 <div className={styles["card-footer"]}>
//                   <button onClick={() => setSelectedChallan(c)} className={styles["card-view-button"]}>
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
//             <p>No delivery challans found</p>
//             <p className={styles["no-data-subtitle"]}>
//               {searchTerm
//                 ? "Try adjusting your search"
//                 : 'Click "New Challan" to create your first delivery challan.'}
//             </p>
//           </div>
//         )
//       )}

//       {/* VIEW MODAL */}
//       {selectedChallan && (
//         <div className={styles["modal-overlay"]} onClick={() => setSelectedChallan(null)}>
//           <div className={styles["detail-card"]} onClick={(e) => e.stopPropagation()}>
//             <div className={styles["card-header"]}>
//               <div className={styles["header-title-section"]}>
//                 <h3>Delivery Challan #{selectedChallan.challanNo}</h3>
//                 <div className={`${styles["balance-badge"]} ${selectedChallan.challanType === "CLOSE" ? styles.paid : ""}`}>
//                   {selectedChallan.challanType === "OPEN" ? (
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
//                 {selectedChallan.challanType !== "CLOSE" && (
//                   <button
//                     onClick={() => handleEdit(selectedChallan.deliveryChallanId)}
//                     className={`${styles["action-button"]} ${styles["edit-button"]}`}
//                     title="Edit challan"
//                   >
//                     <Edit2 size={16} />
//                     <span>Edit</span>
//                   </button>
//                 )}
//                 <button
//                   onClick={() => deleteChallan(selectedChallan.deliveryChallanId)}
//                   className={`${styles["action-button"]} ${styles["delete-button"]}`}
//                   title="Delete challan"
//                 >
//                   <Trash2 size={16} />
//                   <span>Delete</span>
//                 </button>
//                 <button
//                   className={styles["close-modal-btn"]}
//                   onClick={() => setSelectedChallan(null)}
//                   title="Close"
//                 >
//                   <X size={20} />
//                 </button>
//               </div>
//             </div>

//             {/* Challan Summary */}
//             <section className={styles["card-section"]}>
//               <h4 className={styles["section-title"]}>Challan Summary</h4>
//               <div className={styles["detail-grid"]}>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>Challan ID:</span>
//                   <span className={styles["detail-value"]}>{selectedChallan.deliveryChallanId}</span>
//                 </div>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>Challan Date:</span>
//                   <span className={styles["detail-value"]}>
//                     {new Date(selectedChallan.challanDate).toLocaleDateString()}
//                   </span>
//                 </div>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>Due Date:</span>
//                   <span className={styles["detail-value"]}>
//                     {new Date(selectedChallan.dueDate).toLocaleDateString()}
//                   </span>
//                 </div>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>Challan Type:</span>
//                   <span className={styles["detail-value"]}>{selectedChallan.challanType}</span>
//                 </div>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>State of Supply:</span>
//                   <span className={styles["detail-value"]}>
//                     {selectedChallan.stateOfSupply?.replace(/_/g, " ")}
//                   </span>
//                 </div>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>Description:</span>
//                   <span className={styles["detail-value"]}>{selectedChallan.description || "—"}</span>
//                 </div>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>Total Quantity:</span>
//                   <span className={styles["detail-value"]}>{selectedChallan.totalQuantity}</span>
//                 </div>
//               </div>

//               <div className={styles["amount-breakdown"]}>
//                 <div className={styles["breakdown-row"]}>
//                   <span>Total Amount:</span>
//                   <span className={styles["total-amount"]}>
//                     ₹{Number.parseFloat(selectedChallan.totalAmount || 0).toFixed(2)}
//                   </span>
//                 </div>
//                 <div className={styles["breakdown-row"]}>
//                   <span>Total Discount:</span>
//                   <span>₹{Number.parseFloat(selectedChallan.totalDiscountAmount || 0).toFixed(2)}</span>
//                 </div>
//                 <div className={styles["breakdown-row"]}>
//                   <span>Total Tax:</span>
//                   <span>₹{Number.parseFloat(selectedChallan.totalTaxAmount || 0).toFixed(2)}</span>
//                 </div>
//               </div>
//             </section>

//             {/* Party Details */}
//             {selectedChallan.partyResponseDto && (
//               <section className={styles["card-section"]}>
//                 <h4 className={styles["section-title"]}>Party Details</h4>
//                 <div className={styles["detail-grid"]}>
//                   <div className={styles["detail-item"]}>
//                     <span className={styles["detail-label"]}>Name:</span>
//                     <span className={styles["detail-value"]}>{selectedChallan.partyResponseDto.name}</span>
//                   </div>
//                   <div className={styles["detail-item"]}>
//                     <span className={styles["detail-label"]}>Party ID:</span>
//                     <span className={styles["detail-value"]}>{selectedChallan.partyResponseDto.partyId}</span>
//                   </div>
//                   <div className={styles["detail-item"]}>
//                     <span className={styles["detail-label"]}>GSTIN:</span>
//                     <span className={styles["detail-value"]}>{selectedChallan.partyResponseDto.gstin || "—"}</span>
//                   </div>
//                   <div className={styles["detail-item"]}>
//                     <span className={styles["detail-label"]}>GST Type:</span>
//                     <span className={styles["detail-value"]}>
//                       {selectedChallan.partyResponseDto.gstType?.replace(/_/g, " ")}
//                     </span>
//                   </div>
//                   <div className={styles["detail-item"]}>
//                     <span className={styles["detail-label"]}>Phone:</span>
//                     <span className={styles["detail-value"]}>{selectedChallan.partyResponseDto.phoneNo || "—"}</span>
//                   </div>
//                   <div className={styles["detail-item"]}>
//                     <span className={styles["detail-label"]}>Email:</span>
//                     <span className={styles["detail-value"]}>{selectedChallan.partyResponseDto.emailId || "—"}</span>
//                   </div>
//                   <div className={styles["detail-item"]}>
//                     <span className={styles["detail-label"]}>State:</span>
//                     <span className={styles["detail-value"]}>
//                       {selectedChallan.partyResponseDto.state?.replace(/_/g, " ")}
//                     </span>
//                   </div>
//                   <div className={styles["detail-item"]}>
//                     <span className={styles["detail-label"]}>Billing Address:</span>
//                     <span className={styles["detail-value"]}>
//                       {selectedChallan.partyResponseDto.billingAddress || "—"}
//                     </span>
//                   </div>
//                   <div className={styles["detail-item"]}>
//                     <span className={styles["detail-label"]}>Shipping Address:</span>
//                     <span className={styles["detail-value"]}>
//                       {selectedChallan.partyResponseDto.shipingAddress || "—"}
//                     </span>
//                   </div>
//                 </div>
//               </section>
//             )}

//             {/* Items */}
//             <section className={styles["card-section"]}>
//               <h4 className={styles["section-title"]}>Items</h4>
//               {selectedChallan.deliveryChallanItemResponses?.length > 0 ? (
//                 <div className={styles["items-table-wrapper"]}>
//                   <table className={styles["items-table"]}>
//                     <thead>
//                       <tr>
//                         <th>Name</th>
//                         <th>Qty</th>
//                         <th>Unit</th>
//                         <th>Rate</th>
//                         <th>Discount</th>
//                         <th>Tax Type</th>
//                         <th>Tax Rate</th>
//                         <th>Tax</th>
//                         <th>Total</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {selectedChallan.deliveryChallanItemResponses.map((item, i) => (
//                         <tr key={i}>
//                           <td>{item.name}</td>
//                           <td>{item.quantity}</td>
//                           <td>{item.unit}</td>
//                           <td>₹{Number.parseFloat(item.ratePerUnit || 0).toFixed(2)}</td>
//                           <td>₹{Number.parseFloat(item.discountAmount || 0).toFixed(2)}</td>
//                           <td>{item.taxType}</td>
//                           <td>{item.taxRate}</td>
//                           <td>₹{Number.parseFloat(item.totalTaxAmount || 0).toFixed(2)}</td>
//                           <td>₹{Number.parseFloat(item.totalAmount || 0).toFixed(2)}</td>
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

// export default Delivery;









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
  AlertCircle,
  CheckCircle,
  ChevronDown,
  Search,
  Loader,
} from "lucide-react";

const Delivery = () => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("eBilling") || "{}")
  );

  const token = userData?.accessToken;
  const companyId = userData?.selectedCompany?.id;

  const [challans, setChallans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedChallan, setSelectedChallan] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Sync userData
  useEffect(() => {
    const handleStorageChange = () => {
      const updated = JSON.parse(localStorage.getItem("eBilling") || "{}");
      setUserData(updated);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Fetch delivery challans + auth check
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

    const fetchDeliveryChallans = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/company/${companyId}/get/delivery-challan/list/by`);
        setChallans(res.data || []);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load delivery challans");
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveryChallans();
  }, [token, companyId, navigate]);

  const deleteChallan = async (challanId) => {
    if (!window.confirm("Are you sure you want to delete this delivery challan? This action cannot be undone.")) {
      return;
    }

    try {
      setLoading(true);
      await api.delete(`/delivery-challan/${challanId}`);
      setChallans((prev) => prev.filter((c) => c.deliveryChallanId !== challanId));
      setSelectedChallan(null);
      toast.success("Delivery challan deleted successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete challan");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (challanId) => {
    navigate(`/create_delivery?edit=${challanId}`);
    setSelectedChallan(null);
  };

  const filteredChallans = challans.filter((c) => {
    const matchesSearch =
      c.challanNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.partyResponseDto?.name?.toLowerCase().includes(searchTerm.toLowerCase());
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
            <h1 className={styles["company-form-title"]}>Delivery Challans</h1>
            <p className={styles["form-subtitle"]}>Manage all your delivery challans</p>
          </div>
        </div>
        <button
          onClick={() => navigate("/create_delivery")}
          className={styles["submit-button"]}
          disabled={loading}
        >
          <Plus size={18} />
          <span>New Challan</span>
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className={styles["search-container"]}>
        <Search size={18} className={styles["search-icon"]} />
        <input
          type="text"
          placeholder="Search by challan # or party name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles["search-input"]}
        />
      </div>

      {/* LOADING */}
      {loading && (
        <div className={styles["loading-message"]}>
          <Loader size={32} className={styles["spinner"]} />
          <p>Loading challans...</p>
        </div>
      )}

      {/* TABLE / CARDS */}
      {filteredChallans.length > 0 ? (
        <>
          {/* Desktop Table */}
          <div className={styles["table-wrapper"]}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Challan #</th>
                  <th>Challan Date</th>
                  <th>Due Date</th>
                  <th>Party</th>
                  <th>Total Qty</th>
                  <th>Total</th>
                  <th>Discount</th>
                  <th>Tax</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredChallans.map((c) => (
                  <tr key={c.deliveryChallanId} className={styles["table-row"]}>
                    <td className={styles["invoice-cell"]}>
                      <span className={styles["invoice-badge"]}>{c.challanNo}</span>
                    </td>
                    <td>{new Date(c.challanDate).toLocaleDateString()}</td>
                    <td>{new Date(c.dueDate).toLocaleDateString()}</td>
                    <td>
                      <span className={styles["party-name"]}>{c.partyResponseDto?.name || "—"}</span>
                    </td>
                    <td>{c.totalQuantity}</td>
                    <td className={styles["amount-cell"]}>
                      <span className={styles["amount"]}>
                        ₹{Number.parseFloat(c.totalAmount || 0).toFixed(2)}
                      </span>
                    </td>
                    <td className={styles["received-cell"]}>
                      ₹{Number.parseFloat(c.totalDiscountAmount || 0).toFixed(2)}
                    </td>
                    <td className={styles["balance-cell"]}>
                      <span className={styles["amount"]}>
                        ₹{Number.parseFloat(c.totalTaxAmount || 0).toFixed(2)}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`${styles["status-badge"]} ${
                          c.challanType === "OPEN" ? styles["status-open"] : styles["status-closed"]
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
            {filteredChallans.map((c) => (
              <div key={c.deliveryChallanId} className={styles["invoice-card"]}>
                <div className={styles["card-header-mobile"]}>
                  <div className={styles["card-title-section"]}>
                    <h3 className={styles["card-invoice-number"]}>{c.challanNo}</h3>
                    <span
                      className={`${styles["status-badge"]} ${
                        c.challanType === "OPEN" ? styles["status-open"] : styles["status-closed"]
                      }`}
                    >
                      {c.challanType}
                    </span>
                  </div>
                  <button onClick={() => setSelectedChallan(c)} className={styles["card-action-button"]}>
                    <ChevronDown size={20} />
                  </button>
                </div>

                <div className={styles["card-body"]}>
                  <div className={styles["card-info-row"]}>
                    <span className={styles["info-label"]}>Party:</span>
                    <span className={styles["info-value"]}>{c.partyResponseDto?.name || "—"}</span>
                  </div>
                  <div className={styles["card-info-row"]}>
                    <span className={styles["info-label"]}>Date:</span>
                    <span className={styles["info-value"]}>
                      {new Date(c.challanDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className={styles["card-info-row"]}>
                    <span className={styles["info-label"]}>Total:</span>
                    <span className={styles["info-value-amount"]}>
                      ₹{Number.parseFloat(c.totalAmount || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className={styles["card-info-row"]}>
                    <span className={styles["info-label"]}>Tax:</span>
                    <span className={styles["info-value"]}>
                      ₹{Number.parseFloat(c.totalTaxAmount || 0).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className={styles["card-footer"]}>
                  <button onClick={() => setSelectedChallan(c)} className={styles["card-view-button"]}>
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
            <p>No delivery challans found</p>
            <p className={styles["no-data-subtitle"]}>
              {searchTerm
                ? "Try adjusting your search"
                : 'Click "New Challan" to create your first delivery challan.'}
            </p>
          </div>
        )
      )}

      {/* VIEW MODAL */}
      {selectedChallan && (
        <div className={styles["modal-overlay"]} onClick={() => setSelectedChallan(null)}>
          <div className={styles["detail-card"]} onClick={(e) => e.stopPropagation()}>
            <div className={styles["card-header"]}>
              <div className={styles["header-title-section"]}>
                <h3>Delivery Challan #{selectedChallan.challanNo}</h3>
                <div className={`${styles["balance-badge"]} ${selectedChallan.challanType === "CLOSE" ? styles.paid : ""}`}>
                  {selectedChallan.challanType === "OPEN" ? (
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
                {/* EDIT: Only if not CLOSED */}
                {selectedChallan.challanType !== "CLOSE" && (
                  <button
                    onClick={() => handleEdit(selectedChallan.deliveryChallanId)}
                    className={`${styles["action-button"]} ${styles["edit-button"]}`}
                    title="Edit challan"
                  >
                    <Edit2 size={16} />
                    <span>Edit</span>
                  </button>
                )}
                <button
                  onClick={() => deleteChallan(selectedChallan.deliveryChallanId)}
                  className={`${styles["action-button"]} ${styles["delete-button"]}`}
                  title="Delete challan"
                >
                  <Trash2 size={16} />
                  <span>Delete</span>
                </button>
                <button
                  className={styles["close-modal-btn"]}
                  onClick={() => setSelectedChallan(null)}
                  title="Close"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Challan Summary */}
            <section className={styles["card-section"]}>
              <h4 className={styles["section-title"]}>Challan Summary</h4>
              <div className={styles["detail-grid"]}>
                <div className={styles["detail-item"]}>
                  <span className={styles["detail-label"]}>Challan ID:</span>
                  <span className={styles["detail-value"]}>{selectedChallan.deliveryChallanId}</span>
                </div>
                <div className={styles["detail-item"]}>
                  <span className={styles["detail-label"]}>Challan Date:</span>
                  <span className={styles["detail-value"]}>
                    {new Date(selectedChallan.challanDate).toLocaleDateString()}
                  </span>
                </div>
                <div className={styles["detail-item"]}>
                  <span className={styles["detail-label"]}>Due Date:</span>
                  <span className={styles["detail-value"]}>
                    {new Date(selectedChallan.dueDate).toLocaleDateString()}
                  </span>
                </div>
                <div className={styles["detail-item"]}>
                  <span className={styles["detail-label"]}>Challan Type:</span>
                  <span className={styles["detail-value"]}>{selectedChallan.challanType}</span>
                </div>
                <div className={styles["detail-item"]}>
                  <span className={styles["detail-label"]}>State of Supply:</span>
                  <span className={styles["detail-value"]}>
                    {selectedChallan.stateOfSupply?.replace(/_/g, " ")}
                  </span>
                </div>
                <div className={styles["detail-item"]}>
                  <span className={styles["detail-label"]}>Description:</span>
                  <span className={styles["detail-value"]}>{selectedChallan.description || "—"}</span>
                </div>
                <div className={styles["detail-item"]}>
                  <span className={styles["detail-label"]}>Total Quantity:</span>
                  <span className={styles["detail-value"]}>{selectedChallan.totalQuantity}</span>
                </div>
              </div>

              <div className={styles["amount-breakdown"]}>
                <div className={styles["breakdown-row"]}>
                  <span>Total Amount:</span>
                  <span className={styles["total-amount"]}>
                    ₹{Number.parseFloat(selectedChallan.totalAmount || 0).toFixed(2)}
                  </span>
                </div>
                <div className={styles["breakdown-row"]}>
                  <span>Total Discount:</span>
                  <span>₹{Number.parseFloat(selectedChallan.totalDiscountAmount || 0).toFixed(2)}</span>
                </div>
                <div className={styles["breakdown-row"]}>
                  <span>Total Tax:</span>
                  <span>₹{Number.parseFloat(selectedChallan.totalTaxAmount || 0).toFixed(2)}</span>
                </div>
              </div>
            </section>

            {/* Party Details */}
            {selectedChallan.partyResponseDto && (
              <section className={styles["card-section"]}>
                <h4 className={styles["section-title"]}>Party Details</h4>
                <div className={styles["detail-grid"]}>
                  <div className={styles["detail-item"]}>
                    <span className={styles["detail-label"]}>Name:</span>
                    <span className={styles["detail-value"]}>{selectedChallan.partyResponseDto.name}</span>
                  </div>
                  <div className={styles["detail-item"]}>
                    <span className={styles["detail-label"]}>Party ID:</span>
                    <span className={styles["detail-value"]}>{selectedChallan.partyResponseDto.partyId}</span>
                  </div>
                  <div className={styles["detail-item"]}>
                    <span className={styles["detail-label"]}>GSTIN:</span>
                    <span className={styles["detail-value"]}>{selectedChallan.partyResponseDto.gstin || "—"}</span>
                  </div>
                  <div className={styles["detail-item"]}>
                    <span className={styles["detail-label"]}>GST Type:</span>
                    <span className={styles["detail-value"]}>
                      {selectedChallan.partyResponseDto.gstType?.replace(/_/g, " ")}
                    </span>
                  </div>
                  <div className={styles["detail-item"]}>
                    <span className={styles["detail-label"]}>Phone:</span>
                    <span className={styles["detail-value"]}>{selectedChallan.partyResponseDto.phoneNo || "—"}</span>
                  </div>
                  <div className={styles["detail-item"]}>
                    <span className={styles["detail-label"]}>Email:</span>
                    <span className={styles["detail-value"]}>{selectedChallan.partyResponseDto.emailId || "—"}</span>
                  </div>
                  <div className={styles["detail-item"]}>
                    <span className={styles["detail-label"]}>State:</span>
                    <span className={styles["detail-value"]}>
                      {selectedChallan.partyResponseDto.state?.replace(/_/g, " ")}
                    </span>
                  </div>
                  <div className={styles["detail-item"]}>
                    <span className={styles["detail-label"]}>Billing Address:</span>
                    <span className={styles["detail-value"]}>
                      {selectedChallan.partyResponseDto.billingAddress || "—"}
                    </span>
                  </div>
                  <div className={styles["detail-item"]}>
                    <span className={styles["detail-label"]}>Shipping Address:</span>
                    <span className={styles["detail-value"]}>
                      {selectedChallan.partyResponseDto.shipingAddress || "—"}
                    </span>
                  </div>
                </div>
              </section>
            )}

            {/* Items */}
            <section className={styles["card-section"]}>
              <h4 className={styles["section-title"]}>Items</h4>
              {selectedChallan.deliveryChallanItemResponses?.length > 0 ? (
                <div className={styles["items-table-wrapper"]}>
                  <table className={styles["items-table"]}>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Qty</th>
                        <th>Unit</th>
                        <th>Rate</th>
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
                          <td>₹{Number.parseFloat(item.ratePerUnit || 0).toFixed(2)}</td>
                          <td>₹{Number.parseFloat(item.discountAmount || 0).toFixed(2)}</td>
                          <td>{item.taxType}</td>
                          <td>{item.taxRate}</td>
                          <td>₹{Number.parseFloat(item.totalTaxAmount || 0).toFixed(2)}</td>
                          <td>₹{Number.parseFloat(item.totalAmount || 0).toFixed(2)}</td>
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

export default Delivery;