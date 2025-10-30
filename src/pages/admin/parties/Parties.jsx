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








// src/pages/Parties.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../../../config/apiconfig";
import {
  Search, Plus, Edit, Trash2, Mail, Phone, MapPin, Home, Package, AlertCircle, Loader2
} from "lucide-react";
import styles from "./Parties.module.css";

const Parties = () => {
  const navigate = useNavigate();
  const ebillingData = JSON.parse(localStorage.getItem("eBilling")) || {};
  const companyId = ebillingData?.selectedCompany?.id;
  const token = ebillingData?.accessToken;

  const [parties, setParties] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchParties = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${config.BASE_URL}/company/${companyId}/parties`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setParties(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load parties.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token || !companyId) {
      navigate("/Add-parties");
      return;
    }
    fetchParties();
  }, [token, companyId, navigate]);

  const handleEdit = (party) => {
    navigate("/Add-parties", { state: { party, companyId, token } });
  };

  const handleDelete = async (partyId) => {
    if (!window.confirm("Delete this party?")) return;
    setLoading(true);
    try {
      await axios.delete(`${config.BASE_URL}/party/${partyId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchParties();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete.");
    } finally {
      setLoading(false);
    }
  };

  const filteredParties = parties.filter((p) =>
    [p.name, p.gstin, p.emailId, p.phoneNo]
      .filter(Boolean)
      .some((f) => f.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Parties</h1>
          <p className={styles.subtitle}>Manage your business contacts</p>
        </div>
        <button
          onClick={() => navigate("/Add-parties", { state: { companyId, token } })}
          className={styles.createBtn}
          disabled={loading}
        >
          <Plus size={18} />
          Create Party
        </button>
      </div>

      {/* Search */}
      <div className={styles.searchWrapper}>
        <Search className={styles.searchIcon} size={18} />
        <input
          type="text"
          placeholder="Search by name, GST, email, phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
          disabled={loading}
        />
      </div>

      {/* Loading */}
      {loading && (
        <div className={styles.loading}>
          <Loader2 className={styles.spinner} size={40} />
          <p>Loading parties...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className={styles.error}>
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredParties.length === 0 && (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>Inbox</div>
          <p>No parties found</p>
          <p className={styles.emptySub}>Click "Create Party" to add one</p>
        </div>
      )}

      {/* Desktop Table */}
      {!loading && !error && filteredParties.length > 0 && (
        <>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>GST No</th>
                  <th>Type</th>
                  <th>Phone</th>
                  <th>State</th>
                  <th>Email</th>
                  <th>Billing</th>
                  <th>Shipping</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredParties.map((p) => (
                  <tr key={p.partyId}>
                    <td className={styles.nameCell}>{p.name || "—"}</td>
                    <td>{p.gstin || "—"}</td>
                    <td>{formatEnum(p.gstType)}</td>
                    <td>{p.phoneNo || "—"}</td>
                    <td>{formatEnum(p.state)}</td>
                    <td>
                      {p.emailId ? (
                        <a href={`mailto:${p.emailId}`} className={styles.link}>
                          {p.emailId}
                        </a>
                      ) : "—"}
                    </td>
                    <td className={styles.addressCell}>{p.billingAddress || "—"}</td>
                    <td className={styles.addressCell}>{p.shipingAddress || "—"}</td>
                    <td className={styles.actionsCell}>
                      <button
                        onClick={() => handleEdit(p)}
                        className={styles.editBtn}
                        disabled={loading}
                        aria-label="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(p.partyId)}
                        className={styles.deleteBtn}
                        disabled={loading}
                        aria-label="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className={styles.cards}>
            {filteredParties.map((p) => (
              <div key={p.partyId} className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>{p.name || "Unnamed"}</h3>
                  <span className={styles.cardBadge}>{formatEnum(p.gstType)}</span>
                </div>
                <div className={styles.cardBody}>
                  {p.gstin && (
                    <div className={styles.cardRow}>
                      <Package size={16} />
                      <span>{p.gstin}</span>
                    </div>
                  )}
                  {p.phoneNo && (
                    <div className={styles.cardRow}>
                      <Phone size={16} />
                      <span>{p.phoneNo}</span>
                    </div>
                  )}
                  {p.state && (
                    <div className={styles.cardRow}>
                      <MapPin size={16} />
                      <span>{formatEnum(p.state)}</span>
                    </div>
                  )}
                  {p.emailId && (
                    <div className={styles.cardRow}>
                      <Mail size={16} />
                      <a href={`mailto:${p.emailId}`} className={styles.link}>
                        {p.emailId}
                      </a>
                    </div>
                  )}
                  {p.billingAddress && (
                    <div className={styles.cardRow}>
                      <Home size={16} />
                      <span>{p.billingAddress}</span>
                    </div>
                  )}
                </div>
                <div className={styles.cardFooter}>
                  <button onClick={() => handleEdit(p)} className={styles.cardEdit}>
                    <Edit size={16} /> Edit
                  </button>
                  <button onClick={() => handleDelete(p.partyId)} className={styles.cardDelete}>
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const formatEnum = (val) =>
  val
    ? val
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase())
    : "—";

export default Parties;