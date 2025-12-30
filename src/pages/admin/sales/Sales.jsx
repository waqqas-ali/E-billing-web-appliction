// "use client";

// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../../../utils/axiosInstance"; // Shared API with token refresh
// import { toast } from "react-toastify";
// import styles from "../Styles/ScreenUI.module.css";
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
// } from "lucide-react";

// const SalesList = () => {
//   const navigate = useNavigate();

//   const [userData, setUserData] = useState(
//     JSON.parse(localStorage.getItem("eBilling") || "{}")
//   );

//   const token = userData?.accessToken;
//   const companyId = userData?.selectedCompany?.id;

//   const [sales, setSales] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedSale, setSelectedSale] = useState(null);
//   const [showPaymentModal, setShowPaymentModal] = useState(false);
//   const [selectedSaleId, setSelectedSaleId] = useState(null);
//   const [remainingBalance, setRemainingBalance] = useState(0);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [paymentForm, setPaymentForm] = useState({
//     receiptNo: "",
//     paymentDate: new Date().toISOString().split("T")[0],
//     amountPaid: "",
//     paymentType: "CASH",
//     referenceNumber: "",
//     paymentDescription: "",
//   });

//   const paymentTypes = [
//     "CASH",
//     "UPI",
//     "CREDIT_CARD",
//     "DEBIT_CARD",
//     "NET_BANKING",
//     "WALLET",
//     "CHEQUE",
//     "OTHER",
//   ];

//   // Sync with localStorage changes (logout, company switch, token refresh)
//   useEffect(() => {
//     const handleStorageChange = () => {
//       const updated = JSON.parse(localStorage.getItem("eBilling") || "{}");
//       setUserData(updated);
//     };

//     window.addEventListener("storage", handleStorageChange);
//     return () => window.removeEventListener("storage", handleStorageChange);
//   }, []);

//   // Fetch sales with proper auth checks
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

//     const fetchSales = async () => {
//       setLoading(true);
//       try {
//         const res = await api.get(`/company/${companyId}/sales`);
//         setSales(res.data || []);
//       } catch (err) {
//         toast.error(err.response?.data?.message || "Failed to load sales");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSales();
//   }, [token, companyId, navigate]);

//   const deleteSale = async (saleId) => {
//     if (!window.confirm("Are you sure you want to delete this sale?")) return;

//     try {
//       await api.delete(`/sale/${saleId}`);
//       setSales((prev) => prev.filter((s) => s.saleId !== saleId));
//       toast.success("Sale deleted successfully");
//       setSelectedSale(null);
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to delete sale");
//     }
//   };

//   const handleEdit = (saleId) => {
//     navigate(`/createsale?edit=${saleId}`);
//     setSelectedSale(null);
//   };

//   const openPaymentModal = (sale) => {
//     setSelectedSaleId(sale.saleId);
//     setRemainingBalance(Number.parseFloat(sale.balance) || 0);
//     setPaymentForm({
//       receiptNo: "",
//       paymentDate: new Date().toISOString().split("T")[0],
//       amountPaid: "",
//       paymentType: "CASH",
//       referenceNumber: "",
//       paymentDescription: "",
//     });
//     setShowPaymentModal(true);
//   };

//   const handleAddPayment = async (e) => {
//     e.preventDefault();
//     if (!selectedSaleId) return;

//     const amount = Number.parseFloat(paymentForm.amountPaid);
//     if (!paymentForm.paymentDate || !paymentForm.amountPaid || !paymentForm.paymentType) {
//       toast.error("Payment Date, Amount, and Type are required");
//       return;
//     }
//     if (isNaN(amount) || amount <= 0) {
//       toast.error("Amount must be greater than 0");
//       return;
//     }
//     if (amount > remainingBalance) {
//       toast.error(`Payment amount (₹${amount}) exceeds remaining balance (₹${remainingBalance})`);
//       return;
//     }

//     const payload = {
//       receiptNo: paymentForm.receiptNo || null,
//       paymentDate: paymentForm.paymentDate,
//       amountPaid: amount,
//       paymentType: paymentForm.paymentType,
//       referenceNumber: paymentForm.referenceNumber || null,
//       paymentDescription: paymentForm.paymentDescription || null,
//     };

//     try {
//       setLoading(true);
//       await api.post(`/sale/${selectedSaleId}/add-payment`, payload);
//       toast.success("Payment added successfully!");
//       setShowPaymentModal(false);

//       // Refresh sales list
//       const res = await api.get(`/company/${companyId}/sales`);
//       setSales(res.data || []);
//       setSelectedSale(null);
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to add payment");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filteredSales = sales.filter(
//     (s) =>
//       s.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       s.partyResponseDto?.name?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

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
//             height: 26.7cm;
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
//                       Paid
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
//                   <span>₹{Number.parseFloat(selectedSale.totalAmountWithoutTax || 0).toFixed(2)}</span>
//                 </div>
//                 <div className={styles["breakdown-row"]}>
//                   <span>Tax Amount:</span>
//                   <span>₹{Number.parseFloat(selectedSale.totalTaxAmount || 0).toFixed(2)}</span>
//                 </div>
//                 <div className={styles["breakdown-row"]}>
//                   <span>Delivery Charges:</span>
//                   <span>₹{Number.parseFloat(selectedSale.deliveryCharges || 0).toFixed(2)}</span>
//                 </div>
//                 <div className={styles["breakdown-row"]}>
//                   <span>Total Amount:</span>
//                   <span className={styles["total-amount"]}>₹{Number.parseFloat(selectedSale.totalAmount || 0).toFixed(2)}</span>
//                 </div>
//                 <div className={styles["breakdown-row"]}>
//                   <span>Received:</span>
//                   <span>₹{Number.parseFloat(selectedSale.receivedAmount || 0).toFixed(2)}</span>
//                 </div>
//                 <div
//                   className={`${styles["breakdown-row"]} ${selectedSale.balance > 0 ? styles["balance-row-pending"] : styles["balance-row-paid"]}`}
//                 >
//                   <span>Balance:</span>
//                   <span className={styles["balance-amount"]}>
//                     ₹{Number.parseFloat(selectedSale.balance || 0).toFixed(2)}
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
//                           <td>₹{Number.parseFloat(it.pricePerUnit).toFixed(2)}</td>
//                           <td>{it.pricePerUnitTaxType}</td>
//                           <td>{it.taxRate}</td>
//                           <td>₹{Number.parseFloat(it.taxAmount).toFixed(2)}</td>
//                           <td>₹{Number.parseFloat(it.totalAmount).toFixed(2)}</td>
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
//                         <span className={styles["payment-amount"]}>₹{Number.parseFloat(p.amountPaid).toFixed(2)}</span>
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
//                       setPaymentForm({ ...paymentForm, receiptNo: e.target.value })
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
//                       setPaymentForm({ ...paymentForm, paymentDate: e.target.value })
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
//                       setPaymentForm({ ...paymentForm, amountPaid: e.target.value })
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
//                       setPaymentForm({ ...paymentForm, paymentType: e.target.value })
//                     }
//                     required
//                     className={styles["form-input"]}
//                   >
//                     {paymentTypes.map((type) => (
//                       <option key={type} value={type}>
//                         {type.replace(/_/g, " ")}
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
//                       setPaymentForm({ ...paymentForm, referenceNumber: e.target.value })
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
//                       setPaymentForm({ ...paymentForm, paymentDescription: e.target.value })
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
//   );
// };

// export default SalesList;








// "use client";

// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../../../utils/axiosInstance"; // your axios instance with interceptors
// import { toast } from "react-toastify";
// import styles from "../Styles/ScreenUI.module.css";
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
//   Copy,
// } from "lucide-react";

// // ─── Correct import for qrcode.react with Vite ──────────────────────────────
// import { QRCodeSVG } from "qrcode.react";

// const SalesList = () => {
//   const navigate = useNavigate();

//   const [userData, setUserData] = useState(
//     JSON.parse(localStorage.getItem("eBilling") || "{}")
//   );

//   const token = userData?.accessToken;
//   const companyId = userData?.selectedCompany?.id;

//   const [sales, setSales] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedSale, setSelectedSale] = useState(null);
//   const [showPaymentModal, setShowPaymentModal] = useState(false);
//   const [selectedSaleId, setSelectedSaleId] = useState(null);
//   const [remainingBalance, setRemainingBalance] = useState(0);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [paymentForm, setPaymentForm] = useState({
//     receiptNo: "",
//     paymentDate: new Date().toISOString().split("T")[0],
//     amountPaid: "",
//     paymentType: "CASH",
//     referenceNumber: "",
//     paymentDescription: "",
//   });

//   const paymentTypes = [
//     "CASH",
//     "UPI",
//     "CREDIT_CARD",
//     "DEBIT_CARD",
//     "NET_BANKING",
//     "WALLET",
//     "CHEQUE",
//     "OTHER",
//   ];

//   // ─── CHANGE THESE VALUES! ────────────────────────────────────────────────
//   const UPI_ID = "9420666490@kotak811";           // ← Your real UPI ID here
//   const MERCHANT_NAME = "Waqqas Nasir Ali";    // ← Your business name
//   // ──────────────────────────────────────────────────────────────────────────

//   // Listen to localStorage changes (company switch, logout, token refresh)
//   useEffect(() => {
//     const handleStorageChange = () => {
//       const updated = JSON.parse(localStorage.getItem("eBilling") || "{}");
//       setUserData(updated);
//     };

//     window.addEventListener("storage", handleStorageChange);
//     return () => window.removeEventListener("storage", handleStorageChange);
//   }, []);

//   // Fetch all sales
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

//     const fetchSales = async () => {
//       setLoading(true);
//       try {
//         const res = await api.get(`/company/${companyId}/sales`);
//         setSales(res.data || []);
//       } catch (err) {
//         toast.error(err.response?.data?.message || "Failed to load sales");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSales();
//   }, [token, companyId, navigate]);

//   const deleteSale = async (saleId) => {
//     if (!window.confirm("Are you sure you want to delete this sale?")) return;

//     try {
//       await api.delete(`/sale/${saleId}`);
//       setSales((prev) => prev.filter((s) => s.saleId !== saleId));
//       toast.success("Sale deleted successfully");
//       setSelectedSale(null);
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to delete sale");
//     }
//   };

//   const handleEdit = (saleId) => {
//     navigate(`/createsale?edit=${saleId}`);
//     setSelectedSale(null);
//   };

//   const openPaymentModal = (sale) => {
//     setSelectedSaleId(sale.saleId);
//     setRemainingBalance(Number.parseFloat(sale.balance) || 0);
//     setPaymentForm({
//       receiptNo: "",
//       paymentDate: new Date().toISOString().split("T")[0],
//       amountPaid: "",
//       paymentType: "UPI", // default to UPI
//       referenceNumber: "",
//       paymentDescription: "",
//     });
//     setShowPaymentModal(true);
//   };

//   const handleAddPayment = async (e) => {
//     e.preventDefault();
//     if (!selectedSaleId) return;

//     const amount = Number.parseFloat(paymentForm.amountPaid);
//     if (!paymentForm.paymentDate || !amount || !paymentForm.paymentType) {
//       toast.error("Payment Date, Amount, and Type are required");
//       return;
//     }
//     if (amount <= 0) {
//       toast.error("Amount must be greater than 0");
//       return;
//     }
//     if (amount > remainingBalance) {
//       toast.error(`Cannot pay more than remaining balance (₹${remainingBalance})`);
//       return;
//     }

//     const payload = {
//       receiptNo: paymentForm.receiptNo || null,
//       paymentDate: paymentForm.paymentDate,
//       amountPaid: amount,
//       paymentType: paymentForm.paymentType,
//       referenceNumber: paymentForm.referenceNumber || null,
//       paymentDescription: paymentForm.paymentDescription || null,
//     };

//     try {
//       setLoading(true);
//       await api.post(`/sale/${selectedSaleId}/add-payment`, payload);
//       toast.success("Payment recorded successfully!");

//       // Refresh list
//       const res = await api.get(`/company/${companyId}/sales`);
//       setSales(res.data || []);

//       setShowPaymentModal(false);
//       setSelectedSale(null);
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to record payment");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Generate UPI payment link
//   const generateUpiLink = (sale) => {
//     const amount = Number(sale.balance > 0 ? sale.balance : sale.totalAmount).toFixed(2);
//     const note = `Payment for ${sale.invoiceNumber || `Sale #${sale.saleId}`}`;
    
//     return `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(MERCHANT_NAME)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;
//   };

//   const handleCopyUpi = () => {
//     navigator.clipboard.writeText(UPI_ID);
//     toast.success("UPI ID copied!");
//   };

//   const handlePrint = (sale) => {
//     const upiLink = generateUpiLink(sale);
//     const amount = Number(sale.totalAmount || 0).toFixed(2);

//     const printWindow = window.open("", "_blank");
//     if (!printWindow) return;

//     printWindow.document.write(`
//       <!DOCTYPE html>
//       <html lang="en">
//       <head>
//         <meta charset="UTF-8" />
//         <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
//         <title>Invoice ${sale.invoiceNumber || sale.saleId}</title>
//         <style>
//           @page { size: A4 portrait; margin: 10mm; }
//           body { font-family: Arial, sans-serif; margin:0; padding:0; font-size:10pt; color:#000; }
//           .container { max-width:190mm; margin:0 auto; padding:10mm; }
//           .header { text-align:center; border-bottom:2pt solid #000; padding-bottom:5mm; margin-bottom:5mm; }
//           .info-section { display:flex; justify-content:space-between; margin-bottom:5mm; }
//           .info-box { width:48%; }
//           .info-box h3 { font-size:12pt; margin:0 0 3pt; border-bottom:1pt solid #000; }
//           table { width:100%; border-collapse:collapse; font-size:9pt; margin-bottom:5mm; }
//           th,td { border:1pt solid #000; padding:3pt 5pt; }
//           th { background:#f5f5f5; }
//           .text-right { text-align:right; }
//           .total-box { width:45%; margin-left:auto; border:1pt solid #000; }
//           .total-row { display:flex; justify-content:space-between; padding:4pt 6pt; border-bottom:1pt solid #ddd; }
//           .total-row:last-child { border-bottom:none; font-weight:bold; background:#f5f5f5; }
//           .qr-section { text-align:center; margin:15mm 0; padding:10px; border:1pt solid #000; border-radius:6px; }
//           .footer { text-align:center; font-size:8pt; color:#555; border-top:1pt solid #000; padding-top:4pt; margin-top:auto; }
//         </style>
//       </head>
//       <body>
//         <div class="container">
//           <div class="header">
//             <h1>TAX INVOICE</h1>
//             <p>Invoice No: ${sale.invoiceNumber || '—'} | Date: ${new Date(sale.invoceDate).toLocaleDateString('en-IN')} | Due: ${new Date(sale.dueDate).toLocaleDateString('en-IN')}</p>
//           </div>

//           <div class="info-section">
//             <div class="info-box">
//               <h3>From:</h3>
//               <p><strong>${userData.selectedCompany?.name || 'Your Company'}</strong></p>
//               <p>${userData.selectedCompany?.billingAddress || '—'}</p>
//               <p>GSTIN: ${userData.selectedCompany?.gstin || '—'}</p>
//             </div>
//             <div class="info-box">
//               <h3>Bill To:</h3>
//               <p><strong>${sale.partyResponseDto?.name || 'Customer'}</strong></p>
//               <p>${sale.partyResponseDto?.billingAddress || '—'}</p>
//               <p>GSTIN: ${sale.partyResponseDto?.gstin || '—'}</p>
//             </div>
//           </div>

//           <table>
//             <thead>
//               <tr>
//                 <th>#</th><th>Item</th><th>HSN</th><th>Qty</th><th>Unit</th>
//                 <th>Rate</th><th>Tax%</th><th>Tax Amt</th><th>Total</th>
//               </tr>
//             </thead>
//             <tbody>
//               ${sale.saleItemResponses?.map((item, i) => `
//                 <tr>
//                   <td>${i+1}</td>
//                   <td>${item.itemName}</td>
//                   <td>${item.itemHsnCode || '—'}</td>
//                   <td>${item.quantity}</td>
//                   <td>${item.unit || '—'}</td>
//                   <td class="text-right">${Number(item.pricePerUnit).toFixed(2)}</td>
//                   <td class="text-right">${item.taxRate || '—'}</td>
//                   <td class="text-right">${Number(item.taxAmount || 0).toFixed(2)}</td>
//                   <td class="text-right">${Number(item.totalAmount).toFixed(2)}</td>
//                 </tr>
//               `).join('') || '<tr><td colspan="9" style="text-align:center;">No items</td></tr>'}
//             </tbody>
//           </table>

//           <div class="total-box">
//             <div class="total-row"><span>Subtotal</span><span>₹${Number(sale.totalAmountWithoutTax || 0).toFixed(2)}</span></div>
//             <div class="total-row"><span>Total Tax</span><span>₹${Number(sale.totalTaxAmount || 0).toFixed(2)}</span></div>
//             <div class="total-row"><span>Delivery</span><span>₹${Number(sale.deliveryCharges || 0).toFixed(2)}</span></div>
//             <div class="total-row"><span><strong>Grand Total</strong></span><span><strong>₹${Number(sale.totalAmount || 0).toFixed(2)}</strong></span></div>
//             <div class="total-row"><span>Received</span><span>₹${Number(sale.receivedAmount || 0).toFixed(2)}</span></div>
//             <div class="total-row"><span>Balance Due</span><span>₹${Number(sale.balance || 0).toFixed(2)}</span></div>
//           </div>

//           <div class="qr-section">
//             <h3>Pay ₹${Number(sale.balance > 0 ? sale.balance : sale.totalAmount).toFixed(2)} via UPI</h3>
//             <img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(upiLink)}" alt="UPI QR Code" style="margin:10px 0;"/>
//             <p><strong>UPI ID:</strong> ${UPI_ID}</p>
//             <p style="font-size:9pt; margin-top:4px;">Scan with any UPI app (GPay, PhonePe, Paytm, BHIM...)</p>
//           </div>

//           <div class="footer">
//             Thank you for your business • Computer generated invoice • No signature required
//           </div>
//         </div>
//         <script>window.onload=()=>{window.print()}</script>
//       </body>
//       </html>
//     `);
//     printWindow.document.close();
//   };

//   const filteredSales = sales.filter((s) =>
//     (s.invoiceNumber || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
//     (s.partyResponseDto?.name || "").toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className={styles["company-form-container"]}>
//       {/* Header */}
//       <div className={styles["form-header"]}>
//         <div>
//           <h1 className={styles["company-form-title"]}>Sales Invoices</h1>
//           <p className={styles["form-subtitle"]}>Manage your customer invoices</p>
//         </div>
//         <button
//           onClick={() => navigate("/createsale")}
//           className={styles["submit-button"]}
//           disabled={loading}
//         >
//           <Plus size={18} /> New Sale
//         </button>
//       </div>

//       {/* Search */}
//       <div className={styles["search-container"]}>
//         <Search size={18} className={styles["search-icon"]} />
//         <input
//           type="text"
//           placeholder="Search invoice number or customer..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className={styles["search-input"]}
//         />
//       </div>

//       {loading ? (
//         <div className={styles["loading-message"]}>
//           <Loader className={styles["spinner"]} size={32} />
//           <p>Loading sales records...</p>
//         </div>
//       ) : filteredSales.length === 0 ? (
//         <div className={styles["no-data"]}>
//           <Package size={48} />
//           <p>No sales found</p>
//           <p>{searchTerm ? "Try different search term" : "Create your first sale"}</p>
//         </div>
//       ) : (
//         <div className={styles["table-wrapper"]}>
//           <table className={styles.table}>
//             <thead>
//               <tr>
//                 <th>Invoice #</th>
//                 <th>Date</th>
//                 <th>Due Date</th>
//                 <th>Customer</th>
//                 <th>Total</th>
//                 <th>Balance</th>
//                 <th>Status</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredSales.map((sale) => (
//                 <tr key={sale.saleId}>
//                   <td>{sale.invoiceNumber || "—"}</td>
//                   <td>{new Date(sale.invoceDate).toLocaleDateString("en-IN")}</td>
//                   <td>{new Date(sale.dueDate).toLocaleDateString("en-IN")}</td>
//                   <td>{sale.partyResponseDto?.name || "—"}</td>
//                   <td>₹{Number(sale.totalAmount || 0).toFixed(2)}</td>
//                   <td>
//                     <span style={{ color: Number(sale.balance) > 0 ? "#e74c3c" : "#27ae60" }}>
//                       ₹{Number(sale.balance || 0).toFixed(2)}
//                     </span>
//                   </td>
//                   <td>{Number(sale.balance) > 0 ? "Pending" : "Paid"}</td>
//                   <td>
//                     <button
//                       onClick={() => setSelectedSale(sale)}
//                       className={styles["action-button"]}
//                     >
//                       <Eye size={16} /> View
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* ─── VIEW DETAILS MODAL ────────────────────────────────────────────── */}
//       {selectedSale && (
//         <div className={styles["modal-overlay"]} onClick={() => setSelectedSale(null)}>
//           <div className={styles["detail-card"]} onClick={(e) => e.stopPropagation()}>
//             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
//               <h2>Invoice {selectedSale.invoiceNumber || `#${selectedSale.saleId}`}</h2>
//               <button onClick={() => setSelectedSale(null)}>
//                 <X size={24} />
//               </button>
//             </div>

//             {/* UPI QR Payment Section */}
//             <div style={{
//               background: "#f9f9f9",
//               padding: "1.5rem",
//               borderRadius: "10px",
//               margin: "1.5rem 0",
//               textAlign: "center",
//               border: "1px solid #eee"
//             }}>
//               <h3>Pay ₹{Number(selectedSale.balance > 0 ? selectedSale.balance : selectedSale.totalAmount).toFixed(2)}</h3>
//               <p style={{ color: "#666", margin: "0.5rem 0 1.5rem" }}>Scan to pay instantly</p>

//               <div style={{
//                 background: "white",
//                 padding: "1rem",
//                 borderRadius: "12px",
//                 display: "inline-block",
//                 boxShadow: "0 4px 15px rgba(0,0,0,0.08)"
//               }}>
//                 <QRCodeSVG
//                   value={generateUpiLink(selectedSale)}
//                   size={220}
//                   level="H"
//                   fgColor="#000000"
//                   bgColor="#ffffff"
//                 />
//               </div>

//               <div style={{ marginTop: "1.2rem" }}>
//                 <strong>UPI ID:</strong> {UPI_ID}
//                 <button
//                   onClick={handleCopyUpi}
//                   style={{
//                     marginLeft: "12px",
//                     padding: "6px 14px",
//                     background: "#e0e0e0",
//                     border: "none",
//                     borderRadius: "6px",
//                     cursor: "pointer",
//                     display: "inline-flex",
//                     alignItems: "center",
//                     gap: "6px"
//                   }}
//                 >
//                   <Copy size={14} /> Copy
//                 </button>
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", margin: "1.5rem 0" }}>
//               <button onClick={() => handlePrint(selectedSale)}>
//                 <Printer size={16} /> Print
//               </button>
//               <button onClick={() => handleEdit(selectedSale.saleId)}>
//                 <Edit2 size={16} /> Edit
//               </button>
//               {Number(selectedSale.balance) > 0 && (
//                 <button onClick={() => openPaymentModal(selectedSale)}>
//                   <DollarSign size={16} /> Add Payment
//                 </button>
//               )}
//               <button onClick={() => deleteSale(selectedSale.saleId)} style={{ background: "#e74c3c" }}>
//                 <Trash2 size={16} /> Delete
//               </button>
//             </div>

//             {/* Rest of your details (shortened example) */}
//             <div>
//               <strong>Customer:</strong> {selectedSale.partyResponseDto?.name || "—"}<br />
//               <strong>Total:</strong> ₹{Number(selectedSale.totalAmount).toFixed(2)}<br />
//               <strong>Balance Due:</strong> ₹{Number(selectedSale.balance).toFixed(2)}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Payment Modal - unchanged from your original */}
//       {showPaymentModal && (
//         <div className={styles["modal-overlay"]} onClick={() => setShowPaymentModal(false)}>
//           <div className={styles["payment-modal"]} onClick={e => e.stopPropagation()}>
//             <h3>Add Payment</h3>
//             <form onSubmit={handleAddPayment}>
//               {/* Your existing payment form fields here */}
//               {/* ... amount, date, type, reference, description ... */}
//               <div style={{ marginTop: "1.5rem", display: "flex", gap: "12px" }}>
//                 <button type="submit" disabled={loading}>
//                   {loading ? "Saving..." : "Record Payment"}
//                 </button>
//                 <button type="button" onClick={() => setShowPaymentModal(false)}>
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SalesList;






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

// Correct import for qrcode.react with Vite (named export)
import { QRCodeSVG } from "qrcode.react";

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

  // IMPORTANT: Replace these with your real values
  const UPI_ID = "yourname@upi";                    // ← CHANGE THIS
  const MERCHANT_NAME = "Your Business Name";       // ← CHANGE THIS

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

  // Generate UPI deep link
  const generateUpiLink = (sale) => {
    const amount = Number.parseFloat(
      sale.balance > 0 ? sale.balance : sale.totalAmount || 0
    ).toFixed(2);
    const note = `Payment for ${sale.invoiceNumber || `Sale #${sale.saleId}`}`;
    return `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(MERCHANT_NAME)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;
  };

  const handlePrint = (sale) => {
    const upiLink = generateUpiLink(sale);

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

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
          .qr-section {
            margin: 1cm 0;
            text-align: center;
            padding: 12px;
            border: 1pt solid #000;
            border-radius: 8px;
          }
          .qr-container {
            background: white;
            padding: 12px;
            display: inline-block;
            border: 1pt solid #ccc;
          }
          .footer {
            text-align: center;
            font-size: 8pt;
            color: #555;
            border-top: 1pt solid #000;
            padding-top: 4pt;
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
            </div>
            <div class="info-box">
              <h3>Bill To:</h3>
              <p><strong>${sale.partyResponseDto?.name || 'Party Name'}</strong></p>
              <p>${sale.partyResponseDto?.billingAddress || 'Billing Address'}</p>
              <p><strong>GSTIN:</strong> ${sale.partyResponseDto?.gstin || '—'}</p>
              <p><strong>State:</strong> ${sale.partyResponseDto?.state?.replace(/_/g, ' ') || '—'}</p>
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

          <!-- QR Code Section - ONLY appears when printing -->
          <div class="qr-section">
            <h3>Pay ₹${Number.parseFloat(sale.balance > 0 ? sale.balance : sale.totalAmount).toFixed(2)} via UPI</h3>
            <div class="qr-container">
              <img 
                src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(upiLink)}" 
                alt="UPI QR Code"
                style="margin: 10px 0;"
              />
            </div>
            <p><strong>UPI ID:</strong> ${UPI_ID}</p>
            <p style="font-size:9pt;">Scan with any UPI app (Google Pay, PhonePe, Paytm, BHIM, etc.)</p>
          </div>

          <div class="footer">
            <p>Thank you for your business. This is a computer-generated invoice. No signature required.</p>
            <p>Terms & Conditions: Payment due by ${new Date(sale.dueDate).toLocaleDateString('en-IN')}. Late payments may incur charges.</p>
          </div>
        </div>

        <script>
          window.onload = function() { 
            window.print(); 
            // window.close(); // Uncomment if you want to auto-close after print
          }
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  const filteredSales = sales.filter(
    (s) =>
      s.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.partyResponseDto?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      {/* VIEW MODAL - NO QR CODE HERE */}
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