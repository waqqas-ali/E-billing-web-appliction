// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import config from "../../../config/apiconfig";
// import styles from "./Item.module.css";
// import { toast } from "react-toastify";

// const Items = () => {
//   const navigate = useNavigate();
//   const ebillingData = JSON.parse(localStorage.getItem("eBilling")) || {};
//   const companyId = ebillingData?.selectedCompany?.id;
//   const token = ebillingData?.accessToken;

//   const [items, setItems] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [showProducts, setShowProducts] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");

//   // Fetch categories
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await axios.get(
//           `${config.BASE_URL}/company/${companyId}/categories`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         setCategories(response.data);
//       } catch (error) {
//         console.error("Failed to fetch categories:", error);
//         toast.error("Failed to fetch categories.");
//       }
//     };
//     fetchCategories();
//   }, [companyId, token]);

//   // Fetch items
//   useEffect(() => {
//     if (!token || !companyId) {
//       navigate("/login");
//       return;
//     }
//     const fetchItems = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const response = await axios.get(
//           `${config.BASE_URL}/company/${companyId}/items`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         setItems(response.data);
//         console.log("Fetched items:", response.data);
//       } catch (error) {
//         console.error("Error fetching items:", error);
//         setError(error.response?.data?.message || "Failed to fetch items.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchItems();
//   }, [companyId, token, navigate]);

//   // Handle delete item
//   const handleDeleteItem = async (itemId) => {
//     if (!window.confirm("Are you sure you want to delete this item?")) return;
//     try {
//       setLoading(true);
//       await axios.delete(`${config.BASE_URL}/item/${itemId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });
//       toast.success("Item deleted successfully");
//       setItems((prev) => prev.filter((item) => item.itemId !== itemId));
//     } catch (error) {
//       console.error("Error deleting item:", error);
//       toast.error("Failed to delete item.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Navigate to Add_Items for create/edit
//   const handleAddItem = (itemType) => {
//     navigate("/Add_items", { state: { companyId, token, categories, itemType } });
//   };

//   const handleEditItem = (item) => {
//     navigate("/Add_items", { state: { item, companyId, token, categories } });
//   };

//   // Filter items based on search term
//   const filteredItems = items.filter((item) =>
//     [item.itemName, item.itemHsn, item.itemCode, item.description]
//       .filter(Boolean)
//       .some((field) => field.toLowerCase().includes(searchTerm.toLowerCase()))
//   );

//   return (
//     <div className={styles["company-form-container"]}>
//       <div className={styles["form-header"]}>
//         <div>
//           <h1 className={styles["company-form-title"]}>Items</h1>
//           <p className={styles["form-subtitle"]}>
//             Manage your {showProducts ? "products" : "services"}
//           </p>
//         </div>
//         <button
//           onClick={() => handleAddItem(showProducts ? "PRODUCT" : "SERVICE")}
//           className={styles["submit-button"]}
//           disabled={loading}
//         >
//           <i className="fas fa-plus-circle"></i> Add {showProducts ? "Product" : "Service"}
//         </button>
//       </div>

//       {loading && (
//         <div className={styles["loading-message"]}>
//           <div className={styles.spinner}></div>
//           <p>Loading items...</p>
//         </div>
//       )}
//       {error && <div className={styles["error-message"]}>{error}</div>}

//       <div className={styles.actions}>
//         <div className={styles["search-wrapper"]}>
//           <i className="fas fa-search"></i>
//           <input
//             type="search"
//             placeholder="Search by name, HSN, code, or description..."
//             className={styles["search-input"]}
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             disabled={loading}
//           />
//         </div>
//         <div className={styles["filter-buttons"]}>
//           <button
//             onClick={() => setShowProducts(true)}
//             className={`${styles["filter-button"]} ${showProducts ? styles.active : ""}`}
//             disabled={loading}
//           >
//             Products
//           </button>
//           <button
//             onClick={() => setShowProducts(false)}
//             className={`${styles["filter-button"]} ${!showProducts ? styles.active : ""}`}
//             disabled={loading}
//           >
//             Services
//           </button>
//         </div>
//       </div>

//       {filteredItems.length > 0 ? (
//         <>
//           {/* Desktop Table View */}
//           <div className={styles["table-wrapper"]}>
//             <table className={styles.table}>
//               <thead>
//                 <tr>
//                   <th>ID</th>
//                   <th>Name</th>
//                   <th>HSN</th>
//                   <th>Code</th>
//                   <th>Description</th>
//                   <th>Categories</th>
//                   <th>Base Unit</th>
//                   <th>Secondary Unit</th>
//                   <th>Base to Secondary</th>
//                   <th>Sale Price</th>
//                   <th>Sale Tax Type</th>
//                   {showProducts && <th>Purchase Price</th>}
//                   {showProducts && <th>Purchase Tax Type</th>}
//                   <th>Tax Rate</th>
//                   <th>Discount Price</th>
//                   <th>Discount Type</th>
//                   {showProducts && <th>Stock Qty</th>}
//                   {showProducts && <th>Stock Price</th>}
//                   {showProducts && <th>Stock Date</th>}
//                   {showProducts && <th>Min Stock</th>}
//                   {showProducts && <th>Location</th>}
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredItems
//                   .filter((item) => item.itemType === (showProducts ? "PRODUCT" : "SERVICE"))
//                   .map((item) => (
//                     <tr key={item.itemId}>
//                       <td>{item.itemId}</td>
//                       <td>{item.itemName || "N/A"}</td>
//                       <td>{item.itemHsn || "N/A"}</td>
//                       <td>{item.itemCode || "N/A"}</td>
//                       <td>{item.description || "N/A"}</td>
//                       <td>
//                         {item.categories?.map((cat) => cat.categoryName).join(", ") || "None"}
//                       </td>
//                       <td>{item.baseUnit || "N/A"}</td>
//                       <td>{item.secondaryUnit || "N/A"}</td>
//                       <td>{item.baseUnitToSecondaryUnit || "N/A"}</td>
//                       <td>{item.salePrice || "N/A"}</td>
//                       <td>{item.saleTaxType || "N/A"}</td>
//                       {showProducts && <td>{item.purchasePrice || "N/A"}</td>}
//                       {showProducts && <td>{item.purchaseTaxType || "N/A"}</td>}
//                       <td>{item.taxRate || "N/A"}</td>
//                       <td>{item.saleDiscountPrice || "N/A"}</td>
//                       <td>{item.saleDiscountType || "N/A"}</td>
//                       {showProducts && <td>{item.stockOpeningQty || "N/A"}</td>}
//                       {showProducts && <td>{item.stockPrice || "N/A"}</td>}
//                       {showProducts && (
//                         <td>
//                           {item.stockOpeningDate
//                             ? new Date(item.stockOpeningDate).toLocaleDateString()
//                             : "N/A"}
//                         </td>
//                       )}
//                       {showProducts && <td>{item.minimumStockToMaintain || "N/A"}</td>}
//                       {showProducts && <td>{item.openingStockLocation || "N/A"}</td>}
//                       <td className={styles["actions-cell"]}>
//                         <button
//                           onClick={() => handleEditItem(item)}
//                           className={`${styles["action-button"]} ${styles["edit-button"]}`}
//                           disabled={loading}
//                         >
//                           <i className="fas fa-edit"></i> Edit
//                         </button>
//                         <button
//                           onClick={() => handleDeleteItem(item.itemId)}
//                           className={`${styles["action-button"]} ${styles["delete-button"]}`}
//                           disabled={loading}
//                         >
//                           <i className="fas fa-trash-alt"></i> Delete
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Mobile Card View */}
//           <div className={styles["cards-container"]}>
//             {filteredItems
//               .filter((item) => item.itemType === (showProducts ? "PRODUCT" : "SERVICE"))
//               .map((item) => (
//                 <div key={item.itemId} className={styles.card}>
//                   <div className={styles["card-header"]}>
//                     <h3 className={styles["card-title"]}>{item.itemName || "N/A"}</h3>
//                     <p className={styles["card-type"]}>
//                       {item.itemType
//                         ?.replace(/_/g, " ")
//                         .toLowerCase()
//                         .replace(/\b\w/g, (c) => c.toUpperCase()) || "N/A"}
//                     </p>
//                   </div>
//                   <div className={styles["card-content"]}>
//                     <div className={styles["card-detail"]}>
//                       <i className="fas fa-id-card"></i>
//                       <span>ID: {item.itemId}</span>
//                     </div>
//                     <div className={styles["card-detail"]}>
//                       <i className="fas fa-barcode"></i>
//                       <span>HSN: {item.itemHsn || "N/A"}</span>
//                     </div>
//                     <div className={styles["card-detail"]}>
//                       <i className="fas fa-code"></i>
//                       <span>Code: {item.itemCode || "N/A"}</span>
//                     </div>
//                     <div className={styles["card-detail"]}>
//                       <i className="fas fa-info-circle"></i>
//                       <span>Description: {item.description || "N/A"}</span>
//                     </div>
//                     <div className={styles["card-detail"]}>
//                       <i className="fas fa-tags"></i>
//                       <span>
//                         Categories: {item.categories?.map((cat) => cat.categoryName).join(", ") || "None"}
//                       </span>
//                     </div>
//                     <div className={styles["card-detail"]}>
//                       <i className="fas fa-box"></i>
//                       <span>Base Unit: {item.baseUnit || "N/A"}</span>
//                     </div>
//                     <div className={styles["card-detail"]}>
//                       <i className="fas fa-boxes"></i>
//                       <span>Secondary Unit: {item.secondaryUnit || "N/A"}</span>
//                     </div>
//                     <div className={styles["card-detail"]}>
//                       <i className="fas fa-exchange-alt"></i>
//                       <span>Base to Secondary: {item.baseUnitToSecondaryUnit || "N/A"}</span>
//                     </div>
//                     <div className={styles["card-detail"]}>
//                       <i className="fas fa-dollar-sign"></i>
//                       <span>Sale Price: {item.salePrice || "N/A"}</span>
//                     </div>
//                     <div className={styles["card-detail"]}>
//                       <i className="fas fa-percent"></i>
//                       <span>Sale Tax Type: {item.saleTaxType || "N/A"}</span>
//                     </div>
//                     {showProducts && (
//                       <>
//                         <div className={styles["card-detail"]}>
//                           <i className="fas fa-shopping-cart"></i>
//                           <span>Purchase Price: {item.purchasePrice || "N/A"}</span>
//                         </div>
//                         <div className={styles["card-detail"]}>
//                           <i className="fas fa-percent"></i>
//                           <span>Purchase Tax Type: {item.purchaseTaxType || "N/A"}</span>
//                         </div>
//                       </>
//                     )}
//                     <div className={styles["card-detail"]}>
//                       <i className="fas fa-tags"></i>
//                       <span>Tax Rate: {item.taxRate || "N/A"}</span>
//                     </div>
//                     <div className={styles["card-detail"]}>
//                       <i className="fas fa-tag"></i>
//                       <span>Discount Price: {item.saleDiscountPrice || "N/A"}</span>
//                     </div>
//                     <div className={styles["card-detail"]}>
//                       <i className="fas fa-percentage"></i>
//                       <span>Discount Type: {item.saleDiscountType || "N/A"}</span>
//                     </div>
//                     {showProducts && (
//                       <>
//                         <div className={styles["card-detail"]}>
//                           <i className="fas fa-warehouse"></i>
//                           <span>Stock Qty: {item.stockOpeningQty || "N/A"}</span>
//                         </div>
//                         <div className={styles["card-detail"]}>
//                           <i className="fas fa-dollar-sign"></i>
//                           <span>Stock Price: {item.stockPrice || "N/A"}</span>
//                         </div>
//                         <div className={styles["card-detail"]}>
//                           <i className="fas fa-calendar-alt"></i>
//                           <span>
//                             Stock Date: {item.stockOpeningDate
//                               ? new Date(item.stockOpeningDate).toLocaleDateString()
//                               : "N/A"}
//                           </span>
//                         </div>
//                         <div className={styles["card-detail"]}>
//                           <i className="fas fa-exclamation-circle"></i>
//                           <span>Min Stock: {item.minimumStockToMaintain || "N/A"}</span>
//                         </div>
//                         <div className={styles["card-detail"]}>
//                           <i className="fas fa-map-marker-alt"></i>
//                           <span>Location: {item.openingStockLocation || "N/A"}</span>
//                         </div>
//                       </>
//                     )}
//                   </div>
//                   <div className={styles["card-actions"]}>
//                     <button
//                       onClick={() => handleEditItem(item)}
//                       className={`${styles["card-action-button"]} ${styles["edit-button"]}`}
//                       disabled={loading}
//                     >
//                       <i className="fas fa-edit"></i> Edit
//                     </button>
//                     <button
//                       onClick={() => handleDeleteItem(item.itemId)}
//                       className={`${styles["card-action-button"]} ${styles["delete-button"]}`}
//                       disabled={loading}
//                     >
//                       <i className="fas fa-trash-alt"></i> Delete
//                     </button>
//                   </div>
//                 </div>
//               ))}
//           </div>
//         </>
//       ) : (
//         <div className={styles["no-data"]}>
//           <i className="fas fa-inbox"></i>
//           <p>No {showProducts ? "products" : "services"} found.</p>
//           <p className={styles["no-data-subtitle"]}>
//             Click "Add {showProducts ? "Product" : "Service"}" to create one!
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Items;














// // src/pages/items/Items.jsx
// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import config from "../../../config/apiconfig";
// import styles from "./Item.module.css"; // Reuse Expense.module.css
// import { toast } from "react-toastify";

// const Items = () => {
//   const navigate = useNavigate();
//   const ebillingData = JSON.parse(localStorage.getItem("eBilling") || "{}");
//   const companyId = ebillingData?.selectedCompany?.id;
//   const token = ebillingData?.accessToken;

//   const [items, setItems] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [showProducts, setShowProducts] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedItem, setSelectedItem] = useState(null);

//   // Fetch categories
//   useEffect(() => {
//     const fetchCategories = async () => {
//       if (!token || !companyId) return;
//       try {
//         const response = await axios.get(
//           `${config.BASE_URL}/company/${companyId}/categories`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         setCategories(response.data);
//       } catch (error) {
//         console.error("Failed to fetch categories:", error);
//         toast.error("Failed to fetch categories.");
//       }
//     };
//     fetchCategories();
//   }, [companyId, token]);

//   // Fetch items
//   useEffect(() => {
//     if (!token || !companyId) {
//       navigate("/login");
//       return;
//     }
//     const fetchItems = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const response = await axios.get(
//           `${config.BASE_URL}/company/${companyId}/items`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         setItems(response.data);
//       } catch (error) {
//         setError(error.response?.data?.message || "Failed to fetch items.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchItems();
//   }, [companyId, token, navigate]);

//   // Handle delete item
//   const handleDeleteItem = async (itemId) => {
//     if (!window.confirm("Are you sure you want to delete this item?")) return;
//     try {
//       setLoading(true);
//       await axios.delete(`${config.BASE_URL}/item/${itemId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });
//       toast.success("Item deleted successfully");
//       setItems((prev) => prev.filter((item) => item.itemId !== itemId));
//     } catch (error) {
//       toast.error("Failed to delete item.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Navigate to Add_Items
//   const handleAddItem = (itemType) => {
//     navigate("/Add_items", { state: { companyId, token, categories, itemType } });
//   };

//   const handleEditItem = (item) => {
//     navigate("/Add_items", { state: { item, companyId, token, categories } });
//   };

//   // Filter items
//   const filteredItems = items
//     .filter((item) =>
//       [item.itemName, item.itemHsn, item.itemCode, item.description]
//         .filter(Boolean)
//         .some((field) => field.toLowerCase().includes(searchTerm.toLowerCase()))
//     )
//     .filter((item) => item.itemType === (showProducts ? "PRODUCT" : "SERVICE"));

//   return (
//     <div className={styles.container}>
//       {/* Header */}
//       <div className={styles.header}>
//         <div>
//           <h1 className={styles.title}>Items</h1>
//           <p className={styles.subtitle}>
//             Manage your {showProducts ? "products" : "services"}
//           </p>
//         </div>
//         <button
//           onClick={() => handleAddItem(showProducts ? "PRODUCT" : "SERVICE")}
//           className={styles.createBtn}
//           disabled={loading}
//         >
//           + Add {showProducts ? "Product" : "Service"}
//         </button>
//       </div>

//       {/* Search & Filter */}
//       <div className={styles.actions}>
//         <div className={styles.searchWrapper}>
//           <i className="fas fa-search"></i>
//           <input
//             type="search"
//             placeholder="Search by name, HSN, code, or description..."
//             className={styles.searchInput}
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             disabled={loading}
//           />
//         </div>
//         <div className={styles["filter-buttons"]}>
//           <button
//             onClick={() => setShowProducts(true)}
//             className={`${styles["filter-button"]} ${showProducts ? styles.active : ""}`}
//             disabled={loading}
//           >
//             Products
//           </button>
//           <button
//             onClick={() => setShowProducts(false)}
//             className={`${styles["filter-button"]} ${!showProducts ? styles.active : ""}`}
//             disabled={loading}
//           >
//             Services
//           </button>
//         </div>
//       </div>

//       {/* Loading */}
//       {loading && (
//         <div className={styles.loading}>
//           <div className={styles.spinner}>Loading</div>
//           <p>Loading items...</p>
//         </div>
//       )}

//       {/* Error */}
//       {error && <div className={styles.error}>{error}</div>}

//       {/* Desktop Table */}
//       {!loading && filteredItems.length > 0 && (
//         <div className={styles.tableContainer}>
//           <table className={styles.table}>
//             <thead>
//               <tr>
//                 <th>ID</th>
//                 <th>Name</th>
//                 <th>HSN</th>
//                 <th>Code</th>
//                 <th>Base Unit</th>
//                 <th>Sale Price</th>
//                 {showProducts && <th>Purchase Price</th>}
//                 <th>Tax Rate</th>
//                 {showProducts && <th>Stock Qty</th>}
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredItems.map((item) => (
//                 <tr key={item.itemId}>
//                   <td className={styles.nameCell}>{item.itemId}</td>
//                   <td>{item.itemName || "—"}</td>
//                   <td>{item.itemHsn || "—"}</td>
//                   <td>{item.itemCode || "—"}</td>
//                   <td>{item.baseUnit || "—"}</td>
//                   <td>₹{item.salePrice || "0"}</td>
//                   {showProducts && <td>₹{item.purchasePrice || "0"}</td>}
//                   <td>{item.taxRate || "—"}</td>
//                   {showProducts && <td>{item.stockOpeningQty || "0"}</td>}
//                   <td className={styles.actionsCell}>
//                     <button
//                       onClick={() => setSelectedItem(item)}
//                       className={styles.editBtn}
//                       title="View"
//                     >
//                       View
//                     </button>
//                     <button
//                       onClick={() => handleEditItem(item)}
//                       className={styles.editBtn}
//                       title="Edit"
//                     >
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => handleDeleteItem(item.itemId)}
//                       className={styles.deleteBtn}
//                       title="Delete"
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Mobile Cards */}
//       {!loading && filteredItems.length > 0 && (
//         <div className={styles.cards}>
//           {filteredItems.map((item) => (
//             <div key={item.itemId} className={styles.card}>
//               <div className={styles.cardHeader}>
//                 <h3 className={styles.cardTitle}>{item.itemName || "Unnamed"}</h3>
//                 <span className={styles.cardBadge}>{item.itemType}</span>
//               </div>
//               <div className={styles.cardBody}>
//                 <div className={styles.cardRow}>
//                   <strong>ID:</strong> {item.itemId}
//                 </div>
//                 <div className={styles.cardRow}>
//                   <strong>HSN:</strong> {item.itemHsn || "—"}
//                 </div>
//                 <div className={styles.cardRow}>
//                   <strong>Code:</strong> {item.itemCode || "—"}
//                 </div>
//                 <div className={styles.cardRow}>
//                   <strong>Sale Price:</strong> ₹{item.salePrice || "0"}
//                 </div>
//                 {showProducts && (
//                   <>
//                     <div className={styles.cardRow}>
//                       <strong>Purchase Price:</strong> ₹{item.purchasePrice || "0"}
//                     </div>
//                     <div className={styles.cardRow}>
//                       <strong>Stock:</strong> {item.stockOpeningQty || "0"}
//                     </div>
//                   </>
//                 )}
//               </div>
//               <div className={styles.cardFooter}>
//                 <button
//                   onClick={() => setSelectedItem(item)}
//                   className={styles.cardEdit}
//                 >
//                   View
//                 </button>
//                 <button
//                   onClick={() => handleEditItem(item)}
//                   className={styles.cardEdit}
//                 >
//                   Edit
//                 </button>
//                 <button
//                   onClick={() => handleDeleteItem(item.itemId)}
//                   className={styles.cardDelete}
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Empty State */}
//       {!loading && filteredItems.length === 0 && (
//         <div className={styles.empty}>
//           <div className={styles.emptyIcon}>Empty</div>
//           <p>No {showProducts ? "products" : "services"} found</p>
//           <p className={styles.emptySub}>
//             Click "Add {showProducts ? "Product" : "Service"}" to create one.
//           </p>
//         </div>
//       )}

//       {/* View Modal */}
//       {selectedItem && (
//         <div className={styles.modalOverlay} onClick={() => setSelectedItem(null)}>
//           <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
//             <div className={styles.modalHeader}>
//               <h2 className={styles.modalTitle}>Item #{selectedItem.itemId}</h2>
//               <button className={styles.closeBtn} onClick={() => setSelectedItem(null)}>
//                 Close
//               </button>
//             </div>

//             <div className={styles.modalForm}>
//               <section className={styles.section}>
//                 <h3 className={styles.sectionTitle}>Basic Info</h3>
//                 <div className={styles.formGrid}>
//                   <div className={styles.formGroup}>
//                     <label>Name</label>
//                     <input type="text" value={selectedItem.itemName || "—"} readOnly />
//                   </div>
//                   <div className={styles.formGroup}>
//                     <label>HSN</label>
//                     <input type="text" value={selectedItem.itemHsn || "—"} readOnly />
//                   </div>
//                   <div className={styles.formGroup}>
//                     <label>Code</label>
//                     <input type="text" value={selectedItem.itemCode || "—"} readOnly />
//                   </div>
//                   <div className={styles.formGroup}>
//                     <label>Type</label>
//                     <input type="text" value={selectedItem.itemType || "—"} readOnly />
//                   </div>
//                   <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
//                     <label>Description</label>
//                     <textarea value={selectedItem.description || "—"} readOnly rows={2} />
//                   </div>
//                 </div>
//               </section>

//               <section className={styles.section}>
//                 <h3 className={styles.sectionTitle}>Pricing & Tax</h3>
//                 <div className={styles.formGrid}>
//                   <div className={styles.formGroup}>
//                     <label>Sale Price</label>
//                     <input type="text" value={`₹${selectedItem.salePrice || "0"}`} readOnly />
//                   </div>
//                   <div className={styles.formGroup}>
//                     <label>Sale Tax Type</label>
//                     <input type="text" value={selectedItem.saleTaxType || "—"} readOnly />
//                   </div>
//                   {showProducts && (
//                     <>
//                       <div className={styles.formGroup}>
//                         <label>Purchase Price</label>
//                         <input type="text" value={`₹${selectedItem.purchasePrice || "0"}`} readOnly />
//                       </div>
//                       <div className={styles.formGroup}>
//                         <label>Purchase Tax Type</label>
//                         <input type="text" value={selectedItem.purchaseTaxType || "—"} readOnly />
//                       </div>
//                     </>
//                   )}
//                   <div className={styles.formGroup}>
//                     <label>Tax Rate</label>
//                     <input type="text" value={selectedItem.taxRate || "—"} readOnly />
//                   </div>
//                   <div className={styles.formGroup}>
//                     <label>Discount</label>
//                     <input type="text" value={`${selectedItem.saleDiscountPrice || "0"} (${selectedItem.saleDiscountType || "—"})`} readOnly />
//                   </div>
//                 </div>
//               </section>

//               {showProducts && (
//                 <section className={styles.section}>
//                   <h3 className={styles.sectionTitle}>Stock</h3>
//                   <div className={styles.formGrid}>
//                     <div className={styles.formGroup}>
//                       <label>Opening Qty</label>
//                       <input type="text" value={selectedItem.stockOpeningQty || "0"} readOnly />
//                     </div>
//                     <div className={styles.formGroup}>
//                       <label>Stock Price</label>
//                       <input type="text" value={`₹${selectedItem.stockPrice || "0"}`} readOnly />
//                     </div>
//                     <div className={styles.formGroup}>
//                       <label>Stock Date</label>
//                       <input
//                         type="text"
//                         value={
//                           selectedItem.stockOpeningDate
//                             ? new Date(selectedItem.stockOpeningDate).toLocaleDateString()
//                             : "—"
//                         }
//                         readOnly
//                       />
//                     </div>
//                     <div className={styles.formGroup}>
//                       <label>Min Stock</label>
//                       <input type="text" value={selectedItem.minimumStockToMaintain || "0"} readOnly />
//                     </div>
//                     <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
//                       <label>Location</label>
//                       <input type="text" value={selectedItem.openingStockLocation || "—"} readOnly />
//                     </div>
//                   </div>
//                 </section>
//               )}

//               <section className={styles.section}>
//                 <h3 className={styles.sectionTitle}>Units</h3>
//                 <div className={styles.formGrid}>
//                   <div className={styles.formGroup}>
//                     <label>Base Unit</label>
//                     <input type="text" value={selectedItem.baseUnit || "—"} readOnly />
//                   </div>
//                   <div className={styles.formGroup}>
//                     <label>Secondary Unit</label>
//                     <input type="text" value={selectedItem.secondaryUnit || "—"} readOnly />
//                   </div>
//                   <div className={styles.formGroup}>
//                     <label>Conversion</label>
//                     <input type="text" value={selectedItem.baseUnitToSecondaryUnit || "—"} readOnly />
//                   </div>
//                 </div>
//               </section>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Items;








// // src/pages/items/Items.jsx
// "use client";

// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import config from "../../../config/apiconfig";
// import styles from "../Styles/ScreenUI.module.css"; // Using same styles as SalesList
// import { toast } from "react-toastify";
// import {
//   Plus,
//   Eye,
//   Edit2,
//   Trash2,
//   X,
//   Package,
//   Search,
//   Loader,
//   ChevronDown,
//   AlertCircle,
//   CheckCircle,
// } from "lucide-react";

// const Items = () => {
//   // const navigate = useNavigate();
//   // const ebillingData = JSON.parse(localStorage.getItem("eBilling") || "{})
//   // const companyId = ebillingData?.selectedCompany?.id;
//   // const token = ebillingData?.accessToken;
//     const navigate = useNavigate();
//   const ebillingData = JSON.parse(localStorage.getItem("eBilling") || "{}");
//   const companyId = ebillingData?.selectedCompany?.id;
//   const token = ebillingData?.accessToken;

//   const [items, setItems] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [showProducts, setShowProducts] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedItem, setSelectedItem] = useState(null);

//   // Fetch categories
//   useEffect(() => {
//     const fetchCategories = async () => {
//       if (!token || !companyId) return;
//       try {
//         const response = await axios.get(
//           `${config.BASE_URL}/company/${companyId}/categories`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         setCategories(response.data);
//       } catch (error) {
//         console.error("Failed to fetch categories:", error);
//         toast.error("Failed to fetch categories.");
//       }
//     };
//     fetchCategories();
//   }, [companyId, token]);

//   // Fetch items
//   useEffect(() => {
//     if (!token || !companyId) {
//       navigate("/login");
//       return;
//     }
//     const fetchItems = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const response = await axios.get(
//           `${config.BASE_URL}/company/${companyId}/items`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         setItems(response.data);
//       } catch (error) {
//         setError(error.response?.data?.message || "Failed to fetch items.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchItems();
//   }, [companyId, token, navigate]);

//   // Handle delete item
//   const handleDeleteItem = async (itemId) => {
//     if (!window.confirm("Are you sure you want to delete this item?")) return;
//     try {
//       setLoading(true);
//       await axios.delete(`${config.BASE_URL}/item/${itemId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });
//       toast.success("Item deleted successfully");
//       setItems((prev) => prev.filter((item) => item.itemId !== itemId));
//     } catch (error) {
//       toast.error("Failed to delete item.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Navigate to Add_Items
//   const handleAddItem = (itemType) => {
//     navigate("/Add_items", { state: { companyId, token, categories, itemType } });
//   };

//   const handleEditItem = (item) => {
//     navigate("/Add_items", { state: { item, companyId, token, categories } });
//   };

//   // Filter items
//   const filteredItems = items
//     .filter((item) =>
//       [item.itemName, item.itemHsn, item.itemCode, item.description]
//         .filter(Boolean)
//         .some((field) => field.toLowerCase().includes(searchTerm.toLowerCase()))
//     )
//     .filter((item) => item.itemType === (showProducts ? "PRODUCT" : "SERVICE"));

//   return (
//     <div className={styles["company-form-container"]}>
//       {/* HEADER */}
//       <div className={styles["form-header"]}>
//         <div className={styles["header-content"]}>
//           <div className={styles["header-icon"]}>
//             <Package size={32} style={{ color: "var(--primary-color)" }} />
//           </div>
//           <div className={styles["header-text"]}>
//             <h1 className={styles["company-form-title"]}>Items</h1>
//             <p className={styles["form-subtitle"]}>
//               Manage your {showProducts ? "products" : "services"}
//             </p>
//           </div>
//         </div>
//         <button
//           onClick={() => handleAddItem(showProducts ? "PRODUCT" : "SERVICE")}
//           className={styles["submit-button"]}
//           disabled={loading}
//         >
//           <Plus size={18} />
//           <span>Add {showProducts ? "Product" : "Service"}</span>
//         </button>
//       </div>

//       {/* SEARCH & TABS */}
//       <div className={styles["search-container"]}>
//         <Search size={18} className={styles["search-icon"]} />
//         <input
//           type="text"
//           placeholder="Search by name, HSN, code, or description..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className={styles["search-input"]}
//           disabled={loading}
//         />
//       </div>

//       <div style={{ margin: "16px 0", display: "flex", gap: "12px" }}>
//         <button
//           onClick={() => setShowProducts(true)}
//           className={`${styles["submit-button"]} ${showProducts ? styles["active-tab"] : ""}`}
//           style={{ width: "auto", padding: "8px 16px", fontSize: "0.9rem" }}
//           disabled={loading}
//         >
//           Products
//         </button>
//         <button
//           onClick={() => setShowProducts(false)}
//           className={`${styles["submit-button"]} ${!showProducts ? styles["active-tab"] : ""}`}
//           style={{ width: "auto", padding: "8px 16px", fontSize: "0.9rem" }}
//           disabled={loading}
//         >
//           Services
//         </button>
//       </div>

//       {/* LOADING */}
//       {loading && (
//         <div className={styles["loading-message"]}>
//           <Loader size={32} className={styles["spinner"]} />
//           <p>Loading items...</p>
//         </div>
//       )}

//       {/* ERROR */}
//       {error && (
//         <div className={styles["no-data"]}>
//           <AlertCircle size={48} style={{ color: "#e74c3c" }} />
//           <p>{error}</p>
//         </div>
//       )}

//       {/* TABLE / CARDS */}
//       {filteredItems.length > 0 ? (
//         <>
//           {/* Desktop Table */}
//           <div className={styles["table-wrapper"]}>
//             <table className={styles.table}>
//               <thead>
//                 <tr>
//                   <th>ID</th>
//                   <th>Name</th>
//                   <th>HSN</th>
//                   <th>Code</th>
//                   <th>Base Unit</th>
//                   <th>Sale Price</th>
//                   {showProducts && <th>Purchase Price</th>}
//                   <th>Tax Rate</th>
//                   {showProducts && <th>Stock Qty</th>}
//                   <th>Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredItems.map((item) => (
//                   <tr key={item.itemId} className={styles["table-row"]}>
//                     <td className={styles["invoice-cell"]}>
//                       <span className={styles["invoice-badge"]}>{item.itemId}</span>
//                     </td>
//                     <td>
//                       <span className={styles["party-name"]}>{item.itemName || "—"}</span>
//                     </td>
//                     <td>{item.itemHsn || "—"}</td>
//                     <td>{item.itemCode || "—"}</td>
//                     <td>{item.baseUnit || "—"}</td>
//                     <td className={styles["amount-cell"]}>
//                       <span className={styles["amount"]}>₹{item.salePrice || "0"}</span>
//                     </td>
//                     {showProducts && (
//                       <td className={styles["received-cell"]}>₹{item.purchasePrice || "0"}</td>
//                     )}
//                     <td>{item.taxRate || "—"}</td>
//                     {showProducts && <td>{item.stockOpeningQty || "0"}</td>}
//                     <td className={styles["actions-cell"]}>
//                       <button
//                         onClick={() => setSelectedItem(item)}
//                         className={`${styles["action-button"]} ${styles["view-button"]}`}
//                         title="View"
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
//             {filteredItems.map((item) => (
//               <div key={item.itemId} className={styles["invoice-card"]}>
//                 <div className={styles["card-header-mobile"]}>
//                   <div className={styles["card-title-section"]}>
//                     <h3 className={styles["card-invoice-number"]}>{item.itemName || "Unnamed"}</h3>
//                     <span className={styles["status-badge"]}>{item.itemType}</span>
//                   </div>
//                   <button
//                     onClick={() => setSelectedItem(item)}
//                     className={styles["card-action-button"]}
//                   >
//                     <ChevronDown size={20} />
//                   </button>
//                 </div>

//                 <div className={styles["card-body"]}>
//                   <div className={styles["card-info-row"]}>
//                     <span className={styles["info-label"]}>ID:</span>
//                     <span className={styles["info-value"]}>{item.itemId}</span>
//                   </div>
//                   <div className={styles["card-info-row"]}>
//                     <span className={styles["info-label"]}>HSN:</span>
//                     <span className={styles["info-value"]}>{item.itemHsn || "—"}</span>
//                   </div>
//                   <div className={styles["card-info-row"]}>
//                     <span className={styles["info-label"]}>Code:</span>
//                     <span className={styles["info-value"]}>{item.itemCode || "—"}</span>
//                   </div>
//                   <div className={styles["card-info-row"]}>
//                     <span className={styles["info-label"]}>Sale Price:</span>
//                     <span className={styles["info-value-amount"]}>₹{item.salePrice || "0"}</span>
//                   </div>
//                   {showProducts && (
//                     <>
//                       <div className={styles["card-info-row"]}>
//                         <span className={styles["info-label"]}>Purchase Price:</span>
//                         <span className={styles["info-value"]}>₹{item.purchasePrice || "0"}</span>
//                       </div>
//                       <div className={styles["card-info-row"]}>
//                         <span className={styles["info-label"]}>Stock:</span>
//                         <span className={styles["info-value"]}>{item.stockOpeningQty || "0"}</span>
//                       </div>
//                     </>
//                   )}
//                 </div>

//                 <div className={styles["card-footer"]}>
//                   <button
//                     onClick={() => setSelectedItem(item)}
//                     className={styles["card-view-button"]}
//                   >
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
//             <p>No {showProducts ? "products" : "services"} found</p>
//             <p className={styles["no-data-subtitle"]}>
//               {searchTerm
//                 ? "Try adjusting your search"
//                 : `Click "Add ${showProducts ? "Product" : "Service"}" to create one.`}
//             </p>
//           </div>
//         )
//       )}

//       {/* VIEW MODAL */}
//       {selectedItem && (
//         <div className={styles["modal-overlay"]} onClick={() => setSelectedItem(null)}>
//           <div className={styles["detail-card"]} onClick={(e) => e.stopPropagation()}>
//             <div className={styles["card-header"]}>
//               <div className={styles["header-title-section"]}>
//                 <h3>Item #{selectedItem.itemId}</h3>
//                 <div className={styles["balance-badge"]}>
//                   {selectedItem.itemType === "PRODUCT" ? (
//                     <>
//                       <Package size={16} />
//                       Product
//                     </>
//                   ) : (
//                     <>
//                       <CheckCircle size={16} />
//                       Service
//                     </>
//                   )}
//                 </div>
//               </div>
//               <div className={styles["header-actions"]}>
//                 <button
//                   onClick={() => handleEditItem(selectedItem)}
//                   className={`${styles["action-button"]} ${styles["edit-button"]}`}
//                   title="Edit item"
//                 >
//                   <Edit2 size={16} />
//                   <span>Edit</span>
//                 </button>
//                 <button
//                   onClick={() => handleDeleteItem(selectedItem.itemId)}
//                   className={`${styles["action-button"]} ${styles["delete-button"]}`}
//                   title="Delete item"
//                 >
//                   <Trash2 size={16} />
//                   <span>Delete</span>
//                 </button>
//                 <button
//                   className={styles["close-modal-btn"]}
//                   onClick={() => setSelectedItem(null)}
//                   title="Close"
//                 >
//                   <X size={20} />
//                 </button>
//               </div>
//             </div>

//             {/* Basic Info */}
//             <section className={styles["card-section"]}>
//               <h4 className={styles["section-title"]}>Basic Info</h4>
//               <div className={styles["detail-grid"]}>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>Name:</span>
//                   <span className={styles["detail-value"]}>{selectedItem.itemName || "—"}</span>
//                 </div>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>HSN:</span>
//                   <span className={styles["detail-value"]}>{selectedItem.itemHsn || "—"}</span>
//                 </div>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>Code:</span>
//                   <span className={styles["detail-value"]}>{selectedItem.itemCode || "—"}</span>
//                 </div>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>Type:</span>
//                   <span className={styles["detail-value"]}>{selectedItem.itemType}</span>
//                 </div>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>Description:</span>
//                   <span className={styles["detail-value"]}>{selectedItem.description || "—"}</span>
//                 </div>
//               </div>
//             </section>

//             {/* Pricing & Tax */}
//             <section className={styles["card-section"]}>
//               <h4 className={styles["section-title"]}>Pricing & Tax</h4>
//               <div className={styles["detail-grid"]}>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>Sale Price:</span>
//                   <span className={styles["detail-value"]}>₹{selectedItem.salePrice || "0"}</span>
//                 </div>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>Sale Tax Type:</span>
//                   <span className={styles["detail-value"]}>{selectedItem.saleTaxType || "—"}</span>
//                 </div>
//                 {showProducts && (
//                   <>
//                     <div className={styles["detail-item"]}>
//                       <span className={styles["detail-label"]}>Purchase Price:</span>
//                       <span className={styles["detail-value"]}>₹{selectedItem.purchasePrice || "0"}</span>
//                     </div>
//                     <div className={styles["detail-item"]}>
//                       <span className={styles["detail-label"]}>Purchase Tax Type:</span>
//                       <span className={styles["detail-value"]}>{selectedItem.purchaseTaxType || "—"}</span>
//                     </div>
//                   </>
//                 )}
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>Tax Rate:</span>
//                   <span className={styles["detail-value"]}>{selectedItem.taxRate || "—"}</span>
//                 </div>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>Discount:</span>
//                   <span className={styles["detail-value"]}>
//                     {selectedItem.saleDiscountPrice || "0"} ({selectedItem.saleDiscountType || "—"})
//                   </span>
//                 </div>
//               </div>
//             </section>

//             {/* Stock (Products only) */}
//             {showProducts && (
//               <section className={styles["card-section"]}>
//                 <h4 className={styles["section-title"]}>Stock</h4>
//                 <div className={styles["detail-grid"]}>
//                   <div className={styles["detail-item"]}>
//                     <span className={styles["detail-label"]}>Opening Qty:</span>
//                     <span className={styles["detail-value"]}>{selectedItem.stockOpeningQty || "0"}</span>
//                   </div>
//                   <div className={styles["detail-item"]}>
//                     <span className={styles["detail-label"]}>Stock Price:</span>
//                     <span className={styles["detail-value"]}>₹{selectedItem.stockPrice || "0"}</span>
//                   </div>
//                   <div className={styles["detail-item"]}>
//                     <span className={styles["detail-label"]}>Stock Date:</span>
//                     <span className={styles["detail-value"]}>
//                       {selectedItem.stockOpeningDate
//                         ? new Date(selectedItem.stockOpeningDate).toLocaleDateString()
//                         : "—"}
//                     </span>
//                   </div>
//                   <div className={styles["detail-item"]}>
//                     <span className={styles["detail-label"]}>Min Stock:</span>
//                     <span className={styles["detail-value"]}>{selectedItem.minimumStockToMaintain || "0"}</span>
//                   </div>
//                   <div className={styles["detail-item"]}>
//                     <span className={styles["detail-label"]}>Location:</span>
//                     <span className={styles["detail-value"]}>{selectedItem.openingStockLocation || "—"}</span>
//                   </div>
//                 </div>
//               </section>
//             )}

//             {/* Units */}
//             <section className={styles["card-section"]}>
//               <h4 className={styles["section-title"]}>Units</h4>
//               <div className={styles["detail-grid"]}>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>Base Unit:</span>
//                   <span className={styles["detail-value"]}>{selectedItem.baseUnit || "—"}</span>
//                 </div>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>Secondary Unit:</span>
//                   <span className={styles["detail-value"]}>{selectedItem.secondaryUnit || "—"}</span>
//                 </div>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>Conversion:</span>
//                   <span className={styles["detail-value"]}>{selectedItem.baseUnitToSecondaryUnit || "—"}</span>
//                 </div>
//               </div>
//             </section>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Items;











// "use client";

// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import config from "../../../config/apiconfig";
// import styles from "../Styles/ScreenUI.module.css";
// import { toast } from "react-toastify";
// import {
//   Plus,
//   Eye,
//   Edit2,
//   Trash2,
//   X,
//   Package,
//   Search,
//   Loader,
//   ChevronDown,
//   AlertCircle,
//   CheckCircle,
//   ArrowUpDown,
// } from "lucide-react";

// const Items = () => {
//   const navigate = useNavigate();
//   const ebillingData = JSON.parse(localStorage.getItem("eBilling") || "{}");
//   const companyId = ebillingData?.selectedCompany?.id;
//   const token = ebillingData?.accessToken;

//   const [items, setItems] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [showProducts, setShowProducts] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [showStockModal, setShowStockModal] = useState(false);

//   // Stock Update Form State
//   const [stockForm, setStockForm] = useState({
//     transactionDate: new Date().toISOString().split("T")[0],
//     quantity: "",
//     pricePerUnit: "",
//     operationType: "ADD_STOCK",
//   });

//   const operationTypes = [
//     "ADD_STOCK",
//     "REDUCE_STOCK",
//     "PURCHASE",
//     "SALE",
//     "OPENING_STOCK",
//     "CREDIT_NOTE",
//     "DEBIT_NOTE",
//     "PURCHASE_ORDER",
//     "SALE_ORDER",
//     "DELIVERY_CHALLAN",
//     "QUOTATION",
//   ];

//   // Fetch categories
//   useEffect(() => {
//     const fetchCategories = async () => {
//       if (!token || !companyId) return;
//       try {
//         const response = await axios.get(
//           `${config.BASE_URL}/company/${companyId}/categories`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         setCategories(response.data);
//       } catch (error) {
//         console.error("Failed to fetch categories:", error);
//       }
//     };
//     fetchCategories();
//   }, [companyId, token]);

//   // Fetch items
//   useEffect(() => {
//     if (!token || !companyId) {
//       navigate("/login");
//       return;
//     }
//     const fetchItems = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const response = await axios.get(
//           `${config.BASE_URL}/company/${companyId}/items`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         setItems(response.data);
//       } catch (error) {
//         setError(error.response?.data?.message || "Failed to fetch items.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchItems();
//   }, [companyId, token, navigate]);

//   // Delete Item
//   const handleDeleteItem = async (itemId) => {
//     if (!window.confirm("Are you sure you want to delete this item?")) return;
//     try {
//       setLoading(true);
//       await axios.delete(`${config.BASE_URL}/item/${itemId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       toast.success("Item deleted successfully");
//       setItems((prev) => prev.filter((item) => item.itemId !== itemId));
//       setSelectedItem(null);
//     } catch (error) {
//       toast.error("Failed to delete item.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Open Stock Update Modal
//   const openStockModal = (item) => {
//     setSelectedItem(item);
//     setStockForm({
//       transactionDate: new Date().toISOString().split("T")[0],
//       quantity: "",
//       pricePerUnit: item.purchasePrice || "",
//       operationType: "ADD_STOCK",
//     });
//     setShowStockModal(true);
//   };

//   // Handle Stock Update
//   const handleStockUpdate = async (e) => {
//     e.preventDefault();
//     if (!selectedItem) return;

//     const qty = parseFloat(stockForm.quantity);
//     if (!qty || qty <= 0) {
//       toast.error("Please enter a valid quantity");
//       return;
//     }

//     const payload = {
//       transactionDate: stockForm.transactionDate,
//       quantity: qty,
//       pricePerUnit: parseFloat(stockForm.pricePerUnit) || 0,
//       operationType: stockForm.operationType,
//     };

//     try {
//       setLoading(true);
//       await axios.post(
//         `${config.BASE_URL}/item/${selectedItem.itemId}/stock/update`,
//         payload,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       toast.success("Stock updated successfully!");
//       setShowStockModal(false);
//       setSelectedItem(null);

//       // Refresh items list
//       const res = await axios.get(
//         `${config.BASE_URL}/company/${companyId}/items`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setItems(res.data);
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to update stock");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddItem = (itemType) => {
//     navigate("/Add_items", { state: { companyId, token, categories, itemType } });
//   };

//   const handleEditItem = (item) => {
//     navigate("/Add_items", { state: { item, companyId, token, categories } });
//   };

//   const filteredItems = items
//     .filter((item) =>
//       [item.itemName, item.itemHsn, item.itemCode, item.description]
//         .filter(Boolean)
//         .some((field) => field.toLowerCase().includes(searchTerm.toLowerCase()))
//     )
//     .filter((item) => item.itemType === (showProducts ? "PRODUCT" : "SERVICE"));

//   return (
//     <div className={styles["company-form-container"]}>
//       {/* HEADER */}
//       <div className={styles["form-header"]}>
//         <div className={styles["header-content"]}>
//           <div className={styles["header-icon"]}>
//             <Package size={32} style={{ color: "var(--primary-color)" }} />
//           </div>
//           <div className={styles["header-text"]}>
//             <h1 className={styles["company-form-title"]}>Items</h1>
//             <p className={styles["form-subtitle"]}>
//               Manage your {showProducts ? "products" : "services"}
//             </p>
//           </div>
//         </div>
//         <button
//           onClick={() => handleAddItem(showProducts ? "PRODUCT" : "SERVICE")}
//           className={styles["submit-button"]}
//           disabled={loading}
//         >
//           <Plus size={18} />
//           <span>Add {showProducts ? "Product" : "Service"}</span>
//         </button>
//       </div>

//       {/* SEARCH BAR */}
//       <div className={styles["search-container"]}>
//         <Search size={18} className={styles["search-icon"]} />
//         <input
//           type="text"
//           placeholder="Search by name, HSN, code, or description..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className={styles["search-input"]}
//           disabled={loading}
//         />
//       </div>

//       {/* TABS: Products / Services */}
//       <div style={{ margin: "16px 0", display: "flex", gap: "12px" }}>
//         <button
//           onClick={() => setShowProducts(true)}
//           className={`${styles["submit-button"]} ${showProducts ? styles["active-tab"] : ""}`}
//           style={{ width: "auto", padding: "8px 16px", fontSize: "0.9rem" }}
//           disabled={loading}
//         >
//           Products
//         </button>
//         <button
//           onClick={() => setShowProducts(false)}
//           className={`${styles["submit-button"]} ${!showProducts ? styles["active-tab"] : ""}`}
//           style={{ width: "auto", padding: "8px 16px", fontSize: "0.9rem" }}
//           disabled={loading}
//         >
//           Services
//         </button>
//       </div>

//       {/* LOADING */}
//       {loading && !showStockModal && (
//         <div className={styles["loading-message"]}>
//           <Loader size={32} className={styles["spinner"]} />
//           <p>Loading items...</p>
//         </div>
//       )}

//       {/* ERROR */}
//       {error && (
//         <div className={styles["no-data"]}>
//           <AlertCircle size={48} style={{ color: "#e74c3c" }} />
//           <p>{error}</p>
//         </div>
//       )}

//       {/* ITEMS LIST */}
//       {filteredItems.length > 0 ? (
//         <>
//           {/* Desktop Table */}
//           <div className={styles["table-wrapper"]}>
//             <table className={styles.table}>
//               <thead>
//                 <tr>
//                   <th>ID</th>
//                   <th>Name</th>
//                   <th>HSN</th>
//                   <th>Code</th>
//                   <th>Base Unit</th>
//                   <th>Sale Price</th>
//                   {showProducts && <th>Purchase Price</th>}
//                   <th>Tax Rate</th>
//                   {showProducts && <th>Stock Qty</th>}
//                   <th>Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredItems.map((item) => (
//                   <tr key={item.itemId} className={styles["table-row"]}>
//                     <td className={styles["invoice-cell"]}>
//                       <span className={styles["invoice-badge"]}>{item.itemId}</span>
//                     </td>
//                     <td>
//                       <span className={styles["party-name"]}>{item.itemName || "—"}</span>
//                     </td>
//                     <td>{item.itemHsn || "—"}</td>
//                     <td>{item.itemCode || "—"}</td>
//                     <td>{item.baseUnit || "—"}</td>
//                     <td className={styles["amount-cell"]}>
//                       <span className={styles["amount"]}>
//                         ₹{Number(item.salePrice || 0).toFixed(2)}
//                       </span>
//                     </td>
//                     {showProducts && (
//                       <td className={styles["received-cell"]}>
//                         ₹{Number(item.purchasePrice || 0).toFixed(2)}
//                       </td>
//                     )}
//                     <td>{item.taxRate || "—"}</td>
//                     {showProducts && <td>{item.stockOpeningQty || "0"}</td>}
//                     <td className={styles["actions-cell"]}>
//                       <button
//                         onClick={() => setSelectedItem(item)}
//                         className={`${styles["action-button"]} ${styles["view-button"]}`}
//                         title="View"
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
//             {filteredItems.map((item) => (
//               <div key={item.itemId} className={styles["invoice-card"]}>
//                 <div className={styles["card-header-mobile"]}>
//                   <div className={styles["card-title-section"]}>
//                     <h3 className={styles["card-invoice-number"]}>{item.itemName || "Unnamed"}</h3>
//                     <span className={styles["status-badge"]}>{item.itemType}</span>
//                   </div>
//                   <button
//                     onClick={() => setSelectedItem(item)}
//                     className={styles["card-action-button"]}
//                   >
//                     <ChevronDown size={20} />
//                   </button>
//                 </div>

//                 <div className={styles["card-body"]}>
//                   <div className={styles["card-info-row"]}>
//                     <span className={styles["info-label"]}>ID:</span>
//                     <span className={styles["info-value"]}>{item.itemId}</span>
//                   </div>
//                   <div className={styles["card-info-row"]}>
//                     <span className={styles["info-label"]}>HSN:</span>
//                     <span className={styles["info-value"]}>{item.itemHsn || "—"}</span>
//                   </div>
//                   <div className={styles["card-info-row"]}>
//                     <span className={styles["info-label"]}>Code:</span>
//                     <span className={styles["info-value"]}>{item.itemCode || "—"}</span>
//                   </div>
//                   <div className={styles["card-info-row"]}>
//                     <span className={styles["info-label"]}>Sale Price:</span>
//                     <span className={styles["info-value-amount"]}>
//                       ₹{Number(item.salePrice || 0).toFixed(2)}
//                     </span>
//                   </div>
//                   {showProducts && (
//                     <>
//                       <div className={styles["card-info-row"]}>
//                         <span className={styles["info-label"]}>Purchase Price:</span>
//                         <span className={styles["info-value"]}>
//                           ₹{Number(item.purchasePrice || 0).toFixed(2)}
//                         </span>
//                       </div>
//                       <div className={styles["card-info-row"]}>
//                         <span className={styles["info-label"]}>Stock:</span>
//                         <span className={styles["info-value"]}>{item.stockOpeningQty || "0"}</span>
//                       </div>
//                     </>
//                   )}
//                 </div>

//                 <div className={styles["card-footer"]}>
//                   <button
//                     onClick={() => setSelectedItem(item)}
//                     className={styles["card-view-button"]}
//                   >
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
//             <p>No {showProducts ? "products" : "services"} found</p>
//             <p className={styles["no-data-subtitle"]}>
//               {searchTerm
//                 ? "Try adjusting your search"
//                 : `Click "Add ${showProducts ? "Product" : "Service"}" to create one.`}
//             </p>
//           </div>
//         )
//       )}

//       {/* ITEM DETAIL MODAL */}
//       {selectedItem && (
//         <div className={styles["modal-overlay"]} onClick={() => setSelectedItem(null)}>
//           <div className={styles["detail-card"]} onClick={(e) => e.stopPropagation()}>
//             <div className={styles["card-header"]}>
//               <div className={styles["header-title-section"]}>
//                 <h3>{selectedItem.itemName}</h3>
//                 <div className={styles["balance-badge"]}>
//                   {selectedItem.itemType === "PRODUCT" ? (
//                     <>
//                       <Package size={16} />
//                       Product
//                     </>
//                   ) : (
//                     <>
//                       <CheckCircle size={16} />
//                       Service
//                     </>
//                   )}
//                 </div>
//               </div>
//               <div className={styles["header-actions"]}>
//                 {selectedItem.itemType === "PRODUCT" && (
//                   <button
//                     onClick={() => openStockModal(selectedItem)}
//                     className={`${styles["action-button"]} ${styles["payment-button"]}`}
//                     title="Update Stock"
//                   >
//                     <ArrowUpDown size={16} />
//                     <span>Update Stock</span>
//                   </button>
//                 )}
//                 <button
//                   onClick={() => handleEditItem(selectedItem)}
//                   className={`${styles["action-button"]} ${styles["edit-button"]}`}
//                 >
//                   <Edit2 size={16} />
//                   <span>Edit</span>
//                 </button>
//                 <button
//                   onClick={() => handleDeleteItem(selectedItem.itemId)}
//                   className={`${styles["action-button"]} ${styles["delete-button"]}`}
//                 >
//                   <Trash2 size={16} />
//                   <span>Delete</span>
//                 </button>
//                 <button
//                   className={styles["close-modal-btn"]}
//                   onClick={() => setSelectedItem(null)}
//                 >
//                   <X size={20} />
//                 </button>
//               </div>
//             </div>

//             {/* Basic Info */}
//             <section className={styles["card-section"]}>
//               <h4 className={styles["section-title"]}>Basic Information</h4>
//               <div className={styles["detail-grid"]}>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>Name:</span>
//                   <span className={styles["detail-value"]}>{selectedItem.itemName || "—"}</span>
//                 </div>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>HSN/SAC:</span>
//                   <span className={styles["detail-value"]}>{selectedItem.itemHsn || "—"}</span>
//                 </div>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>Item Code:</span>
//                   <span className={styles["detail-value"]}>{selectedItem.itemCode || "—"}</span>
//                 </div>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>Type:</span>
//                   <span className={styles["detail-value"]}>{selectedItem.itemType}</span>
//                 </div>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>Description:</span>
//                   <span className={styles["detail-value"]}>{selectedItem.description || "—"}</span>
//                 </div>
//               </div>
//             </section>

//             {/* Pricing & Tax */}
//             <section className={styles["card-section"]}>
//               <h4 className={styles["section-title"]}>Pricing & Tax</h4>
//               <div className={styles["detail-grid"]}>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>Sale Price:</span>
//                   <span className={styles["detail-value"]}>₹{Number(selectedItem.salePrice || 0).toFixed(2)}</span>
//                 </div>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>Sale Tax Type:</span>
//                   <span className={styles["detail-value"]}>{selectedItem.saleTaxType || "—"}</span>
//                 </div>
//                 {selectedItem.itemType === "PRODUCT" && (
//                   <>
//                     <div className={styles["detail-item"]}>
//                       <span className={styles["detail-label"]}>Purchase Price:</span>
//                       <span className={styles["detail-value"]}>₹{Number(selectedItem.purchasePrice || 0).toFixed(2)}</span>
//                     </div>
//                     <div className={styles["detail-item"]}>
//                       <span className={styles["detail-label"]}>Purchase Tax Type:</span>
//                       <span className={styles["detail-value"]}>{selectedItem.purchaseTaxType || "—"}</span>
//                     </div>
//                   </>
//                 )}
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>Tax Rate:</span>
//                   <span className={styles["detail-value"]}>{selectedItem.taxRate || "—"}</span>
//                 </div>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>Discount:</span>
//                   <span className={styles["detail-value"]}>
//                     {selectedItem.saleDiscountPrice ? `₹${selectedItem.saleDiscountPrice}` : "—"} ({selectedItem.saleDiscountType || "—"})
//                   </span>
//                 </div>
//               </div>
//             </section>

//             {/* Stock Details (Only for Products) */}
//             {selectedItem.itemType === "PRODUCT" && (
//               <section className={styles["card-section"]}>
//                 <h4 className={styles["section-title"]}>Stock Details</h4>
//                 <div className={styles["detail-grid"]}>
//                   <div className={styles["detail-item"]}>
//                     <span className={styles["detail-label"]}>Current Stock:</span>
//                     <span className={styles["detail-value"]}>
//                       {selectedItem.stockOpeningQty || "0"} {selectedItem.baseUnit}
//                     </span>
//                   </div>
//                   <div className={styles["detail-item"]}>
//                     <span className={styles["detail-label"]}>Min Stock Alert:</span>
//                     <span className={styles["detail-value"]}>{selectedItem.minimumStockToMaintain || "0"}</span>
//                   </div>
//                   <div className={styles["detail-item"]}>
//                     <span className={styles["detail-label"]}>Stock Location:</span>
//                     <span className={styles["detail-value"]}>{selectedItem.openingStockLocation || "—"}</span>
//                   </div>
//                   <div className={styles["detail-item"]}>
//                     <span className={styles["detail-label"]}>Opening Date:</span>
//                     <span className={styles["detail-value"]}>
//                       {selectedItem.stockOpeningDate
//                         ? new Date(selectedItem.stockOpeningDate).toLocaleDateString()
//                         : "—"}
//                     </span>
//                   </div>
//                 </div>
//               </section>
//             )}

//             {/* Units */}
//             <section className={styles["card-section"]}>
//               <h4 className={styles["section-title"]}>Unit Configuration</h4>
//               <div className={styles["detail-grid"]}>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>Base Unit:</span>
//                   <span className={styles["detail-value"]}>{selectedItem.baseUnit || "—"}</span>
//                 </div>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>Secondary Unit:</span>
//                   <span className={styles["detail-value"]}>{selectedItem.secondaryUnit || "—"}</span>
//                 </div>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>Conversion:</span>
//                   <span className={styles["detail-value"]}>
//                     {selectedItem.baseUnitToSecondaryUnit
//                       ? `1 ${selectedItem.baseUnit} = ${selectedItem.baseUnitToSecondaryUnit} ${selectedItem.secondaryUnit}`
//                       : "—"}
//                   </span>
//                 </div>
//               </div>
//             </section>

//             {/* Categories */}
//             {selectedItem.categories && selectedItem.categories.length > 0 && (
//               <section className={styles["card-section"]}>
//                 <h4 className={styles["section-title"]}>Categories</h4>
//                 <div className={styles["detail-grid"]}>
//                   {selectedItem.categories.map((cat) => (
//                     <div key={cat.categoryId} className={styles["detail-item"]}>
//                       <span className={styles["detail-value"]}>{cat.categoryName}</span>
//                     </div>
//                   ))}
//                 </div>
//               </section>
//             )}
//           </div>
//         </div>
//       )}

//       {/* STOCK UPDATE MODAL */}
//       {showStockModal && selectedItem && (
//         <div className={styles["modal-overlay"]} onClick={() => setShowStockModal(false)}>
//           <div className={styles["payment-modal"]} onClick={(e) => e.stopPropagation()}>
//             <div className={styles["modal-header"]}>
//               <h3>Update Stock - {selectedItem.itemName}</h3>
//               <button
//                 className={styles["close-modal-btn"]}
//                 onClick={() => setShowStockModal(false)}
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             <form onSubmit={handleStockUpdate} className={styles["payment-form"]}>
//               <div className={styles["form-row"]}>
//                 <div className={styles["form-group"]}>
//                   <label>
//                     Transaction Date <span className={styles.required}>*</span>
//                   </label>
//                   <input
//                     type="date"
//                     value={stockForm.transactionDate}
//                     onChange={(e) =>
//                       setStockForm({ ...stockForm, transactionDate: e.target.value })
//                     }
//                     required
//                     className={styles["form-input"]}
//                   />
//                 </div>
//                 <div className={styles["form-group"]}>
//                   <label>
//                     Operation Type <span className={styles.required}>*</span>
//                   </label>
//                   <select
//                     value={stockForm.operationType}
//                     onChange={(e) =>
//                       setStockForm({ ...stockForm, operationType: e.target.value })
//                     }
//                     required
//                     className={styles["form-input"]}
//                   >
//                     {operationTypes.map((type) => (
//                       <option key={type} value={type}>
//                         {type.replace(/_/g, " ")}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               <div className={styles["form-row"]}>
//                 <div className={styles["form-group"]}>
//                   <label>
//                     Quantity <span className={styles.required}>*</span>
//                   </label>
//                   <input
//                     type="number"
//                     step="0.01"
//                     min="0.01"
//                     value={stockForm.quantity}
//                     onChange={(e) =>
//                       setStockForm({ ...stockForm, quantity: e.target.value })
//                     }
//                     required
//                     className={styles["form-input"]}
//                     placeholder="e.g. 100"
//                   />
//                 </div>
//                 <div className={styles["form-group"]}>
//                   <label>Price Per Unit (Cost Price)</label>
//                   <input
//                     type="number"
//                     step="0.01"
//                     min="0"
//                     value={stockForm.pricePerUnit}
//                     onChange={(e) =>
//                       setStockForm({ ...stockForm, pricePerUnit: e.target.value })
//                     }
//                     className={styles["form-input"]}
//                     placeholder="Optional for ADD_STOCK/PURCHASE"
//                   />
//                 </div>
//               </div>

//               <div className={styles["form-actions"]}>
//                 <button type="submit" className={styles["submit-button"]} disabled={loading}>
//                   {loading ? (
//                     <>
//                       <Loader size={16} className={styles["button-spinner"]} />
//                       Updating Stock...
//                     </>
//                   ) : (
//                     <>
//                       <ArrowUpDown size={16} />
//                       Update Stock
//                     </>
//                   )}
//                 </button>
//                 <button
//                   type="button"
//                   className={styles["cancel-button"]}
//                   onClick={() => setShowStockModal(false)}
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

// export default Items;








"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/axiosInstance"; // 👈 Shared API with interceptors
import { toast } from "react-toastify";
import styles from "../Styles/ScreenUI.module.css";
import {
  Plus,
  Eye,
  Edit2,
  Trash2,
  X,
  Package,
  Search,
  Loader,
  ChevronDown,
  AlertCircle,
  CheckCircle,
  ArrowUpDown,
} from "lucide-react";

const Items = () => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("eBilling") || "{}")
  );

  const companyId = userData?.selectedCompany?.id;
  const token = userData?.accessToken;

  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showProducts, setShowProducts] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [showStockModal, setShowStockModal] = useState(false);

  // Stock Update Form State
  const [stockForm, setStockForm] = useState({
    transactionDate: new Date().toISOString().split("T")[0],
    quantity: "",
    pricePerUnit: "",
    operationType: "ADD_STOCK",
  });

  const operationTypes = [
    "ADD_STOCK",
    "REDUCE_STOCK",
    "PURCHASE",
    "SALE",
    "OPENING_STOCK",
    "CREDIT_NOTE",
    "DEBIT_NOTE",
    "PURCHASE_ORDER",
    "SALE_ORDER",
    "DELIVERY_CHALLAN",
    "QUOTATION",
  ];

  // Sync userData on changes (e.g., logout, company switch, token refresh)
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
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, [companyId, token]);

  // Fetch items + auth check
  useEffect(() => {
    if (!token) {
      toast.info("Please log in to continue.");
      navigate("/login");
      return;
    }
    if (!companyId) {
      toast.info("Please select a company to manage items.");
      navigate("/company-list");
      return;
    }

    const fetchItems = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/company/${companyId}/items`);
        setItems(response.data || []);
      } catch (error) {
        const message =
          error.response?.data?.message || "Failed to fetch items.";
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [companyId, token, navigate]);

  // Delete Item
  const handleDeleteItem = async (itemId) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      setLoading(true);
      await api.delete(`/item/${itemId}`);
      toast.success("Item deleted successfully");
      setItems((prev) => prev.filter((item) => item.itemId !== itemId));
      setSelectedItem(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete item.");
    } finally {
      setLoading(false);
    }
  };

  // Open Stock Update Modal
  const openStockModal = (item) => {
    setSelectedItem(item);
    setStockForm({
      transactionDate: new Date().toISOString().split("T")[0],
      quantity: "",
      pricePerUnit: item.purchasePrice || "",
      operationType: "ADD_STOCK",
    });
    setShowStockModal(true);
  };

  // Handle Stock Update
  const handleStockUpdate = async (e) => {
    e.preventDefault();
    if (!selectedItem) return;

    const qty = parseFloat(stockForm.quantity);
    if (!qty || qty <= 0) {
      toast.error("Please enter a valid quantity");
      return;
    }

    const payload = {
      transactionDate: stockForm.transactionDate,
      quantity: qty,
      pricePerUnit: parseFloat(stockForm.pricePerUnit) || 0,
      operationType: stockForm.operationType,
    };

    try {
      setLoading(true);
      await api.post(`/item/${selectedItem.itemId}/stock/update`, payload);

      toast.success("Stock updated successfully!");
      setShowStockModal(false);
      setSelectedItem(null);

      // Refresh items
      const res = await api.get(`/company/${companyId}/items`);
      setItems(res.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update stock");
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = (itemType) => {
    navigate("/Add_items", { state: { categories, itemType } });
  };

  const handleEditItem = (item) => {
    navigate("/Add_items", { state: { item, categories } });
  };

  const filteredItems = items
    .filter((item) =>
      [item.itemName, item.itemHsn, item.itemCode, item.description]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .filter((item) => item.itemType === (showProducts ? "PRODUCT" : "SERVICE"));

  return (
    <div className={styles["company-form-container"]}>
      {/* HEADER */}
      <div className={styles["form-header"]}>
        <div className={styles["header-content"]}>
          <div className={styles["header-icon"]}>
            <Package size={32} style={{ color: "var(--primary-color)" }} />
          </div>
          <div className={styles["header-text"]}>
            <h1 className={styles["company-form-title"]}>Items</h1>
            <p className={styles["form-subtitle"]}>
              Manage your {showProducts ? "products" : "services"}
            </p>
          </div>
        </div>
        <button
          onClick={() => handleAddItem(showProducts ? "PRODUCT" : "SERVICE")}
          className={styles["submit-button"]}
          disabled={loading}
        >
          <Plus size={18} />
          <span>Add {showProducts ? "Product" : "Service"}</span>
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className={styles["search-container"]}>
        <Search size={18} className={styles["search-icon"]} />
        <input
          type="text"
          placeholder="Search by name, HSN, code, or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles["search-input"]}
          disabled={loading}
        />
      </div>

      {/* TABS: Products / Services */}
      <div style={{ margin: "16px 0", display: "flex", gap: "12px" }}>
        <button
          onClick={() => setShowProducts(true)}
          className={`${styles["submit-button"]} ${showProducts ? styles["active-tab"] : ""}`}
          style={{ width: "auto", padding: "8px 16px", fontSize: "0.9rem" }}
          disabled={loading}
        >
          Products
        </button>
        <button
          onClick={() => setShowProducts(false)}
          className={`${styles["submit-button"]} ${!showProducts ? styles["active-tab"] : ""}`}
          style={{ width: "auto", padding: "8px 16px", fontSize: "0.9rem" }}
          disabled={loading}
        >
          Services
        </button>
      </div>

      {/* LOADING */}
      {loading && !showStockModal && (
        <div className={styles["loading-message"]}>
          <Loader size={32} className={styles["spinner"]} />
          <p>Loading items...</p>
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div className={styles["no-data"]}>
          <AlertCircle size={48} style={{ color: "#e74c3c" }} />
          <p>{error}</p>
        </div>
      )}

      {/* ITEMS LIST */}
      {filteredItems.length > 0 ? (
        <>
          {/* Desktop Table */}
          <div className={styles["table-wrapper"]}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>HSN</th>
                  <th>Code</th>
                  <th>Base Unit</th>
                  <th>Sale Price</th>
                  {showProducts && <th>Purchase Price</th>}
                  <th>Tax Rate</th>
                  {showProducts && <th>Stock Qty</th>}
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item.itemId} className={styles["table-row"]}>
                    <td className={styles["invoice-cell"]}>
                      <span className={styles["invoice-badge"]}>{item.itemId}</span>
                    </td>
                    <td>
                      <span className={styles["party-name"]}>{item.itemName || "—"}</span>
                    </td>
                    <td>{item.itemHsn || "—"}</td>
                    <td>{item.itemCode || "—"}</td>
                    <td>{item.baseUnit || "—"}</td>
                    <td className={styles["amount-cell"]}>
                      <span className={styles["amount"]}>
                        ₹{Number(item.salePrice || 0).toFixed(2)}
                      </span>
                    </td>
                    {showProducts && (
                      <td className={styles["received-cell"]}>
                        ₹{Number(item.purchasePrice || 0).toFixed(2)}
                      </td>
                    )}
                    <td>{item.taxRate || "—"}</td>
                    {showProducts && <td>{item.stockOpeningQty || "0"}</td>}
                    <td className={styles["actions-cell"]}>
                      <button
                        onClick={() => setSelectedItem(item)}
                        className={`${styles["action-button"]} ${styles["view-button"]}`}
                        title="View"
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
            {filteredItems.map((item) => (
              <div key={item.itemId} className={styles["invoice-card"]}>
                <div className={styles["card-header-mobile"]}>
                  <div className={styles["card-title-section"]}>
                    <h3 className={styles["card-invoice-number"]}>{item.itemName || "Unnamed"}</h3>
                    <span className={styles["status-badge"]}>{item.itemType}</span>
                  </div>
                  <button
                    onClick={() => setSelectedItem(item)}
                    className={styles["card-action-button"]}
                  >
                    <ChevronDown size={20} />
                  </button>
                </div>

                <div className={styles["card-body"]}>
                  <div className={styles["card-info-row"]}>
                    <span className={styles["info-label"]}>ID:</span>
                    <span className={styles["info-value"]}>{item.itemId}</span>
                  </div>
                  <div className={styles["card-info-row"]}>
                    <span className={styles["info-label"]}>HSN:</span>
                    <span className={styles["info-value"]}>{item.itemHsn || "—"}</span>
                  </div>
                  <div className={styles["card-info-row"]}>
                    <span className={styles["info-label"]}>Code:</span>
                    <span className={styles["info-value"]}>{item.itemCode || "—"}</span>
                  </div>
                  <div className={styles["card-info-row"]}>
                    <span className={styles["info-label"]}>Sale Price:</span>
                    <span className={styles["info-value-amount"]}>
                      ₹{Number(item.salePrice || 0).toFixed(2)}
                    </span>
                  </div>
                  {showProducts && (
                    <>
                      <div className={styles["card-info-row"]}>
                        <span className={styles["info-label"]}>Purchase Price:</span>
                        <span className={styles["info-value"]}>
                          ₹{Number(item.purchasePrice || 0).toFixed(2)}
                        </span>
                      </div>
                      <div className={styles["card-info-row"]}>
                        <span className={styles["info-label"]}>Stock:</span>
                        <span className={styles["info-value"]}>{item.stockOpeningQty || "0"}</span>
                      </div>
                    </>
                  )}
                </div>

                <div className={styles["card-footer"]}>
                  <button
                    onClick={() => setSelectedItem(item)}
                    className={styles["card-view-button"]}
                  >
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
            <p>No {showProducts ? "products" : "services"} found</p>
            <p className={styles["no-data-subtitle"]}>
              {searchTerm
                ? "Try adjusting your search"
                : `Click "Add ${showProducts ? "Product" : "Service"}" to create one.`}
            </p>
          </div>
        )
      )}

      {/* ITEM DETAIL MODAL */}
      {selectedItem && (
        <div className={styles["modal-overlay"]} onClick={() => setSelectedItem(null)}>
          <div className={styles["detail-card"]} onClick={(e) => e.stopPropagation()}>
            <div className={styles["card-header"]}>
              <div className={styles["header-title-section"]}>
                <h3>{selectedItem.itemName}</h3>
                <div className={styles["balance-badge"]}>
                  {selectedItem.itemType === "PRODUCT" ? (
                    <>
                      <Package size={16} />
                      Product
                    </>
                  ) : (
                    <>
                      <CheckCircle size={16} />
                      Service
                    </>
                  )}
                </div>
              </div>
              <div className={styles["header-actions"]}>
                {selectedItem.itemType === "PRODUCT" && (
                  <button
                    onClick={() => openStockModal(selectedItem)}
                    className={`${styles["action-button"]} ${styles["payment-button"]}`}
                    title="Update Stock"
                  >
                    <ArrowUpDown size={16} />
                    <span>Update Stock</span>
                  </button>
                )}
                <button
                  onClick={() => handleEditItem(selectedItem)}
                  className={`${styles["action-button"]} ${styles["edit-button"]}`}
                >
                  <Edit2 size={16} />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDeleteItem(selectedItem.itemId)}
                  className={`${styles["action-button"]} ${styles["delete-button"]}`}
                >
                  <Trash2 size={16} />
                  <span>Delete</span>
                </button>
                <button
                  className={styles["close-modal-btn"]}
                  onClick={() => setSelectedItem(null)}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Basic Info */}
            <section className={styles["card-section"]}>
              <h4 className={styles["section-title"]}>Basic Information</h4>
              <div className={styles["detail-grid"]}>
                <div className={styles["detail-item"]}>
                  <span className={styles["detail-label"]}>Name:</span>
                  <span className={styles["detail-value"]}>{selectedItem.itemName || "—"}</span>
                </div>
                <div className={styles["detail-item"]}>
                  <span className={styles["detail-label"]}>HSN/SAC:</span>
                  <span className={styles["detail-value"]}>{selectedItem.itemHsn || "—"}</span>
                </div>
                <div className={styles["detail-item"]}>
                  <span className={styles["detail-label"]}>Item Code:</span>
                  <span className={styles["detail-value"]}>{selectedItem.itemCode || "—"}</span>
                </div>
                <div className={styles["detail-item"]}>
                  <span className={styles["detail-label"]}>Type:</span>
                  <span className={styles["detail-value"]}>{selectedItem.itemType}</span>
                </div>
                <div className={styles["detail-item"]}>
                  <span className={styles["detail-label"]}>Description:</span>
                  <span className={styles["detail-value"]}>{selectedItem.description || "—"}</span>
                </div>
              </div>
            </section>

            {/* Pricing & Tax */}
            <section className={styles["card-section"]}>
              <h4 className={styles["section-title"]}>Pricing & Tax</h4>
              <div className={styles["detail-grid"]}>
                <div className={styles["detail-item"]}>
                  <span className={styles["detail-label"]}>Sale Price:</span>
                  <span className={styles["detail-value"]}>₹{Number(selectedItem.salePrice || 0).toFixed(2)}</span>
                </div>
                <div className={styles["detail-item"]}>
                  <span className={styles["detail-label"]}>Sale Tax Type:</span>
                  <span className={styles["detail-value"]}>{selectedItem.saleTaxType || "—"}</span>
                </div>
                {selectedItem.itemType === "PRODUCT" && (
                  <>
                    <div className={styles["detail-item"]}>
                      <span className={styles["detail-label"]}>Purchase Price:</span>
                      <span className={styles["detail-value"]}>₹{Number(selectedItem.purchasePrice || 0).toFixed(2)}</span>
                    </div>
                    <div className={styles["detail-item"]}>
                      <span className={styles["detail-label"]}>Purchase Tax Type:</span>
                      <span className={styles["detail-value"]}>{selectedItem.purchaseTaxType || "—"}</span>
                    </div>
                  </>
                )}
                <div className={styles["detail-item"]}>
                  <span className={styles["detail-label"]}>Tax Rate:</span>
                  <span className={styles["detail-value"]}>{selectedItem.taxRate || "—"}</span>
                </div>
                <div className={styles["detail-item"]}>
                  <span className={styles["detail-label"]}>Discount:</span>
                  <span className={styles["detail-value"]}>
                    {selectedItem.saleDiscountPrice ? `₹${selectedItem.saleDiscountPrice}` : "—"} ({selectedItem.saleDiscountType || "—"})
                  </span>
                </div>
              </div>
            </section>

            {/* Stock Details (Only for Products) */}
            {selectedItem.itemType === "PRODUCT" && (
              <section className={styles["card-section"]}>
                <h4 className={styles["section-title"]}>Stock Details</h4>
                <div className={styles["detail-grid"]}>
                  <div className={styles["detail-item"]}>
                    <span className={styles["detail-label"]}>Current Stock:</span>
                    <span className={styles["detail-value"]}>
                      {selectedItem.stockOpeningQty || "0"} {selectedItem.baseUnit}
                    </span>
                  </div>
                  <div className={styles["detail-item"]}>
                    <span className={styles["detail-label"]}>Min Stock Alert:</span>
                    <span className={styles["detail-value"]}>{selectedItem.minimumStockToMaintain || "0"}</span>
                  </div>
                  <div className={styles["detail-item"]}>
                    <span className={styles["detail-label"]}>Stock Location:</span>
                    <span className={styles["detail-value"]}>{selectedItem.openingStockLocation || "—"}</span>
                  </div>
                  <div className={styles["detail-item"]}>
                    <span className={styles["detail-label"]}>Opening Date:</span>
                    <span className={styles["detail-value"]}>
                      {selectedItem.stockOpeningDate
                        ? new Date(selectedItem.stockOpeningDate).toLocaleDateString()
                        : "—"}
                    </span>
                  </div>
                </div>
              </section>
            )}

            {/* Units */}
            <section className={styles["card-section"]}>
              <h4 className={styles["section-title"]}>Unit Configuration</h4>
              <div className={styles["detail-grid"]}>
                <div className={styles["detail-item"]}>
                  <span className={styles["detail-label"]}>Base Unit:</span>
                  <span className={styles["detail-value"]}>{selectedItem.baseUnit || "—"}</span>
                </div>
                <div className={styles["detail-item"]}>
                  <span className={styles["detail-label"]}>Secondary Unit:</span>
                  <span className={styles["detail-value"]}>{selectedItem.secondaryUnit || "—"}</span>
                </div>
                <div className={styles["detail-item"]}>
                  <span className={styles["detail-label"]}>Conversion:</span>
                  <span className={styles["detail-value"]}>
                    {selectedItem.baseUnitToSecondaryUnit
                      ? `1 ${selectedItem.baseUnit} = ${selectedItem.baseUnitToSecondaryUnit} ${selectedItem.secondaryUnit}`
                      : "—"}
                  </span>
                </div>
              </div>
            </section>

            {/* Categories */}
            {selectedItem.categories && selectedItem.categories.length > 0 && (
              <section className={styles["card-section"]}>
                <h4 className={styles["section-title"]}>Categories</h4>
                <div className={styles["detail-grid"]}>
                  {selectedItem.categories.map((cat) => (
                    <div key={cat.categoryId} className={styles["detail-item"]}>
                      <span className={styles["detail-value"]}>{cat.categoryName}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      )}

      {/* STOCK UPDATE MODAL */}
      {showStockModal && selectedItem && (
        <div className={styles["modal-overlay"]} onClick={() => setShowStockModal(false)}>
          <div className={styles["payment-modal"]} onClick={(e) => e.stopPropagation()}>
            <div className={styles["modal-header"]}>
              <h3>Update Stock - {selectedItem.itemName}</h3>
              <button
                className={styles["close-modal-btn"]}
                onClick={() => setShowStockModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleStockUpdate} className={styles["payment-form"]}>
              <div className={styles["form-row"]}>
                <div className={styles["form-group"]}>
                  <label>
                    Transaction Date <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="date"
                    value={stockForm.transactionDate}
                    onChange={(e) =>
                      setStockForm({ ...stockForm, transactionDate: e.target.value })
                    }
                    required
                    className={styles["form-input"]}
                  />
                </div>
                <div className={styles["form-group"]}>
                  <label>
                    Operation Type <span className={styles.required}>*</span>
                  </label>
                  <select
                    value={stockForm.operationType}
                    onChange={(e) =>
                      setStockForm({ ...stockForm, operationType: e.target.value })
                    }
                    required
                    className={styles["form-input"]}
                  >
                    {operationTypes.map((type) => (
                      <option key={type} value={type}>
                        {type.replace(/_/g, " ")}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles["form-row"]}>
                <div className={styles["form-group"]}>
                  <label>
                    Quantity <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={stockForm.quantity}
                    onChange={(e) =>
                      setStockForm({ ...stockForm, quantity: e.target.value })
                    }
                    required
                    className={styles["form-input"]}
                    placeholder="e.g. 100"
                  />
                </div>
                <div className={styles["form-group"]}>
                  <label>Price Per Unit (Cost Price)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={stockForm.pricePerUnit}
                    onChange={(e) =>
                      setStockForm({ ...stockForm, pricePerUnit: e.target.value })
                    }
                    className={styles["form-input"]}
                    placeholder="Optional for ADD_STOCK/PURCHASE"
                  />
                </div>
              </div>

              <div className={styles["form-actions"]}>
                <button type="submit" className={styles["submit-button"]} disabled={loading}>
                  {loading ? (
                    <>
                      <Loader size={16} className={styles["button-spinner"]} />
                      Updating Stock...
                    </>
                  ) : (
                    <>
                      <ArrowUpDown size={16} />
                      Update Stock
                    </>
                  )}
                </button>
                <button
                  type="button"
                  className={styles["cancel-button"]}
                  onClick={() => setShowStockModal(false)}
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

export default Items;