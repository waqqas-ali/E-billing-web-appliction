// import React, { useEffect, useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import axios from "axios";
// import config from "../../../config/apiconfig";
// import styles from "./Quotation.module.css"; // copy from Purchases.module.css
// import { toast } from "react-toastify";

// const CreateQuotation = () => {
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

//   // Enums
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
//     referenceNo: "",
//     invoiceDate: new Date().toISOString().split("T")[0],
//     stateOfSupply: "MAHARASHTRA",
//     description: "",
//     deliveryCharges: "0",
//     items: [
//       {
//         itemName: "",
//         itemHsnCode: "",
//         itemDescription: "",
//         quantity: "",
//         unit: "PIECES",
//         pricePerUnit: "",
//         pricePerUnitTaxType: "WITHTAX",
//         taxRate: "GST18",
//         totalTaxAmount: 0,
//         totalAmount: 0,
//       },
//     ],
//     totalTaxAmount: 0,
//     totalAmountWithoutTax: 0,
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

//   // Load Quotation for Edit
//   const fetchQuotation = async (quotationId) => {
//     if (!token) return;
//     setLoadingData(true);
//     try {
//       const res = await axios.get(`${config.BASE_URL}/quotation/${quotationId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const q = res.data;
//       setForm({
//         partyId: q.partyResponseDto?.partyId?.toString() || "",
//         referenceNo: q.referenceNo || "",
//         invoiceDate: q.invoiceDate || "",
//         stateOfSupply: q.stateOfSupply || "MAHARASHTRA",
//         description: q.description || "",
//         deliveryCharges: (q.deliveryCharges || 0).toString(),
//         items: q.quotationItemResponses?.map((it) => ({
//           itemName: it.itemName || "",
//           itemHsnCode: it.itemHsnCode || "",
//           itemDescription: it.itemDescription || "",
//           quantity: it.quantity?.toString() || "",
//           unit: it.unit || "PIECES",
//           pricePerUnit: it.pricePerUnit?.toString() || "",
//           pricePerUnitTaxType: it.pricePerUnitTaxType || "WITHTAX",
//           taxRate: it.taxRate || "GST18",
//           totalTaxAmount: it.totalTaxAmount || 0,
//           totalAmount: it.totalAmount || 0,
//         })) || [],
//         totalTaxAmount: q.totalTaxAmount || 0,
//         totalAmountWithoutTax: q.totalAmountWithoutTax || 0,
//         totalAmount: q.totalAmount || 0,
//       });
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to load quotation");
//     } finally {
//       setLoadingData(false);
//     }
//   };

//   useEffect(() => {
//     fetchParties();
//     fetchItems();

//     if (editId) {
//       fetchQuotation(editId);
//     }
//   }, [token, companyId, editId]);

//   // Calculate single item
//   const calculateItem = (item) => {
//     const qty = parseFloat(item.quantity) || 0;
//     const rate = parseFloat(item.pricePerUnit) || 0;
//     const taxRate = TAX_RATE_MAP[item.taxRate] || 0;
//     const withTax = item.pricePerUnitTaxType === "WITHTAX";

//     let subtotal = qty * rate;
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
//     const totalTax = calculated.reduce((s, i) => s + i.totalTaxAmount, 0);
//     const totalAmtWithoutTax = calculated.reduce((s, i) => s + (i.totalAmount - i.totalTaxAmount), 0);
//     const delivery = parseFloat(form.deliveryCharges) || 0;
//     const totalAmt = totalAmtWithoutTax + totalTax + delivery;

//     setForm((prev) => ({
//       ...prev,
//       items: calculated,
//       totalTaxAmount: parseFloat(totalTax.toFixed(2)),
//       totalAmountWithoutTax: parseFloat(totalAmtWithoutTax.toFixed(2)),
//       totalAmount: parseFloat(totalAmt.toFixed(2)),
//     }));
//   };

//   // Handle item change
//   const handleItemChange = (index, field, value) => {
//     const newItems = [...form.items];
//     newItems[index][field] = value;
//     recalculateTotals(newItems);
//   };

//   // Handle item select (auto-fill)
//   const handleItemSelect = (index, selectedItem) => {
//     if (!selectedItem) return;

//     const newItems = [...form.items];
//     newItems[index] = {
//       ...newItems[index],
//       itemName: selectedItem.itemName,
//       itemHsnCode: selectedItem.itemHsn,
//       itemDescription: selectedItem.itemDescription || "",
//       unit: selectedItem.baseUnit,
//       pricePerUnit: selectedItem.salePrice?.toString() || selectedItem.purchasePrice?.toString() || "",
//       pricePerUnitTaxType: selectedItem.saleTaxType || selectedItem.purchaseTaxType || "WITHTAX",
//       taxRate: selectedItem.taxRate || "GST18",
//       quantity: newItems[index].quantity || "1",
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
//           itemName: "",
//           itemHsnCode: "",
//           itemDescription: "",
//           quantity: "",
//           unit: "PIECES",
//           pricePerUnit: "",
//           pricePerUnitTaxType: "WITHTAX",
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

//     if (!form.partyId || !form.referenceNo || !form.invoiceDate) {
//       toast.error("Fill all required fields");
//       return;
//     }

//     const invalidItem = form.items.some(
//       (i) => !i.itemName || !i.quantity || !i.pricePerUnit || parseFloat(i.quantity) <= 0 || parseFloat(i.pricePerUnit) <= 0
//     );
//     if (invalidItem) {
//       toast.error("Each item must have Name, Qty > 0, Rate > 0");
//       return;
//     }

//     const payload = {
//       partyId: parseInt(form.partyId),
//       referenceNo: form.referenceNo.trim(),
//       invoiceDate: form.invoiceDate,
//       stateOfSupply: form.stateOfSupply,
//       description: form.description.trim() || null,
//       totalTaxAmount: form.totalTaxAmount,
//       totalAmountWithoutTax: form.totalAmountWithoutTax,
//       deliveryCharges: parseFloat(form.deliveryCharges) || 0,
//       totalAmount: form.totalAmount,
//       quotationItemRequests: form.items.map((i) => ({
//         itemName: i.itemName.trim(),
//         itemHsnCode: i.itemHsnCode,
//         itemDescription: i.itemDescription.trim() || null,
//         quantity: parseFloat(i.quantity),
//         unit: i.unit,
//         pricePerUnit: parseFloat(i.pricePerUnit),
//         pricePerUnitTaxType: i.pricePerUnitTaxType,
//         taxRate: i.taxRate,
//         totalTaxAmount: i.totalTaxAmount,
//         totalAmount: i.totalAmount,
//       })),
//     };

//     try {
//       setLoading(true);

//       if (editId) {
//         // UPDATE
//         await axios.put(`${config.BASE_URL}/quotation/${editId}`, payload, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         });
//         toast.success("Quotation updated!");
//       } else {
//         // CREATE
//         await axios.post(`${config.BASE_URL}/company/${companyId}/create-quotation`, payload, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         });
//         toast.success("Quotation created!");
//       }

//       navigate("/quotation");
//     } catch (err) {
//       toast.error(err.response?.data?.message || `Failed to ${editId ? "update" : "create"} quotation`);
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
//           <p>Loading quotation...</p>
//         </div>
//       ) : (
//         <form onSubmit={handleSubmit}>
//           {/* Header */}
//           <div className={styles["form-header"]}>
//             <div>
//               <h1 className={styles["company-form-title"]}>
//                 {isEditMode ? "Edit Quotation" : "Create Quotation"}
//               </h1>
//               <p className={styles["form-subtitle"]}>
//                 {isEditMode ? `Ref #${form.referenceNo}` : "Create a new quotation"}
//               </p>
//             </div>
//             <div style={{ display: "flex", gap: "8px" }}>
//               <button
//                 type="button"
//                 onClick={() => navigate("/quotation")}
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
//                 {loading ? "Saving..." : isEditMode ? "Update Quotation" : "Create Quotation"}
//               </button>
//             </div>
//           </div>

//           {/* Party & Ref No */}
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
//               <label>Reference No <span className={styles.required}>*</span></label>
//               <input
//                 type="text"
//                 value={form.referenceNo}
//                 onChange={(e) => setForm({ ...form, referenceNo: e.target.value })}
//                 required
//                 className={styles["form-input"]}
//                 placeholder="e.g. QTN-001"
//                 disabled={!token || !companyId || loadingData}
//               />
//             </div>
//           </div>

//           {/* Date & State */}
//           <div className={styles["form-row"]}>
//             <div className={styles["form-group"]}>
//               <label>Quotation Date <span className={styles.required}>*</span></label>
//               <input
//                 type="date"
//                 value={form.invoiceDate}
//                 onChange={(e) => setForm({ ...form, invoiceDate: e.target.value })}
//                 required
//                 className={styles["form-input"]}
//                 disabled={!token || !companyId || loadingData}
//               />
//             </div>
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
//           </div>

//           {/* Delivery Charges */}
//           <div className={styles["form-row"]}>
//             <div className={styles["form-group"]}>
//               <label>Delivery Charges</label>
//               <input
//                 type="number"
//                 step="0.01"
//                 min="0"
//                 value={form.deliveryCharges}
//                 onChange={(e) => {
//                   setForm({ ...form, deliveryCharges: e.target.value });
//                   recalculateTotals(form.items);
//                 }}
//                 className={styles["form-input"]}
//                 placeholder="0.00"
//                 disabled={!token || !companyId || loadingData}
//               />
//             </div>
//           </div>

//           {/* Description */}
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

//             {form.items.map((item, index) => {
//               const selectedItem = items.find(i => i.itemName === item.itemName);

//               return (
//                 <div key={index} style={{ border: "1px solid #ddd", borderRadius: "6px", padding: "16px", marginBottom: "16px", background: "#fafafa" }}>
//                   {/* Item Select */}
//                   <div className={styles["form-row"]}>
//                     <div className={styles["form-group"]}>
//                       <label>Item Name <span className={styles.required}>*</span></label>
//                       <select
//                         value={item.itemName}
//                         onChange={(e) => {
//                           const selected = items.find(i => i.itemName === e.target.value);
//                           handleItemSelect(index, selected);
//                         }}
//                         required
//                         className={styles["form-input"]}
//                         disabled={!token || !companyId || loadingItems || loadingData}
//                       >
//                         <option value="">-- Select Item --</option>
//                         {items.map((i) => (
//                           <option key={i.itemId} value={i.itemName}>
//                             {i.itemName} ({i.itemCode})
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                     <div className={styles["form-group"]}>
//                       <label>HSN</label>
//                       <input type="text" value={item.itemHsnCode} readOnly className={styles["form-input"]} />
//                     </div>
//                   </div>

//                   {/* Quantity & Unit */}
//                   <div className={styles["form-row"]}>
//                     <div className={styles["form-group"]}>
//                       <label>Quantity <span className={styles.required}>*</span></label>
//                       <input
//                         type="number"
//                         step="0.01"
//                         min="0.01"
//                         value={item.quantity}
//                         onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
//                         required
//                         className={styles["form-input"]}
//                         disabled={!token || !companyId || loadingData}
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
//                         value={item.pricePerUnit}
//                         onChange={(e) => handleItemChange(index, "pricePerUnit", e.target.value)}
//                         required
//                         className={styles["form-input"]}
//                         disabled={!token || !companyId || loadingData}
//                       />
//                     </div>
//                     <div className={styles["form-group"]}>
//                       <label>Tax Type</label>
//                       <input type="text" value={item.pricePerUnitTaxType} readOnly className={styles["form-input"]} />
//                     </div>
//                     <div className={styles["form-group"]}>
//                       <label>Tax Rate</label>
//                       <input type="text" value={item.taxRate} readOnly className={styles["form-input"]} />
//                     </div>
//                   </div>

//                   {/* Description & Totals */}
//                   <div className={styles["form-row"]}>
//                     <div className={styles["form-group"]}>
//                       <label>Description</label>
//                       <input
//                         type="text"
//                         value={item.itemDescription}
//                         onChange={(e) => handleItemChange(index, "itemDescription", e.target.value)}
//                         className={styles["form-input"]}
//                         placeholder="Optional"
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
//               <div><strong>Ex-Tax:</strong> ₹{form.totalAmountWithoutTax.toFixed(2)}</div>
//               <div><strong>Tax:</strong> ₹{form.totalTaxAmount.toFixed(2)}</div>
//               <div><strong>Delivery:</strong> ₹{(parseFloat(form.deliveryCharges) || 0).toFixed(2)}</div>
//               <div><strong>Total:</strong> ₹{form.totalAmount.toFixed(2)}</div>
//             </div>
//           </div>
//         </form>
//       )}
//     </div>
//   );
// };

// export default CreateQuotation;









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
//   Users,
//   Calendar,
//   MapPin,
//   FileText,
//   IndianRupee,
//   Loader,
//   Package,
//   FileCheck,
// } from "lucide-react"
import React, { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import axios from "axios"
import config from "../../../config/apiconfig"
import styles from "../Styles/Form.module.css"
import { toast } from "react-toastify"
import {
  Plus,
  Trash2,
  ArrowLeft,
  CheckCircle,
  Users,
  Calendar,
  MapPin,
  FileText,
  IndianRupee,
  Loader,
  Package,
  FileCheck,
} from "lucide-react"

const CreateQuotation = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const editId = queryParams.get("edit")

  const userData = JSON.parse(localStorage.getItem("eBilling")) || {}
  const token = userData?.accessToken || ""
  const companyId = userData?.selectedCompany?.id || ""

  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(false)
  const [parties, setParties] = useState([])
  const [items, setItems] = useState([])
  const [loadingItems, setLoadingItems] = useState(false)

  const states = [
    "ANDHRA_PRADESH", "ARUNACHAL_PRADESH", "ASSAM", "BIHAR", "CHHATTISGARH", "GOA", "GUJARAT", "HARYANA",
    "HIMACHAL_PRADESH", "JHARKHAND", "KARNATAKA", "KERALA", "MADHYA_PRADESH", "MAHARASHTRA", "MANIPUR",
    "MEGHALAYA", "MIZORAM", "NAGALAND", "ODISHA", "PUNJAB", "RAJASTHAN", "SIKKIM", "TAMIL_NADU", "TELANGANA",
    "TRIPURA", "UTTAR_PRADESH", "UTTARAKHAND", "WEST_BENGAL", "OTHER"
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
    referenceNo: "",
    invoiceDate: new Date().toISOString().split("T")[0],
    stateOfSupply: "MAHARASHTRA",
    description: "",
    deliveryCharges: "0",
    items: [
      {
        itemName: "",
        itemHsnCode: "",
        itemDescription: "",
        quantity: "",
        unit: "PIECES",
        pricePerUnit: "",
        pricePerUnitTaxType: "WITHTAX",
        taxRate: "GST18",
        totalTaxAmount: 0,
        totalAmount: 0,
      },
    ],
    totalTaxAmount: 0,
    totalAmountWithoutTax: 0,
    totalAmount: 0,
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

  const fetchQuotation = async (quotationId) => {
    if (!token) return
    setLoadingData(true)
    try {
      const res = await axios.get(`${config.BASE_URL}/quotation/${quotationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      const q = res.data
      setForm({
        partyId: q.partyResponseDto?.partyId?.toString() || "",
        referenceNo: q.referenceNo || "",
        invoiceDate: q.invoiceDate || "",
        stateOfSupply: q.stateOfSupply || "MAHARASHTRA",
        description: q.description || "",
        deliveryCharges: (q.deliveryCharges || 0).toString(),
        items: q.quotationItemResponses?.map((it) => ({
          itemName: it.itemName || "",
          itemHsnCode: it.itemHsnCode || "",
          itemDescription: it.itemDescription || "",
          quantity: it.quantity?.toString() || "",
          unit: it.unit || "PIECES",
          pricePerUnit: it.pricePerUnit?.toString() || "",
          pricePerUnitTaxType: it.pricePerUnitTaxType || "WITHTAX",
          taxRate: it.taxRate || "GST18",
          totalTaxAmount: it.totalTaxAmount || 0,
          totalAmount: it.totalAmount || 0,
        })) || [],
        totalTaxAmount: q.totalTaxAmount || 0,
        totalAmountWithoutTax: q.totalAmountWithoutTax || 0,
        totalAmount: q.totalAmount || 0,
      })
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load quotation")
    } finally {
      setLoadingData(false)
    }
  }

  useEffect(() => {
    fetchParties()
    fetchItems()
    if (editId) fetchQuotation(editId)
  }, [token, companyId, editId])

  /* ==================== CALCULATIONS ==================== */
  const calculateItem = (item) => {
    const qty = parseFloat(item.quantity) || 0
    const rate = parseFloat(item.pricePerUnit) || 0
    const taxRate = TAX_RATE_MAP[item.taxRate] || 0
    const withTax = item.pricePerUnitTaxType === "WITHTAX"

    let subtotal = qty * rate
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
    const totalTax = calculated.reduce((s, i) => s + i.totalTaxAmount, 0)
    const totalAmtWithoutTax = calculated.reduce((s, i) => s + (i.totalAmount - i.totalTaxAmount), 0)
    const delivery = parseFloat(form.deliveryCharges) || 0
    const totalAmt = totalAmtWithoutTax + totalTax + delivery

    setForm((prev) => ({
      ...prev,
      items: calculated,
      totalTaxAmount: parseFloat(totalTax.toFixed(2)),
      totalAmountWithoutTax: parseFloat(totalAmtWithoutTax.toFixed(2)),
      totalAmount: parseFloat(totalAmt.toFixed(2)),
    }))
  }

  /* ==================== ITEM HANDLING ==================== */
  const handleItemSelect = (index, selectedItem) => {
    if (!selectedItem) return

    const newItems = [...form.items]
    newItems[index] = {
      ...newItems[index],
      itemName: selectedItem.itemName,
      itemHsnCode: selectedItem.itemHsn || "",
      itemDescription: selectedItem.itemDescription || "",
      unit: selectedItem.baseUnit || "PIECES",
      pricePerUnit: selectedItem.salePrice?.toString() || selectedItem.purchasePrice?.toString() || "",
      pricePerUnitTaxType: selectedItem.saleTaxType || selectedItem.purchaseTaxType || "WITHTAX",
      taxRate: selectedItem.taxRate || "GST18",
      quantity: newItems[index].quantity || "1",
    }

    recalculateTotals(newItems)
  }

  const handleItemChange = (index, field, value) => {
    const newItems = [...form.items]
    newItems[index][field] = value
    recalculateTotals(newItems)
  }

  const addItem = () => {
    setForm((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          itemName: "",
          itemHsnCode: "",
          itemDescription: "",
          quantity: "",
          unit: "PIECES",
          pricePerUnit: "",
          pricePerUnitTaxType: "WITHTAX",
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

    if (!form.partyId || !form.referenceNo || !form.invoiceDate) {
      toast.error("Fill all required fields")
      return
    }

    const invalidItem = form.items.some(
      (i) => !i.itemName || !i.quantity || !i.pricePerUnit || parseFloat(i.quantity) <= 0 || parseFloat(i.pricePerUnit) <= 0
    )
    if (invalidItem) {
      toast.error("Each item must have Name, Qty > 0, Rate > 0")
      return
    }

    const payload = {
      partyId: parseInt(form.partyId),
      referenceNo: form.referenceNo.trim(),
      invoiceDate: form.invoiceDate,
      stateOfSupply: form.stateOfSupply,
      description: form.description.trim() || null,
      totalTaxAmount: form.totalTaxAmount,
      totalAmountWithoutTax: form.totalAmountWithoutTax,
      deliveryCharges: parseFloat(form.deliveryCharges) || 0,
      totalAmount: form.totalAmount,
      quotationItemRequests: form.items.map((i) => ({
        itemName: i.itemName.trim(),
        itemHsnCode: i.itemHsnCode,
        itemDescription: i.itemDescription.trim() || null,
        quantity: parseFloat(i.quantity),
        unit: i.unit,
        pricePerUnit: parseFloat(i.pricePerUnit),
        pricePerUnitTaxType: i.pricePerUnitTaxType,
        taxRate: i.taxRate,
        totalTaxAmount: i.totalTaxAmount,
        totalAmount: i.totalAmount,
      })),
    }

    try {
      setLoading(true)

      if (editId) {
        await axios.put(`${config.BASE_URL}/quotation/${editId}`, payload, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        })
        toast.success("Quotation updated!")
      } else {
        await axios.post(`${config.BASE_URL}/company/${companyId}/create-quotation`, payload, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        })
        toast.success("Quotation created!")
      }

      navigate("/quotation")
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to ${editId ? "update" : "create"} quotation`)
    } finally {
      setLoading(false)
    }
  }

  const isEditMode = !!editId

  return (
    <div className={styles.container}>
      {loadingData ? (
        <div className={styles.loadingContainer}>
          <Loader className={styles.spinnerIcon} />
          <p>Loading quotation...</p>
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
                      <FileCheck className={styles.titleIcon} />
                      Edit Quotation
                    </>
                  ) : (
                    <>
                      <FileText className={styles.titleIcon} />
                      Create Quotation
                    </>
                  )}
                </h1>
                <p className={styles.subtitle}>
                  {isEditMode ? `Ref #${form.referenceNo}` : "Create a new quotation"}
                </p>
              </div>
            </div>
            <div className={styles.headerActions}>
              <button
                type="button"
                onClick={() => navigate("/quotation")}
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
                    {isEditMode ? "Update Quotation" : "Create Quotation"}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Party & Reference */}
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>
              <Users size={20} />
              Party & Reference
            </h2>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="party" className={styles.label}>
                  Party <span className={styles.required}>*</span>
                </label>
                <select
                  id="party"
                  value={form.partyId}
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
                <label htmlFor="referenceNo" className={styles.label}>
                  Reference No <span className={styles.required}>*</span>
                </label>
                <input
                  id="referenceNo"
                  type="text"
                  value={form.referenceNo}
                  onChange={(e) => setForm({ ...form, referenceNo: e.target.value })}
                  required
                  className={styles.input}
                  placeholder="e.g. QTN-001"
                  disabled={!token || !companyId || loadingData}
                />
              </div>
            </div>
          </div>

          {/* Date & State */}
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>
              <Calendar size={20} />
              Date & Location
            </h2>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="invoiceDate" className={styles.label}>
                  Quotation Date <span className={styles.required}>*</span>
                </label>
                <input
                  id="invoiceDate"
                  type="date"
                  value={form.invoiceDate}
                  onChange={(e) => setForm({ ...form, invoiceDate: e.target.value })}
                  required
                  className={styles.input}
                  disabled={!token || !companyId || loadingData}
                />
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
            </div>
          </div>

          {/* Delivery Charges */}
          {/* <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>
              <Truck size={20} />
              Delivery Charges
            </h2>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="deliveryCharges" className={styles.label}>
                  Delivery Charges
                </label>
                <div className={styles.inputIcon}>
                  <IndianRupee size={18} />
                  <input
                    id="deliveryCharges"
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.deliveryCharges}
                    onChange={(e) => {
                      setForm({ ...form, deliveryCharges: e.target.value })
                      recalculateTotals(form.items)
                    }}
                    className={styles.input}
                    placeholder="0.00"
                    disabled={!token || !companyId || loadingData}
                  />
                </div>
              </div>
            </div>
          </div> */}
          {/* Delivery Charges */}
<div className={styles.formSection}>
  <h2 className={styles.sectionTitle}>
    <Package size={20} />
    Delivery Charges
  </h2>
  <div className={styles.formGrid}>
    <div className={styles.formGroup}>
      <label htmlFor="deliveryCharges" className={styles.label}>
        Delivery Charges
      </label>
      <div className={styles.inputIcon}>
        <IndianRupee size={18} />
        <input
          id="deliveryCharges"
          type="number"
          step="0.01"
          min="0"
          value={form.deliveryCharges}
          onChange={(e) => {
            setForm({ ...form, deliveryCharges: e.target.value })
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
            <div className={styles.formGroup}>
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
              {form.items.map((item, index) => {
                const selectedItem = items.find(i => i.itemName === item.itemName)

                return (
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
                          value={item.itemName}
                          onChange={(e) => {
                            const selected = items.find(i => i.itemName === e.target.value)
                            handleItemSelect(index, selected)
                          }}
                          required
                          className={styles.input}
                          disabled={!token || !companyId || loadingItems || loadingData}
                        >
                          <option value="">-- Select Item --</option>
                          {items.map((i) => (
                            <option key={i.itemId} value={i.itemName}>
                              {i.itemName} ({i.itemCode || "—"})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className={styles.formGroup}>
                        <label className={styles.label}>HSN</label>
                        <input
                          type="text"
                          value={item.itemHsnCode}
                          readOnly
                          className={`${styles.input} ${styles.inputReadonly}`}
                        />
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
                          placeholder="Enter qty"
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
                          value={item.pricePerUnit}
                          onChange={(e) => handleItemChange(index, "pricePerUnit", e.target.value)}
                          required
                          className={styles.input}
                          disabled={!token || !companyId || loadingData}
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label className={styles.label}>Tax Type</label>
                        <input
                          type="text"
                          value={item.pricePerUnitTaxType}
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

                    {/* Description & Totals */}
                    <div className={styles.itemGrid}>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>Description</label>
                        <input
                          type="text"
                          value={item.itemDescription}
                          onChange={(e) => handleItemChange(index, "itemDescription", e.target.value)}
                          className={styles.input}
                          placeholder="Optional"
                          disabled={!token || !companyId || loadingData}
                        />
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
                )
              })}
            </div>
          </div>

          {/* Summary */}
          <div className={styles.summarySection}>
            <h2 className={styles.sectionTitle}>Quotation Summary</h2>
            <div className={styles.summaryGrid}>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Ex-Tax Amount</span>
                <span className={styles.summaryValue}>
                  <IndianRupee size={14} />
                  {form.totalAmountWithoutTax.toFixed(2)}
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
                <span className={styles.summaryLabel}>Delivery Charges</span>
                <span className={styles.summaryValue}>
                  <IndianRupee size={14} />
                  {(parseFloat(form.deliveryCharges) || 0).toFixed(2)}
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
      )}
    </div>
  )
}

export default CreateQuotation