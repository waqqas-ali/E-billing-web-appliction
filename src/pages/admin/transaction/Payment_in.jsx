// // src/pages/Payment/PaymentIn.jsx
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import config from "../../../config/apiconfig";
// import styles from "./Payment.module.css";
// import { toast } from "react-toastify";

// const PaymentIn = () => {
//   const navigate = useNavigate();

//   const userData = JSON.parse(localStorage.getItem("eBilling") || "{}");
//   const token = userData?.accessToken || "";
//   const companyId = userData?.selectedCompany?.id || "";

//   const [payments, setPayments] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [selected, setSelected] = useState(null);
//   const [filterStartDate, setFilterStartDate] = useState("");
//   const [filterEndDate, setFilterEndDate] = useState("");

//   const getDefaultRange = () => {
//     const end = new Date();
//     const start = new Date();
//     start.setDate(end.getDate() - 30);
//     return {
//       startDate: start.toISOString().split("T")[0],
//       endDate: end.toISOString().split("T")[0],
//     };
//   };

//   const isTokenValid = () => {
//     if (!token) return false;
//     try {
//       const payload = JSON.parse(atob(token.split(".")[1]));
//       return payload.exp * 1000 > Date.now();
//     } catch {
//       return false;
//     }
//   };

//   const fetchPayments = async () => {
//     if (!token || !isTokenValid()) {
//       toast.error("Session expired. Please log in again.");
//       localStorage.removeItem("eBilling");
//       navigate("/login");
//       return;
//     }
//     if (!companyId) {
//       toast.error("No company selected.");
//       return;
//     }

//     const { startDate: defStart, endDate: defEnd } = getDefaultRange();
//     const params = {
//       startDate: filterStartDate || defStart,
//       endDate: filterEndDate || defEnd,
//     };

//     setLoading(true);
//     try {
//       const res = await axios.get(
//         `${config.BASE_URL}/company/${companyId}/payment-in/list/by/filter`,
//         {
//           params,
//           headers: { Authorization: `Bearer ${token}` },
//           timeout: 10000,
//         }
//       );
//       setPayments(res.data || []);
//       toast.success("Payments loaded");
//     } catch (err) {
//       console.error(err);
//       if (err.response?.status === 401) {
//         toast.error("Invalid token – logging out");
//         localStorage.removeItem("eBilling");
//         navigate("/login");
//       } else {
//         toast.error(err.response?.data?.message || "Failed to load payments");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPayments();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [token, companyId]);

//   // DELETE PAYMENT
//   const deletePayment = async (paymentInId) => {
//     if (!window.confirm("Delete this payment-in? This cannot be undone.")) return;

//     try {
//       setLoading(true);
//       await axios.delete(`${config.BASE_URL}/paymentIn/${paymentInId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setPayments((prev) => prev.filter((p) => p.paymentInId !== paymentInId));
//       setSelected(null);
//       toast.success("Payment deleted successfully");
//     } catch (err) {
//       console.error("Delete error:", err);
//       if (err.response?.status === 401) {
//         toast.error("Session expired. Logging out...");
//         localStorage.removeItem("eBilling");
//         navigate("/login");
//       } else {
//         toast.error(err.response?.data?.message || "Failed to delete payment");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className={styles["company-form-container"]}>
//       {/* HEADER */}
//       <div className={styles["form-header"]}>
//         <div>
//           <h1 className={styles["company-form-title"]}>Payments In</h1>
//           <p className={styles["form-subtitle"]}>All money received from parties</p>
//         </div>
//         <button
//           onClick={() => navigate("/create_payment_in")}
//           className={styles["submit-button"]}
//           disabled={loading}
//         >
//           + New Payment In
//         </button>
//       </div>

//       {/* DATE FILTER */}
//       <div
//         style={{
//           marginBottom: "16px",
//           display: "flex",
//           gap: "12px",
//           flexWrap: "wrap",
//         }}
//       >
//         <div>
//           <label style={{ fontSize: "0.9rem", fontWeight: 500 }}>Start Date</label>
//           <input
//             type="date"
//             value={filterStartDate}
//             onChange={(e) => setFilterStartDate(e.target.value)}
//             className={styles["form-input"]}
//             style={{ width: "160px" }}
//           />
//         </div>
//         <div>
//           <label style={{ fontSize: "0.9rem", fontWeight: 500 }}>End Date</label>
//           <input
//             type="date"
//             value={filterEndDate}
//             onChange={(e) => setFilterEndDate(e.target.value)}
//             className={styles["form-input"]}
//             style={{ width: "160px" }}
//           />
//         </div>
//         <button
//           onClick={fetchPayments}
//           className={styles["submit-button"]}
//           style={{ alignSelf: "end", height: "40px" }}
//           disabled={loading}
//         >
//           Apply Filter
//         </button>
//       </div>

//       {/* LOADING */}
//       {loading && (
//         <div className={styles["loading-message"]}>
//           <div className={styles.spinner}></div>
//           <p>Loading payments...</p>
//         </div>
//       )}

//       {/* TABLE */}
//       {payments.length > 0 ? (
//         <div className={styles["table-wrapper"]}>
//           <table className={styles.table}>
//             <thead>
//               <tr>
//                 <th>Receipt #</th>
//                 <th>Date</th>
//                 <th>Party</th>
//                 <th>Phone</th>
//                 <th>Amount</th>
//                 <th>Payment Type</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {payments.map((p) => (
//                 <tr key={p.paymentInId}>
//                   <td>{p.receiptNo}</td>
//                   <td>{new Date(p.paymentDate).toLocaleDateString()}</td>
//                   <td>{p.partyResponseDto?.name || "—"}</td>
//                   <td>{p.phoneNumber}</td>
//                   <td>₹{p.receivedAmount?.toFixed(2)}</td>
//                   <td>{p.paymentType}</td>
//                   <td className={styles["actions-cell"]}>
//                     <button
//                       onClick={() => setSelected(p)}
//                       className={`${styles["action-button"]} ${styles["view-button"]}`}
//                       title="View details"
//                     >
//                       View
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       ) : (
//         !loading && (
//           <div className={styles["no-data"]}>
//             <p>No payments in found</p>
//             <p className={styles["no-data-subtitle"]}>
//               Click “+ New Payment In” to record one.
//             </p>
//           </div>
//         )
//       )}

//       {/* VIEW MODAL WITH DELETE */}
//       {selected && (
//         <div
//           className={styles["modal-overlay"]}
//           onClick={() => setSelected(null)}
//         >
//           <div
//             className={styles["detail-card"]}
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className={styles["card-header"]}>
//               <div>
//                 <h3>Receipt #{selected.receiptNo}</h3>
//                 <div className={styles["balance-badge"]}>
//                   ₹{selected.receivedAmount?.toFixed(2)}
//                 </div>
//               </div>

//               <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
//                 {/* DELETE BUTTON */}
//                 <button
//                   onClick={() => deletePayment(selected.paymentInId)}
//                   className={`${styles["action-button"]} ${styles["delete-button"]}`}
//                   title="Delete payment"
//                   disabled={loading}
//                 >
//                   Delete
//                 </button>

//                 <button
//                   className={styles["close-modal-btn"]}
//                   onClick={() => setSelected(null)}
//                   disabled={loading}
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>

//             {/* SUMMARY */}
//             <section className={styles["card-section"]}>
//               <h4>Payment Summary</h4>
//               <div className={styles["detail-grid"]}>
//                 <p><strong>ID:</strong> {selected.paymentInId}</p>
//                 <p><strong>Date:</strong> {new Date(selected.paymentDate).toLocaleDateString()}</p>
//                 <p><strong>Phone:</strong> {selected.phoneNumber}</p>
//                 <p><strong>Amount:</strong> ₹{selected.receivedAmount?.toFixed(2)}</p>
//                 <p><strong>Payment Type:</strong> {selected.paymentType}</p>
//                 <p><strong>Description:</strong> {selected.description || "—"}</p>
//               </div>
//             </section>

//             {/* PARTY */}
//             {selected.partyResponseDto && (
//               <section className={styles["card-section"]}>
//                 <h4>Party Details</h4>
//                 <div className={styles["detail-grid"]}>
//                   <p><strong>Name:</strong> {selected.partyResponseDto.name}</p>
//                   <p><strong>GSTIN:</strong> {selected.partyResponseDto.gstin || "—"}</p>
//                   <p><strong>Phone:</strong> {selected.partyResponseDto.phoneNo || "—"}</p>
//                   <p><strong>GST Type:</strong> {selected.partyResponseDto.gstType?.replace(/_/g, " ")}</p>
//                   <p><strong>State:</strong> {selected.partyResponseDto.state?.replace(/_/g, " ")}</p>
//                   <p><strong>Email:</strong> {selected.partyResponseDto.emailId || "—"}</p>
//                   <p><strong>Billing:</strong> {selected.partyResponseDto.billingAddress || "—"}</p>
//                   <p><strong>Shipping:</strong> {selected.partyResponseDto.shipingAddress || "—"}</p>
//                 </div>
//               </section>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PaymentIn;







// // src/pages/Payment/PaymentIn.jsx
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import config from "../../../config/apiconfig";
// import styles from "./Payment.module.css";
// import { toast } from "react-toastify";

// const PaymentIn = () => {
//   const navigate = useNavigate();

//   const userData = JSON.parse(localStorage.getItem("eBilling") || "{}");
//   const token = userData?.accessToken || "";
//   const companyId = userData?.selectedCompany?.id || "";

//   const [payments, setPayments] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [selected, setSelected] = useState(null);
//   const [filterStartDate, setFilterStartDate] = useState("");
//   const [filterEndDate, setFilterEndDate] = useState("");

//   const getDefaultRange = () => {
//     const end = new Date();
//     const start = new Date();
//     start.setDate(end.getDate() - 30);
//     return {
//       startDate: start.toISOString().split("T")[0],
//       endDate: end.toISOString().split("T")[0],
//     };
//   };

//   const isTokenValid = () => {
//     if (!token) return false;
//     try {
//       const payload = JSON.parse(atob(token.split(".")[1]));
//       return payload.exp * 1000 > Date.now();
//     } catch {
//       return false;
//     }
//   };

//   const fetchPayments = async () => {
//     if (!token || !isTokenValid()) {
//       toast.error("Session expired. Please log in again.");
//       localStorage.removeItem("eBilling");
//       navigate("/login");
//       return;
//     }
//     if (!companyId) {
//       toast.error("No company selected.");
//       return;
//     }

//     const { startDate: defStart, endDate: defEnd } = getDefaultRange();
//     const params = {
//       startDate: filterStartDate || defStart,
//       endDate: filterEndDate || defEnd,
//     };

//     setLoading(true);
//     try {
//       const res = await axios.get(
//         `${config.BASE_URL}/company/${companyId}/payment-in/list/by/filter`,
//         {
//           params,
//           headers: { Authorization: `Bearer ${token}` },
//           timeout: 10000,
//         }
//       );
//       setPayments(res.data || []);
//       toast.success("Payments loaded");
//     } catch (err) {
//       console.error(err);
//       if (err.response?.status === 401) {
//         toast.error("Invalid token – logging out");
//         localStorage.removeItem("eBilling");
//         navigate("/login");
//       } else {
//         toast.error(err.response?.data?.message || "Failed to load payments");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPayments();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [token, companyId]);

//   // DELETE PAYMENT
//   const deletePayment = async (paymentInId) => {
//     if (!window.confirm("Delete this payment-in? This cannot be undone.")) return;

//     try {
//       setLoading(true);
//       await axios.delete(`${config.BASE_URL}/paymentIn/${paymentInId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setPayments((prev) => prev.filter((p) => p.paymentInId !== paymentInId));
//       setSelected(null);
//       toast.success("Payment deleted successfully");
//     } catch (err) {
//       console.error("Delete error:", err);
//       if (err.response?.status === 401) {
//         toast.error("Session expired. Logging out...");
//         localStorage.removeItem("eBilling");
//         navigate("/login");
//       } else {
//         toast.error(err.response?.data?.message || "Failed to delete payment");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className={styles["company-form-container"]}>
//       {/* HEADER */}
//       <div className={styles["form-header"]}>
//         <div>
//           <h1 className={styles["company-form-title"]}>Payments In</h1>
//           <p className={styles["form-subtitle"]}>All money received from parties</p>
//         </div>
//         <button
//           onClick={() => navigate("/create_payment_in")}
//           className={styles["submit-button"]}
//           disabled={loading}
//         >
//           + New Payment In
//         </button>
//       </div>

//       {/* DATE FILTER */}
//       <div
//         style={{
//           marginBottom: "16px",
//           display: "flex",
//           gap: "12px",
//           flexWrap: "wrap",
//         }}
//       >
//         <div>
//           <label style={{ fontSize: "0.9rem", fontWeight: 500 }}>Start Date</label>
//           <input
//             type="date"
//             value={filterStartDate}
//             onChange={(e) => setFilterStartDate(e.target.value)}
//             className={styles["form-input"]}
//             style={{ width: "160px" }}
//           />
//         </div>
//         <div>
//           <label style={{ fontSize: "0.9rem", fontWeight: 500 }}>End Date</label>
//           <input
//             type="date"
//             value={filterEndDate}
//             onChange={(e) => setFilterEndDate(e.target.value)}
//             className={styles["form-input"]}
//             style={{ width: "160px" }}
//           />
//         </div>
//         <button
//           onClick={fetchPayments}
//           className={styles["submit-button"]}
//           style={{ alignSelf: "end", height: "40px" }}
//           disabled={loading}
//         >
//           Apply Filter
//         </button>
//       </div>

//       {/* LOADING */}
//       {loading && (
//         <div className={styles["loading-message"]}>
//           <div className={styles.spinner}></div>
//           <p>Loading payments...</p>
//         </div>
//       )}

//       {/* TABLE */}
//       {payments.length > 0 ? (
//         <div className={styles["table-wrapper"]}>
//           <table className={styles.table}>
//             <thead>
//               <tr>
//                 <th>Receipt #</th>
//                 <th>Date</th>
//                 <th>Party</th>
//                 <th>Phone</th>
//                 <th>Amount</th>
//                 <th>Payment Type</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {payments.map((p) => (
//                 <tr key={p.paymentInId}>
//                   <td>{p.receiptNo}</td>
//                   <td>{new Date(p.paymentDate).toLocaleDateString()}</td>
//                   <td>{p.partyResponseDto?.name || "—"}</td>
//                   <td>{p.phoneNumber}</td>
//                   <td>₹{p.receivedAmount?.toFixed(2)}</td>
//                   <td>{p.paymentType}</td>
//                   <td className={styles["actions-cell"]}>
//                     <button
//                       onClick={() => setSelected(p)}
//                       className={`${styles["action-button"]} ${styles["view-button"]}`}
//                       title="View details"
//                     >
//                       View
//                     </button>

//                     {/* Inline Edit Button */}
//                     <button
//                       onClick={() => navigate(`/create_payment_in?edit=${p.paymentInId}`)}
//                       className={`${styles["action-button"]} ${styles["edit-button"]}`}
//                       title="Edit"
//                       style={{ marginLeft: "6px", fontSize: "0.85rem" }}
//                     >
//                       Edit
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       ) : (
//         !loading && (
//           <div className={styles["no-data"]}>
//             <p>No payments in found</p>
//             <p className={styles["no-data-subtitle"]}>
//               Click “+ New Payment In” to record one.
//             </p>
//           </div>
//         )
//       )}

//       {/* VIEW MODAL WITH EDIT & DELETE */}
//       {selected && (
//         <div
//           className={styles["modal-overlay"]}
//           onClick={() => setSelected(null)}
//         >
//           <div
//             className={styles["detail-card"]}
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className={styles["card-header"]}>
//               <div>
//                 <h3>Receipt #{selected.receiptNo}</h3>
//                 <div className={styles["balance-badge"]}>
//                   ₹{selected.receivedAmount?.toFixed(2)}
//                 </div>
//               </div>

//               <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
//                 {/* EDIT BUTTON */}
//                 <button
//                   onClick={() => navigate(`/create_payment_in?edit=${selected.paymentInId}`)}
//                   className={`${styles["action-button"]} ${styles["edit-button"]}`}
//                   title="Edit payment"
//                   disabled={loading}
//                 >
//                   Edit
//                 </button>

//                 {/* DELETE BUTTON */}
//                 <button
//                   onClick={() => deletePayment(selected.paymentInId)}
//                   className={`${styles["action-button"]} ${styles["delete-button"]}`}
//                   title="Delete payment"
//                   disabled={loading}
//                 >
//                   Delete
//                 </button>

//                 <button
//                   className={styles["close-modal-btn"]}
//                   onClick={() => setSelected(null)}
//                   disabled={loading}
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>

//             {/* SUMMARY */}
//             <section className={styles["card-section"]}>
//               <h4>Payment Summary</h4>
//               <div className={styles["detail-grid"]}>
//                 <p><strong>ID:</strong> {selected.paymentInId}</p>
//                 <p><strong>Date:</strong> {new Date(selected.paymentDate).toLocaleDateString()}</p>
//                 <p><strong>Phone:</strong> {selected.phoneNumber}</p>
//                 <p><strong>Amount:</strong> ₹{selected.receivedAmount?.toFixed(2)}</p>
//                 <p><strong>Payment Type:</strong> {selected.paymentType}</p>
//                 <p><strong>Description:</strong> {selected.description || "—"}</p>
//               </div>
//             </section>

//             {/* PARTY */}
//             {selected.partyResponseDto && (
//               <section className={styles["card-section"]}>
//                 <h4>Party Details</h4>
//                 <div className={styles["detail-grid"]}>
//                   <p><strong>Name:</strong> {selected.partyResponseDto.name}</p>
//                   <p><strong>GSTIN:</strong> {selected.partyResponseDto.gstin || "—"}</p>
//                   <p><strong>Phone:</strong> {selected.partyResponseDto.phoneNo || "—"}</p>
//                   <p><strong>GST Type:</strong> {selected.partyResponseDto.gstType?.replace(/_/g, " ")}</p>
//                   <p><strong>State:</strong> {selected.partyResponseDto.state?.replace(/_/g, " ")}</p>
//                   <p><strong>Email:</strong> {selected.partyResponseDto.emailId || "—"}</p>
//                   <p><strong>Billing:</strong> {selected.partyResponseDto.billingAddress || "—"}</p>
//                   <p><strong>Shipping:</strong> {selected.partyResponseDto.shipingAddress || "—"}</p>
//                 </div>
//               </section>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PaymentIn;



// src/pages/Payment/PaymentIn.jsx
"use client";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../../../config/apiconfig";
import styles from "../Styles/ScreenUI.module.css"; // Using same styles as SalesReturns
import { toast } from "react-toastify";
import {
  Plus,
  Eye,
  Edit2,
  Trash2,
  X,
  Package,
  Calendar,
  Filter,
  Search,
  Loader,
  ChevronDown, // ADDED: This was missing!
} from "lucide-react";

const PaymentIn = () => {
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("eBilling") || "{}");
  const token = userData?.accessToken || "";
  const companyId = userData?.selectedCompany?.id || "";

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const getDefaultRange = () => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 30);
    return {
      startDate: start.toISOString().split("T")[0],
      endDate: end.toISOString().split("T")[0],
    };
  };

  const isTokenValid = () => {
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  };

  const fetchPayments = async () => {
    if (!token || !isTokenValid()) {
      toast.error("Session expired. Please log in again.");
      localStorage.removeItem("eBilling");
      navigate("/login");
      return;
    }
    if (!companyId) {
      toast.error("No company selected.");
      return;
    }

    const { startDate: defStart, endDate: defEnd } = getDefaultRange();
    const params = {
      startDate: filterStartDate || defStart,
      endDate: filterEndDate || defEnd,
    };

    setLoading(true);
    try {
      const res = await axios.get(
        `${config.BASE_URL}/company/${companyId}/payment-in/list/by/filter`,
        {
          params,
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000,
        }
      );
      setPayments(res.data || []);
      toast.success("Payments loaded");
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        toast.error("Invalid token – logging out");
        localStorage.removeItem("eBilling");
        navigate("/login");
      } else {
        toast.error(err.response?.data?.message || "Failed to load payments");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, companyId]);

  const deletePayment = async (paymentInId) => {
    if (!window.confirm("Delete this payment-in? This cannot be undone.")) return;

    try {
      setLoading(true);
      await axios.delete(`${config.BASE_URL}/paymentIn/${paymentInId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPayments((prev) => prev.filter((p) => p.paymentInId !== paymentInId));
      setSelected(null);
      toast.success("Payment deleted successfully");
    } catch (err) {
      console.error("Delete error:", err);
      if (err.response?.status === 401) {
        toast.error("Session expired. Logging out...");
        localStorage.removeItem("eBilling");
        navigate("/login");
      } else {
        toast.error(err.response?.data?.message || "Failed to delete payment");
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = payments.filter((p) => {
    const matchesSearch =
      p.receiptNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.partyResponseDto?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className={styles["company-form-container"]}>
      {/* HEADER */}
      <div className={styles["form-header"]}>
        <div className={styles["header-content"]}>
          <div className={styles["header-icon"]}>
            <Package size={32} style={{ color: "var(--primary-color)" }} />
          </div>
          <div className={styles["header-text"]}>
            <h1 className={styles["company-form-title"]}>Payments In</h1>
            <p className={styles["form-subtitle"]}>All money received from parties</p>
          </div>
        </div>
        <button
          onClick={() => navigate("/create_payment_in")}
          className={styles["submit-button"]}
          disabled={loading}
        >
          <Plus size={18} />
          <span>New Payment In</span>
        </button>
      </div>

      {/* FILTER SECTION */}
      <div className={styles["filter-section"]}>
        <div className={styles["search-container"]}>
          <Search size={18} className={styles["search-icon"]} />
          <input
            type="text"
            placeholder="Search by receipt # or party name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles["search-input"]}
          />
        </div>

        <div className={styles["date-filter-group"]}>
          <div className={styles["date-input-wrapper"]}>
            <label className={styles["form-label"]}>
              <Calendar size={14} className={styles["label-icon"]} />
              Start Date
            </label>
            <input
              type="date"
              value={filterStartDate}
              onChange={(e) => setFilterStartDate(e.target.value)}
              className={styles["form-input"]}
            />
          </div>
          <div className={styles["date-input-wrapper"]}>
            <label className={styles["form-label"]}>
              <Calendar size={14} className={styles["label-icon"]} />
              End Date
            </label>
            <input
              type="date"
              value={filterEndDate}
              onChange={(e) => setFilterEndDate(e.target.value)}
              className={styles["form-input"]}
            />
          </div>
          <button
            onClick={fetchPayments}
            className={styles["submit-button"]}
            disabled={loading}
            style={{ alignSelf: "flex-end" }}
          >
            <Filter size={16} />
            Apply Filter
          </button>
        </div>
      </div>

      {/* LOADING */}
      {loading && (
        <div className={styles["loading-message"]}>
          <Loader size={32} className={styles["spinner"]} />
          <p>Loading payments...</p>
        </div>
      )}

      {/* TABLE / CARDS */}
      {filteredPayments.length > 0 ? (
        <>
          {/* Desktop Table */}
          <div className={styles["table-wrapper"]}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Receipt #</th>
                  <th>Date</th>
                  <th>Party</th>
                  <th>Phone</th>
                  <th>Amount</th>
                  <th>Payment Type</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((p) => (
                  <tr key={p.paymentInId} className={styles["table-row"]}>
                    <td className={styles["invoice-cell"]}>
                      <span className={styles["invoice-badge"]}>{p.receiptNo}</span>
                    </td>
                    <td>{new Date(p.paymentDate).toLocaleDateString()}</td>
                    <td>
                      <span className={styles["party-name"]}>{p.partyResponseDto?.name || "—"}</span>
                    </td>
                    <td>{p.phoneNumber || "—"}</td>
                    <td className={styles["amount-cell"]}>
                      <span className={styles["amount"]}>
                        ₹{Number.parseFloat(p.receivedAmount || 0).toFixed(2)}
                      </span>
                    </td>
                    <td>
                      <span className={styles["status-badge"]}>{p.paymentType}</span>
                    </td>
                    <td className={styles["actions-cell"]}>
                      <button
                        onClick={() => setSelected(p)}
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
            {filteredPayments.map((p) => (
              <div key={p.paymentInId} className={styles["invoice-card"]}>
                <div className={styles["card-header-mobile"]}>
                  <div className={styles["card-title-section"]}>
                    <h3 className={styles["card-invoice-number"]}>{p.receiptNo}</h3>
                    <span className={styles["status-badge"]}>{p.paymentType}</span>
                  </div>
                  <button onClick={() => setSelected(p)} className={styles["card-action-button"]}>
                    <ChevronDown size={20} /> {/* NOW WORKS */}
                  </button>
                </div>

                <div className={styles["card-body"]}>
                  <div className={styles["card-info-row"]}>
                    <span className={styles["info-label"]}>Party:</span>
                    <span className={styles["info-value"]}>{p.partyResponseDto?.name || "—"}</span>
                  </div>
                  <div className={styles["card-info-row"]}>
                    <span className={styles["info-label"]}>Date:</span>
                    <span className={styles["info-value"]}>
                      {new Date(p.paymentDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className={styles["card-info-row"]}>
                    <span className={styles["info-label"]}>Amount:</span>
                    <span className={styles["info-value-amount"]}>
                      ₹{Number.parseFloat(p.receivedAmount || 0).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className={styles["card-footer"]}>
                  <button onClick={() => setSelected(p)} className={styles["card-view-button"]}>
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
            <p>No payments in found</p>
            <p className={styles["no-data-subtitle"]}>
              {searchTerm || filterStartDate || filterEndDate
                ? "Try adjusting your filters"
                : 'Click "New Payment In" to record one.'}
            </p>
          </div>
        )
      )}

      {/* VIEW MODAL */}
      {selected && (
        <div className={styles["modal-overlay"]} onClick={() => setSelected(null)}>
          <div className={styles["detail-card"]} onClick={(e) => e.stopPropagation()}>
            <div className={styles["card-header"]}>
              <div className={styles["header-title-section"]}>
                <h3>Receipt #{selected.receiptNo}</h3>
                <div className={styles["balance-badge"]}>
                  ₹{Number.parseFloat(selected.receivedAmount || 0).toFixed(2)}
                </div>
              </div>
              <div className={styles["header-actions"]}>
                <button
                  onClick={() => navigate(`/create_payment_in?edit=${selected.paymentInId}`)}
                  className={`${styles["action-button"]} ${styles["edit-button"]}`}
                  title="Edit payment"
                >
                  <Edit2 size={16} />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => deletePayment(selected.paymentInId)}
                  className={`${styles["action-button"]} ${styles["delete-button"]}`}
                  title="Delete payment"
                >
                  <Trash2 size={16} />
                  <span>Delete</span>
                </button>
                <button
                  className={styles["close-modal-btn"]}
                  onClick={() => setSelected(null)}
                  title="Close"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Payment Summary */}
            <section className={styles["card-section"]}>
              <h4 className={styles["section-title"]}>Payment Summary</h4>
              <div className={styles["detail-grid"]}>
                <div className={styles["detail-item"]}>
                  <span className={styles["detail-label"]}>Payment ID:</span>
                  <span className={styles["detail-value"]}>{selected.paymentInId}</span>
                </div>
                <div className={styles["detail-item"]}>
                  <span className={styles["detail-label"]}>Date:</span>
                  <span className={styles["detail-value"]}>
                    {new Date(selected.paymentDate).toLocaleDateString()}
                  </span>
                </div>
                <div className={styles["detail-item"]}>
                  <span className={styles["detail-label"]}>Phone:</span>
                  <span className={styles["detail-value"]}>{selected.phoneNumber || "—"}</span>
                </div>
                <div className={styles["detail-item"]}>
                  <span className={styles["detail-label"]}>Amount:</span>
                  <span className={styles["detail-value"]}>
                    ₹{Number.parseFloat(selected.receivedAmount || 0).toFixed(2)}
                  </span>
                </div>
                <div className={styles["detail-item"]}>
                  <span className={styles["detail-label"]}>Payment Type:</span>
                  <span className={styles["detail-value"]}>{selected.paymentType}</span>
                </div>
                <div className={styles["detail-item"]}>
                  <span className={styles["detail-label"]}>Description:</span>
                  <span className={styles["detail-value"]}>{selected.description || "—"}</span>
                </div>
              </div>
            </section>

            {/* Party Details */}
            {selected.partyResponseDto && (
              <section className={styles["card-section"]}>
                <h4 className={styles["section-title"]}>Party Details</h4>
                <div className={styles["detail-grid"]}>
                  <div className={styles["detail-item"]}>
                    <span className={styles["detail-label"]}>Name:</span>
                    <span className={styles["detail-value"]}>{selected.partyResponseDto.name}</span>
                  </div>
                  <div className={styles["detail-item"]}>
                    <span className={styles["detail-label"]}>GSTIN:</span>
                    <span className={styles["detail-value"]}>{selected.partyResponseDto.gstin || "—"}</span>
                  </div>
                  <div className={styles["detail-item"]}>
                    <span className={styles["detail-label"]}>Phone:</span>
                    <span className={styles["detail-value"]}>{selected.partyResponseDto.phoneNo || "—"}</span>
                  </div>
                  <div className={styles["detail-item"]}>
                    <span className={styles["detail-label"]}>GST Type:</span>
                    <span className={styles["detail-value"]}>
                      {selected.partyResponseDto.gstType?.replace(/_/g, " ")}
                    </span>
                  </div>
                  <div className={styles["detail-item"]}>
                    <span className={styles["detail-label"]}>State:</span>
                    <span className={styles["detail-value"]}>
                      {selected.partyResponseDto.state?.replace(/_/g, " ")}
                    </span>
                  </div>
                  <div className={styles["detail-item"]}>
                    <span className={styles["detail-label"]}>Email:</span>
                    <span className={styles["detail-value"]}>{selected.partyResponseDto.emailId || "—"}</span>
                  </div>
                  <div className={styles["detail-item"]}>
                    <span className={styles["detail-label"]}>Billing Address:</span>
                    <span className={styles["detail-value"]}>
                      {selected.partyResponseDto.billingAddress || "—"}
                    </span>
                  </div>
                  <div className={styles["detail-item"]}>
                    <span className={styles["detail-label"]}>Shipping Address:</span>
                    <span className={styles["detail-value"]}>
                      {selected.partyResponseDto.shipingAddress || "—"}
                    </span>
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentIn;