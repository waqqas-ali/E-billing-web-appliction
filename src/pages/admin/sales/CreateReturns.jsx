// // src/pages/sales/CreateReturns.jsx
// import React, { useEffect, useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import axios from "axios";
// import config from "../../../config/apiconfig";
// import styles from "./Sales.module.css";
// import { toast } from "react-toastify";

// const CreateReturns = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const editId = queryParams.get("edit");

//   const userData = JSON.parse(localStorage.getItem("eBilling")) || {};
//   const token = userData?.accessToken || "";
//   const companyId = userData?.selectedCompany?.id || "";

//   const [loading, setLoading] = useState(false);
//   const [loadingData, setLoadingData] = useState(false);
//   const [loadingItems, setLoadingItems] = useState(false);
//   const [parties, setParties] = useState([]);
//   const [items, setItems] = useState([]);
//   const [sales, setSales] = useState([]);

//   // Max allowed return qty per item (from original sale)
//   const [maxQtyMap, setMaxQtyMap] = useState({}); // { "123": 10, "ABC": 5 }

//   const paymentTypes = ["CASH", "UPI", "CREDIT_CARD", "DEBIT_CARD", "NET_BANKING", "WALLET", "CHEQUE", "OTHER"];
//   const states = [
//     "ANDHRA_PRADESH", "ARUNACHAL_PRADESH", "ASSAM", "BIHAR", "CHHATTISGARH", "GOA", "GUJARAT", "HARYANA",
//     "HIMACHAL_PRADESH", "JHARKHAND", "KARNATAKA", "KERALA", "MADHYA_PRADESH", "MAHARASHTRA", "MANIPUR",
//     "MEGHALAYA", "MIZORAM", "NAGALAND", "ODISHA", "PUNJAB", "RAJASTHAN", "SIKKIM", "TAMIL_NADU", "TELANGANA",
//     "TRIPURA", "UTTAR_PRADESH", "UTTARAKHAND", "WEST_BENGAL", "OTHER"
//   ];

//   const TAX_RATE_MAP = {
//     NONE: 0, EXEMPTED: 0,
//     GST0: 0, IGST0: 0,
//     GST0POINT25: 0.0025, IGST0POINT25: 0.0025,
//     GST3: 0.03, IGST3: 0.03,
//     GST5: 0.05, IGST5: 0.05,
//     GST12: 0.12, IGST12: 0.12,
//     GST18: 0.18, IGST18: 0.18,
//     GST28: 0.28, IGST28: 0.28,
//   };

//   const [form, setForm] = useState({
//     partyId: "",
//     returnNo: "",
//     returnDate: new Date().toISOString().split("T")[0],
//     phoneNo: "",
//     invoiceNo: "",
//     invoiceDate: "",
//     paymentType: "CASH",
//     stateOfSupply: "MAHARASHTRA",
//     description: "",
//     items: [],
//     totalQuantity: 0,
//     totalDiscount: 0,
//     totalTaxAmount: 0,
//     totalAmount: 0,
//     paidAmount: "0",
//     balanceAmount: 0,
//   });

//   // Fetch Parties
//   const fetchParties = async () => {
//     if (!token || !companyId) return;
//     try {
//       const res = await axios.get(`${config.BASE_URL}/company/${companyId}/parties`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setParties(res.data || []);
//     } catch (err) {
//       toast.error("Failed to load parties");
//     }
//   };

//   // Fetch Items
//   const fetchItems = async () => {
//     if (!token || !companyId) return;
//     setLoadingItems(true);
//     try {
//       const res = await axios.get(`${config.BASE_URL}/company/${companyId}/items`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setItems(res.data || []);
//     } catch (err) {
//       toast.error("Failed to load items");
//     } finally {
//       setLoadingItems(false);
//     }
//   };

//   // Fetch Sales
//   const fetchSales = async () => {
//     if (!token || !companyId) return;
//     try {
//       const res = await axios.get(`${config.BASE_URL}/company/${companyId}/sales`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setSales(res.data || []);
//     } catch (err) {
//       toast.error("Failed to load sales");
//     }
//   };

//   // Load Return for Edit
//   const fetchReturn = async (saleReturnId) => {
//     if (!token || !companyId) return;
//     setLoadingData(true);
//     try {
//       const res = await axios.get(`${config.BASE_URL}/sale-return/${saleReturnId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const r = res.data;
//       const returnItems = r.saleReturnItemResponses?.map((it) => ({
//         itemId: it.itemId?.toString() || "",
//         name: it.name || "",
//         hsn: it.hsn || "",
//         quantity: it.quantity?.toString() || "",
//         unit: it.unit || "PIECES",
//         ratePerUnit: it.ratePerUnit?.toString() || "",
//         taxType: it.taxType || "WITHTAX",
//         discountAmount: (it.discountAmount || 0).toString(),
//         taxRate: it.taxRate || "GST18",
//         totalTaxAmount: it.totalTaxAmount || 0,
//         totalAmount: it.totalAmount || 0,
//       })) || [];

//       setForm({
//         partyId: r.partyResponseDto?.partyId?.toString() || "",
//         returnNo: r.returnNo || "",
//         returnDate: r.returnDate || "",
//         phoneNo: r.phoneNo || "",
//         invoiceNo: r.invoiceNo || "",
//         invoiceDate: r.invoiceDate || "",
//         paymentType: r.paymentType || "CASH",
//         stateOfSupply: r.stateOfSupply || "MAHARASHTRA",
//         description: r.description || "",
//         items: returnItems,
//         totalQuantity: r.totalQuantity || 0,
//         totalDiscount: r.totalDiscount || 0,
//         totalTaxAmount: r.totalTaxAmount || 0,
//         totalAmount: r.totalAmount || 0,
//         paidAmount: (r.paidAmount || 0).toString(),
//         balanceAmount: r.balanceAmount || 0,
//       });

//       // Build maxQtyMap from original sale
//       const sale = sales.find((s) => s.invoiceNumber === r.invoiceNo);
//       if (sale) {
//         const map = {};
//         sale.saleItemResponses?.forEach((it) => {
//           const key = it.itemId?.toString() || it.itemName;
//           map[key] = (map[key] || 0) + (parseFloat(it.quantity) || 0);
//         });
//         setMaxQtyMap(map);
//       }
//     } catch (err) {
//       toast.error("Failed to load return");
//       navigate("/sales-returns");
//     } finally {
//       setLoadingData(false);
//     }
//   };

//   useEffect(() => {
//     fetchParties();
//     fetchItems();
//     fetchSales();

//     if (editId) {
//       fetchReturn(editId);
//     }
//   }, [token, companyId, editId]);

//   // Auto-fill from invoice
//   const handleInvoiceSelect = (invoiceNo) => {
//     const sale = sales.find((s) => s.invoiceNumber === invoiceNo);
//     if (!sale) return;

//     const newItems = sale.saleItemResponses?.map((it) => ({
//       itemId: it.itemId?.toString() || "",
//       name: it.itemName,
//       hsn: it.itemHsnCode || "",
//       quantity: it.quantity?.toString() || "0", // DEFAULT QTY
//       unit: it.unit,
//       ratePerUnit: it.pricePerUnit?.toString() || "",
//       taxType: it.pricePerUnitTaxType || "WITHTAX",
//       discountAmount: "0",
//       taxRate: it.taxRate || "GST18",
//       totalTaxAmount: 0,
//       totalAmount: 0,
//     })) || [];

//     setForm((prev) => ({
//       ...prev,
//       partyId: sale.partyResponseDto?.partyId?.toString() || "",
//       phoneNo: sale.partyResponseDto?.phoneNo || "",
//       invoiceDate: sale.invoceDate || "",
//       stateOfSupply: sale.stateOfSupply || "MAHARASHTRA",
//       items: newItems,
//     }));

//     // Build maxQtyMap
//     const map = {};
//     sale.saleItemResponses?.forEach((it) => {
//       const key = it.itemId?.toString() || it.itemName;
//       map[key] = (map[key] || 0) + (parseFloat(it.quantity) || 0);
//     });
//     setMaxQtyMap(map);
//   };

//   // Handle item select (auto-fill + default quantity)
//   const handleItemSelect = (index, itemId) => {
//     const selected = items.find((i) => i.itemId === Number(itemId));
//     if (!selected) return;

//     const newItems = [...form.items];
//     const currentItem = newItems[index];

//     // Find original qty from invoice (if available)
//     let defaultQty = currentItem.quantity || "";
//     if (form.invoiceNo) {
//       const sale = sales.find((s) => s.invoiceNumber === form.invoiceNo);
//       const saleItem = sale?.saleItemResponses?.find(
//         (it) => it.itemId?.toString() === itemId
//       );
//       if (saleItem && !currentItem.quantity) {
//         defaultQty = saleItem.quantity?.toString() || "";
//       }
//     }

//     newItems[index] = {
//       ...currentItem,
//       itemId: selected.itemId,
//       name: selected.itemName,
//       hsn: selected.itemHsn,
//       unit: selected.baseUnit,
//       ratePerUnit: selected.salePrice.toString(),
//       taxType: selected.saleTaxType,
//       taxRate: selected.taxRate,
//       quantity: defaultQty,
//       discountAmount: "0",
//     };

//     recalculateTotals(newItems);
//   };

//   // Calculate single item
//   const calculateItem = (item) => {
//     const qty = parseFloat(item.quantity) || 0;
//     const rate = parseFloat(item.ratePerUnit) || 0;
//     const discount = parseFloat(item.discountAmount) || 0;
//     const taxRate = TAX_RATE_MAP[item.taxRate] || 0;
//     const withTax = item.taxType === "WITHTAX";

//     let subtotal = qty * rate - discount;
//     let taxAmount = 0;

//     if (withTax && taxRate > 0) {
//       const taxable = subtotal / (1 + taxRate);
//       taxAmount = subtotal - taxable;
//       subtotal = taxable;
//     } else {
//       taxAmount = subtotal * taxRate;
//     }

//     const total = subtotal + taxAmount;

//     return {
//       ...item,
//       totalTaxAmount: parseFloat(taxAmount.toFixed(2)),
//       totalAmount: parseFloat(total.toFixed(2)),
//     };
//   };

//   // Recalculate all
//   const recalculateTotals = (newItems) => {
//     const calculated = newItems.map(calculateItem);
//     const totalQty = calculated.reduce((s, i) => s + (parseFloat(i.quantity) || 0), 0);
//     const totalDiscount = calculated.reduce((s, i) => s + (parseFloat(i.discountAmount) || 0), 0);
//     const totalTax = calculated.reduce((s, i) => s + i.totalTaxAmount, 0);
//     const totalAmt = calculated.reduce((s, i) => s + i.totalAmount, 0);
//     const paid = parseFloat(form.paidAmount) || 0;
//     const balance = totalAmt - paid;

//     setForm((prev) => ({
//       ...prev,
//       items: calculated,
//       totalQuantity: totalQty,
//       totalDiscount: parseFloat(totalDiscount.toFixed(2)),
//       totalTaxAmount: parseFloat(totalTax.toFixed(2)),
//       totalAmount: parseFloat(totalAmt.toFixed(2)),
//       balanceAmount: parseFloat(balance.toFixed(2)),
//     }));
//   };

//   // Handle quantity change with max limit
//   const handleQuantityChange = (index, value) => {
//     const num = parseFloat(value) || 0;
//     const item = form.items[index];
//     const key = item.itemId || item.name;
//     const maxQty = maxQtyMap[key] || 0;

//     if (num > maxQty) {
//       toast.warn(`Max return quantity: ${maxQty}`);
//       return;
//     }

//     const newItems = [...form.items];
//     newItems[index].quantity = value;
//     recalculateTotals(newItems);
//   };

//   // Handle other item changes
//   const handleItemChange = (index, field, value) => {
//     const newItems = [...form.items];
//     newItems[index][field] = value;
//     recalculateTotals(newItems);
//   };

//   // Add / Remove item
//   const addItem = () => {
//     setForm((prev) => ({
//       ...prev,
//       items: [
//         ...prev.items,
//         {
//           itemId: "",
//           name: "",
//           hsn: "",
//           quantity: "",
//           unit: "PIECES",
//           ratePerUnit: "",
//           taxType: "WITHTAX",
//           discountAmount: "0",
//           taxRate: "GST18",
//           totalTaxAmount: 0,
//           totalAmount: 0,
//         },
//       ],
//     }));
//   };

//   const removeItem = (index) => {
//     const newItems = form.items.filter((_, i) => i !== index);
//     recalculateTotals(newItems);
//   };

//   // Submit
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!token || !companyId) {
//       toast.error("Login and select company");
//       return;
//     }

//     if (!form.partyId || !form.returnNo || !form.returnDate || !form.invoiceNo || !form.phoneNo) {
//       toast.error("Fill all required fields");
//       return;
//     }

//     const invalidItem = form.items.some(
//       (i) => !i.name || !i.quantity || !i.ratePerUnit || parseFloat(i.quantity) <= 0 || parseFloat(i.ratePerUnit) <= 0
//     );
//     if (invalidItem) {
//       toast.error("Each item must have Name, Qty > 0, Rate > 0");
//       return;
//     }

//     const payload = {
//       partyId: parseInt(form.partyId),
//       returnNo: form.returnNo.trim(),
//       returnDate: form.returnDate,
//       phoneNo: form.phoneNo.trim(),
//       invoiceNo: form.invoiceNo.trim(),
//       invoiceDate: form.invoiceDate,
//       totalDiscount: form.totalDiscount,
//       totalQuantity: form.totalQuantity,
//       totalTaxAmount: form.totalTaxAmount,
//       totalAmount: form.totalAmount,
//       paidAmount: parseFloat(form.paidAmount) || 0,
//       balanceAmount: form.balanceAmount,
//       paymentType: form.paymentType,
//       stateOfSupply: form.stateOfSupply,
//       description: form.description.trim() || null,
//       saleReturnItemRequests: form.items.map((i) => ({
//         name: i.name.trim(),
//         quantity: parseFloat(i.quantity),
//         unit: i.unit,
//         ratePerUnit: parseFloat(i.ratePerUnit),
//         taxType: i.taxType,
//         discountAmount: parseFloat(i.discountAmount) || 0,
//         taxRate: i.taxRate,
//         totalTaxAmount: i.totalTaxAmount,
//         totalAmount: i.totalAmount,
//       })),
//     };

//     try {
//       setLoading(true);

//       if (editId) {
//         await axios.put(`${config.BASE_URL}/sale-return/${editId}`, payload, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         });
//         toast.success("Sale Return updated!");
//       } else {
//         await axios.post(`${config.BASE_URL}/company/${companyId}/create/sale-return`, payload, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         });
//         toast.success("Sale Return created!");
//       }

//       navigate("/sales_returns");
//     } catch (err) {
//       toast.error(err.response?.data?.message || `Failed to ${editId ? "update" : "create"} return`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const isEditMode = !!editId;

//   return (
//     <div className={styles["company-form-container"]}>
//       {loadingData ? (
//         <div className={styles["loading-message"]}>
//           <div className={styles.spinner}></div>
//           <p>Loading return...</p>
//         </div>
//       ) : (
//         <form onSubmit={handleSubmit}>
//           {/* Header */}
//           <div className={styles["form-header"]}>
//             <div>
//               <h1 className={styles["company-form-title"]}>
//                 {isEditMode ? "Edit Sale Return" : "Create Sale Return"}
//               </h1>
//               <p className={styles["form-subtitle"]}>
//                 {isEditMode ? `Return #${form.returnNo}` : "Return items from an invoice"}
//               </p>
//             </div>
//             <div style={{ display: "flex", gap: "8px" }}>
//               <button
//                 type="button"
//                 onClick={() => navigate("/sales_returns")}
//                 className={styles["cancel-button"]}
//                 disabled={loading}
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 className={styles["submit-button"]}
//                 disabled={loading || loadingData || !token || !companyId}
//               >
//                 {loading ? "Saving..." : isEditMode ? "Update Return" : "Create Return"}
//               </button>
//             </div>
//           </div>

//           {/* Party & Return No */}
//           <div className={styles["form-row"]}>
//             <div className={styles["form-group"]}>
//               <label>Party <span className={styles.required}>*</span></label>
//               <select
//                 value={form.partyId}
//                 onChange={(e) => setForm({ ...form, partyId: e.target.value })}
//                 required
//                 className={styles["form-input"]}
//                 disabled={!token || !companyId || loadingData}
//               >
//                 <option value="">{token && companyId ? "Select Party" : "Login & Select Company"}</option>
//                 {parties.map((p) => (
//                   <option key={p.partyId} value={p.partyId}>
//                     {p.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className={styles["form-group"]}>
//               <label>Return No <span className={styles.required}>*</span></label>
//               <input
//                 type="text"
//                 value={form.returnNo}
//                 onChange={(e) => setForm({ ...form, returnNo: e.target.value })}
//                 required
//                 className={styles["form-input"]}
//                 placeholder="e.g. SR-001"
//                 disabled={!token || !companyId || loadingData}
//               />
//             </div>
//           </div>

//           {/* Dates */}
//           <div className={styles["form-row"]}>
//             <div className={styles["form-group"]}>
//               <label>Return Date <span className={styles.required}>*</span></label>
//               <input
//                 type="date"
//                 value={form.returnDate}
//                 onChange={(e) => setForm({ ...form, returnDate: e.target.value })}
//                 required
//                 className={styles["form-input"]}
//                 disabled={!token || !companyId || loadingData}
//               />
//             </div>
//             <div className={styles["form-group"]}>
//               <label>Invoice No <span className={styles.required}>*</span></label>
//               <select
//                 value={form.invoiceNo}
//                 onChange={(e) => {
//                   setForm({ ...form, invoiceNo: e.target.value });
//                   handleInvoiceSelect(e.target.value);
//                 }}
//                 required
//                 className={styles["form-input"]}
//                 disabled={!token || !companyId || loadingData}
//               >
//                 <option value="">-- Select Invoice --</option>
//                 {sales.map((s) => (
//                   <option key={s.saleId} value={s.invoiceNumber}>
//                     {s.invoiceNumber} ({new Date(s.invoceDate).toLocaleDateString()})
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           {/* Phone & Payment */}
//           <div className={styles["form-row"]}>
//             <div className={styles["form-group"]}>
//               <label>Phone No <span className={styles.required}>*</span></label>
//               <input
//                 type="text"
//                 value={form.phoneNo}
//                 onChange={(e) => setForm({ ...form, phoneNo: e.target.value })}
//                 required
//                 className={styles["form-input"]}
//                 placeholder="10-digit mobile"
//                 maxLength={10}
//                 disabled={!token || !companyId || loadingData}
//               />
//             </div>
//             <div className={styles["form-group"]}>
//               <label>Payment Type</label>
//               <select
//                 value={form.paymentType}
//                 onChange={(e) => setForm({ ...form, paymentType: e.target.value })}
//                 className={styles["form-input"]}
//                 disabled={!token || !companyId || loadingData}
//               >
//                 {paymentTypes.map((t) => (
//                   <option key={t} value={t}>{t}</option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           {/* State & Paid */}
//           <div className={styles["form-row"]}>
//             <div className={styles["form-group"]}>
//               <label>State of Supply</label>
//               <select
//                 value={form.stateOfSupply}
//                 onChange={(e) => setForm({ ...form, stateOfSupply: e.target.value })}
//                 className={styles["form-input"]}
//                 disabled={!token || !companyId || loadingData}
//               >
//                 {states.map((s) => (
//                   <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
//                 ))}
//               </select>
//             </div>
//             <div className={styles["form-group"]}>
//               <label>Paid Amount</label>
//               <input
//                 type="number"
//                 step="0.01"
//                 min="0"
//                 value={form.paidAmount}
//                 onChange={(e) => {
//                   setForm({ ...form, paidAmount: e.target.value });
//                   recalculateTotals(form.items);
//                 }}
//                 className={styles["form-input"]}
//                 placeholder="0.00"
//                 disabled={!token || !companyId || loadingData}
//               />
//             </div>
//           </div>

//           <div className={styles["form-group"]}>
//             <label>Description</label>
//             <textarea
//               value={form.description}
//               onChange={(e) => setForm({ ...form, description: e.target.value })}
//               className={`${styles["form-input"]} ${styles.textarea}`}
//               placeholder="Optional notes..."
//               rows={2}
//               disabled={!token || !companyId || loadingData}
//             />
//           </div>

//           {/* Items Section */}
//           <div className={styles["card-section"]}>
//             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
//               <h4 style={{ margin: 0 }}>Returned Items</h4>
//               <button
//                 type="button"
//                 onClick={addItem}
//                 className={styles["submit-button"]}
//                 style={{ fontSize: "0.8rem", padding: "6px 12px" }}
//                 disabled={!token || !companyId || loadingItems || loadingData}
//               >
//                 + Add Item
//               </button>
//             </div>

//             {loadingItems && <p className={styles.loading}>Loading items...</p>}

//             {form.items.map((item, index) => {
//               const key = item.itemId || item.name;
//               const maxQty = maxQtyMap[key] || 0;

//               return (
//                 <div key={index} style={{ border: "1px solid #ddd", borderRadius: "6px", padding: "16px", marginBottom: "16px", background: "#fafafa" }}>
//                   {/* Item Select & HSN */}
//                   <div className={styles["form-row"]}>
//                     <div className={styles["form-group"]}>
//                       <label>Item Name <span className={styles.required}>*</span></label>
//                       <select
//                         value={item.itemId}
//                         onChange={(e) => handleItemSelect(index, e.target.value)}
//                         required
//                         className={styles["form-input"]}
//                         disabled={!token || !companyId || loadingItems || loadingData}
//                       >
//                         <option value="">-- Select Item --</option>
//                         {items.map((i) => (
//                           <option key={i.itemId} value={i.itemId}>
//                             {i.itemName} ({i.itemCode})
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                     <div className={styles["form-group"]}>
//                       <label>HSN</label>
//                       <input type="text" value={item.hsn} readOnly className={styles["form-input"]} />
//                     </div>
//                   </div>

//                   {/* Quantity with Max */}
//                   <div className={styles["form-row"]}>
//                     <div className={styles["form-group"]}>
//                       <label>
//                         Quantity <span className={styles.required}>*</span>
//                         {maxQty > 0 && <span style={{ fontSize: "0.8rem", color: "#666" }}> (Max: {maxQty})</span>}
//                       </label>
//                       <input
//                         type="number"
//                         step="0.01"
//                         min="0.01"
//                         value={item.quantity}
//                         onChange={(e) => handleQuantityChange(index, e.target.value)}
//                         required
//                         className={styles["form-input"]}
//                         disabled={!token || !companyId || loadingData}
//                         placeholder="Enter qty"
//                       />
//                     </div>
//                     <div className={styles["form-group"]}>
//                       <label>Unit</label>
//                       <input type="text" value={item.unit} readOnly className={styles["form-input"]} />
//                     </div>
//                   </div>

//                   {/* Rate & Tax */}
//                   <div className={styles["form-row"]}>
//                     <div className={styles["form-group"]}>
//                       <label>Rate/Unit <span className={styles.required}>*</span></label>
//                       <input
//                         type="number"
//                         step="0.01"
//                         min="0.01"
//                         value={item.ratePerUnit}
//                         onChange={(e) => handleItemChange(index, "ratePerUnit", e.target.value)}
//                         required
//                         className={styles["form-input"]}
//                         disabled={!token || !companyId || loadingData}
//                       />
//                     </div>
//                     <div className={styles["form-group"]}>
//                       <label>Tax Type</label>
//                       <input type="text" value={item.taxType} readOnly className={styles["form-input"]} />
//                     </div>
//                     <div className={styles["form-group"]}>
//                       <label>Tax Rate</label>
//                       <input type="text" value={item.taxRate} readOnly className={styles["form-input"]} />
//                     </div>
//                   </div>

//                   {/* Discount & Totals */}
//                   <div className={styles["form-row"]}>
//                     <div className={styles["form-group"]}>
//                       <label>Discount</label>
//                       <input
//                         type="number"
//                         step="0.01"
//                         min="0"
//                         value={item.discountAmount}
//                         onChange={(e) => handleItemChange(index, "discountAmount", e.target.value)}
//                         className={styles["form-input"]}
//                         placeholder="0.00"
//                         disabled={!token || !companyId || loadingData}
//                       />
//                     </div>
//                     <div className={styles["form-group"]}>
//                       <label>Tax Amount</label>
//                       <div style={{ padding: "10px 12px", background: "#f5f5f5", borderRadius: "6px", fontWeight: "600", color: "#e67e22" }}>
//                         ₹{item.totalTaxAmount.toFixed(2)}
//                       </div>
//                     </div>
//                     <div className={styles["form-group"]}>
//                       <label>Total</label>
//                       <div style={{ padding: "10px 12px", background: "#e8f5e9", borderRadius: "6px", fontWeight: "600", color: "#27ae60" }}>
//                         ₹{item.totalAmount.toFixed(2)}
//                       </div>
//                     </div>
//                   </div>

//                   {form.items.length > 1 && (
//                     <button
//                       type="button"
//                       onClick={() => removeItem(index)}
//                       className={styles["delete-button"]}
//                       style={{ marginTop: "8px", fontSize: "0.8rem" }}
//                       disabled={!token || !companyId || loadingData}
//                     >
//                       Remove Item
//                     </button>
//                   )}
//                 </div>
//               );
//             })}
//           </div>

//           {/* Final Totals */}
//           <div className={styles["card-section"]} style={{ background: "#f0f7ff", padding: "16px", borderRadius: "8px" }}>
//             <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px", fontSize: "1rem" }}>
//               <div><strong>Total Qty:</strong> {form.totalQuantity}</div>
//               <div><strong>Discount:</strong> ₹{form.totalDiscount.toFixed(2)}</div>
//               <div><strong>Tax:</strong> ₹{form.totalTaxAmount.toFixed(2)}</div>
//               <div><strong>Total:</strong> ₹{form.totalAmount.toFixed(2)}</div>
//               <div><strong>Paid:</strong> ₹{(parseFloat(form.paidAmount) || 0).toFixed(2)}</div>
//               <div style={{ color: form.balanceAmount > 0 ? "#e74c3c" : "#27ae60", fontWeight: "600" }}>
//                 <strong>Balance:</strong> ₹{form.balanceAmount.toFixed(2)}
//               </div>
//             </div>
//           </div>
//         </form>
//       )}
//     </div>
//   );
// };

// export default CreateReturns;






import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import config from "../../../config/apiconfig";
import styles from "./Sales.module.css";
import { toast } from "react-toastify";

const CreateReturns = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const editId = queryParams.get("edit");

  const userData = JSON.parse(localStorage.getItem("eBilling")) || {};
  const token = userData?.accessToken || "";
  const companyId = userData?.selectedCompany?.id || "";

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [loadingItems, setLoadingItems] = useState(false);
  const [parties, setParties] = useState([]);
  const [items, setItems] = useState([]);
  const [sales, setSales] = useState([]);

  const [maxQtyMap, setMaxQtyMap] = useState({});

  const paymentTypes = ["CASH", "UPI", "CREDIT_CARD", "DEBIT_CARD", "NET_BANKING", "WALLET", "CHEQUE", "OTHER"];
  const states = [
    "ANDHRA_PRADESH", "ARUNACHAL_PRADESH", "ASSAM", "BIHAR", "CHHATTISGARH", "GOA", "GUJARAT", "HARYANA",
    "HIMACHAL_PRADESH", "JHARKHAND", "KARNATAKA", "KERALA", "MADHYA_PRADESH", "MAHARASHTRA", "MANIPUR",
    "MEGHALAYA", "MIZORAM", "NAGALAND", "ODISHA", "PUNJAB", "RAJASTHAN", "SIKKIM", "TAMIL_NADU", "TELANGANA",
    "TRIPURA", "UTTAR_PRADESH", "UTTARAKHAND", "WEST_BENGAL", "OTHER"
  ];

  const TAX_RATE_MAP = {
    NONE: 0, EXEMPTED: 0,
    GST0: 0, IGST0: 0,
    GST0POINT25: 0.0025, IGST0POINT25: 0.0025,
    GST3: 0.03, IGST3: 0.03,
    GST5: 0.05, IGST5: 0.05,
    GST12: 0.12, IGST12: 0.12,
    GST18: 0.18, IGST18: 0.18,
    GST28: 0.28, IGST28: 0.28,
  };

  const [form, setForm] = useState({
    partyId: "",
    returnNo: "",
    returnDate: new Date().toISOString().split("T")[0],
    phoneNo: "",
    invoiceNo: "",
    invoiceDate: "",
    paymentType: "CASH",
    stateOfSupply: "MAHARASHTRA",
    description: "",
    items: [],
    totalQuantity: 0,
    totalDiscount: 0,
    totalTaxAmount: 0,
    totalAmount: 0,
    paidAmount: "0",
    balanceAmount: 0,
  });

  // Fetch Parties
  const fetchParties = async () => {
    if (!token || !companyId) return;
    try {
      const res = await axios.get(`${config.BASE_URL}/company/${companyId}/parties`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setParties(res.data || []);
    } catch (err) {
      toast.error("Failed to load parties");
    }
  };

  // Fetch Items
  const fetchItems = async () => {
    if (!token || !companyId) return;
    setLoadingItems(true);
    try {
      const res = await axios.get(`${config.BASE_URL}/company/${companyId}/items`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(res.data || []);
    } catch (err) {
      toast.error("Failed to load items");
    } finally {
      setLoadingItems(false);
    }
  };

  // Fetch Sales
  const fetchSales = async () => {
    if (!token || !companyId) return;
    try {
      const res = await axios.get(`${config.BASE_URL}/company/${companyId}/sales`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSales(res.data || []);
    } catch (err) {
      toast.error("Failed to load sales");
    }
  };

  // Load Return for Edit
  const fetchReturn = async (saleReturnId) => {
    if (!token || !companyId) return;
    setLoadingData(true);
    try {
      const res = await axios.get(`${config.BASE_URL}/sale-return/${saleReturnId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const r = res.data;
      const returnItems = r.saleReturnItemResponses?.map((it) => ({
        itemId: it.itemId?.toString() || "",
        name: it.name || "",
        hsn: it.hsn || "",
        quantity: it.quantity?.toString() || "",
        unit: it.unit || "PIECES",
        ratePerUnit: it.ratePerUnit?.toString() || "",
        taxType: it.taxType || "WITHTAX",
        discountAmount: (it.discountAmount || 0).toString(),
        taxRate: it.taxRate || "GST18",
        totalTaxAmount: it.totalTaxAmount || 0,
        totalAmount: it.totalAmount || 0,
      })) || [];

      setForm({
        partyId: r.partyResponseDto?.partyId?.toString() || "",
        returnNo: r.returnNo || "",
        returnDate: r.returnDate || "",
        phoneNo: r.phoneNo || "",
        invoiceNo: r.invoiceNo || "",
        invoiceDate: r.invoiceDate || "",
        paymentType: r.paymentType || "CASH",
        stateOfSupply: r.stateOfSupply || "MAHARASHTRA",
        description: r.description || "",
        items: returnItems,
        totalQuantity: r.totalQuantity || 0,
        totalDiscount: r.totalDiscount || 0,
        totalTaxAmount: r.totalTaxAmount || 0,
        totalAmount: r.totalAmount || 0,
        paidAmount: (r.paidAmount || 0).toString(),
        balanceAmount: r.balanceAmount || 0,
      });

      const sale = sales.find((s) => s.invoiceNumber === r.invoiceNo);
      if (sale) {
        const map = {};
        sale.saleItemResponses?.forEach((it) => {
          const key = it.itemId?.toString() || it.itemName;
          map[key] = (map[key] || 0) + (parseFloat(it.quantity) || 0);
        });
        setMaxQtyMap(map);
      }
    } catch (err) {
      toast.error("Failed to load return");
      navigate("/sales-returns");
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchParties();
    fetchItems();
    fetchSales();

    if (editId) {
      fetchReturn(editId);
    }
  }, [token, companyId, editId]);

  // Auto-fill from invoice
  const handleInvoiceSelect = (invoiceNo) => {
    const sale = sales.find((s) => s.invoiceNumber === invoiceNo);
    if (!sale) return;

    const newItems = sale.saleItemResponses?.map((it) => ({
      itemId: it.itemId?.toString() || "",
      name: it.itemName,
      hsn: it.itemHsnCode || "",
      quantity: "0",
      unit: it.unit,
      ratePerUnit: it.pricePerUnit?.toString() || "",
      taxType: it.pricePerUnitTaxType || "WITHTAX",
      discountAmount: "0",
      taxRate: it.taxRate || "GST18",
      totalTaxAmount: 0,
      totalAmount: 0,
    })) || [];

    setForm((prev) => ({
      ...prev,
      partyId: sale.partyResponseDto?.partyId?.toString() || "",
      phoneNo: sale.partyResponseDto?.phoneNo || "",
      invoiceDate: sale.invoceDate || "",
      stateOfSupply: sale.stateOfSupply || "MAHARASHTRA",
      items: newItems,
    }));

    const map = {};
    sale.saleItemResponses?.forEach((it) => {
      const key = it.itemId?.toString() || it.itemName;
      map[key] = (map[key] || 0) + (parseFloat(it.quantity) || 0);
    });
    setMaxQtyMap(map);
  };

  // Handle item select
  const handleItemSelect = (index, itemId) => {
    const selected = items.find((i) => i.itemId === Number(itemId));
    if (!selected) return;

    const newItems = [...form.items];
    const currentItem = newItems[index];

    let defaultQty = currentItem.quantity || "";
    if (form.invoiceNo) {
      const sale = sales.find((s) => s.invoiceNumber === form.invoiceNo);
      const saleItem = sale?.saleItemResponses?.find(
        (it) => it.itemId?.toString() === itemId
      );
      if (saleItem && !currentItem.quantity) {
        defaultQty = saleItem.quantity?.toString() || "";
      }
    }

    newItems[index] = {
      ...currentItem,
      itemId: selected.itemId,
      name: selected.itemName,
      hsn: selected.itemHsn,
      unit: selected.baseUnit,
      ratePerUnit: selected.salePrice.toString(),
      taxType: selected.saleTaxType,
      taxRate: selected.taxRate,
      quantity: defaultQty,
      discountAmount: "0",
    };

    recalculateTotals(newItems);
  };

  // Calculate single item
  const calculateItem = (item) => {
    const qty = parseFloat(item.quantity) || 0;
    const rate = parseFloat(item.ratePerUnit) || 0;
    const discount = parseFloat(item.discountAmount) || 0;
    const taxRate = TAX_RATE_MAP[item.taxRate] || 0;
    const withTax = item.taxType === "WITHTAX";

    let subtotal = qty * rate - discount;
    let taxAmount = 0;

    if (withTax && taxRate > 0) {
      const taxable = subtotal / (1 + taxRate);
      taxAmount = subtotal - taxable;
      subtotal = taxable;
    } else {
      taxAmount = subtotal * taxRate;
    }

    const total = subtotal + taxAmount;

    return {
      ...item,
      totalTaxAmount: parseFloat(taxAmount.toFixed(2)),
      totalAmount: parseFloat(total.toFixed(2)),
    };
  };

  // Recalculate all
  const recalculateTotals = (newItems) => {
    const calculated = newItems.map(calculateItem);
    const totalQty = calculated.reduce((s, i) => s + (parseFloat(i.quantity) || 0), 0);
    const totalDiscount = calculated.reduce((s, i) => s + (parseFloat(i.discountAmount) || 0), 0);
    const totalTax = calculated.reduce((s, i) => s + i.totalTaxAmount, 0);
    const totalAmt = calculated.reduce((s, i) => s + i.totalAmount, 0);
    const paid = parseFloat(form.paidAmount) || 0;
    const balance = totalAmt - paid;

    setForm((prev) => ({
      ...prev,
      items: calculated,
      totalQuantity: totalQty,
      totalDiscount: parseFloat(totalDiscount.toFixed(2)),
      totalTaxAmount: parseFloat(totalTax.toFixed(2)),
      totalAmount: parseFloat(totalAmt.toFixed(2)),
      balanceAmount: parseFloat(balance.toFixed(2)),
    }));
  };

  // Handle quantity change with max limit
  const handleQuantityChange = (index, value) => {
    const num = parseFloat(value) || 0;
    const item = form.items[index];
    const key = item.itemId || item.name;
    const maxQty = maxQtyMap[key] || 0;

    if (maxQty > 0 && num > maxQty) {
      toast.warn(`Max return quantity: ${maxQty}`);
      return;
    }

    const newItems = [...form.items];
    newItems[index].quantity = value;
    recalculateTotals(newItems);
  };

  // Handle other item changes
  const handleItemChange = (index, field, value) => {
    const newItems = [...form.items];
    newItems[index][field] = value;
    recalculateTotals(newItems);
  };

  // Add / Remove item
  const addItem = () => {
    setForm((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          itemId: "",
          name: "",
          hsn: "",
          quantity: "",
          unit: "PIECES",
          ratePerUnit: "",
          taxType: "WITHTAX",
          discountAmount: "0",
          taxRate: "GST18",
          totalTaxAmount: 0,
          totalAmount: 0,
        },
      ],
    }));
  };

  const removeItem = (index) => {
    const newItems = form.items.filter((_, i) => i !== index);
    recalculateTotals(newItems);
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token || !companyId) {
      toast.error("Login and select company");
      return;
    }

    if (!form.partyId || !form.returnNo || !form.returnDate || !form.invoiceNo || !form.phoneNo) {
      toast.error("Fill all required fields");
      return;
    }

    const invalidItem = form.items.some(
      (i) => !i.name || !i.quantity || !i.ratePerUnit || parseFloat(i.quantity) <= 0 || parseFloat(i.ratePerUnit) <= 0
    );
    if (invalidItem) {
      toast.error("Each item must have Name, Qty > 0, Rate > 0");
      return;
    }

    const payload = {
      partyId: parseInt(form.partyId),
      returnNo: form.returnNo.trim(),
      returnDate: form.returnDate,
      phoneNo: form.phoneNo.trim(),
      invoiceNo: form.invoiceNo.trim(),
      invoiceDate: form.invoiceDate,
      totalDiscount: form.totalDiscount,
      totalQuantity: form.totalQuantity,
      totalTaxAmount: form.totalTaxAmount,
      totalAmount: form.totalAmount,
      paidAmount: parseFloat(form.paidAmount) || 0,
      balanceAmount: form.balanceAmount,
      paymentType: form.paymentType,
      stateOfSupply: form.stateOfSupply,
      description: form.description.trim() || null,
      saleReturnItemRequests: form.items.map((i) => ({
        name: i.name.trim(),
        quantity: parseFloat(i.quantity),
        unit: i.unit,
        ratePerUnit: parseFloat(i.ratePerUnit),
        taxType: i.taxType,
        discountAmount: parseFloat(i.discountAmount) || 0,
        taxRate: i.taxRate,
        totalTaxAmount: i.totalTaxAmount,
        totalAmount: i.totalAmount,
      })),
    };

    try {
      setLoading(true);

      if (editId) {
        await axios.put(`${config.BASE_URL}/sale-return/${editId}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        toast.success("Sale Return updated!");
      } else {
        await axios.post(`${config.BASE_URL}/company/${companyId}/create/sale-return`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        toast.success("Sale Return created!");
      }

      navigate("/sales_returns");
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to ${editId ? "update" : "create"} return`);
    } finally {
      setLoading(false);
    }
  };

  const isEditMode = !!editId;

  return (
    <div className={styles["company-form-container"]}>
      {loadingData ? (
        <div className={styles["loading-message"]}>
          <div className={styles.spinner}></div>
          <p>Loading return...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className={styles["form-header"]}>
            <div>
              <h1 className={styles["company-form-title"]}>
                {isEditMode ? "Edit Sale Return" : "Create Sale Return"}
              </h1>
              <p className={styles["form-subtitle"]}>
                {isEditMode ? `Return #${form.returnNo}` : "Return items from an invoice"}
              </p>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                type="button"
                onClick={() => navigate("/sales_returns")}
                className={styles["cancel-button"]}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={styles["submit-button"]}
                disabled={loading || loadingData || !token || !companyId}
              >
                {loading ? "Saving..." : isEditMode ? "Update Return" : "Create Return"}
              </button>
            </div>
          </div>

          {/* Party & Return No */}
          <div className={styles["form-row"]}>
            <div className={styles["form-group"]}>
              <label>Party <span className={styles.required}>*</span></label>
              <select
                value={form.partyId}
                onChange={(e) => setForm({ ...form, partyId: e.target.value })}
                required
                className={styles["form-input"]}
                disabled={!token || !companyId || loadingData}
              >
                <option value="">{token && companyId ? "Select Party" : "Login & Select Company"}</option>
                {parties.map((p) => (
                  <option key={p.partyId} value={p.partyId}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles["form-group"]}>
              <label>Return No <span className={styles.required}>*</span></label>
              <input
                type="text"
                value={form.returnNo}
                onChange={(e) => setForm({ ...form, returnNo: e.target.value })}
                required
                className={styles["form-input"]}
                placeholder="e.g. SR-001"
                disabled={!token || !companyId || loadingData}
              />
            </div>
          </div>

          {/* Dates */}
          <div className={styles["form-row"]}>
            <div className={styles["form-group"]}>
              <label>Return Date <span className={styles.required}>*</span></label>
              <input
                type="date"
                value={form.returnDate}
                onChange={(e) => setForm({ ...form, returnDate: e.target.value })}
                required
                className={styles["form-input"]}
                disabled={!token || !companyId || loadingData}
              />
            </div>
            <div className={styles["form-group"]}>
              <label>Invoice No <span className={styles.required}>*</span></label>
              <select
                value={form.invoiceNo}
                onChange={(e) => {
                  setForm({ ...form, invoiceNo: e.target.value });
                  handleInvoiceSelect(e.target.value);
                }}
                required
                className={styles["form-input"]}
                disabled={!token || !companyId || loadingData}
              >
                <option value="">-- Select Invoice --</option>
                {sales.map((s) => (
                  <option key={s.saleId} value={s.invoiceNumber}>
                    {s.invoiceNumber} ({new Date(s.invoceDate).toLocaleDateString()})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Phone & Payment */}
          <div className={styles["form-row"]}>
            <div className={styles["form-group"]}>
              <label>Phone No <span className={styles.required}>*</span></label>
              <input
                type="text"
                value={form.phoneNo}
                onChange={(e) => setForm({ ...form, phoneNo: e.target.value })}
                required
                className={styles["form-input"]}
                placeholder="10-digit mobile"
                maxLength={10}
                disabled={!token || !companyId || loadingData}
              />
            </div>
            <div className={styles["form-group"]}>
              <label>Payment Type</label>
              <select
                value={form.paymentType}
                onChange={(e) => setForm({ ...form, paymentType: e.target.value })}
                className={styles["form-input"]}
                disabled={!token || !companyId || loadingData}
              >
                {paymentTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* State & Paid */}
          <div className={styles["form-row"]}>
            <div className={styles["form-group"]}>
              <label>State of Supply</label>
              <select
                value={form.stateOfSupply}
                onChange={(e) => setForm({ ...form, stateOfSupply: e.target.value })}
                className={styles["form-input"]}
                disabled={!token || !companyId || loadingData}
              >
                {states.map((s) => (
                  <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
                ))}
              </select>
            </div>
            <div className={styles["form-group"]}>
              <label>Paid Amount</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.paidAmount}
                onChange={(e) => {
                  setForm({ ...form, paidAmount: e.target.value });
                  recalculateTotals(form.items);
                }}
                className={styles["form-input"]}
                placeholder="0.00"
                disabled={!token || !companyId || loadingData}
              />
            </div>
          </div>

          <div className={styles["form-group"]}>
            <label>Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className={`${styles["form-input"]} ${styles.textarea}`}
              placeholder="Optional notes..."
              rows={2}
              disabled={!token || !companyId || loadingData}
            />
          </div>

          {/* Items Section */}
          <div className={styles["card-section"]}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <h4 style={{ margin: 0 }}>Returned Items</h4>
              <button
                type="button"
                onClick={addItem}
                className={styles["submit-button"]}
                style={{ fontSize: "0.8rem", padding: "6px 12px" }}
                disabled={!token || !companyId || loadingItems || loadingData}
              >
                + Add Item
              </button>
            </div>

            {loadingItems && <p className={styles.loading}>Loading items...</p>}

            {form.items.map((item, index) => {
              const key = item.itemId || item.name;
              const maxQty = maxQtyMap[key] || 0;

              return (
                <div key={index} style={{ border: "1px solid #ddd", borderRadius: "6px", padding: "16px", marginBottom: "16px", background: "#fafafa" }}>
                  {/* Item Select & HSN */}
                  <div className={styles["form-row"]}>
                    <div className={styles["form-group"]}>
                      <label>Item Name <span className={styles.required}>*</span></label>
                      <select
                        value={item.itemId}
                        onChange={(e) => handleItemSelect(index, e.target.value)}
                        required
                        className={styles["form-input"]}
                        disabled={!token || !companyId || loadingItems || loadingData}
                      >
                        <option value="">-- Select Item --</option>
                        {items.map((i) => (
                          <option key={i.itemId} value={i.itemId}>
                            {i.itemName} ({i.itemCode})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className={styles["form-group"]}>
                      <label>HSN</label>
                      <input type="text" value={item.hsn} readOnly className={styles["form-input"]} />
                    </div>
                  </div>

                  {/* Quantity with Max (only if > 0) */}
                  <div className={styles["form-row"]}>
                    <div className={styles["form-group"]}>
                      <label>
                        Quantity <span className={styles.required}>*</span>
                        {maxQty > 0 && (
                          <span style={{ fontSize: "0.8rem", color: "#666", marginLeft: "4px" }}>
                            (Max: {maxQty})
                          </span>
                        )}
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(index, e.target.value)}
                        required
                        className={styles["form-input"]}
                        disabled={!token || !companyId || loadingData}
                        placeholder="Enter qty"
                      />
                    </div>
                    <div className={styles["form-group"]}>
                      <label>Unit</label>
                      <input type="text" value={item.unit} readOnly className={styles["form-input"]} />
                    </div>
                  </div>

                  {/* Rate & Tax */}
                  <div className={styles["form-row"]}>
                    <div className={styles["form-group"]}>
                      <label>Rate/Unit <span className={styles.required}>*</span></label>
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={item.ratePerUnit}
                        onChange={(e) => handleItemChange(index, "ratePerUnit", e.target.value)}
                        required
                        className={styles["form-input"]}
                        disabled={!token || !companyId || loadingData}
                      />
                    </div>
                    <div className={styles["form-group"]}>
                      <label>Tax Type</label>
                      <input type="text" value={item.taxType} readOnly className={styles["form-input"]} />
                    </div>
                    <div className={styles["form-group"]}>
                      <label>Tax Rate</label>
                      <input type="text" value={item.taxRate} readOnly className={styles["form-input"]} />
                    </div>
                  </div>

                  {/* Discount & Totals */}
                  <div className={styles["form-row"]}>
                    <div className={styles["form-group"]}>
                      <label>Discount</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={item.discountAmount}
                        onChange={(e) => handleItemChange(index, "discountAmount", e.target.value)}
                        className={styles["form-input"]}
                        placeholder="0.00"
                        disabled={!token || !companyId || loadingData}
                      />
                    </div>
                    <div className={styles["form-group"]}>
                      <label>Tax Amount</label>
                      <div style={{ padding: "10px 12px", background: "#f5f5f5", borderRadius: "6px", fontWeight: "600", color: "#e67e22" }}>
                        ₹{item.totalTaxAmount.toFixed(2)}
                      </div>
                    </div>
                    <div className={styles["form-group"]}>
                      <label>Total</label>
                      <div style={{ padding: "10px 12px", background: "#e8f5e9", borderRadius: "6px", fontWeight: "600", color: "#27ae60" }}>
                        ₹{item.totalAmount.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {form.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className={styles["delete-button"]}
                      style={{ marginTop: "8px", fontSize: "0.8rem" }}
                      disabled={!token || !companyId || loadingData}
                    >
                      Remove Item
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Final Totals */}
          <div className={styles["card-section"]} style={{ background: "#f0f7ff", padding: "16px", borderRadius: "8px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px", fontSize: "1rem" }}>
              <div><strong>Total Qty:</strong> {form.totalQuantity}</div>
              <div><strong>Discount:</strong> ₹{form.totalDiscount.toFixed(2)}</div>
              <div><strong>Tax:</strong> ₹{form.totalTaxAmount.toFixed(2)}</div>
              <div><strong>Total:</strong> ₹{form.totalAmount.toFixed(2)}</div>
              <div><strong>Paid:</strong> ₹{(parseFloat(form.paidAmount) || 0).toFixed(2)}</div>
              <div style={{ color: form.balanceAmount > 0 ? "#e74c3c" : "#27ae60", fontWeight: "600" }}>
                <strong>Balance:</strong> ₹{form.balanceAmount.toFixed(2)}
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default CreateReturns;