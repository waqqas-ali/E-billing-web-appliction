// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import config from "../../../config/apiconfig";
// import styles from "./Sales.module.css";
// import { toast } from "react-toastify";

// const SalesHistory = () => {
//   const navigate = useNavigate();
//   const userData = JSON.parse(localStorage.getItem("eBilling")) || {};
//   const token = userData?.accessToken || "";
//   const companyId = userData?.selectedCompany?.id || "";

//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedOrder, setSelectedOrder] = useState(null);

//   // Fetch Sale Orders
//   const fetchOrders = async () => {
//     if (!token || !companyId) return;
//     setLoading(true);
//     try {
//       const res = await axios.get(
//         `${config.BASE_URL}/company/${companyId}/sale-order/list/according`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       setOrders(res.data || []);
//     } catch (err) {
//       toast.error("Failed to load sale orders");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, [token, companyId]);

//   return (
//     <div className={styles["company-form-container"]}>
//       {/* Header */}
//       <div className={styles["form-header"]}>
//         <div>
//           <h1 className={styles["company-form-title"]}>Sales Order History</h1>
//           <p className={styles["form-subtitle"]}>View all sale orders</p>
//         </div>
//         <button
//           onClick={() => navigate(-1)}
//           className={styles["cancel-button"]}
//         >
//           Back
//         </button>
//       </div>

//       {/* Loading */}
//       {loading && (
//         <div className={styles["loading-message"]}>
//           <div className={styles.spinner}></div>
//           <p>Loading orders...</p>
//         </div>
//       )}

//       {/* Table */}
//       {orders.length > 0 ? (
//         <div className={styles["table-wrapper"]}>
//           <table className={styles.table}>
//             <thead>
//               <tr>
//                 <th>Order #</th>
//                 <th>Order Date</th>
//                 <th>Party</th>
//                 <th>Phone</th>
//                 <th>Total Qty</th>
//                 <th>Total</th>
//                 <th>Advance</th>
//                 <th>Balance</th>
//                 <th>Status</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {orders.map((order) => (
//                 <tr key={order.saleOrderId}>
//                   <td>{order.orderNo}</td>
//                   <td>{new Date(order.orderDate).toLocaleDateString()}</td>
//                   <td>{order.partyResponseDto?.name || "—"}</td>
//                   <td>{order.phoneNo}</td>
//                   <td>{order.totalQuantity}</td>
//                   <td>₹{order.totalAmount?.toFixed(2)}</td>
//                   <td>₹{order.advanceAmount?.toFixed(2)}</td>
//                   <td
//                     style={{
//                       color: order.balanceAmount > 0 ? "#e74c3c" : "#27ae60",
//                       fontWeight: "600",
//                     }}
//                   >
//                     ₹{order.balanceAmount?.toFixed(2)}
//                   </td>
//                   <td>
//                     <span
//                       style={{
//                         padding: "4px 8px",
//                         borderRadius: "4px",
//                         fontSize: "0.8rem",
//                         background: order.orderType === "OPEN" ? "#f39c12" : "#27ae60",
//                         color: "white",
//                       }}
//                     >
//                       {order.orderType}
//                     </span>
//                   </td>
//                   <td className={styles["actions-cell"]}>
//                     <button
//                       onClick={() => setSelectedOrder(order)}
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
//           <p>No sale orders found</p>
//           <p className={styles["no-data-subtitle"]}>
//             There are no sale orders to display.
//           </p>
//         </div>
//       )}

//       {/* VIEW MODAL */}
//       {selectedOrder && (
//         <div
//           className={styles["modal-overlay"]}
//           onClick={() => setSelectedOrder(null)}
//         >
//           <div
//             className={styles["detail-card"]}
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className={styles["card-header"]}>
//               <h3>Sale Order #{selectedOrder.orderNo}</h3>
//               <button
//                 className={styles["close-modal-btn"]}
//                 onClick={() => setSelectedOrder(null)}
//               >
//                 Close
//               </button>
//             </div>

//             {/* Order Summary */}
//             <section className={styles["card-section"]}>
//               <h4>Order Summary</h4>
//               <div className={styles["detail-grid"]}>
//                 <p><strong>Order ID:</strong> {selectedOrder.saleOrderId}</p>
//                 <p><strong>Order Date:</strong> {new Date(selectedOrder.orderDate).toLocaleDateString()}</p>
//                 <p><strong>Due Date:</strong> {new Date(selectedOrder.dueDate).toLocaleDateString()}</p>
//                 <p><strong>Order Type:</strong> {selectedOrder.orderType}</p>
//                 <p><strong>State of Supply:</strong> {selectedOrder.stateOfSupply?.replace(/_/g, " ")}</p>
//                 <p><strong>Payment Type:</strong> {selectedOrder.paymentType}</p>
//                 <p><strong>Description:</strong> {selectedOrder.description || "—"}</p>
//                 <p><strong>Total Quantity:</strong> {selectedOrder.totalQuantity}</p>
//                 <p><strong>Total Discount:</strong> ₹{selectedOrder.totalDiscountAmount?.toFixed(2)}</p>
//                 <p><strong>Total Tax:</strong> ₹{selectedOrder.totalTaxAmount?.toFixed(2)}</p>
//                 <p><strong>Total Amount:</strong> ₹{selectedOrder.totalAmount?.toFixed(2)}</p>
//                 <p><strong>Advance Paid:</strong> ₹{selectedOrder.advanceAmount?.toFixed(2)}</p>
//                 <p>
//                   <strong>Balance Due:</strong>{" "}
//                   <span
//                     style={{
//                       color: selectedOrder.balanceAmount > 0 ? "#e74c3c" : "#27ae60",
//                       fontWeight: "600",
//                     }}
//                   >
//                     ₹{selectedOrder.balanceAmount?.toFixed(2)}
//                   </span>
//                 </p>
//               </div>
//             </section>

//             {/* Party Details */}
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
//               {selectedOrder.saleOrderItemResponses?.length > 0 ? (
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
//                     {selectedOrder.saleOrderItemResponses.map((item, i) => (
//                       <tr key={i}>
//                         <td>{item.name}</td>
//                         <td>{item.quantity}</td>
//                         <td>{item.unit}</td>
//                         <td>₹{item.pricePerRate?.toFixed(2)}</td>
//                         <td>{item.taxType}</td>
//                         <td>{item.taxRate}</td>
//                         <td>₹{item.discountAmount?.toFixed(2)}</td>
//                         <td>₹{item.totalTaxAmount?.toFixed(2)}</td>
//                         <td>₹{item.totalAmount?.toFixed(2)}</td>
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

// export default SalesHistory;






// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import config from "../../../config/apiconfig";
// import styles from "./Sales.module.css";
// import { toast } from "react-toastify";

// const SalesHistory = () => {
//   const navigate = useNavigate();
//   const userData = JSON.parse(localStorage.getItem("eBilling")) || {};
//   const token = userData?.accessToken || "";
//   const companyId = userData?.selectedCompany?.id || "";

//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedOrder, setSelectedOrder] = useState(null);

//   // Fetch Sale Orders
//   const fetchOrders = async () => {
//     if (!token || !companyId) return;
//     setLoading(true);
//     try {
//       const res = await axios.get(
//         `${config.BASE_URL}/company/${companyId}/sale-order/list/according`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       setOrders(res.data || []);
//     } catch (err) {
//       toast.error("Failed to load sale orders");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, [token, companyId]);

//   return (
//     <div className={styles["company-form-container"]}>
//       {/* Header */}
//       <div className={styles["form-header"]}>
//         <div>
//           <h1 className={styles["company-form-title"]}>Sales Order History</h1>
//           <p className={styles["form-subtitle"]}>View all sale orders</p>
//         </div>

//         {/* NEW ORDER BUTTON */}
//         <button
//           onClick={() => navigate("/create-sale-order")}
//           className={styles["submit-button"]}
//           disabled={loading}
//         >
//           + New Order
//         </button>
//       </div>

//       {/* Loading */}
//       {loading && (
//         <div className={styles["loading-message"]}>
//           <div className={styles.spinner}></div>
//           <p>Loading orders...</p>
//         </div>
//       )}

//       {/* Table */}
//       {orders.length > 0 ? (
//         <div className={styles["table-wrapper"]}>
//           <table className={styles.table}>
//             <thead>
//               <tr>
//                 <th>Order #</th>
//                 <th>Order Date</th>
//                 <th>Party</th>
//                 <th>Phone</th>
//                 <th>Total Qty</th>
//                 <th>Total</th>
//                 <th>Advance</th>
//                 <th>Balance</th>
//                 <th>Status</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {orders.map((order) => (
//                 <tr key={order.saleOrderId}>
//                   <td>{order.orderNo}</td>
//                   <td>{new Date(order.orderDate).toLocaleDateString()}</td>
//                   <td>{order.partyResponseDto?.name || "—"}</td>
//                   <td>{order.phoneNo}</td>
//                   <td>{order.totalQuantity}</td>
//                   <td>₹{order.totalAmount?.toFixed(2)}</td>
//                   <td>₹{order.advanceAmount?.toFixed(2)}</td>
//                   <td
//                     style={{
//                       color: order.balanceAmount > 0 ? "#e74c3c" : "#27ae60",
//                       fontWeight: "600",
//                     }}
//                   >
//                     ₹{order.balanceAmount?.toFixed(2)}
//                   </td>
//                   <td>
//                     <span
//                       style={{
//                         padding: "4px 8px",
//                         borderRadius: "4px",
//                         fontSize: "0.8rem",
//                         background: order.orderType === "OPEN" ? "#f39c12" : "#27ae60",
//                         color: "white",
//                       }}
//                     >
//                       {order.orderType}
//                     </span>
//                   </td>
//                   <td className={styles["actions-cell"]}>
//                     <button
//                       onClick={() => setSelectedOrder(order)}
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
//           <p>No sale orders found</p>
//           <p className={styles["no-data-subtitle"]}>
//             Click “+ New Order” to create your first sale order.
//           </p>
//         </div>
//       )}

//       {/* VIEW MODAL */}
//       {selectedOrder && (
//         <div
//           className={styles["modal-overlay"]}
//           onClick={() => setSelectedOrder(null)}
//         >
//           <div
//             className={styles["detail-card"]}
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className={styles["card-header"]}>
//               <h3>Sale Order #{selectedOrder.orderNo}</h3>
//               <button
//                 className={styles["close-modal-btn"]}
//                 onClick={() => setSelectedOrder(null)}
//               >
//                 Close
//               </button>
//             </div>

//             {/* Order Summary */}
//             <section className={styles["card-section"]}>
//               <h4>Order Summary</h4>
//               <div className={styles["detail-grid"]}>
//                 <p><strong>Order ID:</strong> {selectedOrder.saleOrderId}</p>
//                 <p><strong>Order Date:</strong> {new Date(selectedOrder.orderDate).toLocaleDateString()}</p>
//                 <p><strong>Due Date:</strong> {new Date(selectedOrder.dueDate).toLocaleDateString()}</p>
//                 <p><strong>Order Type:</strong> {selectedOrder.orderType}</p>
//                 <p><strong>State of Supply:</strong> {selectedOrder.stateOfSupply?.replace(/_/g, " ")}</p>
//                 <p><strong>Payment Type:</strong> {selectedOrder.paymentType}</p>
//                 <p><strong>Description:</strong> {selectedOrder.description || "—"}</p>
//                 <p><strong>Total Quantity:</strong> {selectedOrder.totalQuantity}</p>
//                 <p><strong>Total Discount:</strong> ₹{selectedOrder.totalDiscountAmount?.toFixed(2)}</p>
//                 <p><strong>Total Tax:</strong> ₹{selectedOrder.totalTaxAmount?.toFixed(2)}</p>
//                 <p><strong>Total Amount:</strong> ₹{selectedOrder.totalAmount?.toFixed(2)}</p>
//                 <p><strong>Advance Paid:</strong> ₹{selectedOrder.advanceAmount?.toFixed(2)}</p>
//                 <p>
//                   <strong>Balance Due:</strong>{" "}
//                   <span
//                     style={{
//                       color: selectedOrder.balanceAmount > 0 ? "#e74c3c" : "#27ae60",
//                       fontWeight: "600",
//                     }}
//                   >
//                     ₹{selectedOrder.balanceAmount?.toFixed(2)}
//                   </span>
//                 </p>
//               </div>
//             </section>

//             {/* Party Details */}
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
//               {selectedOrder.saleOrderItemResponses?.length > 0 ? (
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
//                     {selectedOrder.saleOrderItemResponses.map((item, i) => (
//                       <tr key={i}>
//                         <td>{item.name}</td>
//                         <td>{item.quantity}</td>
//                         <td>{item.unit}</td>
//                         <td>₹{item.pricePerRate?.toFixed(2)}</td>
//                         <td>{item.taxType}</td>
//                         <td>{item.taxRate}</td>
//                         <td>₹{item.discountAmount?.toFixed(2)}</td>
//                         <td>₹{item.totalTaxAmount?.toFixed(2)}</td>
//                         <td>₹{item.totalAmount?.toFixed(2)}</td>
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

// export default SalesHistory;







// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import config from "../../../config/apiconfig";
// import styles from "./Sales.module.css";
// import { toast } from "react-toastify";

// const SalesHistory = () => {
//   const navigate = useNavigate();
//   const userData = JSON.parse(localStorage.getItem("eBilling")) || {};
//   const token = userData?.accessToken || "";
//   const companyId = userData?.selectedCompany?.id || "";

//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedOrder, setSelectedOrder] = useState(null);

//   // Fetch Sale Orders
//   const fetchOrders = async () => {
//     if (!token || !companyId) return;
//     setLoading(true);
//     try {
//       const res = await axios.get(
//         `${config.BASE_URL}/company/${companyId}/sale-order/list/according`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       setOrders(res.data || []);
//     } catch (err) {
//       toast.error("Failed to load sale orders");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, [token, companyId]);

//   // Delete Sale Order
//   const deleteOrder = async (saleOrderId) => {
//     if (!window.confirm("Are you sure you want to delete this sale order? This action cannot be undone.")) {
//       return;
//     }

//     try {
//       setLoading(true);
//       await axios.delete(`${config.BASE_URL}/sale-order/${saleOrderId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       // Remove from UI
//       setOrders((prev) => prev.filter((o) => o.saleOrderId !== saleOrderId));
//       setSelectedOrder(null);
//       toast.success("Sale order deleted successfully");
//     } catch (err) {
//       console.error("Delete error:", err);
//       toast.error(err.response?.data?.message || "Failed to delete sale order");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className={styles["company-form-container"]}>
//       {/* Header */}
//       <div className={styles["form-header"]}>
//         <div>
//           <h1 className={styles["company-form-title"]}>Sales Order History</h1>
//           <p className={styles["form-subtitle"]}>View all sale orders</p>
//         </div>

//         {/* NEW ORDER BUTTON */}
//         <button
//           onClick={() => navigate("/create-sale-order")}
//           className={styles["submit-button"]}
//           disabled={loading}
//         >
//           + New Order
//         </button>
//       </div>

//       {/* Loading */}
//       {loading && (
//         <div className={styles["loading-message"]}>
//           <div className={styles.spinner}></div>
//           <p>Loading orders...</p>
//         </div>
//       )}

//       {/* Table */}
//       {orders.length > 0 ? (
//         <div className={styles["table-wrapper"]}>
//           <table className={styles.table}>
//             <thead>
//               <tr>
//                 <th>Order #</th>
//                 <th>Order Date</th>
//                 <th>Party</th>
//                 <th>Phone</th>
//                 <th>Total Qty</th>
//                 <th>Total</th>
//                 <th>Advance</th>
//                 <th>Balance</th>
//                 <th>Status</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {orders.map((order) => (
//                 <tr key={order.saleOrderId}>
//                   <td>{order.orderNo}</td>
//                   <td>{new Date(order.orderDate).toLocaleDateString()}</td>
//                   <td>{order.partyResponseDto?.name || "—"}</td>
//                   <td>{order.phoneNo}</td>
//                   <td>{order.totalQuantity}</td>
//                   <td>₹{order.totalAmount?.toFixed(2)}</td>
//                   <td>₹{order.advanceAmount?.toFixed(2)}</td>
//                   <td
//                     style={{
//                       color: order.balanceAmount > 0 ? "#e74c3c" : "#27ae60",
//                       fontWeight: "600",
//                     }}
//                   >
//                     ₹{order.balanceAmount?.toFixed(2)}
//                   </td>
//                   <td>
//                     <span
//                       style={{
//                         padding: "4px 8px",
//                         borderRadius: "4px",
//                         fontSize: "0.8rem",
//                         background: order.orderType === "OPEN" ? "#f39c12" : "#27ae60",
//                         color: "white",
//                       }}
//                     >
//                       {order.orderType}
//                     </span>
//                   </td>
//                   <td className={styles["actions-cell"]}>
//                     <button
//                       onClick={() => setSelectedOrder(order)}
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
//           <p>No sale orders found</p>
//           <p className={styles["no-data-subtitle"]}>
//             Click “+ New Order” to create your first sale order.
//           </p>
//         </div>
//       )}

//       {/* VIEW MODAL WITH DELETE BUTTON */}
//       {selectedOrder && (
//         <div
//           className={styles["modal-overlay"]}
//           onClick={() => setSelectedOrder(null)}
//         >
//           <div
//             className={styles["detail-card"]}
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className={styles["card-header"]}>
//               <div>
//                 <h3>Sale Order #{selectedOrder.orderNo}</h3>
//                 <div
//                   style={{
//                     padding: "4px 8px",
//                     borderRadius: "4px",
//                     fontSize: "0.8rem",
//                     background: selectedOrder.orderType === "OPEN" ? "#f39c12" : "#27ae60",
//                     color: "white",
//                     display: "inline-block",
//                     marginTop: "4px",
//                   }}
//                 >
//                   {selectedOrder.orderType}
//                 </div>
//               </div>
//               <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
//                 {/* DELETE BUTTON */}
//                 <button
//                   onClick={() => deleteOrder(selectedOrder.saleOrderId)}
//                   className={`${styles["action-button"]} ${styles["delete-button"]}`}
//                   title="Delete sale order"
//                   disabled={loading}
//                 >
//                   Delete
//                 </button>

//                 <button
//                   className={styles["close-modal-btn"]}
//                   onClick={() => setSelectedOrder(null)}
//                   disabled={loading}
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>

//             {/* Order Summary */}
//             <section className={styles["card-section"]}>
//               <h4>Order Summary</h4>
//               <div className={styles["detail-grid"]}>
//                 <p><strong>Order ID:</strong> {selectedOrder.saleOrderId}</p>
//                 <p><strong>Order Date:</strong> {new Date(selectedOrder.orderDate).toLocaleDateString()}</p>
//                 <p><strong>Due Date:</strong> {new Date(selectedOrder.dueDate).toLocaleDateString()}</p>
//                 <p><strong>Order Type:</strong> {selectedOrder.orderType}</p>
//                 <p><strong>State of Supply:</strong> {selectedOrder.stateOfSupply?.replace(/_/g, " ")}</p>
//                 <p><strong>Payment Type:</strong> {selectedOrder.paymentType}</p>
//                 <p><strong>Description:</strong> {selectedOrder.description || "—"}</p>
//                 <p><strong>Total Quantity:</strong> {selectedOrder.totalQuantity}</p>
//                 <p><strong>Total Discount:</strong> ₹{selectedOrder.totalDiscountAmount?.toFixed(2)}</p>
//                 <p><strong>Total Tax:</strong> ₹{selectedOrder.totalTaxAmount?.toFixed(2)}</p>
//                 <p><strong>Total Amount:</strong> ₹{selectedOrder.totalAmount?.toFixed(2)}</p>
//                 <p><strong>Advance Paid:</strong> ₹{selectedOrder.advanceAmount?.toFixed(2)}</p>
//                 <p>
//                   <strong>Balance Due:</strong>{" "}
//                   <span
//                     style={{
//                       color: selectedOrder.balanceAmount > 0 ? "#e74c3c" : "#27ae60",
//                       fontWeight: "600",
//                     }}
//                   >
//                     ₹{selectedOrder.balanceAmount?.toFixed(2)}
//                   </span>
//                 </p>
//               </div>
//             </section>

//             {/* Party Details */}
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
//               {selectedOrder.saleOrderItemResponses?.length > 0 ? (
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
//                     {selectedOrder.saleOrderItemResponses.map((item, i) => (
//                       <tr key={i}>
//                         <td>{item.name}</td>
//                         <td>{item.quantity}</td>
//                         <td>{item.unit}</td>
//                         <td>₹{item.pricePerRate?.toFixed(2)}</td>
//                         <td>{item.taxType}</td>
//                         <td>{item.taxRate}</td>
//                         <td>₹{item.discountAmount?.toFixed(2)}</td>
//                         <td>₹{item.totalTaxAmount?.toFixed(2)}</td>
//                         <td>₹{item.totalAmount?.toFixed(2)}</td>
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

// export default SalesHistory;








import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../../../config/apiconfig";
import styles from "./Sales.module.css";
import { toast } from "react-toastify";

const SalesHistory = () => {
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("eBilling")) || {};
  const token = userData?.accessToken || "";
  const companyId = userData?.selectedCompany?.id || "";

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Fetch Sale Orders
  const fetchOrders = async () => {
    if (!token || !companyId) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `${config.BASE_URL}/company/${companyId}/sale-order/list/according`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setOrders(res.data || []);
    } catch (err) {
      toast.error("Failed to load sale orders");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token, companyId]);

  // Delete Sale Order
  const deleteOrder = async (saleOrderId) => {
    if (!window.confirm("Are you sure you want to delete this sale order? This action cannot be undone.")) {
      return;
    }

    try {
      setLoading(true);
      await axios.delete(`${config.BASE_URL}/sale-order/${saleOrderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders((prev) => prev.filter((o) => o.saleOrderId !== saleOrderId));
      setSelectedOrder(null);
      toast.success("Sale order deleted successfully");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error(err.response?.data?.message || "Failed to delete sale order");
    } finally {
      setLoading(false);
    }
  };

  // Edit Navigation
  const handleEdit = (saleOrderId) => {
    navigate(`/create-sale-order?edit=${saleOrderId}`);
    setSelectedOrder(null);
  };

  return (
    <div className={styles["company-form-container"]}>
      {/* Header */}
      <div className={styles["form-header"]}>
        <div>
          <h1 className={styles["company-form-title"]}>Sales Order History</h1>
          <p className={styles["form-subtitle"]}>View all sale orders</p>
        </div>

        <button
          onClick={() => navigate("/create-sale-order")}
          className={styles["submit-button"]}
          disabled={loading}
        >
          + New Order
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className={styles["loading-message"]}>
          <div className={styles.spinner}></div>
          <p>Loading orders...</p>
        </div>
      )}

      {/* Table */}
      {orders.length > 0 ? (
        <div className={styles["table-wrapper"]}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order #</th>
                <th>Order Date</th>
                <th>Party</th>
                <th>Phone</th>
                <th>Total Qty</th>
                <th>Total</th>
                <th>Advance</th>
                <th>Balance</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.saleOrderId}>
                  <td>{order.orderNo}</td>
                  <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                  <td>{order.partyResponseDto?.name || "—"}</td>
                  <td>{order.phoneNo}</td>
                  <td>{order.totalQuantity}</td>
                  <td>₹{order.totalAmount?.toFixed(2)}</td>
                  <td>₹{order.advanceAmount?.toFixed(2)}</td>
                  <td
                    style={{
                      color: order.balanceAmount > 0 ? "#e74c3c" : "#27ae60",
                      fontWeight: "600",
                    }}
                  >
                    ₹{order.balanceAmount?.toFixed(2)}
                  </td>
                  <td>
                    <span
                      style={{
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "0.8rem",
                        background: order.orderType === "OPEN" ? "#f39c12" : "#27ae60",
                        color: "white",
                      }}
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
          <p>No sale orders found</p>
          <p className={styles["no-data-subtitle"]}>
            Click “+ New Order” to create your first sale order.
          </p>
        </div>
      )}

      {/* VIEW MODAL - EDIT ONLY IF NOT CLOSED */}
      {selectedOrder && (
        <div
          className={styles["modal-overlay"]}
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className={styles["detail-card"]}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles["card-header"]}>
              <div>
                <h3>Sale Order #{selectedOrder.orderNo}</h3>
                <div
                  style={{
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontSize: "0.8rem",
                    background: selectedOrder.orderType === "OPEN" ? "#f39c12" : "#27ae60",
                    color: "white",
                    display: "inline-block",
                    marginTop: "4px",
                  }}
                >
                  {selectedOrder.orderType}
                </div>
              </div>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                {/* DELETE BUTTON */}
                <button
                  onClick={() => deleteOrder(selectedOrder.saleOrderId)}
                  className={`${styles["action-button"]} ${styles["delete-button"]}`}
                  title="Delete sale order"
                  disabled={loading}
                >
                  Delete
                </button>

                {/* EDIT BUTTON - ONLY IF NOT CLOSED */}
                {selectedOrder.orderType !== "CLOSE" && (
                  <button
                    onClick={() => handleEdit(selectedOrder.saleOrderId)}
                    className={`${styles["action-button"]} ${styles["edit-button"]}`}
                    title="Edit sale order"
                    disabled={loading}
                  >
                    Edit
                  </button>
                )}

                {/* CLOSE BUTTON */}
                <button
                  className={styles["close-modal-btn"]}
                  onClick={() => setSelectedOrder(null)}
                  disabled={loading}
                >
                  Close
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <section className={styles["card-section"]}>
              <h4>Order Summary</h4>
              <div className={styles["detail-grid"]}>
                <p><strong>Order ID:</strong> {selectedOrder.saleOrderId}</p>
                <p><strong>Order Date:</strong> {new Date(selectedOrder.orderDate).toLocaleDateString()}</p>
                <p><strong>Due Date:</strong> {new Date(selectedOrder.dueDate).toLocaleDateString()}</p>
                <p><strong>Order Type:</strong> {selectedOrder.orderType}</p>
                <p><strong>State of Supply:</strong> {selectedOrder.stateOfSupply?.replace(/_/g, " ")}</p>
                <p><strong>Payment Type:</strong> {selectedOrder.paymentType}</p>
                <p><strong>Description:</strong> {selectedOrder.description || "—"}</p>
                <p><strong>Total Quantity:</strong> {selectedOrder.totalQuantity}</p>
                <p><strong>Total Discount:</strong> ₹{selectedOrder.totalDiscountAmount?.toFixed(2)}</p>
                <p><strong>Total Tax:</strong> ₹{selectedOrder.totalTaxAmount?.toFixed(2)}</p>
                <p><strong>Total Amount:</strong> ₹{selectedOrder.totalAmount?.toFixed(2)}</p>
                <p><strong>Advance Paid:</strong> ₹{selectedOrder.advanceAmount?.toFixed(2)}</p>
                <p>
                  <strong>Balance Due:</strong>{" "}
                  <span
                    style={{
                      color: selectedOrder.balanceAmount > 0 ? "#e74c3c" : "#27ae60",
                      fontWeight: "600",
                    }}
                  >
                    ₹{selectedOrder.balanceAmount?.toFixed(2)}
                  </span>
                </p>
              </div>
            </section>

            {/* Party Details */}
            {selectedOrder.partyResponseDto && (
              <section className={styles["card-section"]}>
                <h4>Party Details</h4>
                <div className={styles["detail-grid"]}>
                  <p><strong>Name:</strong> {selectedOrder.partyResponseDto.name}</p>
                  <p><strong>Party ID:</strong> {selectedOrder.partyResponseDto.partyId}</p>
                  <p><strong>GSTIN:</strong> {selectedOrder.partyResponseDto.gstin || "—"}</p>
                  <p><strong>GST Type:</strong> {selectedOrder.partyResponseDto.gstType?.replace(/_/g, " ")}</p>
                  <p><strong>Phone:</strong> {selectedOrder.partyResponseDto.phoneNo || "—"}</p>
                  <p><strong>Email:</strong> {selectedOrder.partyResponseDto.emailId || "—"}</p>
                  <p><strong>State:</strong> {selectedOrder.partyResponseDto.state?.replace(/_/g, " ")}</p>
                  <p><strong>Billing Address:</strong> {selectedOrder.partyResponseDto.billingAddress || "—"}</p>
                  <p><strong>Shipping Address:</strong> {selectedOrder.partyResponseDto.shipingAddress || "—"}</p>
                </div>
              </section>
            )}

            {/* Items */}
            <section className={styles["card-section"]}>
              <h4>Items</h4>
              {selectedOrder.saleOrderItemResponses?.length > 0 ? (
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
                    {selectedOrder.saleOrderItemResponses.map((item, i) => (
                      <tr key={i}>
                        <td>{item.name}</td>
                        <td>{item.quantity}</td>
                        <td>{item.unit}</td>
                        <td>₹{item.pricePerRate?.toFixed(2)}</td>
                        <td>{item.taxType}</td>
                        <td>{item.taxRate}</td>
                        <td>₹{item.discountAmount?.toFixed(2)}</td>
                        <td>₹{item.totalTaxAmount?.toFixed(2)}</td>
                        <td>₹{item.totalAmount?.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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

export default SalesHistory;