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








"use client";

import { useEffect, useState } from "react";
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

// Helper: Map Sale Order to Sale Payload
const mapSaleOrderToSalePayload = (order) => {
  const items = order.saleOrderItemResponses?.map((it) => ({
    itemName: it.name,
    itemHsnCode: "", // Add HSN if available
    itemDescription: "",
    quantity: it.quantity,
    unit: it.unit,
    pricePerUnit: it.pricePerRate,
    pricePerUnitTaxType: it.taxType,
    taxRate: it.taxRate,
    taxAmount: it.totalTaxAmount,
    totalAmount: it.totalAmount,
  })) ?? [];

  return {
    partyId: order.partyResponseDto?.partyId,
    billingAddress: order.partyResponseDto?.billingAddress || "",
    shippingAddress: order.partyResponseDto?.shipingAddress || "",
    invoiceNumber: `${order.orderNo}-INV`,
    invoiceDate: order.orderDate, // Fixed: was `invoceDate`
    dueDate: order.dueDate,
    saleType: order.paymentType === "CASH" ? "CASH" : "CREDIT",
    stateOfSupply: order.stateOfSupply,
    paymentType: order.paymentType,
    paymentDescription: order.description || "",
    totalAmountWithoutTax: order.totalAmount - order.totalTaxAmount,
    totalTaxAmount: order.totalTaxAmount,
    deliveryCharges: 0,
    totalAmount: order.totalAmount,
    receivedAmount: order.advanceAmount,
    balance: order.balanceAmount,
    saleItems: items,
    paid: order.balanceAmount <= 0,
    overdue: new Date(order.dueDate) < new Date(),
  };
};

const SalesHistory = () => {
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("eBilling") || "{}");
  const token = userData?.accessToken || "";
  const companyId = userData?.selectedCompany?.id || "";

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [converting, setConverting] = useState(false);

  const fetchOrders = async () => {
    if (!token || !companyId) {
      toast.error("Session expired or no company selected.");
      return;
    }

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
      toast.error(err.response?.data?.message || "Failed to load sale orders");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token, companyId]);

  const deleteOrder = async (saleOrderId) => {
    if (!window.confirm("Are you sure you want to delete this sale order? This action cannot be undone.")) {
      return;
    }

    try {
      setLoading(true);
      await axios.delete(`${config.BASE_URL}/sale-order/${saleOrderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

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
      const res = await axios.get(`${config.BASE_URL}/sale-order/${saleOrderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const order = res.data;

      const payload = mapSaleOrderToSalePayload(order);

      const convertRes = await axios.post(
        `${config.BASE_URL}/sale-order/${saleOrderId}/convert/to/sale`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Sale order converted to Sale Invoice successfully!");

      if (convertRes.data?.saleId) {
        // navigate(`/sales/${convertRes.data.saleId}`);
      } else {
        fetchOrders();
      }
      setSelectedOrder(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to convert to sale");
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
              <div key={order.saleOrderId} className={styles["invoice-card"]}>
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
                      {new Date(order.orderDate).toLocaleDateString()}
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
                  className={`${styles["balance-badge"]} ${
                    selectedOrder.balanceAmount <= 0 ? styles.paid : ""
                  }`}
                >
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
                  <span>₹{Number.parseFloat(selectedOrder.totalAmount - selectedOrder.totalTaxAmount || 0).toFixed(2)}</span>
                </div>
                <div className={styles["breakdown-row"]}>
                  <span>Tax Amount:</span>
                  <span>₹{Number.parseFloat(selectedOrder.totalTaxAmount || 0).toFixed(2)}</span>
                </div>
                <div className={styles["breakdown-row"]}>
                  <span>Total Discount:</span>
                  <span>₹{Number.parseFloat(selectedOrder.totalDiscountAmount || 0).toFixed(2)}</span>
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
                          <td>₹{Number.parseFloat(item.pricePerRate || 0).toFixed(2)}</td>
                          <td>{item.taxType}</td>
                          <td>{item.taxRate}</td>
                          <td>₹{Number.parseFloat(item.discountAmount || 0).toFixed(2)}</td>
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

export default SalesHistory;