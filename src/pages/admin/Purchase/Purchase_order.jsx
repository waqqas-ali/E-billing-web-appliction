// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import config from "../../../config/apiconfig";
// import styles from "./Purchases.module.css";
// import { toast } from "react-toastify";

// const PurchaseOrderList = () => {
//   const navigate = useNavigate();
//   const userData = JSON.parse(localStorage.getItem("eBilling")) || {};
//   const token = userData?.accessToken || "";
//   const companyId = userData?.selectedCompany?.id || "";

//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedOrder, setSelectedOrder] = useState(null);

//   const fetchPurchaseOrders = async () => {
//     if (!token || !companyId) return;
//     setLoading(true);
//     try {
//       const res = await axios.get(
//         `${config.BASE_URL}/company/${companyId}/purchase-order/list/according`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       setOrders(res.data || []);
//     } catch (err) {
//       toast.error("Failed to load purchase orders");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPurchaseOrders();
//   }, [token, companyId]);

//   const deleteOrder = async (orderId) => {
//     if (!window.confirm("Are you sure you want to delete this purchase order?")) return;

//     try {
//       await axios.delete(`${config.BASE_URL}/purchase-order/${orderId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setOrders((prev) => prev.filter((o) => o.purchaseOrderId !== orderId));
//       toast.success("Purchase order deleted successfully");
//       setSelectedOrder(null);
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to delete order");
//     }
//   };

//   const handleEdit = (orderId) => {
//     navigate(`/create_purchase_order?edit=${orderId}`);
//     setSelectedOrder(null);
//   };

//   return (
//     <div className={styles["company-form-container"]}>
//       {/* Header */}
//       <div className={styles["form-header"]}>
//         <div>
//           <h1 className={styles["company-form-title"]}>Purchase Orders</h1>
//           <p className={styles["form-subtitle"]}>Manage all your purchase orders</p>
//         </div>
//         <button
//           onClick={() => navigate("/create_purchase_order")}
//           className={styles["submit-button"]}
//           disabled={loading}
//         >
//           Create Purchase Order
//         </button>
//       </div>

//       {/* Loading */}
//       {loading && (
//         <div className={styles["loading-message"]}>
//           <div className={styles.spinner}></div>
//           <p>Loading purchase orders...</p>
//         </div>
//       )}

//       {/* Table */}
//       {orders.length > 0 ? (
//         <div className={styles["table-wrapper"]}>
//           <table className={styles.table}>
//             <thead>
//               <tr>
//                 <th>Order No</th>
//                 <th>Purchase Date</th>
//                 <th>Due Date</th>
//                 <th>Party Name</th>
//                 <th>Total Qty</th>
//                 <th>Total Amount</th>
//                 <th>Advance</th>
//                 <th>Balance</th>
//                 <th>Order Type</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {orders.map((o) => (
//                 <tr key={o.purchaseOrderId}>
//                   <td>{o.orderNo}</td>
//                   <td>{new Date(o.purchaseDate).toLocaleDateString()}</td>
//                   <td>{new Date(o.dueDate).toLocaleDateString()}</td>
//                   <td>{o.partyResponseDto?.name || "—"}</td>
//                   <td>{o.totalQuantity}</td>
//                   <td>₹{parseFloat(o.totalAmount).toFixed(2)}</td>
//                   <td>₹{parseFloat(o.advanceAmount).toFixed(2)}</td>
//                   <td
//                     style={{
//                       color: o.balanceAmount > 0 ? "#e74c3c" : "#27ae60",
//                       fontWeight: "500",
//                     }}
//                   >
//                     ₹{parseFloat(o.balanceAmount).toFixed(2)}
//                   </td>
//                   <td>
//                     <span
//                       className={`${styles["status-badge"]} ${
//                         o.orderType === "CLOSE" ? styles.closed : styles.open
//                       }`}
//                     >
//                       {o.orderType}
//                     </span>
//                   </td>
//                   <td className={styles["actions-cell"]}>
//                     <button
//                       onClick={() => setSelectedOrder(o)}
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
//           <p>No purchase orders found</p>
//           <p className={styles["no-data-subtitle"]}>
//             Click "Create Purchase Order" to add your first order.
//           </p>
//         </div>
//       )}

//       {/* VIEW MODAL */}
//       {selectedOrder && (
//         <div className={styles["modal-overlay"]} onClick={() => setSelectedOrder(null)}>
//           <div className={styles["detail-card"]} onClick={(e) => e.stopPropagation()}>
//             <div className={styles["card-header"]}>
//               <div>
//                 <h3>Purchase Order #{selectedOrder.purchaseOrderId}</h3>
//                 <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
//                   <div
//                     className={`${styles["balance-badge"]} ${
//                       selectedOrder.balanceAmount <= 0 ? styles.paid : ""
//                     }`}
//                   >
//                     {selectedOrder.balanceAmount > 0 ? "Warning" : "Check"} Balance: ₹
//                     {parseFloat(selectedOrder.balanceAmount).toFixed(2)}
//                   </div>
//                   <div
//                     className={`${styles["status-badge"]} ${
//                       selectedOrder.orderType === "CLOSE" ? styles.closed : styles.open
//                     }`}
//                     style={{ fontSize: "0.8rem", padding: "4px 8px" }}
//                   >
//                     {selectedOrder.orderType}
//                   </div>
//                 </div>
//               </div>
//               <div>
//                 {/* EDIT BUTTON: Hidden if orderType === "CLOSE" */}
//                 {selectedOrder.orderType !== "CLOSE" && (
//                   <button
//                     onClick={() => handleEdit(selectedOrder.purchaseOrderId)}
//                     className={`${styles["action-button"]} ${styles["edit-button"]}`}
//                     title="Edit order"
//                   >
//                     Edit
//                   </button>
//                 )}

//                 <button
//                   onClick={() => deleteOrder(selectedOrder.purchaseOrderId)}
//                   className={`${styles["action-button"]} ${styles["delete-button"]}`}
//                   title="Delete order"
//                 >
//                   Delete
//                 </button>

//                 <button
//                   className={styles["close-modal-btn"]}
//                   onClick={() => setSelectedOrder(null)}
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>

//             {/* Order Details */}
//             <section className={styles["card-section"]}>
//               <h4>Order Details</h4>
//               <div className={styles["detail-grid"]}>
//                 <p><strong>Order No:</strong> {selectedOrder.orderNo}</p>
//                 <p><strong>Purchase Date:</strong> {new Date(selectedOrder.purchaseDate).toLocaleDateString()}</p>
//                 <p><strong>Due Date:</strong> {new Date(selectedOrder.dueDate).toLocaleDateString()}</p>
//                 <p><strong>Order Type:</strong>
//                   <span
//                     className={`${styles["status-badge"]} ${
//                       selectedOrder.orderType === "CLOSE" ? styles.closed : styles.open
//                     }`}
//                   >
//                     {selectedOrder.orderType}
//                   </span>
//                 </p>
//                 <p><strong>State of Supply:</strong> {selectedOrder.stateOfSupply?.replace(/_/g, " ")}</p>
//                 <p><strong>Payment Type:</strong> {selectedOrder.paymentType}</p>
//                 <p><strong>Description:</strong> {selectedOrder.description || "—"}</p>
//                 <p><strong>Total Quantity:</strong> {selectedOrder.totalQuantity}</p>
//                 <p><strong>Total Discount:</strong> ₹{selectedOrder.totalDiscount}</p>
//                 <p><strong>Tax Amount:</strong> ₹{selectedOrder.totalTaxAmount}</p>
//                 <p><strong>Total Amount:</strong> ₹{selectedOrder.totalAmount}</p>
//                 <p><strong>Advance Paid:</strong> ₹{selectedOrder.advanceAmount}</p>
//                 <p><strong>Balance:</strong>
//                   <strong style={{ color: selectedOrder.balanceAmount > 0 ? "#e74c3c" : "#27ae60" }}>
//                     ₹{parseFloat(selectedOrder.balanceAmount).toFixed(2)}
//                   </strong>
//                 </p>
//               </div>
//             </section>

//             {/* Party */}
//             {selectedOrder.partyResponseDto && (
//               <section className={styles["card-section"]}>
//                 <h4>Party Details</h4>
//                 <div className={styles["detail-grid"]}>
//                   <p><strong>Name:</strong> {selectedOrder.partyResponseDto.name}</p>
//                   <p><strong>Party ID:</strong> {selectedOrder.partyResponseDto.partyId}</p>
//                   <p><strong>GSTIN:</strong> {selectedOrder.partyResponseDto.gstin || "—"}</p>
//                   <p><strong>GST Type:</strong> {selectedOrder.partyResponseDto.gstType?.replace(/_/g, " ")}</p>
//                   <p><strong>Phone:</strong> {selectedOrder.partyResponseDto.phoneNo || "—"}</p>
//                   <p><strong>Email:</strong> {selectedOrder.partyResponseDto.emailId || "—"}</p>
//                   <p><strong>State:</strong> {selectedOrder.partyResponseDto.state?.replace(/_/g, " ")}</p>
//                   <p><strong>Billing Address:</strong> {selectedOrder.partyResponseDto.billingAddress || "—"}</p>
//                   <p><strong>Shipping Address:</strong> {selectedOrder.partyResponseDto.shipingAddress || "—"}</p>
//                 </div>
//               </section>
//             )}

//             {/* Items */}
//             <section className={styles["card-section"]}>
//               <h4>Items</h4>
//               {selectedOrder.purchaseOrderItemResponseList?.length > 0 ? (
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
//                     {selectedOrder.purchaseOrderItemResponseList.map((it, i) => (
//                       <tr key={i}>
//                         <td>{it.itemName}</td>
//                         <td>{it.quantity}</td>
//                         <td>{it.unit}</td>
//                         <td>₹{it.perUnitRate}</td>
//                         <td>₹{it.discountAmount}</td>
//                         <td>{it.taxType}</td>
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
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PurchaseOrderList;







// "use client";

// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import config from "../../../config/apiconfig";
// import styles from "../Styles/ScreenUI.module.css"; // Using same styles as SalesHistory
// import { toast } from "react-toastify";
// import {
//     Plus,
//     Eye,
//     Edit2,
//     Trash2,
//     X,
//     Package,
//     AlertCircle,
//     CheckCircle,
//     ChevronDown,
//     Search,
//     Loader,
// } from "lucide-react";

// const PurchaseOrderList = () => {
//     const navigate = useNavigate();
//     const userData = JSON.parse(localStorage.getItem("eBilling")) || {};
//     const token = userData?.accessToken || "";
//     const companyId = userData?.selectedCompany?.id || "";

//     const [orders, setOrders] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [selectedOrder, setSelectedOrder] = useState(null);
//     const [searchTerm, setSearchTerm] = useState("");

//     const fetchPurchaseOrders = async () => {
//         if (!token || !companyId) {
//             toast.error("Session expired or no company selected.");
//             return;
//         }

//         setLoading(true);
//         try {
//             const res = await axios.get(
//                 `${config.BASE_URL}/company/${companyId}/purchase-order/list/according`,
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                         "Content-Type": "application/json",
//                     },
//                 }
//             );
//             setOrders(res.data || []);
//         } catch (err) {
//             toast.error(err.response?.data?.message || "Failed to load purchase orders");
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchPurchaseOrders();
//     }, [token, companyId]);

//     const deleteOrder = async (orderId) => {
//         if (!window.confirm("Are you sure you want to delete this purchase order? This action cannot be undone.")) {
//             return;
//         }

//         try {
//             setLoading(true);
//             await axios.delete(`${config.BASE_URL}/purchase-order/${orderId}`, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });

//             setOrders((prev) => prev.filter((o) => o.purchaseOrderId !== orderId));
//             setSelectedOrder(null);
//             toast.success("Purchase order deleted successfully");
//         } catch (err) {
//             toast.error(err.response?.data?.message || "Failed to delete order");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleEdit = (orderId) => {
//         navigate(`/create_purchase_order?edit=${orderId}`);
//         setSelectedOrder(null);
//     };
//     const handleConvert = (orderId) => {

//     };

//     const filteredOrders = orders.filter((o) => {
//         const matchesSearch =
//             o.orderNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             o.partyResponseDto?.name?.toLowerCase().includes(searchTerm.toLowerCase());
//         return matchesSearch;
//     });

//     return (
//         <div className={styles["company-form-container"]}>
//             {/* HEADER */}
//             <div className={styles["form-header"]}>
//                 <div className={styles["header-content"]}>
//                     <div className={styles["header-icon"]}>
//                         <Package size={32} style={{ color: "var(--primary-color)" }} />
//                     </div>
//                     <div className={styles["header-text"]}>
//                         <h1 className={styles["company-form-title"]}>Purchase Orders</h1>
//                         <p className={styles["form-subtitle"]}>Manage all your purchase orders</p>
//                     </div>
//                 </div>
//                 <button
//                     onClick={() => navigate("/create_purchase_order")}
//                     className={styles["submit-button"]}
//                     disabled={loading}
//                 >
//                     <Plus size={18} />
//                     <span>New Order</span>
//                 </button>
//             </div>

//             {/* SEARCH BAR */}
//             <div className={styles["search-container"]}>
//                 <Search size={18} className={styles["search-icon"]} />
//                 <input
//                     type="text"
//                     placeholder="Search by order # or party name..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className={styles["search-input"]}
//                 />
//             </div>

//             {/* LOADING */}
//             {loading && (
//                 <div className={styles["loading-message"]}>
//                     <Loader size={32} className={styles["spinner"]} />
//                     <p>Loading orders...</p>
//                 </div>
//             )}

//             {/* TABLE / CARDS */}
//             {filteredOrders.length > 0 ? (
//                 <>
//                     {/* Desktop Table */}
//                     <div className={styles["table-wrapper"]}>
//                         <table className={styles.table}>
//                             <thead>
//                                 <tr>
//                                     <th>Order #</th>
//                                     <th>Purchase Date</th>
//                                     <th>Due Date</th>
//                                     <th>Party</th>
//                                     <th>Total Qty</th>
//                                     <th>Total</th>
//                                     <th>Advance</th>
//                                     <th>Balance</th>
//                                     <th>Status</th>
//                                     <th>Action</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {filteredOrders.map((order) => (
//                                     <tr key={order.purchaseOrderId} className={styles["table-row"]}>
//                                         <td className={styles["invoice-cell"]}>
//                                             <span className={styles["invoice-badge"]}>{order.orderNo}</span>
//                                         </td>
//                                         <td>{new Date(order.purchaseDate).toLocaleDateString()}</td>
//                                         <td>{new Date(order.dueDate).toLocaleDateString()}</td>
//                                         <td>
//                                             <span className={styles["party-name"]}>{order.partyResponseDto?.name || "—"}</span>
//                                         </td>
//                                         <td>{order.totalQuantity}</td>
//                                         <td className={styles["amount-cell"]}>
//                                             <span className={styles["amount"]}>
//                                                 ₹{Number.parseFloat(order.totalAmount || 0).toFixed(2)}
//                                             </span>
//                                         </td>
//                                         <td className={styles["received-cell"]}>
//                                             ₹{Number.parseFloat(order.advanceAmount || 0).toFixed(2)}
//                                         </td>
//                                         <td className={styles["balance-cell"]}>
//                                             <span
//                                                 className={
//                                                     order.balanceAmount > 0 ? styles["balance-pending"] : styles["balance-paid"]
//                                                 }
//                                             >
//                                                 ₹{Number.parseFloat(order.balanceAmount || 0).toFixed(2)}
//                                             </span>
//                                         </td>
//                                         <td>
//                                             <span
//                                                 className={`${styles["status-badge"]} ${order.orderType === "OPEN" ? styles["status-open"] : styles["status-closed"]
//                                                     }`}
//                                             >
//                                                 {order.orderType}
//                                             </span>
//                                         </td>
//                                         <td className={styles["actions-cell"]}>
//                                             <button
//                                                 onClick={() => setSelectedOrder(order)}
//                                                 className={`${styles["action-button"]} ${styles["view-button"]}`}
//                                                 title="View details"
//                                             >
//                                                 <Eye size={16} />
//                                                 <span>View</span>
//                                             </button>
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>

//                     {/* Mobile Cards */}
//                     <div className={styles["mobile-cards-container"]}>
//                         {filteredOrders.map((order) => (
//                             <div key={order.purchaseOrderId} className={styles["invoice-card"]}>
//                                 <div className={styles["card-header-mobile"]}>
//                                     <div className={styles["card-title-section"]}>
//                                         <h3 className={styles["card-invoice-number"]}>{order.orderNo}</h3>
//                                         <span
//                                             className={`${styles["status-badge"]} ${order.orderType === "OPEN" ? styles["status-open"] : styles["status-closed"]
//                                                 }`}
//                                         >
//                                             {order.orderType}
//                                         </span>
//                                     </div>
//                                     <button onClick={() => setSelectedOrder(order)} className={styles["card-action-button"]}>
//                                         <ChevronDown size={20} />
//                                     </button>
//                                 </div>

//                                 <div className={styles["card-body"]}>
//                                     <div className={styles["card-info-row"]}>
//                                         <span className={styles["info-label"]}>Party:</span>
//                                         <span className={styles["info-value"]}>{order.partyResponseDto?.name || "—"}</span>
//                                     </div>
//                                     <div className={styles["card-info-row"]}>
//                                         <span className={styles["info-label"]}>Date:</span>
//                                         <span className={styles["info-value"]}>
//                                             {new Date(order.purchaseDate).toLocaleDateString()}
//                                         </span>
//                                     </div>
//                                     <div className={styles["card-info-row"]}>
//                                         <span className={styles["info-label"]}>Total:</span>
//                                         <span className={styles["info-value-amount"]}>
//                                             ₹{Number.parseFloat(order.totalAmount || 0).toFixed(2)}
//                                         </span>
//                                     </div>
//                                     <div className={styles["card-info-row"]}>
//                                         <span className={styles["info-label"]}>Balance:</span>
//                                         <span
//                                             className={
//                                                 order.balanceAmount > 0 ? styles["info-value-pending"] : styles["info-value-paid"]
//                                             }
//                                         >
//                                             ₹{Number.parseFloat(order.balanceAmount || 0).toFixed(2)}
//                                         </span>
//                                     </div>
//                                 </div>

//                                 <div className={styles["card-footer"]}>
//                                     <button onClick={() => setSelectedOrder(order)} className={styles["card-view-button"]}>
//                                         <Eye size={16} />
//                                         View Details
//                                     </button>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </>
//             ) : (
//                 !loading && (
//                     <div className={styles["no-data"]}>
//                         <Package size={48} />
//                         <p>No purchase orders found</p>
//                         <p className={styles["no-data-subtitle"]}>
//                             {searchTerm
//                                 ? "Try adjusting your search"
//                                 : 'Click "New Order" to create your first purchase order.'}
//                         </p>
//                     </div>
//                 )
//             )}

//             {/* VIEW MODAL */}
//             {selectedOrder && (
//                 <div className={styles["modal-overlay"]} onClick={() => setSelectedOrder(null)}>
//                     <div className={styles["detail-card"]} onClick={(e) => e.stopPropagation()}>
//                         <div className={styles["card-header"]}>
//                             <div className={styles["header-title-section"]}>
//                                 <h3>Purchase Order #{selectedOrder.orderNo}</h3>
//                                 <div className={`${styles["balance-badge"]} ${selectedOrder.balanceAmount <= 0 ? styles.paid : ""}`}>
//                                     {selectedOrder.balanceAmount > 0 ? (
//                                         <>
//                                             <AlertCircle size={16} />
//                                             Balance: ₹{Number.parseFloat(selectedOrder.balanceAmount || 0).toFixed(2)}
//                                         </>
//                                     ) : (
//                                         <>
//                                             <CheckCircle size={16} />
//                                             Paid
//                                         </>
//                                     )}
//                                 </div>
//                             </div>
//                             <div className={styles["header-actions"]}>
//                                 {/* EDIT & CONVERT: Only if not CLOSED */}
//                                 {selectedOrder.orderType !== "CLOSE" && (
//                                     <>
//                                         <button
//                                             onClick={() => handleEdit(selectedOrder.purchaseOrderId)}
//                                             className={`${styles["action-button"]} ${styles["edit-button"]}`}
//                                             title="Edit order"
//                                         >
//                                             <Edit2 size={16} />
//                                             <span>Edit</span>
//                                         </button>

//                                         <button
//                                             onClick={() => handleConvert(selectedOrder.purchaseOrderId)}
//                                             className={`${styles["action-button"]} ${styles["edit-button"]}`}
//                                             title="Convert to Purchase"
//                                         >
//                                             <Edit2 size={16} />
//                                             <span>Convert to Purchase</span>
//                                         </button>
//                                     </>
//                                 )}

//                                 <button
//                                     onClick={() => deleteOrder(selectedOrder.purchaseOrderId)}
//                                     className={`${styles["action-button"]} ${styles["delete-button"]}`}
//                                     title="Delete order"
//                                 >
//                                     <Trash2 size={16} />
//                                     <span>Delete</span>
//                                 </button>
//                                 <button
//                                     className={styles["close-modal-btn"]}
//                                     onClick={() => setSelectedOrder(null)}
//                                     title="Close"
//                                 >
//                                     <X size={20} />
//                                 </button>
//                             </div>
//                         </div>

//                         {/* Order Summary */}
//                         <section className={styles["card-section"]}>
//                             <h4 className={styles["section-title"]}>Order Summary</h4>
//                             <div className={styles["detail-grid"]}>
//                                 <div className={styles["detail-item"]}>
//                                     <span className={styles["detail-label"]}>Order ID:</span>
//                                     <span className={styles["detail-value"]}>{selectedOrder.purchaseOrderId}</span>
//                                 </div>
//                                 <div className={styles["detail-item"]}>
//                                     <span className={styles["detail-label"]}>Purchase Date:</span>
//                                     <span className={styles["detail-value"]}>
//                                         {new Date(selectedOrder.purchaseDate).toLocaleDateString()}
//                                     </span>
//                                 </div>
//                                 <div className={styles["detail-item"]}>
//                                     <span className={styles["detail-label"]}>Due Date:</span>
//                                     <span className={styles["detail-value"]}>
//                                         {new Date(selectedOrder.dueDate).toLocaleDateString()}
//                                     </span>
//                                 </div>
//                                 <div className={styles["detail-item"]}>
//                                     <span className={styles["detail-label"]}>Order Type:</span>
//                                     <span className={styles["detail-value"]}>{selectedOrder.orderType}</span>
//                                 </div>
//                                 <div className={styles["detail-item"]}>
//                                     <span className={styles["detail-label"]}>State of Supply:</span>
//                                     <span className={styles["detail-value"]}>
//                                         {selectedOrder.stateOfSupply?.replace(/_/g, " ")}
//                                     </span>
//                                 </div>
//                                 <div className={styles["detail-item"]}>
//                                     <span className={styles["detail-label"]}>Payment Type:</span>
//                                     <span className={styles["detail-value"]}>{selectedOrder.paymentType}</span>
//                                 </div>
//                                 <div className={styles["detail-item"]}>
//                                     <span className={styles["detail-label"]}>Description:</span>
//                                     <span className={styles["detail-value"]}>{selectedOrder.description || "—"}</span>
//                                 </div>
//                                 <div className={styles["detail-item"]}>
//                                     <span className={styles["detail-label"]}>Total Quantity:</span>
//                                     <span className={styles["detail-value"]}>{selectedOrder.totalQuantity}</span>
//                                 </div>
//                             </div>

//                             <div className={styles["amount-breakdown"]}>
//                                 <div className={styles["breakdown-row"]}>
//                                     <span>Total (ex-tax):</span>
//                                     <span>₹{Number.parseFloat(selectedOrder.totalAmountWithoutTax || 0).toFixed(2)}</span>
//                                 </div>
//                                 <div className={styles["breakdown-row"]}>
//                                     <span>Tax Amount:</span>
//                                     <span>₹{Number.parseFloat(selectedOrder.totalTaxAmount || 0).toFixed(2)}</span>
//                                 </div>
//                                 <div className={styles["breakdown-row"]}>
//                                     <span>Total Discount:</span>
//                                     <span>₹{Number.parseFloat(selectedOrder.totalDiscount || 0).toFixed(2)}</span>
//                                 </div>
//                                 <div className={styles["breakdown-row"]}>
//                                     <span>Total Amount:</span>
//                                     <span className={styles["total-amount"]}>
//                                         ₹{Number.parseFloat(selectedOrder.totalAmount || 0).toFixed(2)}
//                                     </span>
//                                 </div>
//                                 <div className={styles["breakdown-row"]}>
//                                     <span>Advance Paid:</span>
//                                     <span>₹{Number.parseFloat(selectedOrder.advanceAmount || 0).toFixed(2)}</span>
//                                 </div>
//                                 <div
//                                     className={`${styles["breakdown-row"]} ${selectedOrder.balanceAmount > 0 ? styles["balance-row-pending"] : styles["balance-row-paid"]
//                                         }`}
//                                 >
//                                     <span>Balance Due:</span>
//                                     <span className={styles["balance-amount"]}>
//                                         ₹{Number.parseFloat(selectedOrder.balanceAmount || 0).toFixed(2)}
//                                     </span>
//                                 </div>
//                             </div>
//                         </section>

//                         {/* Party Details */}
//                         {selectedOrder.partyResponseDto && (
//                             <section className={styles["card-section"]}>
//                                 <h4 className={styles["section-title"]}>Party Details</h4>
//                                 <div className={styles["detail-grid"]}>
//                                     <div className={styles["detail-item"]}>
//                                         <span className={styles["detail-label"]}>Name:</span>
//                                         <span className={styles["detail-value"]}>{selectedOrder.partyResponseDto.name}</span>
//                                     </div>
//                                     <div className={styles["detail-item"]}>
//                                         <span className={styles["detail-label"]}>Party ID:</span>
//                                         <span className={styles["detail-value"]}>{selectedOrder.partyResponseDto.partyId}</span>
//                                     </div>
//                                     <div className={styles["detail-item"]}>
//                                         <span className={styles["detail-label"]}>GSTIN:</span>
//                                         <span className={styles["detail-value"]}>{selectedOrder.partyResponseDto.gstin || "—"}</span>
//                                     </div>
//                                     <div className={styles["detail-item"]}>
//                                         <span className={styles["detail-label"]}>GST Type:</span>
//                                         <span className={styles["detail-value"]}>
//                                             {selectedOrder.partyResponseDto.gstType?.replace(/_/g, " ")}
//                                         </span>
//                                     </div>
//                                     <div className={styles["detail-item"]}>
//                                         <span className={styles["detail-label"]}>Phone:</span>
//                                         <span className={styles["detail-value"]}>{selectedOrder.partyResponseDto.phoneNo || "—"}</span>
//                                     </div>
//                                     <div className={styles["detail-item"]}>
//                                         <span className={styles["detail-label"]}>Email:</span>
//                                         <span className={styles["detail-value"]}>{selectedOrder.partyResponseDto.emailId || "—"}</span>
//                                     </div>
//                                     <div className={styles["detail-item"]}>
//                                         <span className={styles["detail-label"]}>State:</span>
//                                         <span className={styles["detail-value"]}>
//                                             {selectedOrder.partyResponseDto.state?.replace(/_/g, " ")}
//                                         </span>
//                                     </div>
//                                     <div className={styles["detail-item"]}>
//                                         <span className={styles["detail-label"]}>Billing Address:</span>
//                                         <span className={styles["detail-value"]}>
//                                             {selectedOrder.partyResponseDto.billingAddress || "—"}
//                                         </span>
//                                     </div>
//                                     <div className={styles["detail-item"]}>
//                                         <span className={styles["detail-label"]}>Shipping Address:</span>
//                                         <span className={styles["detail-value"]}>
//                                             {selectedOrder.partyResponseDto.shipingAddress || "—"}
//                                         </span>
//                                     </div>
//                                 </div>
//                             </section>
//                         )}

//                         {/* Items */}
//                         <section className={styles["card-section"]}>
//                             <h4 className={styles["section-title"]}>Items</h4>
//                             {selectedOrder.purchaseOrderItemResponseList?.length > 0 ? (
//                                 <div className={styles["items-table-wrapper"]}>
//                                     <table className={styles["items-table"]}>
//                                         <thead>
//                                             <tr>
//                                                 <th>Name</th>
//                                                 <th>Qty</th>
//                                                 <th>Unit</th>
//                                                 <th>Rate</th>
//                                                 <th>Tax Type</th>
//                                                 <th>Tax Rate</th>
//                                                 <th>Discount</th>
//                                                 <th>Tax</th>
//                                                 <th>Total</th>
//                                             </tr>
//                                         </thead>
//                                         <tbody>
//                                             {selectedOrder.purchaseOrderItemResponseList.map((it, i) => (
//                                                 <tr key={i}>
//                                                     <td>{it.itemName}</td>
//                                                     <td>{it.quantity}</td>
//                                                     <td>{it.unit}</td>
//                                                     <td>₹{Number.parseFloat(it.perUnitRate || 0).toFixed(2)}</td>
//                                                     <td>{it.taxType}</td>
//                                                     <td>{it.taxRate}</td>
//                                                     <td>₹{Number.parseFloat(it.discountAmount || 0).toFixed(2)}</td>
//                                                     <td>₹{Number.parseFloat(it.totalTaxAmount || 0).toFixed(2)}</td>
//                                                     <td>₹{Number.parseFloat(it.totalAmount || 0).toFixed(2)}</td>
//                                                 </tr>
//                                             ))}
//                                         </tbody>
//                                     </table>
//                                 </div>
//                             ) : (
//                                 <p>No items</p>
//                             )}
//                         </section>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default PurchaseOrderList;







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

// Helper: Map PO to Purchase Conversion Payload
const mapPoToPurchasePayload = (po) => {
    const items = po.purchaseOrderItemResponseList?.map((it) => ({
        itemName: it.itemName,
        itemHsnCode: "", // Add HSN if available in your item master
        itemDescription: "",
        quantity: it.quantity,
        unit: it.unit,
        pricePerUnit: it.perUnitRate,
        pricePerUnitTaxType: it.taxType,
        taxRate: it.taxRate,
        totalTaxAmount: it.totalTaxAmount,
        totalAmount: it.totalAmount,
    })) ?? [];

    return {
        partyId: po.partyResponseDto?.partyId,
        billNumber: `${po.orderNo}-BILL`, // Auto-generated bill number
        billDate: po.purchaseDate,
        dueDate: po.dueDate,
        stateOfSupply: po.stateOfSupply,
        paymentType: po.paymentType,
        paymentDescription: po.description || "",
        totalTaxAmount: po.totalTaxAmount,
        totalAmountWithoutTax: po.totalAmount - po.totalTaxAmount,
        deliveryCharges: 0,
        totalAmount: po.totalAmount,
        sendAmount: po.advanceAmount,
        balance: po.balanceAmount,
        purchaseItemRequests: items,
        isPaid: po.balanceAmount <= 0,
        isOverdue: new Date(po.dueDate) < new Date(),
    };
};

const PurchaseOrderList = () => {
    const navigate = useNavigate();
    const userData = JSON.parse(localStorage.getItem("eBilling") || "{}");
    const token = userData?.accessToken || "";
    const companyId = userData?.selectedCompany?.id || "";

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [converting, setConverting] = useState(false);

    // Fetch all purchase orders
    const fetchPurchaseOrders = async () => {
        if (!token || !companyId) {
            toast.error("Session expired or no company selected.");
            return;
        }

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
            toast.error(err.response?.data?.message || "Failed to load purchase orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPurchaseOrders();
    }, [token, companyId]);

    // Delete order
    const deleteOrder = async (orderId) => {
        if (!window.confirm("Are you sure you want to delete this purchase order? This action cannot be undone.")) {
            return;
        }

        try {
            setLoading(true);
            await axios.delete(`${config.BASE_URL}/purchase-order/${orderId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setOrders((prev) => prev.filter((o) => o.purchaseOrderId !== orderId));
            setSelectedOrder(null);
            toast.success("Purchase order deleted successfully");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to delete order");
        } finally {
            setLoading(false);
        }
    };

    // Edit order
    const handleEdit = (orderId) => {
        navigate(`/create_purchase_order?edit=${orderId}`);
        setSelectedOrder(null);
    };

    // Convert to Purchase
    const handleConvert = async (orderId) => {
        if (converting) return;
        setConverting(true);

        try {
            // 1. Fetch full PO details
            const poRes = await axios.get(`${config.BASE_URL}/purchase-order/${orderId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const po = poRes.data;

            // 2. Map to purchase payload
            const payload = mapPoToPurchasePayload(po);

            // 3. Convert
            const convertRes = await axios.post(
                `${config.BASE_URL}/purchase-order/${orderId}/convert/to/purchase`,
                payload,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            toast.success("Purchase order converted to Purchase successfully!");

            // Optional: Navigate to new purchase if ID is returned
            if (convertRes.data?.purchaseId) {
                // navigate(`/new_purchase/${convertRes.data.purchaseId}`);
                setSelectedOrder(null);
            } else {
                fetchPurchaseOrders();
                setSelectedOrder(null);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to convert to purchase");
        } finally {
            setConverting(false);
        }
    };

    // Filter orders
    const filteredOrders = orders.filter((o) => {
        const matchesSearch =
            o.orderNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            o.partyResponseDto?.name?.toLowerCase().includes(searchTerm.toLowerCase());
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
                        <h1 className={styles["company-form-title"]}>Purchase Orders</h1>
                        <p className={styles["form-subtitle"]}>Manage all your purchase orders</p>
                    </div>
                </div>
                <button
                    onClick={() => navigate("/create_purchase_order")}
                    className={styles["submit-button"]}
                    disabled={loading}
                >
                    <Plus size={18} />
                    <span>New Order</span>
                </button>
            </div>

            {/* SEARCH BAR */}
            <div className={styles["search-container"]}>
                <Search size={18} className={styles["search-icon"]} />
                <input
                    type="text"
                    placeholder="Search by order # or party name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles["search-input"]}
                />
            </div>

            {/* LOADING */}
            {loading && !converting && (
                <div className={styles["loading-message"]}>
                    <Loader size={32} className={styles["spinner"]} />
                    <p>Loading orders...</p>
                </div>
            )}

            {/* TABLE / CARDS */}
            {filteredOrders.length > 0 ? (
                <>
                    {/* Desktop Table */}
                    <div className={styles["table-wrapper"]}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Order #</th>
                                    <th>Purchase Date</th>
                                    <th>Due Date</th>
                                    <th>Party</th>
                                    <th>Total Qty</th>
                                    <th>Total</th>
                                    <th>Advance</th>
                                    <th>Balance</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.map((order) => (
                                    <tr key={order.purchaseOrderId} className={styles["table-row"]}>
                                        <td className={styles["invoice-cell"]}>
                                            <span className={styles["invoice-badge"]}>{order.orderNo}</span>
                                        </td>
                                        <td>{new Date(order.purchaseDate).toLocaleDateString()}</td>
                                        <td>{new Date(order.dueDate).toLocaleDateString()}</td>
                                        <td>
                                            <span className={styles["party-name"]}>{order.partyResponseDto?.name || "—"}</span>
                                        </td>
                                        <td>{order.totalQuantity}</td>
                                        <td className={styles["amount-cell"]}>
                                            <span className={styles["amount"]}>
                                                ₹{Number.parseFloat(order.totalAmount || 0).toFixed(2)}
                                            </span>
                                        </td>
                                        <td className={styles["received-cell"]}>
                                            ₹{Number.parseFloat(order.advanceAmount || 0).toFixed(2)}
                                        </td>
                                        <td className={styles["balance-cell"]}>
                                            <span
                                                className={
                                                    order.balanceAmount > 0 ? styles["balance-pending"] : styles["balance-paid"]
                                                }
                                            >
                                                ₹{Number.parseFloat(order.balanceAmount || 0).toFixed(2)}
                                            </span>
                                        </td>
                                        <td>
                                            <span
                                                className={`${styles["status-badge"]} ${
                                                    order.orderType === "OPEN" ? styles["status-open"] : styles["status-closed"]
                                                }`}
                                            >
                                                {order.orderType}
                                            </span>
                                        </td>
                                        <td className={styles["actions-cell"]}>
                                            <button
                                                onClick={() => setSelectedOrder(order)}
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
                        {filteredOrders.map((order) => (
                            <div key={order.purchaseOrderId} className={styles["invoice-card"]}>
                                <div className={styles["card-header-mobile"]}>
                                    <div className={styles["card-title-section"]}>
                                        <h3 className={styles["card-invoice-number"]}>{order.orderNo}</h3>
                                        <span
                                            className={`${styles["status-badge"]} ${
                                                order.orderType === "OPEN" ? styles["status-open"] : styles["status-closed"]
                                            }`}
                                        >
                                            {order.orderType}
                                        </span>
                                    </div>
                                    <button onClick={() => setSelectedOrder(order)} className={styles["card-action-button"]}>
                                        <ChevronDown size={20} />
                                    </button>
                                </div>

                                <div className={styles["card-body"]}>
                                    <div className={styles["card-info-row"]}>
                                        <span className={styles["info-label"]}>Party:</span>
                                        <span className={styles["info-value"]}>{order.partyResponseDto?.name || "—"}</span>
                                    </div>
                                    <div className={styles["card-info-row"]}>
                                        <span className={styles["info-label"]}>Date:</span>
                                        <span className={styles["info-value"]}>
                                            {new Date(order.purchaseDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className={styles["card-info-row"]}>
                                        <span className={styles["info-label"]}>Total:</span>
                                        <span className={styles["info-value-amount"]}>
                                            ₹{Number.parseFloat(order.totalAmount || 0).toFixed(2)}
                                        </span>
                                    </div>
                                    <div className={styles["card-info-row"]}>
                                        <span className={styles["info-label"]}>Balance:</span>
                                        <span
                                            className={
                                                order.balanceAmount > 0 ? styles["info-value-pending"] : styles["info-value-paid"]
                                            }
                                        >
                                            ₹{Number.parseFloat(order.balanceAmount || 0).toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                <div className={styles["card-footer"]}>
                                    <button onClick={() => setSelectedOrder(order)} className={styles["card-view-button"]}>
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
                        <p>No purchase orders found</p>
                        <p className={styles["no-data-subtitle"]}>
                            {searchTerm
                                ? "Try adjusting your search"
                                : 'Click "New Order" to create your first purchase order.'}
                        </p>
                    </div>
                )
            )}

            {/* VIEW MODAL */}
            {selectedOrder && (
                <div className={styles["modal-overlay"]} onClick={() => setSelectedOrder(null)}>
                    <div className={styles["detail-card"]} onClick={(e) => e.stopPropagation()}>
                        <div className={styles["card-header"]}>
                            <div className={styles["header-title-section"]}>
                                <h3>Purchase Order #{selectedOrder.orderNo}</h3>
                                <div className={`${styles["balance-badge"]} ${selectedOrder.balanceAmount <= 0 ? styles.paid : ""}`}>
                                    {selectedOrder.balanceAmount > 0 ? (
                                        <>
                                            <AlertCircle size={16} />
                                            Balance: ₹{Number.parseFloat(selectedOrder.balanceAmount || 0).toFixed(2)}
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
                                {/* EDIT & CONVERT: Only if not CLOSED */}
                                {selectedOrder.orderType !== "CLOSE" && (
                                    <>
                                        <button
                                            onClick={() => handleEdit(selectedOrder.purchaseOrderId)}
                                            className={`${styles["action-button"]} ${styles["edit-button"]}`}
                                            title="Edit order"
                                        >
                                            <Edit2 size={16} />
                                            <span>Edit</span>
                                        </button>

                                        <button
                                            onClick={() => handleConvert(selectedOrder.purchaseOrderId)}
                                            className={`${styles["action-button"]} ${styles["edit-button"]}`}
                                            title="Convert to Purchase"
                                            disabled={converting}
                                        >
                                            {converting ? (
                                                <Loader size={16} className={styles.spinner} />
                                            ) : (
                                                <Edit2 size={16} />
                                            )}
                                            <span>{converting ? "Converting…" : "Convert to Purchase"}</span>
                                        </button>
                                    </>
                                )}

                                <button
                                    onClick={() => deleteOrder(selectedOrder.purchaseOrderId)}
                                    className={`${styles["action-button"]} ${styles["delete-button"]}`}
                                    title="Delete order"
                                >
                                    <Trash2 size={16} />
                                    <span>Delete</span>
                                </button>
                                <button
                                    className={styles["close-modal-btn"]}
                                    onClick={() => setSelectedOrder(null)}
                                    title="Close"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <section className={styles["card-section"]}>
                            <h4 className={styles["section-title"]}>Order Summary</h4>
                            <div className={styles["detail-grid"]}>
                                <div className={styles["detail-item"]}>
                                    <span className={styles["detail-label"]}>Order ID:</span>
                                    <span className={styles["detail-value"]}>{selectedOrder.purchaseOrderId}</span>
                                </div>
                                <div className={styles["detail-item"]}>
                                    <span className={styles["detail-label"]}>Purchase Date:</span>
                                    <span className={styles["detail-value"]}>
                                        {new Date(selectedOrder.purchaseDate).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className={styles["detail-item"]}>
                                    <span className={styles["detail-label"]}>Due Date:</span>
                                    <span className={styles["detail-value"]}>
                                        {new Date(selectedOrder.dueDate).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className={styles["detail-item"]}>
                                    <span className={styles["detail-label"]}>Order Type:</span>
                                    <span className={styles["detail-value"]}>{selectedOrder.orderType}</span>
                                </div>
                                <div className={styles["detail-item"]}>
                                    <span className={styles["detail-label"]}>State of Supply:</span>
                                    <span className={styles["detail-value"]}>
                                        {selectedOrder.stateOfSupply?.replace(/_/g, " ")}
                                    </span>
                                </div>
                                <div className={styles["detail-item"]}>
                                    <span className={styles["detail-label"]}>Payment Type:</span>
                                    <span className={styles["detail-value"]}>{selectedOrder.paymentType}</span>
                                </div>
                                <div className={styles["detail-item"]}>
                                    <span className={styles["detail-label"]}>Description:</span>
                                    <span className={styles["detail-value"]}>{selectedOrder.description || "—"}</span>
                                </div>
                                <div className={styles["detail-item"]}>
                                    <span className={styles["detail-label"]}>Total Quantity:</span>
                                    <span className={styles["detail-value"]}>{selectedOrder.totalQuantity}</span>
                                </div>
                            </div>

                            <div className={styles["amount-breakdown"]}>
                                <div className={styles["breakdown-row"]}>
                                    <span>Total (ex-tax):</span>
                                    <span>₹{Number.parseFloat(selectedOrder.totalAmountWithoutTax || 0).toFixed(2)}</span>
                                </div>
                                <div className={styles["breakdown-row"]}>
                                    <span>Tax Amount:</span>
                                    <span>₹{Number.parseFloat(selectedOrder.totalTaxAmount || 0).toFixed(2)}</span>
                                </div>
                                <div className={styles["breakdown-row"]}>
                                    <span>Total Discount:</span>
                                    <span>₹{Number.parseFloat(selectedOrder.totalDiscount || 0).toFixed(2)}</span>
                                </div>
                                <div className={styles["breakdown-row"]}>
                                    <span>Total Amount:</span>
                                    <span className={styles["total-amount"]}>
                                        ₹{Number.parseFloat(selectedOrder.totalAmount || 0).toFixed(2)}
                                    </span>
                                </div>
                                <div className={styles["breakdown-row"]}>
                                    <span>Advance Paid:</span>
                                    <span>₹{Number.parseFloat(selectedOrder.advanceAmount || 0).toFixed(2)}</span>
                                </div>
                                <div
                                    className={`${styles["breakdown-row"]} ${
                                        selectedOrder.balanceAmount > 0 ? styles["balance-row-pending"] : styles["balance-row-paid"]
                                    }`}
                                >
                                    <span>Balance Due:</span>
                                    <span className={styles["balance-amount"]}>
                                        ₹{Number.parseFloat(selectedOrder.balanceAmount || 0).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </section>

                        {/* Party Details */}
                        {selectedOrder.partyResponseDto && (
                            <section className={styles["card-section"]}>
                                <h4 className={styles["section-title"]}>Party Details</h4>
                                <div className={styles["detail-grid"]}>
                                    <div className={styles["detail-item"]}>
                                        <span className={styles["detail-label"]}>Name:</span>
                                        <span className={styles["detail-value"]}>{selectedOrder.partyResponseDto.name}</span>
                                    </div>
                                    <div className={styles["detail-item"]}>
                                        <span className={styles["detail-label"]}>Party ID:</span>
                                        <span className={styles["detail-value"]}>{selectedOrder.partyResponseDto.partyId}</span>
                                    </div>
                                    <div className={styles["detail-item"]}>
                                        <span className={styles["detail-label"]}>GSTIN:</span>
                                        <span className={styles["detail-value"]}>{selectedOrder.partyResponseDto.gstin || "—"}</span>
                                    </div>
                                    <div className={styles["detail-item"]}>
                                        <span className={styles["detail-label"]}>GST Type:</span>
                                        <span className={styles["detail-value"]}>
                                            {selectedOrder.partyResponseDto.gstType?.replace(/_/g, " ")}
                                        </span>
                                    </div>
                                    <div className={styles["detail-item"]}>
                                        <span className={styles["detail-label"]}>Phone:</span>
                                        <span className={styles["detail-value"]}>{selectedOrder.partyResponseDto.phoneNo || "—"}</span>
                                    </div>
                                    <div className={styles["detail-item"]}>
                                        <span className={styles["detail-label"]}>Email:</span>
                                        <span className={styles["detail-value"]}>{selectedOrder.partyResponseDto.emailId || "—"}</span>
                                    </div>
                                    <div className={styles["detail-item"]}>
                                        <span className={styles["detail-label"]}>State:</span>
                                        <span className={styles["detail-value"]}>
                                            {selectedOrder.partyResponseDto.state?.replace(/_/g, " ")}
                                        </span>
                                    </div>
                                    <div className={styles["detail-item"]}>
                                        <span className={styles["detail-label"]}>Billing Address:</span>
                                        <span className={styles["detail-value"]}>
                                            {selectedOrder.partyResponseDto.billingAddress || "—"}
                                        </span>
                                    </div>
                                    <div className={styles["detail-item"]}>
                                        <span className={styles["detail-label"]}>Shipping Address:</span>
                                        <span className={styles["detail-value"]}>
                                            {selectedOrder.partyResponseDto.shipingAddress || "—"}
                                        </span>
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Items */}
                        <section className={styles["card-section"]}>
                            <h4 className={styles["section-title"]}>Items</h4>
                            {selectedOrder.purchaseOrderItemResponseList?.length > 0 ? (
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
                                            {selectedOrder.purchaseOrderItemResponseList.map((it, i) => (
                                                <tr key={i}>
                                                    <td>{it.itemName}</td>
                                                    <td>{it.quantity}</td>
                                                    <td>{it.unit}</td>
                                                    <td>₹{Number.parseFloat(it.perUnitRate || 0).toFixed(2)}</td>
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