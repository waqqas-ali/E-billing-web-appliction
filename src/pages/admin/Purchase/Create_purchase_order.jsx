// import React, { useEffect, useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import axios from "axios";
// import config from "../../../config/apiconfig";
// import styles from "./Purchases.module.css"; // reuse Sales.module.css
// import { toast } from "react-toastify";

// const CreatePurchaseOrder = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const editId = queryParams.get("edit"); // ?edit=123

//   const userData = JSON.parse(localStorage.getItem("eBilling")) || {};
//   const token = userData?.accessToken || "";
//   const companyId = userData?.selectedCompany?.id || "";

//   const [loading, setLoading] = useState(false);
//   const [loadingData, setLoadingData] = useState(false);
//   const [parties, setParties] = useState([]);
//   const [items, setItems] = useState([]);
//   const [loadingItems, setLoadingItems] = useState(false);

//   // Enums
//   const paymentTypes = ["CASH", "UPI", "CREDIT_CARD", "DEBIT_CARD", "NET_BANKING", "WALLET", "CHEQUE", "OTHER"];
//   const states = [
//     "ANDHRA_PRADESH", "ARUNACHAL_PRADESH", "ASSAM", "BIHAR", "CHHATTISGARH", "GOA", "GUJARAT", "HARYANA",
//     "HIMACHAL_PRADESH", "JHARKHAND", "KARNATAKA", "KERALA", "MADHYA_PRADESH", "MAHARASHTRA", "MANIPUR",
//     "MEGHALAYA", "MIZORAM", "NAGALAND", "ODISHA", "PUNJAB", "RAJASTHAN", "SIKKIM", "TAMIL_NADU", "TELANGANA",
//     "TRIPURA", "UTTAR_PRADESH", "UTTARAKHAND", "WEST_BENGAL", "OTHER"
//   ];
//   const units = ["CARTONS", "KILOGRAMS", "QUINTAL", "BOTTLES", "PIECES", "ROLLS", "NUMBERS", "PAIRS", "TABLETS", "MILLILITRE", "BUNDLES", "BOX", "SQUARE_METERS", "BAGS", "CANS", "SQUARE_FEET"];
//   const taxTypes = ["WITHTAX", "WITHOUTTAX"];
//   const taxRates = ["NONE", "EXEMPTED", "GST0", "IGST0", "GST0POINT25", "IGST0POINT25", "GST3", "IGST3", "GST5", "IGST5", "GST12", "IGST12", "GST18", "IGST18", "GST28", "IGST28"];

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
//     orderNo: "",
//     purchaseDate: new Date().toISOString().split("T")[0],
//     dueDate: "",
//     stateOfSupply: "MAHARASHTRA",
//     paymentType: "CASH",
//     description: "",
//     advanceAmount: "0",
//     items: [
//       {
//         itemId: "",
//         itemName: "",
//         quantity: "",
//         unit: "PIECES",
//         perUnitRate: "",
//         taxType: "WITHTAX",
//         discountAmount: "0",
//         taxRate: "GST18",
//         totalTaxAmount: 0,
//         totalAmount: 0,
//       },
//     ],
//     totalQuantity: 0,
//     totalDiscount: 0,
//     totalTaxAmount: 0,
//     totalAmount: 0,
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

//   // Load Purchase Order for Edit
//   const fetchPurchaseOrder = async (orderId) => {
//     if (!token || !companyId) return;
//     setLoadingData(true);
//     try {
//       const res = await axios.get(`${config.BASE_URL}/purchase-order/${orderId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const o = res.data;
//       setForm({
//         partyId: o.partyResponseDto?.partyId?.toString() || "",
//         orderNo: o.orderNo || "",
//         purchaseDate: o.purchaseDate || "",
//         dueDate: o.dueDate || "",
//         stateOfSupply: o.stateOfSupply || "MAHARASHTRA",
//         paymentType: o.paymentType || "CASH",
//         description: o.description || "",
//         advanceAmount: (o.advanceAmount || 0).toString(),
//         items: o.purchaseOrderItemResponseList?.map((it) => ({
//           itemId: it.itemId?.toString() || "",
//           itemName: it.itemName || "",
//           quantity: it.quantity?.toString() || "",
//           unit: it.unit || "PIECES",
//           perUnitRate: it.perUnitRate?.toString() || "",
//           taxType: it.taxType || "WITHTAX",
//           discountAmount: (it.discountAmount || 0).toString(),
//           taxRate: it.taxRate || "GST18",
//           totalTaxAmount: it.totalTaxAmount || 0,
//           totalAmount: it.totalAmount || 0,
//         })) || [],
//         totalQuantity: o.totalQuantity || 0,
//         totalDiscount: o.totalDiscount || 0,
//         totalTaxAmount: o.totalTaxAmount || 0,
//         totalAmount: o.totalAmount || 0,
//         balanceAmount: o.balanceAmount || 0,
//       });
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to load purchase order");
//       navigate("/purchase_order");
//     } finally {
//       setLoadingData(false);
//     }
//   };

//   useEffect(() => {
//     fetchParties();
//     fetchItems();

//     if (editId) {
//       fetchPurchaseOrder(editId);
//     }
//   }, [token, companyId, editId]);

//   // Calculate single item
//   const calculateItem = (item) => {
//     const qty = parseFloat(item.quantity) || 0;
//     const rate = parseFloat(item.perUnitRate) || 0;
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
//     const advance = parseFloat(form.advanceAmount) || 0;
//     const balance = totalAmt - advance;

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

//   // Handle item change
//   const handleItemChange = (index, field, value) => {
//     const newItems = [...form.items];
//     newItems[index][field] = value;
//     recalculateTotals(newItems);
//   };

//   // Handle item select (auto-fill)
//   const handleItemSelect = (index, itemId) => {
//     const selected = items.find((i) => i.itemId === Number(itemId));
//     if (!selected) return;

//     const newItems = [...form.items];
//     newItems[index] = {
//       ...newItems[index],
//       itemId: selected.itemId,
//       itemName: selected.itemName,
//       unit: selected.baseUnit,
//       perUnitRate: selected.purchasePrice?.toString() || selected.salePrice?.toString() || "",
//       taxType: selected.purchaseTaxType || selected.saleTaxType || "WITHTAX",
//       taxRate: selected.taxRate || "GST18",
//       quantity: newItems[index].quantity || "1",
//       discountAmount: "0",
//     };

//     recalculateTotals(newItems);
//   };

//   // Add / Remove
//   const addItem = () => {
//     setForm((prev) => ({
//       ...prev,
//       items: [
//         ...prev.items,
//         {
//           itemId: "",
//           itemName: "",
//           quantity: "",
//           unit: "PIECES",
//           perUnitRate: "",
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

//   // Submit (Create or Update)
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!token || !companyId) {
//       toast.error("Login and select company");
//       return;
//     }

//     if (!form.partyId || !form.orderNo || !form.purchaseDate || !form.dueDate) {
//       toast.error("Fill all required fields");
//       return;
//     }

//     const invalidItem = form.items.some(
//       (i) => !i.itemName || !i.quantity || !i.perUnitRate || parseFloat(i.quantity) <= 0 || parseFloat(i.perUnitRate) <= 0
//     );
//     if (invalidItem) {
//       toast.error("Each item must have Name, Qty > 0, Rate > 0");
//       return;
//     }

//     const payload = {
//       partyId: parseInt(form.partyId),
//       orderNo: form.orderNo.trim(),
//       purchaseDate: form.purchaseDate,
//       dueDate: form.dueDate,
//       totalDiscount: form.totalDiscount,
//       totalTaxAmount: form.totalTaxAmount,
//       totalQuantity: form.totalQuantity,
//       totalAmount: form.totalAmount,
//       advanceAmount: parseFloat(form.advanceAmount) || 0,
//       balanceAmount: form.balanceAmount,
//       description: form.description.trim() || null,
//       paymentType: form.paymentType,
//       stateOfSupply: form.stateOfSupply,
//       purchaseOrderItemRequests: form.items.map((i) => ({
//         itemId: i.itemId ? parseInt(i.itemId) : null,
//         itemName: i.itemName.trim(),
//         quantity: parseFloat(i.quantity),
//         unit: i.unit,
//         perUnitRate: parseFloat(i.perUnitRate),
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
//         // UPDATE
//         await axios.put(`${config.BASE_URL}/purchase-order/${editId}`, payload, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         });
//         toast.success("Purchase Order updated!");
//       } else {
//         // CREATE
//         await axios.post(`${config.BASE_URL}/company/${companyId}/created/purchase-order`, payload, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         });
//         toast.success("Purchase Order created!");
//       }

//       navigate("/purchase_order");
//     } catch (err) {
//       toast.error(err.response?.data?.message || `Failed to ${editId ? "update" : "create"} order`);
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
//           <p>Loading purchase order...</p>
//         </div>
//       ) : (
//         <form onSubmit={handleSubmit}>
//           {/* Header */}
//           <div className={styles["form-header"]}>
//             <div>
//               <h1 className={styles["company-form-title"]}>
//                 {isEditMode ? "Edit Purchase Order" : "Create Purchase Order"}
//               </h1>
//               <p className={styles["form-subtitle"]}>
//                 {isEditMode ? `Order #${form.orderNo}` : "Enter order details and items"}
//               </p>
//             </div>
//             <div style={{ display: "flex", gap: "8px" }}>
//               <button
//                 type="button"
//                 onClick={() => navigate("/purchase_order")}
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
//                 {loading ? "Saving..." : isEditMode ? "Update Order" : "Create Order"}
//               </button>
//             </div>
//           </div>

//           {/* Party & Order No */}
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
//               <label>Order No <span className={styles.required}>*</span></label>
//               <input
//                 type="text"
//                 value={form.orderNo}
//                 onChange={(e) => setForm({ ...form, orderNo: e.target.value })}
//                 required
//                 className={styles["form-input"]}
//                 placeholder="e.g. PO-001"
//                 disabled={!token || !companyId || loadingData}
//               />
//             </div>
//           </div>

//           {/* Dates */}
//           <div className={styles["form-row"]}>
//             <div className={styles["form-group"]}>
//               <label>Purchase Date <span className={styles.required}>*</span></label>
//               <input
//                 type="date"
//                 value={form.purchaseDate}
//                 onChange={(e) => setForm({ ...form, purchaseDate: e.target.value })}
//                 required
//                 className={styles["form-input"]}
//                 disabled={!token || !companyId || loadingData}
//               />
//             </div>
//             <div className={styles["form-group"]}>
//               <label>Due Date <span className={styles.required}>*</span></label>
//               <input
//                 type="date"
//                 value={form.dueDate}
//                 onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
//                 required
//                 min={form.purchaseDate}
//                 className={styles["form-input"]}
//                 disabled={!token || !companyId || loadingData}
//               />
//             </div>
//           </div>

//           {/* State & Payment */}
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

//           {/* Advance */}
//           <div className={styles["form-row"]}>
//             <div className={styles["form-group"]}>
//               <label>Advance Amount</label>
//               <input
//                 type="number"
//                 step="0.01"
//                 min="0"
//                 value={form.advanceAmount}
//                 onChange={(e) => {
//                   setForm({ ...form, advanceAmount: e.target.value });
//                   recalculateTotals(form.items);
//                 }}
//                 className={styles["form-input"]}
//                 placeholder="0.00"
//                 disabled={!token || !companyId || loadingData}
//               />
//             </div>
//             <div className={styles["form-group"]}>
//               <label>Description</label>
//               <textarea
//                 value={form.description}
//                 onChange={(e) => setForm({ ...form, description: e.target.value })}
//                 className={`${styles["form-input"]} ${styles.textarea}`}
//                 placeholder="Optional notes..."
//                 rows={2}
//                 disabled={!token || !companyId || loadingData}
//               />
//             </div>
//           </div>

//           {/* Items Section */}
//           <div className={styles["card-section"]}>
//             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
//               <h4 style={{ margin: 0 }}>Items</h4>
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

//             {form.items.map((item, index) => (
//               <div key={index} style={{ border: "1px solid #ddd", borderRadius: "6px", padding: "16px", marginBottom: "16px", background: "#fafafa" }}>
//                 {/* Item Select */}
//                 <div className={styles["form-row"]}>
//                   <div className={styles["form-group"]}>
//                     <label>Item Name <span className={styles.required}>*</span></label>
//                     <select
//                       value={item.itemId}
//                       onChange={(e) => handleItemSelect(index, e.target.value)}
//                       required
//                       className={styles["form-input"]}
//                       disabled={!token || !companyId || loadingItems || loadingData}
//                     >
//                       <option value="">-- Select Item --</option>
//                       {items.map((i) => (
//                         <option key={i.itemId} value={i.itemId}>
//                           {i.itemName} ({i.itemCode})
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>

//                 {/* Quantity & Unit */}
//                 <div className={styles["form-row"]}>
//                   <div className={styles["form-group"]}>
//                     <label>Quantity <span className={styles.required}>*</span></label>
//                     <input
//                       type="number"
//                       step="0.01"
//                       min="0.01"
//                       value={item.quantity}
//                       onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
//                       required
//                       className={styles["form-input"]}
//                       disabled={!token || !companyId || loadingData}
//                     />
//                   </div>
//                   <div className={styles["form-group"]}>
//                     <label>Unit</label>
//                     <input type="text" value={item.unit} readOnly className={styles["form-input"]} />
//                   </div>
//                 </div>

//                 {/* Rate & Tax */}
//                 <div className={styles["form-row"]}>
//                   <div className={styles["form-group"]}>
//                     <label>Rate/Unit <span className={styles.required}>*</span></label>
//                     <input
//                       type="number"
//                       step="0.01"
//                       min="0.01"
//                       value={item.perUnitRate}
//                       onChange={(e) => handleItemChange(index, "perUnitRate", e.target.value)}
//                       required
//                       className={styles["form-input"]}
//                       disabled={!token || !companyId || loadingData}
//                     />
//                   </div>
//                   <div className={styles["form-group"]}>
//                     <label>Tax Type</label>
//                     <input type="text" value={item.taxType} readOnly className={styles["form-input"]} />
//                   </div>
//                   <div className={styles["form-group"]}>
//                     <label>Tax Rate</label>
//                     <input type="text" value={item.taxRate} readOnly className={styles["form-input"]} />
//                   </div>
//                 </div>

//                 {/* Discount & Totals */}
//                 <div className={styles["form-row"]}>
//                   <div className={styles["form-group"]}>
//                     <label>Discount</label>
//                     <input
//                       type="number"
//                       step="0.01"
//                       min="0"
//                       value={item.discountAmount}
//                       onChange={(e) => handleItemChange(index, "discountAmount", e.target.value)}
//                       className={styles["form-input"]}
//                       placeholder="0.00"
//                       disabled={!token || !companyId || loadingData}
//                     />
//                   </div>
//                   <div className={styles["form-group"]}>
//                     <label>Tax Amount</label>
//                     <div style={{ padding: "10px 12px", background: "#f5f5f5", borderRadius: "6px", fontWeight: "600", color: "#e67e22" }}>
//                       ₹{item.totalTaxAmount.toFixed(2)}
//                     </div>
//                   </div>
//                   <div className={styles["form-group"]}>
//                     <label>Total</label>
//                     <div style={{ padding: "10px 12px", background: "#e8f5e9", borderRadius: "6px", fontWeight: "600", color: "#27ae60" }}>
//                       ₹{item.totalAmount.toFixed(2)}
//                     </div>
//                   </div>
//                 </div>

//                 {form.items.length > 1 && (
//                   <button
//                     type="button"
//                     onClick={() => removeItem(index)}
//                     className={styles["delete-button"]}
//                     style={{ marginTop: "8px", fontSize: "0.8rem" }}
//                     disabled={!token || !companyId || loadingData}
//                   >
//                     Remove Item
//                   </button>
//                 )}
//               </div>
//             ))}
//           </div>

//           {/* Final Totals */}
//           <div className={styles["card-section"]} style={{ background: "#f0f7ff", padding: "16px", borderRadius: "8px" }}>
//             <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px", fontSize: "1rem" }}>
//               <div><strong>Total Qty:</strong> {form.totalQuantity}</div>
//               <div><strong>Discount:</strong> ₹{form.totalDiscount.toFixed(2)}</div>
//               <div><strong>Tax:</strong> ₹{form.totalTaxAmount.toFixed(2)}</div>
//               <div><strong>Total:</strong> ₹{form.totalAmount.toFixed(2)}</div>
//               <div><strong>Advance:</strong> ₹{(parseFloat(form.advanceAmount) || 0).toFixed(2)}</div>
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

// export default CreatePurchaseOrder;






"use client"

import React, { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import axios from "axios"
import config from "../../../config/apiconfig"
import styles from "../Styles/Form.module.css" // Unified with CreatePurchase
import { toast } from "react-toastify"
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
} from "lucide-react"

const CreatePurchaseOrder = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const editId = queryParams.get("edit")

  const userData = JSON.parse(localStorage.getItem("eBilling")) || {}
  const token = userData?.accessToken || ""
  const companyId = userData?.selectedCompany?.id || ""

  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(false)
  const [loadingItems, setLoadingItems] = useState(false)
  const [parties, setParties] = useState([])
  const [items, setItems] = useState([])

  const paymentTypes = ["CASH", "UPI", "CREDIT_CARD", "DEBIT_CARD", "NET_BANKING", "WALLET", "CHEQUE", "OTHER"]
  const states = [
    "ANDHRA_PRADESH", "ARUNACHAL_PRADESH", "ASSAM", "BIHAR", "CHHATTISGARH", "GOA", "GUJARAT", "HARYANA",
    "HIMACHAL_PRADESH", "JHARKHAND", "KARNATAKA", "KERALA", "MADHYA_PRADESH", "MAHARASHTRA", "MANIPUR",
    "MEGHALAYA", "MIZORAM", "NAGALAND", "ODISHA", "PUNJAB", "RAJASTHAN", "SIKKIM", "TAMIL_NADU", "TELANGANA",
    "TRIPURA", "UTTAR_PRADESH", "UTTARAKHAND", "WEST_BENGAL", "OTHER",
  ]

  const TAX_RATE_MAP = {
    NONE: 0, EXEMPTED: 0,
    GST0: 0, IGST0: 0,
    GST0POINT25: 0.0025, IGST0POINT25: 0.0025,
    GST3: 0.03, IGST3: 0.03,
    GST5: 0.05, IGST5: 0.05,
    GST12: 0.12, IGST12: 0.12,
    GST18: 0.18, IGST18: 0.18,
    GST28: 0.28, IGST28: 0.28,
  }

  const [form, setForm] = useState({
    partyId: "",
    orderNo: "",
    purchaseDate: new Date().toISOString().split("T")[0],
    dueDate: "",
    stateOfSupply: "MAHARASHTRA",
    paymentType: "CASH",
    description: "",
    advanceAmount: "0",
    items: [
      {
        itemId: "",
        itemName: "",
        quantity: "",
        unit: "PIECES",
        perUnitRate: "",
        taxType: "WITHTAX",
        discountAmount: "0",
        taxRate: "GST18",
        totalTaxAmount: 0,
        totalAmount: 0,
      },
    ],
    totalQuantity: 0,
    totalDiscount: 0,
    totalTaxAmount: 0,
    totalAmount: 0,
    balanceAmount: 0,
  })

  /* ==================== FETCH DATA ==================== */
  const fetchParties = async () => {
    if (!token || !companyId) return
    try {
      const res = await axios.get(`${config.BASE_URL}/company/${companyId}/parties`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setParties(res.data || [])
    } catch (err) {
      toast.error("Failed to load parties")
    }
  }

  const fetchItems = async () => {
    if (!token || !companyId) return
    setLoadingItems(true)
    try {
      const res = await axios.get(`${config.BASE_URL}/company/${companyId}/items`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setItems(res.data || [])
    } catch (err) {
      toast.error("Failed to load items")
    } finally {
      setLoadingItems(false)
    }
  }

  const fetchPurchaseOrder = async (orderId) => {
    if (!token || !companyId) return
    setLoadingData(true)
    try {
      const res = await axios.get(`${config.BASE_URL}/purchase-order/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      const o = res.data
      setForm({
        partyId: o.partyResponseDto?.partyId?.toString() || "",
        orderNo: o.orderNo || "",
        purchaseDate: o.purchaseDate || "",
        dueDate: o.dueDate || "",
        stateOfSupply: o.stateOfSupply || "MAHARASHTRA",
        paymentType: o.paymentType || "CASH",
        description: o.description || "",
        advanceAmount: (o.advanceAmount || 0).toString(),
        items: o.purchaseOrderItemResponseList?.map((it) => ({
          itemId: it.itemId?.toString() || "",
          itemName: it.itemName || "",
          quantity: it.quantity?.toString() || "",
          unit: it.unit || "PIECES",
          perUnitRate: it.perUnitRate?.toString() || "",
          taxType: it.taxType || "WITHTAX",
          discountAmount: (it.discountAmount || 0).toString(),
          taxRate: it.taxRate || "GST18",
          totalTaxAmount: it.totalTaxAmount || 0,
          totalAmount: it.totalAmount || 0,
        })) || [],
        totalQuantity: o.totalQuantity || 0,
        totalDiscount: o.totalDiscount || 0,
        totalTaxAmount: o.totalTaxAmount || 0,
        totalAmount: o.totalAmount || 0,
        balanceAmount: o.balanceAmount || 0,
      })
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load purchase order")
      navigate("/purchase_order")
    } finally {
      setLoadingData(false)
    }
  }

  useEffect(() => {
    fetchParties()
    fetchItems()
    if (editId) fetchPurchaseOrder(editId)
  }, [token, companyId, editId])

  /* ==================== CALCULATIONS ==================== */
  const calculateItem = (item) => {
    const qty = parseFloat(item.quantity) || 0
    const rate = parseFloat(item.perUnitRate) || 0
    const discount = parseFloat(item.discountAmount) || 0
    const taxRate = TAX_RATE_MAP[item.taxRate] || 0
    const withTax = item.taxType === "WITHTAX"

    let subtotal = qty * rate - discount
    let taxAmount = 0

    if (withTax && taxRate > 0) {
      const taxable = subtotal / (1 + taxRate)
      taxAmount = subtotal - taxable
      subtotal = taxable
    } else {
      taxAmount = subtotal * taxRate
    }

    const total = subtotal + taxAmount

    return {
      ...item,
      totalTaxAmount: parseFloat(taxAmount.toFixed(2)),
      totalAmount: parseFloat(total.toFixed(2)),
    }
  }

  const recalculateTotals = (newItems) => {
    const calculated = newItems.map(calculateItem)
    const totalQty = calculated.reduce((s, i) => s + (parseFloat(i.quantity) || 0), 0)
    const totalDiscount = calculated.reduce((s, i) => s + (parseFloat(i.discountAmount) || 0), 0)
    const totalTax = calculated.reduce((s, i) => s + i.totalTaxAmount, 0)
    const totalAmt = calculated.reduce((s, i) => s + i.totalAmount, 0)
    const advance = parseFloat(form.advanceAmount) || 0
    const balance = totalAmt - advance

    setForm((prev) => ({
      ...prev,
      items: calculated,
      totalQuantity: totalQty,
      totalDiscount: parseFloat(totalDiscount.toFixed(2)),
      totalTaxAmount: parseFloat(totalTax.toFixed(2)),
      totalAmount: parseFloat(totalAmt.toFixed(2)),
      balanceAmount: parseFloat(balance.toFixed(2)),
    }))
  }

  const handleItemChange = (index, field, value) => {
    const newItems = [...form.items]
    newItems[index][field] = value
    recalculateTotals(newItems)
  }

  const handleItemSelect = (index, itemId) => {
    const selected = items.find((i) => i.itemId === Number(itemId))
    if (!selected) return

    const newItems = [...form.items]
    newItems[index] = {
      ...newItems[index],
      itemId: selected.itemId,
      itemName: selected.itemName,
      unit: selected.baseUnit,
      perUnitRate: selected.purchasePrice?.toString() || selected.salePrice?.toString() || "",
      taxType: selected.purchaseTaxType || selected.saleTaxType || "WITHTAX",
      taxRate: selected.taxRate || "GST18",
      quantity: newItems[index].quantity || "1",
      discountAmount: "0",
    }

    recalculateTotals(newItems)
  }

  const addItem = () => {
    setForm((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          itemId: "",
          itemName: "",
          quantity: "",
          unit: "PIECES",
          perUnitRate: "",
          taxType: "WITHTAX",
          discountAmount: "0",
          taxRate: "GST18",
          totalTaxAmount: 0,
          totalAmount: 0,
        },
      ],
    }))
  }

  const removeItem = (index) => {
    const newItems = form.items.filter((_, i) => i !== index)
    recalculateTotals(newItems)
  }

  /* ==================== SUBMIT ==================== */
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!token || !companyId) {
      toast.error("Login and select company")
      return
    }

    if (!form.partyId || !form.orderNo || !form.purchaseDate || !form.dueDate) {
      toast.error("Fill all required fields")
      return
    }

    const invalidItem = form.items.some(
      (i) => !i.itemName || !i.quantity || !i.perUnitRate || parseFloat(i.quantity) <= 0 || parseFloat(i.perUnitRate) <= 0
    )
    if (invalidItem) {
      toast.error("Each item must have Name, Qty > 0, Rate > 0")
      return
    }

    const payload = {
      partyId: parseInt(form.partyId),
      orderNo: form.orderNo.trim(),
      purchaseDate: form.purchaseDate,
      dueDate: form.dueDate,
      totalDiscount: form.totalDiscount,
      totalTaxAmount: form.totalTaxAmount,
      totalQuantity: form.totalQuantity,
      totalAmount: form.totalAmount,
      advanceAmount: parseFloat(form.advanceAmount) || 0,
      balanceAmount: form.balanceAmount,
      description: form.description.trim() || null,
      paymentType: form.paymentType,
      stateOfSupply: form.stateOfSupply,
      purchaseOrderItemRequests: form.items.map((i) => ({
        itemId: i.itemId ? parseInt(i.itemId) : null,
        itemName: i.itemName.trim(),
        quantity: parseFloat(i.quantity),
        unit: i.unit,
        perUnitRate: parseFloat(i.perUnitRate),
        taxType: i.taxType,
        discountAmount: parseFloat(i.discountAmount) || 0,
        taxRate: i.taxRate,
        totalTaxAmount: i.totalTaxAmount,
        totalAmount: i.totalAmount,
      })),
    }

    try {
      setLoading(true)

      if (editId) {
        await axios.put(`${config.BASE_URL}/purchase-order/${editId}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        toast.success("Purchase Order updated!")
      } else {
        await axios.post(`${config.BASE_URL}/company/${companyId}/created/purchase-order`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        toast.success("Purchase Order created!")
      }

      navigate("/purchase_order")
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to ${editId ? "update" : "create"} order`)
    } finally {
      setLoading(false)
    }
  }

  const isEditMode = !!editId

  /* ==================== RENDER ==================== */
  return (
    <div className={styles.container}>
      {loadingData ? (
        <div className={styles.loadingContainer}>
          <Loader className={styles.spinnerIcon} />
          <p>Loading purchase order...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.headerContent}>
              <div className={styles.titleSection}>
                <h1 className={styles.title}>
                  {isEditMode ? (
                    <>
                      <CheckCircle className={styles.titleIcon} />
                      Edit Purchase Order
                    </>
                  ) : (
                    <>
                      <FileText className={styles.titleIcon} />
                      Create Purchase Order
                    </>
                  )}
                </h1>
                <p className={styles.subtitle}>
                  {isEditMode ? `Order #${form.orderNo}` : "Enter order details and items"}
                </p>
              </div>
            </div>
            <div className={styles.headerActions}>
              <button
                type="button"
                onClick={() => navigate("/purchase_order")}
                className={styles.buttonSecondary}
                disabled={loading}
              >
                <ArrowLeft size={18} />
                Back
              </button>
              <button
                type="submit"
                className={styles.buttonPrimary}
                disabled={loading || loadingData || !token || !companyId}
              >
                {loading ? (
                  <>
                    <Loader size={18} className={styles.spinnerSmall} />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle size={18} />
                    {isEditMode ? "Update Order" : "Create Order"}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Party & Order Info */}
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>
              <Users size={20} />
              Party Information
            </h2>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="party" className={styles.label}>
                  Party <span className={styles.required}>*</span>
                </label>
                <select
                  id="party"
                  value={form.p46artyId}
                  onChange={(e) => setForm({ ...form, partyId: e.target.value })}
                  required
                  className={styles.input}
                  disabled={!token || !companyId || loadingData}
                >
                  <option value="">
                    {token && companyId ? "Select Party" : "Login & Select Company"}
                  </option>
                  {parties.map((p) => (
                    <option key={p.partyId} value={p.partyId}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="orderNo" className={styles.label}>
                  Order No <span className={styles.required}>*</span>
                </label>
                <input
                  id="orderNo"
                  type="text"
                  value={form.orderNo}
                  onChange={(e) => setForm({ ...form, orderNo: e.target.value })}
                  required
                  className={styles.input}
                  placeholder="e.g. PO-001"
                  disabled={!token || !companyId || loadingData}
                />
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>
              <Calendar size={20} />
              Important Dates
            </h2>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="purchaseDate" className={styles.label}>
                  Purchase Date <span className={styles.required}>*</span>
                </label>
                <input
                  id="purchaseDate"
                  type="date"
                  value={form.purchaseDate}
                  onChange={(e) => setForm({ ...form, purchaseDate: e.target.value })}
                  required
                  className={styles.input}
                  disabled={!token || !companyId || loadingData}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="dueDate" className={styles.label}>
                  Due Date <span className={styles.required}>*</span>
                </label>
                <input
                  id="dueDate"
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                  required
                  min={form.purchaseDate}
                  className={styles.input}
                  disabled={!token || !companyId || loadingData}
                />
              </div>
            </div>
          </div>

          {/* Payment & Location */}
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>
              <CreditCard size={20} />
              Payment & Location
            </h2>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="paymentType" className={styles.label}>
                  Payment Type
                </label>
                <select
                  id="paymentType"
                  value={form.paymentType}
                  onChange={(e) => setForm({ ...form, paymentType: e.target.value })}
                  className={styles.input}
                  disabled={!token || !companyId || loadingData}
                >
                  {paymentTypes.map((t) => (
                    <option key={t} value={t}>
                      {t.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="state" className={styles.label}>
                  State of Supply
                </label>
                <div className={styles.inputIcon}>
                  <MapPin size={18} />
                  <select
                    id="state"
                    value={form.stateOfSupply}
                    onChange={(e) => setForm({ ...form, stateOfSupply: e.target.value })}
                    className={styles.input}
                    disabled={!token || !companyId || loadingData}
                  >
                    {states.map((s) => (
                      <option key={s} value={s}>
                        {s.replace(/_/g, " ")}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="advanceAmount" className={styles.label}>
                  Advance Amount
                </label>
                <div className={styles.inputIcon}>
                  <IndianRupee size={18} />
                  <input
                    id="advanceAmount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.advanceAmount}
                    onChange={(e) => {
                      setForm({ ...form, advanceAmount: e.target.value })
                      recalculateTotals(form.items)
                    }}
                    className={styles.input}
                    placeholder="0.00"
                    disabled={!token || !companyId || loadingData}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className={styles.formSection}>
            <label htmlFor="description" className={styles.label}>
              Description
            </label>
            <textarea
              id="description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className={`${styles.input} ${styles.textarea}`}
              placeholder="Optional notes..."
              rows={3}
              disabled={!token || !companyId || loadingData}
            />
          </div>

          {/* Items Section */}
          <div className={styles.formSection}>
            <div className={styles.itemsHeader}>
              <h2 className={styles.sectionTitle}>
                <Package size={20} />
                Items
              </h2>
              <button
                type="button"
                onClick={addItem}
                className={styles.buttonAdd}
                disabled={!token || !companyId || loadingItems || loadingData}
              >
                <Plus size={18} />
                Add Item
              </button>
            </div>

            {loadingItems && (
              <div className={styles.loadingMessage}>
                <Loader size={20} className={styles.spinnerSmall} />
                Loading items...
              </div>
            )}

            <div className={styles.itemsList}>
              {form.items.map((item, index) => (
                <div key={index} className={styles.itemCard}>
                  <div className={styles.itemHeader}>
                    <span className={styles.itemNumber}>Item {index + 1}</span>
                    {form.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className={styles.buttonDelete}
                        disabled={!token || !companyId || loadingData}
                        aria-label="Remove item"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>

                  {/* Item Select */}
                  <div className={styles.itemGrid}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Item Name <span className={styles.required}>*</span>
                      </label>
                      <select
                        value={item.itemId}
                        onChange={(e) => handleItemSelect(index, e.target.value)}
                        required
                        className={styles.input}
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
                  </div>

                  {/* Quantity & Unit */}
                  <div className={styles.itemGrid}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Quantity <span className={styles.required}>*</span>
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                        required
                        className={styles.input}
                        disabled={!token || !companyId || loadingData}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>Unit</label>
                      <input
                        type="text"
                        value={item.unit}
                        readOnly
                        className={`${styles.input} ${styles.inputReadonly}`}
                      />
                    </div>
                  </div>

                  {/* Rate & Tax */}
                  <div className={styles.itemGrid}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Rate/Unit <span className={styles.required}>*</span>
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={item.perUnitRate}
                        onChange={(e) => handleItemChange(index, "perUnitRate", e.target.value)}
                        required
                        className={styles.input}
                        disabled={!token || !companyId || loadingData}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>Tax Type</label>
                      <input
                        type="text"
                        value={item.taxType}
                        readOnly
                        className={`${styles.input} ${styles.inputReadonly}`}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>Tax Rate</label>
                      <input
                        type="text"
                        value={item.taxRate}
                        readOnly
                        className={`${styles.input} ${styles.inputReadonly}`}
                      />
                    </div>
                  </div>

                  {/* Discount & Totals */}
                  <div className={styles.itemGrid}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Discount</label>
                      <div className={styles.inputIcon}>
                        <IndianRupee size={18} />
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={item.discountAmount}
                          onChange={(e) => handleItemChange(index, "discountAmount", e.target.value)}
                          className={styles.input}
                          placeholder="0.00"
                          disabled={!token || !companyId || loadingData}
                        />
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>Tax Amount</label>
                      <div className={styles.valueDisplay}>
                        <IndianRupee size={16} />
                        <span>{item.totalTaxAmount.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>Total</label>
                      <div className={`${styles.valueDisplay} ${styles.valueDisplayTotal}`}>
                        <IndianRupee size={16} />
                        <span>{item.totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className={styles.summarySection}>
            <h2 className={styles.sectionTitle}>Order Summary</h2>
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
                <span className={styles.summaryLabel}>Advance Paid</span>
                <span className={styles.summaryValue}>
                  <IndianRupee size={14} />
                  {(parseFloat(form.advanceAmount) || 0).toFixed(2)}
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
          </div>
        </form>
      )}
    </div>
  )
}

export default CreatePurchaseOrder