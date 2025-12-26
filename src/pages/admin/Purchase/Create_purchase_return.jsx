// import React, { useEffect, useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import axios from "axios";
// import config from "../../../config/apiconfig";
// import styles from "./Purchases.module.css";
// import { toast } from "react-toastify";

// const CreatePurchaseReturn = () => {
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
//   const [purchases, setPurchases] = useState([]);

//   const [maxQtyMap, setMaxQtyMap] = useState({});

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
//     billNo: "",
//     billDate: "",
//     paymentType: "CASH",
//     stateOfSupply: "MAHARASHTRA",
//     description: "",
//     items: [],
//     totalQuantity: 0,
//     totalDiscount: 0,
//     totalTaxAmount: 0,
//     totalAmount: 0,
//     receivedAmount: "0",
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

//   // Fetch Purchases
//   const fetchPurchases = async () => {
//     if (!token || !companyId) return;
//     try {
//       const res = await axios.get(`${config.BASE_URL}/company/${companyId}/purchases`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setPurchases(res.data || []);
//     } catch (err) {
//       toast.error("Failed to load purchases");
//     }
//   };

//   // Load Return for Edit
//   const fetchReturn = async (purchaseReturnId) => {
//     if (!token || !companyId) return;
//     setLoadingData(true);
//     try {
//       const res = await axios.get(`${config.BASE_URL}/purchase-return/${purchaseReturnId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const r = res.data;
//       const returnItems = r.purchaseReturnItemResponses?.map((it) => ({
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
//         billNo: r.billNo || "",
//         billDate: r.billDate || "",
//         paymentType: r.paymentType || "CASH",
//         stateOfSupply: r.stateOfSupply || "MAHARASHTRA",
//         description: r.description || "",
//         items: returnItems,
//         totalQuantity: r.totalQuantity || 0,
//         totalDiscount: r.totalDiscount || 0,
//         totalTaxAmount: r.totalTaxAmount || 0,
//         totalAmount: r.totalAmount || 0,
//         receivedAmount: (r.receivedAmount || 0).toString(),
//         balanceAmount: r.balanceAmount || 0,
//       });

//       const purchase = purchases.find((p) => p.billNo === r.billNo);
//       if (purchase) {
//         const map = {};
//         purchase.purchaseItemResponses?.forEach((it) => {
//           const key = it.itemId?.toString() || it.itemName;
//           map[key] = (map[key] || 0) + (parseFloat(it.quantity) || 0);
//         });
//         setMaxQtyMap(map);
//       }
//     } catch (err) {
//       toast.error("Failed to load return");
//       navigate("/purchase_returns");
//     } finally {
//       setLoadingData(false);
//     }
//   };

//   useEffect(() => {
//     fetchParties();
//     fetchItems();
//     fetchPurchases();

//     if (editId) {
//       fetchReturn(editId);
//     }
//   }, [token, companyId, editId]);

//   // Auto-fill from bill
//   const handleBillSelect = (billNo) => {
//     const purchase = purchases.find((p) => p.billNo === billNo);
//     if (!purchase) return;

//     const newItems = purchase.purchaseItemResponses?.map((it) => ({
//       itemId: it.itemId?.toString() || "",
//       name: it.itemName,
//       hsn: it.itemHsnCode || "",
//       quantity: "0",
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
//       partyId: purchase.partyResponseDto?.partyId?.toString() || "",
//       phoneNo: purchase.partyResponseDto?.phoneNo || "",
//       billDate: purchase.billDate || "",
//       stateOfSupply: purchase.stateOfSupply || "MAHARASHTRA",
//       items: newItems,
//     }));

//     const map = {};
//     purchase.purchaseItemResponses?.forEach((it) => {
//       const key = it.itemId?.toString() || it.itemName;
//       map[key] = (map[key] || 0) + (parseFloat(it.quantity) || 0);
//     });
//     setMaxQtyMap(map);
//   };

//   // Handle item select
//   const handleItemSelect = (index, itemId) => {
//     const selected = items.find((i) => i.itemId === Number(itemId));
//     if (!selected) return;

//     const newItems = [...form.items];
//     const currentItem = newItems[index];

//     let defaultQty = currentItem.quantity || "";
//     if (form.billNo) {
//       const purchase = purchases.find((p) => p.billNo === form.billNo);
//       const purchaseItem = purchase?.purchaseItemResponses?.find(
//         (it) => it.itemId?.toString() === itemId
//       );
//       if (purchaseItem && !currentItem.quantity) {
//         defaultQty = purchaseItem.quantity?.toString() || "";
//       }
//     }

//     newItems[index] = {
//       ...currentItem,
//       itemId: selected.itemId,
//       name: selected.itemName,
//       hsn: selected.itemHsn,
//       unit: selected.baseUnit,
//       ratePerUnit: selected.purchasePrice?.toString() || selected.salePrice?.toString() || "",
//       taxType: selected.purchaseTaxType || selected.saleTaxType || "WITHTAX",
//       taxRate: selected.taxRate || "GST18",
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
//     const received = parseFloat(form.receivedAmount) || 0;
//     const balance = totalAmt - received;

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

//     if (maxQty > 0 && num > maxQty) {
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

//     if (!form.partyId || !form.returnNo || !form.returnDate || !form.billNo || !form.phoneNo) {
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
//       billNo: form.billNo.trim(),
//       billDate: form.billDate,
//       totalDiscount: form.totalDiscount,
//       totalQuantity: form.totalQuantity,
//       totalTaxAmount: form.totalTaxAmount,
//       totalAmount: form.totalAmount,
//       receivedAmount: parseFloat(form.receivedAmount) || 0,
//       balanceAmount: form.balanceAmount,
//       paymentType: form.paymentType,
//       stateOfSupply: form.stateOfSupply,
//       description: form.description.trim() || null,
//       purchaseReturnItemRequests: form.items.map((i) => ({
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
//         await axios.put(`${config.BASE_URL}/purchase-return/${editId}`, payload, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         });
//         toast.success("Purchase Return updated!");
//       } else {
//         await axios.post(`${config.BASE_URL}/company/${companyId}/create/purchase-return`, payload, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         });
//         toast.success("Purchase Return created!");
//       }

//       navigate("/purchase_returns");
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
//                 {isEditMode ? "Edit Purchase Return" : "Create Purchase Return"}
//               </h1>
//               <p className={styles["form-subtitle"]}>
//                 {isEditMode ? `Return #${form.returnNo}` : "Return items from a bill"}
//               </p>
//             </div>
//             <div style={{ display: "flex", gap: "8px" }}>
//               <button
//                 type="button"
//                 onClick={() => navigate("/purchase_returns")}
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
//                 placeholder="e.g. PR-001"
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
//               <label>Bill No <span className={styles.required}>*</span></label>
//               <select
//                 value={form.billNo}
//                 onChange={(e) => {
//                   setForm({ ...form, billNo: e.target.value });
//                   handleBillSelect(e.target.value);
//                 }}
//                 required
//                 className={styles["form-input"]}
//                 disabled={!token || !companyId || loadingData}
//               >
//                 <option value="">-- Select Bill --</option>
//                 {purchases.map((p) => (
//                   <option key={p.purchaseId} value={p.billNo}>
//                     {p.billNo} ({new Date(p.billDate).toLocaleDateString()})
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

//           {/* State & Received */}
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
//               <label>Received Amount</label>
//               <input
//                 type="number"
//                 step="0.01"
//                 min="0"
//                 value={form.receivedAmount}
//                 onChange={(e) => {
//                   setForm({ ...form, receivedAmount: e.target.value });
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

//                   {/* Quantity with Max (only if > 0) */}
//                   <div className={styles["form-row"]}>
//                     <div className={styles["form-group"]}>
//                       <label>
//                         Quantity <span className={styles.required}>*</span>
//                         {maxQty > 0 && (
//                           <span style={{ fontSize: "0.8rem", color: "#666", marginLeft: "4px" }}>
//                             (Max: {maxQty})
//                           </span>
//                         )}
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
//               <div><strong>Received:</strong> ₹{(parseFloat(form.receivedAmount) || 0).toFixed(2)}</div>
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

// export default CreatePurchaseReturn;











// import React, { useEffect, useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import axios from "axios";
// import config from "../../../config/apiconfig";
// import styles from "./Purchases.module.css";
// import { toast } from "react-toastify";

// const CreatePurchaseReturn = () => {
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
//   const [purchases, setPurchases] = useState([]);

//   const [maxQtyMap, setMaxQtyMap] = useState({});

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
//     billNo: "",
//     billDate: "",
//     paymentType: "CASH",
//     stateOfSupply: "MAHARASHTRA",
//     description: "",
//     items: [],
//     totalQuantity: 0,
//     totalDiscount: 0,
//     totalTaxAmount: 0,
//     totalAmount: 0,
//     receivedAmount: "0",
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
//       console.log("Fetched parties:", res.data);
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

//   // Fetch Purchases
//   const fetchPurchases = async () => {
//     if (!token || !companyId) return;
//     try {
//       const res = await axios.get(`${config.BASE_URL}/company/${companyId}/purchases`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setPurchases(res.data || []);
//     } catch (err) {
//       toast.error("Failed to load purchases");
//     }
//   };

//   // Load Return for Edit
//   const fetchReturn = async (purchaseReturnId) => {
//     if (!token || !companyId) return;
//     setLoadingData(true);
//     try {
//       const res = await axios.get(`${config.BASE_URL}/purchase-return/${purchaseReturnId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const r = res.data;
//       const returnItems = r.purchaseReturnItemResponses?.map((it) => ({
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
//         billNo: r.billNo || "",
//         billDate: r.billDate || "",
//         paymentType: r.paymentType || "CASH",
//         stateOfSupply: r.stateOfSupply || "MAHARASHTRA",
//         description: r.description || "",
//         items: returnItems,
//         totalQuantity: r.totalQuantity || 0,
//         totalDiscount: r.totalDiscount || 0,
//         totalTaxAmount: r.totalTaxAmount || 0,
//         totalAmount: r.totalAmount || 0,
//         receivedAmount: (r.receivedAmount || 0).toString(),
//         balanceAmount: r.balanceAmount || 0,
//       });

//       const purchase = purchases.find((p) => p.billNo === r.billNo);
//       if (purchase) {
//         const map = {};
//         purchase.purchaseItemResponses?.forEach((it) => {
//           const key = it.itemId?.toString() || it.itemName;
//           map[key] = (map[key] || 0) + (parseFloat(it.quantity) || 0);
//         });
//         setMaxQtyMap(map);
//       }
//     } catch (err) {
//       toast.error("Failed to load return");
//       navigate("/purchase_returns");
//     } finally {
//       setLoadingData(false);
//     }
//   };

//   useEffect(() => {
//     fetchParties();
//     fetchItems();
//     fetchPurchases();

//     if (editId) {
//       fetchReturn(editId);
//     }
//   }, [token, companyId, editId]);

//   // Auto-fill from bill
//   const handleBillSelect = (billNo) => {
//     const purchase = purchases.find((p) => p.billNo === billNo);
//     if (!purchase) return;

//     const newItems = purchase.purchaseItemResponses?.map((it) => ({
//       itemId: it.itemId?.toString() || "",
//       name: it.itemName,
//       hsn: it.itemHsnCode || "",
//       quantity: "0",
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
//       partyId: purchase.partyResponseDto?.partyId?.toString() || "",
//       phoneNo: purchase.partyResponseDto?.phoneNo || "",
//       billDate: purchase.billDate || "",
//       stateOfSupply: purchase.stateOfSupply || "MAHARASHTRA",
//       items: newItems,
//     }));

//     const map = {};
//     purchase.purchaseItemResponses?.forEach((it) => {
//       const key = it.itemId?.toString() || it.itemName;
//       map[key] = (map[key] || 0) + (parseFloat(it.quantity) || 0);
//     });
//     setMaxQtyMap(map);
//   };

//   // Handle item select
//   const handleItemSelect = (index, itemId) => {
//     const selected = items.find((i) => i.itemId === Number(itemId));
//     if (!selected) return;

//     const newItems = [...form.items];
//     const currentItem = newItems[index];

//     let defaultQty = currentItem.quantity || "";
//     if (form.billNo) {
//       const purchase = purchases.find((p) => p.billNo === form.billNo);
//       const purchaseItem = purchase?.purchaseItemResponses?.find(
//         (it) => it.itemId?.toString() === itemId
//       );
//       if (purchaseItem && !currentItem.quantity) {
//         defaultQty = purchaseItem.quantity?.toString() || "";
//       }
//     }

//     newItems[index] = {
//       ...currentItem,
//       itemId: selected.itemId,
//       name: selected.itemName,
//       hsn: selected.itemHsn,
//       unit: selected.baseUnit,
//       ratePerUnit: selected.purchasePrice?.toString() || selected.salePrice?.toString() || "",
//       taxType: selected.purchaseTaxType || selected.saleTaxType || "WITHTAX",
//       taxRate: selected.taxRate || "GST18",
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
//     const received = parseFloat(form.receivedAmount) || 0;
//     const balance = totalAmt - received;

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

//     if (maxQty > 0 && num > maxQty) {
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

//     if (!form.partyId || !form.returnNo || !form.returnDate || !form.billNo || !form.phoneNo) {
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
//       billNo: form.billNo.trim(),
//       billDate: form.billDate,
//       totalDiscount: form.totalDiscount,
//       totalQuantity: form.totalQuantity,
//       totalTaxAmount: form.totalTaxAmount,
//       totalAmount: form.totalAmount,
//       receivedAmount: parseFloat(form.receivedAmount) || 0,
//       balanceAmount: form.balanceAmount,
//       paymentType: form.paymentType,
//       stateOfSupply: form.stateOfSupply,
//       description: form.description.trim() || null,
//       purchaseReturnItemRequests: form.items.map((i) => ({
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
//         await axios.put(`${config.BASE_URL}/purchase-return/${editId}`, payload, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         });
//         toast.success("Purchase Return updated!");
//       } else {
//         await axios.post(`${config.BASE_URL}/company/${companyId}/create/purchase-return`, payload, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         });
//         toast.success("Purchase Return created!");
//       }

//       navigate("/purchase_returns");
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
//                 {isEditMode ? "Edit Purchase Return" : "Create Purchase Return"}
//               </h1>
//               <p className={styles["form-subtitle"]}>
//                 {isEditMode ? `Return #${form.returnNo}` : "Return items from a bill"}
//               </p>
//             </div>
//             <div style={{ display: "flex", gap: "8px" }}>
//               <button
//                 type="button"
//                 onClick={() => navigate("/purchase_returns")}
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
//                 placeholder="e.g. PR-001"
//                 disabled={!token || !companyId || loadingData}
//               />
//             </div>
//           </div>

//           {/* Dates + Bill No with Invoice */}
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
//               <label>Bill No <span className={styles.required}>*</span></label>
//               <select
//                 value={form.billNo}
//                 onChange={(e) => {
//                   setForm({ ...form, billNo: e.target.value });
//                   handleBillSelect(e.target.value);
//                 }}
//                 required
//                 className={styles["form-input"]}
//                 disabled={!token || !companyId || loadingData}
//               >
//                 <option value="">-- Select Bill --</option>
//                 {purchases.map((p) => (
//                   <option key={p.purchaseId} value={p.billNo}>
//                     {p.billNo} ({p.invoiceNo || "No Invoice"})
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

//           {/* State & Received */}
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
//               <label>Received Amount</label>
//               <input
//                 type="number"
//                 step="0.01"
//                 min="0"
//                 value={form.receivedAmount}
//                 onChange={(e) => {
//                   setForm({ ...form, receivedAmount: e.target.value });
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

//                   {/* Quantity with Max (only if > 0) */}
//                   <div className={styles["form-row"]}>
//                     <div className={styles["form-group"]}>
//                       <label>
//                         Quantity <span className={styles.required}>*</span>
//                         {maxQty > 0 && (
//                           <span style={{ fontSize: "0.8rem", color: "#666", marginLeft: "4px" }}>
//                             (Max: {maxQty})
//                           </span>
//                         )}
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
//               <div><strong>Received:</strong> ₹{(parseFloat(form.receivedAmount) || 0).toFixed(2)}</div>
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

// export default CreatePurchaseReturn;







// "use client"

// import React, { useEffect, useState } from "react"
// import { useNavigate, useLocation } from "react-router-dom"
// import axios from "axios"
// import config from "../../../config/apiconfig"
// import styles from "../Styles/Form.module.css" // Unified style
// import { toast } from "react-toastify"
// import {
//   Plus,
//   Trash2,
//   ArrowLeft,
//   CheckCircle,
//   Package,
//   Users,
//   Calendar,
//   CreditCard,
//   MapPin,
//   FileText,
//   IndianRupee,
//   Loader,
//   Phone,
//   Receipt,
// } from "lucide-react"

// const CreatePurchaseReturn = () => {
//   const navigate = useNavigate()
//   const location = useLocation()
//   const queryParams = new URLSearchParams(location.search)
//   const editId = queryParams.get("edit")

//   const userData = JSON.parse(localStorage.getItem("eBilling")) || {}
//   const token = userData?.accessToken || ""
//   const companyId = userData?.selectedCompany?.id || ""

//   const [loading, setLoading] = useState(false)
//   const [loadingData, setLoadingData] = useState(false)
//   const [loadingItems, setLoadingItems] = useState(false)
//   const [parties, setParties] = useState([])
//   const [items, setItems] = useState([])
//   const [purchases, setPurchases] = useState([])
//   const [maxQtyMap, setMaxQtyMap] = useState({})

//   const paymentTypes = ["CASH", "UPI", "CREDIT_CARD", "DEBIT_CARD", "NET_BANKING", "WALLET", "CHEQUE", "OTHER"]
//   const states = [
//     "ANDHRA_PRADESH", "ARUNACHAL_PRADESH", "ASSAM", "BIHAR", "CHHATTISGARH", "GOA", "GUJARAT", "HARYANA",
//     "HIMACHAL_PRADESH", "JHARKHAND", "KARNATAKA", "KERALA", "MADHYA_PRADESH", "MAHARASHTRA", "MANIPUR",
//     "MEGHALAYA", "MIZORAM", "NAGALAND", "ODISHA", "PUNJAB", "RAJASTHAN", "SIKKIM", "TAMIL_NADU", "TELANGANA",
//     "TRIPURA", "UTTAR_PRADESH", "UTTARAKHAND", "WEST_BENGAL", "OTHER",
//   ]

//   const TAX_RATE_MAP = {
//     NONE: 0, EXEMPTED: 0,
//     GST0: 0, IGST0: 0,
//     GST0POINT25: 0.0025, IGST0POINT25: 0.0025,
//     GST3: 0.03, IGST3: 0.03,
//     GST5: 0.05, IGST5: 0.05,
//     GST12: 0.12, IGST12: 0.12,
//     GST18: 0.18, IGST18: 0.18,
//     GST28: 0.28, IGST28: 0.28,
//   }

//   const [form, setForm] = useState({
//     partyId: "",
//     returnNo: "",
//     returnDate: new Date().toISOString().split("T")[0],
//     phoneNo: "",
//     billNo: "",
//     billDate: "",
//     paymentType: "CASH",
//     stateOfSupply: "MAHARASHTRA",
//     description: "",
//     items: [],
//     totalQuantity: 0,
//     totalDiscount: 0,
//     totalTaxAmount: 0,
//     totalAmount: 0,
//     receivedAmount: "0",
//     balanceAmount: 0,
//   })

//   /* ==================== FETCH DATA ==================== */
//   const fetchParties = async () => {
//     if (!token || !companyId) return
//     try {
//       const res = await axios.get(`${config.BASE_URL}/company/${companyId}/parties`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       setParties(res.data || [])
//     } catch (err) {
//       toast.error("Failed to load parties")
//     }
//   }

//   const fetchItems = async () => {
//     if (!token || !companyId) return
//     setLoadingItems(true)
//     try {
//       const res = await axios.get(`${config.BASE_URL}/company/${companyId}/items`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       setItems(res.data || [])
//     } catch (err) {
//       toast.error("Failed to load items")
//     } finally {
//       setLoadingItems(false)
//     }
//   }

//   const fetchPurchases = async () => {
//     if (!token || !companyId) return
//     try {
//       const res = await axios.get(`${config.BASE_URL}/company/${companyId}/purchases`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       setPurchases(res.data || [])
//     } catch (err) {
//       toast.error("Failed to load purchases")
//     }
//   }

//   const fetchReturn = async (purchaseReturnId) => {
//     if (!token || !companyId) return
//     setLoadingData(true)
//     try {
//       const res = await axios.get(`${config.BASE_URL}/purchase-return/${purchaseReturnId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })

//       const r = res.data
//       const returnItems = r.purchaseReturnItemResponses?.map((it) => ({
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
//       })) || []

//       setForm({
//         partyId: r.partyResponseDto?.partyId?.toString() || "",
//         returnNo: r.returnNo || "",
//         returnDate: r.returnDate || "",
//         phoneNo: r.phoneNo || "",
//         billNo: r.billNo || "",
//         billDate: r.billDate || "",
//         paymentType: r.paymentType || "CASH",
//         stateOfSupply: r.stateOfSupply || "MAHARASHTRA",
//         description: r.description || "",
//         items: returnItems,
//         totalQuantity: r.totalQuantity || 0,
//         totalDiscount: r.totalDiscount || 0,
//         totalTaxAmount: r.totalTaxAmount || 0,
//         totalAmount: r.totalAmount || 0,
//         receivedAmount: (r.receivedAmount || 0).toString(),
//         balanceAmount: r.balanceAmount || 0,
//       })

//       const purchase = purchases.find((p) => p.billNo === r.billNo)
//       if (purchase) {
//         const map = {}
//         purchase.purchaseItemResponses?.forEach((it) => {
//           const key = it.itemId?.toString() || it.itemName
//           map[key] = (map[key] || 0) + (parseFloat(it.quantity) || 0)
//         })
//         setMaxQtyMap(map)
//       }
//     } catch (err) {
//       toast.error("Failed to load return")
//       navigate("/purchase_returns")
//     } finally {
//       setLoadingData(false)
//     }
//   }

//   useEffect(() => {
//     fetchParties()
//     fetchItems()
//     fetchPurchases()

//     if (editId) {
//       fetchReturn(editId)
//     }
//   }, [token, companyId, editId])

//   /* ==================== BILL & ITEM HANDLING ==================== */
//   const handleBillSelect = (billNo) => {
//     const purchase = purchases.find((p) => p.billNo === billNo)
//     if (!purchase) return

//     const newItems = purchase.purchaseItemResponses?.map((it) => ({
//       itemId: it.itemId?.toString() || "",
//       name: it.itemName,
//       hsn: it.itemHsnCode || "",
//       quantity: "0",
//       unit: it.unit,
//       ratePerUnit: it.pricePerUnit?.toString() || "",
//       taxType: it.pricePerUnitTaxType || "WITHTAX",
//       discountAmount: "0",
//       taxRate: it.taxRate || "GST18",
//       totalTaxAmount: 0,
//       totalAmount: 0,
//     })) || []

//     setForm((prev) => ({
//       ...prev,
//       partyId: purchase.partyResponseDto?.partyId?.toString() || "",
//       phoneNo: purchase.partyResponseDto?.phoneNo || "",
//       billDate: purchase.billDate || "",
//       stateOfSupply: purchase.stateOfSupply || "MAHARASHTRA",
//       items: newItems,
//     }))

//     const map = {}
//     purchase.purchaseItemResponses?.forEach((it) => {
//       const key = it.itemId?.toString() || it.itemName
//       map[key] = (map[key] || 0) + (parseFloat(it.quantity) || 0)
//     })
//     setMaxQtyMap(map)
//   }

//   const handleItemSelect = (index, itemId) => {
//     const selected = items.find((i) => i.itemId === Number(itemId))
//     if (!selected) return

//     const newItems = [...form.items]
//     const currentItem = newItems[index]

//     let defaultQty = currentItem.quantity || ""
//     if (form.billNo) {
//       const purchase = purchases.find((p) => p.billNo === form.billNo)
//       const purchaseItem = purchase?.purchaseItemResponses?.find(
//         (it) => it.itemId?.toString() === itemId
//       )
//       if (purchaseItem && !currentItem.quantity) {
//         defaultQty = purchaseItem.quantity?.toString() || ""
//       }
//     }

//     newItems[index] = {
//       ...currentItem,
//       itemId: selected.itemId,
//       name: selected.itemName,
//       hsn: selected.itemHsn,
//       unit: selected.baseUnit,
//       ratePerUnit: selected.purchasePrice?.toString() || selected.salePrice?.toString() || "",
//       taxType: selected.purchaseTaxType || selected.saleTaxType || "WITHTAX",
//       taxRate: selected.taxRate || "GST18",
//       quantity: defaultQty,
//       discountAmount: "0",
//     }

//     recalculateTotals(newItems)
//   }

//   /* ==================== CALCULATIONS ==================== */
//   const calculateItem = (item) => {
//     const qty = parseFloat(item.quantity) || 0
//     const rate = parseFloat(item.ratePerUnit) || 0
//     const discount = parseFloat(item.discountAmount) || 0
//     const taxRate = TAX_RATE_MAP[item.taxRate] || 0
//     const withTax = item.taxType === "WITHTAX"

//     let subtotal = qty * rate - discount
//     let taxAmount = 0

//     if (withTax && taxRate > 0) {
//       const taxable = subtotal / (1 + taxRate)
//       taxAmount = subtotal - taxable
//       subtotal = taxable
//     } else {
//       taxAmount = subtotal * taxRate
//     }

//     const total = subtotal + taxAmount

//     return {
//       ...item,
//       totalTaxAmount: parseFloat(taxAmount.toFixed(2)),
//       totalAmount: parseFloat(total.toFixed(2)),
//     }
//   }

//   const recalculateTotals = (newItems) => {
//     const calculated = newItems.map(calculateItem)
//     const totalQty = calculated.reduce((s, i) => s + (parseFloat(i.quantity) || 0), 0)
//     const totalDiscount = calculated.reduce((s, i) => s + (parseFloat(i.discountAmount) || 0), 0)
//     const totalTax = calculated.reduce((s, i) => s + i.totalTaxAmount, 0)
//     const totalAmt = calculated.reduce((s, i) => s + i.totalAmount, 0)
//     const received = parseFloat(form.receivedAmount) || 0
//     const balance = totalAmt - received

//     setForm((prev) => ({
//       ...prev,
//       items: calculated,
//       totalQuantity: totalQty,
//       totalDiscount: parseFloat(totalDiscount.toFixed(2)),
//       totalTaxAmount: parseFloat(totalTax.toFixed(2)),
//       totalAmount: parseFloat(totalAmt.toFixed(2)),
//       balanceAmount: parseFloat(balance.toFixed(2)),
//     }))
//   }

//   const handleQuantityChange = (index, value) => {
//     const num = parseFloat(value) || 0
//     const item = form.items[index]
//     const key = item.itemId || item.name
//     const maxQty = maxQtyMap[key] || 0

//     if (maxQty > 0 && num > maxQty) {
//       toast.warn(`Max return quantity: ${maxQty}`)
//       return
//     }

//     const newItems = [...form.items]
//     newItems[index].quantity = value
//     recalculateTotals(newItems)
//   }

//   const handleItemChange = (index, field, value) => {
//     const newItems = [...form.items]
//     newItems[index][field] = value
//     recalculateTotals(newItems)
//   }

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
//     }))
//   }

//   const removeItem = (index) => {
//     const newItems = form.items.filter((_, i) => i !== index)
//     recalculateTotals(newItems)
//   }

//   /* ==================== SUBMIT ==================== */
//   const handleSubmit = async (e) => {
//     e.preventDefault()

//     if (!token || !companyId) {
//       toast.error("Login and select company")
//       return
//     }

//     if (!form.partyId || !form.returnNo || !form.returnDate || !form.billNo || !form.phoneNo) {
//       toast.error("Fill all required fields")
//       return
//     }

//     const invalidItem = form.items.some(
//       (i) => !i.name || !i.quantity || !i.ratePerUnit || parseFloat(i.quantity) <= 0 || parseFloat(i.ratePerUnit) <= 0
//     )
//     if (invalidItem) {
//       toast.error("Each item must have Name, Qty > 0, Rate > 0")
//       return
//     }

//     const payload = {
//       partyId: parseInt(form.partyId),
//       returnNo: form.returnNo.trim(),
//       returnDate: form.returnDate,
//       phoneNo: form.phoneNo.trim(),
//       billNo: form.billNo.trim(),
//       billDate: form.billDate,
//       totalDiscount: form.totalDiscount,
//       totalQuantity: form.totalQuantity,
//       totalTaxAmount: form.totalTaxAmount,
//       totalAmount: form.totalAmount,
//       receivedAmount: parseFloat(form.receivedAmount) || 0,
//       balanceAmount: form.balanceAmount,
//       paymentType: form.paymentType,
//       stateOfSupply: form.stateOfSupply,
//       description: form.description.trim() || null,
//       purchaseReturnItemRequests: form.items.map((i) => ({
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
//     }

//     try {
//       setLoading(true)

//       if (editId) {
//         await axios.put(`${config.BASE_URL}/purchase-return/${editId}`, payload, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         })
//         toast.success("Purchase Return updated!")
//       } else {
//         await axios.post(`${config.BASE_URL}/company/${companyId}/create/purchase-return`, payload, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         })
//         toast.success("Purchase Return created!")
//       }

//       navigate("/purchase_returns")
//     } catch (err) {
//       toast.error(err.response?.data?.message || `Failed to ${editId ? "update" : "create"} return`)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const isEditMode = !!editId

//   /* ==================== RENDER ==================== */
//   return (
//     <div className={styles.container}>
//       {loadingData ? (
//         <div className={styles.loadingContainer}>
//           <Loader className={styles.spinnerIcon} />
//           <p>Loading return...</p>
//         </div>
//       ) : (
//         <form onSubmit={handleSubmit} className={styles.form}>
//           {/* Header */}
//           <div className={styles.header}>
//             <div className={styles.headerContent}>
//               <div className={styles.titleSection}>
//                 <h1 className={styles.title}>
//                   {isEditMode ? (
//                     <>
//                       <CheckCircle className={styles.titleIcon} />
//                       Edit Purchase Return
//                     </>
//                   ) : (
//                     <>
//                       <FileText className={styles.titleIcon} />
//                       Create Purchase Return
//                     </>
//                   )}
//                 </h1>
//                 <p className={styles.subtitle}>
//                   {isEditMode ? `Return #${form.returnNo}` : "Return items from a bill"}
//                 </p>
//               </div>
//             </div>
//             <div className={styles.headerActions}>
//               <button
//                 type="button"
//                 onClick={() => navigate("/purchase_returns")}
//                 className={styles.buttonSecondary}
//                 disabled={loading}
//               >
//                 <ArrowLeft size={18} />
//                 Back
//               </button>
//               <button
//                 type="submit"
//                 className={styles.buttonPrimary}
//                 disabled={loading || loadingData || !token || !companyId}
//               >
//                 {loading ? (
//                   <>
//                     <Loader size={18} className={styles.spinnerSmall} />
//                     Saving...
//                   </>
//                 ) : (
//                   <>
//                     <CheckCircle size={18} />
//                     {isEditMode ? "Update Return" : "Create Return"}
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>

//           {/* Party & Return Info */}
//           <div className={styles.formSection}>
//             <h2 className={styles.sectionTitle}>
//               <Users size={20} />
//               Return Information
//             </h2>
//             <div className={styles.formGrid}>
//               <div className={styles.formGroup}>
//                 <label htmlFor="party" className={styles.label}>
//                   Party <span className={styles.required}>*</span>
//                 </label>
//                 <select
//                   id="party"
//                   value={form.partyId}
//                   onChange={(e) => setForm({ ...form, partyId: e.target.value })}
//                   required
//                   className={styles.input}
//                   disabled={!token || !companyId || loadingData}
//                 >
//                   <option value="">
//                     {token && companyId ? "Select Party" : "Login & Select Company"}
//                   </option>
//                   {parties.map((p) => (
//                     <option key={p.partyId} value={p.partyId}>
//                       {p.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div className={styles.formGroup}>
//                 <label htmlFor="returnNo" className={styles.label}>
//                   Return No <span className={styles.required}>*</span>
//                 </label>
//                 <input
//                   id="returnNo"
//                   type="text"
//                   value={form.returnNo}
//                   onChange={(e) => setForm({ ...form, returnNo: e.target.value })}
//                   required
//                   className={styles.input}
//                   placeholder="e.g. PR-001"
//                   disabled={!token || !companyId || loadingData}
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Dates & Bill */}
//           <div className={styles.formSection}>
//             <h2 className={styles.sectionTitle}>
//               <Calendar size={20} />
//               Return & Bill Details
//             </h2>
//             <div className={styles.formGrid}>
//               <div className={styles.formGroup}>
//                 <label htmlFor="returnDate" className={styles.label}>
//                   Return Date <span className={styles.required}>*</span>
//                 </label>
//                 <input
//                   id="returnDate"
//                   type="date"
//                   value={form.returnDate}
//                   onChange={(e) => setForm({ ...form, returnDate: e.target.value })}
//                   required
//                   className={styles.input}
//                   disabled={!token || !companyId || loadingData}
//                 />
//               </div>

//               <div className={styles.formGroup}>
//                 <label htmlFor="billNo" className={styles.label}>
//                   Bill No <span className={styles.required}>*</span>
//                 </label>
//                 <div className={styles.inputIcon}>
//                   <Receipt size={18} />
//                   <select
//                     id="billNo"
//                     value={form.billNo}
//                     onChange={(e) => {
//                       setForm({ ...form, billNo: e.target.value })
//                       handleBillSelect(e.target.value)
//                     }}
//                     required
//                     className={styles.input}
//                     disabled={!token || !companyId || loadingData}
//                   >
//                     <option value="">-- Select Bill --</option>
//                     {purchases.map((p) => (
//                       <option key={p.purchaseId} value={p.billNo}>
//                         {p.billNo} ({p.invoiceNo || "No Invoice"})
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Phone & Payment */}
//           <div className={styles.formSection}>
//             <h2 className={styles.sectionTitle}>
//               <Phone size={20} />
//               Contact & Payment
//             </h2>
//             <div className={styles.formGrid}>
//               <div className={styles.formGroup}>
//                 <label htmlFor="phoneNo" className={styles.label}>
//                   Phone No <span className={styles.required}>*</span>
//                 </label>
//                 <div className={styles.inputIcon}>
//                   <Phone size={18} />
//                   <input
//                     id="phoneNo"
//                     type="text"
//                     value={form.phoneNo}
//                     onChange={(e) => setForm({ ...form, phoneNo: e.target.value })}
//                     required
//                     className={styles.input}
//                     placeholder="10-digit mobile"
//                     maxLength={10}
//                     disabled={!token || !companyId || loadingData}
//                   />
//                 </div>
//               </div>

//               <div className={styles.formGroup}>
//                 <label htmlFor="paymentType" className={styles.label}>
//                   Payment Type
//                 </label>
//                 <select
//                   id="paymentType"
//                   value={form.paymentType}
//                   onChange={(e) => setForm({ ...form, paymentType: e.target.value })}
//                   className={styles.input}
//                   disabled={!token || !companyId || loadingData}
//                 >
//                   {paymentTypes.map((t) => (
//                     <option key={t} value={t}>
//                       {t.replace(/_/g, " ")}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div className={styles.formGroup}>
//                 <label htmlFor="state" className={styles.label}>
//                   State of Supply
//                 </label>
//                 <div className={styles.inputIcon}>
//                   <MapPin size={18} />
//                   <select
//                     id="state"
//                     value={form.stateOfSupply}
//                     onChange={(e) => setForm({ ...form, stateOfSupply: e.target.value })}
//                     className={styles.input}
//                     disabled={!token || !companyId || loadingData}
//                   >
//                     {states.map((s) => (
//                       <option key={s} value={s}>
//                         {s.replace(/_/g, " ")}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               <div className={styles.formGroup}>
//                 <label htmlFor="receivedAmount" className={styles.label}>
//                   Received Amount
//                 </label>
//                 <div className={styles.inputIcon}>
//                   <IndianRupee size={18} />
//                   <input
//                     id="receivedAmount"
//                     type="number"
//                     step="0.01"
//                     min="0"
//                     value={form.receivedAmount}
//                     onChange={(e) => {
//                       setForm({ ...form, receivedAmount: e.target.value })
//                       recalculateTotals(form.items)
//                     }}
//                     className={styles.input}
//                     placeholder="0.00"
//                     disabled={!token || !companyId || loadingData}
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Description */}
//           <div className={styles.formSection}>
//             <label htmlFor="description" className={styles.label}>
//               Description
//             </label>
//             <textarea
//               id="description"
//               value={form.description}
//               onChange={(e) => setForm({ ...form, description: e.target.value })}
//               className={`${styles.input} ${styles.textarea}`}
//               placeholder="Optional notes..."
//               rows={3}
//               disabled={!token || !companyId || loadingData}
//             />
//           </div>

//           {/* Items Section */}
//           <div className={styles.formSection}>
//             <div className={styles.itemsHeader}>
//               <h2 className={styles.sectionTitle}>
//                 <Package size={20} />
//                 Returned Items
//               </h2>
//               <button
//                 type="button"
//                 onClick={addItem}
//                 className={styles.buttonAdd}
//                 disabled={!token || !companyId || loadingItems || loadingData}
//               >
//                 <Plus size={18} />
//                 Add Item
//               </button>
//             </div>

//             {loadingItems && (
//               <div className={styles.loadingMessage}>
//                 <Loader size={20} className={styles.spinnerSmall} />
//                 Loading items...
//               </div>
//             )}

//             <div className={styles.itemsList}>
//               {form.items.map((item, index) => {
//                 const key = item.itemId || item.name
//                 const maxQty = maxQtyMap[key] || 0

//                 return (
//                   <div key={index} className={styles.itemCard}>
//                     <div className={styles.itemHeader}>
//                       <span className={styles.itemNumber}>Item {index + 1}</span>
//                       {form.items.length > 1 && (
//                         <button
//                           type="button"
//                           onClick={() => removeItem(index)}
//                           className={styles.buttonDelete}
//                           disabled={!token || !companyId || loadingData}
//                           aria-label="Remove item"
//                         >
//                           <Trash2 size={18} />
//                         </button>
//                       )}
//                     </div>

//                     {/* Item & HSN */}
//                     <div className={styles.itemGrid}>
//                       <div className={styles.formGroup}>
//                         <label className={styles.label}>
//                           Item Name <span className={styles.required}>*</span>
//                         </label>
//                         <select
//                           value={item.itemId}
//                           onChange={(e) => handleItemSelect(index, e.target.value)}
//                           required
//                           className={styles.input}
//                           disabled={!token || !companyId || loadingItems || loadingData}
//                         >
//                           <option value="">-- Select Item --</option>
//                           {items.map((i) => (
//                             <option key={i.itemId} value={i.itemId}>
//                               {i.itemName} ({i.itemCode})
//                             </option>
//                           ))}
//                         </select>
//                       </div>

//                       <div className={styles.formGroup}>
//                         <label className={styles.label}>HSN</label>
//                         <input
//                           type="text"
//                           value={item.hsn}
//                           readOnly
//                           className={`${styles.input} ${styles.inputReadonly}`}
//                         />
//                       </div>
//                     </div>

//                     {/* Quantity & Unit */}
//                     <div className={styles.itemGrid}>
//                       <div className={styles.formGroup}>
//                         <label className={styles.label}>
//                           Quantity <span className={styles.required}>*</span>
//                           {maxQty > 0 && (
//                             <span className={styles.maxQtyLabel}>(Max: {maxQty})</span>
//                           )}
//                         </label>
//                         <input
//                           type="number"
//                           step="0.01"
//                           min="0.01"
//                           value={item.quantity}
//                           onChange={(e) => handleQuantityChange(index, e.target.value)}
//                           required
//                           className={styles.input}
//                           disabled={!token || !companyId || loadingData}
//                           placeholder="Enter qty"
//                         />
//                       </div>

//                       <div className={styles.formGroup}>
//                         <label className={styles.label}>Unit</label>
//                         <input
//                           type="text"
//                           value={item.unit}
//                           readOnly
//                           className={`${styles.input} ${styles.inputReadonly}`}
//                         />
//                       </div>
//                     </div>

//                     {/* Rate & Tax */}
//                     <div className={styles.itemGrid}>
//                       <div className={styles.formGroup}>
//                         <label className={styles.label}>
//                           Rate/Unit <span className={styles.required}>*</span>
//                         </label>
//                         <input
//                           type="number"
//                           step="0.01"
//                           min="0.01"
//                           value={item.ratePerUnit}
//                           onChange={(e) => handleItemChange(index, "ratePerUnit", e.target.value)}
//                           required
//                           className={styles.input}
//                           disabled={!token || !companyId || loadingData}
//                         />
//                       </div>

//                       <div className={styles.formGroup}>
//                         <label className={styles.label}>Tax Type</label>
//                         <input
//                           type="text"
//                           value={item.taxType}
//                           readOnly
//                           className={`${styles.input} ${styles.inputReadonly}`}
//                         />
//                       </div>

//                       <div className={styles.formGroup}>
//                         <label className={styles.label}>Tax Rate</label>
//                         <input
//                           type="text"
//                           value={item.taxRate}
//                           readOnly
//                           className={`${styles.input} ${styles.inputReadonly}`}
//                         />
//                       </div>
//                     </div>

//                     {/* Discount & Totals */}
//                     <div className={styles.itemGrid}>
//                       <div className={styles.formGroup}>
//                         <label className={styles.label}>Discount</label>
//                         <div className={styles.inputIcon}>
//                           <IndianRupee size={18} />
//                           <input
//                             type="number"
//                             step="0.01"
//                             min="0"
//                             value={item.discountAmount}
//                             onChange={(e) => handleItemChange(index, "discountAmount", e.target.value)}
//                             className={styles.input}
//                             placeholder="0.00"
//                             disabled={!token || !companyId || loadingData}
//                           />
//                         </div>
//                       </div>

//                       <div className={styles.formGroup}>
//                         <label className={styles.label}>Tax Amount</label>
//                         <div className={styles.valueDisplay}>
//                           <IndianRupee size={16} />
//                           <span>{item.totalTaxAmount.toFixed(2)}</span>
//                         </div>
//                       </div>

//                       <div className={styles.formGroup}>
//                         <label className={styles.label}>Total</label>
//                         <div className={`${styles.valueDisplay} ${styles.valueDisplayTotal}`}>
//                           <IndianRupee size={16} />
//                           <span>{item.totalAmount.toFixed(2)}</span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )
//               })}
//             </div>
//           </div>

//           {/* Summary */}
//           <div className={styles.summarySection}>
//             <h2 className={styles.sectionTitle}>Return Summary</h2>
//             <div className={styles.summaryGrid}>
//               <div className={styles.summaryItem}>
//                 <span className={styles.summaryLabel}>Total Quantity</span>
//                 <span className={styles.summaryValue}>{form.totalQuantity}</span>
//               </div>
//               <div className={styles.summaryItem}>
//                 <span className={styles.summaryLabel}>Total Discount</span>
//                 <span className={styles.summaryValue}>
//                   <IndianRupee size={14} />
//                   {form.totalDiscount.toFixed(2)}
//                 </span>
//               </div>
//               <div className={styles.summaryItem}>
//                 <span className={styles.summaryLabel}>Total Tax</span>
//                 <span className={styles.summaryValue}>
//                   <IndianRupee size={14} />
//                   {form.totalTaxAmount.toFixed(2)}
//                 </span>
//               </div>
//               <div className={styles.summaryItem}>
//                 <span className={styles.summaryLabel}>Total Amount</span>
//                 <span className={`${styles.summaryValue} ${styles.summaryValueBold}`}>
//                   <IndianRupee size={14} />
//                   {form.totalAmount.toFixed(2)}
//                 </span>
//               </div>
//               <div className={styles.summaryItem}>
//                 <span className={styles.summaryLabel}>Amount Received</span>
//                 <span className={styles.summaryValue}>
//                   <IndianRupee size={14} />
//                   {(parseFloat(form.receivedAmount) || 0).toFixed(2)}
//                 </span>
//               </div>
//               <div className={`${styles.summaryItem} ${styles.summaryItemBalance}`}>
//                 <span className={styles.summaryLabel}>Balance Amount</span>
//                 <span className={`${styles.summaryValue} ${styles.summaryValueBalance}`}>
//                   <IndianRupee size={14} />
//                   {form.balanceAmount.toFixed(2)}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </form>
//       )}
//     </div>
//   )
// }

// export default CreatePurchaseReturn












// "use client"

// import React, { useEffect, useState } from "react"
// import { useNavigate, useLocation } from "react-router-dom"
// import axios from "axios"
// import config from "../../../config/apiconfig"
// import styles from "../Styles/Form.module.css" // Unified style
// import { toast } from "react-toastify"
// import {
//   Plus,
//   Trash2,
//   ArrowLeft,
//   CheckCircle,
//   Package,
//   Users,
//   Calendar,
//   CreditCard,
//   MapPin,
//   FileText,
//   IndianRupee,
//   Loader,
//   Phone,
//   Receipt,
// } from "lucide-react"

// const CreatePurchaseReturn = () => {
//   const navigate = useNavigate()
//   const location = useLocation()
//   const queryParams = new URLSearchParams(location.search)
//   const editId = queryParams.get("edit")

//   const userData = JSON.parse(localStorage.getItem("eBilling")) || {}
//   const token = userData?.accessToken || ""
//   const companyId = userData?.selectedCompany?.id || ""

//   const [loading, setLoading] = useState(false)
//   const [loadingData, setLoadingData] = useState(false)
//   const [loadingItems, setLoadingItems] = useState(false)
//   const [parties, setParties] = useState([])
//   const [items, setItems] = useState([])
//   const [purchases, setPurchases] = useState([])
//   const [maxQtyMap, setMaxQtyMap] = useState({})

//   const paymentTypes = ["CASH", "UPI", "CREDIT_CARD", "DEBIT_CARD", "NET_BANKING", "WALLET", "CHEQUE", "OTHER"]
//   const states = [
//     "ANDHRA_PRADESH", "ARUNACHAL_PRADESH", "ASSAM", "BIHAR", "CHHATTISGARH", "GOA", "GUJARAT", "HARYANA",
//     "HIMACHAL_PRADESH", "JHARKHAND", "KARNATAKA", "KERALA", "MADHYA_PRADESH", "MAHARASHTRA", "MANIPUR",
//     "MEGHALAYA", "MIZORAM", "NAGALAND", "ODISHA", "PUNJAB", "RAJASTHAN", "SIKKIM", "TAMIL_NADU", "TELANGANA",
//     "TRIPURA", "UTTAR_PRADESH", "UTTARAKHAND", "WEST_BENGAL", "OTHER",
//   ]
//   const units = [
//     "CARTONS", "KILOGRAMS", "QUINTAL", "BOTTLES", "PIECES", "ROLLS", "NUMBERS", "PAIRS", "TABLETS",
//     "MILLILITRE", "BUNDLES", "BOX", "SQUARE_METERS", "BAGS", "CANS", "SQUARE_FEET",
//   ]
//   const taxTypes = ["WITHTAX", "WITHOUTTAX"]
//   const taxRates = [
//     "NONE", "EXEMPTED", "GST0", "IGST0", "GST0POINT25", "IGST0POINT25",
//     "GST3", "IGST3", "GST5", "IGST5", "GST12", "IGST12",
//     "GST18", "IGST18", "GST28", "IGST28",
//   ]

//   const TAX_RATE_MAP = {
//     NONE: 0, EXEMPTED: 0,
//     GST0: 0, IGST0: 0,
//     GST0POINT25: 0.0025, IGST0POINT25: 0.0025,
//     GST3: 0.03, IGST3: 0.03,
//     GST5: 0.05, IGST5: 0.05,
//     GST12: 0.12, IGST12: 0.12,
//     GST18: 0.18, IGST18: 0.18,
//     GST28: 0.28, IGST28: 0.28,
//   }

//   const [form, setForm] = useState({
//     partyId: "",
//     returnNo: "",
//     returnDate: new Date().toISOString().split("T")[0],
//     phoneNo: "",
//     billNo: "",
//     billDate: "",
//     paymentType: "CASH",
//     stateOfSupply: "MAHARASHTRA",
//     description: "",
//     items: [],
//     totalQuantity: 0,
//     totalDiscount: 0,
//     totalTaxAmount: 0,
//     totalAmount: 0,
//     receivedAmount: "0",
//     balanceAmount: 0,
//   })

//   /* ==================== FETCH DATA ==================== */
//   const fetchParties = async () => {
//     if (!token || !companyId) return
//     try {
//       const res = await axios.get(`${config.BASE_URL}/company/${companyId}/parties`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       setParties(res.data || [])
//     } catch (err) {
//       toast.error("Failed to load parties")
//     }
//   }

//   const fetchItems = async () => {
//     if (!token || !companyId) return
//     setLoadingItems(true)
//     try {
//       const res = await axios.get(`${config.BASE_URL}/company/${companyId}/items`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       setItems(res.data || [])
//     } catch (err) {
//       toast.error("Failed to load items")
//     } finally {
//       setLoadingItems(false)
//     }
//   }

//   const fetchPurchases = async () => {
//     if (!token || !companyId) return
//     try {
//       const res = await axios.get(`${config.BASE_URL}/company/${companyId}/purchases`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       setPurchases(res.data || [])
//     } catch (err) {
//       toast.error("Failed to load purchases")
//     }
//   }

//   const fetchReturn = async (purchaseReturnId) => {
//     if (!token || !companyId) return
//     setLoadingData(true)
//     try {
//       const res = await axios.get(`${config.BASE_URL}/purchase-return/${purchaseReturnId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })

//       const r = res.data
//       const returnItems = r.purchaseReturnItemResponses?.map((it) => ({
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
//       })) || []

//       setForm({
//         partyId: r.partyResponseDto?.partyId?.toString() || "",
//         returnNo: r.returnNo || "",
//         returnDate: r.returnDate || "",
//         phoneNo: r.phoneNo || "",
//         billNo: r.billNo || "",
//         billDate: r.billDate || "",
//         paymentType: r.paymentType || "CASH",
//         stateOfSupply: r.stateOfSupply || "MAHARASHTRA",
//         description: r.description || "",
//         items: returnItems,
//         totalQuantity: r.totalQuantity || 0,
//         totalDiscount: r.totalDiscount || 0,
//         totalTaxAmount: r.totalTaxAmount || 0,
//         totalAmount: r.totalAmount || 0,
//         receivedAmount: (r.receivedAmount || 0).toString(),
//         balanceAmount: r.balanceAmount || 0,
//       })

//       // Rebuild maxQtyMap for edit mode
//       const purchase = purchases.find((p) => p.billNo === r.billNo)
//       if (purchase) {
//         const map = {}
//         purchase.purchaseItemResponses?.forEach((it) => {
//           const key = it.itemId?.toString() || it.itemName
//           map[key] = (map[key] || 0) + (parseFloat(it.quantity) || 0)
//         })
//         setMaxQtyMap(map)
//       }
//     } catch (err) {
//       toast.error("Failed to load return")
//       navigate("/purchase_returns")
//     } finally {
//       setLoadingData(false)
//     }
//   }

//   useEffect(() => {
//     fetchParties()
//     fetchItems()
//     fetchPurchases()

//     if (editId) {
//       fetchReturn(editId)
//     }
//   }, [token, companyId, editId])

//   /* ==================== BILL & ITEM HANDLING ==================== */
//   const handleBillSelect = (billNo) => {
//     const purchase = purchases.find((p) => p.billNo === billNo)
//     if (!purchase) return

//     const newItems = purchase.purchaseItemResponses?.map((it) => ({
//       itemId: it.itemId?.toString() || "",
//       name: it.itemName,
//       hsn: it.itemHsnCode || "",
//       quantity: "0",
//       unit: it.unit,
//       ratePerUnit: it.pricePerUnit?.toString() || "",
//       taxType: it.pricePerUnitTaxType || "WITHTAX",
//       discountAmount: "0",
//       taxRate: it.taxRate || "GST18",
//       totalTaxAmount: 0,
//       totalAmount: 0,
//     })) || []

//     setForm((prev) => ({
//       ...prev,
//       partyId: purchase.partyResponseDto?.partyId?.toString() || "",
//       phoneNo: purchase.partyResponseDto?.phoneNo || "",
//       billDate: purchase.billDate || "",
//       stateOfSupply: purchase.stateOfSupply || "MAHARASHTRA",
//       items: newItems,
//     }))

//     const map = {}
//     purchase.purchaseItemResponses?.forEach((it) => {
//       const key = it.itemId?.toString() || it.itemName
//       map[key] = (map[key] || 0) + (parseFloat(it.quantity) || 0)
//     })
//     setMaxQtyMap(map)
//   }

//   const handleItemSelect = (index, itemId) => {
//     const selected = items.find((i) => i.itemId === Number(itemId))
//     if (!selected) {
//       // Clear on deselection
//       const newItems = [...form.items]
//       newItems[index] = {
//         ...newItems[index],
//         itemId: "",
//         name: "",
//         hsn: "",
//         unit: "PIECES",
//         ratePerUnit: "",
//         taxType: "WITHTAX",
//         taxRate: "GST18",
//         discountAmount: "0",
//       }
//       recalculateTotals(newItems)
//       return
//     }

//     const newItems = [...form.items]
//     const currentItem = newItems[index]

//     let defaultQty = currentItem.quantity || ""
//     if (form.billNo) {
//       const purchase = purchases.find((p) => p.billNo === form.billNo)
//       const purchaseItem = purchase?.purchaseItemResponses?.find(
//         (it) => it.itemId?.toString() === itemId
//       )
//       if (purchaseItem && !currentItem.quantity) {
//         defaultQty = purchaseItem.quantity?.toString() || ""
//       }
//     }

//     newItems[index] = {
//       ...currentItem,
//       itemId: selected.itemId,
//       name: selected.itemName,
//       hsn: selected.itemHsn,
//       unit: selected.baseUnit,
//       ratePerUnit: selected.purchasePrice?.toString() || selected.salePrice?.toString() || "",
//       taxType: selected.purchaseTaxType || selected.saleTaxType || "WITHTAX",
//       taxRate: selected.taxRate || "GST18",
//       quantity: defaultQty,
//       discountAmount: "0",
//     }

//     recalculateTotals(newItems)
//   }

//   /* ==================== CALCULATIONS ==================== */
//   const calculateItem = (item) => {
//     const qty = parseFloat(item.quantity) || 0
//     const rate = parseFloat(item.ratePerUnit) || 0
//     const discount = parseFloat(item.discountAmount) || 0
//     const taxRate = TAX_RATE_MAP[item.taxRate] || 0
//     const withTax = item.taxType === "WITHTAX"

//     let subtotal = qty * rate - discount
//     let taxAmount = 0

//     if (withTax && taxRate > 0) {
//       const taxable = subtotal / (1 + taxRate)
//       taxAmount = subtotal - taxable
//       subtotal = taxable
//     } else {
//       taxAmount = subtotal * taxRate
//     }

//     const total = subtotal + taxAmount

//     return {
//       ...item,
//       totalTaxAmount: parseFloat(taxAmount.toFixed(2)),
//       totalAmount: parseFloat(total.toFixed(2)),
//     }
//   }

//   const recalculateTotals = (newItems) => {
//     const calculated = newItems.map(calculateItem)
//     const totalQty = calculated.reduce((s, i) => s + (parseFloat(i.quantity) || 0), 0)
//     const totalDiscount = calculated.reduce((s, i) => s + (parseFloat(i.discountAmount) || 0), 0)
//     const totalTax = calculated.reduce((s, i) => s + i.totalTaxAmount, 0)
//     const totalAmt = calculated.reduce((s, i) => s + i.totalAmount, 0)
//     const received = parseFloat(form.receivedAmount) || 0
//     const balance = totalAmt - received

//     setForm((prev) => ({
//       ...prev,
//       items: calculated,
//       totalQuantity: totalQty,
//       totalDiscount: parseFloat(totalDiscount.toFixed(2)),
//       totalTaxAmount: parseFloat(totalTax.toFixed(2)),
//       totalAmount: parseFloat(totalAmt.toFixed(2)),
//       balanceAmount: parseFloat(balance.toFixed(2)),
//     }))
//   }

//   const handleQuantityChange = (index, value) => {
//     const num = parseFloat(value) || 0
//     const item = form.items[index]
//     const key = item.itemId || item.name
//     const maxQty = maxQtyMap[key] || 0

//     if (maxQty > 0 && num > maxQty) {
//       toast.warn(`Max return quantity: ${maxQty}`)
//       return
//     }

//     const newItems = [...form.items]
//     newItems[index].quantity = value
//     recalculateTotals(newItems)
//   }

//   const handleItemChange = (index, field, value) => {
//     const newItems = [...form.items]
//     newItems[index][field] = value
//     recalculateTotals(newItems)
//   }

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
//     }))
//   }

//   const removeItem = (index) => {
//     const newItems = form.items.filter((_, i) => i !== index)
//     recalculateTotals(newItems)
//   }

//   /* ==================== SUBMIT ==================== */
//   const handleSubmit = async (e) => {
//     e.preventDefault()

//     if (!token || !companyId) {
//       toast.error("Login and select company")
//       return
//     }

//     if (!form.partyId || !form.returnNo || !form.returnDate || !form.billNo || !form.phoneNo) {
//       toast.error("Fill all required fields")
//       return
//     }

//     const invalidItem = form.items.some(
//       (i) => !i.name || !i.quantity || !i.ratePerUnit || parseFloat(i.quantity) <= 0 || parseFloat(i.ratePerUnit) <= 0
//     )
//     if (invalidItem) {
//       toast.error("Each item must have Name, Qty > 0, Rate > 0")
//       return
//     }

//     const payload = {
//       partyId: parseInt(form.partyId),
//       returnNo: form.returnNo.trim(),
//       returnDate: form.returnDate,
//       phoneNo: form.phoneNo.trim(),
//       billNo: form.billNo.trim(),
//       billDate: form.billDate,
//       totalDiscount: form.totalDiscount,
//       totalQuantity: form.totalQuantity,
//       totalTaxAmount: form.totalTaxAmount,
//       totalAmount: form.totalAmount,
//       receivedAmount: parseFloat(form.receivedAmount) || 0,
//       balanceAmount: form.balanceAmount,
//       paymentType: form.paymentType,
//       stateOfSupply: form.stateOfSupply,
//       description: form.description.trim() || null,
//       purchaseReturnItemRequests: form.items.map((i) => ({
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
//     }

//     try {
//       setLoading(true)

//       if (editId) {
//         await axios.put(`${config.BASE_URL}/purchase-return/${editId}`, payload, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         })
//         toast.success("Purchase Return updated!")
//       } else {
//         await axios.post(`${config.BASE_URL}/company/${companyId}/create/purchase-return`, payload, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         })
//         toast.success("Purchase Return created!")
//       }

//       navigate("/purchase_returns")
//     } catch (err) {
//       toast.error(err.response?.data?.message || `Failed to ${editId ? "update" : "create"} return`)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const isEditMode = !!editId

//   /* ==================== RENDER ==================== */
//   return (
//     <div className={styles.container}>
//       {loadingData ? (
//         <div className={styles.loadingContainer}>
//           <Loader className={styles.spinnerIcon} />
//           <p>Loading return...</p>
//         </div>
//       ) : (
//         <form onSubmit={handleSubmit} className={styles.form}>
//           {/* Header */}
//           <div className={styles.header}>
//             <div className={styles.headerContent}>
//               <div className={styles.titleSection}>
//                 <h1 className={styles.title}>
//                   {isEditMode ? (
//                     <>
//                       <CheckCircle className={styles.titleIcon} />
//                       Edit Purchase Return
//                     </>
//                   ) : (
//                     <>
//                       <FileText className={styles.titleIcon} />
//                       Create Purchase Return
//                     </>
//                   )}
//                 </h1>
//                 <p className={styles.subtitle}>
//                   {isEditMode ? `Return #${form.returnNo}` : "Return items from a bill"}
//                 </p>
//               </div>
//             </div>
//             <div className={styles.headerActions}>
//               <button
//                 type="button"
//                 onClick={() => navigate("/purchase_returns")}
//                 className={styles.buttonSecondary}
//                 disabled={loading}
//               >
//                 <ArrowLeft size={18} />
//                 Back
//               </button>
//               <button
//                 type="submit"
//                 className={styles.buttonPrimary}
//                 disabled={loading || loadingData || !token || !companyId}
//               >
//                 {loading ? (
//                   <>
//                     <Loader size={18} className={styles.spinnerSmall} />
//                     Saving...
//                   </>
//                 ) : (
//                   <>
//                     <CheckCircle size={18} />
//                     {isEditMode ? "Update Return" : "Create Return"}
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>

//           {/* Party & Return Info */}
//           <div className={styles.formSection}>
//             <h2 className={styles.sectionTitle}>
//               <Users size={20} />
//               Return Information
//             </h2>
//             <div className={styles.formGrid}>
//               <div className={styles.formGroup}>
//                 <label htmlFor="party" className={styles.label}>
//                   Party <span className={styles.required}>*</span>
//                 </label>
//                 <select
//                   id="party"
//                   value={form.partyId}
//                   onChange={(e) => setForm({ ...form, partyId: e.target.value })}
//                   required
//                   className={styles.input}
//                   disabled={!token || !companyId || loadingData}
//                 >
//                   <option value="">
//                     {token && companyId ? "Select Party" : "Login & Select Company"}
//                   </option>
//                   {parties.map((p) => (
//                     <option key={p.partyId} value={p.partyId}>
//                       {p.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div className={styles.formGroup}>
//                 <label htmlFor="returnNo" className={styles.label}>
//                   Return No <span className={styles.required}>*</span>
//                 </label>
//                 <input
//                   id="returnNo"
//                   type="text"
//                   value={form.returnNo}
//                   onChange={(e) => setForm({ ...form, returnNo: e.target.value })}
//                   required
//                   className={styles.input}
//                   placeholder="e.g. PR-001"
//                   disabled={!token || !companyId || loadingData}
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Dates & Bill */}
//           <div className={styles.formSection}>
//             <h2 className={styles.sectionTitle}>
//               <Calendar size={20} />
//               Return & Bill Details
//             </h2>
//             <div className={styles.formGrid}>
//               <div className={styles.formGroup}>
//                 <label htmlFor="returnDate" className={styles.label}>
//                   Return Date <span className={styles.required}>*</span>
//                 </label>
//                 <input
//                   id="returnDate"
//                   type="date"
//                   value={form.returnDate}
//                   onChange={(e) => setForm({ ...form, returnDate: e.target.value })}
//                   required
//                   className={styles.input}
//                   disabled={!token || !companyId || loadingData}
//                 />
//               </div>

//               <div className={styles.formGroup}>
//                 <label htmlFor="billNo" className={styles.label}>
//                   Bill No <span className={styles.required}>*</span>
//                 </label>
//                 <div className={styles.inputIcon}>
//                   <Receipt size={18} />
//                   <select
//                     id="billNo"
//                     value={form.billNo}
//                     onChange={(e) => {
//                       setForm({ ...form, billNo: e.target.value })
//                       handleBillSelect(e.target.value)
//                     }}
//                     required
//                     className={styles.input}
//                     disabled={!token || !companyId || loadingData}
//                   >
//                     <option value="">-- Select Bill --</option>
//                     {purchases.map((p) => (
//                       <option key={p.purchaseId} value={p.billNo}>
//                         {p.billNo} ({new Date(p.billDate).toLocaleDateString()})
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Phone & Payment */}
//           <div className={styles.formSection}>
//             <h2 className={styles.sectionTitle}>
//               <Phone size={20} />
//               Contact & Payment
//             </h2>
//             <div className={styles.formGrid}>
//               <div className={styles.formGroup}>
//                 <label htmlFor="phoneNo" className={styles.label}>
//                   Phone No <span className={styles.required}>*</span>
//                 </label>
//                 <div className={styles.inputIcon}>
//                   <Phone size={18} />
//                   <input
//                     id="phoneNo"
//                     type="text"
//                     value={form.phoneNo}
//                     onChange={(e) => setForm({ ...form, phoneNo: e.target.value })}
//                     required
//                     className={styles.input}
//                     placeholder="10-digit mobile"
//                     maxLength={10}
//                     disabled={!token || !companyId || loadingData}
//                   />
//                 </div>
//               </div>

//               <div className={styles.formGroup}>
//                 <label htmlFor="paymentType" className={styles.label}>
//                   Payment Type
//                 </label>
//                 <select
//                   id="paymentType"
//                   value={form.paymentType}
//                   onChange={(e) => setForm({ ...form, paymentType: e.target.value })}
//                   className={styles.input}
//                   disabled={!token || !companyId || loadingData}
//                 >
//                   {paymentTypes.map((t) => (
//                     <option key={t} value={t}>
//                       {t.replace(/_/g, " ")}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div className={styles.formGroup}>
//                 <label htmlFor="state" className={styles.label}>
//                   State of Supply
//                 </label>
//                 <div className={styles.inputIcon}>
//                   <MapPin size={18} />
//                   <select
//                     id="state"
//                     value={form.stateOfSupply}
//                     onChange={(e) => setForm({ ...form, stateOfSupply: e.target.value })}
//                     className={styles.input}
//                     disabled={!token || !companyId || loadingData}
//                   >
//                     {states.map((s) => (
//                       <option key={s} value={s}>
//                         {s.replace(/_/g, " ")}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               <div className={styles.formGroup}>
//                 <label htmlFor="receivedAmount" className={styles.label}>
//                   Amount Received
//                 </label>
//                 <div className={styles.inputIcon}>
//                   <IndianRupee size={18} />
//                   <input
//                     id="receivedAmount"
//                     type="number"
//                     step="0.01"
//                     min="0"
//                     value={form.receivedAmount}
//                     onChange={(e) => {
//                       setForm({ ...form, receivedAmount: e.target.value })
//                       recalculateTotals(form.items)
//                     }}
//                     className={styles.input}
//                     placeholder="0.00"
//                     disabled={!token || !companyId || loadingData}
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Description */}
//           <div className={styles.formSection}>
//             <label htmlFor="description" className={styles.label}>
//               Description
//             </label>
//             <textarea
//               id="description"
//               value={form.description}
//               onChange={(e) => setForm({ ...form, description: e.target.value })}
//               className={`${styles.input} ${styles.textarea}`}
//               placeholder="Optional notes..."
//               rows={3}
//               disabled={!token || !companyId || loadingData}
//             />
//           </div>

//           {/* ==== RETURNED ITEMS TABLE (consistent with other forms) ==== */}
//           <div className={styles.formSection}>
//             <div className={styles.itemsHeader}>
//               <h2 className={styles.sectionTitle}>
//                 <Package size={20} />
//                 Returned Items
//               </h2>
//               <button
//                 type="button"
//                 onClick={addItem}
//                 className={styles.buttonAdd}
//                 disabled={!token || !companyId || loadingItems || loadingData}
//               >
//                 <Plus size={18} />
//                 Add Item
//               </button>
//             </div>

//             <div className={styles.tableContainer}>
//               <table className={styles.itemsTable}>
//                 <thead>
//                   <tr>
//                     <th>No</th>
//                     <th>Item Name</th>
//                     <th>HSN</th>
//                     <th>Qty {form.billNo && "(Max)"}</th>
//                     <th>Unit</th>
//                     <th>Rate</th>
//                     <th>Discount</th>
//                     <th>Tax Type</th>
//                     <th>Tax Rate</th>
//                     <th>Tax ₹</th>
//                     <th>Total ₹</th>
//                     <th></th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {form.items.map((item, idx) => {
//                     const key = item.itemId || item.name
//                     const maxQty = maxQtyMap[key] || 0

//                     return (
//                       <tr key={idx}>
//                         <td className={styles.rowNumber}>{idx + 1}</td>

//                         <td>
//                           <select
//                             value={item.itemId || ""}
//                             onChange={(e) => handleItemSelect(idx, e.target.value)}
//                             required
//                             className={styles.tableSelect}
//                             disabled={!token || !companyId || loadingItems || loadingData}
//                           >
//                             <option value="">-- Select --</option>
//                             {items.map((i) => (
//                               <option key={i.itemId} value={i.itemId}>
//                                 {i.itemName} ({i.itemCode || ""})
//                               </option>
//                             ))}
//                           </select>
//                         </td>

//                         <td>
//                           <input
//                             type="text"
//                             value={item.hsn}
//                             readOnly
//                             className={styles.tableInputReadonly}
//                           />
//                         </td>

//                         <td>
//                           <input
//                             type="number"
//                             step="0.01"
//                             min="0.01"
//                             value={item.quantity}
//                             onChange={(e) => handleQuantityChange(idx, e.target.value)}
//                             required
//                             className={styles.tableInput}
//                             disabled={!token || !companyId || loadingData}
//                             placeholder={maxQty > 0 ? `Max ${maxQty}` : ""}
//                           />
//                           {maxQty > 0 && (
//                             <div style={{ fontSize: "0.75rem", color: "#666", marginTop: "4px" }}>
//                               Max: {maxQty}
//                             </div>
//                           )}
//                         </td>

//                         <td>
//                           <select
//                             value={item.unit}
//                             onChange={(e) => handleItemChange(idx, "unit", e.target.value)}
//                             className={styles.tableSelect}
//                             disabled={!token || !companyId || loadingData}
//                           >
//                             {units.map((u) => (
//                               <option key={u} value={u}>{u}</option>
//                             ))}
//                           </select>
//                         </td>

//                         <td>
//                           <input
//                             type="number"
//                             step="0.01"
//                             min="0.01"
//                             value={item.ratePerUnit}
//                             onChange={(e) => handleItemChange(idx, "ratePerUnit", e.target.value)}
//                             required
//                             className={styles.tableInput}
//                             disabled={!token || !companyId || loadingData}
//                           />
//                         </td>

//                         <td>
//                           <div className={styles.inputIconSmall}>
//                             <input
//                               type="number"
//                               step="0.01"
//                               min="0"
//                               value={item.discountAmount}
//                               onChange={(e) => handleItemChange(idx, "discountAmount", e.target.value)}
//                               className={styles.tableInput}
//                               placeholder="0"
//                               disabled={!token || !companyId || loadingData}
//                             />
//                           </div>
//                         </td>

//                         <td>
//                           <input
//                             type="text"
//                             value={item.taxType === "WITHTAX" ? "Inc. Tax" : "Ex. Tax"}
//                             readOnly
//                             className={styles.tableInputReadonly}
//                           />
//                         </td>

//                         <td>
//                           <select
//                             value={item.taxRate}
//                             onChange={(e) => handleItemChange(idx, "taxRate", e.target.value)}
//                             className={styles.tableSelect}
//                             disabled={!token || !companyId || loadingData}
//                           >
//                             {taxRates.map((r) => (
//                               <option key={r} value={r}>
//                                 {r.replace("GST", "").replace("IGST", "") || "0%"}
//                               </option>
//                             ))}
//                           </select>
//                         </td>

//                         <td className={styles.amountCell}>
//                           <IndianRupee size={14} />
//                           {item.totalTaxAmount.toFixed(2)}
//                         </td>

//                         <td className={styles.amountCell}>
//                           <IndianRupee size={14} />
//                           <strong>{item.totalAmount.toFixed(2)}</strong>
//                         </td>

//                         <td>
//                           {form.items.length > 1 && (
//                             <button
//                               type="button"
//                               onClick={() => removeItem(idx)}
//                               className={styles.tableDeleteBtn}
//                               disabled={!token || !companyId || loadingData}
//                             >
//                               <Trash2 size={16} />
//                             </button>
//                           )}
//                         </td>
//                       </tr>
//                     )
//                   })}
//                 </tbody>
//               </table>

//               {form.items.length === 0 && (
//                 <div className={styles.emptyTable}>
//                   <p>No items added yet. Click "Add Item" to start.</p>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Summary */}
//           <div className={styles.summarySection}>
//             <h2 className={styles.sectionTitle}>Return Summary</h2>
//             <div className={styles.summaryGrid}>
//               <div className={styles.summaryItem}>
//                 <span className={styles.summaryLabel}>Total Quantity</span>
//                 <span className={styles.summaryValue}>{form.totalQuantity}</span>
//               </div>
//               <div className={styles.summaryItem}>
//                 <span className={styles.summaryLabel}>Total Discount</span>
//                 <span className={styles.summaryValue}>
//                   <IndianRupee size={14} />
//                   {form.totalDiscount.toFixed(2)}
//                 </span>
//               </div>
//               <div className={styles.summaryItem}>
//                 <span className={styles.summaryLabel}>Total Tax</span>
//                 <span className={styles.summaryValue}>
//                   <IndianRupee size={14} />
//                   {form.totalTaxAmount.toFixed(2)}
//                 </span>
//               </div>
//               <div className={styles.summaryItem}>
//                 <span className={styles.summaryLabel}>Total Amount</span>
//                 <span className={`${styles.summaryValue} ${styles.summaryValueBold}`}>
//                   <IndianRupee size={14} />
//                   {form.totalAmount.toFixed(2)}
//                 </span>
//               </div>
//               <div className={styles.summaryItem}>
//                 <span className={styles.summaryLabel}>Amount Received</span>
//                 <span className={styles.summaryValue}>
//                   <IndianRupee size={14} />
//                   {(parseFloat(form.receivedAmount) || 0).toFixed(2)}
//                 </span>
//               </div>
//               <div className={`${styles.summaryItem} ${styles.summaryItemBalance}`}>
//                 <span className={styles.summaryLabel}>Balance Amount</span>
//                 <span className={`${styles.summaryValue} ${styles.summaryValueBalance}`}>
//                   <IndianRupee size={14} />
//                   {form.balanceAmount.toFixed(2)}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </form>
//       )}
//     </div>
//   )
// }

// export default CreatePurchaseReturn








// "use client"

// import React, { useEffect, useState } from "react"
// import { useNavigate, useLocation } from "react-router-dom"
// import axios from "axios"
// import config from "../../../config/apiconfig"
// import styles from "../Styles/Form.module.css"
// import { toast } from "react-toastify"
// import {
//   Plus,
//   Trash2,
//   ArrowLeft,
//   CheckCircle,
//   Package,
//   Users,
//   Calendar,
//   CreditCard,
//   MapPin,
//   FileText,
//   IndianRupee,
//   Loader,
//   Phone,
//   Receipt,
// } from "lucide-react"

// const CreatePurchaseReturn = () => {
//   const navigate = useNavigate()
//   const location = useLocation()
//   const queryParams = new URLSearchParams(location.search)
//   const editId = queryParams.get("edit")

//   const userData = JSON.parse(localStorage.getItem("eBilling")) || {}
//   const token = userData?.accessToken || ""
//   const companyId = userData?.selectedCompany?.id || ""

//   const [loading, setLoading] = useState(false)
//   const [loadingData, setLoadingData] = useState(false)
//   const [loadingItems, setLoadingItems] = useState(false)
//   const [parties, setParties] = useState([])
//   const [items, setItems] = useState([])
//   const [purchases, setPurchases] = useState([])
//   const [maxQtyMap, setMaxQtyMap] = useState({})

//   const paymentTypes = ["CASH", "UPI", "CREDIT_CARD", "DEBIT_CARD", "NET_BANKING", "WALLET", "CHEQUE", "OTHER"]
//   const states = [
//     "ANDHRA_PRADESH", "ARUNACHAL_PRADESH", "ASSAM", "BIHAR", "CHHATTISGARH", "GOA", "GUJARAT", "HARYANA",
//     "HIMACHAL_PRADESH", "JHARKHAND", "KARNATAKA", "KERALA", "MADHYA_PRADESH", "MAHARASHTRA", "MANIPUR",
//     "MEGHALAYA", "MIZORAM", "NAGALAND", "ODISHA", "PUNJAB", "RAJASTHAN", "SIKKIM", "TAMIL_NADU", "TELANGANA",
//     "TRIPURA", "UTTAR_PRADESH", "UTTARAKHAND", "WEST_BENGAL", "OTHER",
//   ]
//   const units = [
//     "CARTONS", "KILOGRAMS", "QUINTAL", "BOTTLES", "PIECES", "ROLLS", "NUMBERS", "PAIRS", "TABLETS",
//     "MILLILITRE", "BUNDLES", "BOX", "SQUARE_METERS", "BAGS", "CANS", "SQUARE_FEET",
//   ]
//   const taxTypes = ["WITHTAX", "WITHOUTTAX"]
//   const taxRates = [
//     "NONE", "EXEMPTED", "GST0", "IGST0", "GST0POINT25", "IGST0POINT25",
//     "GST3", "IGST3", "GST5", "IGST5", "GST12", "IGST12",
//     "GST18", "IGST18", "GST28", "IGST28",
//   ]

//   const TAX_RATE_MAP = {
//     NONE: 0, EXEMPTED: 0,
//     GST0: 0, IGST0: 0,
//     GST0POINT25: 0.0025, IGST0POINT25: 0.0025,
//     GST3: 0.03, IGST3: 0.03,
//     GST5: 0.05, IGST5: 0.05,
//     GST12: 0.12, IGST12: 0.12,
//     GST18: 0.18, IGST18: 0.18,
//     GST28: 0.28, IGST28: 0.28,
//   }

//   const [form, setForm] = useState({
//     partyId: "",
//     returnNo: "",
//     returnDate: new Date().toISOString().split("T")[0],
//     phoneNo: "",
//     billNo: "",
//     billDate: "",
//     paymentType: "CASH",
//     stateOfSupply: "MAHARASHTRA",
//     description: "",
//     items: [],
//     totalQuantity: 0,
//     totalDiscount: 0,
//     totalTaxAmount: 0,
//     totalAmount: 0,
//     receivedAmount: "0",
//     balanceAmount: 0,
//   })

//   /* ==================== AUTO-FILL PHONE NUMBER WHEN PARTY SELECTED ==================== */
//   useEffect(() => {
//     if (!form.partyId || parties.length === 0) return

//     const selectedParty = parties.find((p) => p.partyId === Number(form.partyId))
//     if (selectedParty) {
//       setForm((prev) => ({
//         ...prev,
//         phoneNo: selectedParty.phoneNo || "",
//       }))
//     }
//   }, [form.partyId, parties])

//   /* ==================== FETCH DATA ==================== */
//   const fetchParties = async () => {
//     if (!token || !companyId) return
//     try {
//       const res = await axios.get(`${config.BASE_URL}/company/${companyId}/parties`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       setParties(res.data || [])
//     } catch (err) {
//       toast.error("Failed to load parties")
//     }
//   }

//   const fetchItems = async () => {
//     if (!token || !companyId) return
//     setLoadingItems(true)
//     try {
//       const res = await axios.get(`${config.BASE_URL}/company/${companyId}/items`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       setItems(res.data || [])
//     } catch (err) {
//       toast.error("Failed to load items")
//     } finally {
//       setLoadingItems(false)
//     }
//   }

//   const fetchPurchases = async () => {
//     if (!token || !companyId) return
//     try {
//       const res = await axios.get(`${config.BASE_URL}/company/${companyId}/purchases`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       setPurchases(res.data || [])
//     } catch (err) {
//       toast.error("Failed to load purchases")
//     }
//   }

//   const fetchReturn = async (purchaseReturnId) => {
//     if (!token || !companyId) return
//     setLoadingData(true)
//     try {
//       const res = await axios.get(`${config.BASE_URL}/purchase-return/${purchaseReturnId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })

//       const r = res.data
//       const returnItems = r.purchaseReturnItemResponses?.map((it) => ({
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
//       })) || []

//       setForm({
//         partyId: r.partyResponseDto?.partyId?.toString() || "",
//         returnNo: r.returnNo || "",
//         returnDate: r.returnDate?.split("T")[0] || "",
//         phoneNo: r.phoneNo || "",
//         billNo: r.billNo || "",
//         billDate: r.billDate?.split("T")[0] || "",
//         paymentType: r.paymentType || "CASH",
//         stateOfSupply: r.stateOfSupply || "MAHARASHTRA",
//         description: r.description || "",
//         items: returnItems,
//         totalQuantity: r.totalQuantity || 0,
//         totalDiscount: r.totalDiscount || 0,
//         totalTaxAmount: r.totalTaxAmount || 0,
//         totalAmount: r.totalAmount || 0,
//         receivedAmount: (r.receivedAmount || 0).toString(),
//         balanceAmount: r.balanceAmount || 0,
//       })

//       // Rebuild maxQtyMap for edit mode
//       const purchase = purchases.find((p) => p.billNo === r.billNo)
//       if (purchase) {
//         const map = {}
//         purchase.purchaseItemResponses?.forEach((it) => {
//           const key = it.itemId?.toString() || it.itemName
//           map[key] = (map[key] || 0) + (parseFloat(it.quantity) || 0)
//         })
//         setMaxQtyMap(map)
//       }
//     } catch (err) {
//       toast.error("Failed to load return")
//       navigate("/purchase_returns")
//     } finally {
//       setLoadingData(false)
//     }
//   }

//   useEffect(() => {
//     fetchParties()
//     fetchItems()
//     fetchPurchases()

//     if (editId) {
//       fetchReturn(editId)
//     }
//   }, [token, companyId, editId])

//   /* ==================== BILL & ITEM HANDLING ==================== */
//   const handleBillSelect = (billNo) => {
//     const purchase = purchases.find((p) => p.billNo === billNo)
//     if (!purchase) return

//     const newItems = purchase.purchaseItemResponses?.map((it) => ({
//       itemId: it.itemId?.toString() || "",
//       name: it.itemName,
//       hsn: it.itemHsnCode || "",
//       quantity: "0",
//       unit: it.unit,
//       ratePerUnit: it.pricePerUnit?.toString() || "",
//       taxType: it.pricePerUnitTaxType || "WITHTAX",
//       discountAmount: "0",
//       taxRate: it.taxRate || "GST18",
//       totalTaxAmount: 0,
//       totalAmount: 0,
//     })) || []

//     setForm((prev) => ({
//       ...prev,
//       partyId: purchase.partyResponseDto?.partyId?.toString() || "",
//       phoneNo: purchase.partyResponseDto?.phoneNo || "",
//       billDate: purchase.billDate?.split("T")[0] || "",
//       stateOfSupply: purchase.stateOfSupply || "MAHARASHTRA",
//       items: newItems,
//     }))

//     const map = {}
//     purchase.purchaseItemResponses?.forEach((it) => {
//       const key = it.itemId?.toString() || it.itemName
//       map[key] = (map[key] || 0) + (parseFloat(it.quantity) || 0)
//     })
//     setMaxQtyMap(map)
//   }

//   const handleItemSelect = (index, itemId) => {
//     const selected = items.find((i) => i.itemId?.toString() === itemId)
//     const newItems = [...form.items]

//     if (!selected) {
//       newItems[index] = {
//         ...newItems[index],
//         itemId: "",
//         name: "",
//         hsn: "",
//         unit: "PIECES",
//         ratePerUnit: "",
//         taxType: "WITHTAX",
//         taxRate: "GST18",
//         discountAmount: "0",
//         quantity: "0",
//         totalTaxAmount: 0,
//         totalAmount: 0,
//       }
//       recalculateTotals(newItems)
//       return
//     }

//     let defaultQty = newItems[index].quantity || "0"
//     if (form.billNo) {
//       const purchase = purchases.find((p) => p.billNo === form.billNo)
//       const purchaseItem = purchase?.purchaseItemResponses?.find(
//         (it) => it.itemId?.toString() === itemId
//       )
//       if (purchaseItem && !newItems[index].quantity) {
//         defaultQty = purchaseItem.quantity?.toString() || "0"
//       }
//     }

//     newItems[index] = {
//       ...newItems[index],
//       itemId: selected.itemId?.toString(),
//       name: selected.itemName,
//       hsn: selected.itemHsn,
//       unit: selected.baseUnit,
//       ratePerUnit: selected.purchasePrice?.toString() || selected.salePrice?.toString() || "",
//       taxType: selected.purchaseTaxType || selected.saleTaxType || "WITHTAX",
//       taxRate: selected.taxRate || "GST18",
//       quantity: defaultQty,
//       discountAmount: "0",
//     }

//     recalculateTotals(newItems)
//   }

//   /* ==================== CALCULATIONS ==================== */
//   const calculateItem = (item) => {
//     const qty = parseFloat(item.quantity) || 0
//     const rate = parseFloat(item.ratePerUnit) || 0
//     const discount = parseFloat(item.discountAmount) || 0
//     const taxRate = TAX_RATE_MAP[item.taxRate] || 0
//     const withTax = item.taxType === "WITHTAX"

//     let subtotal = qty * rate - discount
//     let taxAmount = 0

//     if (withTax && taxRate > 0) {
//       const taxable = subtotal / (1 + taxRate)
//       taxAmount = subtotal - taxable
//       subtotal = taxable
//     } else {
//       taxAmount = subtotal * taxRate
//     }

//     const total = subtotal + taxAmount

//     return {
//       ...item,
//       totalTaxAmount: parseFloat(taxAmount.toFixed(2)),
//       totalAmount: parseFloat(total.toFixed(2)),
//     }
//   }

//   const recalculateTotals = (newItems = form.items) => {
//     const calculated = newItems.map(calculateItem)
//     const totalQty = calculated.reduce((s, i) => s + (parseFloat(i.quantity) || 0), 0)
//     const totalDiscount = calculated.reduce((s, i) => s + (parseFloat(i.discountAmount) || 0), 0)
//     const totalTax = calculated.reduce((s, i) => s + i.totalTaxAmount, 0)
//     const totalAmt = calculated.reduce((s, i) => s + i.totalAmount, 0)
//     const received = parseFloat(form.receivedAmount) || 0
//     const balance = totalAmt - received

//     setForm((prev) => ({
//       ...prev,
//       items: calculated,
//       totalQuantity: parseFloat(totalQty.toFixed(2)),
//       totalDiscount: parseFloat(totalDiscount.toFixed(2)),
//       totalTaxAmount: parseFloat(totalTax.toFixed(2)),
//       totalAmount: parseFloat(totalAmt.toFixed(2)),
//       balanceAmount: parseFloat(balance.toFixed(2)),
//     }))
//   }

//   const handleQuantityChange = (index, value) => {
//     const num = parseFloat(value) || 0
//     const item = form.items[index]
//     const key = item.itemId || item.name
//     const maxQty = maxQtyMap[key] || Infinity

//     if (num > maxQty && maxQty !== Infinity) {
//       toast.warn(`Maximum return quantity: ${maxQty}`)
//       return
//     }

//     const newItems = [...form.items]
//     newItems[index].quantity = value
//     recalculateTotals(newItems)
//   }

//   const handleItemChange = (index, field, value) => {
//     const newItems = [...form.items]
//     newItems[index][field] = value
//     recalculateTotals(newItems)
//   }

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
//     }))
//   }

//   const removeItem = (index) => {
//     const newItems = form.items.filter((_, i) => i !== index)
//     recalculateTotals(newItems)
//   }

//   /* ==================== SUBMIT ==================== */
//   const handleSubmit = async (e) => {
//     e.preventDefault()

//     if (!token || !companyId) {
//       toast.error("Login and select company")
//       return
//     }

//     if (!form.partyId || !form.returnNo || !form.returnDate || !form.billNo || !form.phoneNo) {
//       toast.error("Fill all required fields")
//       return
//     }

//     const invalidItem = form.items.some(
//       (i) =>
//         !i.name ||
//         !i.quantity ||
//         parseFloat(i.quantity) <= 0 ||
//         !i.ratePerUnit ||
//         parseFloat(i.ratePerUnit) <= 0
//     )
//     if (invalidItem) {
//       toast.error("Each item must have Name, Qty > 0, Rate > 0")
//       return
//     }

//     const payload = {
//       partyId: Number(form.partyId),
//       returnNo: form.returnNo.trim(),
//       returnDate: form.returnDate,
//       phoneNo: form.phoneNo.trim(),
//       billNo: form.billNo.trim(),
//       billDate: form.billDate,
//       totalDiscount: form.totalDiscount,
//       totalQuantity: form.totalQuantity,
//       totalTaxAmount: form.totalTaxAmount,
//       totalAmount: form.totalAmount,
//       receivedAmount: parseFloat(form.receivedAmount) || 0,
//       balanceAmount: form.balanceAmount,
//       paymentType: form.paymentType,
//       stateOfSupply: form.stateOfSupply,
//       description: form.description.trim() || null,
//       purchaseReturnItemRequests: form.items.map((i) => ({
//         itemId: i.itemId ? Number(i.itemId) : null,
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
//     }

//     try {
//       setLoading(true)

//       if (editId) {
//         await axios.put(`${config.BASE_URL}/purchase-return/${editId}`, payload, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         })
//         toast.success("Purchase Return updated!")
//       } else {
//         await axios.post(`${config.BASE_URL}/company/${companyId}/create/purchase-return`, payload, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         })
//         toast.success("Purchase Return created!")
//       }

//       navigate("/purchase_returns")
//     } catch (err) {
//       toast.error(err.response?.data?.message || `Failed to ${editId ? "update" : "create"} return`)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const isEditMode = !!editId

//   return (
//     <div className={styles.container}>
//       {(loadingData || loading) && (
//         <div className={styles.loadingContainer}>
//           <Loader className={styles.spinnerIcon} />
//           <p>{loadingData ? "Loading return data..." : "Saving..."}</p>
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className={styles.form}>
//         {/* HEADER */}
//         <div className={styles.header}>
//           <div className={styles.headerContent}>
//             <div className={styles.titleSection}>
//               <h1 className={styles.title}>
//                 {isEditMode ? (
//                   <>
//                     <CheckCircle className={styles.titleIcon} />
//                     Edit Purchase Return
//                   </>
//                 ) : (
//                   <>
//                     <FileText className={styles.titleIcon} />
//                     Create Purchase Return
//                   </>
//                 )}
//               </h1>
//               <p className={styles.subtitle}>
//                 {isEditMode ? `Return #${form.returnNo}` : "Return items from a purchase bill"}
//               </p>
//             </div>
//           </div>
//           <div className={styles.headerActions}>
//             <button
//               type="button"
//               onClick={() => navigate("/purchase_returns")}
//               className={styles.buttonSecondary}
//               disabled={loading}
//             >
//               <ArrowLeft size={18} />
//               Back
//             </button>
//             <button
//               type="submit"
//               className={styles.buttonPrimary}
//               disabled={loading || loadingData}
//             >
//               {loading ? (
//                 <>
//                   <Loader size={18} className={styles.spinnerSmall} />
//                   Saving...
//                 </>
//               ) : (
//                 <>
//                   <CheckCircle size={18} />
//                   {isEditMode ? "Update Return" : "Create Return"}
//                 </>
//               )}
//             </button>
//           </div>
//         </div>

//         {/* PARTY & RETURN INFO */}
//         <div className={styles.formSection}>
//           <h2 className={styles.sectionTitle}>
//             <Users size={20} />
//             Party Information
//           </h2>
//           <div className={styles.formGrid}>
//             <div className={styles.formGroup}>
//               <label className={styles.label}>
//                 Party <span className={styles.required}>*</span>
//               </label>
//               <select
//                 value={form.partyId}
//                 onChange={(e) => setForm({ ...form, partyId: e.target.value })}
//                 required
//                 className={styles.input}
//                 disabled={loadingData}
//               >
//                 <option value="">Select Party</option>
//                 {parties.map((p) => (
//                   <option key={p.partyId} value={p.partyId}>
//                     {p.name} - {p.phoneNo || "No Phone"}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className={styles.formGroup}>
//               <label className={styles.label}>
//                 Return Number <span className={styles.required}>*</span>
//               </label>
//               <input
//                 type="text"
//                 value={form.returnNo}
//                 onChange={(e) => setForm({ ...form, returnNo: e.target.value })}
//                 required
//                 className={styles.input}
//                 placeholder="e.g. PR-001"
//                 disabled={loadingData}
//               />
//             </div>

//             <div className={styles.formGroup}>
//               <label className={styles.label}>
//                 Phone No <span className={styles.required}>*</span>
//               </label>
//               <div className={styles.inputIcon}>
//                 <Phone size={18} />
//                 <input
//                   type="text"
//                   value={form.phoneNo}
//                   readOnly
//                   className={`${styles.input} ${styles.inputReadonly}`}
//                   placeholder="Auto-filled"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* DATES & BILL */}
//         <div className={styles.formSection}>
//           <h2 className={styles.sectionTitle}>
//             <Calendar size={20} />
//             Important Dates & Bill
//           </h2>
//           <div className={styles.formGrid}>
//             <div className={styles.formGroup}>
//               <label className={styles.label}>
//                 Return Date <span className={styles.required}>*</span>
//               </label>
//               <input
//                 type="date"
//                 value={form.returnDate}
//                 onChange={(e) => setForm({ ...form, returnDate: e.target.value })}
//                 required
//                 className={styles.input}
//                 disabled={loadingData}
//               />
//             </div>

//             <div className={styles.formGroup}>
//               <label className={styles.label}>
//                 Original Bill No <span className={styles.required}>*</span>
//               </label>
//               <div className={styles.inputIcon}>
//                 <Receipt size={18} />
//                 <select
//                   value={form.billNo}
//                   onChange={(e) => {
//                     setForm({ ...form, billNo: e.target.value })
//                     handleBillSelect(e.target.value)
//                   }}
//                   required
//                   className={styles.input}
//                   disabled={loadingData}
//                 >
//                   <option value="">-- Select Bill --</option>
//                   {purchases.map((p) => (
//                     <option key={p.purchaseId} value={p.billNo}>
//                       {p.billNo} ({new Date(p.billDate).toLocaleDateString()})
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* PAYMENT & LOCATION */}
//         <div className={styles.formSection}>
//           <h2 className={styles.sectionTitle}>
//             <CreditCard size={20} />
//             Payment & Location
//           </h2>
//           <div className={styles.formGrid}>
//             <div className={styles.formGroup}>
//               <label className={styles.label}>Payment Type</label>
//               <select
//                 value={form.paymentType}
//                 onChange={(e) => setForm({ ...form, paymentType: e.target.value })}
//                 className={styles.input}
//                 disabled={loadingData}
//               >
//                 {paymentTypes.map((t) => (
//                   <option key={t} value={t}>
//                     {t.replace(/_/g, " ")}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className={styles.formGroup}>
//               <label className={styles.label}>State of Supply</label>
//               <div className={styles.inputIcon}>
//                 <MapPin size={18} />
//                 <select
//                   value={form.stateOfSupply}
//                   onChange={(e) => setForm({ ...form, stateOfSupply: e.target.value })}
//                   className={styles.input}
//                   disabled={loadingData}
//                 >
//                   {states.map((s) => (
//                     <option key={s} value={s}>
//                       {s.replace(/_/g, " ")}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* DESCRIPTION */}
//         <div className={styles.formSection}>
//           <label className={styles.label}>Description</label>
//           <textarea
//             value={form.description}
//             onChange={(e) => setForm({ ...form, description: e.target.value })}
//             className={`${styles.input} ${styles.textarea}`}
//             rows={3}
//             placeholder="Optional notes..."
//             disabled={loadingData}
//           />
//         </div>

//         {/* ITEMS TABLE */}
//         <div className={styles.formSection}>
//           <div className={styles.itemsHeader}>
//             <h2 className={styles.sectionTitle}>
//               <Package size={20} />
//               Returned Items
//             </h2>
//             <button
//               type="button"
//               onClick={addItem}
//               className={styles.buttonAdd}
//               disabled={loadingData}
//             >
//               <Plus size={18} />
//               Add Item
//             </button>
//           </div>

//           <div className={styles.tableContainer}>
//             <table className={styles.itemsTable}>
//               <thead>
//                 <tr>
//                   <th>No</th>
//                   <th>Item Name</th>
//                   <th>HSN</th>
//                   <th>Qty</th>
//                   <th>Unit</th>
//                   <th>Rate</th>
//                   <th>Discount</th>
//                   <th>Tax Type</th>
//                   <th>Tax Rate</th>
//                   <th>Tax ₹</th>
//                   <th>Total ₹</th>
//                   <th></th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {form.items.map((item, idx) => {
//                   const maxQty = maxQtyMap[item.itemId || item.name] || 0
//                   return (
//                     <tr key={idx}>
//                       <td className={styles.rowNumber}>{idx + 1}</td>
//                       <td>
//                         <select
//                           value={item.itemId || ""}
//                           onChange={(e) => handleItemSelect(idx, e.target.value)}
//                           className={styles.tableSelect}
//                           disabled={loadingData}
//                         >
//                           <option value="">-- Select --</option>
//                           {items.map((i) => (
//                             <option key={i.itemId} value={i.itemId}>
//                               {i.itemName}
//                             </option>
//                           ))}
//                         </select>
//                       </td>
//                       <td>
//                         <input
//                           type="text"
//                           value={item.hsn}
//                           readOnly
//                           className={styles.tableInputReadonly}
//                         />
//                       </td>
//                       <td>
//                         <input
//                           type="number"
//                           step="0.01"
//                           min="0"
//                           value={item.quantity}
//                           onChange={(e) => handleQuantityChange(idx, e.target.value)}
//                           className={styles.tableInput}
//                           placeholder={maxQty > 0 ? `Max ${maxQty}` : ""}
//                           disabled={loadingData}
//                         />
//                         {maxQty > 0 && (
//                           <div style={{ fontSize: "0.75rem", color: "#666" }}>
//                             Max: {maxQty}
//                           </div>
//                         )}
//                       </td>
//                       <td>
//                         <select
//                           value={item.unit}
//                           onChange={(e) => handleItemChange(idx, "unit", e.target.value)}
//                           className={styles.tableSelect}
//                           disabled={loadingData}
//                         >
//                           {units.map((u) => (
//                             <option key={u} value={u}>{u}</option>
//                           ))}
//                         </select>
//                       </td>
//                       <td>
//                         <input
//                           type="number"
//                           step="0.01"
//                           value={item.ratePerUnit}
//                           onChange={(e) => handleItemChange(idx, "ratePerUnit", e.target.value)}
//                           className={styles.tableInput}
//                           disabled={loadingData}
//                         />
//                       </td>
//                       <td>
//                         <input
//                           type="number"
//                           step="0.01"
//                           min="0"
//                           value={item.discountAmount}
//                           onChange={(e) => handleItemChange(idx, "discountAmount", e.target.value)}
//                           className={styles.tableInput}
//                           disabled={loadingData}
//                         />
//                       </td>
//                       <td>
//                         <select
//                           value={item.taxType}
//                           onChange={(e) => handleItemChange(idx, "taxType", e.target.value)}
//                           className={styles.tableSelect}
//                           disabled={loadingData}
//                         >
//                           {taxTypes.map((t) => (
//                             <option key={t} value={t}>
//                               {t === "WITHTAX" ? "Inc. Tax" : "Ex. Tax"}
//                             </option>
//                           ))}
//                         </select>
//                       </td>
//                       <td>
//                         <select
//                           value={item.taxRate}
//                           onChange={(e) => handleItemChange(idx, "taxRate", e.target.value)}
//                           className={styles.tableSelect}
//                           disabled={loadingData}
//                         >
//                           {taxRates.map((r) => (
//                             <option key={r} value={r}>
//                               {r.replace("GST", "").replace("IGST", "") || "0%"}
//                             </option>
//                           ))}
//                         </select>
//                       </td>
//                       <td className={styles.amountCell}>
//                         <IndianRupee size={14} />
//                         {item.totalTaxAmount.toFixed(2)}
//                       </td>
//                       <td className={styles.amountCell}>
//                         <IndianRupee size={14} />
//                         <strong>{item.totalAmount.toFixed(2)}</strong>
//                       </td>
//                       <td>
//                         {form.items.length > 1 && (
//                           <button
//                             type="button"
//                             onClick={() => removeItem(idx)}
//                             className={styles.tableDeleteBtn}
//                             disabled={loadingData}
//                           >
//                             <Trash2 size={16} />
//                           </button>
//                         )}
//                       </td>
//                     </tr>
//                   )
//                 })}
//               </tbody>
//             </table>

//             {form.items.length === 0 && (
//               <div className={styles.emptyTable}>
//                 <p>No items added yet. Select a bill or click "Add Item".</p>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* SUMMARY */}
//         <div className={styles.summarySection}>
//           <h2 className={styles.sectionTitle}>Return Summary</h2>
//           <div className={styles.summaryGrid}>
//             <div className={styles.summaryItem}>
//               <span className={styles.summaryLabel}>Total Quantity</span>
//               <span className={styles.summaryValue}>{form.totalQuantity}</span>
//             </div>
//             <div className={styles.summaryItem}>
//               <span className={styles.summaryLabel}>Total Discount</span>
//               <span className={styles.summaryValue}>
//                 <IndianRupee size={14} />
//                 {form.totalDiscount.toFixed(2)}
//               </span>
//             </div>
//             <div className={styles.summaryItem}>
//               <span className={styles.summaryLabel}>Total Tax</span>
//               <span className={styles.summaryValue}>
//                 <IndianRupee size={14} />
//                 {form.totalTaxAmount.toFixed(2)}
//               </span>
//             </div>
//             <div className={styles.summaryItem}>
//               <span className={styles.summaryLabel}>Total Amount</span>
//               <span className={`${styles.summaryValue} ${styles.summaryValueBold}`}>
//                 <IndianRupee size={14} />
//                 {form.totalAmount.toFixed(2)}
//               </span>
//             </div>
//             <div className={styles.summaryItem}>
//               <span className={styles.summaryLabel}>Amount Received</span>
//               <span className={styles.summaryValue}>
//                 <IndianRupee size={14} />
//                 {(parseFloat(form.receivedAmount) || 0).toFixed(2)}
//               </span>
//             </div>
//             <div className={`${styles.summaryItem} ${styles.summaryItemBalance}`}>
//               <span className={styles.summaryLabel}>Balance Amount</span>
//               <span className={`${styles.summaryValue} ${styles.summaryValueBalance}`}>
//                 <IndianRupee size={14} />
//                 {form.balanceAmount.toFixed(2)}
//               </span>
//             </div>
//           </div>

//           <div className={styles.formGrid} style={{ marginTop: "1rem" }}>
//             <div className={styles.formGroup}>
//               <label className={styles.label}>Amount Received</label>
//               <div className={styles.inputIcon}>
//                 <IndianRupee size={18} />
//                 <input
//                   type="number"
//                   step="0.01"
//                   min="0"
//                   value={form.receivedAmount}
//                   onChange={(e) => {
//                     setForm({ ...form, receivedAmount: e.target.value })
//                     recalculateTotals()
//                   }}
//                   className={styles.input}
//                   disabled={loadingData}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </form>
//     </div>
//   )
// }

// export default CreatePurchaseReturn







// "use client";

// import { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import api from "../../../utils/axiosInstance"; // Shared API with interceptors
// import { toast } from "react-toastify";
// import styles from "../Styles/Form.module.css";
// import {
//   Plus,
//   Trash2,
//   ArrowLeft,
//   CheckCircle,
//   Package,
//   Users,
//   Calendar,
//   CreditCard,
//   MapPin,
//   FileText,
//   IndianRupee,
//   Loader,
//   Phone,
//   Receipt,
// } from "lucide-react";

// const CreatePurchaseReturn = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const editId = queryParams.get("edit");

//   const [userData, setUserData] = useState(
//     JSON.parse(localStorage.getItem("eBilling") || "{}")
//   );

//   const token = userData?.accessToken;
//   const companyId = userData?.selectedCompany?.id;

//   const [loading, setLoading] = useState(false);
//   const [loadingData, setLoadingData] = useState(false);
//   const [loadingItems, setLoadingItems] = useState(false);
//   const [parties, setParties] = useState([]);
//   const [items, setItems] = useState([]);
//   const [purchases, setPurchases] = useState([]);
//   const [maxQtyMap, setMaxQtyMap] = useState({});

//   const paymentTypes = ["CASH", "UPI", "CREDIT_CARD", "DEBIT_CARD", "NET_BANKING", "WALLET", "CHEQUE", "OTHER"];
//   const states = [
//     "ANDHRA_PRADESH", "ARUNACHAL_PRADESH", "ASSAM", "BIHAR", "CHHATTISGARH", "GOA", "GUJARAT", "HARYANA",
//     "HIMACHAL_PRADESH", "JHARKHAND", "KARNATAKA", "KERALA", "MADHYA_PRADESH", "MAHARASHTRA", "MANIPUR",
//     "MEGHALAYA", "MIZORAM", "NAGALAND", "ODISHA", "PUNJAB", "RAJASTHAN", "SIKKIM", "TAMIL_NADU", "TELANGANA",
//     "TRIPURA", "UTTAR_PRADESH", "UTTARAKHAND", "WEST_BENGAL", "OTHER",
//   ];
//   const units = [
//     "CARTONS", "KILOGRAMS", "QUINTAL", "BOTTLES", "PIECES", "ROLLS", "NUMBERS", "PAIRS", "TABLETS",
//     "MILLILITRE", "BUNDLES", "BOX", "SQUARE_METERS", "BAGS", "CANS", "SQUARE_FEET",
//   ];
//   const taxTypes = ["WITHTAX", "WITHOUTTAX"];
//   const taxRates = [
//     "NONE", "EXEMPTED", "GST0", "IGST0", "GST0POINT25", "IGST0POINT25",
//     "GST3", "IGST3", "GST5", "IGST5", "GST12", "IGST12",
//     "GST18", "IGST18", "GST28", "IGST28",
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
//     billNo: "",
//     billDate: "",
//     paymentType: "CASH",
//     stateOfSupply: "MAHARASHTRA",
//     description: "",
//     items: [],
//     totalQuantity: 0,
//     totalDiscount: 0,
//     totalTaxAmount: 0,
//     totalAmount: 0,
//     receivedAmount: "0",
//     balanceAmount: 0,
//   });

//   // Sync userData
//   useEffect(() => {
//     const handleStorageChange = () => {
//       const updated = JSON.parse(localStorage.getItem("eBilling") || "{}");
//       setUserData(updated);
//     };

//     window.addEventListener("storage", handleStorageChange);
//     return () => window.removeEventListener("storage", handleStorageChange);
//   }, []);

//   // Auth check
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
//   }, [token, companyId, navigate]);

//   /* ==================== AUTO-FILL PHONE NUMBER WHEN PARTY SELECTED ==================== */
//   useEffect(() => {
//     if (!form.partyId || parties.length === 0) return;

//     const selectedParty = parties.find((p) => p.partyId === Number(form.partyId));
//     if (selectedParty) {
//       setForm((prev) => ({
//         ...prev,
//         phoneNo: selectedParty.phoneNo || "",
//       }));
//     }
//   }, [form.partyId, parties]);

//   /* ==================== FETCH DATA ==================== */
//   const fetchParties = async () => {
//     try {
//       const res = await api.get(`/company/${companyId}/parties`);
//       setParties(res.data || []);
//     } catch (err) {
//       toast.error("Failed to load parties");
//     }
//   };

//   const fetchItems = async () => {
//     setLoadingItems(true);
//     try {
//       const res = await api.get(`/company/${companyId}/items`);
//       setItems(res.data || []);
//     } catch (err) {
//       toast.error("Failed to load items");
//     } finally {
//       setLoadingItems(false);
//     }
//   };

//   const fetchPurchases = async () => {
//     try {
//       const res = await api.get(`/company/${companyId}/purchases`);
//       setPurchases(res.data || []);
//     } catch (err) {
//       toast.error("Failed to load purchases");
//     }
//   };

//   const fetchReturn = async (purchaseReturnId) => {
//     setLoadingData(true);
//     try {
//       const res = await api.get(`/purchase-return/${purchaseReturnId}`);
//       const r = res.data;

//       const returnItems = r.purchaseReturnItemResponses?.map((it) => ({
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
//         returnDate: r.returnDate?.split("T")[0] || "",
//         phoneNo: r.phoneNo || "",
//         billNo: r.billNo || "",
//         billDate: r.billDate?.split("T")[0] || "",
//         paymentType: r.paymentType || "CASH",
//         stateOfSupply: r.stateOfSupply || "MAHARASHTRA",
//         description: r.description || "",
//         items: returnItems,
//         totalQuantity: r.totalQuantity || 0,
//         totalDiscount: r.totalDiscount || 0,
//         totalTaxAmount: r.totalTaxAmount || 0,
//         totalAmount: r.totalAmount || 0,
//         receivedAmount: (r.receivedAmount || 0).toString(),
//         balanceAmount: r.balanceAmount || 0,
//       });

//       // Rebuild maxQtyMap for edit mode
//       const purchase = purchases.find((p) => p.billNo === r.billNo);
//       if (purchase) {
//         const map = {};
//         purchase.purchaseItemResponses?.forEach((it) => {
//           const key = it.itemId?.toString() || it.itemName;
//           map[key] = (map[key] || 0) + (parseFloat(it.quantity) || 0);
//         });
//         setMaxQtyMap(map);
//       }
//     } catch (err) {
//       toast.error("Failed to load return");
//       navigate("/purchase_returns");
//     } finally {
//       setLoadingData(false);
//     }
//   };

//   useEffect(() => {
//     if (token && companyId) {
//       fetchParties();
//       fetchItems();
//       fetchPurchases();
//       if (editId) fetchReturn(editId);
//     }
//   }, [token, companyId, editId]);

//   /* ==================== BILL & ITEM HANDLING ==================== */
//   const handleBillSelect = (billNo) => {
//     const purchase = purchases.find((p) => p.billNo === billNo);
//     if (!purchase) return;

//     const newItems = purchase.purchaseItemResponses?.map((it) => ({
//       itemId: it.itemId?.toString() || "",
//       name: it.itemName,
//       hsn: it.itemHsnCode || "",
//       quantity: "0",
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
//       partyId: purchase.partyResponseDto?.partyId?.toString() || "",
//       phoneNo: purchase.partyResponseDto?.phoneNo || "",
//       billDate: purchase.billDate?.split("T")[0] || "",
//       stateOfSupply: purchase.stateOfSupply || "MAHARASHTRA",
//       items: newItems,
//     }));

//     const map = {};
//     purchase.purchaseItemResponses?.forEach((it) => {
//       const key = it.itemId?.toString() || it.itemName;
//       map[key] = (map[key] || 0) + (parseFloat(it.quantity) || 0);
//     });
//     setMaxQtyMap(map);
//   };

//   const handleItemSelect = (index, itemId) => {
//     const selected = items.find((i) => i.itemId?.toString() === itemId);
//     const newItems = [...form.items];

//     if (!selected) {
//       newItems[index] = {
//         ...newItems[index],
//         itemId: "",
//         name: "",
//         hsn: "",
//         unit: "PIECES",
//         ratePerUnit: "",
//         taxType: "WITHTAX",
//         taxRate: "GST18",
//         discountAmount: "0",
//         quantity: "0",
//         totalTaxAmount: 0,
//         totalAmount: 0,
//       };
//       recalculateTotals(newItems);
//       return;
//     }

//     let defaultQty = newItems[index].quantity || "0";
//     if (form.billNo) {
//       const purchase = purchases.find((p) => p.billNo === form.billNo);
//       const purchaseItem = purchase?.purchaseItemResponses?.find(
//         (it) => it.itemId?.toString() === itemId
//       );
//       if (purchaseItem && !newItems[index].quantity) {
//         defaultQty = purchaseItem.quantity?.toString() || "0";
//       }
//     }

//     newItems[index] = {
//       ...newItems[index],
//       itemId: selected.itemId?.toString(),
//       name: selected.itemName,
//       hsn: selected.itemHsn,
//       unit: selected.baseUnit,
//       ratePerUnit: selected.purchasePrice?.toString() || selected.salePrice?.toString() || "",
//       taxType: selected.purchaseTaxType || selected.saleTaxType || "WITHTAX",
//       taxRate: selected.taxRate || "GST18",
//       quantity: defaultQty,
//       discountAmount: "0",
//     };

//     recalculateTotals(newItems);
//   };

//   /* ==================== CALCULATIONS ==================== */
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

//   const recalculateTotals = (newItems = form.items) => {
//     const calculated = newItems.map(calculateItem);
//     const totalQty = calculated.reduce((s, i) => s + (parseFloat(i.quantity) || 0), 0);
//     const totalDiscount = calculated.reduce((s, i) => s + (parseFloat(i.discountAmount) || 0), 0);
//     const totalTax = calculated.reduce((s, i) => s + i.totalTaxAmount, 0);
//     const totalAmt = calculated.reduce((s, i) => s + i.totalAmount, 0);
//     const received = parseFloat(form.receivedAmount) || 0;
//     const balance = totalAmt - received;

//     setForm((prev) => ({
//       ...prev,
//       items: calculated,
//       totalQuantity: parseFloat(totalQty.toFixed(2)),
//       totalDiscount: parseFloat(totalDiscount.toFixed(2)),
//       totalTaxAmount: parseFloat(totalTax.toFixed(2)),
//       totalAmount: parseFloat(totalAmt.toFixed(2)),
//       balanceAmount: parseFloat(balance.toFixed(2)),
//     }));
//   };

//   const handleQuantityChange = (index, value) => {
//     const num = parseFloat(value) || 0;
//     const item = form.items[index];
//     const key = item.itemId || item.name;
//     const maxQty = maxQtyMap[key] || Infinity;

//     if (num > maxQty && maxQty !== Infinity) {
//       toast.warn(`Maximum return quantity: ${maxQty}`);
//       return;
//     }

//     const newItems = [...form.items];
//     newItems[index].quantity = value;
//     recalculateTotals(newItems);
//   };

//   const handleItemChange = (index, field, value) => {
//     const newItems = [...form.items];
//     newItems[index][field] = value;
//     recalculateTotals(newItems);
//   };

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

//   /* ==================== SUBMIT ==================== */
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!form.partyId || !form.returnNo || !form.returnDate || !form.billNo || !form.phoneNo) {
//       toast.error("Fill all required fields");
//       return;
//     }

//     const invalidItem = form.items.some(
//       (i) =>
//         !i.name ||
//         !i.quantity ||
//         parseFloat(i.quantity) <= 0 ||
//         !i.ratePerUnit ||
//         parseFloat(i.ratePerUnit) <= 0
//     );
//     if (invalidItem) {
//       toast.error("Each item must have Name, Qty > 0, Rate > 0");
//       return;
//     }

//     const payload = {
//       partyId: Number(form.partyId),
//       returnNo: form.returnNo.trim(),
//       returnDate: form.returnDate,
//       phoneNo: form.phoneNo.trim(),
//       billNo: form.billNo.trim(),
//       billDate: form.billDate,
//       totalDiscount: form.totalDiscount,
//       totalQuantity: form.totalQuantity,
//       totalTaxAmount: form.totalTaxAmount,
//       totalAmount: form.totalAmount,
//       receivedAmount: parseFloat(form.receivedAmount) || 0,
//       balanceAmount: form.balanceAmount,
//       paymentType: form.paymentType,
//       stateOfSupply: form.stateOfSupply,
//       description: form.description.trim() || null,
//       purchaseReturnItemRequests: form.items.map((i) => ({
//         itemId: i.itemId ? Number(i.itemId) : null,
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
//         await api.put(`/purchase-return/${editId}`, payload);
//         toast.success("Purchase Return updated!");
//       } else {
//         await api.post(`/company/${companyId}/create/purchase-return`, payload);
//         toast.success("Purchase Return created!");
//       }

//       navigate("/purchase_returns");
//     } catch (err) {
//       toast.error(err.response?.data?.message || `Failed to ${editId ? "update" : "create"} return`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const isEditMode = !!editId;

//   return (
//     <div className={styles.container}>
//       {(loadingData || loading) && (
//         <div className={styles.loadingContainer}>
//           <Loader className={styles.spinnerIcon} />
//           <p>{loadingData ? "Loading return data..." : "Saving..."}</p>
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className={styles.form}>
//         {/* HEADER */}
//         <div className={styles.header}>
//           <div className={styles.headerContent}>
//             <div className={styles.titleSection}>
//               <h1 className={styles.title}>
//                 {isEditMode ? (
//                   <>
//                     <CheckCircle className={styles.titleIcon} />
//                     Edit Purchase Return
//                   </>
//                 ) : (
//                   <>
//                     <FileText className={styles.titleIcon} />
//                     Create Purchase Return
//                   </>
//                 )}
//               </h1>
//               <p className={styles.subtitle}>
//                 {isEditMode ? `Return #${form.returnNo}` : "Return items from a purchase bill"}
//               </p>
//             </div>
//           </div>
//           <div className={styles.headerActions}>
//             <button
//               type="button"
//               onClick={() => navigate("/purchase_returns")}
//               className={styles.buttonSecondary}
//               disabled={loading}
//             >
//               <ArrowLeft size={18} />
//               Back
//             </button>
//             <button
//               type="submit"
//               className={styles.buttonPrimary}
//               disabled={loading || loadingData}
//             >
//               {loading ? (
//                 <>
//                   <Loader size={18} className={styles.spinnerSmall} />
//                   Saving...
//                 </>
//               ) : (
//                 <>
//                   <CheckCircle size={18} />
//                   {isEditMode ? "Update Return" : "Create Return"}
//                 </>
//               )}
//             </button>
//           </div>
//         </div>

//         {/* PARTY & RETURN INFO */}
//         <div className={styles.formSection}>
//           <h2 className={styles.sectionTitle}>
//             <Users size={20} />
//             Party Information
//           </h2>
//           <div className={styles.formGrid}>
//             <div className={styles.formGroup}>
//               <label className={styles.label}>
//                 Party <span className={styles.required}>*</span>
//               </label>
//               <select
//                 value={form.partyId}
//                 onChange={(e) => setForm({ ...form, partyId: e.target.value })}
//                 required
//                 className={styles.input}
//                 disabled={loadingData}
//               >
//                 <option value="">Select Party</option>
//                 {parties.map((p) => (
//                   <option key={p.partyId} value={p.partyId}>
//                     {p.name} - {p.phoneNo || "No Phone"}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className={styles.formGroup}>
//               <label className={styles.label}>
//                 Return Number <span className={styles.required}>*</span>
//               </label>
//               <input
//                 type="text"
//                 value={form.returnNo}
//                 onChange={(e) => setForm({ ...form, returnNo: e.target.value })}
//                 required
//                 className={styles.input}
//                 placeholder="e.g. PR-001"
//                 disabled={loadingData}
//               />
//             </div>

//             <div className={styles.formGroup}>
//               <label className={styles.label}>
//                 Phone No <span className={styles.required}>*</span>
//               </label>
//               <div className={styles.inputIcon}>
//                 <Phone size={18} />
//                 <input
//                   type="text"
//                   value={form.phoneNo}
//                   readOnly
//                   className={`${styles.input} ${styles.inputReadonly}`}
//                   placeholder="Auto-filled"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* DATES & BILL */}
//         <div className={styles.formSection}>
//           <h2 className={styles.sectionTitle}>
//             <Calendar size={20} />
//             Important Dates & Bill
//           </h2>
//           <div className={styles.formGrid}>
//             <div className={styles.formGroup}>
//               <label className={styles.label}>
//                 Return Date <span className={styles.required}>*</span>
//               </label>
//               <input
//                 type="date"
//                 value={form.returnDate}
//                 onChange={(e) => setForm({ ...form, returnDate: e.target.value })}
//                 required
//                 className={styles.input}
//                 disabled={loadingData}
//               />
//             </div>

//             <div className={styles.formGroup}>
//               <label className={styles.label}>
//                 Original Bill No <span className={styles.required}>*</span>
//               </label>
//               <div className={styles.inputIcon}>
//                 <Receipt size={18} />
//                 <select
//                   value={form.billNo}
//                   onChange={(e) => {
//                     setForm({ ...form, billNo: e.target.value });
//                     handleBillSelect(e.target.value);
//                   }}
//                   required
//                   className={styles.input}
//                   disabled={loadingData}
//                 >
//                   <option value="">-- Select Bill --</option>
//                   {purchases.map((p) => (
//                     <option key={p.purchaseId} value={p.billNo}>
//                       {p.billNo} ({new Date(p.billDate).toLocaleDateString()})
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* PAYMENT & LOCATION */}
//         <div className={styles.formSection}>
//           <h2 className={styles.sectionTitle}>
//             <CreditCard size={20} />
//             Payment & Location
//           </h2>
//           <div className={styles.formGrid}>
//             <div className={styles.formGroup}>
//               <label className={styles.label}>Payment Type</label>
//               <select
//                 value={form.paymentType}
//                 onChange={(e) => setForm({ ...form, paymentType: e.target.value })}
//                 className={styles.input}
//                 disabled={loadingData}
//               >
//                 {paymentTypes.map((t) => (
//                   <option key={t} value={t}>
//                     {t.replace(/_/g, " ")}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className={styles.formGroup}>
//               <label className={styles.label}>State of Supply</label>
//               <div className={styles.inputIcon}>
//                 <MapPin size={18} />
//                 <select
//                   value={form.stateOfSupply}
//                   onChange={(e) => setForm({ ...form, stateOfSupply: e.target.value })}
//                   className={styles.input}
//                   disabled={loadingData}
//                 >
//                   {states.map((s) => (
//                     <option key={s} value={s}>
//                       {s.replace(/_/g, " ")}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* DESCRIPTION */}
//         <div className={styles.formSection}>
//           <label className={styles.label}>Description</label>
//           <textarea
//             value={form.description}
//             onChange={(e) => setForm({ ...form, description: e.target.value })}
//             className={`${styles.input} ${styles.textarea}`}
//             rows={3}
//             placeholder="Optional notes..."
//             disabled={loadingData}
//           />
//         </div>

//         {/* ITEMS TABLE */}
//         <div className={styles.formSection}>
//           <div className={styles.itemsHeader}>
//             <h2 className={styles.sectionTitle}>
//               <Package size={20} />
//               Returned Items
//             </h2>
//             <button
//               type="button"
//               onClick={addItem}
//               className={styles.buttonAdd}
//               disabled={loadingData}
//             >
//               <Plus size={18} />
//               Add Item
//             </button>
//           </div>

//           <div className={styles.tableContainer}>
//             <table className={styles.itemsTable}>
//               <thead>
//                 <tr>
//                   <th>No</th>
//                   <th>Item Name</th>
//                   <th>HSN</th>
//                   <th>Qty</th>
//                   <th>Unit</th>
//                   <th>Rate</th>
//                   <th>Discount</th>
//                   <th>Tax Type</th>
//                   <th>Tax Rate</th>
//                   <th>Tax ₹</th>
//                   <th>Total ₹</th>
//                   <th></th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {form.items.map((item, idx) => {
//                   const maxQty = maxQtyMap[item.itemId || item.name] || 0;
//                   return (
//                     <tr key={idx}>
//                       <td className={styles.rowNumber}>{idx + 1}</td>
//                       <td>
//                         <select
//                           value={item.itemId || ""}
//                           onChange={(e) => handleItemSelect(idx, e.target.value)}
//                           className={styles.tableSelect}
//                           disabled={loadingData}
//                         >
//                           <option value="">-- Select --</option>
//                           {items.map((i) => (
//                             <option key={i.itemId} value={i.itemId}>
//                               {i.itemName}
//                             </option>
//                           ))}
//                         </select>
//                       </td>
//                       <td>
//                         <input
//                           type="text"
//                           value={item.hsn}
//                           readOnly
//                           className={styles.tableInputReadonly}
//                         />
//                       </td>
//                       <td>
//                         <input
//                           type="number"
//                           step="0.01"
//                           min="0"
//                           value={item.quantity}
//                           onChange={(e) => handleQuantityChange(idx, e.target.value)}
//                           className={styles.tableInput}
//                           placeholder={maxQty > 0 ? `Max ${maxQty}` : ""}
//                           disabled={loadingData}
//                         />
//                         {maxQty > 0 && (
//                           <div style={{ fontSize: "0.75rem", color: "#666" }}>
//                             Max: {maxQty}
//                           </div>
//                         )}
//                       </td>
//                       <td>
//                         <select
//                           value={item.unit}
//                           onChange={(e) => handleItemChange(idx, "unit", e.target.value)}
//                           className={styles.tableSelect}
//                           disabled={loadingData}
//                         >
//                           {units.map((u) => (
//                             <option key={u} value={u}>{u}</option>
//                           ))}
//                         </select>
//                       </td>
//                       <td>
//                         <input
//                           type="number"
//                           step="0.01"
//                           value={item.ratePerUnit}
//                           onChange={(e) => handleItemChange(idx, "ratePerUnit", e.target.value)}
//                           className={styles.tableInput}
//                           disabled={loadingData}
//                         />
//                       </td>
//                       <td>
//                         <input
//                           type="number"
//                           step="0.01"
//                           min="0"
//                           value={item.discountAmount}
//                           onChange={(e) => handleItemChange(idx, "discountAmount", e.target.value)}
//                           className={styles.tableInput}
//                           disabled={loadingData}
//                         />
//                       </td>
//                       <td>
//                         <select
//                           value={item.taxType}
//                           onChange={(e) => handleItemChange(idx, "taxType", e.target.value)}
//                           className={styles.tableSelect}
//                           disabled={loadingData}
//                         >
//                           {taxTypes.map((t) => (
//                             <option key={t} value={t}>
//                               {t === "WITHTAX" ? "Inc. Tax" : "Ex. Tax"}
//                             </option>
//                           ))}
//                         </select>
//                       </td>
//                       <td>
//                         <select
//                           value={item.taxRate}
//                           onChange={(e) => handleItemChange(idx, "taxRate", e.target.value)}
//                           className={styles.tableSelect}
//                           disabled={loadingData}
//                         >
//                           {taxRates.map((r) => (
//                             <option key={r} value={r}>
//                               {r.replace("GST", "").replace("IGST", "") || "0%"}
//                             </option>
//                           ))}
//                         </select>
//                       </td>
//                       <td className={styles.amountCell}>
//                         <IndianRupee size={14} />
//                         {item.totalTaxAmount.toFixed(2)}
//                       </td>
//                       <td className={styles.amountCell}>
//                         <IndianRupee size={14} />
//                         <strong>{item.totalAmount.toFixed(2)}</strong>
//                       </td>
//                       <td>
//                         {form.items.length > 1 && (
//                           <button
//                             type="button"
//                             onClick={() => removeItem(idx)}
//                             className={styles.tableDeleteBtn}
//                             disabled={loadingData}
//                           >
//                             <Trash2 size={16} />
//                           </button>
//                         )}
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>

//             {form.items.length === 0 && (
//               <div className={styles.emptyTable}>
//                 <p>No items added yet. Select a bill or click "Add Item".</p>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* SUMMARY */}
//         <div className={styles.summarySection}>
//           <h2 className={styles.sectionTitle}>Return Summary</h2>
//           <div className={styles.summaryGrid}>
//             <div className={styles.summaryItem}>
//               <span className={styles.summaryLabel}>Total Quantity</span>
//               <span className={styles.summaryValue}>{form.totalQuantity}</span>
//             </div>
//             <div className={styles.summaryItem}>
//               <span className={styles.summaryLabel}>Total Discount</span>
//               <span className={styles.summaryValue}>
//                 <IndianRupee size={14} />
//                 {form.totalDiscount.toFixed(2)}
//               </span>
//             </div>
//             <div className={styles.summaryItem}>
//               <span className={styles.summaryLabel}>Total Tax</span>
//               <span className={styles.summaryValue}>
//                 <IndianRupee size={14} />
//                 {form.totalTaxAmount.toFixed(2)}
//               </span>
//             </div>
//             <div className={styles.summaryItem}>
//               <span className={styles.summaryLabel}>Total Amount</span>
//               <span className={`${styles.summaryValue} ${styles.summaryValueBold}`}>
//                 <IndianRupee size={14} />
//                 {form.totalAmount.toFixed(2)}
//               </span>
//             </div>
//             <div className={styles.summaryItem}>
//               <span className={styles.summaryLabel}>Amount Received</span>
//               <span className={styles.summaryValue}>
//                 <IndianRupee size={14} />
//                 {(parseFloat(form.receivedAmount) || 0).toFixed(2)}
//               </span>
//             </div>
//             <div className={`${styles.summaryItem} ${styles.summaryItemBalance}`}>
//               <span className={styles.summaryLabel}>Balance Amount</span>
//               <span className={`${styles.summaryValue} ${styles.summaryValueBalance}`}>
//                 <IndianRupee size={14} />
//                 {form.balanceAmount.toFixed(2)}
//               </span>
//             </div>
//           </div>

//           <div className={styles.formGrid} style={{ marginTop: "1rem" }}>
//             <div className={styles.formGroup}>
//               <label className={styles.label}>Amount Received</label>
//               <div className={styles.inputIcon}>
//                 <IndianRupee size={18} />
//                 <input
//                   type="number"
//                   step="0.01"
//                   min="0"
//                   value={form.receivedAmount}
//                   onChange={(e) => {
//                     setForm({ ...form, receivedAmount: e.target.value });
//                     recalculateTotals();
//                   }}
//                   className={styles.input}
//                   disabled={loadingData}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default CreatePurchaseReturn;









"use client";

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../../utils/axiosInstance";
import { toast } from "react-toastify";
import styles from "../Styles/Form.module.css";
import {
  Plus,
  Trash2,
  ArrowLeft,
  CheckCircle,
  Package,
  Users,
  Calendar,
  CreditCard,
  MapPin,
  FileText,
  IndianRupee,
  Loader,
  Phone,
  Receipt,
} from "lucide-react";

const CreatePurchaseReturn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const editId = queryParams.get("edit");

  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("eBilling") || "{}")
  );

  const token = userData?.accessToken;
  const companyId = userData?.selectedCompany?.id;

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [loadingItems, setLoadingItems] = useState(false);
  const [parties, setParties] = useState([]);
  const [items, setItems] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [maxQtyMap, setMaxQtyMap] = useState({});

  const paymentTypes = ["CASH", "UPI", "CREDIT_CARD", "DEBIT_CARD", "NET_BANKING", "WALLET", "CHEQUE", "OTHER"];
  const states = [
    "ANDHRA_PRADESH", "ARUNACHAL_PRADESH", "ASSAM", "BIHAR", "CHHATTISGARH", "GOA", "GUJARAT", "HARYANA",
    "HIMACHAL_PRADESH", "JHARKHAND", "KARNATAKA", "KERALA", "MADHYA_PRADESH", "MAHARASHTRA", "MANIPUR",
    "MEGHALAYA", "MIZORAM", "NAGALAND", "ODISHA", "PUNJAB", "RAJASTHAN", "SIKKIM", "TAMIL_NADU", "TELANGANA",
    "TRIPURA", "UTTAR_PRADESH", "UTTARAKHAND", "WEST_BENGAL", "OTHER",
  ];
  const units = [
    "CARTONS", "KILOGRAMS", "QUINTAL", "BOTTLES", "PIECES", "ROLLS", "NUMBERS", "PAIRS", "TABLETS",
    "MILLILITRE", "BUNDLES", "BOX", "SQUARE_METERS", "BAGS", "CANS", "SQUARE_FEET",
  ];
  const taxTypes = ["WITHTAX", "WITHOUTTAX"];
  const taxRates = [
    "NONE", "EXEMPTED", "GST0", "IGST0", "GST0POINT25", "IGST0POINT25",
    "GST3", "IGST3", "GST5", "IGST5", "GST12", "IGST12",
    "GST18", "IGST18", "GST28", "IGST28",
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
    billNo: "",
    billDate: "",
    paymentType: "CASH",
    stateOfSupply: "MAHARASHTRA",
    description: "",
    items: [],
    totalQuantity: 0,
    totalDiscount: 0,
    totalTaxAmount: 0,
    totalAmount: 0,
    receivedAmount: "0",
    balanceAmount: 0,
  });

  // Return No Auto-generation
  const getNextReturnNumberPreview = () => {
    if (!companyId) return "PR/NEW";
    const year = new Date().getFullYear();
    const key = `purchaseReturnCounter_${companyId}_${year}`;
    const counter = parseInt(localStorage.getItem(key) || "0", 10);
    return `PR/${year}/${counter + 1}`;
  };

  const reserveNextReturnNumber = () => {
    if (!companyId) return "PR/NEW";
    const year = new Date().getFullYear();
    const key = `purchaseReturnCounter_${companyId}_${year}`;
    let counter = parseInt(localStorage.getItem(key) || "0", 10);
    counter += 1;
    localStorage.setItem(key, String(counter));
    return `PR/${year}/${counter}`;
  };

  // Preview for new returns
  useEffect(() => {
    if (editId || !companyId) return;
    const preview = getNextReturnNumberPreview();
    setForm(prev => ({ ...prev, returnNo: preview }));
  }, [editId, companyId]);

  const handleReturnNoChange = (e) => {
    let value = e.target.value.trim().toUpperCase();

    if (value === "PR" || value === "PR/" || value.startsWith("PR/")) {
      const nextNumber = reserveNextReturnNumber();
      setForm(prev => ({ ...prev, returnNo: nextNumber }));
      return;
    }

    setForm(prev => ({ ...prev, returnNo: value }));
  };

  // Sync userData
  useEffect(() => {
    const handleStorageChange = () => {
      const updated = JSON.parse(localStorage.getItem("eBilling") || "{}");
      setUserData(updated);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Auth check
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
  }, [token, companyId, navigate]);

  const fetchParties = async () => {
    try {
      const res = await api.get(`/company/${companyId}/parties`);
      setParties(res.data || []);
    } catch (err) {
      toast.error("Failed to load parties");
    }
  };

  const fetchItems = async () => {
    setLoadingItems(true);
    try {
      const res = await api.get(`/company/${companyId}/items`);
      setItems(res.data || []);
    } catch (err) {
      toast.error("Failed to load items");
    } finally {
      setLoadingItems(false);
    }
  };

  const fetchPurchases = async () => {
    try {
      const res = await api.get(`/company/${companyId}/purchases`);
      setPurchases(res.data || []);
    } catch (err) {
      toast.error("Failed to load purchases");
    }
  };

  const fetchReturn = async (purchaseReturnId) => {
    setLoadingData(true);
    try {
      const res = await api.get(`/purchase-return/${purchaseReturnId}`);
      const r = res.data;

      const returnItems = r.purchaseReturnItemResponses?.map((it) => ({
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
        returnDate: r.returnDate?.split("T")[0] || "",
        phoneNo: r.phoneNo || "",
        billNo: r.billNo || "",
        billDate: r.billDate?.split("T")[0] || "",
        paymentType: r.paymentType || "CASH",
        stateOfSupply: r.stateOfSupply || "MAHARASHTRA",
        description: r.description || "",
        items: returnItems,
        totalQuantity: r.totalQuantity || 0,
        totalDiscount: r.totalDiscount || 0,
        totalTaxAmount: r.totalTaxAmount || 0,
        totalAmount: r.totalAmount || 0,
        receivedAmount: (r.receivedAmount || 0).toString(),
        balanceAmount: r.balanceAmount || 0,
      });

      const purchase = purchases.find((p) => p.billNo === r.billNo);
      if (purchase) {
        const map = {};
        purchase.purchaseItemResponses?.forEach((it) => {
          const key = it.itemId?.toString() || it.itemName;
          map[key] = (map[key] || 0) + (parseFloat(it.quantity) || 0);
        });
        setMaxQtyMap(map);
      }
    } catch (err) {
      toast.error("Failed to load return");
      navigate("/purchase_returns");
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (token && companyId) {
      fetchParties();
      fetchItems();
      fetchPurchases();
      if (editId) fetchReturn(editId);
    }
  }, [token, companyId, editId]);

  const handleBillSelect = (billNo) => {
    const purchase = purchases.find((p) => p.billNo === billNo);
    if (!purchase) return;

    const newItems = purchase.purchaseItemResponses?.map((it) => ({
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
      partyId: purchase.partyResponseDto?.partyId?.toString() || "",
      phoneNo: purchase.partyResponseDto?.phoneNo || "",
      billDate: purchase.billDate?.split("T")[0] || "",
      stateOfSupply: purchase.stateOfSupply || "MAHARASHTRA",
      items: newItems,
    }));

    const map = {};
    purchase.purchaseItemResponses?.forEach((it) => {
      const key = it.itemId?.toString() || it.itemName;
      map[key] = (map[key] || 0) + (parseFloat(it.quantity) || 0);
    });
    setMaxQtyMap(map);
  };

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

  const recalculateTotals = (newItems = form.items) => {
    const calculated = newItems.map(calculateItem);
    const totalQty = calculated.reduce((s, i) => s + (parseFloat(i.quantity) || 0), 0);
    const totalDiscount = calculated.reduce((s, i) => s + (parseFloat(i.discountAmount) || 0), 0);
    const totalTax = calculated.reduce((s, i) => s + i.totalTaxAmount, 0);
    const totalAmt = calculated.reduce((s, i) => s + i.totalAmount, 0);
    const received = parseFloat(form.receivedAmount) || 0;
    const balance = totalAmt - received;

    setForm((prev) => ({
      ...prev,
      items: calculated,
      totalQuantity: parseFloat(totalQty.toFixed(2)),
      totalDiscount: parseFloat(totalDiscount.toFixed(2)),
      totalTaxAmount: parseFloat(totalTax.toFixed(2)),
      totalAmount: parseFloat(totalAmt.toFixed(2)),
      balanceAmount: parseFloat(balance.toFixed(2)),
    }));
  };

  const handleQuantityChange = (index, value) => {
    const num = parseFloat(value) || 0;
    const item = form.items[index];
    const key = item.itemId || item.name;
    const maxQty = maxQtyMap[key] || Infinity;

    if (num > maxQty && maxQty !== Infinity) {
      toast.warn(`Maximum return quantity: ${maxQty}`);
      return;
    }

    const newItems = [...form.items];
    newItems[index].quantity = value;
    recalculateTotals(newItems);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...form.items];
    newItems[index][field] = value;
    recalculateTotals(newItems);
  };

  const handleItemSelect = (index, itemId) => {
    const selected = items.find((i) => i.itemId?.toString() === itemId);
    const newItems = [...form.items];

    if (!selected) {
      newItems[index] = {
        ...newItems[index],
        itemId: "",
        name: "",
        hsn: "",
        unit: "PIECES",
        ratePerUnit: "",
        taxType: "WITHTAX",
        taxRate: "GST18",
        discountAmount: "0",
        quantity: "0",
        totalTaxAmount: 0,
        totalAmount: 0,
      };
      recalculateTotals(newItems);
      return;
    }

    let defaultQty = newItems[index].quantity || "0";
    if (form.billNo) {
      const purchase = purchases.find((p) => p.billNo === form.billNo);
      const purchaseItem = purchase?.purchaseItemResponses?.find(
        (it) => it.itemId?.toString() === itemId
      );
      if (purchaseItem && !newItems[index].quantity) {
        defaultQty = purchaseItem.quantity?.toString() || "0";
      }
    }

    newItems[index] = {
      ...newItems[index],
      itemId: selected.itemId?.toString(),
      name: selected.itemName,
      hsn: selected.itemHsn,
      unit: selected.baseUnit,
      ratePerUnit: selected.purchasePrice?.toString() || selected.salePrice?.toString() || "",
      taxType: selected.purchaseTaxType || selected.saleTaxType || "WITHTAX",
      taxRate: selected.taxRate || "GST18",
      quantity: defaultQty,
      discountAmount: "0",
    };

    recalculateTotals(newItems);
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.partyId || !form.returnNo || !form.returnDate || !form.billNo || !form.phoneNo) {
      toast.error("Fill all required fields");
      return;
    }

    const invalidItem = form.items.some(
      (i) =>
        !i.name ||
        !i.quantity ||
        parseFloat(i.quantity) <= 0 ||
        !i.ratePerUnit ||
        parseFloat(i.ratePerUnit) <= 0
    );
    if (invalidItem) {
      toast.error("Each item must have Name, Qty > 0, Rate > 0");
      return;
    }

    const payload = {
      partyId: Number(form.partyId),
      returnNo: form.returnNo.trim(),
      returnDate: form.returnDate,
      phoneNo: form.phoneNo.trim(),
      billNo: form.billNo.trim(),
      billDate: form.billDate,
      totalDiscount: form.totalDiscount,
      totalQuantity: form.totalQuantity,
      totalTaxAmount: form.totalTaxAmount,
      totalAmount: form.totalAmount,
      receivedAmount: parseFloat(form.receivedAmount) || 0,
      balanceAmount: form.balanceAmount,
      paymentType: form.paymentType,
      stateOfSupply: form.stateOfSupply,
      description: form.description.trim() || null,
      purchaseReturnItemRequests: form.items.map((i) => ({
        itemId: i.itemId ? Number(i.itemId) : null,
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
        await api.put(`/purchase-return/${editId}`, payload);
        toast.success("Purchase Return updated!");
      } else {
        await api.post(`/company/${companyId}/create/purchase-return`, payload);
        toast.success("Purchase Return created!");

        // Increment counter only after successful creation
        if (companyId) {
          const year = new Date().getFullYear();
          const key = `purchaseReturnCounter_${companyId}_${year}`;
          const current = parseInt(localStorage.getItem(key) || "0", 10);
          localStorage.setItem(key, String(current + 1));
        }
      }

      navigate("/purchase_returns");
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to ${editId ? "update" : "create"} return`);
    } finally {
      setLoading(false);
    }
  };

  const isEditMode = !!editId;

  return (
    <div className={styles.container}>
      {(loadingData || loading) && (
        <div className={styles.loadingContainer}>
          <Loader className={styles.spinnerIcon} />
          <p>{loadingData ? "Loading return data..." : "Saving..."}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* HEADER */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.titleSection}>
              <h1 className={styles.title}>
                {isEditMode ? (
                  <>
                    <CheckCircle className={styles.titleIcon} />
                    Edit Purchase Return
                  </>
                ) : (
                  <>
                    <FileText className={styles.titleIcon} />
                    Create Purchase Return
                  </>
                )}
              </h1>
              <p className={styles.subtitle}>
                {isEditMode ? `Return #${form.returnNo}` : "Return items from a purchase bill"}
              </p>
            </div>
          </div>
          <div className={styles.headerActions}>
            <button
              type="button"
              onClick={() => navigate("/purchase_returns")}
              className={styles.buttonSecondary}
              disabled={loading}
            >
              <ArrowLeft size={18} />
              Back
            </button>
            <button
              type="submit"
              className={styles.buttonPrimary}
              disabled={loading || loadingData}
            >
              {loading ? (
                <>
                  <Loader size={18} className={styles.spinnerSmall} />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle size={18} />
                  {isEditMode ? "Update Return" : "Create Return"}
                </>
              )}
            </button>
          </div>
        </div>

        {/* PARTY & RETURN INFO */}
        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>
            <Users size={20} />
            Party Information
          </h2>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Party <span className={styles.required}>*</span>
              </label>
              <select
                value={form.partyId}
                onChange={(e) => setForm({ ...form, partyId: e.target.value })}
                required
                className={styles.input}
                disabled={loadingData}
              >
                <option value="">Select Party</option>
                {parties.map((p) => (
                  <option key={p.partyId} value={p.partyId}>
                    {p.name} - {p.phoneNo || "No Phone"}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                Return Number <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                value={form.returnNo}
                onChange={handleReturnNoChange}
                required
                className={styles.input}
                placeholder="Type PR to auto-generate"
                disabled={loadingData || isEditMode}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                Phone No <span className={styles.required}>*</span>
              </label>
              <div className={styles.inputIcon}>
                <Phone size={18} />
                <input
                  type="text"
                  value={form.phoneNo}
                  readOnly
                  className={`${styles.input} ${styles.inputReadonly}`}
                  placeholder="Auto-filled"
                />
              </div>
            </div>
          </div>
        </div>

        {/* DATES & BILL */}
        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>
            <Calendar size={20} />
            Important Dates & Bill
          </h2>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Return Date <span className={styles.required}>*</span>
              </label>
              <input
                type="date"
                value={form.returnDate}
                onChange={(e) => setForm({ ...form, returnDate: e.target.value })}
                required
                className={styles.input}
                disabled={loadingData}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                Original Bill No <span className={styles.required}>*</span>
              </label>
              <div className={styles.inputIcon}>
                <Receipt size={18} />
                <select
                  value={form.billNo}
                  onChange={(e) => {
                    setForm({ ...form, billNo: e.target.value });
                    handleBillSelect(e.target.value);
                  }}
                  required
                  className={styles.input}
                  disabled={loadingData}
                >
                  <option value="">-- Select Bill --</option>
                  {purchases.map((p) => (
                    <option key={p.purchaseId} value={p.billNo}>
                      {p.billNo} ({new Date(p.billDate).toLocaleDateString()})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* PAYMENT & LOCATION */}
        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>
            <CreditCard size={20} />
            Payment & Location
          </h2>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Payment Type</label>
              <select
                value={form.paymentType}
                onChange={(e) => setForm({ ...form, paymentType: e.target.value })}
                className={styles.input}
                disabled={loadingData}
              >
                {paymentTypes.map((t) => (
                  <option key={t} value={t}>
                    {t.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>State of Supply</label>
              <div className={styles.inputIcon}>
                <MapPin size={18} />
                <select
                  value={form.stateOfSupply}
                  onChange={(e) => setForm({ ...form, stateOfSupply: e.target.value })}
                  className={styles.input}
                  disabled={loadingData}
                >
                  {states.map((s) => (
                    <option key={s} value={s}>
                      {s.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* DESCRIPTION */}
        <div className={styles.formSection}>
          <label className={styles.label}>Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className={`${styles.input} ${styles.textarea}`}
            rows={3}
            placeholder="Optional notes..."
            disabled={loadingData}
          />
        </div>

        {/* ITEMS TABLE */}
        <div className={styles.formSection}>
          <div className={styles.itemsHeader}>
            <h2 className={styles.sectionTitle}>
              <Package size={20} />
              Returned Items
            </h2>
            <button
              type="button"
              onClick={addItem}
              className={styles.buttonAdd}
              disabled={loadingData}
            >
              <Plus size={18} />
              Add Item
            </button>
          </div>

          <div className={styles.tableContainer}>
            <table className={styles.itemsTable}>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Item Name</th>
                  <th>HSN</th>
                  <th>Qty</th>
                  <th>Unit</th>
                  <th>Rate</th>
                  <th>Discount</th>
                  <th>Tax Type</th>
                  <th>Tax Rate</th>
                  <th>Tax ₹</th>
                  <th>Total ₹</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {form.items.map((item, idx) => {
                  const maxQty = maxQtyMap[item.itemId || item.name] || 0;
                  return (
                    <tr key={idx}>
                      <td className={styles.rowNumber}>{idx + 1}</td>
                      <td>
                        <select
                          value={item.itemId || ""}
                          onChange={(e) => handleItemSelect(idx, e.target.value)}
                          required
                          className={styles.tableSelect}
                          disabled={loadingData}
                        >
                          <option value="">-- Select --</option>
                          {items.map((i) => (
                            <option key={i.itemId} value={i.itemId}>
                              {i.itemName}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <input
                          type="text"
                          value={item.hsn}
                          readOnly
                          className={styles.tableInputReadonly}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(idx, e.target.value)}
                          required
                          className={styles.tableInput}
                          placeholder={maxQty > 0 ? `Max ${maxQty}` : ""}
                          disabled={loadingData}
                        />
                        {maxQty > 0 && (
                          <div style={{ fontSize: "0.75rem", color: "#666" }}>
                            Max: {maxQty}
                          </div>
                        )}
                      </td>
                      <td>
                        <select
                          value={item.unit}
                          onChange={(e) => handleItemChange(idx, "unit", e.target.value)}
                          className={styles.tableSelect}
                          disabled={loadingData}
                        >
                          {units.map((u) => (
                            <option key={u} value={u}>{u}</option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <input
                          type="number"
                          step="0.01"
                          value={item.ratePerUnit}
                          onChange={(e) => handleItemChange(idx, "ratePerUnit", e.target.value)}
                          required
                          className={styles.tableInput}
                          disabled={loadingData}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={item.discountAmount}
                          onChange={(e) => handleItemChange(idx, "discountAmount", e.target.value)}
                          className={styles.tableInput}
                          disabled={loadingData}
                        />
                      </td>
                      <td>
                        <select
                          value={item.taxType}
                          onChange={(e) => handleItemChange(idx, "taxType", e.target.value)}
                          className={styles.tableSelect}
                          disabled={loadingData}
                        >
                          {taxTypes.map((t) => (
                            <option key={t} value={t}>
                              {t === "WITHTAX" ? "Inc. Tax" : "Ex. Tax"}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <select
                          value={item.taxRate}
                          onChange={(e) => handleItemChange(idx, "taxRate", e.target.value)}
                          className={styles.tableSelect}
                          disabled={loadingData}
                        >
                          {taxRates.map((r) => (
                            <option key={r} value={r}>
                              {r.replace("GST", "").replace("IGST", "") || "0%"}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className={styles.amountCell}>
                        <IndianRupee size={14} />
                        {item.totalTaxAmount.toFixed(2)}
                      </td>
                      <td className={styles.amountCell}>
                        <IndianRupee size={14} />
                        <strong>{item.totalAmount.toFixed(2)}</strong>
                      </td>
                      <td>
                        {form.items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeItem(idx)}
                            className={styles.tableDeleteBtn}
                            disabled={loadingData}
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {form.items.length === 0 && (
              <div className={styles.emptyTable}>
                <p>No items added yet. Select a bill or click "Add Item".</p>
              </div>
            )}
          </div>
        </div>

        {/* SUMMARY */}
        <div className={styles.summarySection}>
          <h2 className={styles.sectionTitle}>Return Summary</h2>
          <div className={styles.summaryGrid}>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Total Quantity</span>
              <span className={styles.summaryValue}>{form.totalQuantity}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Total Discount</span>
              <span className={styles.summaryValue}>
                <IndianRupee size={14} />
                {form.totalDiscount.toFixed(2)}
              </span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Total Tax</span>
              <span className={styles.summaryValue}>
                <IndianRupee size={14} />
                {form.totalTaxAmount.toFixed(2)}
              </span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Total Amount</span>
              <span className={`${styles.summaryValue} ${styles.summaryValueBold}`}>
                <IndianRupee size={14} />
                {form.totalAmount.toFixed(2)}
              </span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Amount Received</span>
              <span className={styles.summaryValue}>
                <IndianRupee size={14} />
                {(parseFloat(form.receivedAmount) || 0).toFixed(2)}
              </span>
            </div>
            <div className={`${styles.summaryItem} ${styles.summaryItemBalance}`}>
              <span className={styles.summaryLabel}>Balance Amount</span>
              <span className={`${styles.summaryValue} ${styles.summaryValueBalance}`}>
                <IndianRupee size={14} />
                {form.balanceAmount.toFixed(2)}
              </span>
            </div>
          </div>

          <div className={styles.formGrid} style={{ marginTop: "1rem" }}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Amount Received</label>
              <div className={styles.inputIcon}>
                <IndianRupee size={18} />
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.receivedAmount}
                  onChange={(e) => {
                    setForm({ ...form, receivedAmount: e.target.value });
                    recalculateTotals();
                  }}
                  className={styles.input}
                  disabled={loadingData}
                />
              </div>
            </div>
          </div>
        </div>
        {/* FORM ACTION BUTTONS */}
        <div className={styles.formActions}>
            <button
              type="button"
              onClick={() => navigate("/purchase_returns")}
              className={styles.buttonSecondary}
              disabled={loading || loadingData}
            >
              <ArrowLeft size={18} />
              Cancel
            </button>

            <button
              type="submit"
              className={styles.buttonPrimary}
              disabled={loading || loadingData}
            >
              {loading ? (
                <>
                  <Loader size={18} className={styles.spinnerSmall} />
                  {isEditMode ? "Updating..." : "Creating..."}
                </>
              ) : isEditMode ? (
                <>
                  <CheckCircle size={18} />
                  Update Purchase Return
                </>
              ) : (
                <>
                  <CheckCircle size={18} />
                  Create Purchase Return
                </>
              )}
            </button>
          </div>
      </form>
    </div>
  );
};

export default CreatePurchaseReturn;