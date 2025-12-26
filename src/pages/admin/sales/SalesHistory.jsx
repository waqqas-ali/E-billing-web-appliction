// "use client"

// import { useEffect, useState } from "react"
// import { useNavigate } from "react-router-dom"
// import axios from "axios"
// import config from "../../../config/apiconfig"
// import styles from "../Styles/ScreenUI.module.css"
// import { toast } from "react-toastify"
// import { Plus, Eye, Trash2, X, Package, AlertCircle, CheckCircle, ChevronDown, Search, Loader } from "lucide-react"

// const SalesHistory = () => {
//   const navigate = useNavigate()
//   const userData = JSON.parse(localStorage.getItem("eBilling")) || {}
//   const token = userData?.accessToken || ""
//   const companyId = userData?.selectedCompany?.id || ""

//   const [orders, setOrders] = useState([])
//   const [loading, setLoading] = useState(false)
//   const [selectedOrder, setSelectedOrder] = useState(null)
//   const [searchTerm, setSearchTerm] = useState("")

//   const fetchOrders = async () => {
//     if (!token || !companyId) {
//       toast.error("Session expired or no company selected.")
//       return
//     }

//     setLoading(true)
//     try {
//       const res = await axios.get(`${config.BASE_URL}/company/${companyId}/sale-order/list/according`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       })
//       setOrders(res.data || [])
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to load sale orders")
//       console.error(err)
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchOrders()
//   }, [token, companyId])

//   const deleteOrder = async (saleOrderId) => {
//     if (!window.confirm("Are you sure you want to delete this sale order? This action cannot be undone.")) {
//       return
//     }

//     try {
//       setLoading(true)
//       await axios.delete(`${config.BASE_URL}/sale-order/${saleOrderId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })

//       setOrders((prev) => prev.filter((o) => o.saleOrderId !== saleOrderId))
//       setSelectedOrder(null)
//       toast.success("Sale order deleted successfully")
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to delete sale order")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const filteredOrders = orders.filter((o) => {
//     const matchesSearch =
//       o.orderNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       o.partyResponseDto?.name?.toLowerCase().includes(searchTerm.toLowerCase())
//     return matchesSearch
//   })

//   return (
//     <div className={styles["company-form-container"]}>
//       {/* HEADER */}
//       <div className={styles["form-header"]}>
//         <div className={styles["header-content"]}>
//           <div className={styles["header-text"]}>
//             <h1 className={styles["company-form-title"]}>Sales Order History</h1>
//             <p className={styles["form-subtitle"]}>View all sale orders</p>
//           </div>
//         </div>
//         <button onClick={() => navigate("/create-sale-order")} className={styles["submit-button"]} disabled={loading}>
//           <Plus size={18} />
//           <span>New Order</span>
//         </button>
//       </div>

//       {/* SEARCH BAR */}
//       <div className={styles["search-container"]}>
//         <Search size={18} className={styles["search-icon"]} />
//         <input
//           type="text"
//           placeholder="Search by order # or party name..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className={styles["search-input"]}
//         />
//       </div>

//       {/* LOADING */}
//       {loading && (
//         <div className={styles["loading-message"]}>
//           <Loader size={32} className={styles["spinner"]} />
//           <p>Loading orders...</p>
//         </div>
//       )}

//       {/* TABLE / CARDS */}
//       {filteredOrders.length > 0 ? (
//         <>
//           {/* Desktop Table */}
//           <div className={styles["table-wrapper"]}>
//             <table className={styles.table}>
//               <thead>
//                 <tr>
//                   <th>Order #</th>
//                   <th>Order Date</th>
//                   <th>Party</th>
//                   <th>Phone</th>
//                   <th>Total Qty</th>
//                   <th>Total</th>
//                   <th>Advance</th>
//                   <th>Balance</th>
//                   <th>Status</th>
//                   <th>Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredOrders.map((order) => (
//                   <tr key={order.saleOrderId} className={styles["table-row"]}>
//                     <td className={styles["invoice-cell"]}>
//                       <span className={styles["invoice-badge"]}>{order.orderNo}</span>
//                     </td>
//                     <td>{new Date(order.orderDate).toLocaleDateString()}</td>
//                     <td>
//                       <span className={styles["party-name"]}>{order.partyResponseDto?.name || "—"}</span>
//                     </td>
//                     <td>{order.phoneNo || "—"}</td>
//                     <td>{order.totalQuantity}</td>
//                     <td className={styles["amount-cell"]}>
//                       <span className={styles["amount"]}>₹{Number.parseFloat(order.totalAmount || 0).toFixed(2)}</span>
//                     </td>
//                     <td className={styles["received-cell"]}>
//                       ₹{Number.parseFloat(order.advanceAmount || 0).toFixed(2)}
//                     </td>
//                     <td className={styles["balance-cell"]}>
//                       <span className={order.balanceAmount > 0 ? styles["balance-pending"] : styles["balance-paid"]}>
//                         ₹{Number.parseFloat(order.balanceAmount || 0).toFixed(2)}
//                       </span>
//                     </td>
//                     <td>
//                       <span
//                         className={`${styles["status-badge"]} ${
//                           order.orderType === "OPEN" ? styles["status-open"] : styles["status-closed"]
//                         }`}
//                       >
//                         {order.orderType}
//                       </span>
//                     </td>
//                     <td className={styles["actions-cell"]}>
//                       <button
//                         onClick={() => setSelectedOrder(order)}
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
//             {filteredOrders.map((order) => (
//               <div key={order.saleOrderId} className={styles["invoice-card"]}>
//                 <div className={styles["card-header-mobile"]}>
//                   <div className={styles["card-title-section"]}>
//                     <h3 className={styles["card-invoice-number"]}>{order.orderNo}</h3>
//                     <span
//                       className={`${styles["status-badge"]} ${
//                         order.orderType === "OPEN" ? styles["status-open"] : styles["status-closed"]
//                       }`}
//                     >
//                       {order.orderType}
//                     </span>
//                   </div>
//                   <button onClick={() => setSelectedOrder(order)} className={styles["card-action-button"]}>
//                     <ChevronDown size={20} />
//                   </button>
//                 </div>

//                 <div className={styles["card-body"]}>
//                   <div className={styles["card-info-row"]}>
//                     <span className={styles["info-label"]}>Party:</span>
//                     <span className={styles["info-value"]}>{order.partyResponseDto?.name || "—"}</span>
//                   </div>
//                   <div className={styles["card-info-row"]}>
//                     <span className={styles["info-label"]}>Date:</span>
//                     <span className={styles["info-value"]}>{new Date(order.orderDate).toLocaleDateString()}</span>
//                   </div>
//                   <div className={styles["card-info-row"]}>
//                     <span className={styles["info-label"]}>Total:</span>
//                     <span className={styles["info-value-amount"]}>
//                       ₹{Number.parseFloat(order.totalAmount || 0).toFixed(2)}
//                     </span>
//                   </div>
//                   <div className={styles["card-info-row"]}>
//                     <span className={styles["info-label"]}>Balance:</span>
//                     <span
//                       className={order.balanceAmount > 0 ? styles["info-value-pending"] : styles["info-value-paid"]}
//                     >
//                       ₹{Number.parseFloat(order.balanceAmount || 0).toFixed(2)}
//                     </span>
//                   </div>
//                 </div>

//                 <div className={styles["card-footer"]}>
//                   <button onClick={() => setSelectedOrder(order)} className={styles["card-view-button"]}>
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
//             <p>No sale orders found</p>
//             <p className={styles["no-data-subtitle"]}>
//               {searchTerm ? "Try adjusting your search" : 'Click "New Order" to create your first sale order.'}
//             </p>
//           </div>
//         )
//       )}

//       {/* VIEW MODAL */}
//       {selectedOrder && (
//         <div className={styles["modal-overlay"]} onClick={() => setSelectedOrder(null)}>
//           <div className={styles["detail-card"]} onClick={(e) => e.stopPropagation()}>
//             <div className={styles["card-header"]}>
//               <div className={styles["header-title-section"]}>
//                 <h3>Sale Order #{selectedOrder.orderNo}</h3>
//                 <div className={`${styles["balance-badge"]} ${selectedOrder.balanceAmount <= 0 ? styles.paid : ""}`}>
//                   {selectedOrder.balanceAmount > 0 ? (
//                     <>
//                       <AlertCircle size={16} />
//                       Balance: ₹{Number.parseFloat(selectedOrder.balanceAmount || 0).toFixed(2)}
//                     </>
//                   ) : (
//                     <>
//                       <CheckCircle size={16} />
//                       Paid: ₹{Number.parseFloat(selectedOrder.balanceAmount || 0).toFixed(2)}
//                     </>
//                   )}
//                 </div>
//               </div>
//               <div className={styles["header-actions"]}>
//                 <button
//                   onClick={() => deleteOrder(selectedOrder.saleOrderId)}
//                   className={`${styles["action-button"]} ${styles["delete-button"]}`}
//                   title="Delete sale order"
//                 >
//                   <Trash2 size={16} />
//                   <span>Delete</span>
//                 </button>
//                 <button className={styles["close-modal-btn"]} onClick={() => setSelectedOrder(null)} title="Close">
//                   <X size={20} />
//                 </button>
//               </div>
//             </div>

//             {/* Order Summary */}
//             <section className={styles["card-section"]}>
//               <h4 className={styles["section-title"]}>Order Summary</h4>
//               <div className={styles["detail-grid"]}>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>Order ID:</span>
//                   <span className={styles["detail-value"]}>{selectedOrder.saleOrderId}</span>
//                 </div>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>Order Date:</span>
//                   <span className={styles["detail-value"]}>
//                     {new Date(selectedOrder.orderDate).toLocaleDateString()}
//                   </span>
//                 </div>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>Due Date:</span>
//                   <span className={styles["detail-value"]}>{new Date(selectedOrder.dueDate).toLocaleDateString()}</span>
//                 </div>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>Order Type:</span>
//                   <span className={styles["detail-value"]}>{selectedOrder.orderType}</span>
//                 </div>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>State of Supply:</span>
//                   <span className={styles["detail-value"]}>{selectedOrder.stateOfSupply?.replace(/_/g, " ")}</span>
//                 </div>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>Payment Type:</span>
//                   <span className={styles["detail-value"]}>{selectedOrder.paymentType}</span>
//                 </div>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>Description:</span>
//                   <span className={styles["detail-value"]}>{selectedOrder.description || "—"}</span>
//                 </div>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>Total Quantity:</span>
//                   <span className={styles["detail-value"]}>{selectedOrder.totalQuantity}</span>
//                 </div>
//               </div>

//               <div className={styles["amount-breakdown"]}>
//                 <div className={styles["breakdown-row"]}>
//                   <span>Total (ex-tax):</span>
//                   <span>₹{Number.parseFloat(selectedOrder.totalAmountWithoutTax || 0).toFixed(2)}</span>
//                 </div>
//                 <div className={styles["breakdown-row"]}>
//                   <span>Tax Amount:</span>
//                   <span>₹{Number.parseFloat(selectedOrder.totalTaxAmount || 0).toFixed(2)}</span>
//                 </div>
//                 <div className={styles["breakdown-row"]}>
//                   <span>Total Discount:</span>
//                   <span>₹{Number.parseFloat(selectedOrder.totalDiscountAmount || 0).toFixed(2)}</span>
//                 </div>
//                 <div className={styles["breakdown-row"]}>
//                   <span>Total Amount:</span>
//                   <span className={styles["total-amount"]}>
//                     ₹{Number.parseFloat(selectedOrder.totalAmount || 0).toFixed(2)}
//                   </span>
//                 </div>
//                 <div className={styles["breakdown-row"]}>
//                   <span>Advance Paid:</span>
//                   <span>₹{Number.parseFloat(selectedOrder.advanceAmount || 0).toFixed(2)}</span>
//                 </div>
//                 <div
//                   className={`${styles["breakdown-row"]} ${
//                     selectedOrder.balanceAmount > 0 ? styles["balance-row-pending"] : styles["balance-row-paid"]
//                   }`}
//                 >
//                   <span>Balance Due:</span>
//                   <span className={styles["balance-amount"]}>
//                     ₹{Number.parseFloat(selectedOrder.balanceAmount || 0).toFixed(2)}
//                   </span>
//                 </div>
//               </div>
//             </section>

//             {/* Party Details */}
//             {selectedOrder.partyResponseDto && (
//               <section className={styles["card-section"]}>
//                 <h4 className={styles["section-title"]}>Party Details</h4>
//                 <div className={styles["detail-grid"]}>
//                   <div className={styles["detail-item"]}>
//                     <span className={styles["detail-label"]}>Name:</span>
//                     <span className={styles["detail-value"]}>{selectedOrder.partyResponseDto.name}</span>
//                   </div>
//                   <div className={styles["detail-item"]}>
//                     <span className={styles["detail-label"]}>Party ID:</span>
//                     <span className={styles["detail-value"]}>{selectedOrder.partyResponseDto.partyId}</span>
//                   </div>
//                   <div className={styles["detail-item"]}>
//                     <span className={styles["detail-label"]}>GSTIN:</span>
//                     <span className={styles["detail-value"]}>{selectedOrder.partyResponseDto.gstin || "—"}</span>
//                   </div>
//                   <div className={styles["detail-item"]}>
//                     <span className={styles["detail-label"]}>GST Type:</span>
//                     <span className={styles["detail-value"]}>
//                       {selectedOrder.partyResponseDto.gstType?.replace(/_/g, " ")}
//                     </span>
//                   </div>
//                   <div className={styles["detail-item"]}>
//                     <span className={styles["detail-label"]}>Phone:</span>
//                     <span className={styles["detail-value"]}>{selectedOrder.partyResponseDto.phoneNo || "—"}</span>
//                   </div>
//                   <div className={styles["detail-item"]}>
//                     <span className={styles["detail-label"]}>Email:</span>
//                     <span className={styles["detail-value"]}>{selectedOrder.partyResponseDto.emailId || "—"}</span>
//                   </div>
//                   <div className={styles["detail-item"]}>
//                     <span className={styles["detail-label"]}>State:</span>
//                     <span className={styles["detail-value"]}>
//                       {selectedOrder.partyResponseDto.state?.replace(/_/g, " ")}
//                     </span>
//                   </div>
//                   <div className={styles["detail-item"]}>
//                     <span className={styles["detail-label"]}>Billing Address:</span>
//                     <span className={styles["detail-value"]}>
//                       {selectedOrder.partyResponseDto.billingAddress || "—"}
//                     </span>
//                   </div>
//                 </div>
//               </section>
//             )}

//             {/* Items */}
//             <section className={styles["card-section"]}>
//               <h4 className={styles["section-title"]}>Items</h4>
//               {selectedOrder.saleOrderItemResponses?.length > 0 ? (
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
//                       {selectedOrder.saleOrderItemResponses.map((item, i) => (
//                         <tr key={i}>
//                           <td>{item.name}</td>
//                           <td>{item.quantity}</td>
//                           <td>{item.unit}</td>
//                           <td>₹{Number.parseFloat(item.pricePerRate || 0).toFixed(2)}</td>
//                           <td>{item.taxType}</td>
//                           <td>{item.taxRate}</td>
//                           <td>₹{Number.parseFloat(item.discountAmount || 0).toFixed(2)}</td>
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
//   )
// }

// export default SalesHistory








// "use client";

// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import config from "../../../config/apiconfig";
// import styles from "../Styles/ScreenUI.module.css";
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

// // Helper: Map Sale Order to Sale Payload
// const mapSaleOrderToSalePayload = (order) => {
//   const items = order.saleOrderItemResponses?.map((it) => ({
//     itemName: it.name,
//     itemHsnCode: "", // Add HSN if available
//     itemDescription: "",
//     quantity: it.quantity,
//     unit: it.unit,
//     pricePerUnit: it.pricePerRate,
//     pricePerUnitTaxType: it.taxType,
//     taxRate: it.taxRate,
//     taxAmount: it.totalTaxAmount,
//     totalAmount: it.totalAmount,
//   })) ?? [];

//   return {
//     partyId: order.partyResponseDto?.partyId,
//     billingAddress: order.partyResponseDto?.billingAddress || "",
//     shippingAddress: order.partyResponseDto?.shipingAddress || "",
//     invoiceNumber: `${order.orderNo}-INV`,
//     invoiceDate: order.orderDate, // Fixed: was `invoceDate`
//     dueDate: order.dueDate,
//     saleType: order.paymentType === "CASH" ? "CASH" : "CREDIT",
//     stateOfSupply: order.stateOfSupply,
//     paymentType: order.paymentType,
//     paymentDescription: order.description || "",
//     totalAmountWithoutTax: order.totalAmount - order.totalTaxAmount,
//     totalTaxAmount: order.totalTaxAmount,
//     deliveryCharges: 0,
//     totalAmount: order.totalAmount,
//     receivedAmount: order.advanceAmount,
//     balance: order.balanceAmount,
//     saleItems: items,
//     paid: order.balanceAmount <= 0,
//     overdue: new Date(order.dueDate) < new Date(),
//   };
// };

// const SalesHistory = () => {
//   const navigate = useNavigate();
//   const userData = JSON.parse(localStorage.getItem("eBilling") || "{}");
//   const token = userData?.accessToken || "";
//   const companyId = userData?.selectedCompany?.id || "";

//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [converting, setConverting] = useState(false);

//   const fetchOrders = async () => {
//     if (!token || !companyId) {
//       toast.error("Session expired or no company selected.");
//       return;
//     }

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
//       toast.error(err.response?.data?.message || "Failed to load sale orders");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, [token, companyId]);

//   const deleteOrder = async (saleOrderId) => {
//     if (!window.confirm("Are you sure you want to delete this sale order? This action cannot be undone.")) {
//       return;
//     }

//     try {
//       setLoading(true);
//       await axios.delete(`${config.BASE_URL}/sale-order/${saleOrderId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setOrders((prev) => prev.filter((o) => o.saleOrderId !== saleOrderId));
//       setSelectedOrder(null);
//       toast.success("Sale order deleted successfully");
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to delete sale order");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (saleOrderId) => {
//     navigate(`/create-sale-order?edit=${saleOrderId}`);
//     setSelectedOrder(null);
//   };

//   const handleConvert = async (saleOrderId) => {
//     if (converting) return;

//     if (!window.confirm("Convert this sale order to a sale invoice? This action cannot be undone.")) {
//       return;
//     }

//     setConverting(true);

//     try {
//       const res = await axios.get(`${config.BASE_URL}/sale-order/${saleOrderId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const order = res.data;

//       const payload = mapSaleOrderToSalePayload(order);

//       const convertRes = await axios.post(
//         `${config.BASE_URL}/sale-order/${saleOrderId}/convert/to/sale`,
//         payload,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       toast.success("Sale order converted to Sale Invoice successfully!");

//       if (convertRes.data?.saleId) {
//         // navigate(`/sales/${convertRes.data.saleId}`);
//       } else {
//         fetchOrders();
//       }
//       setSelectedOrder(null);
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to convert to sale");
//     } finally {
//       setConverting(false);
//     }
//   };

//   const filteredOrders = orders.filter((o) => {
//     const matchesSearch =
//       o.orderNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       o.partyResponseDto?.name?.toLowerCase().includes(searchTerm.toLowerCase());
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
//             <h1 className={styles["company-form-title"]}>Sales Order History</h1>
//             <p className={styles["form-subtitle"]}>View and manage all sale orders</p>
//           </div>
//         </div>
//         <button
//           onClick={() => navigate("/create-sale-order")}
//           className={styles["submit-button"]}
//           disabled={loading}
//         >
//           <Plus size={18} />
//           <span>New Order</span>
//         </button>
//       </div>

//       {/* SEARCH BAR */}
//       <div className={styles["search-container"]}>
//         <Search size={18} className={styles["search-icon"]} />
//         <input
//           type="text"
//           placeholder="Search by order # or party name..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className={styles["search-input"]}
//         />
//       </div>

//       {/* LOADING */}
//       {loading && !converting && (
//         <div className={styles["loading-message"]}>
//           <Loader size={32} className={styles["spinner"]} />
//           <p>Loading orders...</p>
//         </div>
//       )}

//       {/* TABLE / CARDS */}
//       {filteredOrders.length > 0 ? (
//         <>
//           {/* Desktop Table */}
//           <div className={styles["table-wrapper"]}>
//             <table className={styles.table}>
//               <thead>
//                 <tr>
//                   <th>Order #</th>
//                   <th>Order Date</th>
//                   <th>Party</th>
//                   <th>Phone</th>
//                   <th>Total Qty</th>
//                   <th>Total</th>
//                   <th>Advance</th>
//                   <th>Balance</th>
//                   <th>Status</th>
//                   <th>Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredOrders.map((order) => (
//                   <tr key={order.saleOrderId} className={styles["table-row"]}>
//                     <td className={styles["invoice-cell"]}>
//                       <span className={styles["invoice-badge"]}>{order.orderNo}</span>
//                     </td>
//                     <td>{new Date(order.orderDate).toLocaleDateString()}</td>
//                     <td>
//                       <span className={styles["party-name"]}>{order.partyResponseDto?.name || "—"}</span>
//                     </td>
//                     <td>{order.phoneNo || "—"}</td>
//                     <td>{order.totalQuantity}</td>
//                     <td className={styles["amount-cell"]}>
//                       <span className={styles["amount"]}>
//                         ₹{Number.parseFloat(order.totalAmount || 0).toFixed(2)}
//                       </span>
//                     </td>
//                     <td className={styles["received-cell"]}>
//                       ₹{Number.parseFloat(order.advanceAmount || 0).toFixed(2)}
//                     </td>
//                     <td className={styles["balance-cell"]}>
//                       <span
//                         className={
//                           order.balanceAmount > 0 ? styles["balance-pending"] : styles["balance-paid"]
//                         }
//                       >
//                         ₹{Number.parseFloat(order.balanceAmount || 0).toFixed(2)}
//                       </span>
//                     </td>
//                     <td>
//                       <span
//                         className={`${styles["status-badge"]} ${
//                           order.orderType === "OPEN" ? styles["status-open"] : styles["status-closed"]
//                         }`}
//                       >
//                         {order.orderType}
//                       </span>
//                     </td>
//                     <td className={styles["actions-cell"]}>
//                       <button
//                         onClick={() => setSelectedOrder(order)}
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
//             {filteredOrders.map((order) => (
//               <div key={order.saleOrderId} className={styles["invoice-card"]}>
//                 <div className={styles["card-header-mobile"]}>
//                   <div className={styles["card-title-section"]}>
//                     <h3 className={styles["card-invoice-number"]}>{order.orderNo}</h3>
//                     <span
//                       className={`${styles["status-badge"]} ${
//                         order.orderType === "OPEN" ? styles["status-open"] : styles["status-closed"]
//                       }`}
//                     >
//                       {order.orderType}
//                     </span>
//                   </div>
//                   <button onClick={() => setSelectedOrder(order)} className={styles["card-action-button"]}>
//                     <ChevronDown size={20} />
//                   </button>
//                 </div>

//                 <div className={styles["card-body"]}>
//                   <div className={styles["card-info-row"]}>
//                     <span className={styles["info-label"]}>Party:</span>
//                     <span className={styles["info-value"]}>{order.partyResponseDto?.name || "—"}</span>
//                   </div>
//                   <div className={styles["card-info-row"]}>
//                     <span className={styles["info-label"]}>Date:</span>
//                     <span className={styles["info-value"]}>
//                       {new Date(order.orderDate).toLocaleDateString()}
//                     </span>
//                   </div>
//                   <div className={styles["card-info-row"]}>
//                     <span className={styles["info-label"]}>Total:</span>
//                     <span className={styles["info-value-amount"]}>
//                       ₹{Number.parseFloat(order.totalAmount || 0).toFixed(2)}
//                     </span>
//                   </div>
//                   <div className={styles["card-info-row"]}>
//                     <span className={styles["info-label"]}>Balance:</span>
//                     <span
//                       className={
//                         order.balanceAmount > 0 ? styles["info-value-pending"] : styles["info-value-paid"]
//                       }
//                     >
//                       ₹{Number.parseFloat(order.balanceAmount || 0).toFixed(2)}
//                     </span>
//                   </div>
//                 </div>

//                 <div className={styles["card-footer"]}>
//                   <button onClick={() => setSelectedOrder(order)} className={styles["card-view-button"]}>
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
//             <p>No sale orders found</p>
//             <p className={styles["no-data-subtitle"]}>
//               {searchTerm
//                 ? "Try adjusting your search"
//                 : 'Click "New Order" to create your first sale order.'}
//             </p>
//           </div>
//         )
//       )}

//       {/* VIEW MODAL */}
//       {selectedOrder && (
//         <div className={styles["modal-overlay"]} onClick={() => setSelectedOrder(null)}>
//           <div className={styles["detail-card"]} onClick={(e) => e.stopPropagation()}>
//             <div className={styles["card-header"]}>
//               <div className={styles["header-title-section"]}>
//                 <h3>Sale Order #{selectedOrder.orderNo}</h3>
//                 <div
//                   className={`${styles["balance-badge"]} ${
//                     selectedOrder.balanceAmount <= 0 ? styles.paid : ""
//                   }`}
//                 >
//                   {selectedOrder.balanceAmount > 0 ? (
//                     <>
//                       <AlertCircle size={16} />
//                       Balance: ₹{Number.parseFloat(selectedOrder.balanceAmount || 0).toFixed(2)}
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
//                 {selectedOrder.orderType !== "CLOSE" && (
//                   <>
//                     <button
//                       onClick={() => handleEdit(selectedOrder.saleOrderId)}
//                       className={`${styles["action-button"]} ${styles["edit-button"]}`}
//                       title="Edit"
//                     >
//                       <Edit2 size={16} />
//                       <span>Edit</span>
//                     </button>

//                     <button
//                       onClick={() => handleConvert(selectedOrder.saleOrderId)}
//                       className={`${styles["action-button"]} ${styles["convert-button"]}`}
//                       title="Convert to Sale"
//                       disabled={converting}
//                     >
//                       {converting ? (
//                         <Loader size={16} className={styles.spinner} />
//                       ) : (
//                         <Package size={16} />
//                       )}
//                       <span>{converting ? "Converting…" : "Convert to Sale"}</span>
//                     </button>
//                   </>
//                 )}

//                 <button
//                   onClick={() => deleteOrder(selectedOrder.saleOrderId)}
//                   className={`${styles["action-button"]} ${styles["delete-button"]}`}
//                   title="Delete"
//                 >
//                   <Trash2 size={16} />
//                   <span>Delete</span>
//                 </button>

//                 <button
//                   className={styles["close-modal-btn"]}
//                   onClick={() => setSelectedOrder(null)}
//                   title="Close"
//                 >
//                   <X size={20} />
//                 </button>
//               </div>
//             </div>

//             {/* Order Summary */}
//             <section className={styles["card-section"]}>
//               <h4 className={styles["section-title"]}>Order Summary</h4>
//               <div className={styles["detail-grid"]}>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>Order ID:</span>
//                   <span className={styles["detail-value"]}>{selectedOrder.saleOrderId}</span>
//                 </div>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>Order Date:</span>
//                   <span className={styles["detail-value"]}>
//                     {new Date(selectedOrder.orderDate).toLocaleDateString()}
//                   </span>
//                 </div>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>Due Date:</span>
//                   <span className={styles["detail-value"]}>
//                     {new Date(selectedOrder.dueDate).toLocaleDateString()}
//                   </span>
//                 </div>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>Order Type:</span>
//                   <span className={styles["detail-value"]}>{selectedOrder.orderType}</span>
//                 </div>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>State of Supply:</span>
//                   <span className={styles["detail-value"]}>
//                     {selectedOrder.stateOfSupply?.replace(/_/g, " ")}
//                   </span>
//                 </div>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>Payment Type:</span>
//                   <span className={styles["detail-value"]}>{selectedOrder.paymentType}</span>
//                 </div>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>Description:</span>
//                   <span className={styles["detail-value"]}>{selectedOrder.description || "—"}</span>
//                 </div>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>Total Quantity:</span>
//                   <span className={styles["detail-value"]}>{selectedOrder.totalQuantity}</span>
//                 </div>
//               </div>

//               <div className={styles["amount-breakdown"]}>
//                 <div className={styles["breakdown-row"]}>
//                   <span>Total (ex-tax):</span>
//                   <span>₹{Number.parseFloat(selectedOrder.totalAmount - selectedOrder.totalTaxAmount || 0).toFixed(2)}</span>
//                 </div>
//                 <div className={styles["breakdown-row"]}>
//                   <span>Tax Amount:</span>
//                   <span>₹{Number.parseFloat(selectedOrder.totalTaxAmount || 0).toFixed(2)}</span>
//                 </div>
//                 <div className={styles["breakdown-row"]}>
//                   <span>Total Discount:</span>
//                   <span>₹{Number.parseFloat(selectedOrder.totalDiscountAmount || 0).toFixed(2)}</span>
//                 </div>
//                 <div className={styles["breakdown-row"]}>
//                   <span>Total Amount:</span>
//                   <span className={styles["total-amount"]}>
//                     ₹{Number.parseFloat(selectedOrder.totalAmount || 0).toFixed(2)}
//                   </span>
//                 </div>
//                 <div className={styles["breakdown-row"]}>
//                   <span>Advance Paid:</span>
//                   <span>₹{Number.parseFloat(selectedOrder.advanceAmount || 0).toFixed(2)}</span>
//                 </div>
//                 <div
//                   className={`${styles["breakdown-row"]} ${
//                     selectedOrder.balanceAmount > 0 ? styles["balance-row-pending"] : styles["balance-row-paid"]
//                   }`}
//                 >
//                   <span>Balance Due:</span>
//                   <span className={styles["balance-amount"]}>
//                     ₹{Number.parseFloat(selectedOrder.balanceAmount || 0).toFixed(2)}
//                   </span>
//                 </div>
//               </div>
//             </section>

//             {/* Party Details */}
//             {selectedOrder.partyResponseDto && (
//               <section className={styles["card-section"]}>
//                 <h4 className={styles["section-title"]}>Party Details</h4>
//                 <div className={styles["detail-grid"]}>
//                   <div className={styles["detail-item"]}>
//                     <span className={styles["detail-label"]}>Name:</span>
//                     <span className={styles["detail-value"]}>{selectedOrder.partyResponseDto.name}</span>
//                   </div>
//                   <div className={styles["detail-item"]}>
//                     <span className={styles["detail-label"]}>Party ID:</span>
//                     <span className={styles["detail-value"]}>{selectedOrder.partyResponseDto.partyId}</span>
//                   </div>
//                   <div className={styles["detail-item"]}>
//                     <span className={styles["detail-label"]}>GSTIN:</span>
//                     <span className={styles["detail-value"]}>{selectedOrder.partyResponseDto.gstin || "—"}</span>
//                   </div>
//                   <div className={styles["detail-item"]}>
//                     <span className={styles["detail-label"]}>GST Type:</span>
//                     <span className={styles["detail-value"]}>
//                       {selectedOrder.partyResponseDto.gstType?.replace(/_/g, " ")}
//                     </span>
//                   </div>
//                   <div className={styles["detail-item"]}>
//                     <span className={styles["detail-label"]}>Phone:</span>
//                     <span className={styles["detail-value"]}>{selectedOrder.partyResponseDto.phoneNo || "—"}</span>
//                   </div>
//                   <div className={styles["detail-item"]}>
//                     <span className={styles["detail-label"]}>Email:</span>
//                     <span className={styles["detail-value"]}>{selectedOrder.partyResponseDto.emailId || "—"}</span>
//                   </div>
//                   <div className={styles["detail-item"]}>
//                     <span className={styles["detail-label"]}>State:</span>
//                     <span className={styles["detail-value"]}>
//                       {selectedOrder.partyResponseDto.state?.replace(/_/g, " ")}
//                     </span>
//                   </div>
//                   <div className={styles["detail-item"]}>
//                     <span className={styles["detail-label"]}>Billing Address:</span>
//                     <span className={styles["detail-value"]}>
//                       {selectedOrder.partyResponseDto.billingAddress || "—"}
//                     </span>
//                   </div>
//                   <div className={styles["detail-item"]}>
//                     <span className={styles["detail-label"]}>Shipping Address:</span>
//                     <span className={styles["detail-value"]}>
//                       {selectedOrder.partyResponseDto.shipingAddress || "—"}
//                     </span>
//                   </div>
//                 </div>
//               </section>
//             )}

//             {/* Items */}
//             <section className={styles["card-section"]}>
//               <h4 className={styles["section-title"]}>Items</h4>
//               {selectedOrder.saleOrderItemResponses?.length > 0 ? (
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
//                       {selectedOrder.saleOrderItemResponses.map((item, i) => (
//                         <tr key={i}>
//                           <td>{item.name}</td>
//                           <td>{item.quantity}</td>
//                           <td>{item.unit}</td>
//                           <td>₹{Number.parseFloat(item.pricePerRate || 0).toFixed(2)}</td>
//                           <td>{item.taxType}</td>
//                           <td>{item.taxRate}</td>
//                           <td>₹{Number.parseFloat(item.discountAmount || 0).toFixed(2)}</td>
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

// export default SalesHistory;








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

// // Helper: Map Sale Order to Sale Payload
// const mapSaleOrderToSalePayload = (order) => {
//   const items = order.saleOrderItemResponses?.map((it) => ({
//     itemName: it.name,
//     itemHsnCode: "", // Add HSN if available
//     itemDescription: "",
//     quantity: it.quantity,
//     unit: it.unit,
//     pricePerUnit: it.pricePerRate,
//     pricePerUnitTaxType: it.taxType,
//     taxRate: it.taxRate,
//     taxAmount: it.totalTaxAmount,
//     totalAmount: it.totalAmount,
//   })) ?? [];

//   return {
//     partyId: order.partyResponseDto?.partyId,
//     billingAddress: order.partyResponseDto?.billingAddress || "",
//     shippingAddress: order.partyResponseDto?.shipingAddress || "",
//     invoiceNumber: `${order.orderNo}-INV`,
//     invoiceDate: order.orderDate, // Fixed typo from original
//     dueDate: order.dueDate,
//     saleType: order.paymentType === "CASH" ? "CASH" : "CREDIT",
//     stateOfSupply: order.stateOfSupply,
//     paymentType: order.paymentType,
//     paymentDescription: order.description || "",
//     totalAmountWithoutTax: order.totalAmount - order.totalTaxAmount,
//     totalTaxAmount: order.totalTaxAmount,
//     deliveryCharges: 0,
//     totalAmount: order.totalAmount,
//     receivedAmount: order.advanceAmount,
//     balance: order.balanceAmount,
//     saleItems: items,
//     paid: order.balanceAmount <= 0,
//     overdue: new Date(order.dueDate) < new Date(),
//   };
// };

// const SalesHistory = () => {
//   const navigate = useNavigate();

//   const [userData, setUserData] = useState(
//     JSON.parse(localStorage.getItem("eBilling") || "{}")
//   );

//   const token = userData?.accessToken;
//   const companyId = userData?.selectedCompany?.id;

//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [converting, setConverting] = useState(false);

//   // Sync userData
//   useEffect(() => {
//     const handleStorageChange = () => {
//       const updated = JSON.parse(localStorage.getItem("eBilling") || "{}");
//       setUserData(updated);
//     };

//     window.addEventListener("storage", handleStorageChange);
//     return () => window.removeEventListener("storage", handleStorageChange);
//   }, []);

//   // Fetch orders + auth check
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

//     const fetchOrders = async () => {
//       setLoading(true);
//       try {
//         const res = await api.get(`/company/${companyId}/sale-order/list/according`);
//         setOrders(res.data || []);
//       } catch (err) {
//         toast.error(err.response?.data?.message || "Failed to load sale orders");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrders();
//   }, [token, companyId, navigate]);

//   const deleteOrder = async (saleOrderId) => {
//     if (!window.confirm("Are you sure you want to delete this sale order? This action cannot be undone.")) {
//       return;
//     }

//     try {
//       setLoading(true);
//       await api.delete(`/sale-order/${saleOrderId}`);
//       setOrders((prev) => prev.filter((o) => o.saleOrderId !== saleOrderId));
//       setSelectedOrder(null);
//       toast.success("Sale order deleted successfully");
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to delete sale order");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (saleOrderId) => {
//     navigate(`/create-sale-order?edit=${saleOrderId}`);
//     setSelectedOrder(null);
//   };

//   const handleConvert = async (saleOrderId) => {
//     if (converting) return;

//     if (!window.confirm("Convert this sale order to a sale invoice? This action cannot be undone.")) {
//       return;
//     }

//     setConverting(true);

//     try {
//       const res = await api.get(`/sale-order/${saleOrderId}`);
//       const order = res.data;

//       const payload = mapSaleOrderToSalePayload(order);

//       await api.post(`/sale-order/${saleOrderId}/convert/to/sale`, payload);

//       toast.success("Sale order converted to Sale Invoice successfully!");
//       fetchOrders(); // Refresh list
//       setSelectedOrder(null);
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to convert to sale");
//     } finally {
//       setConverting(false);
//     }
//   };

//   const filteredOrders = orders.filter((o) => {
//     const matchesSearch =
//       o.orderNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       o.partyResponseDto?.name?.toLowerCase().includes(searchTerm.toLowerCase());
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
//             <h1 className={styles["company-form-title"]}>Sales Order History</h1>
//             <p className={styles["form-subtitle"]}>View and manage all sale orders</p>
//           </div>
//         </div>
//         <button
//           onClick={() => navigate("/create-sale-order")}
//           className={styles["submit-button"]}
//           disabled={loading}
//         >
//           <Plus size={18} />
//           <span>New Order</span>
//         </button>
//       </div>

//       {/* SEARCH BAR */}
//       <div className={styles["search-container"]}>
//         <Search size={18} className={styles["search-icon"]} />
//         <input
//           type="text"
//           placeholder="Search by order # or party name..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className={styles["search-input"]}
//         />
//       </div>

//       {/* LOADING */}
//       {loading && !converting && (
//         <div className={styles["loading-message"]}>
//           <Loader size={32} className={styles["spinner"]} />
//           <p>Loading orders...</p>
//         </div>
//       )}

//       {/* TABLE / CARDS */}
//       {filteredOrders.length > 0 ? (
//         <>
//           {/* Desktop Table */}
//           <div className={styles["table-wrapper"]}>
//             <table className={styles.table}>
//               <thead>
//                 <tr>
//                   <th>Order #</th>
//                   <th>Order Date</th>
//                   <th>Party</th>
//                   <th>Phone</th>
//                   <th>Total Qty</th>
//                   <th>Total</th>
//                   <th>Advance</th>
//                   <th>Balance</th>
//                   <th>Status</th>
//                   <th>Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredOrders.map((order) => (
//                   <tr key={order.saleOrderId} className={styles["table-row"]}>
//                     <td className={styles["invoice-cell"]}>
//                       <span className={styles["invoice-badge"]}>{order.orderNo}</span>
//                     </td>
//                     <td>{new Date(order.orderDate).toLocaleDateString()}</td>
//                     <td>
//                       <span className={styles["party-name"]}>{order.partyResponseDto?.name || "—"}</span>
//                     </td>
//                     <td>{order.phoneNo || "—"}</td>
//                     <td>{order.totalQuantity}</td>
//                     <td className={styles["amount-cell"]}>
//                       <span className={styles["amount"]}>
//                         ₹{Number.parseFloat(order.totalAmount || 0).toFixed(2)}
//                       </span>
//                     </td>
//                     <td className={styles["received-cell"]}>
//                       ₹{Number.parseFloat(order.advanceAmount || 0).toFixed(2)}
//                     </td>
//                     <td className={styles["balance-cell"]}>
//                       <span
//                         className={
//                           order.balanceAmount > 0 ? styles["balance-pending"] : styles["balance-paid"]
//                         }
//                       >
//                         ₹{Number.parseFloat(order.balanceAmount || 0).toFixed(2)}
//                       </span>
//                     </td>
//                     <td>
//                       <span
//                         className={`${styles["status-badge"]} ${
//                           order.orderType === "OPEN" ? styles["status-open"] : styles["status-closed"]
//                         }`}
//                       >
//                         {order.orderType}
//                       </span>
//                     </td>
//                     <td className={styles["actions-cell"]}>
//                       <button
//                         onClick={() => setSelectedOrder(order)}
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
//             {filteredOrders.map((order) => (
//               <div key={order.saleOrderId} className={styles["invoice-card"]}>
//                 <div className={styles["card-header-mobile"]}>
//                   <div className={styles["card-title-section"]}>
//                     <h3 className={styles["card-invoice-number"]}>{order.orderNo}</h3>
//                     <span
//                       className={`${styles["status-badge"]} ${
//                         order.orderType === "OPEN" ? styles["status-open"] : styles["status-closed"]
//                       }`}
//                     >
//                       {order.orderType}
//                     </span>
//                   </div>
//                   <button onClick={() => setSelectedOrder(order)} className={styles["card-action-button"]}>
//                     <ChevronDown size={20} />
//                   </button>
//                 </div>

//                 <div className={styles["card-body"]}>
//                   <div className={styles["card-info-row"]}>
//                     <span className={styles["info-label"]}>Party:</span>
//                     <span className={styles["info-value"]}>{order.partyResponseDto?.name || "—"}</span>
//                   </div>
//                   <div className={styles["card-info-row"]}>
//                     <span className={styles["info-label"]}>Date:</span>
//                     <span className={styles["info-value"]}>
//                       {new Date(order.orderDate).toLocaleDateString()}
//                     </span>
//                   </div>
//                   <div className={styles["card-info-row"]}>
//                     <span className={styles["info-label"]}>Total:</span>
//                     <span className={styles["info-value-amount"]}>
//                       ₹{Number.parseFloat(order.totalAmount || 0).toFixed(2)}
//                     </span>
//                   </div>
//                   <div className={styles["card-info-row"]}>
//                     <span className={styles["info-label"]}>Balance:</span>
//                     <span
//                       className={
//                         order.balanceAmount > 0 ? styles["info-value-pending"] : styles["info-value-paid"]
//                       }
//                     >
//                       ₹{Number.parseFloat(order.balanceAmount || 0).toFixed(2)}
//                     </span>
//                   </div>
//                 </div>

//                 <div className={styles["card-footer"]}>
//                   <button onClick={() => setSelectedOrder(order)} className={styles["card-view-button"]}>
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
//             <p>No sale orders found</p>
//             <p className={styles["no-data-subtitle"]}>
//               {searchTerm
//                 ? "Try adjusting your search"
//                 : 'Click "New Order" to create your first sale order.'}
//             </p>
//           </div>
//         )
//       )}

//       {/* VIEW MODAL */}
//       {selectedOrder && (
//         <div className={styles["modal-overlay"]} onClick={() => setSelectedOrder(null)}>
//           <div className={styles["detail-card"]} onClick={(e) => e.stopPropagation()}>
//             <div className={styles["card-header"]}>
//               <div className={styles["header-title-section"]}>
//                 <h3>Sale Order #{selectedOrder.orderNo}</h3>
//                 <div
//                   className={`${styles["balance-badge"]} ${
//                     selectedOrder.balanceAmount <= 0 ? styles.paid : ""
//                   }`}
//                 >
//                   {selectedOrder.balanceAmount > 0 ? (
//                     <>
//                       <AlertCircle size={16} />
//                       Balance: ₹{Number.parseFloat(selectedOrder.balanceAmount || 0).toFixed(2)}
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
//                 {selectedOrder.orderType !== "CLOSE" && (
//                   <>
//                     <button
//                       onClick={() => handleEdit(selectedOrder.saleOrderId)}
//                       className={`${styles["action-button"]} ${styles["edit-button"]}`}
//                       title="Edit"
//                     >
//                       <Edit2 size={16} />
//                       <span>Edit</span>
//                     </button>

//                     <button
//                       onClick={() => handleConvert(selectedOrder.saleOrderId)}
//                       className={`${styles["action-button"]} ${styles["convert-button"]}`}
//                       title="Convert to Sale"
//                       disabled={converting}
//                     >
//                       {converting ? (
//                         <Loader size={16} className={styles.spinner} />
//                       ) : (
//                         <Package size={16} />
//                       )}
//                       <span>{converting ? "Converting…" : "Convert to Sale"}</span>
//                     </button>
//                   </>
//                 )}

//                 <button
//                   onClick={() => deleteOrder(selectedOrder.saleOrderId)}
//                   className={`${styles["action-button"]} ${styles["delete-button"]}`}
//                   title="Delete"
//                 >
//                   <Trash2 size={16} />
//                   <span>Delete</span>
//                 </button>

//                 <button
//                   className={styles["close-modal-btn"]}
//                   onClick={() => setSelectedOrder(null)}
//                   title="Close"
//                 >
//                   <X size={20} />
//                 </button>
//               </div>
//             </div>

//             {/* Order Summary */}
//             <section className={styles["card-section"]}>
//               <h4 className={styles["section-title"]}>Order Summary</h4>
//               <div className={styles["detail-grid"]}>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>Order ID:</span>
//                   <span className={styles["detail-value"]}>{selectedOrder.saleOrderId}</span>
//                 </div>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>Order Date:</span>
//                   <span className={styles["detail-value"]}>
//                     {new Date(selectedOrder.orderDate).toLocaleDateString()}
//                   </span>
//                 </div>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>Due Date:</span>
//                   <span className={styles["detail-value"]}>
//                     {new Date(selectedOrder.dueDate).toLocaleDateString()}
//                   </span>
//                 </div>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>Order Type:</span>
//                   <span className={styles["detail-value"]}>{selectedOrder.orderType}</span>
//                 </div>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>State of Supply:</span>
//                   <span className={styles["detail-value"]}>
//                     {selectedOrder.stateOfSupply?.replace(/_/g, " ")}
//                   </span>
//                 </div>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>Payment Type:</span>
//                   <span className={styles["detail-value"]}>{selectedOrder.paymentType}</span>
//                 </div>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>Description:</span>
//                   <span className={styles["detail-value"]}>{selectedOrder.description || "—"}</span>
//                 </div>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>Total Quantity:</span>
//                   <span className={styles["detail-value"]}>{selectedOrder.totalQuantity}</span>
//                 </div>
//               </div>

//               <div className={styles["amount-breakdown"]}>
//                 <div className={styles["breakdown-row"]}>
//                   <span>Total (ex-tax):</span>
//                   <span>₹{Number.parseFloat(selectedOrder.totalAmount - selectedOrder.totalTaxAmount || 0).toFixed(2)}</span>
//                 </div>
//                 <div className={styles["breakdown-row"]}>
//                   <span>Tax Amount:</span>
//                   <span>₹{Number.parseFloat(selectedOrder.totalTaxAmount || 0).toFixed(2)}</span>
//                 </div>
//                 <div className={styles["breakdown-row"]}>
//                   <span>Total Discount:</span>
//                   <span>₹{Number.parseFloat(selectedOrder.totalDiscountAmount || 0).toFixed(2)}</span>
//                 </div>
//                 <div className={styles["breakdown-row"]}>
//                   <span>Total Amount:</span>
//                   <span className={styles["total-amount"]}>
//                     ₹{Number.parseFloat(selectedOrder.totalAmount || 0).toFixed(2)}
//                   </span>
//                 </div>
//                 <div className={styles["breakdown-row"]}>
//                   <span>Advance Paid:</span>
//                   <span>₹{Number.parseFloat(selectedOrder.advanceAmount || 0).toFixed(2)}</span>
//                 </div>
//                 <div
//                   className={`${styles["breakdown-row"]} ${
//                     selectedOrder.balanceAmount > 0 ? styles["balance-row-pending"] : styles["balance-row-paid"]
//                   }`}
//                 >
//                   <span>Balance Due:</span>
//                   <span className={styles["balance-amount"]}>
//                     ₹{Number.parseFloat(selectedOrder.balanceAmount || 0).toFixed(2)}
//                   </span>
//                 </div>
//               </div>
//             </section>

//             {/* Party Details */}
//             {selectedOrder.partyResponseDto && (
//               <section className={styles["card-section"]}>
//                 <h4 className={styles["section-title"]}>Party Details</h4>
//                 <div className={styles["detail-grid"]}>
//                   <div className={styles["detail-item"]}>
//                     <span className={styles["detail-label"]}>Name:</span>
//                     <span className={styles["detail-value"]}>{selectedOrder.partyResponseDto.name}</span>
//                   </div>
//                   <div className={styles["detail-item"]}>
//                     <span className={styles["detail-label"]}>Party ID:</span>
//                     <span className={styles["detail-value"]}>{selectedOrder.partyResponseDto.partyId}</span>
//                   </div>
//                   <div className={styles["detail-item"]}>
//                     <span className={styles["detail-label"]}>GSTIN:</span>
//                     <span className={styles["detail-value"]}>{selectedOrder.partyResponseDto.gstin || "—"}</span>
//                   </div>
//                   <div className={styles["detail-item"]}>
//                     <span className={styles["detail-label"]}>GST Type:</span>
//                     <span className={styles["detail-value"]}>
//                       {selectedOrder.partyResponseDto.gstType?.replace(/_/g, " ")}
//                     </span>
//                   </div>
//                   <div className={styles["detail-item"]}>
//                     <span className={styles["detail-label"]}>Phone:</span>
//                     <span className={styles["detail-value"]}>{selectedOrder.partyResponseDto.phoneNo || "—"}</span>
//                   </div>
//                   <div className={styles["detail-item"]}>
//                     <span className={styles["detail-label"]}>Email:</span>
//                     <span className={styles["detail-value"]}>{selectedOrder.partyResponseDto.emailId || "—"}</span>
//                   </div>
//                   <div className={styles["detail-item"]}>
//                     <span className={styles["detail-label"]}>State:</span>
//                     <span className={styles["detail-value"]}>
//                       {selectedOrder.partyResponseDto.state?.replace(/_/g, " ")}
//                     </span>
//                   </div>
//                   <div className={styles["detail-item"]}>
//                     <span className={styles["detail-label"]}>Billing Address:</span>
//                     <span className={styles["detail-value"]}>
//                       {selectedOrder.partyResponseDto.billingAddress || "—"}
//                     </span>
//                   </div>
//                   <div className={styles["detail-item"]}>
//                     <span className={styles["detail-label"]}>Shipping Address:</span>
//                     <span className={styles["detail-value"]}>
//                       {selectedOrder.partyResponseDto.shipingAddress || "—"}
//                     </span>
//                   </div>
//                 </div>
//               </section>
//             )}

//             {/* Items */}
//             <section className={styles["card-section"]}>
//               <h4 className={styles["section-title"]}>Items</h4>
//               {selectedOrder.saleOrderItemResponses?.length > 0 ? (
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
//                       {selectedOrder.saleOrderItemResponses.map((item, i) => (
//                         <tr key={i}>
//                           <td>{item.name}</td>
//                           <td>{item.quantity}</td>
//                           <td>{item.unit}</td>
//                           <td>₹{Number.parseFloat(item.pricePerRate || 0).toFixed(2)}</td>
//                           <td>{item.taxType}</td>
//                           <td>{item.taxRate}</td>
//                           <td>₹{Number.parseFloat(item.discountAmount || 0).toFixed(2)}</td>
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

// export default SalesHistory;









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
  Trash2,
  X,
  Package,
  Printer,
  AlertCircle,
  CheckCircle,
  ChevronDown,
  Search,
  Loader,
} from "lucide-react";

// Helper: Convert Sale Order to Sale Creation Payload (fixed version)
const mapSaleOrderToSalePayload = (order) => {
  // Map items with real itemId (critical fix)
  const saleItems = (order.saleOrderItemResponses || []).map((item) => {
    // IMPORTANT: Adjust these field names based on your actual API response
    // Common variations: itemId, item_id, id, productId, stockItemId, etc.
    const itemId = item.itemId || item.id || item.productId || null;

    return {
      itemId: itemId ? Number(itemId) : null, // MUST be real ID or null
      itemName: item.name || item.itemName || "",
      itemHsnCode: item.hsnCode || item.itemHsn || item.hsn || "",
      itemDescription: item.description || "",
      quantity: Number(item.quantity) || 1,
      unit: item.unit || "PCS",
      pricePerUnit: Number(item.pricePerRate || item.rate || item.price || 0),
      pricePerUnitTaxType: item.taxType || item.pricePerUnitTaxType || "WITHTAX",
      taxRate: item.taxRate || "NONE",
      taxAmount: Number(item.totalTaxAmount || item.taxAmount || 0),
      totalAmount: Number(item.totalAmount || 0),
    };
  });

  return {
    partyId: order.partyResponseDto?.partyId
      ? Number(order.partyResponseDto.partyId)
      : null,

    billingAddress: order.partyResponseDto?.billingAddress || "",
    shippingAddress: order.partyResponseDto?.shipingAddress
      || order.partyResponseDto?.shippingAddress
      || order.partyResponseDto?.shipping || "",

    invoiceNumber: `${order.orderNo || "SO"}-INV`, // You can improve this later
    invoceDate: order.orderDate
      ? new Date(order.orderDate).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    dueDate: order.dueDate
      ? new Date(order.dueDate).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],

    saleType: order.paymentType === "CASH" ? "CASH" : "CREDIT",
    stateOfSupply: order.stateOfSupply || "MAHARASHTRA",
    paymentType: order.paymentType || "CASH",
    paymentDescription: order.description || order.paymentDescription || "",

    totalAmountWithoutTax: Number((order.totalAmount || 0) - (order.totalTaxAmount || 0)),
    totalTaxAmount: Number(order.totalTaxAmount || 0),
    deliveryCharges: 0, // Can be adjusted if sale order has delivery charges
    totalAmount: Number(order.totalAmount || 0),
    receivedAmount: Number(order.advanceAmount || 0),
    balance: Number(order.balanceAmount || 0),

    saleItems,
    overdue: order.dueDate && new Date(order.dueDate) < new Date(),
    paid: Number(order.balanceAmount || 0) <= 0,
  };
};

const SalesHistory = () => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("eBilling") || "{}")
  );

  const token = userData?.accessToken;
  const companyId = userData?.selectedCompany?.id;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [converting, setConverting] = useState(false);

  // Sync userData from localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const updated = JSON.parse(localStorage.getItem("eBilling") || "{}");
      setUserData(updated);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Fetch orders + auth check
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

    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/company/${companyId}/sale-order/list/according`);
        setOrders(res.data || []);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load sale orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token, companyId, navigate]);

  const deleteOrder = async (saleOrderId) => {
    if (!window.confirm("Are you sure you want to delete this sale order? This action cannot be undone.")) {
      return;
    }

    try {
      setLoading(true);
      await api.delete(`/sale-order/${saleOrderId}`);
      setOrders((prev) => prev.filter((o) => o.saleOrderId !== saleOrderId));
      setSelectedOrder(null);
      toast.success("Sale order deleted successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete sale order");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (saleOrderId) => {
    navigate(`/create-sale-order?edit=${saleOrderId}`);
    setSelectedOrder(null);
  };

  const handleConvert = async (saleOrderId) => {
    if (converting) return;

    if (!window.confirm("Convert this sale order to a sale invoice? This action cannot be undone.")) {
      return;
    }

    setConverting(true);

    try {
      // Get full order details
      const res = await api.get(`/sale-order/${saleOrderId}`);
      const order = res.data;

      // Debug: Check what we're actually getting from backend
      console.log("[DEBUG] Full Sale Order:", order);

      const payload = mapSaleOrderToSalePayload(order);

      console.log("[DEBUG] Conversion Payload:", payload);
      console.log("[DEBUG] Sale Items:", payload.saleItems);

      // Basic validation before sending
      if (!payload.partyId) {
        throw new Error("Party ID is missing - cannot convert");
      }

      const itemsWithoutId = payload.saleItems.filter(item => !item.itemId);
      if (itemsWithoutId.length > 0) {
        console.warn("[WARNING] Items missing itemId:", itemsWithoutId);
        toast.warn(`${itemsWithoutId.length} item(s) missing product ID`);
      }

      await api.post(`/sale-order/${saleOrderId}/convert/to/sale`, payload);

      toast.success("Sale order converted to Sale Invoice successfully!");

      // Refresh the list
      const updatedRes = await api.get(`/company/${companyId}/sale-order/list/according`);
      setOrders(updatedRes.data || []);

      setSelectedOrder(null);
    } catch (err) {
      console.error("[ERROR] Conversion failed:", err);
      const errorMsg = err.response?.data?.message
        || err.message
        || "Failed to convert sale order to sale";
      toast.error(errorMsg);
    } finally {
      setConverting(false);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.partyResponseDto?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });
  const handlePrint = (order) => {
    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      toast.error("Please allow popups for printing");
      return;
    }

    // Format dates safely
    const orderDate = order.orderDate
      ? new Date(order.orderDate).toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric'
      })
      : "—";

    const dueDate = order.dueDate
      ? new Date(order.dueDate).toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric'
      })
      : "—";

    // Basic HTML escape helper
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
        <title>Sale Order ${order.orderNo || '—'}</title>
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
          .info-box p {
            margin: 4px 0;
            font-size: 9.5pt;
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
            <h1>SALE ORDER</h1>
            <p><strong>Order No:</strong> ${escapeHtml(order.orderNo || '—')} 
               | <strong>Date:</strong> ${orderDate} 
               | <strong>Due Date:</strong> ${dueDate}</p>
            <p><strong>Status:</strong> ${order.orderType || 'OPEN'}</p>
          </div>
  
          <div class="info-section">
            <div class="info-box">
              <h3>From:</h3>
              <p><strong>${escapeHtml(userData?.selectedCompany?.name || 'Your Company')}</strong></p>
              <p>${escapeHtml(userData?.selectedCompany?.billingAddress || '—')}</p>
              <p><strong>GSTIN:</strong> ${escapeHtml(userData?.selectedCompany?.gstin || '—')}</p>
              <p><strong>Phone:</strong> ${escapeHtml(userData?.selectedCompany?.phoneNo || '—')}</p>
            </div>
            <div class="info-box">
              <h3>Bill To:</h3>
              <p><strong>${escapeHtml(order.partyResponseDto?.name || '—')}</strong></p>
              <p>${escapeHtml(order.partyResponseDto?.billingAddress || '—')}</p>
              <p><strong>GSTIN:</strong> ${escapeHtml(order.partyResponseDto?.gstin || '—')}</p>
              <p><strong>Phone:</strong> ${escapeHtml(order.partyResponseDto?.phoneNo || '—')}</p>
            </div>
          </div>
  
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Item</th>
                <th>Qty</th>
                <th>Unit</th>
                <th>Rate (₹)</th>
                <th>Tax (%)</th>
                <th>Tax Amt (₹)</th>
                <th>Discount (₹)</th>
                <th>Total (₹)</th>
              </tr>
            </thead>
            <tbody>
              ${(order.saleOrderItemResponses || []).map((item, i) => `
                <tr>
                  <td>${i + 1}</td>
                  <td>${escapeHtml(item.name || item.itemName || '—')}<br>
                      <small>${escapeHtml(item.description || '')}</small></td>
                  <td class="text-right">${item.quantity || '—'}</td>
                  <td>${escapeHtml(item.unit || 'PCS')}</td>
                  <td class="text-right">${Number(item.pricePerRate || item.rate || 0).toFixed(2)}</td>
                  <td class="text-right">${item.taxRate || '—'}</td>
                  <td class="text-right">${Number(item.totalTaxAmount || 0).toFixed(2)}</td>
                  <td class="text-right">${Number(item.discountAmount || 0).toFixed(2)}</td>
                  <td class="text-right">${Number(item.totalAmount || 0).toFixed(2)}</td>
                </tr>
              `).join('') || '<tr><td colspan="9" class="text-center">No items found</td></tr>'}
            </tbody>
          </table>
  
          <div class="total-section">
            <div class="total-box">
              <div class="total-row">
                <span>Subtotal (ex-tax):</span>
                <span>₹${Number((order.totalAmount || 0) - (order.totalTaxAmount || 0)).toFixed(2)}</span>
              </div>
              <div class="total-row">
                <span>Total Tax:</span>
                <span>₹${Number(order.totalTaxAmount || 0).toFixed(2)}</span>
              </div>
              <div class="total-row">
                <span>Total Discount:</span>
                <span>₹${Number(order.totalDiscountAmount || 0).toFixed(2)}</span>
              </div>
              <div class="total-row">
                <span>Grand Total:</span>
                <span>₹${Number(order.totalAmount || 0).toFixed(2)}</span>
              </div>
              <div class="total-row">
                <span>Advance Paid:</span>
                <span>₹${Number(order.advanceAmount || 0).toFixed(2)}</span>
              </div>
              <div class="total-row">
                <span>Balance Due:</span>
                <span>₹${Number(order.balanceAmount || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>
  
          <div class="footer">
            <p>Thank you for your business | This is a computer-generated document</p>
            <p>Terms: Payment due by ${dueDate}. Goods once sold will not be taken back.</p>
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
            <h1 className={styles["company-form-title"]}>Sales Order History</h1>
            <p className={styles["form-subtitle"]}>View and manage all sale orders</p>
          </div>
        </div>
        <button
          onClick={() => navigate("/create-sale-order")}
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
                {filteredOrders.map((order) => (
                  <tr key={order.saleOrderId} className={styles["table-row"]}>
                    <td className={styles["invoice-cell"]}>
                      <span className={styles["invoice-badge"]}>{order.orderNo}</span>
                    </td>
                    <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                    <td>
                      <span className={styles["party-name"]}>{order.partyResponseDto?.name || "—"}</span>
                    </td>
                    <td>{order.phoneNo || "—"}</td>
                    <td>{order.totalQuantity}</td>
                    <td className={styles["amount-cell"]}>
                      <span className={styles["amount"]}>
                        ₹{Number(order.totalAmount || 0).toFixed(2)}
                      </span>
                    </td>
                    <td className={styles["received-cell"]}>
                      ₹{Number(order.advanceAmount || 0).toFixed(2)}
                    </td>
                    <td className={styles["balance-cell"]}>
                      <span
                        className={
                          order.balanceAmount > 0 ? styles["balance-pending"] : styles["balance-paid"]
                        }
                      >
                        ₹{Number(order.balanceAmount || 0).toFixed(2)}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`${styles["status-badge"]} ${order.orderType === "OPEN" ? styles["status-open"] : styles["status-closed"]
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
              <div key={order.saleOrderId} className={styles["invoice-card"]}>
                <div className={styles["card-header-mobile"]}>
                  <div className={styles["card-title-section"]}>
                    <h3 className={styles["card-invoice-number"]}>{order.orderNo}</h3>
                    <span
                      className={`${styles["status-badge"]} ${order.orderType === "OPEN" ? styles["status-open"] : styles["status-closed"]
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
                      {new Date(order.orderDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className={styles["card-info-row"]}>
                    <span className={styles["info-label"]}>Total:</span>
                    <span className={styles["info-value-amount"]}>
                      ₹{Number(order.totalAmount || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className={styles["card-info-row"]}>
                    <span className={styles["info-label"]}>Balance:</span>
                    <span
                      className={
                        order.balanceAmount > 0 ? styles["info-value-pending"] : styles["info-value-paid"]
                      }
                    >
                      ₹{Number(order.balanceAmount || 0).toFixed(2)}
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
            <p>No sale orders found</p>
            <p className={styles["no-data-subtitle"]}>
              {searchTerm
                ? "Try adjusting your search"
                : 'Click "New Order" to create your first sale order.'}
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
                <h3>Sale Order #{selectedOrder.orderNo}</h3>
                <div
                  className={`${styles["balance-badge"]} ${selectedOrder.balanceAmount <= 0 ? styles.paid : ""
                    }`}
                >
                  {selectedOrder.balanceAmount > 0 ? (
                    <>
                      <AlertCircle size={16} />
                      Balance: ₹{Number(selectedOrder.balanceAmount || 0).toFixed(2)}
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
                {selectedOrder.orderType !== "CLOSE" && (
                  <>
                    <button
                      onClick={() => handleEdit(selectedOrder.saleOrderId)}
                      className={`${styles["action-button"]} ${styles["edit-button"]}`}
                      title="Edit"
                    >
                      <Edit2 size={16} />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => handleConvert(selectedOrder.saleOrderId)}
                      className={`${styles["action-button"]} ${styles["convert-button"]}`}
                      title="Convert to Sale"
                      disabled={converting || loading}
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
                  onClick={() => handlePrint(selectedOrder)}
                  className={`${styles["action-button"]} ${styles["print-button"]}`}
                  title="Print Sale Order"
                >
                  <Printer size={16} />
                  <span>Print</span>
                </button>

                <button
                  onClick={() => deleteOrder(selectedOrder.saleOrderId)}
                  className={`${styles["action-button"]} ${styles["delete-button"]}`}
                  title="Delete"
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
                  <span className={styles["detail-value"]}>{selectedOrder.saleOrderId}</span>
                </div>
                <div className={styles["detail-item"]}>
                  <span className={styles["detail-label"]}>Order Date:</span>
                  <span className={styles["detail-value"]}>
                    {new Date(selectedOrder.orderDate).toLocaleDateString()}
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
                  <span>₹{Number((selectedOrder.totalAmount || 0) - (selectedOrder.totalTaxAmount || 0)).toFixed(2)}</span>
                </div>
                <div className={styles["breakdown-row"]}>
                  <span>Tax Amount:</span>
                  <span>₹{Number(selectedOrder.totalTaxAmount || 0).toFixed(2)}</span>
                </div>
                <div className={styles["breakdown-row"]}>
                  <span>Total Discount:</span>
                  <span>₹{Number(selectedOrder.totalDiscountAmount || 0).toFixed(2)}</span>
                </div>
                <div className={styles["breakdown-row"]}>
                  <span>Total Amount:</span>
                  <span className={styles["total-amount"]}>
                    ₹{Number(selectedOrder.totalAmount || 0).toFixed(2)}
                  </span>
                </div>
                <div className={styles["breakdown-row"]}>
                  <span>Advance Paid:</span>
                  <span>₹{Number(selectedOrder.advanceAmount || 0).toFixed(2)}</span>
                </div>
                <div
                  className={`${styles["breakdown-row"]} ${selectedOrder.balanceAmount > 0 ? styles["balance-row-pending"] : styles["balance-row-paid"]
                    }`}
                >
                  <span>Balance Due:</span>
                  <span className={styles["balance-amount"]}>
                    ₹{Number(selectedOrder.balanceAmount || 0).toFixed(2)}
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
              {selectedOrder.saleOrderItemResponses?.length > 0 ? (
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
                      {selectedOrder.saleOrderItemResponses.map((item, i) => (
                        <tr key={i}>
                          <td>{item.name}</td>
                          <td>{item.quantity}</td>
                          <td>{item.unit}</td>
                          <td>₹{Number(item.pricePerRate || item.rate || 0).toFixed(2)}</td>
                          <td>{item.taxType}</td>
                          <td>{item.taxRate}</td>
                          <td>₹{Number(item.discountAmount || 0).toFixed(2)}</td>
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

export default SalesHistory;