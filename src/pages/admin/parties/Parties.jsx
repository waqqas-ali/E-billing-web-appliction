// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import config from "../../../config/apiconfig";
// import styles from "./Parties.module.css";

// const Parties = () => {
//   const navigate = useNavigate();
//   const ebillingData = JSON.parse(localStorage.getItem("eBilling")) || {};
//   const companyId = ebillingData?.selectedCompany?.id;
//   const token = ebillingData?.accessToken;
//   const [parties, setParties] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // Fetch all parties
//   const fetchParties = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await axios.get(
//         `${config.BASE_URL}/company/${companyId}/parties`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       setParties(response.data);
//       console.log("Fetched parties:", response.data);
//     } catch (error) {
//       setError(error.response?.data?.message || "Failed to fetch parties.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (!token || !companyId) {
//       navigate("Add-parties");  
//       return;
//     }
//     fetchParties();
//   }, [token, companyId, navigate]);

//   // Handle edit button click
//   const handleEdit = (party) => {
//     navigate("/Add-parties", { state: { party, companyId, token } });
//   };

//   // Handle delete button click
//   const handleDelete = async (partyId) => {
//     if (!window.confirm("Are you sure you want to delete this party?")) return;
//     setLoading(true);
//     try {
//       await axios.delete(`${config.BASE_URL}/party/${partyId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });
//       alert("Party deleted successfully");
//       fetchParties();
//     } catch (error) {
//       setError(error.response?.data?.message || "Failed to delete party.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Filter parties based on search term
//   const filteredParties = parties.filter((party) =>
//     [party.name, party.gstin, party.emailId, party.phoneNo]
//       .filter(Boolean)
//       .some((field) => field.toLowerCase().includes(searchTerm.toLowerCase()))
//   );

//   return (
//     <div className={styles.container}>
//       <div className={styles.header}>
//         <div>
//           <h1 className={styles.title}>Parties</h1>
//           <p className={styles.subtitle}>Manage your business contacts and partners</p>
//         </div>
//         <button
//           onClick={() => navigate("/Add-parties", { state: { companyId, token } })}
//           className={styles.createButton}
//           disabled={loading}
//         >
//           <i className="fas fa-plus-circle"></i> Create Party
//         </button>
//       </div>

//       {loading && (
//         <div className={styles.loading}>
//           <div className={styles.spinner}></div>
//           <p>Loading parties...</p>
//         </div>
//       )}

//       {error && <div className={styles.error}>{error}</div>}

//       <div className={styles.actions}>
//         <div className={styles.searchWrapper}>
//           <i className="fas fa-search"></i>
//           <input
//             type="search"
//             placeholder="Search by name, GST, email, or phone..."
//             className={styles.searchInput}
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             disabled={loading}
//           />
//         </div>
//       </div>

//       {filteredParties.length > 0 ? (
//         <>
//           {/* Desktop Table View */}
//           <div className={styles.tableWrapper}>
//             <table className={styles.table}>
//               <thead>
//                 <tr>
//                   <th>Name</th>
//                   <th>GST No</th>
//                   <th>Type</th>
//                   <th>Phone</th>
//                   <th>State</th>
//                   <th>Email</th>
//                   <th>Billing Address</th>
//                   <th>Shipping Address</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredParties.map((party) => (
//                   <tr key={party.partyId}>
//                     <td>{party.name || "N/A"}</td>
//                     <td>{party.gstin || "N/A"}</td>
//                     <td>
//                       {party.gstType
//                         ?.replace(/_/g, " ")
//                         .toLowerCase()
//                         .replace(/\b\w/g, (c) => c.toUpperCase()) || "N/A"}
//                     </td>
//                     <td>{party.phoneNo || "N/A"}</td>
//                     <td>
//                       {party.state
//                         ?.replace(/_/g, " ")
//                         .toLowerCase()
//                         .replace(/\b\w/g, (c) => c.toUpperCase()) || "N/A"}
//                     </td>
//                     <td>
//                       {party.emailId ? (
//                         <a href={`mailto:${party.emailId}`}>{party.emailId}</a>
//                       ) : (
//                         "N/A"
//                       )}
//                     </td>
//                     <td>{party.billingAddress || "N/A"}</td>
//                     <td>{party.shipingAddress || "N/A"}</td>
//                     <td className={styles.actionsCell}>
//                       <button
//                         onClick={() => handleEdit(party)}
//                         className={`${styles.actionButton} ${styles.editButton}`}
//                         disabled={loading}
//                       >
//                         <i className="fas fa-edit"></i> Edit
//                       </button>
//                       <button
//                         onClick={() => handleDelete(party.partyId)}
//                         className={`${styles.actionButton} ${styles.deleteButton}`}
//                         disabled={loading}
//                       >
//                         <i className="fas fa-trash-alt"></i> Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Mobile Card View */}
//           <div className={styles.cardsContainer}>
//             {filteredParties.map((party) => (
//               <div key={party.partyId} className={styles.card}>
//                 <div className={styles.cardHeader}>
//                   <h3 className={styles.cardTitle}>{party.name || "N/A"}</h3>
//                   <p className={styles.cardType}>
//                     {party.gstType
//                       ?.replace(/_/g, " ")
//                       .toLowerCase()
//                       .replace(/\b\w/g, (c) => c.toUpperCase()) || "N/A"}
//                   </p>
//                 </div>
//                 <div className={styles.cardContent}>
//                   <div className={styles.cardDetail}>
//                     <i className="fas fa-id-card"></i>
//                     <span>GST: {party.gstin || "N/A"}</span>
//                   </div>
//                   <div className={styles.cardDetail}>
//                     <i className="fas fa-phone"></i>
//                     <span>{party.phoneNo || "N/A"}</span>
//                   </div>
//                   <div className={styles.cardDetail}>
//                     <i className="fas fa-map-marker-alt"></i>
//                     <span>
//                       {party.state
//                         ?.replace(/_/g, " ")
//                         .toLowerCase()
//                         .replace(/\b\w/g, (c) => c.toUpperCase()) || "N/A"}
//                     </span>
//                   </div>
//                   <div className={styles.cardDetail}>
//                     <i className="fas fa-envelope"></i>
//                     <span>
//                       {party.emailId ? (
//                         <a href={`mailto:${party.emailId}`}>{party.emailId}</a>
//                       ) : (
//                         "N/A"
//                       )}
//                     </span>
//                   </div>
//                   <div className={styles.cardDetail}>
//                     <i className="fas fa-home"></i>
//                     <span>Billing: {party.billingAddress || "N/A"}</span>
//                   </div>
//                   <div className={styles.cardDetail}>
//                     <i className="fas fa-shipping-fast"></i>
//                     <span>Shipping: {party.shipingAddress || "N/A"}</span>
//                   </div>
//                 </div>
//                 <div className={styles.cardActions}>
//                   <button
//                     onClick={() => handleEdit(party)}
//                     className={`${styles.cardActionButton} ${styles.editButton}`}
//                     disabled={loading}
//                   >
//                     <i className="fas fa-edit"></i> Edit
//                   </button>
//                   <button
//                     onClick={() => handleDelete(party.partyId)}
//                     className={`${styles.cardActionButton} ${styles.deleteButton}`}
//                     disabled={loading}
//                   >
//                     <i className="fas fa-trash-alt"></i> Delete
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </>
//       ) : (
//         <div className={styles.noData}>
//           <i className="fas fa-inbox"></i>
//           <p>No parties found.</p>
//           <p className={styles.noDataSubtitle}>Click "Create Party" to add one!</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Parties;








// // src/pages/Parties.jsx
// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import config from "../../../config/apiconfig";
// import {
//   Search, Plus, Edit, Trash2, Mail, Phone, MapPin, Home, Package, AlertCircle, Loader2
// } from "lucide-react";
// import styles from "./Parties.module.css";

// const Parties = () => {
//   const navigate = useNavigate();
//   const ebillingData = JSON.parse(localStorage.getItem("eBilling")) || {};
//   const companyId = ebillingData?.selectedCompany?.id;
//   const token = ebillingData?.accessToken;

//   const [parties, setParties] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const fetchParties = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await axios.get(
//         `${config.BASE_URL}/company/${companyId}/parties`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setParties(response.data);
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to load parties.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (!token || !companyId) {
//       navigate("/Add-parties");
//       return;
//     }
//     fetchParties();
//   }, [token, companyId, navigate]);

//   const handleEdit = (party) => {
//     navigate("/Add-parties", { state: { party, companyId, token } });
//   };

//   const handleDelete = async (partyId) => {
//     if (!window.confirm("Delete this party?")) return;
//     setLoading(true);
//     try {
//       await axios.delete(`${config.BASE_URL}/party/${partyId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       fetchParties();
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to delete.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filteredParties = parties.filter((p) =>
//     [p.name, p.gstin, p.emailId, p.phoneNo]
//       .filter(Boolean)
//       .some((f) => f.toLowerCase().includes(searchTerm.toLowerCase()))
//   );

//   return (
//     <div className={styles.container}>
//       {/* Header */}
//       <div className={styles.header}>
//         <div>
//           <h1 className={styles.title}>Parties</h1>
//           <p className={styles.subtitle}>Manage your business contacts</p>
//         </div>
//         <button
//           onClick={() => navigate("/Add-parties", { state: { companyId, token } })}
//           className={styles.createBtn}
//           disabled={loading}
//         >
//           <Plus size={18} />
//           Create Party
//         </button>
//       </div>

//       {/* Search */}
//       <div className={styles.searchWrapper}>
//         <Search className={styles.searchIcon} size={18} />
//         <input
//           type="text"
//           placeholder="Search by name, GST, email, phone..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className={styles.searchInput}
//           disabled={loading}
//         />
//       </div>

//       {/* Loading */}
//       {loading && (
//         <div className={styles.loading}>
//           <Loader2 className={styles.spinner} size={40} />
//           <p>Loading parties...</p>
//         </div>
//       )}

//       {/* Error */}
//       {error && (
//         <div className={styles.error}>
//           <AlertCircle size={18} />
//           {error}
//         </div>
//       )}

//       {/* Empty State */}
//       {!loading && !error && filteredParties.length === 0 && (
//         <div className={styles.empty}>
//           <div className={styles.emptyIcon}>Inbox</div>
//           <p>No parties found</p>
//           <p className={styles.emptySub}>Click "Create Party" to add one</p>
//         </div>
//       )}

//       {/* Desktop Table */}
//       {!loading && !error && filteredParties.length > 0 && (
//         <>
//           <div className={styles.tableContainer}>
//             <table className={styles.table}>
//               <thead>
//                 <tr>
//                   <th>Name</th>
//                   <th>GST No</th>
//                   <th>Type</th>
//                   <th>Phone</th>
//                   <th>State</th>
//                   <th>Email</th>
//                   <th>Billing</th>
//                   <th>Shipping</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredParties.map((p) => (
//                   <tr key={p.partyId}>
//                     <td className={styles.nameCell}>{p.name || "—"}</td>
//                     <td>{p.gstin || "—"}</td>
//                     <td>{formatEnum(p.gstType)}</td>
//                     <td>{p.phoneNo || "—"}</td>
//                     <td>{formatEnum(p.state)}</td>
//                     <td>
//                       {p.emailId ? (
//                         <a href={`mailto:${p.emailId}`} className={styles.link}>
//                           {p.emailId}
//                         </a>
//                       ) : "—"}
//                     </td>
//                     <td className={styles.addressCell}>{p.billingAddress || "—"}</td>
//                     <td className={styles.addressCell}>{p.shipingAddress || "—"}</td>
//                     <td className={styles.actionsCell}>
//                       <button
//                         onClick={() => handleEdit(p)}
//                         className={styles.editBtn}
//                         disabled={loading}
//                         aria-label="Edit"
//                       >
//                         <Edit size={16} />
//                       </button>
//                       <button
//                         onClick={() => handleDelete(p.partyId)}
//                         className={styles.deleteBtn}
//                         disabled={loading}
//                         aria-label="Delete"
//                       >
//                         <Trash2 size={16} />
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Mobile Cards */}
//           <div className={styles.cards}>
//             {filteredParties.map((p) => (
//               <div key={p.partyId} className={styles.card}>
//                 <div className={styles.cardHeader}>
//                   <h3 className={styles.cardTitle}>{p.name || "Unnamed"}</h3>
//                   <span className={styles.cardBadge}>{formatEnum(p.gstType)}</span>
//                 </div>
//                 <div className={styles.cardBody}>
//                   {p.gstin && (
//                     <div className={styles.cardRow}>
//                       <Package size={16} />
//                       <span>{p.gstin}</span>
//                     </div>
//                   )}
//                   {p.phoneNo && (
//                     <div className={styles.cardRow}>
//                       <Phone size={16} />
//                       <span>{p.phoneNo}</span>
//                     </div>
//                   )}
//                   {p.state && (
//                     <div className={styles.cardRow}>
//                       <MapPin size={16} />
//                       <span>{formatEnum(p.state)}</span>
//                     </div>
//                   )}
//                   {p.emailId && (
//                     <div className={styles.cardRow}>
//                       <Mail size={16} />
//                       <a href={`mailto:${p.emailId}`} className={styles.link}>
//                         {p.emailId}
//                       </a>
//                     </div>
//                   )}
//                   {p.billingAddress && (
//                     <div className={styles.cardRow}>
//                       <Home size={16} />
//                       <span>{p.billingAddress}</span>
//                     </div>
//                   )}
//                 </div>
//                 <div className={styles.cardFooter}>
//                   <button onClick={() => handleEdit(p)} className={styles.cardEdit}>
//                     <Edit size={16} /> Edit
//                   </button>
//                   <button onClick={() => handleDelete(p.partyId)} className={styles.cardDelete}>
//                     <Trash2 size={16} /> Delete
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// const formatEnum = (val) =>
//   val
//     ? val
//         .replace(/_/g, " ")
//         .toLowerCase()
//         .replace(/\b\w/g, (c) => c.toUpperCase())
//     : "—";

// export default Parties;






// // src/pages/Parties.jsx
// "use client";

// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import config from "../../../config/apiconfig";
// import {
//   Search,
//   Plus,
//   Edit2,
//   Trash2,
//   Eye,
//   X,
//   Package,
//   AlertCircle,
//   CheckCircle,
//   Loader,
//   Mail,
//   Phone,
//   MapPin,
//   Home,
//   Building,
//   ChevronDown, // <-- ADDED HERE
// } from "lucide-react";
// import styles from "../Styles/ScreenUI.module.css";

// const Parties = () => {
//   const navigate = useNavigate();
//   const ebillingData = JSON.parse(localStorage.getItem("eBilling")) || {};
//   const companyId = ebillingData?.selectedCompany?.id;
//   const token = ebillingData?.accessToken;

//   const [parties, setParties] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [selectedParty, setSelectedParty] = useState(null);

//   /* ------------------------------------------------------------------ */
//   /* -------------------------- API LOGIC ---------------------------- */
//   /* ------------------------------------------------------------------ */
//   const fetchParties = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await axios.get(
//         `${config.BASE_URL}/company/${companyId}/parties`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setParties(response.data);
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to load parties.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (!token || !companyId) {
//       navigate("/Add-parties");
//       return;
//     }
//     fetchParties();
//   }, [token, companyId, navigate]);

//   const handleEdit = (party) => {
//     navigate("/Add-parties", { state: { party, companyId, token } });
//   };

//   const handleDelete = async (partyId) => {
//     if (!window.confirm("Delete this party?")) return;
//     setLoading(true);
//     try {
//       await axios.delete(`${config.BASE_URL}/party/${partyId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       fetchParties();
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to delete.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filteredParties = parties.filter((p) =>
//     [p.name, p.gstin, p.emailId, p.phoneNo]
//       .filter(Boolean)
//       .some((f) => f.toLowerCase().includes(searchTerm.toLowerCase()))
//   );

//   const formatEnum = (val) =>
//     val
//       ? val
//           .replace(/_/g, " ")
//           .toLowerCase()
//           .replace(/\b\w/g, (c) => c.toUpperCase())
//       : "—";

//   /* ------------------------------------------------------------------ */
//   /* --------------------------- RENDER ------------------------------- */
//   /* ------------------------------------------------------------------ */
//   return (
//     <div className={styles["company-form-container"]}>
//       {/* ==================== HEADER ==================== */}
//       <div className={styles["form-header"]}>
//         <div className={styles["header-content"]}>
//           <div className={styles["header-text"]}>
//             <h1 className={styles["company-form-title"]}>Parties</h1>
//             <p className={styles["form-subtitle"]}>Manage your business contacts</p>
//           </div>
//         </div>
//         <button
//           onClick={() => navigate("/Add-parties", { state: { companyId, token } })}
//           className={styles["submit-button"]}
//           disabled={loading}
//         >
//           <Plus size={18} />
//           <span>Create Party</span>
//         </button>
//       </div>

//       {/* ==================== SEARCH ==================== */}
//       <div className={styles["search-container"]}>
//         <Search size={18} className={styles["search-icon"]} />
//         <input
//           type="text"
//           placeholder="Search by name, GST, email, phone..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className={styles["search-input"]}
//           disabled={loading}
//         />
//       </div>

//       {/* ==================== LOADING ==================== */}
//       {loading && (
//         <div className={styles["loading-message"]}>
//           <Loader size={32} className={styles["spinner"]} />
//           <p>Loading parties...</p>
//         </div>
//       )}

//       {/* ==================== ERROR ==================== */}
//       {error && (
//         <div className={styles["error"]}>
//           <AlertCircle size={18} />
//           {error}
//         </div>
//       )}

//       {/* ==================== TABLE / CARDS ==================== */}
//       {filteredParties.length > 0 ? (
//         <>
//           {/* ---------- Desktop Table ---------- */}
//           <div className={styles["table-wrapper"]}>
//             <table className={styles.table}>
//               <thead>
//                 <tr>
//                   <th>Name</th>
//                   <th>GST No</th>
//                   <th>Type</th>
//                   <th>Phone</th>
//                   <th>State</th>
//                   <th>Email</th>
//                   <th>Billing</th>
//                   <th>Shipping</th>
//                   <th>Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredParties.map((p) => (
//                   <tr key={p.partyId} className={styles["table-row"]}>
//                     <td className={styles["nameCell"]}>{p.name || "—"}</td>
//                     <td>{p.gstin || "—"}</td>
//                     <td>{formatEnum(p.gstType)}</td>
//                     <td>{p.phoneNo || "—"}</td>
//                     <td>{formatEnum(p.state)}</td>
//                     <td>
//                       {p.emailId ? (
//                         <a href={`mailto:${p.emailId}`} className={styles.link}>
//                           {p.emailId}
//                         </a>
//                       ) : "—"}
//                     </td>
//                     <td className={styles["addressCell"]}>{p.billingAddress || "—"}</td>
//                     <td className={styles["addressCell"]}>{p.shipingAddress || "—"}</td>
//                     <td className={styles["actions-cell"]}>
//                       <button
//                         onClick={() => setSelectedParty(p)}
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

//           {/* ---------- Mobile Cards ---------- */}
//           <div className={styles["mobile-cards-container"]}>
//             {filteredParties.map((p) => (
//               <div key={p.partyId} className={styles["invoice-card"]}>
//                 <div className={styles["card-header-mobile"]}>
//                   <div className={styles["card-title-section"]}>
//                     <h3 className={styles["card-invoice-number"]}>{p.name || "Unnamed"}</h3>
//                     <span className={styles["status-badge-paid"]}>{formatEnum(p.gstType)}</span>
//                   </div>
//                   <button
//                     onClick={() => setSelectedParty(p)}
//                     className={styles["card-action-button"]}
//                   >
//                     <ChevronDown size={20} /> {/* NOW WORKS */}
//                   </button>
//                 </div>

//                 <div className={styles["card-body"]}>
//                   {p.gstin && (
//                     <div className={styles["card-info-row"]}>
//                       <span className={styles["info-label"]}>GSTIN:</span>
//                       <span className={styles["info-value"]}>{p.gstin}</span>
//                     </div>
//                   )}
//                   {p.phoneNo && (
//                     <div className={styles["card-info-row"]}>
//                       <span className={styles["info-label"]}>Phone:</span>
//                       <span className={styles["info-value"]}>{p.phoneNo}</span>
//                     </div>
//                   )}
//                   {p.state && (
//                     <div className={styles["card-info-row"]}>
//                       <span className={styles["info-label"]}>State:</span>
//                       <span className={styles["info-value"]}>{formatEnum(p.state)}</span>
//                     </div>
//                   )}
//                   {p.emailId && (
//                     <div className={styles["card-info-row"]}>
//                       <span className={styles["info-label"]}>Email:</span>
//                       <a href={`mailto:${p.emailId}`} className={styles.link}>
//                         {p.emailId}
//                       </a>
//                     </div>
//                   )}
//                 </div>

//                 <div className={styles["card-footer"]}>
//                   <button
//                     onClick={() => setSelectedParty(p)}
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
//         /* ==================== EMPTY STATE ==================== */
//         !loading && (
//           <div className={styles["no-data"]}>
//             <Package size={48} />
//             <p>No parties found</p>
//             <p className={styles["no-data-subtitle"]}>
//               {searchTerm ? "Try adjusting your search criteria" : 'Click "Create Party" to add one.'}
//             </p>
//           </div>
//         )
//       )}

//       {/* ==================== VIEW MODAL ==================== */}
//       {selectedParty && (
//         <div className={styles["modal-overlay"]} onClick={() => setSelectedParty(null)}>
//           <div className={styles["detail-card"]} onClick={(e) => e.stopPropagation()}>
//             <div className={styles["card-header"]}>
//               <div className={styles["header-title-section"]}>
//                 <h3>Party #{selectedParty.partyId}</h3>
//                 <div className={styles["balance-badge"]}>
//                   <CheckCircle size={16} />
//                   Active
//                 </div>
//               </div>

//               <div className={styles["header-actions"]}>
//                 <button
//                   onClick={() => handleEdit(selectedParty)}
//                   className={`${styles["action-button"]} ${styles["edit-button"]}`}
//                   title="Edit party"
//                 >
//                   <Edit2 size={16} />
//                   <span>Edit</span>
//                 </button>

//                 <button
//                   onClick={() => handleDelete(selectedParty.partyId)}
//                   className={`${styles["action-button"]} ${styles["delete-button"]}`}
//                   title="Delete party"
//                 >
//                   <Trash2 size={16} />
//                   <span>Delete</span>
//                 </button>

//                 <button
//                   className={styles["close-modal-btn"]}
//                   onClick={() => setSelectedParty(null)}
//                   title="Close"
//                 >
//                   <X size={20} />
//                 </button>
//               </div>
//             </div>

//             {/* ---------- Party Details ---------- */}
//             <section className={styles["card-section"]}>
//               <h4 className={styles["section-title"]}>Party Information</h4>
//               <div className={styles["detail-grid"]}>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>Name:</span>
//                   <span className={styles["detail-value"]}>{selectedParty.name || "—"}</span>
//                 </div>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>GSTIN:</span>
//                   <span className={styles["detail-value"]}>{selectedParty.gstin || "—"}</span>
//                 </div>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>GST Type:</span>
//                   <span className={styles["detail-value"]}>{formatEnum(selectedParty.gstType)}</span>
//                 </div>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>Phone:</span>
//                   <span className={styles["detail-value"]}>{selectedParty.phoneNo || "—"}</span>
//                 </div>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>Email:</span>
//                   <span className={styles["detail-value"]}>
//                     {selectedParty.emailId ? (
//                       <a href={`mailto:${selectedParty.emailId}`} className={styles.link}>
//                         {selectedParty.emailId}
//                       </a>
//                     ) : "—"}
//                   </span>
//                 </div>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>State:</span>
//                   <span className={styles["detail-value"]}>{formatEnum(selectedParty.state)}</span>
//                 </div>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>Billing Address:</span>
//                   <span className={styles["detail-value"]}>{selectedParty.billingAddress || "—"}</span>
//                 </div>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>Shipping Address:</span>
//                   <span className={styles["detail-value"]}>{selectedParty.shipingAddress || "—"}</span>
//                 </div>
//               </div>
//             </section>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Parties;









// "use client";

// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../../../utils/axiosInstance";
// import { toast } from "react-toastify";
// import {
//   Search,
//   Plus,
//   Edit2,
//   Trash2,
//   Eye,
//   X,
//   Package,
//   AlertCircle,
//   CheckCircle,
//   Loader,
//   Mail,
//   Phone,
//   MapPin,
//   Home,
//   Building,
//   ChevronDown,
// } from "lucide-react";
// import styles from "../Styles/ScreenUI.module.css";

// const Parties = () => {
//   const navigate = useNavigate();

//   const [userData, setUserData] = useState(
//     JSON.parse(localStorage.getItem("eBilling") || "{}")
//   );

//   const companyId = userData?.selectedCompany?.id;
//   const token = userData?.accessToken;

//   const [parties, setParties] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [selectedParty, setSelectedParty] = useState(null);

//   // Sync with localStorage changes (e.g., logout, token refresh, company switch)
//   useEffect(() => {
//     const handleStorageChange = () => {
//       const updated = JSON.parse(localStorage.getItem("eBilling") || "{}");
//       setUserData(updated);
//     };

//     window.addEventListener("storage", handleStorageChange);
//     return () => window.removeEventListener("storage", handleStorageChange);
//   }, []);

//   // Auth check + fetch parties
//   useEffect(() => {
//     if (!token || !companyId) {
//       toast.info("Please select a company to manage parties.");
//       navigate("/company-list"); // Better than /Add-parties if no company
//       return;
//     }

//     fetchParties();
//   }, [token, companyId, navigate]);

//   const fetchParties = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await api.get(`/company/${companyId}/parties`);
//       setParties(response.data || []);
//     } catch (err) {
//       const message =
//         err.response?.data?.message || "Failed to load parties.";
//       setError(message);
//       toast.error(message);
//       // 401 handled globally by interceptor
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (party) => {
//     navigate("/Add-parties", { state: { party } }); // No need to pass companyId/token
//   };

//   const handleDelete = async (partyId) => {
//     if (!window.confirm("Are you sure you want to delete this party?")) return;

//     setLoading(true);
//     try {
//       await api.delete(`/party/${partyId}`);
//       toast.success("Party deleted successfully.");
//       fetchParties();
//     } catch (err) {
//       const message =
//         err.response?.data?.message || "Failed to delete party.";
//       setError(message);
//       toast.error(message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filteredParties = parties.filter((p) =>
//     [p.name, p.gstin, p.emailId, p.phoneNo]
//       .filter(Boolean)
//       .some((f) => f.toLowerCase().includes(searchTerm.toLowerCase()))
//   );

//   const formatEnum = (val) =>
//     val
//       ? val
//           .replace(/_/g, " ")
//           .toLowerCase()
//           .replace(/\b\w/g, (c) => c.toUpperCase())
//       : "—";

//   return (
//     <div className={styles["company-form-container"]}>
//       {/* ==================== HEADER ==================== */}
//       <div className={styles["form-header"]}>
//         <div className={styles["header-content"]}>
//           <div className={styles["header-text"]}>
//             <h1 className={styles["company-form-title"]}>Parties</h1>
//             <p className={styles["form-subtitle"]}>Manage your business contacts</p>
//           </div>
//         </div>
//         <button
//           onClick={() => navigate("/Add-parties")}
//           className={styles["submit-button"]}
//           disabled={loading}
//         >
//           <Plus size={18} />
//           <span>Create Party</span>
//         </button>
//       </div>

//       {/* ==================== SEARCH ==================== */}
//       <div className={styles["search-container"]}>
//         <Search size={18} className={styles["search-icon"]} />
//         <input
//           type="text"
//           placeholder="Search by name, GST, email, phone..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className={styles["search-input"]}
//           disabled={loading}
//         />
//       </div>

//       {/* ==================== LOADING ==================== */}
//       {loading && (
//         <div className={styles["loading-message"]}>
//           <Loader size={32} className={styles["spinner"]} />
//           <p>Loading parties...</p>
//         </div>
//       )}

//       {/* ==================== ERROR ==================== */}
//       {error && (
//         <div className={styles["error"]}>
//           <AlertCircle size={18} />
//           {error}
//         </div>
//       )}

//       {/* ==================== TABLE / CARDS ==================== */}
//       {filteredParties.length > 0 ? (
//         <>
//           {/* ---------- Desktop Table ---------- */}
//           <div className={styles["table-wrapper"]}>
//             <table className={styles.table}>
//               <thead>
//                 <tr>
//                   <th>Name</th>
//                   <th>GST No</th>
//                   <th>Type</th>
//                   <th>Phone</th>
//                   <th>State</th>
//                   <th>Email</th>
//                   <th>Billing</th>
//                   <th>Shipping</th>
//                   <th>Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredParties.map((p) => (
//                   <tr key={p.partyId} className={styles["table-row"]}>
//                     <td className={styles["nameCell"]}>{p.name || "—"}</td>
//                     <td>{p.gstin || "—"}</td>
//                     <td>{formatEnum(p.gstType)}</td>
//                     <td>{p.phoneNo || "—"}</td>
//                     <td>{formatEnum(p.state)}</td>
//                     <td>
//                       {p.emailId ? (
//                         <a href={`mailto:${p.emailId}`} className={styles.link}>
//                           {p.emailId}
//                         </a>
//                       ) : "—"}
//                     </td>
//                     <td className={styles["addressCell"]}>{p.billingAddress || "—"}</td>
//                     <td className={styles["addressCell"]}>{p.shipingAddress || "—"}</td>
//                     <td className={styles["actions-cell"]}>
//                       <button
//                         onClick={() => setSelectedParty(p)}
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

//           {/* ---------- Mobile Cards ---------- */}
//           <div className={styles["mobile-cards-container"]}>
//             {filteredParties.map((p) => (
//               <div key={p.partyId} className={styles["invoice-card"]}>
//                 <div className={styles["card-header-mobile"]}>
//                   <div className={styles["card-title-section"]}>
//                     <h3 className={styles["card-invoice-number"]}>{p.name || "Unnamed"}</h3>
//                     <span className={styles["status-badge-paid"]}>{formatEnum(p.gstType)}</span>
//                   </div>
//                   <button
//                     onClick={() => setSelectedParty(p)}
//                     className={styles["card-action-button"]}
//                   >
//                     <ChevronDown size={20} />
//                   </button>
//                 </div>

//                 <div className={styles["card-body"]}>
//                   {p.gstin && (
//                     <div className={styles["card-info-row"]}>
//                       <span className={styles["info-label"]}>GSTIN:</span>
//                       <span className={styles["info-value"]}>{p.gstin}</span>
//                     </div>
//                   )}
//                   {p.phoneNo && (
//                     <div className={styles["card-info-row"]}>
//                       <span className={styles["info-label"]}>Phone:</span>
//                       <span className={styles["info-value"]}>{p.phoneNo}</span>
//                     </div>
//                   )}
//                   {p.state && (
//                     <div className={styles["card-info-row"]}>
//                       <span className={styles["info-label"]}>State:</span>
//                       <span className={styles["info-value"]}>{formatEnum(p.state)}</span>
//                     </div>
//                   )}
//                   {p.emailId && (
//                     <div className={styles["card-info-row"]}>
//                       <span className={styles["info-label"]}>Email:</span>
//                       <a href={`mailto:${p.emailId}`} className={styles.link}>
//                         {p.emailId}
//                       </a>
//                     </div>
//                   )}
//                 </div>

//                 <div className={styles["card-footer"]}>
//                   <button
//                     onClick={() => setSelectedParty(p)}
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
//             <p>No parties found</p>
//             <p className={styles["no-data-subtitle"]}>
//               {searchTerm ? "Try adjusting your search criteria" : 'Click "Create Party" to add one.'}
//             </p>
//           </div>
//         )
//       )}

//       {/* ==================== VIEW MODAL ==================== */}
//       {selectedParty && (
//         <div className={styles["modal-overlay"]} onClick={() => setSelectedParty(null)}>
//           <div className={styles["detail-card"]} onClick={(e) => e.stopPropagation()}>
//             <div className={styles["card-header"]}>
//               <div className={styles["header-title-section"]}>
//                 <h3>Party #{selectedParty.partyId}</h3>
//                 <div className={styles["balance-badge"]}>
//                   <CheckCircle size={16} />
//                   Active
//                 </div>
//               </div>

//               <div className={styles["header-actions"]}>
//                 <button
//                   onClick={() => handleEdit(selectedParty)}
//                   className={`${styles["action-button"]} ${styles["edit-button"]}`}
//                   title="Edit party"
//                 >
//                   <Edit2 size={16} />
//                   <span>Edit</span>
//                 </button>

//                 <button
//                   onClick={() => handleDelete(selectedParty.partyId)}
//                   className={`${styles["action-button"]} ${styles["delete-button"]}`}
//                   title="Delete party"
//                 >
//                   <Trash2 size={16} />
//                   <span>Delete</span>
//                 </button>

//                 <button
//                   className={styles["close-modal-btn"]}
//                   onClick={() => setSelectedParty(null)}
//                   title="Close"
//                 >
//                   <X size={20} />
//                 </button>
//               </div>
//             </div>

//             {/* ---------- Party Details ---------- */}
//             <section className={styles["card-section"]}>
//               <h4 className={styles["section-title"]}>Party Information</h4>
//               <div className={styles["detail-grid"]}>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>Name:</span>
//                   <span className={styles["detail-value"]}>{selectedParty.name || "—"}</span>
//                 </div>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>GSTIN:</span>
//                   <span className={styles["detail-value"]}>{selectedParty.gstin || "—"}</span>
//                 </div>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>GST Type:</span>
//                   <span className={styles["detail-value"]}>{formatEnum(selectedParty.gstType)}</span>
//                 </div>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>Phone:</span>
//                   <span className={styles["detail-value"]}>{selectedParty.phoneNo || "—"}</span>
//                 </div>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>Email:</span>
//                   <span className={styles["detail-value"]}>
//                     {selectedParty.emailId ? (
//                       <a href={`mailto:${selectedParty.emailId}`} className={styles.link}>
//                         {selectedParty.emailId}
//                       </a>
//                     ) : "—"}
//                   </span>
//                 </div>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>State:</span>
//                   <span className={styles["detail-value"]}>{formatEnum(selectedParty.state)}</span>
//                 </div>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>Billing Address:</span>
//                   <span className={styles["detail-value"]}>{selectedParty.billingAddress || "—"}</span>
//                 </div>
//                 <div className={styles["detail-item"]}>
//                   <span className={styles["detail-label"]}>Shipping Address:</span>
//                   <span className={styles["detail-value"]}>{selectedParty.shipingAddress || "—"}</span>
//                 </div>
//               </div>
//             </section>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Parties;






"use client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/axiosInstance";
import { toast } from "react-toastify";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  X,
  Package,
  AlertCircle,
  CheckCircle,
  Loader,
  History,
  ChevronLeft,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import styles from "../Styles/ScreenUI.module.css";

const Parties = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("eBilling") || "{}")
  );
  const companyId = userData?.selectedCompany?.id;
  const token = userData?.accessToken;

  const [parties, setParties] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedParty, setSelectedParty] = useState(null);

  // Transaction modal states
  const [showTransactions, setShowTransactions] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [transactionLoading, setTransactionLoading] = useState(false);
  const [transactionPage, setTransactionPage] = useState(0);
  const [transactionTotalPages, setTransactionTotalPages] = useState(1);
  const pageSize = 10;

  // Sync localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const updated = JSON.parse(localStorage.getItem("eBilling") || "{}");
      setUserData(updated);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Auth check + fetch parties
  useEffect(() => {
    if (!token || !companyId) {
      toast.info("Please select a company to manage parties.");
      navigate("/company-list");
      return;
    }
    fetchParties();
  }, [token, companyId, navigate]);

  const fetchParties = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/company/${companyId}/parties`);
      setParties(response.data || []);
    } catch (err) {
      const message = err.response?.data?.message || "Failed to load parties.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async (page = 0) => {
    if (!selectedParty?.partyId) return;

    setTransactionLoading(true);
    try {
      const response = await api.get(
        `/party/${selectedParty.partyId}/transaction/list`,
        {
          params: {
            page,
            size: pageSize,
          },
        }
      );

      setTransactions(response.data.content || []);
      setTransactionTotalPages(response.data.totalPages || 1);
      setTransactionPage(response.data.number || 0);
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to load transactions.";
      toast.error(message);
    } finally {
      setTransactionLoading(false);
    }
  };

  const handleEdit = (party) => {
    navigate("/Add-parties", { state: { party } });
  };

  const handleDelete = async (partyId) => {
    if (!window.confirm("Are you sure you want to delete this party?")) return;
    setLoading(true);
    try {
      await api.delete(`/party/${partyId}`);
      toast.success("Party deleted successfully.");
      fetchParties();
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to delete party.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const openTransactions = (party) => {
    setSelectedParty(party);
    setShowTransactions(true);
    setTransactionPage(0);
    fetchTransactions(0);
  };

  const filteredParties = parties.filter((p) =>
    [p.name, p.gstin, p.emailId, p.phoneNo]
      .filter(Boolean)
      .some((f) => f?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatEnum = (val) =>
    val
      ? val
          .replace(/_/g, " ")
          .toLowerCase()
          .replace(/\b\w/g, (c) => c.toUpperCase())
      : "—";

  // Pagination helper - generates visible page numbers with ellipsis
  const getVisiblePages = () => {
    const total = transactionTotalPages;
    const current = transactionPage + 1;
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= total; i++) {
      if (
        i === 1 ||
        i === total ||
        (i >= current - delta && i <= current + delta)
      ) {
        range.push(i);
      }
    }

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  };

  return (
    <div className={styles["company-form-container"]}>
      {/* ==================== HEADER ==================== */}
      <div className={styles["form-header"]}>
        <div className={styles["header-content"]}>
          <div className={styles["header-text"]}>
            <h1 className={styles["company-form-title"]}>Parties</h1>
            <p className={styles["form-subtitle"]}>Manage your business contacts</p>
          </div>
        </div>
        <button
          onClick={() => navigate("/Add-parties")}
          className={styles["submit-button"]}
          disabled={loading}
        >
          <Plus size={18} />
          <span>Create Party</span>
        </button>
      </div>

      {/* ==================== SEARCH ==================== */}
      <div className={styles["search-container"]}>
        <Search size={18} className={styles["search-icon"]} />
        <input
          type="text"
          placeholder="Search by name, GST, email, phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles["search-input"]}
          disabled={loading}
        />
      </div>

      {/* ==================== LOADING & ERROR ==================== */}
      {loading && (
        <div className={styles["loading-message"]}>
          <Loader size={32} className={styles["spinner"]} />
          <p>Loading parties...</p>
        </div>
      )}

      {error && (
        <div className={styles["error"]}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* ==================== PARTIES LIST ==================== */}
      {filteredParties.length > 0 ? (
        <>
          {/* Desktop Table */}
          <div className={styles["table-wrapper"]}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>GST No</th>
                  <th>Type</th>
                  <th>Phone</th>
                  <th>State</th>
                  <th>Email</th>
                  <th>Billing Address</th>
                  <th>Shipping Address</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredParties.map((p) => (
                  <tr key={p.partyId}>
                    <td className={styles["nameCell"]}>{p.name || "—"}</td>
                    <td>{p.gstin || "—"}</td>
                    <td>{formatEnum(p.gstType)}</td>
                    <td>{p.phoneNo || "—"}</td>
                    <td>{formatEnum(p.state)}</td>
                    <td>
                      {p.emailId ? (
                        <a href={`mailto:${p.emailId}`} className={styles.link}>
                          {p.emailId}
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className={styles["addressCell"]}>
                      {p.billingAddress || "—"}
                    </td>
                    <td className={styles["addressCell"]}>
                      {p.shipingAddress || "—"}
                    </td>
                    <td className={styles["actions-cell"]}>
                      <button
                        onClick={() => setSelectedParty(p)}
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

          {/* Mobile Cards */}
          <div className={styles["mobile-cards-container"]}>
            {filteredParties.map((p) => (
              <div key={p.partyId} className={styles["invoice-card"]}>
                <div className={styles["card-header-mobile"]}>
                  <div className={styles["card-title-section"]}>
                    <h3 className={styles["card-invoice-number"]}>
                      {p.name || "Unnamed"}
                    </h3>
                    <span className={styles["status-badge-paid"]}>
                      {formatEnum(p.gstType)}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedParty(p)}
                    className={styles["card-action-button"]}
                  >
                    <ChevronDown size={20} />
                  </button>
                </div>

                <div className={styles["card-body"]}>
                  {p.gstin && (
                    <div className={styles["card-info-row"]}>
                      <span className={styles["info-label"]}>GSTIN:</span>
                      <span className={styles["info-value"]}>{p.gstin}</span>
                    </div>
                  )}
                  {p.phoneNo && (
                    <div className={styles["card-info-row"]}>
                      <span className={styles["info-label"]}>Phone:</span>
                      <span className={styles["info-value"]}>{p.phoneNo}</span>
                    </div>
                  )}
                  {p.state && (
                    <div className={styles["card-info-row"]}>
                      <span className={styles["info-label"]}>State:</span>
                      <span className={styles["info-value"]}>
                        {formatEnum(p.state)}
                      </span>
                    </div>
                  )}
                  {p.emailId && (
                    <div className={styles["card-info-row"]}>
                      <span className={styles["info-label"]}>Email:</span>
                      <a href={`mailto:${p.emailId}`} className={styles.link}>
                        {p.emailId}
                      </a>
                    </div>
                  )}
                </div>

                <div className={styles["card-footer"]}>
                  <button
                    onClick={() => setSelectedParty(p)}
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
            <p>No parties found</p>
            <p className={styles["no-data-subtitle"]}>
              {searchTerm
                ? "Try adjusting your search criteria"
                : 'Click "Create Party" to add one.'}
            </p>
          </div>
        )
      )}

      {/* ==================== PARTY DETAIL MODAL ==================== */}
      {selectedParty && !showTransactions && (
        <div
          className={styles["modal-overlay"]}
          onClick={() => setSelectedParty(null)}
        >
          <div
            className={styles["detail-card"]}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles["card-header"]}>
              <div className={styles["header-title-section"]}>
                <h3>Party #{selectedParty.partyId}</h3>
                <div className={styles["balance-badge"]}>
                  <CheckCircle size={16} />
                  Active
                </div>
              </div>

              <div className={styles["header-actions"]}>
                <button
                  onClick={() => openTransactions(selectedParty)}
                  className={`${styles["action-button"]} ${styles["history-button"]}`}
                  title="View transactions"
                >
                  <History size={16} />
                  <span>Transactions</span>
                </button>

                <button
                  onClick={() => handleEdit(selectedParty)}
                  className={`${styles["action-button"]} ${styles["edit-button"]}`}
                  title="Edit party"
                >
                  <Edit2 size={16} />
                  <span>Edit</span>
                </button>

                <button
                  onClick={() => handleDelete(selectedParty.partyId)}
                  className={`${styles["action-button"]} ${styles["delete-button"]}`}
                  title="Delete party"
                >
                  <Trash2 size={16} />
                  <span>Delete</span>
                </button>

                <button
                  className={styles["close-modal-btn"]}
                  onClick={() => setSelectedParty(null)}
                  title="Close"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <section className={styles["card-section"]}>
              <h4 className={styles["section-title"]}>Party Information</h4>
              <div className={styles["detail-grid"]}>
                <div className={styles["detail-item"]}>
                  <span className={styles["detail-label"]}>Name:</span>
                  <span className={styles["detail-value"]}>
                    {selectedParty.name || "—"}
                  </span>
                </div>
                <div className={styles["detail-item"]}>
                  <span className={styles["detail-label"]}>GSTIN:</span>
                  <span className={styles["detail-value"]}>
                    {selectedParty.gstin || "—"}
                  </span>
                </div>
                <div className={styles["detail-item"]}>
                  <span className={styles["detail-label"]}>GST Type:</span>
                  <span className={styles["detail-value"]}>
                    {formatEnum(selectedParty.gstType)}
                  </span>
                </div>
                <div className={styles["detail-item"]}>
                  <span className={styles["detail-label"]}>Phone:</span>
                  <span className={styles["detail-value"]}>
                    {selectedParty.phoneNo || "—"}
                  </span>
                </div>
                <div className={styles["detail-item"]}>
                  <span className={styles["detail-label"]}>Email:</span>
                  <span className={styles["detail-value"]}>
                    {selectedParty.emailId ? (
                      <a
                        href={`mailto:${selectedParty.emailId}`}
                        className={styles.link}
                      >
                        {selectedParty.emailId}
                      </a>
                    ) : (
                      "—"
                    )}
                  </span>
                </div>
                <div className={styles["detail-item"]}>
                  <span className={styles["detail-label"]}>State:</span>
                  <span className={styles["detail-value"]}>
                    {formatEnum(selectedParty.state)}
                  </span>
                </div>
                <div className={styles["detail-item"]}>
                  <span className={styles["detail-label"]}>Billing Address:</span>
                  <span className={styles["detail-value"]}>
                    {selectedParty.billingAddress || "—"}
                  </span>
                </div>
                <div className={styles["detail-item"]}>
                  <span className={styles["detail-label"]}>Shipping Address:</span>
                  <span className={styles["detail-value"]}>
                    {selectedParty.shipingAddress || "—"}
                  </span>
                </div>
              </div>
            </section>
          </div>
        </div>
      )}

      {/* ==================== TRANSACTIONS MODAL ==================== */}
      {showTransactions && selectedParty && (
        <div
          className={styles["modal-overlay"]}
          onClick={() => setShowTransactions(false)}
        >
          <div
            className={`${styles["detail-card"]} ${styles["transactions-modal"]}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles["card-header"]}>
              <div className={styles["header-title-section"]}>
                <h3>Transactions History</h3>
                <p className={styles["subtitle"]}>
                  {selectedParty.name} (#{selectedParty.partyId})
                </p>
              </div>

              <button
                className={styles["close-modal-btn"]}
                onClick={() => setShowTransactions(false)}
                title="Close"
              >
                <X size={20} />
              </button>
            </div>

            {transactionLoading ? (
              <div className={styles["loading-message"]}>
                <Loader size={32} className={styles["spinner"]} />
                <p>Loading transactions...</p>
              </div>
            ) : transactions.length > 0 ? (
              <>
                <div className={styles["table-wrapper"]}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Reference</th>
                        <th>Amount</th>
                        <th>Running Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((tx) => (
                        <tr key={tx.id}>
                          <td>{tx.activityDate || "—"}</td>
                          <td>
                            <span
                              className={
                                tx.transactionType === "SALE"
                                  ? styles["status-badge-success"]
                                  : styles["status-badge-warning"]
                              }
                            >
                              {tx.transactionType}
                            </span>
                          </td>
                          <td>
                            {tx.referenceNumber || tx.referenceId || "—"}
                          </td>
                          <td className={styles["amount-cell"]}>
                            {tx.amount != null ? tx.amount.toFixed(2) : "0.00"}
                          </td>
                          <td className={styles["amount-cell"]}>
                            {tx.runningBalance != null
                              ? tx.runningBalance.toFixed(2)
                              : "0.00"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Modern Pagination with ellipsis */}
                {transactionTotalPages > 1 && (
                  <div className={styles["pagination-container"]}>
                    <button
                      onClick={() => fetchTransactions(transactionPage - 1)}
                      disabled={transactionPage === 0}
                      className={`${styles["pagination-arrow"]} ${
                        transactionPage === 0 ? styles["disabled"] : ""
                      }`}
                    >
                      <ChevronLeft size={18} />
                    </button>

                    <div className={styles["pagination-numbers"]}>
                      {getVisiblePages().map((page, index) => (
                        <button
                          key={`${page}-${index}`}
                          onClick={() =>
                            typeof page === "number" && fetchTransactions(page - 1)
                          }
                          className={`${styles["page-number"]} ${
                            typeof page === "string" ? styles["ellipsis"] : ""
                          } ${
                            typeof page === "number" && page - 1 === transactionPage
                              ? styles["active"]
                              : ""
                          }`}
                          disabled={typeof page === "string"}
                        >
                          {page}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => fetchTransactions(transactionPage + 1)}
                      disabled={transactionPage >= transactionTotalPages - 1}
                      className={`${styles["pagination-arrow"]} ${
                        transactionPage >= transactionTotalPages - 1
                          ? styles["disabled"]
                          : ""
                      }`}
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className={styles["no-data"]}>
                <History size={48} />
                <p>No transactions found for this party</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Parties;