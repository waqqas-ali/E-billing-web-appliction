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
//   Printer,
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
//                   onClick={() => window.print()}
//                   className={`${styles["action-button"]} ${styles["print-button"] || styles["edit-button"]}`}
//                   title="Print invoice"
//                 >
//                   <Printer size={16} />
//                   <span>Print</span>
//                 </button>

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
//                 <div className={styles["breakdown-row"]}>
//                   <span>Total Amount:</span>
//                   <span className={styles["total-amount"]}>₹{selectedSale.totalAmount}</span>
//                 </div>
//                 <div className={styles["breakdown-row"]}>
//                   <span>Received:</span>
//                   <span>₹{selectedSale.receivedAmount}</span>
//                 </div>
//                 <div
//                   className={`${styles["breakdown-row"]} ${selectedSale.balance > 0 ? styles["balance-row-pending"] : styles["balance-row-paid"]
//                     }`}
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
//                   <small className={styles["balance-info"]}>💰 Remaining Balance: ₹{remainingBalance.toFixed(2)}</small>
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
//   Printer,
// } from "lucide-react"

// const SalesList = () => {
//   const navigate = useNavigate()
//   const userData = JSON.parse(localStorage.getItem("eBilling") || "{}")
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

//   const handlePrint = (sale) => {
//     const printWindow = window.open("", "_blank");
//     printWindow.document.write(`
//       <!DOCTYPE html>
//       <html lang="en">
//       <head>
//         <meta charset="UTF-8" />
//         <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
//         <title>Invoice ${sale.invoiceNumber}</title>
//         <style>
//           body {
//             font-family: 'Segoe UI', Arial, sans-serif;
//             margin: 0;
//             padding: 30px;
//             background: white;
//             color: #333;
//             line-height: 1.5;
//           }
//           .container { max-width: 800px; margin: 0 auto; }
//           .header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 3px solid #2563eb; }
//           .header h1 { margin: 0; color: #2563eb; font-size: 28px; }
//           .header p { margin: 5px 0; color: #555; }
//           .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 30px 0; }
//           .info-box h3 { margin: 0 0 10px 0; color: #1e40af; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
//           .info-box p { margin: 6px 0; font-size: 14px; }
//           .info-box strong { color: #333; }
//           table {
//             width: 100%;
//             border-collapse: collapse;
//             margin: 30px 0;
//             font-size: 14px;
//           }
//           th, td {
//             border: 1px solid #ddd;
//             padding: 12px;
//             text-align: left;
//           }
//           th {
//             background-color: #f8fafc;
//             color: #1e40af;
//             font-weight: 600;
//           }
//           tr:nth-child(even) { background-color: #f9f9f9; }
//           .text-right { text-align: right; }
//           .total-row { font-weight: bold; background-color: #f0f7ff !important; }
//           .amount-summary {
//             float: right;
//             width: 40%;
//             border: 1px solid #ddd;
//             border-radius: 8px;
//             overflow: hidden;
//             margin-top: 30px;
//           }
//           .amount-row {
//             display: flex;
//             justify-content: space-between;
//             padding: 10px 15px;
//           }
//           .amount-row.total {
//             background-color: #2563eb;
//             color: white;
//             font-size: 18px;
//             font-weight: bold;
//           }
//           .footer {
//             margin-top: 60px;
//             text-align: center;
//             color: #666;
//             font-size: 12px;
//             border-top: 1px solid #eee;
//             padding-top: 20px;
//           }
//           @media print {
//             body { padding: 10px; }
//             .no-print { display: none; }
//           }
//         </style>
//       </head>
//       <body>
//         <div class="container">
//           <div class="header">
//             <h1>Tax Invoice</h1>
//             <p><strong>Invoice #${sale.invoiceNumber}</strong> | Date: ${new Date(sale.invoceDate).toLocaleDateString('en-IN')}</p>
//             ${sale.balance > 0 
//               ? '<p style="color:#dc2626; font-weight:bold;">Payment Status: PARTIALLY PAID / PENDING</p>'
//               : '<p style="color:#16a34a; font-weight:bold;">Payment Status: PAID</p>'
//             }
//           </div>
  
//           <div class="info-grid">
//             <div class="info-box">
//               <h3>From</h3>
//               <p><strong>${userData.selectedCompany?.name || 'Your Company'}</strong></p>
//               <p>${userData.selectedCompany?.address || ''}</p>
//               <p>GSTIN: ${userData.selectedCompany?.gstin || '—'}</p>
//               <p>State: ${userData.selectedCompany?.state?.replace(/_/g, ' ') || '—'}</p>
//             </div>
//             <div class="info-box">
//               <h3>Bill To</h3>
//               <p><strong>${sale.partyResponseDto?.name || '—'}</strong></p>
//               <p>${sale.partyResponseDto?.billingAddress || '—'}</p>
//               <p>GSTIN: ${sale.partyResponseDto?.gstin || '—'}</p>
//               <p>State: ${sale.partyResponseDto?.state?.replace(/_/g, ' ') || '—'}</p>
//             </div>
//           </div>
  
//           <table>
//             <thead>
//               <tr>
//                 <th>#</th>
//                 <th>Item Description</th>
//                 <th>HSN</th>
//                 <th>Qty</th>
//                 <th>Unit</th>
//                 <th>Rate</th>
//                 <th>Taxable Amt</th>
//                 <th>Tax</th>
//                 <th>Total</th>
//               </tr>
//             </thead>
//             <tbody>
//               ${sale.saleItemResponses?.map((item, i) => `
//                 <tr>
//                   <td>${i + 1}</td>
//                   <td><strong>${item.itemName}</strong><br><small>${item.itemDescription || ''}</small></td>
//                   <td>${item.itemHsnCode}</td>
//                   <td>${item.quantity}</td>
//                   <td>${item.unit}</td>
//                   <td>₹${parseFloat(item.pricePerUnit).toFixed(2)}</td>
//                   <td>₹${(item.pricePerUnit * item.quantity).toFixed(2)}</td>
//                   <td>${item.pricePerUnitTaxType} @${item.taxRate}% = ₹${parseFloat(item.taxAmount).toFixed(2)}</td>
//                   <td class="text-right"><strong>₹${parseFloat(item.totalAmount).toFixed(2)}</strong></td>
//                 </tr>
//               `).join('')}
//               <tr class="total-row">
//                 <td colspan="8" class="text-right">Total Amount (excl. tax):</td>
//                 <td class="text-right">₹${parseFloat(sale.totalAmountWithoutTax || 0).toFixed(2)}</td>
//               </tr>
//               <tr>
//                 <td colspan="8" class="text-right">Delivery Charges:</td>
//                 <td class="text-right">₹${parseFloat(sale.deliveryCharges || 0).toFixed(2)}</td>
//               </tr>
//               <tr>
//                 <td colspan="8" class="text-right">Tax Amount:</td>
//                 <td class="text-right">₹${parseFloat(sale.totalTaxAmount || 0).toFixed(2)}</td>
//               </tr>
//             </tbody>
//           </table>
  
//           <div class="amount-summary">
//             <div class="amount-row">
//               <span>Subtotal:</span>
//               <span>₹${sale.totalAmount}</span>
//             </div>
//             <div class="amount-row">
//               <span>Amount Received:</span>
//               <span>₹${parseFloat(sale.receivedAmount).toFixed(2)}</span>
//             </div>
//             <div class="amount-row" style="border-top: 1px dashed #ccc; font-weight: bold; background:#fef3c7;">
//               <span>Balance Due:</span>
//               <span style="color: ${sale.balance > 0 ? '#dc2626' : '#16a34a'}">
//                 ₹${parseFloat(sale.balance).toFixed(2)}
//               </span>
//             </div>
//             <div class="amount-row total">
//               <span>FINAL AMOUNT</span>
//               <span>₹${sale.totalAmount}</span>
//             </div>
//           </div>
  
//           <div style="clear: both;"></div>
  
//           <div class="footer">
//             <p>Thank you for your business!</p>
//             <p>This is a computer-generated invoice.</p>
//           </div>
//         </div>
  
//         <script>
//           window.onload = function() { window.print(); window.close(); }
//         </script>
//       </body>
//       </html>
//     `);
//     printWindow.document.close();
//   };

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
//                 {/* <button
//                   onClick={() => window.print()}
//                   className={`${styles["action-button"]} ${styles["print-button"] || styles["edit-button"]}`}
//                   title="Print invoice"
//                 >
//                   <Printer size={16} />
//                   <span>Print</span>
//                 </button> */}
//                 <button
//   onClick={() => handlePrint(selectedSale)}
//   className={`${styles["action-button"]} ${styles["print-button"]}`}
//   title="Print invoice"
// >
//   <Printer size={16} />
//   <span>Print</span>
// </button>

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
//                 <div className={styles["breakdown-row"]}>
//                   <span>Total Amount:</span>
//                   <span className={styles["total-amount"]}>₹{selectedSale.totalAmount}</span>
//                 </div>
//                 <div className={styles["breakdown-row"]}>
//                   <span>Received:</span>
//                   <span>₹{selectedSale.receivedAmount}</span>
//                 </div>
//                 <div
//                   className={`${styles["breakdown-row"]} ${selectedSale.balance > 0 ? styles["balance-row-pending"] : styles["balance-row-paid"]
//                     }`}
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
//   Printer,
// } from "lucide-react"
// const SalesList = () => {
//   const navigate = useNavigate()
//   const userData = JSON.parse(localStorage.getItem("eBilling") || "{}")
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
//   const handlePrint = (sale) => {
//     const printWindow = window.open("", "_blank")
//     printWindow.document.write(`
//       <!DOCTYPE html>
//       <html lang="en">
//       <head>
//         <meta charset="UTF-8" />
//         <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
//         <title>Invoice ${sale.invoiceNumber}</title>
//         <style>
//           @page {
//             size: A4 portrait;
//             margin: 1cm;
//           }
//           body {
//             font-family: 'Arial', sans-serif;
//             margin: 0;
//             padding: 0;
//             color: #000;
//             font-size: 10pt;
//             line-height: 1.2;
//             background: white;
//           }
//           .container {
//             max-width: 19cm;
//             margin: 0 auto;
//             padding: 1cm;
//             box-sizing: border-box;
//             height: 26.7cm; /* A4 height minus margins */
//             display: flex;
//             flex-direction: column;
//             justify-content: space-between;
//           }
//           .header {
//             text-align: center;
//             border-bottom: 2pt solid #000;
//             padding-bottom: 0.5cm;
//             margin-bottom: 0.5cm;
//           }
//           .header h1 {
//             margin: 0;
//             font-size: 16pt;
//             color: #000;
//           }
//           .header p {
//             margin: 2pt 0;
//             font-size: 10pt;
//           }
//           .info-section {
//             display: flex;
//             justify-content: space-between;
//             margin-bottom: 0.5cm;
//           }
//           .info-box {
//             width: 48%;
//           }
//           .info-box h3 {
//             font-size: 12pt;
//             margin: 0 0 4pt 0;
//             border-bottom: 1pt solid #000;
//             padding-bottom: 2pt;
//           }
//           .info-box p {
//             margin: 2pt 0;
//             font-size: 9pt;
//           }
//           table {
//             width: 100%;
//             border-collapse: collapse;
//             margin-bottom: 0.5cm;
//             font-size: 9pt;
//           }
//           th, td {
//             border: 1pt solid #000;
//             padding: 4pt 6pt;
//             text-align: left;
//           }
//           th {
//             background-color: #f0f0f0;
//             font-weight: bold;
//           }
//           .text-right {
//             text-align: right;
//           }
//           .total-section {
//             display: flex;
//             justify-content: flex-end;
//             margin-bottom: 0.5cm;
//           }
//           .total-box {
//             width: 40%;
//             border: 1pt solid #000;
//           }
//           .total-row {
//             display: flex;
//             justify-content: space-between;
//             padding: 4pt 6pt;
//             border-bottom: 1pt solid #ddd;
//           }
//           .total-row:last-child {
//             border-bottom: none;
//             background-color: #f0f0f0;
//             font-weight: bold;
//           }
//           .payment-section {
//             margin-bottom: 0.5cm;
//           }
//           .payment-section h3 {
//             font-size: 12pt;
//             margin: 0 0 4pt 0;
//             border-bottom: 1pt solid #000;
//             padding-bottom: 2pt;
//           }
//           .payment-list {
//             list-style: none;
//             padding: 0;
//             margin: 0;
//             font-size: 9pt;
//           }
//           .payment-item {
//             margin-bottom: 4pt;
//           }
//           .footer {
//             text-align: center;
//             font-size: 8pt;
//             color: #555;
//             border-top: 1pt solid #000;
//             padding-top: 4pt;
//           }
//           @media print {
//             body {
//               print-color-adjust: exact;
//               -webkit-print-color-adjust: exact;
//             }
//             .container {
//               page-break-after: avoid;
//             }
//           }
//         </style>
//       </head>
//       <body>
//         <div class="container">
//           <div class="header">
//             <h1>TAX INVOICE</h1>
//             <p><strong>Invoice No:</strong> ${sale.invoiceNumber} | <strong>Date:</strong> ${new Date(sale.invoceDate).toLocaleDateString('en-IN')} | <strong>Due Date:</strong> ${new Date(sale.dueDate).toLocaleDateString('en-IN')}</p>
//             <p><strong>Status:</strong> ${sale.balance > 0 ? 'Pending (Balance: ₹' + Number.parseFloat(sale.balance).toFixed(2) + ')' : 'Paid'}</p>
//           </div>

//           <div class="info-section">
//             <div class="info-box">
//               <h3>From:</h3>
//               <p><strong>${userData.selectedCompany?.name || 'Your Company Name'}</strong></p>
//               <p>${userData.selectedCompany?.billingAddress || 'Billing Address'}</p>
//               <p><strong>GSTIN:</strong> ${userData.selectedCompany?.gstin || '—'}</p>
//               <p><strong>State:</strong> ${userData.selectedCompany?.state?.replace(/_/g, ' ') || '—'}</p>
//               <p><strong>Phone:</strong> ${userData.selectedCompany?.phoneNo || '—'}</p>
//               <p><strong>Email:</strong> ${userData.selectedCompany?.emailId || '—'}</p>
//             </div>
//             <div class="info-box">
//               <h3>Bill To:</h3>
//               <p><strong>${sale.partyResponseDto?.name || 'Party Name'}</strong></p>
//               <p>${sale.partyResponseDto?.billingAddress || 'Billing Address'}</p>
//               <p><strong>GSTIN:</strong> ${sale.partyResponseDto?.gstin || '—'}</p>
//               <p><strong>State:</strong> ${sale.partyResponseDto?.state?.replace(/_/g, ' ') || '—'}</p>
//               <p><strong>Phone:</strong> ${sale.partyResponseDto?.phoneNo || '—'}</p>
//               <p><strong>Email:</strong> ${sale.partyResponseDto?.emailId || '—'}</p>
//             </div>
//           </div>

//           <table>
//             <thead>
//               <tr>
//                 <th>#</th>
//                 <th>Item</th>
//                 <th>HSN</th>
//                 <th>Qty</th>
//                 <th>Unit</th>
//                 <th>Rate (₹)</th>
//                 <th>Tax (%)</th>
//                 <th>Tax Amt (₹)</th>
//                 <th>Total (₹)</th>
//               </tr>
//             </thead>
//             <tbody>
//               ${sale.saleItemResponses?.map((item, i) => `
//                 <tr>
//                   <td>${i + 1}</td>
//                   <td>${item.itemName}<br><small>${item.itemDescription || ''}</small></td>
//                   <td>${item.itemHsnCode || '—'}</td>
//                   <td>${item.quantity}</td>
//                   <td>${item.unit}</td>
//                   <td class="text-right">${Number.parseFloat(item.pricePerUnit).toFixed(2)}</td>
//                   <td class="text-right">${item.taxRate}</td>
//                   <td class="text-right">${Number.parseFloat(item.taxAmount).toFixed(2)}</td>
//                   <td class="text-right">${Number.parseFloat(item.totalAmount).toFixed(2)}</td>
//                 </tr>
//               `).join('') || '<tr><td colspan="9">No items</td></tr>'}
//             </tbody>
//           </table>

//           <div class="total-section">
//             <div class="total-box">
//               <div class="total-row">
//                 <span>Subtotal (ex-tax):</span>
//                 <span>₹${Number.parseFloat(sale.totalAmountWithoutTax || 0).toFixed(2)}</span>
//               </div>
//               <div class="total-row">
//                 <span>Total Tax:</span>
//                 <span>₹${Number.parseFloat(sale.totalTaxAmount || 0).toFixed(2)}</span>
//               </div>
//               <div class="total-row">
//                 <span>Delivery Charges:</span>
//                 <span>₹${Number.parseFloat(sale.deliveryCharges || 0).toFixed(2)}</span>
//               </div>
//               <div class="total-row">
//                 <span>Grand Total:</span>
//                 <span>₹${Number.parseFloat(sale.totalAmount || 0).toFixed(2)}</span>
//               </div>
//               <div class="total-row">
//                 <span>Received:</span>
//                 <span>₹${Number.parseFloat(sale.receivedAmount || 0).toFixed(2)}</span>
//               </div>
//               <div class="total-row" style="background-color: #f0f0f0; font-weight: bold;">
//                 <span>Balance Due:</span>
//                 <span>₹${Number.parseFloat(sale.balance || 0).toFixed(2)}</span>
//               </div>
//             </div>
//           </div>

//           <div class="payment-section">
//             <h3>Payments Received:</h3>
//             <ul class="payment-list">
//               ${sale.salePaymentResponses?.map((p, i) => `
//                 <li class="payment-item">
//                   <strong>₹${Number.parseFloat(p.amountPaid).toFixed(2)}</strong> on ${new Date(p.paymentDate).toLocaleDateString('en-IN')} via ${p.paymentType}
//                   ${p.referenceNumber ? ' (Ref: ' + p.referenceNumber + ')' : ''}
//                   ${p.paymentDescription ? '<br><small>' + p.paymentDescription + '</small>' : ''}
//                 </li>
//               `).join('') || '<li>No payments recorded</li>'}
//             </ul>
//           </div>

//           <div class="footer">
//             <p>Thank you for your business. This is a computer-generated invoice. No signature required.</p>
//             <p>Terms & Conditions: Payment due by ${new Date(sale.dueDate).toLocaleDateString('en-IN')}. Late payments may incur charges.</p>
//           </div>
//         </div>

//         <script>
//           window.onload = function() { window.print(); window.close(); }
//         </script>
//       </body>
//       </html>
//     `)
//     printWindow.document.close()
//   }
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
//                   onClick={() => handlePrint(selectedSale)}
//                   className={`${styles["action-button"]} ${styles["print-button"]}`}
//                   title="Print invoice"
//                 >
//                   <Printer size={16} />
//                   <span>Print</span>
//                 </button>
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
//                 <div className={styles["breakdown-row"]}>
//                   <span>Total Amount:</span>
//                   <span className={styles["total-amount"]}>₹{selectedSale.totalAmount}</span>
//                 </div>
//                 <div className={styles["breakdown-row"]}>
//                   <span>Received:</span>
//                   <span>₹{selectedSale.receivedAmount}</span>
//                 </div>
//                 <div
//                   className={`${styles["breakdown-row"]} ${selectedSale.balance > 0 ? styles["balance-row-pending"] : styles["balance-row-paid"]
//                     }`}
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









"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/axiosInstance"; // Shared API with token refresh
import { toast } from "react-toastify";
import styles from "../Styles/ScreenUI.module.css";
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
  Printer,
} from "lucide-react";

const SalesList = () => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("eBilling") || "{}")
  );

  const token = userData?.accessToken;
  const companyId = userData?.selectedCompany?.id;

  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedSaleId, setSelectedSaleId] = useState(null);
  const [remainingBalance, setRemainingBalance] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentForm, setPaymentForm] = useState({
    receiptNo: "",
    paymentDate: new Date().toISOString().split("T")[0],
    amountPaid: "",
    paymentType: "CASH",
    referenceNumber: "",
    paymentDescription: "",
  });

  const paymentTypes = [
    "CASH",
    "UPI",
    "CREDIT_CARD",
    "DEBIT_CARD",
    "NET_BANKING",
    "WALLET",
    "CHEQUE",
    "OTHER",
  ];

  // Sync with localStorage changes (logout, company switch, token refresh)
  useEffect(() => {
    const handleStorageChange = () => {
      const updated = JSON.parse(localStorage.getItem("eBilling") || "{}");
      setUserData(updated);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Fetch sales with proper auth checks
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

    const fetchSales = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/company/${companyId}/sales`);
        setSales(res.data || []);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load sales");
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, [token, companyId, navigate]);

  const deleteSale = async (saleId) => {
    if (!window.confirm("Are you sure you want to delete this sale?")) return;

    try {
      await api.delete(`/sale/${saleId}`);
      setSales((prev) => prev.filter((s) => s.saleId !== saleId));
      toast.success("Sale deleted successfully");
      setSelectedSale(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete sale");
    }
  };

  const handleEdit = (saleId) => {
    navigate(`/createsale?edit=${saleId}`);
    setSelectedSale(null);
  };

  const openPaymentModal = (sale) => {
    setSelectedSaleId(sale.saleId);
    setRemainingBalance(Number.parseFloat(sale.balance) || 0);
    setPaymentForm({
      receiptNo: "",
      paymentDate: new Date().toISOString().split("T")[0],
      amountPaid: "",
      paymentType: "CASH",
      referenceNumber: "",
      paymentDescription: "",
    });
    setShowPaymentModal(true);
  };

  const handleAddPayment = async (e) => {
    e.preventDefault();
    if (!selectedSaleId) return;

    const amount = Number.parseFloat(paymentForm.amountPaid);
    if (!paymentForm.paymentDate || !paymentForm.amountPaid || !paymentForm.paymentType) {
      toast.error("Payment Date, Amount, and Type are required");
      return;
    }
    if (isNaN(amount) || amount <= 0) {
      toast.error("Amount must be greater than 0");
      return;
    }
    if (amount > remainingBalance) {
      toast.error(`Payment amount (₹${amount}) exceeds remaining balance (₹${remainingBalance})`);
      return;
    }

    const payload = {
      receiptNo: paymentForm.receiptNo || null,
      paymentDate: paymentForm.paymentDate,
      amountPaid: amount,
      paymentType: paymentForm.paymentType,
      referenceNumber: paymentForm.referenceNumber || null,
      paymentDescription: paymentForm.paymentDescription || null,
    };

    try {
      setLoading(true);
      await api.post(`/sale/${selectedSaleId}/add-payment`, payload);
      toast.success("Payment added successfully!");
      setShowPaymentModal(false);

      // Refresh sales list
      const res = await api.get(`/company/${companyId}/sales`);
      setSales(res.data || []);
      setSelectedSale(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add payment");
    } finally {
      setLoading(false);
    }
  };

  const filteredSales = sales.filter(
    (s) =>
      s.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.partyResponseDto?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePrint = (sale) => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Invoice ${sale.invoiceNumber}</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 1cm;
          }
          body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 0;
            color: #000;
            font-size: 10pt;
            line-height: 1.2;
            background: white;
          }
          .container {
            max-width: 19cm;
            margin: 0 auto;
            padding: 1cm;
            box-sizing: border-box;
            height: 26.7cm;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
          .header {
            text-align: center;
            border-bottom: 2pt solid #000;
            padding-bottom: 0.5cm;
            margin-bottom: 0.5cm;
          }
          .header h1 {
            margin: 0;
            font-size: 16pt;
            color: #000;
          }
          .header p {
            margin: 2pt 0;
            font-size: 10pt;
          }
          .info-section {
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.5cm;
          }
          .info-box {
            width: 48%;
          }
          .info-box h3 {
            font-size: 12pt;
            margin: 0 0 4pt 0;
            border-bottom: 1pt solid #000;
            padding-bottom: 2pt;
          }
          .info-box p {
            margin: 2pt 0;
            font-size: 9pt;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 0.5cm;
            font-size: 9pt;
          }
          th, td {
            border: 1pt solid #000;
            padding: 4pt 6pt;
            text-align: left;
          }
          th {
            background-color: #f0f0f0;
            font-weight: bold;
          }
          .text-right {
            text-align: right;
          }
          .total-section {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 0.5cm;
          }
          .total-box {
            width: 40%;
            border: 1pt solid #000;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            padding: 4pt 6pt;
            border-bottom: 1pt solid #ddd;
          }
          .total-row:last-child {
            border-bottom: none;
            background-color: #f0f0f0;
            font-weight: bold;
          }
          .payment-section {
            margin-bottom: 0.5cm;
          }
          .payment-section h3 {
            font-size: 12pt;
            margin: 0 0 4pt 0;
            border-bottom: 1pt solid #000;
            padding-bottom: 2pt;
          }
          .payment-list {
            list-style: none;
            padding: 0;
            margin: 0;
            font-size: 9pt;
          }
          .payment-item {
            margin-bottom: 4pt;
          }
          .footer {
            text-align: center;
            font-size: 8pt;
            color: #555;
            border-top: 1pt solid #000;
            padding-top: 4pt;
          }
          @media print {
            body {
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
            }
            .container {
              page-break-after: avoid;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>TAX INVOICE</h1>
            <p><strong>Invoice No:</strong> ${sale.invoiceNumber} | <strong>Date:</strong> ${new Date(sale.invoceDate).toLocaleDateString('en-IN')} | <strong>Due Date:</strong> ${new Date(sale.dueDate).toLocaleDateString('en-IN')}</p>
            <p><strong>Status:</strong> ${sale.balance > 0 ? 'Pending (Balance: ₹' + Number.parseFloat(sale.balance).toFixed(2) + ')' : 'Paid'}</p>
          </div>

          <div class="info-section">
            <div class="info-box">
              <h3>From:</h3>
              <p><strong>${userData.selectedCompany?.name || 'Your Company Name'}</strong></p>
              <p>${userData.selectedCompany?.billingAddress || 'Billing Address'}</p>
              <p><strong>GSTIN:</strong> ${userData.selectedCompany?.gstin || '—'}</p>
              <p><strong>State:</strong> ${userData.selectedCompany?.state?.replace(/_/g, ' ') || '—'}</p>
              <p><strong>Phone:</strong> ${userData.selectedCompany?.phoneNo || '—'}</p>
              <p><strong>Email:</strong> ${userData.selectedCompany?.emailId || '—'}</p>
            </div>
            <div class="info-box">
              <h3>Bill To:</h3>
              <p><strong>${sale.partyResponseDto?.name || 'Party Name'}</strong></p>
              <p>${sale.partyResponseDto?.billingAddress || 'Billing Address'}</p>
              <p><strong>GSTIN:</strong> ${sale.partyResponseDto?.gstin || '—'}</p>
              <p><strong>State:</strong> ${sale.partyResponseDto?.state?.replace(/_/g, ' ') || '—'}</p>
              <p><strong>Phone:</strong> ${sale.partyResponseDto?.phoneNo || '—'}</p>
              <p><strong>Email:</strong> ${sale.partyResponseDto?.emailId || '—'}</p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Item</th>
                <th>HSN</th>
                <th>Qty</th>
                <th>Unit</th>
                <th>Rate (₹)</th>
                <th>Tax (%)</th>
                <th>Tax Amt (₹)</th>
                <th>Total (₹)</th>
              </tr>
            </thead>
            <tbody>
              ${sale.saleItemResponses?.map((item, i) => `
                <tr>
                  <td>${i + 1}</td>
                  <td>${item.itemName}<br><small>${item.itemDescription || ''}</small></td>
                  <td>${item.itemHsnCode || '—'}</td>
                  <td>${item.quantity}</td>
                  <td>${item.unit}</td>
                  <td class="text-right">${Number.parseFloat(item.pricePerUnit).toFixed(2)}</td>
                  <td class="text-right">${item.taxRate}</td>
                  <td class="text-right">${Number.parseFloat(item.taxAmount).toFixed(2)}</td>
                  <td class="text-right">${Number.parseFloat(item.totalAmount).toFixed(2)}</td>
                </tr>
              `).join('') || '<tr><td colspan="9">No items</td></tr>'}
            </tbody>
          </table>

          <div class="total-section">
            <div class="total-box">
              <div class="total-row">
                <span>Subtotal (ex-tax):</span>
                <span>₹${Number.parseFloat(sale.totalAmountWithoutTax || 0).toFixed(2)}</span>
              </div>
              <div class="total-row">
                <span>Total Tax:</span>
                <span>₹${Number.parseFloat(sale.totalTaxAmount || 0).toFixed(2)}</span>
              </div>
              <div class="total-row">
                <span>Delivery Charges:</span>
                <span>₹${Number.parseFloat(sale.deliveryCharges || 0).toFixed(2)}</span>
              </div>
              <div class="total-row">
                <span>Grand Total:</span>
                <span>₹${Number.parseFloat(sale.totalAmount || 0).toFixed(2)}</span>
              </div>
              <div class="total-row">
                <span>Received:</span>
                <span>₹${Number.parseFloat(sale.receivedAmount || 0).toFixed(2)}</span>
              </div>
              <div class="total-row" style="background-color: #f0f0f0; font-weight: bold;">
                <span>Balance Due:</span>
                <span>₹${Number.parseFloat(sale.balance || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div class="payment-section">
            <h3>Payments Received:</h3>
            <ul class="payment-list">
              ${sale.salePaymentResponses?.map((p, i) => `
                <li class="payment-item">
                  <strong>₹${Number.parseFloat(p.amountPaid).toFixed(2)}</strong> on ${new Date(p.paymentDate).toLocaleDateString('en-IN')} via ${p.paymentType}
                  ${p.referenceNumber ? ' (Ref: ' + p.referenceNumber + ')' : ''}
                  ${p.paymentDescription ? '<br><small>' + p.paymentDescription + '</small>' : ''}
                </li>
              `).join('') || '<li>No payments recorded</li>'}
            </ul>
          </div>

          <div class="footer">
            <p>Thank you for your business. This is a computer-generated invoice. No signature required.</p>
            <p>Terms & Conditions: Payment due by ${new Date(sale.dueDate).toLocaleDateString('en-IN')}. Late payments may incur charges.</p>
          </div>
        </div>

        <script>
          window.onload = function() { window.print(); window.close(); }
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

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
                      Paid
                    </>
                  )}
                </div>
              </div>
              <div className={styles["header-actions"]}>
                <button
                  onClick={() => handlePrint(selectedSale)}
                  className={`${styles["action-button"]} ${styles["print-button"]}`}
                  title="Print invoice"
                >
                  <Printer size={16} />
                  <span>Print</span>
                </button>
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
                  <span>₹{Number.parseFloat(selectedSale.totalAmountWithoutTax || 0).toFixed(2)}</span>
                </div>
                <div className={styles["breakdown-row"]}>
                  <span>Tax Amount:</span>
                  <span>₹{Number.parseFloat(selectedSale.totalTaxAmount || 0).toFixed(2)}</span>
                </div>
                <div className={styles["breakdown-row"]}>
                  <span>Delivery Charges:</span>
                  <span>₹{Number.parseFloat(selectedSale.deliveryCharges || 0).toFixed(2)}</span>
                </div>
                <div className={styles["breakdown-row"]}>
                  <span>Total Amount:</span>
                  <span className={styles["total-amount"]}>₹{Number.parseFloat(selectedSale.totalAmount || 0).toFixed(2)}</span>
                </div>
                <div className={styles["breakdown-row"]}>
                  <span>Received:</span>
                  <span>₹{Number.parseFloat(selectedSale.receivedAmount || 0).toFixed(2)}</span>
                </div>
                <div
                  className={`${styles["breakdown-row"]} ${selectedSale.balance > 0 ? styles["balance-row-pending"] : styles["balance-row-paid"]}`}
                >
                  <span>Balance:</span>
                  <span className={styles["balance-amount"]}>
                    ₹{Number.parseFloat(selectedSale.balance || 0).toFixed(2)}
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
                          <td>₹{Number.parseFloat(it.pricePerUnit).toFixed(2)}</td>
                          <td>{it.pricePerUnitTaxType}</td>
                          <td>{it.taxRate}</td>
                          <td>₹{Number.parseFloat(it.taxAmount).toFixed(2)}</td>
                          <td>₹{Number.parseFloat(it.totalAmount).toFixed(2)}</td>
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
                        <span className={styles["payment-amount"]}>₹{Number.parseFloat(p.amountPaid).toFixed(2)}</span>
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
                      setPaymentForm({ ...paymentForm, receiptNo: e.target.value })
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
                      setPaymentForm({ ...paymentForm, paymentDate: e.target.value })
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
                      setPaymentForm({ ...paymentForm, amountPaid: e.target.value })
                    }
                    required
                    className={styles["form-input"]}
                    placeholder={`Max: ₹${remainingBalance.toFixed(2)}`}
                  />
                  <small className={styles["balance-info"]}>Remaining Balance: ₹{remainingBalance.toFixed(2)}</small>
                </div>
                <div className={styles["form-group"]}>
                  <label>
                    Payment Type <span className={styles.required}>*</span>
                  </label>
                  <select
                    value={paymentForm.paymentType}
                    onChange={(e) =>
                      setPaymentForm({ ...paymentForm, paymentType: e.target.value })
                    }
                    required
                    className={styles["form-input"]}
                  >
                    {paymentTypes.map((type) => (
                      <option key={type} value={type}>
                        {type.replace(/_/g, " ")}
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
                      setPaymentForm({ ...paymentForm, referenceNumber: e.target.value })
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
                      setPaymentForm({ ...paymentForm, paymentDescription: e.target.value })
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
  );
};

export default SalesList;