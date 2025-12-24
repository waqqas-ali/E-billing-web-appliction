// import React, { useEffect, useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import axios from "axios";
// import config from "../../../config/apiconfig";
// import styles from "./Delivery.module.css";
// import { toast } from "react-toastify";

// const CreateDeliveryChallan = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const editId = queryParams.get("edit");

//   const userData = JSON.parse(localStorage.getItem("eBilling")) || {};
//   const token = userData?.accessToken || "";
//   const companyId = userData?.selectedCompany?.id || "";

//   const [loading, setLoading] = useState(false);
//   const [loadingData, setLoadingData] = useState(false);
//   const [parties, setParties] = useState([]);
//   const [items, setItems] = useState([]);
//   const [loadingItems, setLoadingItems] = useState(false);

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
//     challanNo: "",
//     challanDate: new Date().toISOString().split("T")[0],
//     dueDate: "",
//     stateOfSupply: "MAHARASHTRA",
//     description: "",
//     items: [
//       {
//         itemId: "",
//         itemName: "",
//         quantity: "",
//         unit: "PIECES",
//         ratePerUnit: "",
//         taxType: "WITHTAX",
//         discountAmount: "0",
//         taxRate: "GST18",
//         totalTaxAmount: 0,
//         totalAmount: 0,
//       },
//     ],
//     totalQuantity: 0,
//     totalDiscountAmount: 0,
//     totalTaxAmount: 0,
//     totalAmount: 0,
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

//   // Load for Edit
//   const fetchDeliveryChallan = async (challanId) => {
//     if (!token) return;
//     setLoadingData(true);
//     try {
//       const res = await axios.get(`${config.BASE_URL}/delivery-challan/${challanId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const c = res.data;
//       setForm({
//         partyId: c.partyResponseDto?.partyId?.toString() || "",
//         challanNo: c.challanNo || "",
//         challanDate: c.challanDate || "",
//         dueDate: c.dueDate || "",
//         stateOfSupply: c.stateOfSupply || "MAHARASHTRA",
//         description: c.description || "",
//         items: c.deliveryChallanItemResponses?.map((it) => ({
//           itemId: "",
//           itemName: it.name || "",
//           quantity: it.quantity?.toString() || "",
//           unit: it.unit || "PIECES",
//           ratePerUnit: it.ratePerUnit?.toString() || "",
//           taxType: it.taxType || "WITHTAX",
//           discountAmount: (it.discountAmount || 0).toString(),
//           taxRate: it.taxRate || "GST18",
//           totalTaxAmount: it.totalTaxAmount || 0,
//           totalAmount: it.totalAmount || 0,
//         })) || [],
//         totalQuantity: c.totalQuantity || 0,
//         totalDiscountAmount: c.totalDiscountAmount || 0,
//         totalTaxAmount: c.totalTaxAmount || 0,
//         totalAmount: c.totalAmount || 0,
//       });
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to load challan");
//       navigate("/delivery");
//     } finally {
//       setLoadingData(false);
//     }
//   };

//   useEffect(() => {
//     fetchParties();
//     fetchItems();
//     if (editId) fetchDeliveryChallan(editId);
//   }, [token, companyId, editId]);

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

//     setForm((prev) => ({
//       ...prev,
//       items: calculated,
//       totalQuantity: totalQty,
//       totalDiscountAmount: parseFloat(totalDiscount.toFixed(2)),
//       totalTaxAmount: parseFloat(totalTax.toFixed(2)),
//       totalAmount: parseFloat(totalAmt.toFixed(2)),
//     }));
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
//       unit: selected.baseUnit || "PIECES",
//       ratePerUnit: selected.purchasePrice?.toString() || selected.salePrice?.toString() || "",
//       taxType: selected.purchaseTaxType || selected.saleTaxType || "WITHTAX",
//       taxRate: selected.taxRate || "GST18",
//       quantity: newItems[index].quantity || "1",
//       discountAmount: "0",
//     };

//     recalculateTotals(newItems);
//   };

//   // Handle item field change
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
//           itemName: "",
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

//     if (!form.partyId || !form.challanNo || !form.challanDate || !form.dueDate) {
//       toast.error("Fill all required fields");
//       return;
//     }

//     const invalidItem = form.items.some(
//       (i) => !i.itemName || !i.quantity || !i.ratePerUnit || parseFloat(i.quantity) <= 0 || parseFloat(i.ratePerUnit) <= 0
//     );
//     if (invalidItem) {
//       toast.error("Each item must have Name, Qty > 0, Rate > 0");
//       return;
//     }

//     const payload = {
//       partyId: parseInt(form.partyId),
//       challanNo: form.challanNo.trim(),
//       challanDate: form.challanDate,
//       dueDate: form.dueDate,
//       totalDiscountAmount: form.totalDiscountAmount,
//       totalTaxAmount: form.totalTaxAmount,
//       totalQuantity: form.totalQuantity,
//       totalAmount: form.totalAmount,
//       stateOfSupply: form.stateOfSupply,
//       description: form.description.trim() || null,
//       deliveryChallanItemRequests: form.items.map((i) => ({
//         name: i.itemName.trim(),
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
//         await axios.put(`${config.BASE_URL}/delivery-challan/${editId}`, payload, {
//           headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
//         });
//         toast.success("Delivery Challan updated!");
//       } else {
//         await axios.post(`${config.BASE_URL}/company/${companyId}/create/delivery-challan`, payload, {
//           headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
//         });
//         toast.success("Delivery Challan created!");
//       }

//       navigate("/delivery");
//     } catch (err) {
//       toast.error(err.response?.data?.message || `Failed to ${editId ? "update" : "create"} challan`);
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
//           <p>Loading delivery challan...</p>
//         </div>
//       ) : (
//         <form onSubmit={handleSubmit}>
//           {/* Header */}
//           <div className={styles["form-header"]}>
//             <div>
//               <h1 className={styles["company-form-title"]}>
//                 {isEditMode ? "Edit Delivery Challan" : "Create Delivery Challan"}
//               </h1>
//               <p className={styles["form-subtitle"]}>
//                 {isEditMode ? `Challan #${form.challanNo}` : "Enter challan details and items"}
//               </p>
//             </div>
//             <div style={{ display: "flex", gap: "8px" }}>
//               <button
//                 type="button"
//                 onClick={() => navigate("/delivery")}
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
//                 {loading ? "Saving..." : isEditMode ? "Update Challan" : "Create Challan"}
//               </button>
//             </div>
//           </div>

//           {/* Party & Challan No */}
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
//               <label>Challan No <span className={styles.required}>*</span></label>
//               <input
//                 type="text"
//                 value={form.challanNo}
//                 onChange={(e) => setForm({ ...form, challanNo: e.target.value })}
//                 required
//                 className={styles["form-input"]}
//                 placeholder="e.g. DC-001"
//                 disabled={!token || !companyId || loadingData}
//               />
//             </div>
//           </div>

//           {/* Dates */}
//           <div className={styles["form-row"]}>
//             <div className={styles["form-group"]}>
//               <label>Challan Date <span className={styles.required}>*</span></label>
//               <input
//                 type="date"
//                 value={form.challanDate}
//                 onChange={(e) => setForm({ ...form, challanDate: e.target.value })}
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
//                 min={form.challanDate}
//                 className={styles["form-input"]}
//                 disabled={!token || !companyId || loadingData}
//               />
//             </div>
//           </div>

//           {/* State & Description */}
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
//               <div
//                 key={index}
//                 style={{
//                   border: "1px solid #ddd",
//                   borderRadius: "6px",
//                   padding: "16px",
//                   marginBottom: "16px",
//                   background: "#fafafa",
//                 }}
//               >
//                 {/* ITEM SELECT */}
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
//                           {i.itemName} ({i.itemCode || "—"})
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>

//                 {/* QUANTITY & UNIT */}
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
//                     <input
//                       type="text"
//                       value={item.unit}
//                       readOnly
//                       className={styles["form-input"]}
//                       style={{ background: "#f9f9f9" }}
//                     />
//                   </div>
//                 </div>

//                 {/* RATE & TAX */}
//                 <div className={styles["form-row"]}>
//                   <div className={styles["form-group"]}>
//                     <label>Rate/Unit <span className={styles.required}>*</span></label>
//                     <input
//                       type="number"
//                       step="0.01"
//                       min="0.01"
//                       value={item.ratePerUnit}
//                       onChange={(e) => handleItemChange(index, "ratePerUnit", e.target.value)}
//                       required
//                       className={styles["form-input"]}
//                       disabled={!token || !companyId || loadingData}
//                     />
//                   </div>
//                   <div className={styles["form-group"]}>
//                     <label>Tax Type</label>
//                     <input
//                       type="text"
//                       value={item.taxType}
//                       readOnly
//                       className={styles["form-input"]}
//                       style={{ background: "#f9f9f9" }}
//                     />
//                   </div>
//                   <div className={styles["form-group"]}>
//                     <label>Tax Rate</label>
//                     <input
//                       type="text"
//                       value={item.taxRate}
//                       readOnly
//                       className={styles["form-input"]}
//                       style={{ background: "#f9f9f9" }}
//                     />
//                   </div>
//                 </div>

//                 {/* DISCOUNT & TOTALS */}
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
//               <div><strong>Discount:</strong> ₹{form.totalDiscountAmount.toFixed(2)}</div>
//               <div><strong>Tax:</strong> ₹{form.totalTaxAmount.toFixed(2)}</div>
//               <div><strong>Total:</strong> ₹{form.totalAmount.toFixed(2)}</div>
//             </div>
//           </div>
//         </form>
//       )}
//     </div>
//   );
// };

// export default CreateDeliveryChallan;





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
//   MapPin,
//   FileText,
//   IndianRupee,
//   Loader,
//   Truck,
// } from "lucide-react"

// const CreateDeliveryChallan = () => {
//   const navigate = useNavigate()
//   const location = useLocation()
//   const queryParams = new URLSearchParams(location.search)
//   const editId = queryParams.get("edit")

//   const userData = JSON.parse(localStorage.getItem("eBilling")) || {}
//   const token = userData?.accessToken || ""
//   const companyId = userData?.selectedCompany?.id || ""

//   const [loading, setLoading] = useState(false)
//   const [loadingData, setLoadingData] = useState(false)
//   const [parties, setParties] = useState([])
//   const [items, setItems] = useState([])
//   const [loadingItems, setLoadingItems] = useState(false)

//   const states = [
//     "ANDHRA_PRADESH", "ARUNACHAL_PRADESH", "ASSAM", "BIHAR", "CHHATTISGARH", "GOA", "GUJARAT", "HARYANA",
//     "HIMACHAL_PRADESH", "JHARKHAND", "KARNATAKA", "KERALA", "MADHYA_PRADESH", "MAHARASHTRA", "MANIPUR",
//     "MEGHALAYA", "MIZORAM", "NAGALAND", "ODISHA", "PUNJAB", "RAJASTHAN", "SIKKIM", "TAMIL_NADU", "TELANGANA",
//     "TRIPURA", "UTTAR_PRADESH", "UTTARAKHAND", "WEST_BENGAL", "OTHER"
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
//     challanNo: "",
//     challanDate: new Date().toISOString().split("T")[0],
//     dueDate: "",
//     stateOfSupply: "MAHARASHTRA",
//     description: "",
//     items: [
//       {
//         itemId: "",
//         itemName: "",
//         quantity: "",
//         unit: "PIECES",
//         ratePerUnit: "",
//         taxType: "WITHTAX",
//         discountAmount: "0",
//         taxRate: "GST18",
//         totalTaxAmount: 0,
//         totalAmount: 0,
//       },
//     ],
//     totalQuantity: 0,
//     totalDiscountAmount: 0,
//     totalTaxAmount: 0,
//     totalAmount: 0,
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

//   const fetchDeliveryChallan = async (challanId) => {
//     if (!token) return
//     setLoadingData(true)
//     try {
//       const res = await axios.get(`${config.BASE_URL}/delivery-challan/${challanId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })

//       const c = res.data
//       setForm({
//         partyId: c.partyResponseDto?.partyId?.toString() || "",
//         challanNo: c.challanNo || "",
//         challanDate: c.challanDate || "",
//         dueDate: c.dueDate || "",
//         stateOfSupply: c.stateOfSupply || "MAHARASHTRA",
//         description: c.description || "",
//         items: c.deliveryChallanItemResponses?.map((it) => ({
//           itemId: "",
//           itemName: it.name || "",
//           quantity: it.quantity?.toString() || "",
//           unit: it.unit || "PIECES",
//           ratePerUnit: it.ratePerUnit?.toString() || "",
//           taxType: it.taxType || "WITHTAX",
//           discountAmount: (it.discountAmount || 0).toString(),
//           taxRate: it.taxRate || "GST18",
//           totalTaxAmount: it.totalTaxAmount || 0,
//           totalAmount: it.totalAmount || 0,
//         })) || [],
//         totalQuantity: c.totalQuantity || 0,
//         totalDiscountAmount: c.totalDiscountAmount || 0,
//         totalTaxAmount: c.totalTaxAmount || 0,
//         totalAmount: c.totalAmount || 0,
//       })
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to load challan")
//       navigate("/delivery")
//     } finally {
//       setLoadingData(false)
//     }
//   }

//   useEffect(() => {
//     fetchParties()
//     fetchItems()
//     if (editId) fetchDeliveryChallan(editId)
//   }, [token, companyId, editId])

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

//     setForm((prev) => ({
//       ...prev,
//       items: calculated,
//       totalQuantity: totalQty,
//       totalDiscountAmount: parseFloat(totalDiscount.toFixed(2)),
//       totalTaxAmount: parseFloat(totalTax.toFixed(2)),
//       totalAmount: parseFloat(totalAmt.toFixed(2)),
//     }))
//   }

//   /* ==================== ITEM HANDLING ==================== */
//   const handleItemSelect = (index, itemId) => {
//     const selected = items.find((i) => i.itemId === Number(itemId))
//     if (!selected) return

//     const newItems = [...form.items]
//     newItems[index] = {
//       ...newItems[index],
//       itemId: selected.itemId,
//       itemName: selected.itemName,
//       unit: selected.baseUnit || "PIECES",
//       ratePerUnit: selected.purchasePrice?.toString() || selected.salePrice?.toString() || "",
//       taxType: selected.purchaseTaxType || selected.saleTaxType || "WITHTAX",
//       taxRate: selected.taxRate || "GST18",
//       quantity: newItems[index].quantity || "1",
//       discountAmount: "0",
//     }

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
//           itemName: "",
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

//     if (!form.partyId || !form.challanNo || !form.challanDate || !form.dueDate) {
//       toast.error("Fill all required fields")
//       return
//     }

//     const invalidItem = form.items.some(
//       (i) => !i.itemName || !i.quantity || !i.ratePerUnit || parseFloat(i.quantity) <= 0 || parseFloat(i.ratePerUnit) <= 0
//     )
//     if (invalidItem) {
//       toast.error("Each item must have Name, Qty > 0, Rate > 0")
//       return
//     }

//     const payload = {
//       partyId: parseInt(form.partyId),
//       challanNo: form.challanNo.trim(),
//       challanDate: form.challanDate,
//       dueDate: form.dueDate,
//       totalDiscountAmount: form.totalDiscountAmount,
//       totalTaxAmount: form.totalTaxAmount,
//       totalQuantity: form.totalQuantity,
//       totalAmount: form.totalAmount,
//       stateOfSupply: form.stateOfSupply,
//       description: form.description.trim() || null,
//       deliveryChallanItemRequests: form.items.map((i) => ({
//         name: i.itemName.trim(),
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
//         await axios.put(`${config.BASE_URL}/delivery-challan/${editId}`, payload, {
//           headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
//         })
//         toast.success("Delivery Challan updated!")
//       } else {
//         await axios.post(`${config.BASE_URL}/company/${companyId}/create/delivery-challan`, payload, {
//           headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
//         })
//         toast.success("Delivery Challan created!")
//       }

//       navigate("/delivery")
//     } catch (err) {
//       toast.error(err.response?.data?.message || `Failed to ${editId ? "update" : "create"} challan`)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const isEditMode = !!editId

//   return (
//     <div className={styles.container}>
//       {loadingData ? (
//         <div className={styles.loadingContainer}>
//           <Loader className={styles.spinnerIcon} />
//           <p>Loading delivery challan...</p>
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
//                       <Truck className={styles.titleIcon} />
//                       Edit Delivery Challan
//                     </>
//                   ) : (
//                     <>
//                       <FileText className={styles.titleIcon} />
//                       Create Delivery Challan
//                     </>
//                   )}
//                 </h1>
//                 <p className={styles.subtitle}>
//                   {isEditMode ? `Challan #${form.challanNo}` : "Enter challan details and items"}
//                 </p>
//               </div>
//             </div>
//             <div className={styles.headerActions}>
//               <button
//                 type="button"
//                 onClick={() => navigate("/delivery")}
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
//                     {isEditMode ? "Update Challan" : "Create Challan"}
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>

//           {/* Party & Challan No */}
//           <div className={styles.formSection}>
//             <h2 className={styles.sectionTitle}>
//               <Users size={20} />
//               Party & Challan Info
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
//                 <label htmlFor="challanNo" className={styles.label}>
//                   Challan No <span className={styles.required}>*</span>
//                 </label>
//                 <input
//                   id="challanNo"
//                   type="text"
//                   value={form.challanNo}
//                   onChange={(e) => setForm({ ...form, challanNo: e.target.value })}
//                   required
//                   className={styles.input}
//                   placeholder="e.g. DC-001"
//                   disabled={!token || !companyId || loadingData}
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Dates */}
//           <div className={styles.formSection}>
//             <h2 className={styles.sectionTitle}>
//               <Calendar size={20} />
//               Dates
//             </h2>
//             <div className={styles.formGrid}>
//               <div className={styles.formGroup}>
//                 <label htmlFor="challanDate" className={styles.label}>
//                   Challan Date <span className={styles.required}>*</span>
//                 </label>
//                 <input
//                   id="challanDate"
//                   type="date"
//                   value={form.challanDate}
//                   onChange={(e) => setForm({ ...form, challanDate: e.target.value })}
//                   required
//                   className={styles.input}
//                   disabled={!token || !companyId || loadingData}
//                 />
//               </div>

//               <div className={styles.formGroup}>
//                 <label htmlFor="dueDate" className={styles.label}>
//                   Due Date <span className={styles.required}>*</span>
//                 </label>
//                 <input
//                   id="dueDate"
//                   type="date"
//                   value={form.dueDate}
//                   onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
//                   required
//                   min={form.challanDate}
//                   className={styles.input}
//                   disabled={!token || !companyId || loadingData}
//                 />
//               </div>
//             </div>
//           </div>

//           {/* State & Description */}
//           <div className={styles.formSection}>
//             <h2 className={styles.sectionTitle}>
//               <MapPin size={20} />
//               Additional Details
//             </h2>
//             <div className={styles.formGrid}>
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
//                 <label htmlFor="description" className={styles.label}>
//                   Description
//                 </label>
//                 <textarea
//                   id="description"
//                   value={form.description}
//                   onChange={(e) => setForm({ ...form, description: e.target.value })}
//                   className={`${styles.input} ${styles.textarea}`}
//                   placeholder="Optional notes..."
//                   rows={3}
//                   disabled={!token || !companyId || loadingData}
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Items Section */}
//           <div className={styles.formSection}>
//             <div className={styles.itemsHeader}>
//               <h2 className={styles.sectionTitle}>
//                 <Package size={20} />
//                 Items
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
//               {form.items.map((item, index) => (
//                 <div key={index} className={styles.itemCard}>
//                   <div className={styles.itemHeader}>
//                     <span className={styles.itemNumber}>Item {index + 1}</span>
//                     {form.items.length > 1 && (
//                       <button
//                         type="button"
//                         onClick={() => removeItem(index)}
//                         className={styles.buttonDelete}
//                         disabled={!token || !companyId || loadingData}
//                         aria-label="Remove item"
//                       >
//                         <Trash2 size={18} />
//                       </button>
//                     )}
//                   </div>

//                   {/* Item Select */}
//                   <div className={styles.itemGrid}>
//                     <div className={styles.formGroup}>
//                       <label className={styles.label}>
//                         Item Name <span className={styles.required}>*</span>
//                       </label>
//                       <select
//                         value={item.itemId}
//                         onChange={(e) => handleItemSelect(index, e.target.value)}
//                         required
//                         className={styles.input}
//                         disabled={!token || !companyId || loadingItems || loadingData}
//                       >
//                         <option value="">-- Select Item --</option>
//                         {items.map((i) => (
//                           <option key={i.itemId} value={i.itemId}>
//                             {i.itemName} ({i.itemCode || "—"})
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                   </div>

//                   {/* Quantity & Unit */}
//                   <div className={styles.itemGrid}>
//                     <div className={styles.formGroup}>
//                       <label className={styles.label}>
//                         Quantity <span className={styles.required}>*</span>
//                       </label>
//                       <input
//                         type="number"
//                         step="0.01"
//                         min="0.01"
//                         value={item.quantity}
//                         onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
//                         required
//                         className={styles.input}
//                         disabled={!token || !companyId || loadingData}
//                         placeholder="Enter qty"
//                       />
//                     </div>

//                     <div className={styles.formGroup}>
//                       <label className={styles.label}>Unit</label>
//                       <input
//                         type="text"
//                         value={item.unit}
//                         readOnly
//                         className={`${styles.input} ${styles.inputReadonly}`}
//                       />
//                     </div>
//                   </div>

//                   {/* Rate & Tax */}
//                   <div className={styles.itemGrid}>
//                     <div className={styles.formGroup}>
//                       <label className={styles.label}>
//                         Rate/Unit <span className={styles.required}>*</span>
//                       </label>
//                       <input
//                         type="number"
//                         step="0.01"
//                         min="0.01"
//                         value={item.ratePerUnit}
//                         onChange={(e) => handleItemChange(index, "ratePerUnit", e.target.value)}
//                         required
//                         className={styles.input}
//                         disabled={!token || !companyId || loadingData}
//                       />
//                     </div>

//                     <div className={styles.formGroup}>
//                       <label className={styles.label}>Tax Type</label>
//                       <input
//                         type="text"
//                         value={item.taxType}
//                         readOnly
//                         className={`${styles.input} ${styles.inputReadonly}`}
//                       />
//                     </div>

//                     <div className={styles.formGroup}>
//                       <label className={styles.label}>Tax Rate</label>
//                       <input
//                         type="text"
//                         value={item.taxRate}
//                         readOnly
//                         className={`${styles.input} ${styles.inputReadonly}`}
//                       />
//                     </div>
//                   </div>

//                   {/* Discount & Totals */}
//                   <div className={styles.itemGrid}>
//                     <div className={styles.formGroup}>
//                       <label className={styles.label}>Discount</label>
//                       <div className={styles.inputIcon}>
//                         <IndianRupee size={18} />
//                         <input
//                           type="number"
//                           step="0.01"
//                           min="0"
//                           value={item.discountAmount}
//                           onChange={(e) => handleItemChange(index, "discountAmount", e.target.value)}
//                           className={styles.input}
//                           placeholder="0.00"
//                           disabled={!token || !companyId || loadingData}
//                         />
//                       </div>
//                     </div>

//                     <div className={styles.formGroup}>
//                       <label className={styles.label}>Tax Amount</label>
//                       <div className={styles.valueDisplay}>
//                         <IndianRupee size={16} />
//                         <span>{item.totalTaxAmount.toFixed(2)}</span>
//                       </div>
//                     </div>

//                     <div className={styles.formGroup}>
//                       <label className={styles.label}>Total</label>
//                       <div className={`${styles.valueDisplay} ${styles.valueDisplayTotal}`}>
//                         <IndianRupee size={16} />
//                         <span>{item.totalAmount.toFixed(2)}</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Summary */}
//           <div className={styles.summarySection}>
//             <h2 className={styles.sectionTitle}>Challan Summary</h2>
//             <div className={styles.summaryGrid}>
//               <div className={styles.summaryItem}>
//                 <span className={styles.summaryLabel}>Total Quantity</span>
//                 <span className={styles.summaryValue}>{form.totalQuantity}</span>
//               </div>
//               <div className={styles.summaryItem}>
//                 <span className={styles.summaryLabel}>Total Discount</span>
//                 <span className={styles.summaryValue}>
//                   <IndianRupee size={14} />
//                   {form.totalDiscountAmount.toFixed(2)}
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
//             </div>
//           </div>
//         </form>
//       )}
//     </div>
//   )
// }

// export default CreateDeliveryChallan









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
//   MapPin,
//   FileText,
//   IndianRupee,
//   Loader,
//   Truck,
//   Phone,
// } from "lucide-react"

// const CreateDeliveryChallan = () => {
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
//     partyPhone: "",
//     challanNo: "",
//     challanDate: new Date().toISOString().split("T")[0],
//     dueDate: "",
//     stateOfSupply: "MAHARASHTRA",
//     description: "",
//     items: [],
//     totalQuantity: 0,
//     totalDiscountAmount: 0,
//     totalTaxAmount: 0,
//     totalAmount: 0,
//   })

//   /* ==================== AUTO-FILL PHONE ON PARTY SELECT ==================== */
//   useEffect(() => {
//     if (!form.partyId || parties.length === 0) return

//     const selectedParty = parties.find((p) => p.partyId === Number(form.partyId))
//     if (selectedParty) {
//       setForm((prev) => ({
//         ...prev,
//         partyPhone: selectedParty.phoneNo || "",
//         stateOfSupply: selectedParty.state || prev.stateOfSupply,
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

//   const fetchDeliveryChallan = async (challanId) => {
//     if (!token) return
//     setLoadingData(true)
//     try {
//       const res = await axios.get(`${config.BASE_URL}/delivery-challan/${challanId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })

//       const c = res.data
//       const challanItems = c.deliveryChallanItemResponses?.map((it) => ({
//         itemId: it.itemId?.toString() || "",
//         itemName: it.name || "",
//         itemHsnCode: it.hsn || "",
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
//         partyId: c.partyResponseDto?.partyId?.toString() || "",
//         partyPhone: c.partyResponseDto?.phoneNo || "",
//         challanNo: c.challanNo || "",
//         challanDate: c.challanDate?.split("T")[0] || "",
//         dueDate: c.dueDate?.split("T")[0] || "",
//         stateOfSupply: c.stateOfSupply || "MAHARASHTRA",
//         description: c.description || "",
//         items: challanItems,
//         totalQuantity: c.totalQuantity || 0,
//         totalDiscountAmount: c.totalDiscountAmount || 0,
//         totalTaxAmount: c.totalTaxAmount || 0,
//         totalAmount: c.totalAmount || 0,
//       })
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to load challan")
//       navigate("/delivery")
//     } finally {
//       setLoadingData(false)
//     }
//   }

//   useEffect(() => {
//     fetchParties()
//     fetchItems()
//     if (editId) fetchDeliveryChallan(editId)
//   }, [token, companyId, editId])

//   /* ==================== ITEM HANDLING ==================== */
//   const handleItemSelect = (index, itemId) => {
//     const selected = items.find((i) => i.itemId?.toString() === itemId)
//     const newItems = [...form.items]

//     if (!selected) {
//       newItems[index] = {
//         ...newItems[index],
//         itemId: "",
//         itemName: "",
//         itemHsnCode: "",
//         quantity: "",
//         unit: "PIECES",
//         ratePerUnit: "",
//         taxType: "WITHTAX",
//         discountAmount: "0",
//         taxRate: "GST18",
//         totalTaxAmount: 0,
//         totalAmount: 0,
//       }
//       recalculateTotals(newItems)
//       return
//     }

//     newItems[index] = {
//       ...newItems[index],
//       itemId: selected.itemId?.toString(),
//       itemName: selected.itemName,
//       itemHsnCode: selected.itemHsn || "",
//       unit: selected.baseUnit || "PIECES",
//       ratePerUnit: selected.salePrice?.toString() || selected.purchasePrice?.toString() || "",
//       taxType: selected.saleTaxType || selected.purchaseTaxType || "WITHTAX",
//       taxRate: selected.taxRate || "GST18",
//       quantity: newItems[index].quantity || "1",
//       discountAmount: "0",
//     }

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
//           itemName: "",
//           itemHsnCode: "",
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

//     setForm((prev) => ({
//       ...prev,
//       items: calculated,
//       totalQuantity: parseFloat(totalQty.toFixed(2)),
//       totalDiscountAmount: parseFloat(totalDiscount.toFixed(2)),
//       totalTaxAmount: parseFloat(totalTax.toFixed(2)),
//       totalAmount: parseFloat(totalAmt.toFixed(2)),
//     }))
//   }

//   /* ==================== SUBMIT ==================== */
//   const handleSubmit = async (e) => {
//     e.preventDefault()

//     if (!token || !companyId) {
//       toast.error("Please login and select a company")
//       return
//     }

//     if (!form.partyId || !form.challanNo || !form.challanDate) {
//       toast.error("Please fill all required fields")
//       return
//     }

//     const invalidItem = form.items.some(
//       (i) =>
//         !i.itemName ||
//         !i.quantity ||
//         parseFloat(i.quantity) <= 0 ||
//         !i.ratePerUnit ||
//         parseFloat(i.ratePerUnit) <= 0
//     )
//     if (invalidItem) {
//       toast.error("Each item must have valid name, quantity > 0, and rate > 0")
//       return
//     }

//     const payload = {
//       partyId: Number(form.partyId),
//       challanNo: form.challanNo.trim(),
//       challanDate: form.challanDate,
//       dueDate: form.dueDate || null,
//       stateOfSupply: form.stateOfSupply,
//       description: form.description.trim() || null,
//       totalQuantity: form.totalQuantity,
//       totalDiscountAmount: form.totalDiscountAmount,
//       totalTaxAmount: form.totalTaxAmount,
//       totalAmount: form.totalAmount,
//       deliveryChallanItemRequests: form.items.map((i) => ({
//         itemId: i.itemId ? Number(i.itemId) : null, // Fixed: send itemId
//         name: i.itemName.trim(),
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
//         await axios.put(`${config.BASE_URL}/delivery-challan/${editId}`, payload, {
//           headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
//         })
//         toast.success("Delivery Challan updated!")
//       } else {
//         await axios.post(`${config.BASE_URL}/company/${companyId}/create/delivery-challan`, payload, {
//           headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
//         })
//         toast.success("Delivery Challan created!")
//       }
//       navigate("/delivery")
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Operation failed")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const isEditMode = !!editId

//   return (
//     <div className={styles.container}>
//       {(loading || loadingData) && (
//         <div className={styles.loadingContainer}>
//           <Loader className={styles.spinnerIcon} />
//           <p>{loadingData ? "Loading challan..." : "Saving..."}</p>
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
//                     <Truck className={styles.titleIcon} />
//                     Edit Delivery Challan
//                   </>
//                 ) : (
//                   <>
//                     <FileText className={styles.titleIcon} />
//                     Create Delivery Challan
//                   </>
//                 )}
//               </h1>
//               <p className={styles.subtitle}>
//                 {isEditMode ? `Challan #${form.challanNo}` : "Non-taxable delivery of goods"}
//               </p>
//             </div>
//           </div>
//           <div className={styles.headerActions}>
//             <button
//               type="button"
//               onClick={() => navigate("/delivery")}
//               className={styles.buttonSecondary}
//               disabled={loading}
//             >
//               <ArrowLeft size={18} />
//               Back
//             </button>
//             <button type="submit" className={styles.buttonPrimary} disabled={loading || loadingData}>
//               {loading ? (
//                 <>
//                   <Loader size={18} className={styles.spinnerSmall} />
//                   Saving...
//                 </>
//               ) : (
//                 <>
//                   <CheckCircle size={18} />
//                   {isEditMode ? "Update Challan" : "Create Challan"}
//                 </>
//               )}
//             </button>
//           </div>
//         </div>

//         {/* PARTY INFO */}
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
//                 Challan Number <span className={styles.required}>*</span>
//               </label>
//               <input
//                 type="text"
//                 value={form.challanNo}
//                 onChange={(e) => setForm({ ...form, challanNo: e.target.value })}
//                 required
//                 className={styles.input}
//                 placeholder="e.g. DC-001"
//                 disabled={loadingData}
//               />
//             </div>

//             <div className={styles.formGroup}>
//               <label className={styles.label}>Phone No</label>
//               <div className={styles.inputIcon}>
//                 <Phone size={18} />
//                 <input
//                   type="text"
//                   value={form.partyPhone}
//                   readOnly
//                   className={`${styles.input} ${styles.inputReadonly}`}
//                   placeholder="Auto-filled"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* DATES */}
//         <div className={styles.formSection}>
//           <h2 className={styles.sectionTitle}>
//             <Calendar size={20} />
//             Important Dates
//           </h2>
//           <div className={styles.formGrid}>
//             <div className={styles.formGroup}>
//               <label className={styles.label}>
//                 Challan Date <span className={styles.required}>*</span>
//               </label>
//               <input
//                 type="date"
//                 value={form.challanDate}
//                 onChange={(e) => setForm({ ...form, challanDate: e.target.value })}
//                 required
//                 className={styles.input}
//                 disabled={loadingData}
//               />
//             </div>

//             <div className={styles.formGroup}>
//               <label className={styles.label}>Due Date</label>
//               <input
//                 type="date"
//                 value={form.dueDate}
//                 onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
//                 min={form.challanDate}
//                 className={styles.input}
//                 disabled={loadingData}
//               />
//             </div>
//           </div>
//         </div>

//         {/* STATE OF SUPPLY */}
//         <div className={styles.formSection}>
//           <h2 className={styles.sectionTitle}>
//             <MapPin size={20} />
//             Location
//           </h2>
//           <div className={styles.formGrid}>
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

//         {/* ITEMS TABLE - MATCHING CreateSale */}
//         <div className={styles.formSection}>
//           <div className={styles.itemsHeader}>
//             <h2 className={styles.sectionTitle}>
//               <Package size={20} />
//               Items
//             </h2>
//             <button type="button" onClick={addItem} className={styles.buttonAdd} disabled={loadingData}>
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
//                 {form.items.map((item, idx) => (
//                   <tr key={idx}>
//                     <td className={styles.rowNumber}>{idx + 1}</td>
//                     <td>
//                       <select
//                         value={item.itemId || ""}
//                         onChange={(e) => handleItemSelect(idx, e.target.value)}
//                         className={styles.tableSelect}
//                         disabled={loadingData}
//                       >
//                         <option value="">-- Select --</option>
//                         {items.map((i) => (
//                           <option key={i.itemId} value={i.itemId}>
//                             {i.itemName}
//                           </option>
//                         ))}
//                       </select>
//                     </td>
//                     <td>
//                       <input
//                         type="text"
//                         value={item.itemHsnCode}
//                         readOnly
//                         className={styles.tableInputReadonly}
//                       />
//                     </td>
//                     <td>
//                       <input
//                         type="number"
//                         step="0.01"
//                         min="0.01"
//                         value={item.quantity}
//                         onChange={(e) => handleItemChange(idx, "quantity", e.target.value)}
//                         className={styles.tableInput}
//                         disabled={loadingData}
//                       />
//                     </td>
//                     <td>
//                       <select
//                         value={item.unit}
//                         onChange={(e) => handleItemChange(idx, "unit", e.target.value)}
//                         className={styles.tableSelect}
//                         disabled={loadingData}
//                       >
//                         {units.map((u) => (
//                           <option key={u} value={u}>{u}</option>
//                         ))}
//                       </select>
//                     </td>
//                     <td>
//                       <input
//                         type="number"
//                         step="0.01"
//                         value={item.ratePerUnit}
//                         onChange={(e) => handleItemChange(idx, "ratePerUnit", e.target.value)}
//                         className={styles.tableInput}
//                         disabled={loadingData}
//                       />
//                     </td>
//                     <td>
//                       <input
//                         type="number"
//                         step="0.01"
//                         min="0"
//                         value={item.discountAmount}
//                         onChange={(e) => handleItemChange(idx, "discountAmount", e.target.value)}
//                         className={styles.tableInput}
//                         disabled={loadingData}
//                       />
//                     </td>
//                     <td>
//                       <select
//                         value={item.taxType}
//                         onChange={(e) => handleItemChange(idx, "taxType", e.target.value)}
//                         className={styles.tableSelect}
//                         disabled={loadingData}
//                       >
//                         {taxTypes.map((t) => (
//                           <option key={t} value={t}>
//                             {t === "WITHTAX" ? "Inc. Tax" : "Ex. Tax"}
//                           </option>
//                         ))}
//                       </select>
//                     </td>
//                     <td>
//                       <select
//                         value={item.taxRate}
//                         onChange={(e) => handleItemChange(idx, "taxRate", e.target.value)}
//                         className={styles.tableSelect}
//                         disabled={loadingData}
//                       >
//                         {taxRates.map((r) => (
//                           <option key={r} value={r}>
//                             {r.replace("GST", "").replace("IGST", "") || "0%"}
//                           </option>
//                         ))}
//                       </select>
//                     </td>
//                     <td className={styles.amountCell}>
//                       <IndianRupee size={14} />
//                       {item.totalTaxAmount.toFixed(2)}
//                     </td>
//                     <td className={styles.amountCell}>
//                       <IndianRupee size={14} />
//                       <strong>{item.totalAmount.toFixed(2)}</strong>
//                     </td>
//                     <td>
//                       {form.items.length > 1 && (
//                         <button
//                           type="button"
//                           onClick={() => removeItem(idx)}
//                           className={styles.tableDeleteBtn}
//                           disabled={loadingData}
//                         >
//                           <Trash2 size={16} />
//                         </button>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//             {form.items.length === 0 && (
//               <div className={styles.emptyTable}>
//                 <p>No items added yet. Click "Add Item" to start.</p>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* SUMMARY */}
//         <div className={styles.summarySection}>
//           <h2 className={styles.sectionTitle}>Challan Summary</h2>
//           <div className={styles.summaryGrid}>
//             <div className={styles.summaryItem}>
//               <span className={styles.summaryLabel}>Total Quantity</span>
//               <span className={styles.summaryValue}>{form.totalQuantity}</span>
//             </div>
//             <div className={styles.summaryItem}>
//               <span className={styles.summaryLabel}>Total Discount</span>
//               <span className={styles.summaryValue}>
//                 <IndianRupee size={14} />
//                 {form.totalDiscountAmount.toFixed(2)}
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
//           </div>
//         </div>
//       </form>
//     </div>
//   )
// }

// export default CreateDeliveryChallan











"use client";

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../../utils/axiosInstance"; // Shared API with interceptors
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
  MapPin,
  FileText,
  IndianRupee,
  Loader,
  Truck,
  Phone,
} from "lucide-react";

const CreateDeliveryChallan = () => {
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
    partyPhone: "",
    challanNo: "",
    challanDate: new Date().toISOString().split("T")[0],
    dueDate: "",
    stateOfSupply: "MAHARASHTRA",
    description: "",
    items: [],
    totalQuantity: 0,
    totalDiscountAmount: 0,
    totalTaxAmount: 0,
    totalAmount: 0,
  });

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

  /* ==================== AUTO-FILL PHONE & STATE ON PARTY SELECT ==================== */
  useEffect(() => {
    if (!form.partyId || parties.length === 0) return;

    const selectedParty = parties.find((p) => p.partyId === Number(form.partyId));
    if (selectedParty) {
      setForm((prev) => ({
        ...prev,
        partyPhone: selectedParty.phoneNo || "",
        stateOfSupply: selectedParty.state || prev.stateOfSupply,
      }));
    }
  }, [form.partyId, parties]);

  /* ==================== FETCH DATA ==================== */
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

  const fetchDeliveryChallan = async (challanId) => {
    setLoadingData(true);
    try {
      const res = await api.get(`/delivery-challan/${challanId}`);
      const c = res.data;

      const challanItems = c.deliveryChallanItemResponses?.map((it) => ({
        itemId: it.itemId?.toString() || "",
        itemName: it.name || "",
        itemHsnCode: it.hsn || "",
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
        partyId: c.partyResponseDto?.partyId?.toString() || "",
        partyPhone: c.partyResponseDto?.phoneNo || "",
        challanNo: c.challanNo || "",
        challanDate: c.challanDate?.split("T")[0] || "",
        dueDate: c.dueDate?.split("T")[0] || "",
        stateOfSupply: c.stateOfSupply || "MAHARASHTRA",
        description: c.description || "",
        items: challanItems,
        totalQuantity: c.totalQuantity || 0,
        totalDiscountAmount: c.totalDiscountAmount || 0,
        totalTaxAmount: c.totalTaxAmount || 0,
        totalAmount: c.totalAmount || 0,
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load challan");
      navigate("/delivery");
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (token && companyId) {
      fetchParties();
      fetchItems();
      if (editId) fetchDeliveryChallan(editId);
    }
  }, [token, companyId, editId]);

  /* ==================== ITEM HANDLING ==================== */
  const handleItemSelect = (index, itemId) => {
    const selected = items.find((i) => i.itemId?.toString() === itemId);
    const newItems = [...form.items];

    if (!selected) {
      newItems[index] = {
        ...newItems[index],
        itemId: "",
        itemName: "",
        itemHsnCode: "",
        quantity: "",
        unit: "PIECES",
        ratePerUnit: "",
        taxType: "WITHTAX",
        discountAmount: "0",
        taxRate: "GST18",
        totalTaxAmount: 0,
        totalAmount: 0,
      };
      recalculateTotals(newItems);
      return;
    }

    newItems[index] = {
      ...newItems[index],
      itemId: selected.itemId?.toString(),
      itemName: selected.itemName,
      itemHsnCode: selected.itemHsn || "",
      unit: selected.baseUnit || "PIECES",
      ratePerUnit: selected.salePrice?.toString() || selected.purchasePrice?.toString() || "",
      taxType: selected.saleTaxType || selected.purchaseTaxType || "WITHTAX",
      taxRate: selected.taxRate || "GST18",
      quantity: newItems[index].quantity || "1",
      discountAmount: "0",
    };

    recalculateTotals(newItems);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...form.items];
    newItems[index][field] = value;
    recalculateTotals(newItems);
  };

  const addItem = () => {
    setForm((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          itemId: "",
          itemName: "",
          itemHsnCode: "",
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

  /* ==================== CALCULATIONS ==================== */
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

    setForm((prev) => ({
      ...prev,
      items: calculated,
      totalQuantity: parseFloat(totalQty.toFixed(2)),
      totalDiscountAmount: parseFloat(totalDiscount.toFixed(2)),
      totalTaxAmount: parseFloat(totalTax.toFixed(2)),
      totalAmount: parseFloat(totalAmt.toFixed(2)),
    }));
  };

  /* ==================== SUBMIT ==================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.partyId || !form.challanNo || !form.challanDate) {
      toast.error("Please fill all required fields");
      return;
    }

    const invalidItem = form.items.some(
      (i) =>
        !i.itemName ||
        !i.quantity ||
        parseFloat(i.quantity) <= 0 ||
        !i.ratePerUnit ||
        parseFloat(i.ratePerUnit) <= 0
    );
    if (invalidItem) {
      toast.error("Each item must have valid name, quantity > 0, and rate > 0");
      return;
    }

    const payload = {
      partyId: Number(form.partyId),
      challanNo: form.challanNo.trim(),
      challanDate: form.challanDate,
      dueDate: form.dueDate || null,
      stateOfSupply: form.stateOfSupply,
      description: form.description.trim() || null,
      totalQuantity: form.totalQuantity,
      totalDiscountAmount: form.totalDiscountAmount,
      totalTaxAmount: form.totalTaxAmount,
      totalAmount: form.totalAmount,
      deliveryChallanItemRequests: form.items.map((i) => ({
        itemId: i.itemId ? Number(i.itemId) : null,
        name: i.itemName.trim(),
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
        await api.put(`/delivery-challan/${editId}`, payload);
        toast.success("Delivery Challan updated!");
      } else {
        await api.post(`/company/${companyId}/create/delivery-challan`, payload);
        toast.success("Delivery Challan created!");
      }
      navigate("/delivery");
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const isEditMode = !!editId;

  return (
    <div className={styles.container}>
      {(loading || loadingData) && (
        <div className={styles.loadingContainer}>
          <Loader className={styles.spinnerIcon} />
          <p>{loadingData ? "Loading challan..." : "Saving..."}</p>
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
                    <Truck className={styles.titleIcon} />
                    Edit Delivery Challan
                  </>
                ) : (
                  <>
                    <FileText className={styles.titleIcon} />
                    Create Delivery Challan
                  </>
                )}
              </h1>
              <p className={styles.subtitle}>
                {isEditMode ? `Challan #${form.challanNo}` : "Non-taxable delivery of goods"}
              </p>
            </div>
          </div>
          <div className={styles.headerActions}>
            <button
              type="button"
              onClick={() => navigate("/delivery")}
              className={styles.buttonSecondary}
              disabled={loading}
            >
              <ArrowLeft size={18} />
              Back
            </button>
            <button type="submit" className={styles.buttonPrimary} disabled={loading || loadingData}>
              {loading ? (
                <>
                  <Loader size={18} className={styles.spinnerSmall} />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle size={18} />
                  {isEditMode ? "Update Challan" : "Create Challan"}
                </>
              )}
            </button>
          </div>
        </div>

        {/* PARTY INFO */}
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
                Challan Number <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                value={form.challanNo}
                onChange={(e) => setForm({ ...form, challanNo: e.target.value })}
                required
                className={styles.input}
                placeholder="e.g. DC-001"
                disabled={loadingData}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Phone No</label>
              <div className={styles.inputIcon}>
                <Phone size={18} />
                <input
                  type="text"
                  value={form.partyPhone}
                  readOnly
                  className={`${styles.input} ${styles.inputReadonly}`}
                  placeholder="Auto-filled"
                />
              </div>
            </div>
          </div>
        </div>

        {/* DATES */}
        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>
            <Calendar size={20} />
            Important Dates
          </h2>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Challan Date <span className={styles.required}>*</span>
              </label>
              <input
                type="date"
                value={form.challanDate}
                onChange={(e) => setForm({ ...form, challanDate: e.target.value })}
                required
                className={styles.input}
                disabled={loadingData}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Due Date</label>
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                min={form.challanDate}
                className={styles.input}
                disabled={loadingData}
              />
            </div>
          </div>
        </div>

        {/* STATE OF SUPPLY */}
        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>
            <MapPin size={20} />
            Location
          </h2>
          <div className={styles.formGrid}>
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
              Items
            </h2>
            <button type="button" onClick={addItem} className={styles.buttonAdd} disabled={loadingData}>
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
                {form.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className={styles.rowNumber}>{idx + 1}</td>
                    <td>
                      <select
                        value={item.itemId || ""}
                        onChange={(e) => handleItemSelect(idx, e.target.value)}
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
                        value={item.itemHsnCode}
                        readOnly
                        className={styles.tableInputReadonly}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(idx, "quantity", e.target.value)}
                        className={styles.tableInput}
                        disabled={loadingData}
                      />
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
                ))}
              </tbody>
            </table>

            {form.items.length === 0 && (
              <div className={styles.emptyTable}>
                <p>No items added yet. Click "Add Item" to start.</p>
              </div>
            )}
          </div>
        </div>

        {/* SUMMARY */}
        <div className={styles.summarySection}>
          <h2 className={styles.sectionTitle}>Challan Summary</h2>
          <div className={styles.summaryGrid}>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Total Quantity</span>
              <span className={styles.summaryValue}>{form.totalQuantity}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Total Discount</span>
              <span className={styles.summaryValue}>
                <IndianRupee size={14} />
                {form.totalDiscountAmount.toFixed(2)}
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
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateDeliveryChallan;