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









// "use client";

// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../../../utils/axiosInstance"; // Shared API with interceptors
// import { toast } from "react-toastify";
// import styles from "../Styles/ScreenUI.module.css";
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

//   const [userData, setUserData] = useState(
//     JSON.parse(localStorage.getItem("eBilling") || "{}")
//   );

//   const token = userData?.accessToken;
//   const companyId = userData?.selectedCompany?.id;

//   const [challans, setChallans] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedChallan, setSelectedChallan] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");

//   // Sync userData
//   useEffect(() => {
//     const handleStorageChange = () => {
//       const updated = JSON.parse(localStorage.getItem("eBilling") || "{}");
//       setUserData(updated);
//     };

//     window.addEventListener("storage", handleStorageChange);
//     return () => window.removeEventListener("storage", handleStorageChange);
//   }, []);

//   // Fetch delivery challans + auth check
//   useEffect(() => {
//     if (!token) {
//       toast.info("Please log in to continue.");
//       navigate("/login");
//       return;
//     }
//     if (!companyId) {
//       toast.info("Please select a company first.");
//       navigate("/company-list");
//       return;
//     }

//     const fetchDeliveryChallans = async () => {
//       setLoading(true);
//       try {
//         const res = await api.get(`/company/${companyId}/get/delivery-challan/list/by`);
//         setChallans(res.data || []);
//       } catch (err) {
//         toast.error(err.response?.data?.message || "Failed to load delivery challans");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDeliveryChallans();
//   }, [token, companyId, navigate]);

//   const deleteChallan = async (challanId) => {
//     if (!window.confirm("Are you sure you want to delete this delivery challan? This action cannot be undone.")) {
//       return;
//     }

//     try {
//       setLoading(true);
//       await api.delete(`/delivery-challan/${challanId}`);
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
import api from "../../../utils/axiosInstance";
import { toast } from "react-toastify";
import styles from "../Styles/ScreenUI.module.css";
import {
  Plus,
  Eye,
  Edit2,
  Printer,
  Trash2,
  X,
  Package,
  AlertCircle,
  CheckCircle,
  ChevronDown,
  Search,
  Loader,
} from "lucide-react";

// Helper: Convert Delivery Challan → Sale Invoice Payload
const mapDeliveryChallanToSalePayload = (challan) => {
  // Map items - try to get real itemId (critical!)
  const saleItems = (challan.deliveryChallanItemResponses || []).map((item) => {
    // Adjust field name based on your actual API response
    const itemId = item.itemId || item.id || item.productId || item.stockItemId || null;

    return {
      itemId: itemId ? Number(itemId) : null,  // ← Most important field!
      itemDescription: item.description || "",
      quantity: Number(item.quantity) || 1,
      pricePerUnit: Number(item.ratePerUnit || item.rate || item.price || 0),
      pricePerUnitTaxType: item.taxType || item.pricePerUnitTaxType || "WITHTAX",
      taxRate: item.taxRate || "NONE",
      taxAmount: Number(item.totalTaxAmount || 0),
      totalAmount: Number(item.totalAmount || 0),
    };
  });

  return {
    partyId: challan.partyResponseDto?.partyId
      ? Number(challan.partyResponseDto.partyId)
      : null,

    billingAddress: challan.partyResponseDto?.billingAddress || "",
    shippingAddress: challan.partyResponseDto?.shipingAddress
      || challan.partyResponseDto?.shippingAddress
      || "",

    invoiceNumber: `${challan.challanNo || "DC"}-INV`,

    invoceDate: challan.challanDate
      ? new Date(challan.challanDate).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],

    dueDate: challan.dueDate
      ? new Date(challan.dueDate).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],

    saleType: "CASH",
    stateOfSupply: challan.stateOfSupply || "MAHARASHTRA",
    paymentType: "CASH",
    paymentDescription: challan.description || "",

    totalAmountWithoutTax: Number(challan.totalAmountWithoutTax || (challan.totalAmount || 0) - (challan.totalTaxAmount || 0)),
    totalTaxAmount: Number(challan.totalTaxAmount || 0),
    deliveryCharges: Number(challan.deliveryCharges || 0),
    totalAmount: Number(challan.totalAmount || 0),
    receivedAmount: 0,                  // New sale → no advance yet
    balance: Number(challan.totalAmount || 0),

    saleItems,

    overdue: false,
    paid: false,
  };
};

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
  const [converting, setConverting] = useState(false);

  useEffect(() => {
    const handleStorageChange = () => {
      setUserData(JSON.parse(localStorage.getItem("eBilling") || "{}"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

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
    if (!window.confirm("Are you sure you want to delete this delivery challan?")) return;

    try {
      setLoading(true);
      await api.delete(`/delivery-challan/${challanId}`);
      setChallans(prev => prev.filter(c => c.deliveryChallanId !== challanId));
      setSelectedChallan(null);
      toast.success("Delivery challan deleted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (challanId) => {
    navigate(`/create_delivery?edit=${challanId}`);
    setSelectedChallan(null);
  };

  const handleConvertToSale = async (challanId) => {
    if (converting) return;

    if (!window.confirm("Convert this delivery challan to a sale invoice? This action cannot be undone.")) {
      return;
    }

    setConverting(true);

    try {
      const res = await api.get(`/delivery-challan/${challanId}`);
      const challan = res.data;

      console.log("[DC → SALE DEBUG] Full Delivery Challan:", challan);
      console.log("[DC → SALE DEBUG] Party ID:", challan.partyResponseDto?.partyId);

      const payload = mapDeliveryChallanToSalePayload(challan);

      console.log("[DC → SALE DEBUG] Generated Payload:", payload);
      console.log("[DC → SALE DEBUG] Sale Items:", payload.saleItems);

      // Validation
      if (!payload.partyId) {
        throw new Error("Cannot convert: Party ID is missing");
      }

      const missingIds = payload.saleItems.filter(item => !item.itemId);
      if (missingIds.length > 0) {
        console.warn("[WARNING] Items missing itemId:", missingIds);
        toast.warn(`${missingIds.length} item(s) missing product ID`);
      }

      await api.post(`/delivery-challan/${challanId}/convert/to/sale`, payload);

      toast.success("Delivery Challan converted to Sale Invoice successfully!");

      // Refresh list
      const refreshed = await api.get(`/company/${companyId}/get/delivery-challan/list/by`);
      setChallans(refreshed.data || []);
      setSelectedChallan(null);
    } catch (err) {
      console.error("[ERROR] Conversion failed:", err);
      const msg = err.response?.data?.message
        || err.message
        || "Failed to convert delivery challan to sale";
      toast.error(msg);
    } finally {
      setConverting(false);
    }
  };

  const filteredChallans = challans.filter((c) => {
    return (
      c.challanNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.partyResponseDto?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handlePrint = (challan) => {
    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      toast.error("Please allow popups for printing");
      return;
    }

    // Safe date formatting
    const formatDate = (dateStr) => dateStr
      ? new Date(dateStr).toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric'
      })
      : "—";

    // HTML escape helper
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
        <title>Delivery Challan ${escapeHtml(challan.challanNo || '—')}</title>
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
            <h1>DELIVERY CHALLAN</h1>
            <p>
              <strong>Challan No:</strong> ${escapeHtml(challan.challanNo || '—')} 
              | <strong>Challan Date:</strong> ${formatDate(challan.challanDate)}
              | <strong>Due Date:</strong> ${formatDate(challan.dueDate)}
            </p>
            <p><strong>Status:</strong> ${challan.challanType || 'OPEN'}</p>
          </div>
  
          <div class="info-section">
            <div class="info-box">
              <h3>From (Company):</h3>
              <p><strong>${escapeHtml(userData?.selectedCompany?.name || 'Your Company')}</strong></p>
              <p>${escapeHtml(userData?.selectedCompany?.billingAddress || '—')}</p>
              <p><strong>GSTIN:</strong> ${escapeHtml(userData?.selectedCompany?.gstin || '—')}</p>
            </div>
            <div class="info-box">
              <h3>Deliver To:</h3>
              <p><strong>${escapeHtml(challan.partyResponseDto?.name || '—')}</strong></p>
              <p>${escapeHtml(challan.partyResponseDto?.billingAddress || '—')}</p>
              <p><strong>GSTIN:</strong> ${escapeHtml(challan.partyResponseDto?.gstin || '—')}</p>
              <p><strong>Phone:</strong> ${escapeHtml(challan.partyResponseDto?.phoneNo || '—')}</p>
            </div>
          </div>
  
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Item Description</th>
                <th>Qty</th>
                <th>Unit</th>
                <th>Rate (₹)</th>
                <th>Discount (₹)</th>
                <th>Tax (%)</th>
                <th>Tax Amt (₹)</th>
                <th>Total (₹)</th>
              </tr>
            </thead>
            <tbody>
              ${(challan.deliveryChallanItemResponses || []).map((item, i) => `
                <tr>
                  <td>${i + 1}</td>
                  <td>${escapeHtml(item.name || item.itemName || '—')}<br>
                      <small>${escapeHtml(item.description || '')}</small></td>
                  <td class="text-right">${item.quantity || '—'}</td>
                  <td>${escapeHtml(item.unit || 'PCS')}</td>
                  <td class="text-right">${Number(item.ratePerUnit || item.rate || 0).toFixed(2)}</td>
                  <td class="text-right">${Number(item.discountAmount || 0).toFixed(2)}</td>
                  <td class="text-right">${item.taxRate || '—'}</td>
                  <td class="text-right">${Number(item.totalTaxAmount || 0).toFixed(2)}</td>
                  <td class="text-right">${Number(item.totalAmount || 0).toFixed(2)}</td>
                </tr>
              `).join('') || '<tr><td colspan="9" class="text-center">No items</td></tr>'}
            </tbody>
          </table>
  
          <div class="total-section">
            <div class="total-box">
              <div class="total-row">
                <span>Subtotal (ex-tax):</span>
                <span>₹${Number(challan.totalAmountWithoutTax || (challan.totalAmount || 0) - (challan.totalTaxAmount || 0)).toFixed(2)}</span>
              </div>
              <div class="total-row">
                <span>Total Tax:</span>
                <span>₹${Number(challan.totalTaxAmount || 0).toFixed(2)}</span>
              </div>
              <div class="total-row">
                <span>Total Discount:</span>
                <span>₹${Number(challan.totalDiscountAmount || 0).toFixed(2)}</span>
              </div>
              <div class="total-row">
                <span>Grand Total Value:</span>
                <span>₹${Number(challan.totalAmount || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>
  
          <div class="footer">
            <p>Goods sent on Delivery Challan basis - No tax invoice issued</p>
            <p>This is a computer-generated document. Thank you for your business.</p>
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
                      ₹{Number(c.totalAmount || 0).toFixed(2)}
                    </td>
                    <td className={styles["received-cell"]}>
                      ₹{Number(c.totalDiscountAmount || 0).toFixed(2)}
                    </td>
                    <td className={styles["balance-cell"]}>
                      ₹{Number(c.totalTaxAmount || 0).toFixed(2)}
                    </td>
                    <td>
                      <span
                        className={`${styles["status-badge"]} ${c.challanType === "OPEN" ? styles["status-open"] : styles["status-closed"]
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
                      className={`${styles["status-badge"]} ${c.challanType === "OPEN" ? styles["status-open"] : styles["status-closed"]
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
                      ₹{Number(c.totalAmount || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className={styles["card-info-row"]}>
                    <span className={styles["info-label"]}>Tax:</span>
                    <span className={styles["info-value"]}>
                      ₹{Number(c.totalTaxAmount || 0).toFixed(2)}
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
                <div
                  className={`${styles["balance-badge"]} ${selectedChallan.challanType === "CLOSE" ? styles.paid : ""
                    }`}
                >
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
                {selectedChallan.challanType !== "CLOSE" && (
                  <>
                    <button
                      onClick={() => handleEdit(selectedChallan.deliveryChallanId)}
                      className={`${styles["action-button"]} ${styles["edit-button"]}`}
                      title="Edit challan"
                    >
                      <Edit2 size={16} />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => handleConvertToSale(selectedChallan.deliveryChallanId)}
                      className={`${styles["action-button"]} ${styles["convert-button"]}`}
                      title="Convert to Sale Invoice"
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
                  onClick={() => handlePrint(selectedChallan)}
                  className={`${styles["action-button"]} ${styles["print-button"]}`}
                  title="Print Delivery Challan"
                >
                  <Printer size={16} />
                  <span>Print</span>
                </button>
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
                    ₹{Number(selectedChallan.totalAmount || 0).toFixed(2)}
                  </span>
                </div>
                <div className={styles["breakdown-row"]}>
                  <span>Total Discount:</span>
                  <span>₹{Number(selectedChallan.totalDiscountAmount || 0).toFixed(2)}</span>
                </div>
                <div className={styles["breakdown-row"]}>
                  <span>Total Tax:</span>
                  <span>₹{Number(selectedChallan.totalTaxAmount || 0).toFixed(2)}</span>
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
                          <td>₹{Number(item.ratePerUnit || item.rate || 0).toFixed(2)}</td>
                          <td>₹{Number(item.discountAmount || 0).toFixed(2)}</td>
                          <td>{item.taxType}</td>
                          <td>{item.taxRate}</td>
                          <td>₹{Number(item.totalTaxAmount || 0).toFixed(2)}</td>
                          <td>₹{Number(item.totalAmount || 0).toFixed(2)}</td>
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