// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import config from "../../../config/apiconfig";
// import styles from "./Sales.module.css";
// import { toast } from "react-toastify";

// const CreateSaleOrder = () => {
//   const navigate = useNavigate();
//   const userData = JSON.parse(localStorage.getItem("eBilling")) || {};
//   const token = userData?.accessToken || "";
//   const companyId = userData?.selectedCompany?.id || "";

//   const [loading, setLoading] = useState(false);
//   const [parties, setParties] = useState([]);

//   const paymentTypes = ["CASH", "UPI", "CREDIT_CARD", "DEBIT_CARD", "NET_BANKING", "WALLET", "CHEQUE", "OTHER"];
//   const states = [
//     "ANDHRA_PRADESH", "ARUNACHAL_PRADESH", "ASSAM", "BIHAR", "CHHATTISGARH", "GOA", "GUJARAT", "HARYANA",
//     "HIMACHAL_PRADESH", "JHARKHAND", "KARNATAKA", "KERALA", "MADHYA_PRADESH", "MAHARASHTRA", "MANIPUR",
//     "MEGHALAYA", "MIZORAM", "NAGALAND", "ODISHA", "PUNJAB", "RAJASTHAN", "SIKKIM", "TAMIL_NADU", "TELANGANA",
//     "TRIPURA", "UTTAR_PRADESH", "UTTARAKHAND", "WEST_BENGAL", "OTHER"
//   ];
//   const units = ["CARTONS", "KILOGRAMS", "QUINTAL", "BOTTLES", "PIECES", "ROLLS", "NUMBERS", "PAIRS", "TABLETS", "MILLITRE", "BUNDLES", "BOX", "SQUARE_METERS", "BAGS", "CANS", "SQUARE_FEET"];
//   const taxTypes = ["WITHTAX", "WITHOUTTAX"];
//   const taxRates = ["NONE", "EXEMPTED", "GST0", "IGST0", "GST0POINT25", "IGST0POINT25", "GST3", "IGST3", "GST5", "IGST5", "GST12", "IGST12", "GST18", "IGST18", "GST28", "IGST28"];

//   const [form, setForm] = useState({
//     partyId: "",
//     orderNo: "",
//     orderDate: new Date().toISOString().split("T")[0],
//     phoneNo: "",
//     dueDate: "",
//     advanceAmount: "",
//     paymentType: "CASH",
//     stateOfSupply: "MAHARASHTRA",
//     description: "",
//     items: [
//       {
//         name: "",
//         quantity: "",
//         unit: "PIECES",
//         pricePerRate: "",
//         taxType: "WITHTAX",
//         discountAmount: "0",
//         taxRate: "GST18",
//         totalTaxAmount: 0,
//         totalAmount: 0,
//       },
//     ],
//   });

//   // Fetch Parties
//   const fetchParties = async () => {
//     if (!token || !companyId) return;
//     try {
//       const res = await axios.get(`${config.BASE_URL}/company/${companyId}/party`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setParties(res.data);
//     } catch (err) {
//       toast.error("Failed to load parties");
//     }
//   };

//   useEffect(() => {
//     fetchParties();
//   }, [token, companyId]);

//   // Calculate Item Totals
//   const calculateItem = (item) => {
//     const qty = parseFloat(item.quantity) || 0;
//     const rate = parseFloat(item.pricePerRate) || 0;
//     const discount = parseFloat(item.discountAmount) || 0;
//     const taxable = item.taxType === "WITHTAX";

//     const subtotal = qty * rate - discount;
//     let taxAmount = 0;

//     if (taxable && item.taxRate !== "NONE" && item.taxRate !== "EXEMPTED") {
//       const rateNum = parseFloat(item.taxRate.replace(/[^\d.]/g, "")) || 0;
//       taxAmount = (subtotal * rateNum) / 100;
//     }

//     return {
//       ...item,
//       totalTaxAmount: parseFloat(taxAmount.toFixed(2)),
//       totalAmount: parseFloat((subtotal + taxAmount).toFixed(2)),
//     };
//   };

//   // Recalculate All
//   const recalculateTotals = (items) => {
//     const calculatedItems = items.map(calculateItem);
//     const totalQuantity = calculatedItems.reduce((sum, i) => sum + (parseFloat(i.quantity) || 0), 0);
//     const totalDiscountAmount = calculatedItems.reduce((sum, i) => sum + (parseFloat(i.discountAmount) || 0), 0);
//     const totalTaxAmount = calculatedItems.reduce((sum, i) => sum + i.totalTaxAmount, 0);
//     const totalAmount = calculatedItems.reduce((sum, i) => sum + i.totalAmount, 0);
//     const advance = parseFloat(form.advanceAmount) || 0;
//     const balance = totalAmount - advance;

//     setForm((prev) => ({
//       ...prev,
//       items: calculatedItems,
//       totalQuantity,
//       totalDiscountAmount: parseFloat(totalDiscountAmount.toFixed(2)),
//       totalTaxAmount: parseFloat(totalTaxAmount.toFixed(2)),
//       totalAmount: parseFloat(totalAmount.toFixed(2)),
//       balanceAmount: parseFloat(balance.toFixed(2)),
//     }));
//   };

//   // Handle Item Change
//   const handleItemChange = (index, field, value) => {
//     const newItems = [...form.items];
//     newItems[index][field] = value;
//     recalculateTotals(newItems);
//   };

//   // Add/Remove Item
//   const addItem = () => {
//     setForm((prev) => ({
//       ...prev,
//       items: [
//         ...prev.items,
//         {
//           name: "",
//           quantity: "",
//           unit: "PIECES",
//           pricePerRate: "",
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

//     // Validation
//     if (!form.partyId || !form.orderNo || !form.orderDate || !form.dueDate || !form.phoneNo) {
//       toast.error("Please fill all required fields");
//       return;
//     }

//     const invalidItem = form.items.some(
//       (i) => !i.name || !i.quantity || !i.pricePerRate || parseFloat(i.quantity) <= 0 || parseFloat(i.pricePerRate) <= 0
//     );
//     if (invalidItem) {
//       toast.error("All items must have name, quantity, and rate");
//       return;
//     }

//     const payload = {
//       partyId: parseInt(form.partyId),
//       orderNo: form.orderNo,
//       orderDate: form.orderDate,
//       phoneNo: form.phoneNo,
//       dueDate: form.dueDate,
//       totalDiscountAmount: form.totalDiscountAmount,
//       totalQuantity: form.totalQuantity,
//       totalTaxAmount: form.totalTaxAmount,
//       totalAmount: form.totalAmount,
//       balanceAmount: form.balanceAmount,
//       advanceAmount: parseFloat(form.advanceAmount) || 0,
//       paymentType: form.paymentType,
//       stateOfSupply: form.stateOfSupply,
//       description: form.description || null,
//       saleOrderItemRequests: form.items.map((i) => ({
//         name: i.name,
//         quantity: parseFloat(i.quantity),
//         unit: i.unit,
//         pricePerRate: parseFloat(i.pricePerRate),
//         taxType: i.taxType,
//         discountAmount: parseFloat(i.discountAmount) || 0,
//         taxRate: i.taxRate,
//         totalTaxAmount: i.totalTaxAmount,
//         totalAmount: i.totalAmount,
//       })),
//     };

//     try {
//       setLoading(true);
//       await axios.post(
//         `${config.BASE_URL}/company/${companyId}/create/sale-order`,
//         payload,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       toast.success("Sale Order created successfully!");
//       navigate("/sales-history");
//     } catch (err) {
//       console.error(err);
//       toast.error(err.response?.data?.message || "Failed to create sale order");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className={styles["company-form-container"]}>
//       <form onSubmit={handleSubmit}>
//         {/* Header */}
//         <div className={styles["form-header"]}>
//           <div>
//             <h1 className={styles["company-form-title"]}>Create Sale Order</h1>
//             <p className={styles["form-subtitle"]}>Fill in the details below</p>
//           </div>
//           <div style={{ display: "flex", gap: "8px" }}>
//             <button
//               type="button"
//               onClick={() => navigate(-1)}
//               className={styles["cancel-button"]}
//               disabled={loading}
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className={styles["submit-button"]}
//               disabled={loading}
//             >
//               {loading ? "Creating..." : "Create Order"}
//             </button>
//           </div>
//         </div>

//         {/* Party & Basic Info */}
//         <div className={styles["form-row"]}>
//           <div className={styles["form-group"]}>
//             <label>Party <span className={styles.required}>*</span></label>
//             <select
//               value={form.partyId}
//               onChange={(e) => setForm({ ...form, partyId: e.target.value })}
//               required
//               className={styles["form-input"]}
//             >
//               <option value="">Select Party</option>
//               {parties.map((p) => (
//                 <option key={p.partyId} value={p.partyId}>
//                   {p.name} ({p.gstin || "No GSTIN"})
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className={styles["form-group"]}>
//             <label>Order No <span className={styles.required}>*</span></label>
//             <input
//               type="text"
//               value={form.orderNo}
//               onChange={(e) => setForm({ ...form, orderNo: e.target.value })}
//               required
//               className={styles["form-input"]}
//               placeholder="e.g. SO-001"
//             />
//           </div>
//         </div>

//         <div className={styles["form-row"]}>
//           <div className={styles["form-group"]}>
//             <label>Order Date <span className={styles.required}>*</span></label>
//             <input
//               type="date"
//               value={form.orderDate}
//               onChange={(e) => setForm({ ...form, orderDate: e.target.value })}
//               required
//               className={styles["form-input"]}
//             />
//           </div>

//           <div className={styles["form-group"]}>
//             <label>Due Date <span className={styles.required}>*</span></label>
//             <input
//               type="date"
//               value={form.dueDate}
//               onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
//               required
//               min={form.orderDate}
//               className={styles["form-input"]}
//             />
//           </div>
//         </div>

//         <div className={styles["form-row"]}>
//           <div className={styles["form-group"]}>
//             <label>Phone No <span className={styles.required}>*</span></label>
//             <input
//               type="text"
//               value={form.phoneNo}
//               onChange={(e) => setForm({ ...form, phoneNo: e.target.value })}
//               required
//               className={styles["form-input"]}
//               placeholder="10-digit mobile"
//             />
//           </div>

//           <div className={styles["form-group"]}>
//             <label>Payment Type</label>
//             <select
//               value={form.paymentType}
//               onChange={(e) => setForm({ ...form, paymentType: e.target.value })}
//               className={styles["form-input"]}
//             >
//               {paymentTypes.map((t) => (
//                 <option key={t} value={t}>{t}</option>
//               ))}
//             </select>
//           </div>
//         </div>

//         <div className={styles["form-row"]}>
//           <div className={styles["form-group"]}>
//             <label>State of Supply</label>
//             <select
//               value={form.stateOfSupply}
//               onChange={(e) => setForm({ ...form, stateOfSupply: e.target.value })}
//               className={styles["form-input"]}
//             >
//               {states.map((s) => (
//                 <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
//               ))}
//             </select>
//           </div>

//           <div className={styles["form-group"]}>
//             <label>Advance Amount</label>
//             <input
//               type="number"
//               step="0.01"
//               min="0"
//               value={form.advanceAmount}
//               onChange={(e) => {
//                 setForm({ ...form, advanceAmount: e.target.value });
//                 recalculateTotals(form.items);
//               }}
//               className={styles["form-input"]}
//               placeholder="0.00"
//             />
//           </div>
//         </div>

//         <div className={styles["form-group"]}>
//           <label>Description</label>
//           <textarea
//             value={form.description}
//             onChange={(e) => setForm({ ...form, description: e.target.value })}
//             className={`${styles["form-input"]} ${styles.textarea}`}
//             placeholder="Optional notes..."
//           />
//         </div>

//         {/* Items */}
//         <div className={styles["card-section"]}>
//           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
//             <h4 style={{ margin: 0 }}>Items</h4>
//             <button type="button" onClick={addItem} className={styles["submit-button"]} style={{ fontSize: "0.8rem", padding: "6px 12px" }}>
//               + Add Item
//             </button>
//           </div>

//           {form.items.map((item, index) => (
//             <div key={index} style={{ border: "1px solid #ddd", borderRadius: "6px", padding: "12px", marginBottom: "12px", background: "#f9f9f9" }}>
//               <div className={styles["form-row"]}>
//                 <div className={styles["form-group"]}>
//                   <label>Item Name *</label>
//                   <input
//                     type="text"
//                     value={item.name}
//                     onChange={(e) => handleItemChange(index, "name", e.target.value)}
//                     required
//                     className={styles["form-input"]}
//                   />
//                 </div>
//                 <div className={styles["form-group"]}>
//                   <label>Qty *</label>
//                   <input
//                     type="number"
//                     step="0.01"
//                     min="0"
//                     value={item.quantity}
//                     onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
//                     required
//                     className={styles["form-input"]}
//                   />
//                 </div>
//                 <div className={styles["form-group"]}>
//                   <label>Unit</label>
//                   <select
//                     value={item.unit}
//                     onChange={(e) => handleItemChange(index, "unit", e.target.value)}
//                     className={styles["form-input"]}
//                   >
//                     {units.map((u) => (
//                       <option key={u} value={u}>{u}</option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               <div className={styles["form-row"]}>
//                 <div className={styles["form-group"]}>
//                   <label>Rate *</label>
//                   <input
//                     type="number"
//                     step="0.01"
//                     min="0"
//                     value={item.pricePerRate}
//                     onChange={(e) => handleItemChange(index, "pricePerRate", e.target.value)}
//                     required
//                     className={styles["form-input"]}
//                   />
//                 </div>
//                 <div className={styles["form-group"]}>
//                   <label>Tax Type</label>
//                   <select
//                     value={item.taxType}
//                     onChange={(e) => handleItemChange(index, "taxType", e.target.value)}
//                     className={styles["form-input"]}
//                   >
//                     {taxTypes.map((t) => (
//                       <option key={t} value={t}>{t}</option>
//                     ))}
//                   </select>
//                 </div>
//                 <div className={styles["form-group"]}>
//                   <label>Tax Rate</label>
//                   <select
//                     value={item.taxRate}
//                     onChange={(e) => handleItemChange(index, "taxRate", e.target.value)}
//                     className={styles["form-input"]}
//                   >
//                     {taxRates.map((r) => (
//                       <option key={r} value={r}>{r}</option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               <div className={styles["form-row"]}>
//                 <div className={styles["form-group"]}>
//                   <label>Discount</label>
//                   <input
//                     type="number"
//                     step="0.01"
//                     min="0"
//                     value={item.discountAmount}
//                     onChange={(e) => handleItemChange(index, "discountAmount", e.target.value)}
//                     className={styles["form-input"]}
//                   />
//                 </div>
//                 <div className={styles["form-group"]}>
//                   <label>Tax Amount</label>
//                   <div style={{ padding: "10px 12px", background: "#f0f0f0", borderRadius: "6px", fontWeight: "600" }}>
//                     ₹{item.totalTaxAmount.toFixed(2)}
//                   </div>
//                 </div>
//                 <div className={styles["form-group"]}>
//                   <label>Total</label>
//                   <div style={{ padding: "10px 12px", background: "#e8f5e9", borderRadius: "6px", fontWeight: "600", color: "#27ae60" }}>
//                     ₹{item.totalAmount.toFixed(2)}
//                   </div>
//                 </div>
//               </div>

//               {form.items.length > 1 && (
//                 <button
//                   type="button"
//                   onClick={() => removeItem(index)}
//                   className={styles["delete-button"]}
//                   style={{ marginTop: "8px", fontSize: "0.8rem" }}
//                 >
//                   Remove Item
//                 </button>
//               )}
//             </div>
//           ))}
//         </div>

//         {/* Totals */}
//         <div className={styles["card-section"]} style={{ background: "#f8f9fa" }}>
//           <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
//             <div><strong>Total Quantity:</strong> {form.totalQuantity}</div>
//             <div><strong>Total Discount:</strong> ₹{form.totalDiscountAmount?.toFixed(2)}</div>
//             <div><strong>Total Tax:</strong> ₹{form.totalTaxAmount?.toFixed(2)}</div>
//             <div><strong>Total Amount:</strong> ₹{form.totalAmount?.toFixed(2)}</div>
//             <div><strong>Advance:</strong> ₹{(parseFloat(form.advanceAmount) || 0).toFixed(2)}</div>
//             <div style={{ color: form.balanceAmount > 0 ? "#e74c3c" : "#27ae60", fontWeight: "600" }}>
//               <strong>Balance Due:</strong> ₹{form.balanceAmount?.toFixed(2)}
//             </div>
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default CreateSaleOrder;







// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import config from "../../../config/apiconfig";
// import styles from "./Sales.module.css";
// import { toast } from "react-toastify";

// const CreateSaleOrder = () => {
//   const navigate = useNavigate();
//   const userData = JSON.parse(localStorage.getItem("eBilling")) || {};
//   const token = userData?.accessToken || "";
//   const companyId = userData?.selectedCompany?.id || "";

//   const [loading, setLoading] = useState(false);
//   const [parties, setParties] = useState([]); // [{ partyId, name }]

//   // Enums
//   const paymentTypes = ["CASH", "UPI", "CREDIT_CARD", "DEBIT_CARD", "NET_BANKING", "WALLET", "CHEQUE", "OTHER"];
//   const states = [
//     "ANDHRA_PRADESH", "ARUNACHAL_PRADESH", "ASSAM", "BIHAR", "CHHATTISGARH", "GOA", "GUJARAT", "HARYANA",
//     "HIMACHAL_PRADESH", "JHARKHAND", "KARNATAKA", "KERELA", "MADHYA_PRADESH", "MAHARASHTRA", "MANIPUR",
//     "MEGHALAYA", "MIZORAM", "NAGALAND", "ODISHA", "PUNJAB", "RAJASTHAN", "SIKKIM", "TAMIL_NADU", "TELANGANA",
//     "TRIPURA", "UTTAR_PRADESH", "UTTARAKHAND", "WEST_BENGAL", "OTHER"
//   ];
//   const units = ["CARTONS", "KILOGRAMS", "QUINTAL", "BOTTLES", "PIECES", "ROLLS", "NUMBERS", "PAIRS", "TABLETS", "MILLITRE", "BUNDLES", "BOX", "SQUARE_METERS", "BAGS", "CANS", "SQUARE_FEET"];
//   const taxTypes = ["WITHTAX", "WITHOUTTAX"];
//   const taxRates = ["NONE", "EXEMPTED", "GST0", "IGST0", "GST0POINT25", "IGST0POINT25", "GST3", "IGST3", "GST5", "IGST5", "GST12", "IGST12", "GST18", "IGST18", "GST28", "IGST28"];

//   const [form, setForm] = useState({
//     partyId: "",
//     orderNo: "",
//     orderDate: new Date().toISOString().split("T")[0],
//     phoneNo: "",
//     dueDate: "",
//     advanceAmount: "0",
//     paymentType: "CASH",
//     stateOfSupply: "MAHARASHTRA",
//     description: "",
//     items: [
//       {
//         name: "",
//         quantity: "",
//         unit: "PIECES",
//         pricePerRate: "",
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
//     balanceAmount: 0,
//   });

//   // FETCH PARTIES FROM /parties (shows only name)
//   const fetchParties = async () => {
//     if (!token || !companyId) return;
//     try {
//       const res = await axios.get(`${config.BASE_URL}/company/${companyId}/parties`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setParties(res.data || []);
//     } catch (err) {
//       toast.error("Failed to load parties");
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     fetchParties();
//   }, [token, companyId]);

//   // Calculate single item
//   const calculateItem = (item) => {
//     const qty = parseFloat(item.quantity) || 0;
//     const rate = parseFloat(item.pricePerRate) || 0;
//     const discount = parseFloat(item.discountAmount) || 0;
//     const taxable = item.taxType === "WITHTAX";

//     const subtotal = qty * rate - discount;
//     let taxAmount = 0;

//     if (taxable && item.taxRate && item.taxRate !== "NONE" && item.taxRate !== "EXEMPTED") {
//       const rateNum = parseFloat(item.taxRate.replace(/[^\d.]/g, "")) || 0;
//       taxAmount = (subtotal * rateNum) / 100;
//     }

//     return {
//       ...item,
//       totalTaxAmount: parseFloat(taxAmount.toFixed(2)),
//       totalAmount: parseFloat((subtotal + taxAmount).toFixed(2)),
//     };
//   };

//   // Recalculate all totals
//   const recalculateTotals = (items) => {
//     const calculatedItems = items.map(calculateItem);
//     const totalQty = calculatedItems.reduce((sum, i) => sum + (parseFloat(i.quantity) || 0), 0);
//     const totalDiscount = calculatedItems.reduce((sum, i) => sum + (parseFloat(i.discountAmount) || 0), 0);
//     const totalTax = calculatedItems.reduce((sum, i) => sum + i.totalTaxAmount, 0);
//     const totalAmt = calculatedItems.reduce((sum, i) => sum + i.totalAmount, 0);
//     const advance = parseFloat(form.advanceAmount) || 0;
//     const balance = totalAmt - advance;

//     setForm((prev) => ({
//       ...prev,
//       items: calculatedItems,
//       totalQuantity: totalQty,
//       totalDiscountAmount: parseFloat(totalDiscount.toFixed(2)),
//       totalTaxAmount: parseFloat(totalTax.toFixed(2)),
//       totalAmount: parseFloat(totalAmt.toFixed(2)),
//       balanceAmount: parseFloat(balance.toFixed(2)),
//     }));
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
//           name: "",
//           quantity: "",
//           unit: "PIECES",
//           pricePerRate: "",
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

//     if (!form.partyId || !form.orderNo || !form.orderDate || !form.dueDate || !form.phoneNo) {
//       toast.error("Please fill all required fields");
//       return;
//     }

//     const invalidItem = form.items.some(
//       (i) => !i.name || !i.quantity || !i.pricePerRate || parseFloat(i.quantity) <= 0 || parseFloat(i.pricePerRate) <= 0
//     );
//     if (invalidItem) {
//       toast.error("Each item must have Name, Quantity > 0, and Rate > 0");
//       return;
//     }

//     const payload = {
//       partyId: parseInt(form.partyId),
//       orderNo: form.orderNo.trim(),
//       orderDate: form.orderDate,
//       phoneNo: form.phoneNo.trim(),
//       dueDate: form.dueDate,
//       totalDiscountAmount: form.totalDiscountAmount,
//       totalQuantity: form.totalQuantity,
//       totalTaxAmount: form.totalTaxAmount,
//       totalAmount: form.totalAmount,
//       balanceAmount: form.balanceAmount,
//       advanceAmount: parseFloat(form.advanceAmount) || 0,
//       paymentType: form.paymentType,
//       stateOfSupply: form.stateOfSupply,
//       description: form.description.trim() || null,
//       saleOrderItemRequests: form.items.map((i) => ({
//         name: i.name.trim(),
//         quantity: parseFloat(i.quantity),
//         unit: i.unit,
//         pricePerRate: parseFloat(i.pricePerRate),
//         taxType: i.taxType,
//         discountAmount: parseFloat(i.discountAmount) || 0,
//         taxRate: i.taxRate,
//         totalTaxAmount: i.totalTaxAmount,
//         totalAmount: i.totalAmount,
//       })),
//     };

//     try {
//       setLoading(true);
//       await axios.post(
//         `${config.BASE_URL}/company/${companyId}/create/sale-order`,
//         payload,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       toast.success("Sale Order created successfully!");
//       navigate("/sales-history");
//     } catch (err) {
//       console.error("Create error:", err.response?.data);
//       toast.error(err.response?.data?.message || "Failed to create sale order");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className={styles["company-form-container"]}>
//       <form onSubmit={handleSubmit}>
//         {/* Header */}
//         <div className={styles["form-header"]}>
//           <div>
//             <h1 className={styles["company-form-title"]}>Create Sale Order</h1>
//             <p className={styles["form-subtitle"]}>Enter order details and items</p>
//           </div>
//           <div style={{ display: "flex", gap: "8px" }}>
//             <button
//               type="button"
//               onClick={() => navigate(-1)}
//               className={styles["cancel-button"]}
//               disabled={loading}
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className={styles["submit-button"]}
//               disabled={loading}
//             >
//               {loading ? "Creating..." : "Create Order"}
//             </button>
//           </div>
//         </div>

//         {/* Party (only name) */}
//         <div className={styles["form-row"]}>
//           <div className={styles["form-group"]}>
//             <label>Party <span className={styles.required}>*</span></label>
//             <select
//               value={form.partyId}
//               onChange={(e) => setForm({ ...form, partyId: e.target.value })}
//               required
//               className={styles["form-input"]}
//             >
//               <option value="">Select Party</option>
//               {parties.map((p) => (
//                 <option key={p.partyId} value={p.partyId}>
//                   {p.name}  {/* ONLY NAME */}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className={styles["form-group"]}>
//             <label>Order No <span className={styles.required}>*</span></label>
//             <input
//               type="text"
//               value={form.orderNo}
//               onChange={(e) => setForm({ ...form, orderNo: e.target.value })}
//               required
//               className={styles["form-input"]}
//               placeholder="e.g. SO-001"
//             />
//           </div>
//         </div>

//         {/* Rest of the form (unchanged) */}
//         <div className={styles["form-row"]}>
//           <div className={styles["form-group"]}>
//             <label>Order Date <span className={styles.required}>*</span></label>
//             <input
//               type="date"
//               value={form.orderDate}
//               onChange={(e) => setForm({ ...form, orderDate: e.target.value })}
//               required
//               className={styles["form-input"]}
//             />
//           </div>

//           <div className={styles["form-group"]}>
//             <label>Due Date <span className={styles.required}>*</span></label>
//             <input
//               type="date"
//               value={form.dueDate}
//               onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
//               required
//               min={form.orderDate}
//               className={styles["form-input"]}
//             />
//           </div>
//         </div>

//         <div className={styles["form-row"]}>
//           <div className={styles["form-group"]}>
//             <label>Phone No <span className={styles.required}>*</span></label>
//             <input
//               type="text"
//               value={form.phoneNo}
//               onChange={(e) => setForm({ ...form, phoneNo: e.target.value })}
//               required
//               className={styles["form-input"]}
//               placeholder="10-digit mobile"
//               maxLength="10"
//             />
//           </div>

//           <div className={styles["form-group"]}>
//             <label>Payment Type</label>
//             <select
//               value={form.paymentType}
//               onChange={(e) => setForm({ ...form, paymentType: e.target.value })}
//               className={styles["form-input"]}
//             >
//               {paymentTypes.map((t) => (
//                 <option key={t} value={t}>{t}</option>
//               ))}
//             </select>
//           </div>
//         </div>

//         <div className={styles["form-row"]}>
//           <div className={styles["form-group"]}>
//             <label>State of Supply</label>
//             <select
//               value={form.stateOfSupply}
//               onChange={(e) => setForm({ ...form, stateOfSupply: e.target.value })}
//               className={styles["form-input"]}
//             >
//               {states.map((s) => (
//                 <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
//               ))}
//             </select>
//           </div>

//           <div className={styles["form-group"]}>
//             <label>Advance Amount</label>
//             <input
//               type="number"
//               step="0.01"
//               min="0"
//               value={form.advanceAmount}
//               onChange={(e) => {
//                 setForm({ ...form, advanceAmount: e.target.value });
//                 recalculateTotals(form.items);
//               }}
//               className={styles["form-input"]}
//               placeholder="0.00"
//             />
//           </div>
//         </div>

//         <div className={styles["form-group"]}>
//           <label>Description</label>
//           <textarea
//             value={form.description}
//             onChange={(e) => setForm({ ...form, description: e.target.value })}
//             className={`${styles["form-input"]} ${styles.textarea}`}
//             placeholder="Optional notes..."
//             rows={2}
//           />
//         </div>

//         {/* Items Section */}
//         <div className={styles["card-section"]}>
//           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
//             <h4 style={{ margin: 0 }}>Items</h4>
//             <button type="button" onClick={addItem} className={styles["submit-button"]} style={{ fontSize: "0.8rem", padding: "6px 12px" }}>
//               + Add Item
//             </button>
//           </div>

//           {form.items.map((item, index) => (
//             <div key={index} style={{ border: "1px solid #ddd", borderRadius: "6px", padding: "16px", marginBottom: "16px", background: "#fafafa" }}>
//               <div className={styles["form-row"]}>
//                 <div className={styles["form-group"]}>
//                   <label>Item Name <span className={styles.required}>*</span></label>
//                   <input
//                     type="text"
//                     value={item.name}
//                     onChange={(e) => handleItemChange(index, "name", e.target.value)}
//                     required
//                     className={styles["form-input"]}
//                     placeholder="e.g. Earphones"
//                   />
//                 </div>
//                 <div className={styles["form-group"]}>
//                   <label>Quantity <span className={styles.required}>*</span></label>
//                   <input
//                     type="number"
//                     step="0.01"
//                     min="0.01"
//                     value={item.quantity}
//                     onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
//                     required
//                     className={styles["form-input"]}
//                   />
//                 </div>
//                 <div className={styles["form-group"]}>
//                   <label>Unit</label>
//                   <select
//                     value={item.unit}
//                     onChange={(e) => handleItemChange(index, "unit", e.target.value)}
//                     className={styles["form-input"]}
//                   >
//                     {units.map((u) => (
//                       <option key={u} value={u}>{u}</option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               <div className={styles["form-row"]}>
//                 <div className={styles["form-group"]}>
//                   <label>Rate/Unit <span className={styles.required}>*</span></label>
//                   <input
//                     type="number"
//                     step="0.01"
//                     min="0.01"
//                     value={item.pricePerRate}
//                     onChange={(e) => handleItemChange(index, "pricePerRate", e.target.value)}
//                     required
//                     className={styles["form-input"]}
//                   />
//                 </div>
//                 <div className={styles["form-group"]}>
//                   <label>Tax Type</label>
//                   <select
//                     value={item.taxType}
//                     onChange={(e) => handleItemChange(index, "taxType", e.target.value)}
//                     className={styles["form-input"]}
//                   >
//                     {taxTypes.map((t) => (
//                       <option key={t} value={t}>{t}</option>
//                     ))}
//                   </select>
//                 </div>
//                 <div className={styles["form-group"]}>
//                   <label>Tax Rate</label>
//                   <select
//                     value={item.taxRate}
//                     onChange={(e) => handleItemChange(index, "taxRate", e.target.value)}
//                     className={styles["form-input"]}
//                   >
//                     {taxRates.map((r) => (
//                       <option key={r} value={r}>{r}</option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               <div className={styles["form-row"]}>
//                 <div className={styles["form-group"]}>
//                   <label>Discount</label>
//                   <input
//                     type="number"
//                     step="0.01"
//                     min="0"
//                     value={item.discountAmount}
//                     onChange={(e) => handleItemChange(index, "discountAmount", e.target.value)}
//                     className={styles["form-input"]}
//                     placeholder="0.00"
//                   />
//                 </div>
//                 <div className={styles["form-group"]}>
//                   <label>Tax Amount</label>
//                   <div style={{ padding: "10px 12px", background: "#f5f5f5", borderRadius: "6px", fontWeight: "600", color: "#e67e22" }}>
//                     ₹{item.totalTaxAmount.toFixed(2)}
//                   </div>
//                 </div>
//                 <div className={styles["form-group"]}>
//                   <label>Total</label>
//                   <div style={{ padding: "10px 12px", background: "#e8f5e9", borderRadius: "6px", fontWeight: "600", color: "#27ae60" }}>
//                     ₹{item.totalAmount.toFixed(2)}
//                   </div>
//                 </div>
//               </div>

//               {form.items.length > 1 && (
//                 <button
//                   type="button"
//                   onClick={() => removeItem(index)}
//                   className={styles["delete-button"]}
//                   style={{ marginTop: "8px", fontSize: "0.8rem" }}
//                 >
//                   Remove Item
//                 </button>
//               )}
//             </div>
//           ))}
//         </div>

//         {/* Final Totals */}
//         <div className={styles["card-section"]} style={{ background: "#f0f7ff", padding: "16px", borderRadius: "8px" }}>
//           <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px", fontSize: "1rem" }}>
//             <div><strong>Total Qty:</strong> {form.totalQuantity}</div>
//             <div><strong>Discount:</strong> ₹{form.totalDiscountAmount.toFixed(2)}</div>
//             <div><strong>Tax:</strong> ₹{form.totalTaxAmount.toFixed(2)}</div>
//             <div><strong>Total:</strong> ₹{form.totalAmount.toFixed(2)}</div>
//             <div><strong>Advance:</strong> ₹{(parseFloat(form.advanceAmount) || 0).toFixed(2)}</div>
//             <div style={{ color: form.balanceAmount > 0 ? "#e74c3c" : "#27ae60", fontWeight: "600" }}>
//               <strong>Balance:</strong> ₹{form.balanceAmount.toFixed(2)}
//             </div>
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default CreateSaleOrder;







// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import config from "../../../config/apiconfig";
// import styles from "./Sales.module.css";
// import { toast } from "react-toastify";

// const CreateSaleOrder = () => {
//   const navigate = useNavigate();
//   const userData = JSON.parse(localStorage.getItem("eBilling")) || {};
//   const token = userData?.accessToken || "";
//   const companyId = userData?.selectedCompany?.id || "";

//   const [loading, setLoading] = useState(false);
//   const [parties, setParties] = useState([]);

//   // Enums
//   const paymentTypes = ["CASH", "UPI", "CREDIT_CARD", "DEBIT_CARD", "NET_BANKING", "WALLET", "CHEQUE", "OTHER"];
//   const states = [
//     "ANDHRA_PRADESH", "ARUNACHAL_PRADESH", "ASSAM", "BIHAR", "CHHATTISGARH", "GOA", "GUJARAT", "HARYANA",
//     "HIMACHAL_PRADESH", "JHARKHAND", "KARNATAKA", "KERALA", "MADHYA_PRADESH", "MAHARASHTRA", "MANIPUR",
//     "MEGHALAYA", "MIZORAM", "NAGALAND", "ODISHA", "PUNJAB", "RAJASTHAN", "SIKKIM", "TAMIL_NADU", "TELANGANA",
//     "TRIPURA", "UTTAR_PRADESH", "UTTARAKHAND", "WEST_BENGAL", "OTHER"
//   ];
//   const units = ["CARTONS", "KILOGRAMS", "QUINTAL", "BOTTLES", "PIECES", "ROLLS", "NUMBERS", "PAIRS", "TABLETS", "MILLITRE", "BUNDLES", "BOX", "SQUARE_METERS", "BAGS", "CANS", "SQUARE_FEET"];
//   const taxTypes = ["WITHTAX", "WITHOUTTAX"];
//   const taxRates = ["NONE", "EXEMPTED", "GST0", "IGST0", "GST0POINT25", "IGST0POINT25", "GST3", "IGST3", "GST5", "IGST5", "GST12", "IGST12", "GST18", "IGST18", "GST28", "IGST28"];

//   const [form, setForm] = useState({
//     partyId: "",
//     orderNo: "",
//     orderDate: new Date().toISOString().split("T")[0],
//     phoneNo: "",
//     dueDate: "",
//     advanceAmount: "0",
//     paymentType: "CASH",
//     stateOfSupply: "MAHARASHTRA",
//     description: "",
//     items: [
//       {
//         name: "",
//         quantity: "",
//         unit: "PIECES",
//         pricePerRate: "",
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
//     balanceAmount: 0,
//   });

//   // FETCH PARTIES — NO LOGIN REDIRECT
//   const fetchParties = async () => {
//     if (!token || !companyId) {
//       toast.warn("Please select a company and login to continue");
//       return;
//     }

//     try {
//       const res = await axios.get(`${config.BASE_URL}/company/${companyId}/parties`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setParties(res.data || []);
//     } catch (err) {
//       toast.error("Failed to load parties");
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     fetchParties();
//   }, [token, companyId]);

//   // Calculate item
//   const calculateItem = (item) => {
//     const qty = parseFloat(item.quantity) || 0;
//     const rate = parseFloat(item.pricePerRate) || 0;
//     const discount = parseFloat(item.discountAmount) || 0;
//     const taxable = item.taxType === "WITHTAX";

//     const subtotal = qty * rate - discount;
//     let taxAmount = 0;

//     if (taxable && item.taxRate && item.taxRate !== "NONE" && item.taxRate !== "EXEMPTED") {
//       const rateNum = parseFloat(item.taxRate.replace(/[^\d.]/g, "")) || 0;
//       taxAmount = (subtotal * rateNum) / 100;
//     }

//     return {
//       ...item,
//       totalTaxAmount: parseFloat(taxAmount.toFixed(2)),
//       totalAmount: parseFloat((subtotal + taxAmount).toFixed(2)),
//     };
//   };

//   // Recalculate totals
//   const recalculateTotals = (items) => {
//     const calculatedItems = items.map(calculateItem);
//     const totalQty = calculatedItems.reduce((sum, i) => sum + (parseFloat(i.quantity) || 0), 0);
//     const totalDiscount = calculatedItems.reduce((sum, i) => sum + (parseFloat(i.discountAmount) || 0), 0);
//     const totalTax = calculatedItems.reduce((sum, i) => sum + i.totalTaxAmount, 0);
//     const totalAmt = calculatedItems.reduce((sum, i) => sum + i.totalAmount, 0);
//     const advance = parseFloat(form.advanceAmount) || 0;
//     const balance = totalAmt - advance;

//     setForm((prev) => ({
//       ...prev,
//       items: calculatedItems,
//       totalQuantity: totalQty,
//       totalDiscountAmount: parseFloat(totalDiscount.toFixed(2)),
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

//   // Add / Remove item
//   const addItem = () => {
//     setForm((prev) => ({
//       ...prev,
//       items: [
//         ...prev.items,
//         {
//           name: "",
//           quantity: "",
//           unit: "PIECES",
//           pricePerRate: "",
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

//   // Submit — NO LOGIN REDIRECT
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!token || !companyId) {
//       toast.error("You must be logged in and have a company selected");
//       return;
//     }

//     if (!form.partyId || !form.orderNo || !form.orderDate || !form.dueDate || !form.phoneNo) {
//       toast.error("Please fill all required fields");
//       return;
//     }

//     const invalidItem = form.items.some(
//       (i) => !i.name || !i.quantity || !i.pricePerRate || parseFloat(i.quantity) <= 0 || parseFloat(i.pricePerRate) <= 0
//     );
//     if (invalidItem) {
//       toast.error("Each item must have Name, Quantity > 0, and Rate > 0");
//       return;
//     }

//     const payload = {
//       partyId: parseInt(form.partyId),
//       orderNo: form.orderNo.trim(),
//       orderDate: form.orderDate,
//       phoneNo: form.phoneNo.trim(),
//       dueDate: form.dueDate,
//       totalDiscountAmount: form.totalDiscountAmount,
//       totalQuantity: form.totalQuantity,
//       totalTaxAmount: form.totalTaxAmount,
//       totalAmount: form.totalAmount,
//       balanceAmount: form.balanceAmount,
//       advanceAmount: parseFloat(form.advanceAmount) || 0,
//       paymentType: form.paymentType,
//       stateOfSupply: form.stateOfSupply,
//       description: form.description.trim() || null,
//       saleOrderItemRequests: form.items.map((i) => ({
//         name: i.name.trim(),
//         quantity: parseFloat(i.quantity),
//         unit: i.unit,
//         pricePerRate: parseFloat(i.pricePerRate),
//         taxType: i.taxType,
//         discountAmount: parseFloat(i.discountAmount) || 0,
//         taxRate: i.taxRate,
//         totalTaxAmount: i.totalTaxAmount,
//         totalAmount: i.totalAmount,
//       })),
//     };

//     try {
//       setLoading(true);
//       await axios.post(
//         `${config.BASE_URL}/company/${companyId}/create/sale-order`,
//         payload,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       toast.success("Sale Order created successfully!");
//       navigate("/sales-history");
//     } catch (err) {
//       console.error("Create error:", err.response?.data);
//       toast.error(err.response?.data?.message || "Failed to create sale order");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className={styles["company-form-container"]}>
//       <form onSubmit={handleSubmit}>
//         {/* Header */}
//         <div className={styles["form-header"]}>
//           <div>
//             <h1 className={styles["company-form-title"]}>Create Sale Order</h1>
//             <p className={styles["form-subtitle"]}>Enter order details and items</p>
//           </div>
//           <div style={{ display: "flex", gap: "8px" }}>
//             <button
//               type="button"
//               onClick={() => navigate(-1)}
//               className={styles["cancel-button"]}
//               disabled={loading}
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className={styles["submit-button"]}
//               disabled={loading || !token || !companyId}
//             >
//               {loading ? "Creating..." : "Create Order"}
//             </button>
//           </div>
//         </div>

//         {/* Party (only name) */}
//         <div className={styles["form-row"]}>
//           <div className={styles["form-group"]}>
//             <label>Party <span className={styles.required}>*</span></label>
//             <select
//               value={form.partyId}
//               onChange={(e) => setForm({ ...form, partyId: e.target.value })}
//               required
//               className={styles["form-input"]}
//               disabled={!token || !companyId}
//             >
//               <option value="">
//                 {token && companyId ? "Select Party" : "Login & Select Company"}
//               </option>
//               {parties.map((p) => (
//                 <option key={p.partyId} value={p.partyId}>
//                   {p.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className={styles["form-group"]}>
//             <label>Order No <span className={styles.required}>*</span></label>
//             <input
//               type="text"
//               value={form.orderNo}
//               onChange={(e) => setForm({ ...form, orderNo: e.target.value })}
//               required
//               className={styles["form-input"]}
//               placeholder="e.g. SO-001"
//               disabled={!token || !companyId}
//             />
//           </div>
//         </div>

//         {/* Rest of the form (disabled if not logged in) */}
//         <div className={styles["form-row"]}>
//           <div className={styles["form-group"]}>
//             <label>Order Date <span className={styles.required}>*</span></label>
//             <input
//               type="date"
//               value={form.orderDate}
//               onChange={(e) => setForm({ ...form, orderDate: e.target.value })}
//               required
//               className={styles["form-input"]}
//               disabled={!token || !companyId}
//             />
//           </div>

//           <div className={styles["form-group"]}>
//             <label>Due Date <span className={styles.required}>*</span></label>
//             <input
//               type="date"
//               value={form.dueDate}
//               onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
//               required
//               min={form.orderDate}
//               className={styles["form-input"]}
//               disabled={!token || !companyId}
//             />
//           </div>
//         </div>

//         <div className={styles["form-row"]}>
//           <div className={styles["form-group"]}>
//             <label>Phone No <span className={styles.required}>*</span></label>
//             <input
//               type="text"
//               value={form.phoneNo}
//               onChange={(e) => setForm({ ...form, phoneNo: e.target.value })}
//               required
//               className={styles["form-input"]}
//               placeholder="10-digit mobile"
//               maxLength="10"
//               disabled={!token || !companyId}
//             />
//           </div>

//           <div className={styles["form-group"]}>
//             <label>Payment Type</label>
//             <select
//               value={form.paymentType}
//               onChange={(e) => setForm({ ...form, paymentType: e.target.value })}
//               className={styles["form-input"]}
//               disabled={!token || !companyId}
//             >
//               {paymentTypes.map((t) => (
//                 <option key={t} value={t}>{t}</option>
//               ))}
//             </select>
//           </div>
//         </div>

//         <div className={styles["form-row"]}>
//           <div className={styles["form-group"]}>
//             <label>State of Supply</label>
//             <select
//               value={form.stateOfSupply}
//               onChange={(e) => setForm({ ...form, stateOfSupply: e.target.value })}
//               className={styles["form-input"]}
//               disabled={!token || !companyId}
//             >
//               {states.map((s) => (
//                 <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
//               ))}
//             </select>
//           </div>

//           <div className={styles["form-group"]}>
//             <label>Advance Amount</label>
//             <input
//               type="number"
//               step="0.01"
//               min="0"
//               value={form.advanceAmount}
//               onChange={(e) => {
//                 setForm({ ...form, advanceAmount: e.target.value });
//                 recalculateTotals(form.items);
//               }}
//               className={styles["form-input"]}
//               placeholder="0.00"
//               disabled={!token || !companyId}
//             />
//           </div>
//         </div>

//         <div className={styles["form-group"]}>
//           <label>Description</label>
//           <textarea
//             value={form.description}
//             onChange={(e) => setForm({ ...form, description: e.target.value })}
//             className={`${styles["form-input"]} ${styles.textarea}`}
//             placeholder="Optional notes..."
//             rows={2}
//             disabled={!token || !companyId}
//           />
//         </div>

//         {/* Items Section */}
//         <div className={styles["card-section"]}>
//           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
//             <h4 style={{ margin: 0 }}>Items</h4>
//             <button
//               type="button"
//               onClick={addItem}
//               className={styles["submit-button"]}
//               style={{ fontSize: "0.8rem", padding: "6px 12px" }}
//               disabled={!token || !companyId}
//             >
//               + Add Item
//             </button>
//           </div>

//           {form.items.map((item, index) => (
//             <div key={index} style={{ border: "1px solid #ddd", borderRadius: "6px", padding: "16px", marginBottom: "16px", background: "#fafafa" }}>
//               {/* Same item fields as before, all disabled if not logged in */}
//               <div className={styles["form-row"]}>
//                 <div className={styles["form-group"]}>
//                   <label>Item Name <span className={styles.required}>*</span></label>
//                   <input
//                     type="text"
//                     value={item.name}
//                     onChange={(e) => handleItemChange(index, "name", e.target.value)}
//                     required
//                     className={styles["form-input"]}
//                     placeholder="e.g. Earphones"
//                     disabled={!token || !companyId}
//                   />
//                 </div>
//                 <div className={styles["form-group"]}>
//                   <label>Quantity <span className={styles.required}>*</span></label>
//                   <input
//                     type="number"
//                     step="0.01"
//                     min="0.01"
//                     value={item.quantity}
//                     onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
//                     required
//                     className={styles["form-input"]}
//                     disabled={!token || !companyId}
//                   />
//                 </div>
//                 <div className={styles["form-group"]}>
//                   <label>Unit</label>
//                   <select
//                     value={item.unit}
//                     onChange={(e) => handleItemChange(index, "unit", e.target.value)}
//                     className={styles["form-input"]}
//                     disabled={!token || !companyId}
//                   >
//                     {units.map((u) => (
//                       <option key={u} value={u}>{u}</option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               <div className={styles["form-row"]}>
//                 <div className={styles["form-group"]}>
//                   <label>Rate/Unit <span className={styles.required}>*</span></label>
//                   <input
//                     type="number"
//                     step="0.01"
//                     min="0.01"
//                     value={item.pricePerRate}
//                     onChange={(e) => handleItemChange(index, "pricePerRate", e.target.value)}
//                     required
//                     className={styles["form-input"]}
//                     disabled={!token || !companyId}
//                   />
//                 </div>
//                 <div className={styles["form-group"]}>
//                   <label>Tax Type</label>
//                   <select
//                     value={item.taxType}
//                     onChange={(e) => handleItemChange(index, "taxType", e.target.value)}
//                     className={styles["form-input"]}
//                     disabled={!token || !companyId}
//                   >
//                     {taxTypes.map((t) => (
//                       <option key={t} value={t}>{t}</option>
//                     ))}
//                   </select>
//                 </div>
//                 <div className={styles["form-group"]}>
//                   <label>Tax Rate</label>
//                   <select
//                     value={item.taxRate}
//                     onChange={(e) => handleItemChange(index, "taxRate", e.target.value)}
//                     className={styles["form-input"]}
//                     disabled={!token || !companyId}
//                   >
//                     {taxRates.map((r) => (
//                       <option key={r} value={r}>{r}</option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               <div className={styles["form-row"]}>
//                 <div className={styles["form-group"]}>
//                   <label>Discount</label>
//                   <input
//                     type="number"
//                     step="0.01"
//                     min="0"
//                     value={item.discountAmount}
//                     onChange={(e) => handleItemChange(index, "discountAmount", e.target.value)}
//                     className={styles["form-input"]}
//                     placeholder="0.00"
//                     disabled={!token || !companyId}
//                   />
//                 </div>
//                 <div className={styles["form-group"]}>
//                   <label>Tax Amount</label>
//                   <div style={{ padding: "10px 12px", background: "#f5f5f5", borderRadius: "6px", fontWeight: "600", color: "#e67e22" }}>
//                     ₹{item.totalTaxAmount.toFixed(2)}
//                   </div>
//                 </div>
//                 <div className={styles["form-group"]}>
//                   <label>Total</label>
//                   <div style={{ padding: "10px 12px", background: "#e8f5e9", borderRadius: "6px", fontWeight: "600", color: "#27ae60" }}>
//                     ₹{item.totalAmount.toFixed(2)}
//                   </div>
//                 </div>
//               </div>

//               {form.items.length > 1 && (
//                 <button
//                   type="button"
//                   onClick={() => removeItem(index)}
//                   className={styles["delete-button"]}
//                   style={{ marginTop: "8px", fontSize: "0.8rem" }}
//                   disabled={!token || !companyId}
//                 >
//                   Remove Item
//                 </button>
//               )}
//             </div>
//           ))}
//         </div>

//         {/* Final Totals */}
//         <div className={styles["card-section"]} style={{ background: "#f0f7ff", padding: "16px", borderRadius: "8px" }}>
//           <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px", fontSize: "1rem" }}>
//             <div><strong>Total Qty:</strong> {form.totalQuantity}</div>
//             <div><strong>Discount:</strong> ₹{form.totalDiscountAmount.toFixed(2)}</div>
//             <div><strong>Tax:</strong> ₹{form.totalTaxAmount.toFixed(2)}</div>
//             <div><strong>Total:</strong> ₹{form.totalAmount.toFixed(2)}</div>
//             <div><strong>Advance:</strong> ₹{(parseFloat(form.advanceAmount) || 0).toFixed(2)}</div>
//             <div style={{ color: form.balanceAmount > 0 ? "#e74c3c" : "#27ae60", fontWeight: "600" }}>
//               <strong>Balance:</strong> ₹{form.balanceAmount.toFixed(2)}
//             </div>
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default CreateSaleOrder;










// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import config from "../../../config/apiconfig";
// import styles from "./Sales.module.css";
// import { toast } from "react-toastify";

// const CreateSaleOrder = () => {
//   const navigate = useNavigate();
//   const userData = JSON.parse(localStorage.getItem("eBilling")) || {};
//   const token = userData?.accessToken || "";
//   const companyId = userData?.selectedCompany?.id || "";

//   const [loading, setLoading] = useState(false);
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
//   const units = ["CARTONS", "KILOGRAMS", "QUINTAL", "BOTTLES", "PIECES", "ROLLS", "NUMBERS", "PAIRS", "TABLETS", "MILLITRE", "BUNDLES", "BOX", "SQUARE_METERS", "BAGS", "CANS", "SQUARE_FEET"];
//   const taxTypes = ["WITHTAX", "WITHOUTTAX"];
//   const taxRates = ["NONE", "EXEMPTED", "GST0", "IGST0", "GST0POINT25", "IGST0POINT25", "GST3", "IGST3", "GST5", "IGST5", "GST12", "IGST12", "GST18", "IGST18", "GST28", "IGST28"];

//   // Tax Rate → Number mapping
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
//     orderDate: new Date().toISOString().split("T")[0],
//     phoneNo: "",
//     dueDate: "",
//     advanceAmount: "0",
//     paymentType: "CASH",
//     stateOfSupply: "MAHARASHTRA",
//     description: "",
//     items: [
//       {
//         itemId: "",
//         name: "",
//         hsn: "",
//         quantity: "",
//         unit: "PIECES",
//         pricePerRate: "",
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

//   useEffect(() => {
//     fetchParties();
//     fetchItems();
//   }, [token, companyId]);

//   // Calculate single item
//   const calculateItem = (item) => {
//     const qty = parseFloat(item.quantity) || 0;
//     const rate = parseFloat(item.pricePerRate) || 0;
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
//       totalDiscountAmount: parseFloat(totalDiscount.toFixed(2)),
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
//       name: selected.itemName,
//       hsn: selected.itemHsn,
//       unit: selected.baseUnit,
//       pricePerRate: selected.salePrice.toString(),
//       taxType: selected.saleTaxType,
//       taxRate: selected.taxRate,
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
//           name: "",
//           hsn: "",
//           quantity: "",
//           unit: "PIECES",
//           pricePerRate: "",
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

//     if (!form.partyId || !form.orderNo || !form.orderDate || !form.dueDate || !form.phoneNo) {
//       toast.error("Fill all required fields");
//       return;
//     }

//     const invalidItem = form.items.some(
//       (i) => !i.name || !i.quantity || !i.pricePerRate || parseFloat(i.quantity) <= 0 || parseFloat(i.pricePerRate) <= 0
//     );
//     if (invalidItem) {
//       toast.error("Each item must have Name, Qty > 0, Rate > 0");
//       return;
//     }

//     const payload = {
//       partyId: parseInt(form.partyId),
//       orderNo: form.orderNo.trim(),
//       orderDate: form.orderDate,
//       phoneNo: form.phoneNo.trim(),
//       dueDate: form.dueDate,
//       totalDiscountAmount: form.totalDiscountAmount,
//       totalQuantity: form.totalQuantity,
//       totalTaxAmount: form.totalTaxAmount,
//       totalAmount: form.totalAmount,
//       balanceAmount: form.balanceAmount,
//       advanceAmount: parseFloat(form.advanceAmount) || 0,
//       paymentType: form.paymentType,
//       stateOfSupply: form.stateOfSupply,
//       description: form.description.trim() || null,
//       saleOrderItemRequests: form.items.map((i) => ({
//         name: i.name.trim(),
//         quantity: parseFloat(i.quantity),
//         unit: i.unit,
//         pricePerRate: parseFloat(i.pricePerRate),
//         taxType: i.taxType,
//         discountAmount: parseFloat(i.discountAmount) || 0,
//         taxRate: i.taxRate,
//         totalTaxAmount: i.totalTaxAmount,
//         totalAmount: i.totalAmount,
//       })),
//     };

//     try {
//       setLoading(true);
//       await axios.post(
//         `${config.BASE_URL}/company/${companyId}/create/sale-order`,
//         payload,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       toast.success("Sale Order created!");
//       navigate("/sales-history");
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to create");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className={styles["company-form-container"]}>
//       <form onSubmit={handleSubmit}>
//         {/* Header */}
//         <div className={styles["form-header"]}>
//           <div>
//             <h1 className={styles["company-form-title"]}>Create Sale Order</h1>
//             <p className={styles["form-subtitle"]}>Enter order details and items</p>
//           </div>
//           <div style={{ display: "flex", gap: "8px" }}>
//             <button type="button" onClick={() => navigate(-1)} className={styles["cancel-button"]} disabled={loading}>
//               Cancel
//             </button>
//             <button type="submit" className={styles["submit-button"]} disabled={loading || !token || !companyId}>
//               {loading ? "Creating..." : "Create Order"}
//             </button>
//           </div>
//         </div>

//         {/* Party & Order No */}
//         <div className={styles["form-row"]}>
//           <div className={styles["form-group"]}>
//             <label>Party <span className={styles.required}>*</span></label>
//             <select
//               value={form.partyId}
//               onChange={(e) => setForm({ ...form, partyId: e.target.value })}
//               required
//               className={styles["form-input"]}
//               disabled={!token || !companyId}
//             >
//               <option value="">{token && companyId ? "Select Party" : "Login & Select Company"}</option>
//               {parties.map((p) => (
//                 <option key={p.partyId} value={p.partyId}>
//                   {p.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className={styles["form-group"]}>
//             <label>Order No <span className={styles.required}>*</span></label>
//             <input
//               type="text"
//               value={form.orderNo}
//               onChange={(e) => setForm({ ...form, orderNo: e.target.value })}
//               required
//               className={styles["form-input"]}
//               placeholder="e.g. SO-001"
//               disabled={!token || !companyId}
//             />
//           </div>
//         </div>

//         {/* Dates */}
//         <div className={styles["form-row"]}>
//           <div className={styles["form-group"]}>
//             <label>Order Date <span className={styles.required}>*</span></label>
//             <input
//               type="date"
//               value={form.orderDate}
//               onChange={(e) => setForm({ ...form, orderDate: e.target.value })}
//               required
//               className={styles["form-input"]}
//               disabled={!token || !companyId}
//             />
//           </div>
//           <div className={styles["form-group"]}>
//             <label>Due Date <span className={styles.required}>*</span></label>
//             <input
//               type="date"
//               value={form.dueDate}
//               onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
//               required
//               min={form.orderDate}
//               className={styles["form-input"]}
//               disabled={!token || !companyId}
//             />
//           </div>
//         </div>

//         {/* Phone & Payment */}
//         <div className={styles["form-row"]}>
//           <div className={styles["form-group"]}>
//             <label>Phone No <span className={styles.required}>*</span></label>
//             <input
//               type="text"
//               value={form.phoneNo}
//               onChange={(e) => setForm({ ...form, phoneNo: e.target.value })}
//               required
//               className={styles["form-input"]}
//               placeholder="10-digit mobile"
//               maxLength={10}
//               disabled={!token || !companyId}
//             />
//           </div>
//           <div className={styles["form-group"]}>
//             <label>Payment Type</label>
//             <select
//               value={form.paymentType}
//               onChange={(e) => setForm({ ...form, paymentType: e.target.value })}
//               className={styles["form-input"]}
//               disabled={!token || !companyId}
//             >
//               {paymentTypes.map((t) => (
//                 <option key={t} value={t}>{t}</option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {/* State & Advance */}
//         <div className={styles["form-row"]}>
//           <div className={styles["form-group"]}>
//             <label>State of Supply</label>
//             <select
//               value={form.stateOfSupply}
//               onChange={(e) => setForm({ ...form, stateOfSupply: e.target.value })}
//               className={styles["form-input"]}
//               disabled={!token || !companyId}
//             >
//               {states.map((s) => (
//                 <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
//               ))}
//             </select>
//           </div>
//           <div className={styles["form-group"]}>
//             <label>Advance Amount</label>
//             <input
//               type="number"
//               step="0.01"
//               min="0"
//               value={form.advanceAmount}
//               onChange={(e) => {
//                 setForm({ ...form, advanceAmount: e.target.value });
//                 recalculateTotals(form.items);
//               }}
//               className={styles["form-input"]}
//               placeholder="0.00"
//               disabled={!token || !companyId}
//             />
//           </div>
//         </div>

//         <div className={styles["form-group"]}>
//           <label>Description</label>
//           <textarea
//             value={form.description}
//             onChange={(e) => setForm({ ...form, description: e.target.value })}
//             className={`${styles["form-input"]} ${styles.textarea}`}
//             placeholder="Optional notes..."
//             rows={2}
//             disabled={!token || !companyId}
//           />
//         </div>

//         {/* Items Section */}
//         <div className={styles["card-section"]}>
//           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
//             <h4 style={{ margin: 0 }}>Items</h4>
//             <button
//               type="button"
//               onClick={addItem}
//               className={styles["submit-button"]}
//               style={{ fontSize: "0.8rem", padding: "6px 12px" }}
//               disabled={!token || !companyId || loadingItems}
//             >
//               + Add Item
//             </button>
//           </div>

//           {loadingItems && <p className={styles.loading}>Loading items...</p>}

//           {form.items.map((item, index) => (
//             <div key={index} style={{ border: "1px solid #ddd", borderRadius: "6px", padding: "16px", marginBottom: "16px", background: "#fafafa" }}>
//               {/* Item Select */}
//               <div className={styles["form-row"]}>
//                 <div className={styles["form-group"]}>
//                   <label>Item Name <span className={styles.required}>*</span></label>
//                   <select
//                     value={item.itemId}
//                     onChange={(e) => handleItemSelect(index, e.target.value)}
//                     required
//                     className={styles["form-input"]}
//                     disabled={!token || !companyId || loadingItems}
//                   >
//                     <option value="">-- Select Item --</option>
//                     {items.map((i) => (
//                       <option key={i.itemId} value={i.itemId}>
//                         {i.itemName} ({i.itemCode})
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 <div className={styles["form-group"]}>
//                   <label>HSN</label>
//                   <input type="text" value={item.hsn} readOnly className={styles["form-input"]} />
//                 </div>
//               </div>

//               {/* Quantity & Unit */}
//               <div className={styles["form-row"]}>
//                 <div className={styles["form-group"]}>
//                   <label>Quantity <span className={styles.required}>*</span></label>
//                   <input
//                     type="number"
//                     step="0.01"
//                     min="0.01"
//                     value={item.quantity}
//                     onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
//                     required
//                     className={styles["form-input"]}
//                     disabled={!token || !companyId}
//                   />
//                 </div>
//                 <div className={styles["form-group"]}>
//                   <label>Unit</label>
//                   <input type="text" value={item.unit} readOnly className={styles["form-input"]} />
//                 </div>
//               </div>

//               {/* Rate & Tax */}
//               <div className={styles["form-row"]}>
//                 <div className={styles["form-group"]}>
//                   <label>Rate/Unit <span className={styles.required}>*</span></label>
//                   <input
//                     type="number"
//                     step="0.01"
//                     min="0.01"
//                     value={item.pricePerRate}
//                     onChange={(e) => handleItemChange(index, "pricePerRate", e.target.value)}
//                     required
//                     className={styles["form-input"]}
//                     disabled={!token || !companyId}
//                   />
//                 </div>
//                 <div className={styles["form-group"]}>
//                   <label>Tax Type</label>
//                   <input type="text" value={item.taxType} readOnly className={styles["form-input"]} />
//                 </div>
//                 <div className={styles["form-group"]}>
//                   <label>Tax Rate</label>
//                   <input type="text" value={item.taxRate} readOnly className={styles["form-input"]} />
//                 </div>
//               </div>

//               {/* Discount & Totals */}
//               <div className={styles["form-row"]}>
//                 <div className={styles["form-group"]}>
//                   <label>Discount</label>
//                   <input
//                     type="number"
//                     step="0.01"
//                     min="0"
//                     value={item.discountAmount}
//                     onChange={(e) => handleItemChange(index, "discountAmount", e.target.value)}
//                     className={styles["form-input"]}
//                     placeholder="0.00"
//                     disabled={!token || !companyId}
//                   />
//                 </div>
//                 <div className={styles["form-group"]}>
//                   <label>Tax Amount</label>
//                   <div style={{ padding: "10px 12px", background: "#f5f5f5", borderRadius: "6px", fontWeight: "600", color: "#e67e22" }}>
//                     ₹{item.totalTaxAmount.toFixed(2)}
//                   </div>
//                 </div>
//                 <div className={styles["form-group"]}>
//                   <label>Total</label>
//                   <div style={{ padding: "10px 12px", background: "#e8f5e9", borderRadius: "6px", fontWeight: "600", color: "#27ae60" }}>
//                     ₹{item.totalAmount.toFixed(2)}
//                   </div>
//                 </div>
//               </div>

//               {form.items.length > 1 && (
//                 <button
//                   type="button"
//                   onClick={() => removeItem(index)}
//                   className={styles["delete-button"]}
//                   style={{ marginTop: "8px", fontSize: "0.8rem" }}
//                   disabled={!token || !companyId}
//                 >
//                   Remove Item
//                 </button>
//               )}
//             </div>
//           ))}
//         </div>

//         {/* Final Totals */}
//         <div className={styles["card-section"]} style={{ background: "#f0f7ff", padding: "16px", borderRadius: "8px" }}>
//           <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px", fontSize: "1rem" }}>
//             <div><strong>Total Qty:</strong> {form.totalQuantity}</div>
//             <div><strong>Discount:</strong> ₹{form.totalDiscountAmount.toFixed(2)}</div>
//             <div><strong>Tax:</strong> ₹{form.totalTaxAmount.toFixed(2)}</div>
//             <div><strong>Total:</strong> ₹{form.totalAmount.toFixed(2)}</div>
//             <div><strong>Advance:</strong> ₹{(parseFloat(form.advanceAmount) || 0).toFixed(2)}</div>
//             <div style={{ color: form.balanceAmount > 0 ? "#e74c3c" : "#27ae60", fontWeight: "600" }}>
//               <strong>Balance:</strong> ₹{form.balanceAmount.toFixed(2)}
//             </div>
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default CreateSaleOrder;








import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import config from "../../../config/apiconfig";
import styles from "./Sales.module.css";
import { toast } from "react-toastify";

const CreateSaleOrder = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const editId = queryParams.get("edit"); // ?edit=123

  const userData = JSON.parse(localStorage.getItem("eBilling")) || {};
  const token = userData?.accessToken || "";
  const companyId = userData?.selectedCompany?.id || "";

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [parties, setParties] = useState([]);
  const [items, setItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);

  // Enums
  const paymentTypes = ["CASH", "UPI", "CREDIT_CARD", "DEBIT_CARD", "NET_BANKING", "WALLET", "CHEQUE", "OTHER"];
  const states = [
    "ANDHRA_PRADESH", "ARUNACHAL_PRADESH", "ASSAM", "BIHAR", "CHHATTISGARH", "GOA", "GUJARAT", "HARYANA",
    "HIMACHAL_PRADESH", "JHARKHAND", "KARNATAKA", "KERALA", "MADHYA_PRADESH", "MAHARASHTRA", "MANIPUR",
    "MEGHALAYA", "MIZORAM", "NAGALAND", "ODISHA", "PUNJAB", "RAJASTHAN", "SIKKIM", "TAMIL_NADU", "TELANGANA",
    "TRIPURA", "UTTAR_PRADESH", "UTTARAKHAND", "WEST_BENGAL", "OTHER"
  ];
  const units = ["CARTONS", "KILOGRAMS", "QUINTAL", "BOTTLES", "PIECES", "ROLLS", "NUMBERS", "PAIRS", "TABLETS", "MILLITRE", "BUNDLES", "BOX", "SQUARE_METERS", "BAGS", "CANS", "SQUARE_FEET"];
  const taxTypes = ["WITHTAX", "WITHOUTTAX"];
  const taxRates = ["NONE", "EXEMPTED", "GST0", "IGST0", "GST0POINT25", "IGST0POINT25", "GST3", "IGST3", "GST5", "IGST5", "GST12", "IGST12", "GST18", "IGST18", "GST28", "IGST28"];

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
    orderNo: "",
    orderDate: new Date().toISOString().split("T")[0],
    phoneNo: "",
    dueDate: "",
    advanceAmount: "0",
    paymentType: "CASH",
    stateOfSupply: "MAHARASHTRA",
    description: "",
    items: [
      {
        itemId: "",
        name: "",
        hsn: "",
        quantity: "",
        unit: "PIECES",
        pricePerRate: "",
        taxType: "WITHTAX",
        discountAmount: "0",
        taxRate: "GST18",
        totalTaxAmount: 0,
        totalAmount: 0,
      },
    ],
    totalQuantity: 0,
    totalDiscountAmount: 0,
    totalTaxAmount: 0,
    totalAmount: 0,
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

  // Load Sale Order for Edit
  const fetchSaleOrder = async (saleOrderId) => {
    if (!token || !companyId) return;
    setLoadingData(true);
    try {
      const res = await axios.get(`${config.BASE_URL}/sale-order/${saleOrderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const order = res.data;
      setForm({
        partyId: order.partyResponseDto?.partyId?.toString() || "",
        orderNo: order.orderNo || "",
        orderDate: order.orderDate || "",
        phoneNo: order.phoneNo || "",
        dueDate: order.dueDate || "",
        advanceAmount: (order.advanceAmount || 0).toString(),
        paymentType: order.paymentType || "CASH",
        stateOfSupply: order.stateOfSupply || "MAHARASHTRA",
        description: order.description || "",
        items: order.saleOrderItemResponses?.map((it) => ({
          itemId: it.itemId?.toString() || "",
          name: it.name || "",
          hsn: it.hsn || "",
          quantity: it.quantity?.toString() || "",
          unit: it.unit || "PIECES",
          pricePerRate: it.pricePerRate?.toString() || "",
          taxType: it.taxType || "WITHTAX",
          discountAmount: (it.discountAmount || 0).toString(),
          taxRate: it.taxRate || "GST18",
          totalTaxAmount: it.totalTaxAmount || 0,
          totalAmount: it.totalAmount || 0,
        })) || [],
        totalQuantity: order.totalQuantity || 0,
        totalDiscountAmount: order.totalDiscountAmount || 0,
        totalTaxAmount: order.totalTaxAmount || 0,
        totalAmount: order.totalAmount || 0,
        balanceAmount: order.balanceAmount || 0,
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load sale order");
      navigate("/sales_history");
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchParties();
    fetchItems();

    if (editId) {
      fetchSaleOrder(editId);
    }
  }, [token, companyId, editId]);

  // Calculate single item
  const calculateItem = (item) => {
    const qty = parseFloat(item.quantity) || 0;
    const rate = parseFloat(item.pricePerRate) || 0;
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
    const advance = parseFloat(form.advanceAmount) || 0;
    const balance = totalAmt - advance;

    setForm((prev) => ({
      ...prev,
      items: calculated,
      totalQuantity: totalQty,
      totalDiscountAmount: parseFloat(totalDiscount.toFixed(2)),
      totalTaxAmount: parseFloat(totalTax.toFixed(2)),
      totalAmount: parseFloat(totalAmt.toFixed(2)),
      balanceAmount: parseFloat(balance.toFixed(2)),
    }));
  };

  // Handle item change
  const handleItemChange = (index, field, value) => {
    const newItems = [...form.items];
    newItems[index][field] = value;
    recalculateTotals(newItems);
  };

  // Handle item select (auto-fill)
  const handleItemSelect = (index, itemId) => {
    const selected = items.find((i) => i.itemId === Number(itemId));
    if (!selected) return;

    const newItems = [...form.items];
    newItems[index] = {
      ...newItems[index],
      itemId: selected.itemId,
      name: selected.itemName,
      hsn: selected.itemHsn,
      unit: selected.baseUnit,
      pricePerRate: selected.salePrice.toString(),
      taxType: selected.saleTaxType,
      taxRate: selected.taxRate,
      quantity: newItems[index].quantity || "1",
      discountAmount: "0",
    };

    recalculateTotals(newItems);
  };

  // Add / Remove
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
          pricePerRate: "",
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

  // Submit (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token || !companyId) {
      toast.error("Login and select company");
      return;
    }

    if (!form.partyId || !form.orderNo || !form.orderDate || !form.dueDate || !form.phoneNo) {
      toast.error("Fill all required fields");
      return;
    }

    const invalidItem = form.items.some(
      (i) => !i.name || !i.quantity || !i.pricePerRate || parseFloat(i.quantity) <= 0 || parseFloat(i.pricePerRate) <= 0
    );
    if (invalidItem) {
      toast.error("Each item must have Name, Qty > 0, Rate > 0");
      return;
    }

    const payload = {
      partyId: parseInt(form.partyId),
      orderNo: form.orderNo.trim(),
      orderDate: form.orderDate,
      phoneNo: form.phoneNo.trim(),
      dueDate: form.dueDate,
      totalDiscountAmount: form.totalDiscountAmount,
      totalQuantity: form.totalQuantity,
      totalTaxAmount: form.totalTaxAmount,
      totalAmount: form.totalAmount,
      balanceAmount: form.balanceAmount,
      advanceAmount: parseFloat(form.advanceAmount) || 0,
      paymentType: form.paymentType,
      stateOfSupply: form.stateOfSupply,
      description: form.description.trim() || null,
      saleOrderItemRequests: form.items.map((i) => ({
        itemId: i.itemId ? parseInt(i.itemId) : null,
        name: i.name.trim(),
        quantity: parseFloat(i.quantity),
        unit: i.unit,
        pricePerRate: parseFloat(i.pricePerRate),
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
        // UPDATE
        await axios.put(`${config.BASE_URL}/sale-order/${editId}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        toast.success("Sale Order updated!");
      } else {
        // CREATE
        await axios.post(`${config.BASE_URL}/company/${companyId}/create/sale-order`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        toast.success("Sale Order created!");
      }

      navigate("/sales_history");
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to ${editId ? "update" : "create"} order`);
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
          <p>Loading sale order...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className={styles["form-header"]}>
            <div>
              <h1 className={styles["company-form-title"]}>
                {isEditMode ? "Edit Sale Order" : "Create Sale Order"}
              </h1>
              <p className={styles["form-subtitle"]}>
                {isEditMode ? `Order #${form.orderNo}` : "Enter order details and items"}
              </p>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                type="button"
                onClick={() => navigate("/sales_history")}
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
                {loading ? "Saving..." : isEditMode ? "Update Order" : "Create Order"}
              </button>
            </div>
          </div>

          {/* Party & Order No */}
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
              <label>Order No <span className={styles.required}>*</span></label>
              <input
                type="text"
                value={form.orderNo}
                onChange={(e) => setForm({ ...form, orderNo: e.target.value })}
                required
                className={styles["form-input"]}
                placeholder="e.g. SO-001"
                disabled={!token || !companyId || loadingData}
              />
            </div>
          </div>

          {/* Dates */}
          <div className={styles["form-row"]}>
            <div className={styles["form-group"]}>
              <label>Order Date <span className={styles.required}>*</span></label>
              <input
                type="date"
                value={form.orderDate}
                onChange={(e) => setForm({ ...form, orderDate: e.target.value })}
                required
                className={styles["form-input"]}
                disabled={!token || !companyId || loadingData}
              />
            </div>
            <div className={styles["form-group"]}>
              <label>Due Date <span className={styles.required}>*</span></label>
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                required
                min={form.orderDate}
                className={styles["form-input"]}
                disabled={!token || !companyId || loadingData}
              />
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

          {/* State & Advance */}
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
              <label>Advance Amount</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.advanceAmount}
                onChange={(e) => {
                  setForm({ ...form, advanceAmount: e.target.value });
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
              <h4 style={{ margin: 0 }}>Items</h4>
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

            {form.items.map((item, index) => (
              <div key={index} style={{ border: "1px solid #ddd", borderRadius: "6px", padding: "16px", marginBottom: "16px", background: "#fafafa" }}>
                {/* Item Select */}
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

                {/* Quantity & Unit */}
                <div className={styles["form-row"]}>
                  <div className={styles["form-group"]}>
                    <label>Quantity <span className={styles.required}>*</span></label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                      required
                      className={styles["form-input"]}
                      disabled={!token || !companyId || loadingData}
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
                      value={item.pricePerRate}
                      onChange={(e) => handleItemChange(index, "pricePerRate", e.target.value)}
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
            ))}
          </div>

          {/* Final Totals */}
          <div className={styles["card-section"]} style={{ background: "#f0f7ff", padding: "16px", borderRadius: "8px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px", fontSize: "1rem" }}>
              <div><strong>Total Qty:</strong> {form.totalQuantity}</div>
              <div><strong>Discount:</strong> ₹{form.totalDiscountAmount.toFixed(2)}</div>
              <div><strong>Tax:</strong> ₹{form.totalTaxAmount.toFixed(2)}</div>
              <div><strong>Total:</strong> ₹{form.totalAmount.toFixed(2)}</div>
              <div><strong>Advance:</strong> ₹{(parseFloat(form.advanceAmount) || 0).toFixed(2)}</div>
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

export default CreateSaleOrder;