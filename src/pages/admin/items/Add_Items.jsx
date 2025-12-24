// import { useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import axios from "axios";
// import config from "../../../config/apiconfig";
// import styles from "./Item.module.css";
// import { toast } from "react-toastify";

// const Add_Items = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { item = {}, companyId, token, categories = [], itemType } = location.state || {};

//   // Unified form state
//   const [formData, setFormData] = useState({
//     itemName: item.itemName || "",
//     itemHsn: item.itemHsn || "",
//     itemCode: item.itemCode || "",
//     description: item.description || "",
//     itemType: item.itemType || itemType || "PRODUCT",
//     baseUnit: item.baseUnit || "",
//     secondaryUnit: item.secondaryUnit || "",
//     baseUnitToSecondaryUnit: item.baseUnitToSecondaryUnit || "",
//     categoryIds: item.categories?.map((cat) => cat.categoryId) || [],
//     salePrice: item.salePrice || "",
//     saleTaxType: item.saleTaxType || "",
//     purchasePrice: item.purchasePrice || "",
//     purchaseTaxType: item.purchaseTaxType || "",
//     taxRate: item.taxRate || "",
//     stockOpeningQty: item.stockOpeningQty || "",
//     stockPrice: item.stockPrice || "",
//     stockOpeningDate: item.stockOpeningDate || "",
//     minimumStockToMaintain: item.minimumStockToMaintain || "",
//     openingStockLocation: item.openingStockLocation || "",
//     saleDiscountPrice: item.saleDiscountPrice || "",
//     saleDiscountType: item.saleDiscountType || "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const units = [
//     "CARTONS", "KILOGRAMS", "QUINTAL", "BOTTLES", "PIECES", "ROLLS",
//     "NUMBERS", "PAIRS", "TABLETS", "MILLITRE", "BUNDLES", "BOX",
//     "SQUARE_METERS", "BAGS", "CANS", "SQUARE_FEET",
//   ];
//   const taxTypes = ["WITHTAX", "WITHOUTTAX"];
//   const taxRates = [
//     "NONE", "EXEMPTED", "GST0", "IGST0", "GST0POINT25", "IGST0POINT25",
//     "GST3", "IGST3", "GST5", "IGST5", "GST12", "IGST12", "GST18",
//     "IGST18", "GST28", "IGST28",
//   ];
//   const discountTypes = ["PERCENTAGE", "AMOUNT"];

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleCategoryChange = (categoryId) => {
//     setFormData((prev) => ({
//       ...prev,
//       categoryIds: prev.categoryIds.includes(categoryId)
//         ? prev.categoryIds.filter((id) => id !== categoryId)
//         : [...prev.categoryIds, categoryId],
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     const payload = {
//       itemName: formData.itemName,
//       itemHsn: formData.itemHsn,
//       itemCode: formData.itemCode,
//       description: formData.description,
//       itemType: formData.itemType,
//       baseUnit: formData.baseUnit,
//       secondaryUnit: formData.secondaryUnit,
//       baseUnitToSecondaryUnit: parseFloat(formData.baseUnitToSecondaryUnit) || 0,
//       categoryIds: formData.categoryIds.map(Number),
//       salePrice: parseFloat(formData.salePrice) || 0,
//       saleTaxType: formData.saleTaxType,
//       taxRate: formData.taxRate,
//       saleDiscountPrice: parseFloat(formData.saleDiscountPrice) || 0,
//       saleDiscountType: formData.saleDiscountType,
//       ...(formData.itemType === "PRODUCT" && {
//         purchasePrice: parseFloat(formData.purchasePrice) || 0,
//         purchaseTaxType: formData.purchaseTaxType,
//         stockOpeningQty: parseFloat(formData.stockOpeningQty) || 0,
//         stockPrice: parseFloat(formData.stockPrice) || 0,
//         stockOpeningDate: formData.stockOpeningDate,
//         minimumStockToMaintain: parseFloat(formData.minimumStockToMaintain) || 0,
//         openingStockLocation: formData.openingStockLocation,
//       }),
//     };

//     try {
//       if (item.itemId) {
//         await axios.put(`${config.BASE_URL}/item/${item.itemId}`, payload, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         });
//         toast.success("Item updated successfully");
//       } else {
//         const endpoint =
//           formData.itemType === "PRODUCT"
//             ? `${config.BASE_URL}/company/${companyId}/create/product-item`
//             : `${config.BASE_URL}/company/${companyId}/create/service-item`;
//         await axios.post(endpoint, payload, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         });
//         toast.success("Item created successfully");
//       }
//       navigate("/items");
//     } catch (error) {
//       console.error("Error saving item:", error);
//       setError(error.response?.data?.message || "Failed to save item.");
//       toast.error("Failed to save item. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className={styles["company-form-container"]}>
//       <div className={styles["form-header"]}>
//         <div>
//           <h1 className={styles["company-form-title"]}>
//             {item.itemId ? "Edit Item" : "Add Item"}
//           </h1>
//           <p className={styles["form-subtitle"]}>
//             {item.itemId ? "Update item details" : "Add a new product or service"}
//           </p>
//         </div>
//         <button
//           onClick={() => navigate("/items")}
//           className={styles["cancel-button"]}
//           disabled={loading}
//         >
//           <i className="fas fa-times"></i> Close
//         </button>
//       </div>

//       {loading && (
//         <div className={styles["loading-message"]}>
//           <div className={styles.spinner}></div>
//           <p>{item.itemId ? "Updating..." : "Creating..."}</p>
//         </div>
//       )}
//       {error && <div className={styles["error-message"]}>{error}</div>}

//       <form onSubmit={handleSubmit} className={styles["company-form"]}>
//         <div className={styles["form-section"]}>
//           <h2 className={styles["section-title"]}>Basic Information</h2>
//           <div className={styles["form-row"]}>
//             <div className={styles["form-group"]}>
//               <label htmlFor="itemType">
//                 Item Type <span className={styles.required}>*</span>
//               </label>
//               <select
//                 name="itemType"
//                 id="itemType"
//                 value={formData.itemType}
//                 onChange={handleInputChange}
//                 className={`${styles["form-input"]} ${styles.select}`}
//                 required
//                 disabled={item.itemId || loading}
//               >
//                 <option value="PRODUCT">Product</option>
//                 <option value="SERVICE">Service</option>
//               </select>
//             </div>
//             <div className={styles["form-group"]}>
//               <label htmlFor="itemName">
//                 Item Name <span className={styles.required}>*</span>
//               </label>
//               <input
//                 type="text"
//                 id="itemName"
//                 name="itemName"
//                 value={formData.itemName}
//                 onChange={handleInputChange}
//                 className={styles["form-input"]}
//                 required
//                 disabled={loading}
//               />
//             </div>
//           </div>
//           <div className={styles["form-row"]}>
//             <div className={styles["form-group"]}>
//               <label htmlFor="itemHsn">Item HSN</label>
//               <input
//                 type="text"
//                 id="itemHsn"
//                 name="itemHsn"
//                 value={formData.itemHsn}
//                 onChange={handleInputChange}
//                 className={styles["form-input"]}
//                 disabled={loading}
//               />
//             </div>
//             <div className={styles["form-group"]}>
//               <label htmlFor="itemCode">Item Code</label>
//               <input
//                 type="text"
//                 id="itemCode"
//                 name="itemCode"
//                 value={formData.itemCode}
//                 onChange={handleInputChange}
//                 className={styles["form-input"]}
//                 disabled={loading}
//               />
//             </div>
//           </div>
//           <div className={styles["form-group"]}>
//             <label htmlFor="description">Description</label>
//             <textarea
//               id="description"
//               name="description"
//               value={formData.description}
//               onChange={handleInputChange}
//               className={`${styles["form-input"]} ${styles.textarea}`}
//               disabled={loading}
//             />
//           </div>
//           <div className={styles["form-group"]}>
//             <label>Categories</label>
//             <div className={styles["checkbox-container"]}>
//               {categories.length > 0 ? (
//                 categories.map((cat) => (
//                   <div key={cat.categoryId} className={styles["checkbox-item"]}>
//                     <input
//                       type="checkbox"
//                       id={`category-${cat.categoryId}`}
//                       value={cat.categoryId}
//                       checked={formData.categoryIds.includes(cat.categoryId)}
//                       onChange={() => handleCategoryChange(cat.categoryId)}
//                       disabled={loading}
//                     />
//                     <label htmlFor={`category-${cat.categoryId}`}>
//                       {cat.categoryName}
//                     </label>
//                   </div>
//                 ))
//               ) : (
//                 <p className={styles["no-data"]}>No categories available</p>
//               )}
//             </div>
//           </div>
//         </div>

//         <div className={styles["form-section"]}>
//           <h2 className={styles["section-title"]}>Unit Details</h2>
//           <div className={styles["form-row"]}>
//             <div className={styles["form-group"]}>
//               <label htmlFor="baseUnit">
//                 Base Unit <span className={styles.required}>*</span>
//               </label>
//               <select
//                 id="baseUnit"
//                 name="baseUnit"
//                 value={formData.baseUnit}
//                 onChange={handleInputChange}
//                 className={`${styles["form-input"]} ${styles.select}`}
//                 required
//                 disabled={loading}
//               >
//                 <option value="">Select Base Unit</option>
//                 {units.map((u) => (
//                   <option key={u} value={u}>
//                     {u
//                       .replace(/_/g, " ")
//                       .toLowerCase()
//                       .replace(/\b\w/g, (c) => c.toUpperCase())}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className={styles["form-group"]}>
//               <label htmlFor="secondaryUnit">Secondary Unit</label>
//               <select
//                 id="secondaryUnit"
//                 name="secondaryUnit"
//                 value={formData.secondaryUnit}
//                 onChange={handleInputChange}
//                 className={`${styles["form-input"]} ${styles.select}`}
//                 disabled={loading}
//               >
//                 <option value="">Select Secondary Unit</option>
//                 {units.map((u) => (
//                   <option key={u} value={u}>
//                     {u
//                       .replace(/_/g, " ")
//                       .toLowerCase()
//                       .replace(/\b\w/g, (c) => c.toUpperCase())}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//           <div className={styles["form-group"]}>
//             <label htmlFor="baseUnitToSecondaryUnit">Base Unit to Secondary Unit</label>
//             <input
//               type="number"
//               id="baseUnitToSecondaryUnit"
//               name="baseUnitToSecondaryUnit"
//               value={formData.baseUnitToSecondaryUnit}
//               onChange={handleInputChange}
//               className={styles["form-input"]}
//               min="0"
//               step="0.01"
//               disabled={loading}
//             />
//           </div>
//         </div>

//         <div className={styles["form-section"]}>
//           <h2 className={styles["section-title"]}>Pricing & Tax</h2>
//           <div className={styles["form-row"]}>
//             <div className={styles["form-group"]}>
//               <label htmlFor="salePrice">
//                 Sale Price <span className={styles.required}>*</span>
//               </label>
//               <input
//                 type="number"
//                 id="salePrice"
//                 name="salePrice"
//                 value={formData.salePrice}
//                 onChange={handleInputChange}
//                 className={styles["form-input"]}
//                 min="0"
//                 step="0.01"
//                 required
//                 disabled={loading}
//               />
//             </div>
//             <div className={styles["form-group"]}>
//               <label htmlFor="saleTaxType">
//                 Sale Tax Type <span className={styles.required}>*</span>
//               </label>
//               <select
//                 id="saleTaxType"
//                 name="saleTaxType"
//                 value={formData.saleTaxType}
//                 onChange={handleInputChange}
//                 className={`${styles["form-input"]} ${styles.select}`}
//                 required
//                 disabled={loading}
//               >
//                 <option value="">Select Sale Tax Type</option>
//                 {taxTypes.map((t) => (
//                   <option key={t} value={t}>
//                     {t
//                       .replace(/_/g, " ")
//                       .toLowerCase()
//                       .replace(/\b\w/g, (c) => c.toUpperCase())}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//           <div className={styles["form-row"]}>
//             <div className={styles["form-group"]}>
//               <label htmlFor="taxRate">
//                 Tax Rate <span className={styles.required}>*</span>
//               </label>
//               <select
//                 id="taxRate"
//                 name="taxRate"
//                 value={formData.taxRate}
//                 onChange={handleInputChange}
//                 className={`${styles["form-input"]} ${styles.select}`}
//                 required
//                 disabled={loading}
//               >
//                 <option value="">Select Tax Rate</option>
//                 {taxRates.map((t) => (
//                   <option key={t} value={t}>
//                     {t
//                       .replace(/_/g, " ")
//                       .toLowerCase()
//                       .replace(/\b\w/g, (c) => c.toUpperCase())}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className={styles["form-group"]}>
//               <label htmlFor="saleDiscountPrice">Sale Discount Price</label>
//               <input
//                 type="number"
//                 id="saleDiscountPrice"
//                 name="saleDiscountPrice"
//                 value={formData.saleDiscountPrice}
//                 onChange={handleInputChange}
//                 className={styles["form-input"]}
//                 min="0"
//                 step="0.01"
//                 disabled={loading}
//               />
//             </div>
//           </div>
//           <div className={styles["form-group"]}>
//             <label htmlFor="saleDiscountType">Sale Discount Type</label>
//             <select
//               id="saleDiscountType"
//               name="saleDiscountType"
//               value={formData.saleDiscountType}
//               onChange={handleInputChange}
//               className={`${styles["form-input"]} ${styles.select}`}
//               disabled={loading}
//             >
//               <option value="">Select Discount Type</option>
//               {discountTypes.map((d) => (
//                 <option key={d} value={d}>
//                   {d
//                     .replace(/_/g, " ")
//                     .toLowerCase()
//                     .replace(/\b\w/g, (c) => c.toUpperCase())}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {formData.itemType === "PRODUCT" && (
//           <div className={styles["form-section"]}>
//             <h2 className={styles["section-title"]}>Product Details</h2>
//             <div className={styles["form-row"]}>
//               <div className={styles["form-group"]}>
//                 <label htmlFor="purchasePrice">
//                   Purchase Price <span className={styles.required}>*</span>
//                 </label>
//                 <input
//                   type="number"
//                   id="purchasePrice"
//                   name="purchasePrice"
//                   value={formData.purchasePrice}
//                   onChange={handleInputChange}
//                   className={styles["form-input"]}
//                   min="0"
//                   step="0.01"
//                   required
//                   disabled={loading}
//                 />
//               </div>
//               <div className={styles["form-group"]}>
//                 <label htmlFor="purchaseTaxType">
//                   Purchase Tax Type <span className={styles.required}>*</span>
//                 </label>
//                 <select
//                   id="purchaseTaxType"
//                   name="purchaseTaxType"
//                   value={formData.purchaseTaxType}
//                   onChange={handleInputChange}
//                   className={`${styles["form-input"]} ${styles.select}`}
//                   required
//                   disabled={loading}
//                 >
//                   <option value="">Select Purchase Tax Type</option>
//                   {taxTypes.map((t) => (
//                     <option key={t} value={t}>
//                       {t
//                         .replace(/_/g, " ")
//                         .toLowerCase()
//                         .replace(/\b\w/g, (c) => c.toUpperCase())}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//             <div className={styles["form-row"]}>
//               <div className={styles["form-group"]}>
//                 <label htmlFor="stockOpeningQty">Stock Opening Quantity</label>
//                 <input
//                   type="number"
//                   id="stockOpeningQty"
//                   name="stockOpeningQty"
//                   value={formData.stockOpeningQty}
//                   onChange={handleInputChange}
//                   className={styles["form-input"]}
//                   min="0"
//                   step="0.01"
//                   disabled={loading}
//                 />
//               </div>
//               <div className={styles["form-group"]}>
//                 <label htmlFor="stockPrice">Stock Price</label>
//                 <input
//                   type="number"
//                   id="stockPrice"
//                   name="stockPrice"
//                   value={formData.stockPrice}
//                   onChange={handleInputChange}
//                   className={styles["form-input"]}
//                   min="0"
//                   step="0.01"
//                   disabled={loading}
//                 />
//               </div>
//             </div>
//             <div className={styles["form-row"]}>
//               <div className={styles["form-group"]}>
//                 <label htmlFor="stockOpeningDate">Stock Opening Date</label>
//                 <input
//                   type="date"
//                   id="stockOpeningDate"
//                   name="stockOpeningDate"
//                   value={formData.stockOpeningDate}
//                   onChange={handleInputChange}
//                   className={styles["form-input"]}
//                   disabled={loading}
//                 />
//               </div>
//               <div className={styles["form-group"]}>
//                 <label htmlFor="minimumStockToMaintain">Minimum Stock to Maintain</label>
//                 <input
//                   type="number"
//                   id="minimumStockToMaintain"
//                   name="minimumStockToMaintain"
//                   value={formData.minimumStockToMaintain}
//                   onChange={handleInputChange}
//                   className={styles["form-input"]}
//                   min="0"
//                   step="0.01"
//                   disabled={loading}
//                 />
//               </div>
//             </div>
//             <div className={styles["form-group"]}>
//               <label htmlFor="openingStockLocation">Opening Stock Location</label>
//               <input
//                 type="text"
//                 id="openingStockLocation"
//                 name="openingStockLocation"
//                 value={formData.openingStockLocation}
//                 onChange={handleInputChange}
//                 className={styles["form-input"]}
//                 disabled={loading}
//               />
//             </div>
//           </div>
//         )}

//         <div className={styles["form-actions"]}>
//           <button
//             type="submit"
//             className={styles["submit-button"]}
//             disabled={loading}
//           >
//             {loading
//               ? item.itemId
//                 ? "Updating..."
//                 : "Creating..."
//               : item.itemId
//                 ? "Update Item"
//                 : "Create Item"}
//           </button>
//           <button
//             type="button"
//             className={styles["cancel-button"]}
//             onClick={() => navigate("/items")}
//             disabled={loading}
//           >
//             Cancel
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default Add_Items;








// "use client"

// import { useState } from "react"
// import { useNavigate, useLocation } from "react-router-dom"
// import axios from "axios"
// import config from "../../../config/apiconfig"
// import styles from "../Styles/Form.module.css"
// import { toast } from "react-toastify"
// import {
//   ArrowLeft,
//   CheckCircle,
//   Package,
//   Tag,
//   Hash,
//   FileText,
//   ShoppingCart,
//   DollarSign,
//   Percent,
//   Calendar,
//   MapPin,
//   Loader,
//   AlertCircle,
//   Box,
//   Layers,
//   IndianRupee, // Now imported
// } from "lucide-react"

// const Add_Items = () => {
//   const navigate = useNavigate()
//   const location = useLocation()
//   const { item = {}, companyId, token, categories = [], itemType } = location.state || {}

//   const [formData, setFormData] = useState({
//     itemName: item.itemName || "",
//     itemHsn: item.itemHsn || "",
//     itemCode: item.itemCode || "",
//     description: item.description || "",
//     itemType: item.itemType || itemType || "PRODUCT",
//     baseUnit: item.baseUnit || "",
//     secondaryUnit: item.secondaryUnit || "",
//     baseUnitToSecondaryUnit: item.baseUnitToSecondaryUnit || "",
//     categoryIds: item.categories?.map((cat) => cat.categoryId) || [],
//     salePrice: item.salePrice || "",
//     saleTaxType: item.saleTaxType || "",
//     purchasePrice: item.purchasePrice || "",
//     purchaseTaxType: item.purchaseTaxType || "",
//     taxRate: item.taxRate || "",
//     stockOpeningQty: item.stockOpeningQty || "",
//     stockPrice: item.stockPrice || "",
//     stockOpeningDate: item.stockOpeningDate || "",
//     minimumStockToMaintain: item.minimumStockToMaintain || "",
//     openingStockLocation: item.openingStockLocation || "",
//     saleDiscountPrice: item.saleDiscountPrice || "",
//     saleDiscountType: item.saleDiscountType || "",
//   })

//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState(null)

//   const units = [
//     "CARTONS", "KILOGRAMS", "QUINTAL", "BOTTLES", "PIECES", "ROLLS",
//     "NUMBERS", "PAIRS", "TABLETS", "MILLITRE", "BUNDLES", "BOX",
//     "SQUARE_METERS", "BAGS", "CANS", "SQUARE_FEET",
//   ]
//   const taxTypes = ["WITHTAX", "WITHOUTTAX"]
//   const taxRates = [
//     "NONE", "EXEMPTED", "GST0", "IGST0", "GST0POINT25", "IGST0POINT25",
//     "GST3", "IGST3", "GST5", "IGST5", "GST12", "IGST12", "GST18",
//     "IGST18", "GST28", "IGST28",
//   ]
//   const discountTypes = ["PERCENTAGE", "AMOUNT"]

//   const handleInputChange = (e) => {
//     const { name, value } = e.target
//     setFormData((prev) => ({ ...prev, [name]: value }))
//   }

//   const handleCategoryChange = (categoryId) => {
//     setFormData((prev) => ({
//       ...prev,
//       categoryIds: prev.categoryIds.includes(categoryId)
//         ? prev.categoryIds.filter((id) => id !== categoryId)
//         : [...prev.categoryIds, categoryId],
//     }))
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setLoading(true)
//     setError(null)

//     const payload = {
//       itemName: formData.itemName,
//       itemHsn: formData.itemHsn,
//       itemCode: formData.itemCode,
//       description: formData.description,
//       itemType: formData.itemType,
//       baseUnit: formData.baseUnit,
//       secondaryUnit: formData.secondaryUnit,
//       baseUnitToSecondaryUnit: parseFloat(formData.baseUnitToSecondaryUnit) || 0,
//       categoryIds: formData.categoryIds.map(Number),
//       salePrice: parseFloat(formData.salePrice) || 0,
//       saleTaxType: formData.saleTaxType,
//       taxRate: formData.taxRate,
//       saleDiscountPrice: parseFloat(formData.saleDiscountPrice) || 0,
//       saleDiscountType: formData.saleDiscountType,
//       ...(formData.itemType === "PRODUCT" && {
//         purchasePrice: parseFloat(formData.purchasePrice) || 0,
//         purchaseTaxType: formData.purchaseTaxType,
//         stockOpeningQty: parseFloat(formData.stockOpeningQty) || 0,
//         stockPrice: parseFloat(formData.stockPrice) || 0,
//         stockOpeningDate: formData.stockOpeningDate,
//         minimumStockToMaintain: parseFloat(formData.minimumStockToMaintain) || 0,
//         openingStockLocation: formData.openingStockLocation,
//       }),
//     }

//     try {
//       if (item.itemId) {
//         await axios.put(`${config.BASE_URL}/item/${item.itemId}`, payload, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         })
//         toast.success("Item updated successfully")
//       } else {
//         const endpoint =
//           formData.itemType === "PRODUCT"
//             ? `${config.BASE_URL}/company/${companyId}/create/product-item`
//             : `${config.BASE_URL}/company/${companyId}/create/service-item`
//         await axios.post(endpoint, payload, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         })
//         toast.success("Item created successfully")
//       }
//       navigate("/items")
//     } catch (error) {
//       console.error("Error saving item:", error)
//       setError(error.response?.data?.message || "Failed to save item.")
//       toast.error("Failed to save item. Please try again.")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const isEditMode = !!item.itemId

//   return (
//     <div className={styles.container}>
//       <form onSubmit={handleSubmit} className={styles.form}>
//         {/* Header */}
//         <div className={styles.header}>
//           <div className={styles.headerContent}>
//             <div className={styles.titleSection}>
//               <h1 className={styles.title}>
//                 {isEditMode ? (
//                   <>
//                     <CheckCircle className={styles.titleIcon} />
//                     Edit Item
//                   </>
//                 ) : (
//                   <>
//                     <Package className={styles.titleIcon} />
//                     Add Item
//                   </>
//                 )}
//               </h1>
//               <p className={styles.subtitle}>
//                 {isEditMode ? "Update item details" : "Add a new product or service"}
//               </p>
//             </div>
//           </div>
//           <div className={styles.headerActions}>
//             <button
//               type="button"
//               onClick={() => navigate("/items")}
//               className={styles.buttonSecondary}
//               disabled={loading}
//             >
//               <ArrowLeft size={18} />
//               Back
//             </button>
//             <button
//               type="submit"
//               className={styles.buttonPrimary}
//               disabled={loading || !token || !companyId}
//             >
//               {loading ? (
//                 <>
//                   <Loader size={18} className={styles.spinnerSmall} />
//                   Saving...
//                 </>
//               ) : (
//                 <>
//                   <CheckCircle size={18} />
//                   {isEditMode ? "Update Item" : "Create Item"}
//                 </>
//               )}
//             </button>
//           </div>
//         </div>

//         {/* Error Alert */}
//         {error && (
//           <div className={styles.error}>
//             <AlertCircle size={18} />
//             {error}
//           </div>
//         )}

//         {/* Basic Information */}
//         <div className={styles.formSection}>
//           <h2 className={styles.sectionTitle}>
//             <FileText size={20} />
//             Basic Information
//           </h2>
//           <div className={styles.formGrid}>
//             <div className={styles.formGroup}>
//               <label htmlFor="itemType" className={styles.label}>
//                 Item Type <span className={styles.required}>*</span>
//               </label>
//               <select
//                 id="itemType"
//                 name="itemType"
//                 value={formData.itemType}
//                 onChange={handleInputChange}
//                 className={styles.input}
//                 required
//                 disabled={isEditMode || loading}
//               >
//                 <option value="PRODUCT">Product</option>
//                 <option value="SERVICE">Service</option>
//               </select>
//             </div>

//             <div className={styles.formGroup}>
//               <label htmlFor="itemName" className={styles.label}>
//                 Item Name <span className={styles.required}>*</span>
//               </label>
//               <div className={styles.inputIcon}>
//                 <Tag size={18} />
//                 <input
//                   id="itemName"
//                   name="itemName"
//                   type="text"
//                   value={formData.itemName}
//                   onChange={handleInputChange}
//                   className={styles.input}
//                   required
//                   disabled={loading}
//                 />
//               </div>
//             </div>
//           </div>

//           <div className={styles.formGrid}>
//             <div className={styles.formGroup}>
//               <label htmlFor="itemHsn" className={styles.label}>HSN</label>
//               <div className={styles.inputIcon}>
//                 <Hash size={18} />
//                 <input
//                   id="itemHsn"
//                   name="itemHsn"
//                   type="text"
//                   value={formData.itemHsn}
//                   onChange={handleInputChange}
//                   className={styles.input}
//                   disabled={loading}
//                 />
//               </div>
//             </div>

//             <div className={styles.formGroup}>
//               <label htmlFor="itemCode" className={styles.label}>Item Code</label>
//               <div className={styles.inputIcon}>
//                 <Box size={18} />
//                 <input
//                   id="itemCode"
//                   name="itemCode"
//                   type="text"
//                   value={formData.itemCode}
//                   onChange={handleInputChange}
//                   className={styles.input}
//                   disabled={loading}
//                 />
//               </div>
//             </div>
//           </div>

//           <div className={styles.formGroup}>
//             <label htmlFor="description" className={styles.label}>Description</label>
//             <textarea
//               id="description"
//               name="description"
//               value={formData.description}
//               onChange={handleInputChange}
//               className={`${styles.input} ${styles.textarea}`}
//               placeholder="Optional description..."
//               rows={3}
//               disabled={loading}
//             />
//           </div>

//           <div className={styles.formGroup}>
//             <label className={styles.label}>Categories</label>
//             <div className={styles.checkboxContainer}>
//               {categories.length > 0 ? (
//                 categories.map((cat) => (
//                   <label key={cat.categoryId} className={styles.checkboxLabel}>
//                     <input
//                       type="checkbox"
//                       checked={formData.categoryIds.includes(cat.categoryId)}
//                       onChange={() => handleCategoryChange(cat.categoryId)}
//                       disabled={loading}
//                     />
//                     <span className={styles.checkboxText}>{cat.categoryName}</span>
//                   </label>
//                 ))
//               ) : (
//                 <p className={styles.noDataText}>No categories available</p>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Unit Details */}
//         <div className={styles.formSection}>
//           <h2 className={styles.sectionTitle}>
//             <Layers size={20} />
//             Unit Details
//           </h2>
//           <div className={styles.formGrid}>
//             <div className={styles.formGroup}>
//               <label htmlFor="baseUnit" className={styles.label}>
//                 Base Unit <span className={styles.required}>*</span>
//               </label>
//               <select
//                 id="baseUnit"
//                 name="baseUnit"
//                 value={formData.baseUnit}
//                 onChange={handleInputChange}
//                 className={styles.input}
//                 required
//                 disabled={loading}
//               >
//                 <option value="">Select Base Unit</option>
//                 {units.map((u) => (
//                   <option key={u} value={u}>
//                     {u.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className={styles.formGroup}>
//               <label htmlFor="secondaryUnit" className={styles.label}>Secondary Unit</label>
//               <select
//                 id="secondaryUnit"
//                 name="secondaryUnit"
//                 value={formData.secondaryUnit}
//                 onChange={handleInputChange}
//                 className={styles.input}
//                 disabled={loading}
//               >
//                 <option value="">Select Secondary Unit</option>
//                 {units.map((u) => (
//                   <option key={u} value={u}>
//                     {u.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           <div className={styles.formGroup}>
//             <label htmlFor="baseUnitToSecondaryUnit" className={styles.label}>
//               Base to Secondary Conversion
//             </label>
//             <input
//               id="baseUnitToSecondaryUnit"
//               name="baseUnitToSecondaryUnit"
//               type="number"
//               min="0"
//               step="0.01"
//               value={formData.baseUnitToSecondaryUnit}
//               onChange={handleInputChange}
//               className={styles.input}
//               placeholder="e.g. 1 box = 12 pieces → enter 12"
//               disabled={loading}
//             />
//           </div>
//         </div>

//         {/* Pricing & Tax */}
//         <div className={styles.formSection}>
//           <h2 className={styles.sectionTitle}>
//             <DollarSign size={20} />
//             Pricing & Tax
//           </h2>
//           <div className={styles.formGrid}>
//             <div className={styles.formGroup}>
//               <label htmlFor="salePrice" className={styles.label}>
//                 Sale Price <span className={styles.required}>*</span>
//               </label>
//               <div className={styles.inputIcon}>
//                 <IndianRupee size={18} />
//                 <input
//                   id="salePrice"
//                   name="salePrice"
//                   type="number"
//                   min="0"
//                   step="0.01"
//                   value={formData.salePrice}
//                   onChange={handleInputChange}
//                   className={styles.input}
//                   required
//                   disabled={loading}
//                 />
//               </div>
//             </div>

//             <div className={styles.formGroup}>
//               <label htmlFor="saleTaxType" className={styles.label}>
//                 Sale Tax Type <span className={styles.required}>*</span>
//               </label>
//               <select
//                 id="saleTaxType"
//                 name="saleTaxType"
//                 value={formData.saleTaxType}
//                 onChange={handleInputChange}
//                 className={styles.input}
//                 required
//                 disabled={loading}
//               >
//                 <option value="">Select Tax Type</option>
//                 {taxTypes.map((t) => (
//                   <option key={t} value={t}>
//                     {t.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           <div className={styles.formGrid}>
//             <div className={styles.formGroup}>
//               <label htmlFor="taxRate" className={styles.label}>
//                 Tax Rate <span className={styles.required}>*</span>
//               </label>
//               <select
//                 id="taxRate"
//                 name="taxRate"
//                 value={formData.taxRate}
//                 onChange={handleInputChange}
//                 className={styles.input}
//                 required
//                 disabled={loading}
//               >
//                 <option value="">Select Tax Rate</option>
//                 {taxRates.map((t) => (
//                   <option key={t} value={t}>
//                     {t.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className={styles.formGroup}>
//               <label htmlFor="saleDiscountPrice" className={styles.label}>Discount Amount</label>
//               <div className={styles.inputIcon}>
//                 <Percent size={18} />
//                 <input
//                   id="saleDiscountPrice"
//                   name="saleDiscountPrice"
//                   type="number"
//                   min="0"
//                   step="0.01"
//                   value={formData.saleDiscountPrice}
//                   onChange={handleInputChange}
//                   className={styles.input}
//                   disabled={loading}
//                 />
//               </div>
//             </div>
//           </div>

//           <div className={styles.formGroup}>
//             <label htmlFor="saleDiscountType" className={styles.label}>Discount Type</label>
//             <select
//               id="saleDiscountType"
//               name="saleDiscountType"
//               value={formData.saleDiscountType}
//               onChange={handleInputChange}
//               className={styles.input}
//               disabled={loading}
//             >
//               <option value="">Select Discount Type</option>
//               {discountTypes.map((d) => (
//                 <option key={d} value={d}>
//                   {d}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {/* Product Only Fields */}
//         {formData.itemType === "PRODUCT" && (
//           <div className={styles.formSection}>
//             <h2 className={styles.sectionTitle}>
//               <ShoppingCart size={20} />
//               Product Stock Details
//             </h2>
//             <div className={styles.formGrid}>
//               <div className={styles.formGroup}>
//                 <label htmlFor="purchasePrice" className={styles.label}>
//                   Purchase Price <span className={styles.required}>*</span>
//                 </label>
//                 <div className={styles.inputIcon}>
//                   <IndianRupee size={18} />
//                   <input
//                     id="purchasePrice"
//                     name="purchasePrice"
//                     type="number"
//                     min="0"
//                     step="0.01"
//                     value={formData.purchasePrice}
//                     onChange={handleInputChange}
//                     className={styles.input}
//                     required
//                     disabled={loading}
//                   />
//                 </div>
//               </div>

//               <div className={styles.formGroup}>
//                 <label htmlFor="purchaseTaxType" className={styles.label}>
//                   Purchase Tax Type <span className={styles.required}>*</span>
//                 </label>
//                 <select
//                   id="purchaseTaxType"
//                   name="purchaseTaxType"
//                   value={formData.purchaseTaxType}
//                   onChange={handleInputChange}
//                   className={styles.input}
//                   required
//                   disabled={loading}
//                 >
//                   <option value="">Select Tax Type</option>
//                   {taxTypes.map((t) => (
//                     <option key={t} value={t}>
//                       {t.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             <div className={styles.formGrid}>
//               <div className={styles.formGroup}>
//                 <label htmlFor="stockOpeningQty" className={styles.label}>Opening Stock Qty</label>
//                 <input
//                   id="stockOpeningQty"
//                   name="stockOpeningQty"
//                   type="number"
//                   min="0"
//                   step="0.01"
//                   value={formData.stockOpeningQty}
//                   onChange={handleInputChange}
//                   className={styles.input}
//                   disabled={loading}
//                 />
//               </div>

//               <div className={styles.formGroup}>
//                 <label htmlFor="stockPrice" className={styles.label}>Stock Value</label>
//                 <div className={styles.inputIcon}>
//                   <IndianRupee size={18} />
//                   <input
//                     id="stockPrice"
//                     name="stockPrice"
//                     type="number"
//                     min="0"
//                     step="0.01"
//                     value={formData.stockPrice}
//                     onChange={handleInputChange}
//                     className={styles.input}
//                     disabled={loading}
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className={styles.formGrid}>
//               <div className={styles.formGroup}>
//                 <label htmlFor="stockOpeningDate" className={styles.label}>Opening Date</label>
//                 <div className={styles.inputIcon}>
//                   <Calendar size={18} />
//                   <input
//                     id="stockOpeningDate"
//                     name="stockOpeningDate"
//                     type="date"
//                     value={formData.stockOpeningDate}
//                     onChange={handleInputChange}
//                     className={styles.input}
//                     disabled={loading}
//                   />
//                 </div>
//               </div>

//               <div className={styles.formGroup}>
//                 <label htmlFor="minimumStockToMaintain" className={styles.label}>Min Stock Alert</label>
//                 <input
//                   id="minimumStockToMaintain"
//                   name="minimumStockToMaintain"
//                   type="number"
//                   min="0"
//                   step="0.01"
//                   value={formData.minimumStockToMaintain}
//                   onChange={handleInputChange}
//                   className={styles.input}
//                   disabled={loading}
//                 />
//               </div>
//             </div>

//             <div className={styles.formGroup}>
//               <label htmlFor="openingStockLocation" className={styles.label}>Stock Location</label>
//               <div className={styles.inputIcon}>
//                 <MapPin size={18} />
//                 <input
//                   id="openingStockLocation"
//                   name="openingStockLocation"
//                   type="text"
//                   value={formData.openingStockLocation}
//                   onChange={handleInputChange}
//                   className={styles.input}
//                   placeholder="e.g. Warehouse A, Shelf 3"
//                   disabled={loading}
//                 />
//               </div>
//             </div>
//           </div>
//         )}
//       </form>
//     </div>
//   )
// }

// export default Add_Items









// "use client"

// import { useState } from "react"
// import { useNavigate, useLocation } from "react-router-dom"
// import axios from "axios"
// import config from "../../../config/apiconfig"
// import styles from "../Styles/Form.module.css"
// import { toast } from "react-toastify"
// import {
//   ArrowLeft,
//   CheckCircle,
//   Package,
//   Tag,
//   Hash,
//   FileText,
//   ShoppingCart,
//   DollarSign,
//   Percent,
//   Calendar,
//   MapPin,
//   Loader,
//   AlertCircle,
//   Box,
//   Layers,
//   IndianRupee,
// } from "lucide-react"

// const Add_Items = () => {
//   const navigate = useNavigate()
//   const location = useLocation()
//   const { item = {}, companyId, token, categories = [], itemType } = location.state || {}

//   const [formData, setFormData] = useState({
//     itemName: item.itemName || "",
//     itemHsn: item.itemHsn || "",
//     itemCode: item.itemCode || "",
//     description: item.description || "",
//     itemType: item.itemType || itemType || "PRODUCT",
//     baseUnit: item.baseUnit || "",
//     secondaryUnit: item.secondaryUnit || "",
//     baseUnitToSecondaryUnit: item.baseUnitToSecondaryUnit || "",
//     categoryIds: item.categories?.map((cat) => cat.categoryId) || [],
//     salePrice: item.salePrice || "",
//     saleTaxType: item.saleTaxType || "",
//     purchasePrice: item.purchasePrice || "",
//     purchaseTaxType: item.purchaseTaxType || "",
//     taxRate: item.taxRate || "",
//     stockOpeningQty: item.stockOpeningQty || "",
//     stockPricePerQty: item.stockPricePerQty || item.stockPrice || "", // Backward compat
//     stockOpeningDate: item.stockOpeningDate || "",
//     minimumStockToMaintain: item.minimumStockToMaintain || "",
//     openingStockLocation: item.openingStockLocation || "",
//     saleDiscountPrice: item.saleDiscountPrice || "",
//     saleDiscountType: item.saleDiscountType || "",
//   })

//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState(null)

//   const units = [
//     "CARTONS", "KILOGRAMS", "QUINTAL", "BOTTLES", "PIECES", "ROLLS",
//     "NUMBERS", "PAIRS", "TABLETS", "MILLITRE", "BUNDLES", "BOX",
//     "SQUARE_METERS", "BAGS", "CANS", "SQUARE_FEET",
//   ]
//   const taxTypes = ["WITHTAX", "WITHOUTTAX"]
//   const taxRates = [
//     "NONE", "EXEMPTED", "GST0", "IGST0", "GST0POINT25", "IGST0POINT25",
//     "GST3", "IGST3", "GST5", "IGST5", "GST12", "IGST12", "GST18",
//     "IGST18", "GST28", "IGST28",
//   ]
//   const discountTypes = ["PERCENTAGE", "AMOUNT"]

//   const handleInputChange = (e) => {
//     const { name, value } = e.target
//     setFormData((prev) => ({ ...prev, [name]: value }))
//   }

//   const handleCategoryChange = (categoryId) => {
//     setFormData((prev) => ({
//       ...prev,
//       categoryIds: prev.categoryIds.includes(categoryId)
//         ? prev.categoryIds.filter((id) => id !== categoryId)
//         : [...prev.categoryIds, categoryId],
//     }))
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setLoading(true)
//     setError(null)

//     const payload = {
//       itemName: formData.itemName,
//       itemHsn: formData.itemHsn || "",
//       itemCode: formData.itemCode || "",
//       description: formData.description || "",
//       itemType: formData.itemType,
//       baseUnit: formData.baseUnit,
//       secondaryUnit: formData.secondaryUnit || "",
//       baseUnitToSecondaryUnit: parseFloat(formData.baseUnitToSecondaryUnit) || 0,
//       categoryIds: formData.categoryIds.map(Number),
//       salePrice: parseFloat(formData.salePrice) || 0,
//       saleTaxType: formData.saleTaxType,
//       taxRate: formData.taxRate,
//       saleDiscountPrice: parseFloat(formData.saleDiscountPrice) || 0,
//       saleDiscountType: formData.saleDiscountType || "PERCENTAGE",
//       ...(formData.itemType === "PRODUCT" && {
//         purchasePrice: parseFloat(formData.purchasePrice) || 0,
//         purchaseTaxType: formData.purchaseTaxType,
//         stockOpeningQty: parseFloat(formData.stockOpeningQty) || 0,
//         stockPricePerQty: parseFloat(formData.stockPricePerQty) || 0, // Fixed!
//         stockOpeningDate: formData.stockOpeningDate || null,
//         minimumStockToMaintain: parseFloat(formData.minimumStockToMaintain) || 0,
//         openingStockLocation: formData.openingStockLocation || "",
//       }),
//     }

//     try {
//       if (item.itemId) {
//         await axios.put(`${config.BASE_URL}/item/${item.itemId}`, payload, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         })
//         toast.success("Item updated successfully")
//       } else {
//         const endpoint =
//           formData.itemType === "PRODUCT"
//             ? `${config.BASE_URL}/company/${companyId}/create/product-item`
//             : `${config.BASE_URL}/company/${companyId}/create/service-item`

//         await axios.post(endpoint, payload, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         })
//         toast.success("Item created successfully")
//       }
//       navigate("/items")
//     } catch (error) {
//       console.error("Error saving item:", error)
//       const msg = error.response?.data?.message || "Failed to save item."
//       setError(msg)
//       toast.error(msg)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const isEditMode = !!item.itemId

//   return (
//     <div className={styles.container}>
//       <form onSubmit={handleSubmit} className={styles.form}>
//         {/* Header */}
//         <div className={styles.header}>
//           <div className={styles.headerContent}>
//             <div className={styles.titleSection}>
//               <h1 className={styles.title}>
//                 {isEditMode ? (
//                   <>
//                     <CheckCircle className={styles.titleIcon} />
//                     Edit Item
//                   </>
//                 ) : (
//                   <>
//                     <Package className={styles.titleIcon} />
//                     Add Item
//                   </>
//                 )}
//               </h1>
//               <p className={styles.subtitle}>
//                 {isEditMode ? "Update item details" : "Add a new product or service"}
//               </p>
//             </div>
//           </div>
//           <div className={styles.headerActions}>
//             <button
//               type="button"
//               onClick={() => navigate("/items")}
//               className={styles.buttonSecondary}
//               disabled={loading}
//             >
//               <ArrowLeft size={18} />
//               Back
//             </button>
//             <button
//               type="submit"
//               className={styles.buttonPrimary}
//               disabled={loading || !token || !companyId}
//             >
//               {loading ? (
//                 <>
//                   <Loader size={18} className={styles.spinnerSmall} />
//                   Saving...
//                 </>
//               ) : (
//                 <>
//                   <CheckCircle size={18} />
//                   {isEditMode ? "Update Item" : "Create Item"}
//                 </>
//               )}
//             </button>
//           </div>
//         </div>

//         {/* Error Alert */}
//         {error && (
//           <div className={styles.error}>
//             <AlertCircle size={18} />
//             {error}
//           </div>
//         )}

//         {/* Basic Information */}
//         <div className={styles.formSection}>
//           <h2 className={styles.sectionTitle}>
//             <FileText size={20} />
//             Basic Information
//           </h2>
//           <div className={styles.formGrid}>
//             <div className={styles.formGroup}>
//               <label htmlFor="itemType" className={styles.label}>
//                 Item Type <span className={styles.required}>*</span>
//               </label>
//               <select
//                 id="itemType"
//                 name="itemType"
//                 value={formData.itemType}
//                 onChange={handleInputChange}
//                 className={styles.input}
//                 required
//                 disabled={isEditMode || loading}
//               >
//                 <option value="PRODUCT">Product</option>
//                 <option value="SERVICE">Service</option>
//               </select>
//             </div>

//             <div className={styles.formGroup}>
//               <label htmlFor="itemName" className={styles.label}>
//                 Item Name <span className={styles.required}>*</span>
//               </label>
//               <div className={styles.inputIcon}>
//                 <Tag size={18} />
//                 <input
//                   id="itemName"
//                   name="itemName"
//                   type="text"
//                   value={formData.itemName}
//                   onChange={handleInputChange}
//                   className={styles.input}
//                   required
//                   disabled={loading}
//                 />
//               </div>
//             </div>
//           </div>

//           <div className={styles.formGrid}>
//             <div className={styles.formGroup}>
//               <label htmlFor="itemHsn" className={styles.label}>HSN / SAC Code</label>
//               <div className={styles.inputIcon}>
//                 <Hash size={18} />
//                 <input
//                   id="itemHsn"
//                   name="itemHsn"
//                   type="text"
//                   value={formData.itemHsn}
//                   onChange={handleInputChange}
//                   className={styles.input}
//                   disabled={loading}
//                 />
//               </div>
//             </div>

//             <div className={styles.formGroup}>
//               <label htmlFor="itemCode" className={styles.label}>Item Code</label>
//               <div className={styles.inputIcon}>
//                 <Box size={18} />
//                 <input
//                   id="itemCode"
//                   name="itemCode"
//                   type="text"
//                   value={formData.itemCode}
//                   onChange={handleInputChange}
//                   className={styles.input}
//                   placeholder="e.g. PROD001"
//                   disabled={loading}
//                 />
//               </div>
//             </div>
//           </div>

//           <div className={styles.formGroup}>
//             <label htmlFor="description" className={styles.label}>Description</label>
//             <textarea
//               id="description"
//               name="description"
//               value={formData.description}
//               onChange={handleInputChange}
//               className={`${styles.input} ${styles.textarea}`}
//               placeholder="Optional description about the item..."
//               rows={3}
//               disabled={loading}
//             />
//           </div>

//           <div className={styles.formGroup}>
//             <label className={styles.label}>Categories</label>
//             <div className={styles.checkboxContainer}>
//               {categories.length > 0 ? (
//                 categories.map((cat) => (
//                   <label key={cat.categoryId} className={styles.checkboxLabel}>
//                     <input
//                       type="checkbox"
//                       checked={formData.categoryIds.includes(cat.categoryId)}
//                       onChange={() => handleCategoryChange(cat.categoryId)}
//                       disabled={loading}
//                     />
//                     <span className={styles.checkboxText}>{cat.categoryName}</span>
//                   </label>
//                 ))
//               ) : (
//                 <p className={styles.noDataText}>No categories available</p>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Unit Details */}
//         <div className={styles.formSection}>
//           <h2 className={styles.sectionTitle}>
//             <Layers size={20} />
//             Unit Details
//           </h2>
//           <div className={styles.formGrid}>
//             <div className={styles.formGroup}>
//               <label htmlFor="baseUnit" className={styles.label}>
//                 Base Unit <span className={styles.required}>*</span>
//               </label>
//               <select
//                 id="baseUnit"
//                 name="baseUnit"
//                 value={formData.baseUnit}
//                 onChange={handleInputChange}
//                 className={styles.input}
//                 required
//                 disabled={loading}
//               >
//                 <option value="">Select Base Unit</option>
//                 {units.map((u) => (
//                   <option key={u} value={u}>
//                     {u.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className={styles.formGroup}>
//               <label htmlFor="secondaryUnit" className={styles.label}>Secondary Unit</label>
//               <select
//                 id="secondaryUnit"
//                 name="secondaryUnit"
//                 value={formData.secondaryUnit}
//                 onChange={handleInputChange}
//                 className={styles.input}
//                 disabled={loading}
//               >
//                 <option value="">None</option>
//                 {units.map((u) => (
//                   <option key={u} value={u}>
//                     {u.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           {formData.secondaryUnit && (
//             <div className={styles.formGroup}>
//               <label htmlFor="baseUnitToSecondaryUnit" className={styles.label}>
//                 Conversion: 1 {formData.baseUnit?.toLowerCase()} = ?
//               </label>
//               <input
//                 id="baseUnitToSecondaryUnit"
//                 name="baseUnitToSecondaryUnit"
//                 type="number"
//                 min="0"
//                 step="0.01"
//                 value={formData.baseUnitToSecondaryUnit}
//                 onChange={handleInputChange}
//                 className={styles.input}
//                 placeholder={`e.g. 1 ${formData.baseUnit?.toLowerCase()} = 12 ${formData.secondaryUnit?.toLowerCase()}`}
//                 disabled={loading}
//               />
//             </div>
//           )}
//         </div>

//         {/* Pricing & Tax */}
//         <div className={styles.formSection}>
//           <h2 className={styles.sectionTitle}>
//             <DollarSign size={20} />
//             Pricing & Tax
//           </h2>
//           <div className={styles.formGrid}>
//             <div className={styles.formGroup}>
//               <label htmlFor="salePrice" className={styles.label}>
//                 Sale Price (Excl. Tax) <span className={styles.required}>*</span>
//               </label>
//               <div className={styles.inputIcon}>
//                 <IndianRupee size={18} />
//                 <input
//                   id="salePrice"
//                   name="salePrice"
//                   type="number"
//                   min="0"
//                   step="0.01"
//                   value={formData.salePrice}
//                   onChange={handleInputChange}
//                   className={styles.input}
//                   required
//                   disabled={loading}
//                 />
//               </div>
//             </div>

//             <div className={styles.formGroup}>
//               <label htmlFor="saleTaxType" className={styles.label}>
//                 Sale Tax Type <span className={styles.required}>*</span>
//               </label>
//               <select
//                 id="saleTaxType"
//                 name="saleTaxType"
//                 value={formData.saleTaxType}
//                 onChange={handleInputChange}
//                 className={styles.input}
//                 required
//                 disabled={loading}
//               >
//                 <option value="">Select</option>
//                 {taxTypes.map((t) => (
//                   <option key={t} value={t}>
//                     {t === "WITHTAX" ? "With Tax" : "Without Tax"}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           <div className={styles.formGrid}>
//             <div className={styles.formGroup}>
//               <label htmlFor="taxRate" className={styles.label}>
//                 GST Rate <span className={styles.required}>*</span>
//               </label>
//               <select
//                 id="taxRate"
//                 name="taxRate"
//                 value={formData.taxRate}
//                 onChange={handleInputChange}
//                 className={styles.input}
//                 required
//                 disabled={loading}
//               >
//                 <option value="">Select GST Rate</option>
//                 {taxRates.map((t) => (
//                   <option key={t} value={t}>
//                     {t.replace(/_/g, " ").replace("POINT", ".").replace("GST", "GST ").replace("IGST", "IGST ")}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className={styles.formGroup}>
//               <label htmlFor="saleDiscountPrice" className={styles.label}>Discount</label>
//               <div className={styles.inputIcon}>
//                 <Percent size={18} />
//                 <input
//                   id="saleDiscountPrice"
//                   name="saleDiscountPrice"
//                   type="number"
//                   min="0"
//                   step="0.01"
//                   value={formData.saleDiscountPrice}
//                   onChange={handleInputChange}
//                   className={styles.input}
//                   placeholder="Amount or %"
//                   disabled={loading}
//                 />
//               </div>
//             </div>
//           </div>

//           {formData.saleDiscountPrice > 0 && (
//             <div className={styles.formGroup}>
//               <label htmlFor="saleDiscountType" className={styles.label}>Discount Type</label>
//               <select
//                 id="saleDiscountType"
//                 name="saleDiscountType"
//                 value={formData.saleDiscountType}
//                 onChange={handleInputChange}
//                 className={styles.input}
//                 disabled={loading}
//               >
//                 <option value="PERCENTAGE">Percentage (%)</option>
//                 <option value="AMOUNT">Fixed Amount</option>
//               </select>
//             </div>
//           )}
//         </div>

//         {/* Product Only Fields */}
//         {formData.itemType === "PRODUCT" && (
//           <div className={styles.formSection}>
//             <h2 className={styles.sectionTitle}>
//               <ShoppingCart size={20} />
//               Product Stock Details
//             </h2>
//             <div className={styles.formGrid}>
//               <div className={styles.formGroup}>
//                 <label htmlFor="purchasePrice" className={styles.label}>
//                   Purchase Price (Excl. Tax) <span className={styles.required}>*</span>
//                 </label>
//                 <div className={styles.inputIcon}>
//                   <IndianRupee size={18} />
//                   <input
//                     id="purchasePrice"
//                     name="purchasePrice"
//                     type="number"
//                     min="0"
//                     step="0.01"
//                     value={formData.purchasePrice}
//                     onChange={handleInputChange}
//                     className={styles.input}
//                     required={formData.itemType === "PRODUCT"}
//                     disabled={loading}
//                   />
//                 </div>
//               </div>

//               <div className={styles.formGroup}>
//                 <label htmlFor="purchaseTaxType" className={styles.label}>
//                   Purchase Tax Type <span className={styles.required}>*</span>
//                 </label>
//                 <select
//                   id="purchaseTaxType"
//                   name="purchaseTaxType"
//                   value={formData.purchaseTaxType}
//                   onChange={handleInputChange}
//                   className={styles.input}
//                   required={formData.itemType === "PRODUCT"}
//                   disabled={loading}
//                 >
//                   <option value="">Select</option>
//                   {taxTypes.map((t) => (
//                     <option key={t} value={t}>
//                       {t === "WITHTAX" ? "With Tax" : "Without Tax"}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             <div className={styles.formGrid}>
//               <div className={styles.formGroup}>
//                 <label htmlFor="stockOpeningQty" className={styles.label}>Opening Stock Quantity</label>
//                 <input
//                   id="stockOpeningQty"
//                   name="stockOpeningQty"
//                   type="number"
//                   min="0"
//                   step="0.01"
//                   value={formData.stockOpeningQty}
//                   onChange={handleInputChange}
//                   className={styles.input}
//                   placeholder="0"
//                   disabled={loading}
//                 />
//               </div>

//               <div className={styles.formGroup}>
//                 <label htmlFor="stockPricePerQty" className={styles.label}>
//                   Cost Price Per Unit (Stock Value per Qty)
//                 </label>
//                 <div className={styles.inputIcon}>
//                   <IndianRupee size={18} />
//                   <input
//                     id="stockPricePerQty"
//                     name="stockPricePerQty"
//                     type="number"
//                     min="0"
//                     step="0.01"
//                     value={formData.stockPricePerQty}
//                     onChange={handleInputChange}
//                     className={styles.input}
//                     placeholder="Purchase cost per unit"
//                     disabled={loading}
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className={styles.formGrid}>
//               <div className={styles.formGroup}>
//                 <label htmlFor="stockOpeningDate" className={styles.label}>Opening Stock Date</label>
//                 <div className={styles.inputIcon}>
//                   <Calendar size={18} />
//                   <input
//                     id="stockOpeningDate"
//                     name="stockOpeningDate"
//                     type="date"
//                     value={formData.stockOpeningDate}
//                     onChange={handleInputChange}
//                     className={styles.input}
//                     disabled={loading}
//                   />
//                 </div>
//               </div>

//               <div className={styles.formGroup}>
//                 <label htmlFor="minimumStockToMaintain" className={styles.label}>Minimum Stock Alert</label>
//                 <input
//                   id="minimumStockToMaintain"
//                   name="minimumStockToMaintain"
//                   type="number"
//                   min="0"
//                   step="0.01"
//                   value={formData.minimumStockToMaintain}
//                   onChange={handleInputChange}
//                   className={styles.input}
//                   placeholder="Low stock warning level"
//                   disabled={loading}
//                 />
//               </div>
//             </div>

//             <div className={styles.formGroup}>
//               <label htmlFor="openingStockLocation" className={styles.label}>Stock Location</label>
//               <div className={styles.inputIcon}>
//                 <MapPin size={18} />
//                 <input
//                   id="openingStockLocation"
//                   name="openingStockLocation"
//                   type="text"
//                   value={formData.openingStockLocation}
//                   onChange={handleInputChange}
//                   className={styles.input}
//                   placeholder="e.g. Main Warehouse - Rack A3"
//                   disabled={loading}
//                 />
//               </div>
//             </div>
//           </div>
//         )}
//       </form>
//     </div>
//   )
// }

// export default Add_Items









// "use client"

// import { useState } from "react"
// import { useNavigate, useLocation } from "react-router-dom"
// import axios from "axios"
// import config from "../../../config/apiconfig"
// import styles from "../Styles/Form.module.css"
// import { toast } from "react-toastify"
// import {
//   ArrowLeft,
//   CheckCircle,
//   Package,
//   Tag,
//   Hash,
//   FileText,
//   ShoppingCart,
//   DollarSign,
//   Percent,
//   Calendar,
//   MapPin,
//   Loader,
//   AlertCircle,
//   Box,
//   Layers,
//   IndianRupee,
// } from "lucide-react"

// const Add_Items = () => {
//   const navigate = useNavigate()
//   const location = useLocation()
//   const { item = {}, companyId, token, categories = [], itemType } = location.state || {}

//   const [formData, setFormData] = useState({
//     itemName: item.itemName || "",
//     itemHsn: item.itemHsn || "",
//     itemCode: item.itemCode || "",
//     description: item.description || "",
//     itemType: item.itemType || itemType || "PRODUCT",
//     baseUnit: item.baseUnit || "",
//     secondaryUnit: item.secondaryUnit || "",
//     baseUnitToSecondaryUnit: item.baseUnitToSecondaryUnit || "",
//     categoryIds: item.categories?.map((cat) => cat.categoryId) || [],
//     salePrice: item.salePrice || "",
//     saleTaxType: item.saleTaxType || "",
//     purchasePrice: item.purchasePrice || "",
//     purchaseTaxType: item.purchaseTaxType || "",
//     taxRate: item.taxRate || "",
//     stockOpeningQty: item.stockOpeningQty || "",
//     stockPricePerQty: item.stockPricePerQty || item.stockPrice || "",
//     stockOpeningDate: item.stockOpeningDate || "",
//     minimumStockToMaintain: item.minimumStockToMaintain || "",
//     openingStockLocation: item.openingStockLocation || "",
//     saleDiscountPrice: item.saleDiscountPrice || "",
//     saleDiscountType: item.saleDiscountType || "",
//   })

//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState(null)

//   const units = [
//     "CARTONS",
//     "KILOGRAMS",
//     "QUINTAL",
//     "BOTTLES",
//     "PIECES",
//     "ROLLS",
//     "NUMBERS",
//     "PAIRS",
//     "TABLETS",
//     "MILLITRE",
//     "BUNDLES",
//     "BOX",
//     "SQUARE_METERS",
//     "BAGS",
//     "CANS",
//     "SQUARE_FEET",
//   ]

//   const taxTypes = ["WITHTAX", "WITHOUTTAX"]

//   const taxRates = [
//     "NONE",
//     "EXEMPTED",
//     "GST0",
//     "IGST0",
//     "GST0POINT25",
//     "IGST0POINT25",
//     "GST3",
//     "IGST3",
//     "GST5",
//     "IGST5",
//     "GST12",
//     "IGST12",
//     "GST18",
//     "IGST18",
//     "GST28",
//     "IGST28",
//   ]

//   const discountTypes = ["PERCENTAGE", "AMOUNT"]

//   const handleInputChange = (e) => {
//     const { name, value } = e.target
//     setFormData((prev) => ({ ...prev, [name]: value }))
//   }

//   const handleCategoryChange = (categoryId) => {
//     setFormData((prev) => ({
//       ...prev,
//       categoryIds: prev.categoryIds.includes(categoryId)
//         ? prev.categoryIds.filter((id) => id !== categoryId)
//         : [...prev.categoryIds, categoryId],
//     }))
//   }

//   // Convert empty string to null for enum fields (fixes Spring Boot error)
//   const toNullIfEmpty = (value) => (value === "" ? null : value)

//   const handleSubmit = async (e) => {
//     e.preventDefault()

//     // Only 4 required fields
//     if (!formData.itemName.trim()) return toast.error("Item Name is required")
//     if (!formData.itemHsn.trim()) return toast.error("HSN / SAC Code is required")
//     if (!formData.baseUnit) return toast.error("Base Unit is required")
//     if (!formData.taxRate) return toast.error("GST Rate is required")

//     setLoading(true)
//     setError(null)

//     const payload = {
//       itemName: formData.itemName.trim(),
//       itemHsn: formData.itemHsn.trim(),
//       itemCode: formData.itemCode || null,
//       description: formData.description || null,
//       itemType: formData.itemType,
//       baseUnit: formData.baseUnit,
//       secondaryUnit: toNullIfEmpty(formData.secondaryUnit),
//       baseUnitToSecondaryUnit: formData.baseUnitToSecondaryUnit ? parseFloat(formData.baseUnitToSecondaryUnit) : 0,
//       categoryIds: formData.categoryIds.map(Number),
//       salePrice: parseFloat(formData.salePrice) || 0,
//       saleTaxType: toNullIfEmpty(formData.saleTaxType),
//       taxRate: formData.taxRate,
//       saleDiscountPrice: parseFloat(formData.saleDiscountPrice) || 0,
//       saleDiscountType: formData.saleDiscountPrice > 0 ? toNullIfEmpty(formData.saleDiscountType) : null,

//       ...(formData.itemType === "PRODUCT" && {
//         purchasePrice: parseFloat(formData.purchasePrice) || 0,
//         purchaseTaxType: toNullIfEmpty(formData.purchaseTaxType),
//         stockOpeningQty: parseFloat(formData.stockOpeningQty) || 0,
//         stockPricePerQty: parseFloat(formData.stockPricePerQty) || 0,
//         stockOpeningDate: formData.stockOpeningDate || null,
//         minimumStockToMaintain: parseFloat(formData.minimumStockToMaintain) || 0,
//         openingStockLocation: formData.openingStockLocation || null,
//       }),
//     }

//     try {
//       if (item.itemId) {
//         await axios.put(`${config.BASE_URL}/item/${item.itemId}`, payload, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         })
//         toast.success("Item updated successfully")
//       } else {
//         const endpoint =
//           formData.itemType === "PRODUCT"
//             ? `${config.BASE_URL}/company/${companyId}/create/product-item`
//             : `${config.BASE_URL}/company/${companyId}/create/service-item`

//         await axios.post(endpoint, payload, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         })
//         toast.success("Item created successfully")
//       }
//       navigate("/items")
//     } catch (error) {
//       const msg = error.response?.data?.message || "Failed to save item."
//       setError(msg)
//       toast.error(msg)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const isEditMode = !!item.itemId

//   return (
//     <div className={styles.container}>
//       <form onSubmit={handleSubmit} className={styles.form}>
//         {/* Header */}
//         <div className={styles.header}>
//           <div className={styles.headerContent}>
//             <div className={styles.titleSection}>
//               <h1 className={styles.title}>
//                 {isEditMode ? (
//                   <>
//                     <CheckCircle className={styles.titleIcon} />
//                     Edit Item
//                   </>
//                 ) : (
//                   <>
//                     <Package className={styles.titleIcon} />
//                     Add Item
//                   </>
//                 )}
//               </h1>
//               <p className={styles.subtitle}>
//                 {isEditMode ? "Update item details" : "Add a new product or service"}
//               </p>
//             </div>
//           </div>
//           <div className={styles.headerActions}>
//             <button
//               type="button"
//               onClick={() => navigate("/items")}
//               className={styles.buttonSecondary}
//               disabled={loading}
//             >
//               <ArrowLeft size={18} />
//               Back
//             </button>
//             <button type="submit" className={styles.buttonPrimary} disabled={loading}>
//               {loading ? (
//                 <>
//                   <Loader size={18} className={styles.spinnerSmall} />
//                   Saving...
//                 </>
//               ) : (
//                 <>
//                   <CheckCircle size={18} />
//                   {isEditMode ? "Update Item" : "Create Item"}
//                 </>
//               )}
//             </button>
//           </div>
//         </div>

//         {/* Error Alert */}
//         {error && (
//           <div className={styles.error}>
//             <AlertCircle size={18} />
//             {error}
//           </div>
//         )}

//         {/* Basic Information */}
//         <div className={styles.formSection}>
//           <h2 className={styles.sectionTitle}>
//             <FileText size={20} />
//             Basic Information
//           </h2>

//           <div className={styles.formGrid}>
//             <div className={styles.formGroup}>
//               <label className={styles.label}>Item Type</label>
//               <select
//                 name="itemType"
//                 value={formData.itemType}
//                 onChange={handleInputChange}
//                 className={styles.input}
//                 disabled={isEditMode || loading}
//               >
//                 <option value="PRODUCT">Product</option>
//                 <option value="SERVICE">Service</option>
//               </select>
//             </div>

//             <div className={styles.formGroup}>
//               <label className={styles.label}>
//                 Item Name <span className={styles.required}>*</span>
//               </label>
//               <div className={styles.inputIcon}>
//                 <Tag size={18} />
//                 <input
//                   name="itemName"
//                   type="text"
//                   value={formData.itemName}
//                   onChange={handleInputChange}
//                   className={styles.input}
//                   placeholder="Required"
//                   disabled={loading}
//                 />
//               </div>
//             </div>
//           </div>

//           <div className={styles.formGrid}>
//             <div className={styles.formGroup}>
//               <label className={styles.label}>
//                 HSN / SAC Code <span className={styles.required}>*</span>
//               </label>
//               <div className={styles.inputIcon}>
//                 <Hash size={18} />
//                 <input
//                   name="itemHsn"
//                   type="text"
//                   value={formData.itemHsn}
//                   onChange={handleInputChange}
//                   className={styles.input}
//                   placeholder="e.g. 30049099"
//                   disabled={loading}
//                 />
//               </div>
//             </div>

//             <div className={styles.formGroup}>
//               <label className={styles.label}>Item Code</label>
//               <div className={styles.inputIcon}>
//                 <Box size={18} />
//                 <input
//                   name="itemCode"
//                   type="text"
//                   value={formData.itemCode}
//                   onChange={handleInputChange}
//                   className={styles.input}
//                   placeholder="Optional"
//                   disabled={loading}
//                 />
//               </div>
//             </div>
//           </div>

//           <div className={styles.formGroup}>
//             <label className={styles.label}>Description</label>
//             <textarea
//               name="description"
//               value={formData.description}
//               onChange={handleInputChange}
//               className={`${styles.input} ${styles.textarea}`}
//               placeholder="Optional..."
//               rows={3}
//               disabled={loading}
//             />
//           </div>

//           <div className={styles.formGroup}>
//             <label className={styles.label}>Categories</label>
//             <div className={styles.checkboxContainer}>
//               {categories.length > 0 ? (
//                 categories.map((cat) => (
//                   <label key={cat.categoryId} className={styles.checkboxLabel}>
//                     <input
//                       type="checkbox"
//                       checked={formData.categoryIds.includes(cat.categoryId)}
//                       onChange={() => handleCategoryChange(cat.categoryId)}
//                       disabled={loading}
//                     />
//                     <span className={styles.checkboxText}>{cat.categoryName}</span>
//                   </label>
//                 ))
//               ) : (
//                 <p className={styles.noDataText}>No categories available</p>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Unit Details */}
//         <div className={styles.formSection}>
//           <h2 className={styles.sectionTitle}>
//             <Layers size={20} />
//             Unit Details
//           </h2>
//           <div className={styles.formGrid}>
//             <div className={styles.formGroup}>
//               <label className={styles.label}>
//                 Base Unit <span className={styles.required}>*</span>
//               </label>
//               <select
//                 name="baseUnit"
//                 value={formData.baseUnit}
//                 onChange={handleInputChange}
//                 className={styles.input}
//                 disabled={loading}
//               >
//                 <option value="">Select Base Unit</option>
//                 {units.map((u) => (
//                   <option key={u} value={u}>
//                     {u.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className={styles.formGroup}>
//               <label className={styles.label}>Secondary Unit</label>
//               <select
//                 name="secondaryUnit"
//                 value={formData.secondaryUnit}
//                 onChange={handleInputChange}
//                 className={styles.input}
//                 disabled={loading}
//               >
//                 <option value="">None</option>
//                 {units.map((u) => (
//                   <option key={u} value={u}>
//                     {u.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           {formData.secondaryUnit && (
//             <div className={styles.formGroup}>
//               <label className={styles.label}>
//                 Conversion: 1 {formData.baseUnit?.toLowerCase()} = ?
//               </label>
//               <input
//                 name="baseUnitToSecondaryUnit"
//                 type="number"
//                 min="0"
//                 step="0.01"
//                 value={formData.baseUnitToSecondaryUnit}
//                 onChange={handleInputChange}
//                 className={styles.input}
//                 placeholder="e.g. 12"
//                 disabled={loading}
//               />
//             </div>
//           )}
//         </div>

//         {/* Pricing & Tax */}
//         <div className={styles.formSection}>
//           <h2 className={styles.sectionTitle}>
//             <DollarSign size={20} />
//             Pricing & Tax
//           </h2>

//           <div className={styles.formGrid}>
//             <div className={styles.formGroup}>
//               <label className={styles.label}>Sale Price</label>
//               <div className={styles.inputIcon}>
//                 <IndianRupee size={18} />
//                 <input
//                   name="salePrice"
//                   type="number"
//                   step="0.01"
//                   value={formData.salePrice}
//                   onChange={handleInputChange}
//                   className={styles.input}
//                   placeholder="0.00"
//                   disabled={loading}
//                 />
//               </div>
//             </div>

//             <div className={styles.formGroup}>
//               <label className={styles.label}>Sale Tax Type</label>
//               <select
//                 name="saleTaxType"
//                 value={formData.saleTaxType}
//                 onChange={handleInputChange}
//                 className={styles.input}
//                 disabled={loading}
//               >
//                 <option value="">Not Selected</option>
//                 {taxTypes.map((t) => (
//                   <option key={t} value={t}>
//                     {t === "WITHTAX" ? "With Tax" : "Without Tax"}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           <div className={styles.formGrid}>
//             <div className={styles.formGroup}>
//               <label className={styles.label}>
//                 GST Rate <span className={styles.required}>*</span>
//               </label>
//               <select
//                 name="taxRate"
//                 value={formData.taxRate}
//                 onChange={handleInputChange}
//                 className={styles.input}
//                 disabled={loading}
//               >
//                 <option value="">Select GST Rate</option>
//                 {taxRates.map((t) => (
//                   <option key={t} value={t}>
//                     {t.replace(/_/g, " ").replace("POINT", ".").replace("GST", "GST ").replace("IGST", "IGST ")}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className={styles.formGroup}>
//               <label className={styles.label}>Discount</label>
//               <div className={styles.inputIcon}>
//                 <Percent size={18} />
//                 <input
//                   name="saleDiscountPrice"
//                   type="number"
//                   step="0.01"
//                   value={formData.saleDiscountPrice}
//                   onChange={handleInputChange}
//                   className={styles.input}
//                   placeholder="Optional"
//                   disabled={loading}
//                 />
//               </div>
//             </div>
//           </div>

//           {formData.saleDiscountPrice > 0 && (
//             <div className={styles.formGroup}>
//               <label className={styles.label}>Discount Type</label>
//               <select
//                 name="saleDiscountType"
//                 value={formData.saleDiscountType}
//                 onChange={handleInputChange}
//                 className={styles.input}
//                 disabled={loading}
//               >
//                 <option value="">Select Type</option>
//                 <option value="PERCENTAGE">Percentage (%)</option>
//                 <option value="AMOUNT">Fixed Amount</option>
//               </select>
//             </div>
//           )}
//         </div>

//         {/* Product Stock Details */}
//         {formData.itemType === "PRODUCT" && (
//           <div className={styles.formSection}>
//             <h2 className={styles.sectionTitle}>
//               <ShoppingCart size={20} />
//               Product Stock Details (Optional)
//             </h2>

//             <div className={styles.formGrid}>
//               <div className={styles.formGroup}>
//                 <label className={styles.label}>Purchase Price</label>
//                 <div className={styles.inputIcon}>
//                   <IndianRupee size={18} />
//                   <input
//                     name="purchasePrice"
//                     type="number"
//                     step="0.01"
//                     value={formData.purchasePrice}
//                     onChange={handleInputChange}
//                     className={styles.input}
//                     placeholder="0.00"
//                     disabled={loading}
//                   />
//                 </div>
//               </div>

//               <div className={styles.formGroup}>
//                 <label className={styles.label}>Purchase Tax Type</label>
//                 <select
//                   name="purchaseTaxType"
//                   value={formData.purchaseTaxType}
//                   onChange={handleInputChange}
//                   className={styles.input}
//                   disabled={loading}
//                 >
//                   <option value="">Not Selected</option>
//                   {taxTypes.map((t) => (
//                     <option key={t} value={t}>
//                       {t === "WITHTAX" ? "With Tax" : "Without Tax"}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             <div className={styles.formGrid}>
//               <div className={styles.formGroup}>
//                 <label className={styles.label}>Opening Stock Qty</label>
//                 <input
//                   name="stockOpeningQty"
//                   type="number"
//                   step="0.01"
//                   value={formData.stockOpeningQty}
//                   onChange={handleInputChange}
//                   className={styles.input}
//                   placeholder="0"
//                   disabled={loading}
//                 />
//               </div>

//               <div className={styles.formGroup}>
//                 <label className={styles.label}>Cost Price Per Unit</label>
//                 <div className={styles.inputIcon}>
//                   <IndianRupee size={18} />
//                   <input
//                     name="stockPricePerQty"
//                     type="number"
//                     step="0.01"
//                     value={formData.stockPricePerQty}
//                     onChange={handleInputChange}
//                     className={styles.input}
//                     placeholder="Optional"
//                     disabled={loading}
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className={styles.formGrid}>
//               <div className={styles.formGroup}>
//                 <label className={styles.label}>Opening Stock Date</label>
//                 <div className={styles.inputIcon}>
//                   <Calendar size={18} />
//                   <input
//                     name="stockOpeningDate"
//                     type="date"
//                     value={formData.stockOpeningDate}
//                     onChange={handleInputChange}
//                     className={styles.input}
//                     disabled={loading}
//                   />
//                 </div>
//               </div>

//               <div className={styles.formGroup}>
//                 <label className={styles.label}>Minimum Stock Alert</label>
//                 <input
//                   name="minimumStockToMaintain"
//                   type="number"
//                   value={formData.minimumStockToMaintain}
//                   onChange={handleInputChange}
//                   className={styles.input}
//                   placeholder="e.g. 10"
//                   disabled={loading}
//                 />
//               </div>
//             </div>

//             <div className={styles.formGroup}>
//               <label className={styles.label}>Stock Location</label>
//               <div className={styles.inputIcon}>
//                 <MapPin size={18} />
//                 <input
//                   name="openingStockLocation"
//                   type="text"
//                   value={formData.openingStockLocation}
//                   onChange={handleInputChange}
//                   className={styles.input}
//                   placeholder="Optional"
//                   disabled={loading}
//                 />
//               </div>
//             </div>
//           </div>
//         )}
//       </form>
//     </div>
//   )
// }

// export default Add_Items




"use client";

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../../utils/axiosInstance"; // 👈 Shared API with interceptors
import { toast } from "react-toastify";
import styles from "../Styles/Form.module.css";
import {
  ArrowLeft,
  CheckCircle,
  Package,
  Tag,
  Hash,
  FileText,
  ShoppingCart,
  DollarSign,
  Percent,
  Calendar,
  MapPin,
  Loader,
  AlertCircle,
  Box,
  Layers,
  IndianRupee,
} from "lucide-react";

const Add_Items = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const passedItem = location.state?.item || {}; // Only use item data for edit mode
  const passedItemType = location.state?.itemType; // For create mode default type

  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("eBilling") || "{}")
  );

  const companyId = userData?.selectedCompany?.id;
  const token = userData?.accessToken;

  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    itemName: passedItem.itemName || "",
    itemHsn: passedItem.itemHsn || "",
    itemCode: passedItem.itemCode || "",
    description: passedItem.description || "",
    itemType: passedItem.itemType || passedItemType || "PRODUCT",
    baseUnit: passedItem.baseUnit || "",
    secondaryUnit: passedItem.secondaryUnit || "",
    baseUnitToSecondaryUnit: passedItem.baseUnitToSecondaryUnit || "",
    categoryIds: passedItem.categories?.map((cat) => cat.categoryId) || [],
    salePrice: passedItem.salePrice || "",
    saleTaxType: passedItem.saleTaxType || "",
    purchasePrice: passedItem.purchasePrice || "",
    purchaseTaxType: passedItem.purchaseTaxType || "",
    taxRate: passedItem.taxRate || "",
    stockOpeningQty: passedItem.stockOpeningQty || "",
    stockPricePerQty: passedItem.stockPricePerQty || passedItem.stockPrice || "",
    stockOpeningDate: passedItem.stockOpeningDate || "",
    minimumStockToMaintain: passedItem.minimumStockToMaintain || "",
    openingStockLocation: passedItem.openingStockLocation || "",
    saleDiscountPrice: passedItem.saleDiscountPrice || "",
    saleDiscountType: passedItem.saleDiscountType || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const units = [
    "CARTONS",
    "KILOGRAMS",
    "QUINTAL",
    "BOTTLES",
    "PIECES",
    "ROLLS",
    "NUMBERS",
    "PAIRS",
    "TABLETS",
    "MILLITRE",
    "BUNDLES",
    "BOX",
    "SQUARE_METERS",
    "BAGS",
    "CANS",
    "SQUARE_FEET",
  ];

  const taxTypes = ["WITHTAX", "WITHOUTTAX"];

  const taxRates = [
    "NONE",
    "EXEMPTED",
    "GST0",
    "IGST0",
    "GST0POINT25",
    "IGST0POINT25",
    "GST3",
    "IGST3",
    "GST5",
    "IGST5",
    "GST12",
    "IGST12",
    "GST18",
    "IGST18",
    "GST28",
    "IGST28",
  ];

  const discountTypes = ["PERCENTAGE", "AMOUNT"];

  // Sync userData on changes
  useEffect(() => {
    const handleStorageChange = () => {
      const updated = JSON.parse(localStorage.getItem("eBilling") || "{}");
      setUserData(updated);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      if (!token || !companyId) return;
      try {
        const response = await api.get(`/company/${companyId}/categories`);
        setCategories(response.data || []);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        toast.error("Could not load categories.");
      }
    };

    if (token && companyId) {
      fetchCategories();
    }
  }, [token, companyId]);

  // Auth check
  useEffect(() => {
    if (!token) {
      toast.info("Please log in to continue.");
      navigate("/login");
    } else if (!companyId) {
      toast.info("Please select a company first.");
      navigate("/company-list");
    }
  }, [token, companyId, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (categoryId) => {
    setFormData((prev) => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(categoryId)
        ? prev.categoryIds.filter((id) => id !== categoryId)
        : [...prev.categoryIds, categoryId],
    }));
  };

  const toNullIfEmpty = (value) => (value === "" ? null : value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.itemName.trim()) return toast.error("Item Name is required");
    if (!formData.itemHsn.trim()) return toast.error("HSN / SAC Code is required");
    if (!formData.baseUnit) return toast.error("Base Unit is required");
    if (!formData.taxRate) return toast.error("GST Rate is required");

    setLoading(true);
    setError(null);

    const payload = {
      itemName: formData.itemName.trim(),
      itemHsn: formData.itemHsn.trim(),
      itemCode: formData.itemCode || null,
      description: formData.description || null,
      itemType: formData.itemType,
      baseUnit: formData.baseUnit,
      secondaryUnit: toNullIfEmpty(formData.secondaryUnit),
      baseUnitToSecondaryUnit: formData.baseUnitToSecondaryUnit ? parseFloat(formData.baseUnitToSecondaryUnit) : 0,
      categoryIds: formData.categoryIds.map(Number),
      salePrice: parseFloat(formData.salePrice) || 0,
      saleTaxType: toNullIfEmpty(formData.saleTaxType),
      taxRate: formData.taxRate,
      saleDiscountPrice: parseFloat(formData.saleDiscountPrice) || 0,
      saleDiscountType: formData.saleDiscountPrice > 0 ? toNullIfEmpty(formData.saleDiscountType) : null,

      ...(formData.itemType === "PRODUCT" && {
        purchasePrice: parseFloat(formData.purchasePrice) || 0,
        purchaseTaxType: toNullIfEmpty(formData.purchaseTaxType),
        stockOpeningQty: parseFloat(formData.stockOpeningQty) || 0,
        stockPricePerQty: parseFloat(formData.stockPricePerQty) || 0,
        stockOpeningDate: formData.stockOpeningDate || null,
        minimumStockToMaintain: parseFloat(formData.minimumStockToMaintain) || 0,
        openingStockLocation: formData.openingStockLocation || null,
      }),
    };

    try {
      if (passedItem.itemId) {
        await api.put(`/item/${passedItem.itemId}`, payload);
        toast.success("Item updated successfully");
      } else {
        const endpoint =
          formData.itemType === "PRODUCT"
            ? `/company/${companyId}/create/product-item`
            : `/company/${companyId}/create/service-item`;

        await api.post(endpoint, payload);
        toast.success("Item created successfully");
      }
      navigate("/items");
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to save item.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const isEditMode = !!passedItem.itemId;

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.titleSection}>
              <h1 className={styles.title}>
                {isEditMode ? (
                  <>
                    <CheckCircle className={styles.titleIcon} />
                    Edit Item
                  </>
                ) : (
                  <>
                    <Package className={styles.titleIcon} />
                    Add Item
                  </>
                )}
              </h1>
              <p className={styles.subtitle}>
                {isEditMode ? "Update item details" : "Add a new product or service"}
              </p>
            </div>
          </div>
          <div className={styles.headerActions}>
            <button
              type="button"
              onClick={() => navigate("/items")}
              className={styles.buttonSecondary}
              disabled={loading}
            >
              <ArrowLeft size={18} />
              Back
            </button>
            <button type="submit" className={styles.buttonPrimary} disabled={loading}>
              {loading ? (
                <>
                  <Loader size={18} className={styles.spinnerSmall} />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle size={18} />
                  {isEditMode ? "Update Item" : "Create Item"}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className={styles.error}>
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {/* Basic Information */}
        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>
            <FileText size={20} />
            Basic Information
          </h2>

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Item Type</label>
              <select
                name="itemType"
                value={formData.itemType}
                onChange={handleInputChange}
                className={styles.input}
                disabled={isEditMode || loading}
              >
                <option value="PRODUCT">Product</option>
                <option value="SERVICE">Service</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                Item Name <span className={styles.required}>*</span>
              </label>
              <div className={styles.inputIcon}>
                <Tag size={18} />
                <input
                  name="itemName"
                  type="text"
                  value={formData.itemName}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="Required"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                HSN / SAC Code <span className={styles.required}>*</span>
              </label>
              <div className={styles.inputIcon}>
                <Hash size={18} />
                <input
                  name="itemHsn"
                  type="text"
                  value={formData.itemHsn}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="e.g. 30049099"
                  disabled={loading}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Item Code</label>
              <div className={styles.inputIcon}>
                <Box size={18} />
                <input
                  name="itemCode"
                  type="text"
                  value={formData.itemCode}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="Optional"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className={`${styles.input} ${styles.textarea}`}
              placeholder="Optional..."
              rows={3}
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Categories</label>
            <div className={styles.checkboxContainer}>
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <label key={cat.categoryId} className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={formData.categoryIds.includes(cat.categoryId)}
                      onChange={() => handleCategoryChange(cat.categoryId)}
                      disabled={loading}
                    />
                    <span className={styles.checkboxText}>{cat.categoryName}</span>
                  </label>
                ))
              ) : (
                <p className={styles.noDataText}>No categories available</p>
              )}
            </div>
          </div>
        </div>

        {/* Unit Details */}
        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>
            <Layers size={20} />
            Unit Details
          </h2>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Base Unit <span className={styles.required}>*</span>
              </label>
              <select
                name="baseUnit"
                value={formData.baseUnit}
                onChange={handleInputChange}
                className={styles.input}
                disabled={loading}
              >
                <option value="">Select Base Unit</option>
                {units.map((u) => (
                  <option key={u} value={u}>
                    {u.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Secondary Unit</label>
              <select
                name="secondaryUnit"
                value={formData.secondaryUnit}
                onChange={handleInputChange}
                className={styles.input}
                disabled={loading}
              >
                <option value="">None</option>
                {units.map((u) => (
                  <option key={u} value={u}>
                    {u.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {formData.secondaryUnit && (
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Conversion: 1 {formData.baseUnit?.toLowerCase()} = ?
              </label>
              <input
                name="baseUnitToSecondaryUnit"
                type="number"
                min="0"
                step="0.01"
                value={formData.baseUnitToSecondaryUnit}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="e.g. 12"
                disabled={loading}
              />
            </div>
          )}
        </div>

        {/* Pricing & Tax */}
        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>
            <DollarSign size={20} />
            Pricing & Tax
          </h2>

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Sale Price</label>
              <div className={styles.inputIcon}>
                <IndianRupee size={18} />
                <input
                  name="salePrice"
                  type="number"
                  step="0.01"
                  value={formData.salePrice}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="0.00"
                  disabled={loading}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Sale Tax Type</label>
              <select
                name="saleTaxType"
                value={formData.saleTaxType}
                onChange={handleInputChange}
                className={styles.input}
                disabled={loading}
              >
                <option value="">Not Selected</option>
                {taxTypes.map((t) => (
                  <option key={t} value={t}>
                    {t === "WITHTAX" ? "With Tax" : "Without Tax"}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                GST Rate <span className={styles.required}>*</span>
              </label>
              <select
                name="taxRate"
                value={formData.taxRate}
                onChange={handleInputChange}
                className={styles.input}
                disabled={loading}
              >
                <option value="">Select GST Rate</option>
                {taxRates.map((t) => (
                  <option key={t} value={t}>
                    {t.replace(/_/g, " ").replace("POINT", ".").replace("GST", "GST ").replace("IGST", "IGST ")}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Discount</label>
              <div className={styles.inputIcon}>
                <Percent size={18} />
                <input
                  name="saleDiscountPrice"
                  type="number"
                  step="0.01"
                  value={formData.saleDiscountPrice}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="Optional"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {formData.saleDiscountPrice > 0 && (
            <div className={styles.formGroup}>
              <label className={styles.label}>Discount Type</label>
              <select
                name="saleDiscountType"
                value={formData.saleDiscountType}
                onChange={handleInputChange}
                className={styles.input}
                disabled={loading}
              >
                <option value="">Select Type</option>
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="AMOUNT">Fixed Amount</option>
              </select>
            </div>
          )}
        </div>

        {/* Product Stock Details */}
        {formData.itemType === "PRODUCT" && (
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>
              <ShoppingCart size={20} />
              Product Stock Details (Optional)
            </h2>

            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Purchase Price</label>
                <div className={styles.inputIcon}>
                  <IndianRupee size={18} />
                  <input
                    name="purchasePrice"
                    type="number"
                    step="0.01"
                    value={formData.purchasePrice}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="0.00"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Purchase Tax Type</label>
                <select
                  name="purchaseTaxType"
                  value={formData.purchaseTaxType}
                  onChange={handleInputChange}
                  className={styles.input}
                  disabled={loading}
                >
                  <option value="">Not Selected</option>
                  {taxTypes.map((t) => (
                    <option key={t} value={t}>
                      {t === "WITHTAX" ? "With Tax" : "Without Tax"}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Opening Stock Qty</label>
                <input
                  name="stockOpeningQty"
                  type="number"
                  step="0.01"
                  value={formData.stockOpeningQty}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="0"
                  disabled={loading}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Cost Price Per Unit</label>
                <div className={styles.inputIcon}>
                  <IndianRupee size={18} />
                  <input
                    name="stockPricePerQty"
                    type="number"
                    step="0.01"
                    value={formData.stockPricePerQty}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="Optional"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Opening Stock Date</label>
                <div className={styles.inputIcon}>
                  <Calendar size={18} />
                  <input
                    name="stockOpeningDate"
                    type="date"
                    value={formData.stockOpeningDate}
                    onChange={handleInputChange}
                    className={styles.input}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Minimum Stock Alert</label>
                <input
                  name="minimumStockToMaintain"
                  type="number"
                  value={formData.minimumStockToMaintain}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="e.g. 10"
                  disabled={loading}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Stock Location</label>
              <div className={styles.inputIcon}>
                <MapPin size={18} />
                <input
                  name="openingStockLocation"
                  type="text"
                  value={formData.openingStockLocation}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="Optional"
                  disabled={loading}
                />
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default Add_Items;