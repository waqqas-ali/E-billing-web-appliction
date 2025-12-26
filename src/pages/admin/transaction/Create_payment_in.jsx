// import React, { useEffect, useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import axios from "axios";
// import config from "../../../config/apiconfig";
// import styles from "./Payment.module.css";
// import { toast } from "react-toastify";

// const PAYMENT_TYPES = [
//   "CASH",
//   "UPI",
//   "CREDIT_CARD",
//   "DEBIT_CARD",
//   "NET_BANKING",
//   "WALLET",
//   "CHEQUE",
//   "OTHER",
// ];

// const CreatePaymentIn = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const editId = queryParams.get("edit");

//   const userData = JSON.parse(localStorage.getItem("eBilling") || "{}");
//   const token = userData?.accessToken || "";
//   const companyId = userData?.selectedCompany?.id || "";

//   const [loading, setLoading] = useState(false);
//   const [loadingData, setLoadingData] = useState(false);
//   const [parties, setParties] = useState([]);

//   const [form, setForm] = useState({
//     partyId: "",
//     receiptNo: "",
//     paymentDate: new Date().toISOString().split("T")[0],
//     phoneNumber: "",
//     receivedAmount: "",
//     paymentType: "CASH",
//     description: "",
//   });

//   // Token validation
//   const isTokenValid = () => {
//     if (!token) return false;
//     try {
//       const payload = JSON.parse(atob(token.split(".")[1]));
//       return payload.exp * 1000 > Date.now();
//     } catch {
//       return false;
//     }
//   };

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

//   // Fetch single Payment-In for Edit
//   const fetchPayment = async (paymentInId) => {
//     if (!token) return;
//     setLoadingData(true);
//     try {
//       const res = await axios.get(`${config.BASE_URL}/paymentIn/${paymentInId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const p = res.data;
//       setForm({
//         partyId: p.partyResponseDto?.partyId?.toString() || "",
//         receiptNo: p.receiptNo || "",
//         paymentDate: p.paymentDate || "",
//         phoneNumber: p.phoneNumber || "",
//         receivedAmount: p.receivedAmount?.toString() || "",
//         paymentType: p.paymentType || "CASH",
//         description: p.description || "",
//       });
//     } catch (err) {
//       toast.error("Failed to load payment");
//       navigate("/payment_in");
//     } finally {
//       setLoadingData(false);
//     }
//   };

//   useEffect(() => {
//     if (!token || !isTokenValid()) {
//       toast.error("Session expired");
//       localStorage.removeItem("eBilling");
//       navigate("/login");
//       return;
//     }
//     if (!companyId) {
//       toast.error("No company selected");
//       return;
//     }

//     fetchParties();
//     if (editId) {
//       fetchPayment(editId);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [token, companyId, editId]);

//   // Auto-fill phone when party is selected
//   const handlePartyChange = (partyId) => {
//     const party = parties.find((p) => p.partyId === Number(partyId));
//     if (party) {
//       setForm((prev) => ({
//         ...prev,
//         partyId,
//         phoneNumber: party.phoneNo || "",
//       }));
//     } else {
//       setForm((prev) => ({ ...prev, partyId, phoneNumber: "" }));
//     }
//   };

//   // Submit Handler
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!token || !companyId) {
//       toast.error("Login and select company");
//       return;
//     }

//     const required = ["partyId", "receiptNo", "paymentDate", "phoneNumber", "receivedAmount"];
//     const missing = required.find((f) => !form[f]);
//     if (missing) {
//       toast.error("Please fill all required fields");
//       return;
//     }

//     if (parseFloat(form.receivedAmount) <= 0) {
//       toast.error("Received amount must be greater than 0");
//       return;
//     }

//     const payload = {
//       partyId: parseInt(form.partyId),
//       receiptNo: form.receiptNo.trim(),
//       paymentDate: form.paymentDate,
//       phoneNumber: form.phoneNumber.trim(),
//       receivedAmount: parseFloat(form.receivedAmount),
//       paymentType: form.paymentType,
//       description: form.description.trim() || null,
//     };

//     try {
//       setLoading(true);

//       if (editId) {
//         await axios.put(`${config.BASE_URL}/paymentIn/${editId}`, payload, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         });
//         toast.success("Payment updated!");
//       } else {
//         await axios.post(
//           `${config.BASE_URL}/company/${companyId}/add/payment-in`,
//           payload,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         toast.success("Payment recorded!");
//       }

//       navigate("/payment_in");
//     } catch (err) {
//       console.error(err);
//       if (err.response?.status === 401) {
//         toast.error("Session expired. Logging out...");
//         localStorage.removeItem("eBilling");
//         navigate("/login");
//       } else {
//         toast.error(err.response?.data?.message || `Failed to ${editId ? "update" : "create"} payment`);
//       }
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
//           <p>Loading payment...</p>
//         </div>
//       ) : (
//         <form onSubmit={handleSubmit}>
//           {/* HEADER */}
//           <div className={styles["form-header"]}>
//             <div>
//               <h1 className={styles["company-form-title"]}>
//                 {isEditMode ? "Edit Payment In" : "Record Payment In"}
//               </h1>
//               <p className={styles["form-subtitle"]}>
//                 {isEditMode ? `Receipt #${form.receiptNo}` : "Money received from party"}
//               </p>
//             </div>
//             <div style={{ display: "flex", gap: "8px" }}>
//               <button
//                 type="button"
//                 onClick={() => navigate("/payment_in")}
//                 className={styles["cancel-button"]}
//                 disabled={loading}
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 className={styles["submit-button"]}
//                 disabled={loading || loadingData}
//               >
//                 {loading ? "Saving..." : isEditMode ? "Update" : "Record Payment"}
//               </button>
//             </div>
//           </div>

//           {/* PARTY & RECEIPT NO */}
//           <div className={styles["form-row"]}>
//             <div className={styles["form-group"]}>
//               <label>
//                 Party <span className={styles.required}>*</span>
//               </label>
//               <select
//                 value={form.partyId}
//                 onChange={(e) => handlePartyChange(e.target.value)}
//                 required
//                 className={styles["form-input"]}
//                 disabled={loadingData}
//               >
//                 <option value="">Select Party</option>
//                 {parties.map((p) => (
//                   <option key={p.partyId} value={p.partyId}>
//                     {p.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className={styles["form-group"]}>
//               <label>
//                 Receipt No <span className={styles.required}>*</span>
//               </label>
//               <input
//                 type="text"
//                 value={form.receiptNo}
//                 onChange={(e) => setForm({ ...form, receiptNo: e.target.value })}
//                 required
//                 className={styles["form-input"]}
//                 placeholder="e.g. REC-001"
//                 disabled={loadingData}
//               />
//             </div>
//           </div>

//           {/* DATE & PHONE */}
//           <div className={styles["form-row"]}>
//             <div className={styles["form-group"]}>
//               <label>
//                 Payment Date <span className={styles.required}>*</span>
//               </label>
//               <input
//                 type="date"
//                 value={form.paymentDate}
//                 onChange={(e) => setForm({ ...form, paymentDate: e.target.value })}
//                 required
//                 className={styles["form-input"]}
//                 disabled={loadingData}
//               />
//             </div>

//             <div className={styles["form-group"]}>
//               <label>
//                 Phone Number <span className={styles.required}>*</span>
//               </label>
//               <input
//                 type="text"
//                 value={form.phoneNumber}
//                 onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
//                 required
//                 className={styles["form-input"]}
//                 placeholder="10-digit mobile"
//                 maxLength={10}
//                 disabled={loadingData}
//               />
//             </div>
//           </div>

//           {/* AMOUNT & PAYMENT TYPE */}
//           <div className={styles["form-row"]}>
//             <div className={styles["form-group"]}>
//               <label>
//                 Received Amount <span className={styles.required}>*</span>
//               </label>
//               <input
//                 type="number"
//                 step="0.01"
//                 min="0.01"
//                 value={form.receivedAmount}
//                 onChange={(e) => setForm({ ...form, receivedAmount: e.target.value })}
//                 required
//                 className={styles["form-input"]}
//                 placeholder="0.00"
//                 disabled={loadingData}
//               />
//             </div>

//             <div className={styles["form-group"]}>
//               <label>Payment Type</label>
//               <select
//                 value={form.paymentType}
//                 onChange={(e) => setForm({ ...form, paymentType: e.target.value })}
//                 className={styles["form-input"]}
//                 disabled={loadingData}
//               >
//                 {PAYMENT_TYPES.map((type) => (
//                   <option key={type} value={type}>
//                     {type}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           {/* DESCRIPTION */}
//           <div className={styles["form-group"]}>
//             <label>Description (optional)</label>
//             <textarea
//               value={form.description}
//               onChange={(e) => setForm({ ...form, description: e.target.value })}
//               className={`${styles["form-input"]} ${styles.textarea}`}
//               rows={3}
//               placeholder="Notes about this payment..."
//               disabled={loadingData}
//             />
//           </div>

//           {/* FINAL SUMMARY CARD */}
//           <div
//             className={styles["card-section"]}
//             style={{ background: "#f0f7ff", padding: "16px", borderRadius: "8px" }}
//           >
//             <div style={{ fontSize: "1rem", fontWeight: "600", color: "#27ae60" }}>
//               Total Received: ₹{parseFloat(form.receivedAmount || 0).toFixed(2)}
//             </div>
//           </div>
//         </form>
//       )}
//     </div>
//   );
// };

// export default CreatePaymentIn;









// import React, { useEffect, useState } from "react"
// import { useNavigate, useLocation } from "react-router-dom"
// import axios from "axios"
// import config from "../../../config/apiconfig"
// import styles from "../Styles/Form.module.css"
// import { toast } from "react-toastify"
// import {
//   ArrowLeft,
//   CheckCircle,
//   Users,
//   Calendar,
//   Phone,
//   IndianRupee,
//   FileText,
//   Loader,
// } from "lucide-react"

// const PAYMENT_TYPES = [
//   "CASH",
//   "UPI",
//   "CREDIT_CARD",
//   "DEBIT_CARD",
//   "NET_BANKING",
//   "WALLET",
//   "CHEQUE",
//   "OTHER",
// ]

// const CreatePaymentIn = () => {
//   const navigate = useNavigate()
//   const location = useLocation()
//   const queryParams = new URLSearchParams(location.search)
//   const editId = queryParams.get("edit")

//   const userData = JSON.parse(localStorage.getItem("eBilling") || "{}")
//   const token = userData?.accessToken || ""
//   const companyId = userData?.selectedCompany?.id || ""

//   const [loading, setLoading] = useState(false)
//   const [loadingData, setLoadingData] = useState(false)
//   const [parties, setParties] = useState([])

//   const [form, setForm] = useState({
//     partyId: "",
//     receiptNo: "",
//     paymentDate: new Date().toISOString().split("T")[0],
//     phoneNumber: "",
//     receivedAmount: "",
//     paymentType: "CASH",
//     description: "",
//   })

//   /* ==================== TOKEN VALIDATION ==================== */
//   const isTokenValid = () => {
//     if (!token) return false
//     try {
//       const payload = JSON.parse(atob(token.split(".")[1]))
//       return payload.exp * 1000 > Date.now()
//     } catch {
//       return false
//     }
//   }

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

//   const fetchPayment = async (paymentInId) => {
//     if (!token) return
//     setLoadingData(true)
//     try {
//       const res = await axios.get(`${config.BASE_URL}/paymentIn/${paymentInId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })

//       const p = res.data
//       setForm({
//         partyId: p.partyResponseDto?.partyId?.toString() || "",
//         receiptNo: p.receiptNo || "",
//         paymentDate: p.paymentDate || "",
//         phoneNumber: p.phoneNumber || "",
//         receivedAmount: p.receivedAmount?.toString() || "",
//         paymentType: p.paymentType || "CASH",
//         description: p.description || "",
//       })
//     } catch (err) {
//       toast.error("Failed to load payment")
//       navigate("/payment_in")
//     } finally {
//       setLoadingData(false)
//     }
//   }

//   useEffect(() => {
//     if (!token || !isTokenValid()) {
//       toast.error("Session expired")
//       localStorage.removeItem("eBilling")
//       navigate("/login")
//       return
//     }
//     if (!companyId) {
//       toast.error("No company selected")
//       return
//     }

//     fetchParties()
//     if (editId) fetchPayment(editId)
//   }, [token, companyId, editId])

//   /* ==================== PARTY AUTO-FILL ==================== */
//   const handlePartyChange = (partyId) => {
//     const party = parties.find((p) => p.partyId === Number(partyId))
//     if (party) {
//       setForm((prev) => ({
//         ...prev,
//         partyId,
//         phoneNumber: party.phoneNo || "",
//       }))
//     } else {
//       setForm((prev) => ({ ...prev, partyId, phoneNumber: "" }))
//     }
//   }

//   /* ==================== SUBMIT ==================== */
//   const handleSubmit = async (e) => {
//     e.preventDefault()

//     if (!token || !companyId) {
//       toast.error("Login and select company")
//       return
//     }

//     const required = ["partyId", "receiptNo", "paymentDate", "phoneNumber", "receivedAmount"]
//     const missing = required.find((f) => !form[f])
//     if (missing) {
//       toast.error("Please fill all required fields")
//       return
//     }

//     if (parseFloat(form.receivedAmount) <= 0) {
//       toast.error("Received amount must be greater than 0")
//       return
//     }

//     const payload = {
//       partyId: parseInt(form.partyId),
//       receiptNo: form.receiptNo.trim(),
//       paymentDate: form.paymentDate,
//       phoneNumber: form.phoneNumber.trim(),
//       receivedAmount: parseFloat(form.receivedAmount),
//       paymentType: form.paymentType,
//       description: form.description.trim() || null,
//     }

//     try {
//       setLoading(true)

//       if (editId) {
//         await axios.put(`${config.BASE_URL}/paymentIn/${editId}`, payload, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         })
//         toast.success("Payment updated!")
//       } else {
//         await axios.post(
//           `${config.BASE_URL}/company/${companyId}/add/payment-in`,
//           payload,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         )
//         toast.success("Payment recorded!")
//       }

//       navigate("/payment_in")
//     } catch (err) {
//       console.error(err)
//       if (err.response?.status === 401) {
//         toast.error("Session expired. Logging out...")
//         localStorage.removeItem("eBilling")
//         navigate("/login")
//       } else {
//         toast.error(err.response?.data?.message || `Failed to ${editId ? "update" : "create"} payment`)
//       }
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
//           <p>Loading payment...</p>
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
//                       <FileText className={styles.titleIcon} />
//                       Edit Payment In
//                     </>
//                   ) : (
//                     <>
//                       <IndianRupee className={styles.titleIcon} />
//                       Record Payment In
//                     </>
//                   )}
//                 </h1>
//                 <p className={styles.subtitle}>
//                   {isEditMode ? `Receipt #${form.receiptNo}` : "Money received from party"}
//                 </p>
//               </div>
//             </div>
//             <div className={styles.headerActions}>
//               <button
//                 type="button"
//                 onClick={() => navigate("/payment_in")}
//                 className={styles.buttonSecondary}
//                 disabled={loading}
//               >
//                 <ArrowLeft size={18} />
//                 Back
//               </button>
//               <button
//                 type="submit"
//                 className={styles.buttonPrimary}
//                 disabled={loading || loadingData}
//               >
//                 {loading ? (
//                   <>
//                     <Loader size={18} className={styles.spinnerSmall} />
//                     Saving...
//                   </>
//                 ) : (
//                   <>
//                     <CheckCircle size={18} />
//                     {isEditMode ? "Update" : "Record Payment"}
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>

//           {/* Party & Receipt No */}
//           <div className={styles.formSection}>
//             <h2 className={styles.sectionTitle}>
//               <Users size={20} />
//               Party & Receipt
//             </h2>
//             <div className={styles.formGrid}>
//               <div className={styles.formGroup}>
//                 <label htmlFor="party" className={styles.label}>
//                   Party <span className={styles.required}>*</span>
//                 </label>
//                 <select
//                   id="party"
//                   value={form.partyId}
//                   onChange={(e) => handlePartyChange(e.target.value)}
//                   required
//                   className={styles.input}
//                   disabled={loadingData}
//                 >
//                   <option value="">Select Party</option>
//                   {parties.map((p) => (
//                     <option key={p.partyId} value={p.partyId}>
//                       {p.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div className={styles.formGroup}>
//                 <label htmlFor="receiptNo" className={styles.label}>
//                   Receipt No <span className={styles.required}>*</span>
//                 </label>
//                 <input
//                   id="receiptNo"
//                   type="text"
//                   value={form.receiptNo}
//                   onChange={(e) => setForm({ ...form, receiptNo: e.target.value })}
//                   required
//                   className={styles.input}
//                   placeholder="e.g. REC-001"
//                   disabled={loadingData}
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Date & Phone */}
//           <div className={styles.formSection}>
//             <h2 className={styles.sectionTitle}>
//               <Calendar size={20} />
//               Date & Contact
//             </h2>
//             <div className={styles.formGrid}>
//               <div className={styles.formGroup}>
//                 <label htmlFor="paymentDate" className={styles.label}>
//                   Payment Date <span className={styles.required}>*</span>
//                 </label>
//                 <input
//                   id="paymentDate"
//                   type="date"
//                   value={form.paymentDate}
//                   onChange={(e) => setForm({ ...form, paymentDate: e.target.value })}
//                   required
//                   className={styles.input}
//                   disabled={loadingData}
//                 />
//               </div>

//               <div className={styles.formGroup}>
//                 <label htmlFor="phoneNumber" className={styles.label}>
//                   Phone Number <span className={styles.required}>*</span>
//                 </label>
//                 <div className={styles.inputIcon}>
//                   <Phone size={18} />
//                   <input
//                     id="phoneNumber"
//                     type="text"
//                     value={form.phoneNumber}
//                     onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
//                     required
//                     className={styles.input}
//                     placeholder="10-digit mobile"
//                     maxLength={10}
//                     disabled={loadingData}
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Amount & Payment Type */}
//           <div className={styles.formSection}>
//             <h2 className={styles.sectionTitle}>
//               <IndianRupee size={20} />
//               Payment Details
//             </h2>
//             <div className={styles.formGrid}>
//               <div className={styles.formGroup}>
//                 <label htmlFor="receivedAmount" className={styles.label}>
//                   Received Amount <span className={styles.required}>*</span>
//                 </label>
//                 <div className={styles.inputIcon}>
//                   <IndianRupee size={18} />
//                   <input
//                     id="receivedAmount"
//                     type="number"
//                     step="0.01"
//                     min="0.01"
//                     value={form.receivedAmount}
//                     onChange={(e) => setForm({ ...form, receivedAmount: e.target.value })}
//                     required
//                     className={styles.input}
//                     placeholder="0.00"
//                     disabled={loadingData}
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
//                   disabled={loadingData}
//                 >
//                   {PAYMENT_TYPES.map((type) => (
//                     <option key={type} value={type}>
//                       {type.replace(/_/g, " ")}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           </div>

//           {/* Description */}
//           <div className={styles.formSection}>
//             <div className={styles.formGroup}>
//               <label htmlFor="description" className={styles.label}>
//                 Description (optional)
//               </label>
//               <textarea
//                 id="description"
//                 value={form.description}
//                 onChange={(e) => setForm({ ...form, description: e.target.value })}
//                 className={`${styles.input} ${styles.textarea}`}
//                 placeholder="Notes about this payment..."
//                 rows={3}
//                 disabled={loadingData}
//               />
//             </div>
//           </div>

//           {/* Summary */}
//           <div className={styles.summarySection}>
//             <h2 className={styles.sectionTitle}>Payment Summary</h2>
//             <div className={styles.summaryGrid}>
//               <div className={styles.summaryItem}>
//                 <span className={styles.summaryLabel}>Total Received</span>
//                 <span className={`${styles.summaryValue} ${styles.summaryValueBold}`}>
//                   <IndianRupee size={14} />
//                   {parseFloat(form.receivedAmount || 0).toFixed(2)}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </form>
//       )}
//     </div>
//   )
// }

// export default CreatePaymentIn












// "use client";

// import { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import api from "../../../utils/axiosInstance"; // Shared API with interceptors
// import { toast } from "react-toastify";
// import styles from "../Styles/Form.module.css";
// import {
//   ArrowLeft,
//   CheckCircle,
//   Users,
//   Calendar,
//   Phone,
//   IndianRupee,
//   FileText,
//   Loader,
// } from "lucide-react";

// const PAYMENT_TYPES = [
//   "CASH",
//   "UPI",
//   "CREDIT_CARD",
//   "DEBIT_CARD",
//   "NET_BANKING",
//   "WALLET",
//   "CHEQUE",
//   "OTHER",
// ];

// const CreatePaymentIn = () => {
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
//   const [parties, setParties] = useState([]);

//   const [form, setForm] = useState({
//     partyId: "",
//     receiptNo: "",
//     paymentDate: new Date().toISOString().split("T")[0],
//     phoneNumber: "",
//     receivedAmount: "",
//     paymentType: "CASH",
//     description: "",
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

//   /* ==================== FETCH DATA ==================== */
//   const fetchParties = async () => {
//     try {
//       const res = await api.get(`/company/${companyId}/parties`);
//       setParties(res.data || []);
//     } catch (err) {
//       toast.error("Failed to load parties");
//     }
//   };

//   const fetchPayment = async (paymentInId) => {
//     setLoadingData(true);
//     try {
//       const res = await api.get(`/paymentIn/${paymentInId}`);
//       const p = res.data;

//       setForm({
//         partyId: p.partyResponseDto?.partyId?.toString() || "",
//         receiptNo: p.receiptNo || "",
//         paymentDate: p.paymentDate?.split("T")[0] || "",
//         phoneNumber: p.phoneNumber || "",
//         receivedAmount: p.receivedAmount?.toString() || "",
//         paymentType: p.paymentType || "CASH",
//         description: p.description || "",
//       });
//     } catch (err) {
//       toast.error("Failed to load payment");
//       navigate("/payment_in");
//     } finally {
//       setLoadingData(false);
//     }
//   };

//   useEffect(() => {
//     if (token && companyId) {
//       fetchParties();
//       if (editId) fetchPayment(editId);
//     }
//   }, [token, companyId, editId]);

//   /* ==================== PARTY AUTO-FILL ==================== */
//   const handlePartyChange = (partyId) => {
//     const party = parties.find((p) => p.partyId === Number(partyId));
//     if (party) {
//       setForm((prev) => ({
//         ...prev,
//         partyId,
//         phoneNumber: party.phoneNo || "",
//       }));
//     } else {
//       setForm((prev) => ({ ...prev, partyId, phoneNumber: "" }));
//     }
//   };

//   /* ==================== SUBMIT ==================== */
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const required = ["partyId", "receiptNo", "paymentDate", "phoneNumber", "receivedAmount"];
//     const missing = required.find((f) => !form[f]);
//     if (missing) {
//       toast.error("Please fill all required fields");
//       return;
//     }

//     if (parseFloat(form.receivedAmount) <= 0) {
//       toast.error("Received amount must be greater than 0");
//       return;
//     }

//     const payload = {
//       partyId: parseInt(form.partyId),
//       receiptNo: form.receiptNo.trim(),
//       paymentDate: form.paymentDate,
//       phoneNumber: form.phoneNumber.trim(),
//       receivedAmount: parseFloat(form.receivedAmount),
//       paymentType: form.paymentType,
//       description: form.description.trim() || null,
//     };

//     try {
//       setLoading(true);

//       if (editId) {
//         await api.put(`/paymentIn/${editId}`, payload);
//         toast.success("Payment updated!");
//       } else {
//         await api.post(`/company/${companyId}/add/payment-in`, payload);
//         toast.success("Payment recorded!");
//       }

//       navigate("/payment_in");
//     } catch (err) {
//       toast.error(err.response?.data?.message || `Failed to ${editId ? "update" : "create"} payment`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const isEditMode = !!editId;

//   return (
//     <div className={styles.container}>
//       {loadingData ? (
//         <div className={styles.loadingContainer}>
//           <Loader className={styles.spinnerIcon} />
//           <p>Loading payment...</p>
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
//                       <FileText className={styles.titleIcon} />
//                       Edit Payment In
//                     </>
//                   ) : (
//                     <>
//                       <IndianRupee className={styles.titleIcon} />
//                       Record Payment In
//                     </>
//                   )}
//                 </h1>
//                 <p className={styles.subtitle}>
//                   {isEditMode ? `Receipt #${form.receiptNo}` : "Money received from party"}
//                 </p>
//               </div>
//             </div>
//             <div className={styles.headerActions}>
//               <button
//                 type="button"
//                 onClick={() => navigate("/payment_in")}
//                 className={styles.buttonSecondary}
//                 disabled={loading}
//               >
//                 <ArrowLeft size={18} />
//                 Back
//               </button>
//               <button
//                 type="submit"
//                 className={styles.buttonPrimary}
//                 disabled={loading || loadingData}
//               >
//                 {loading ? (
//                   <>
//                     <Loader size={18} className={styles.spinnerSmall} />
//                     Saving...
//                   </>
//                 ) : (
//                   <>
//                     <CheckCircle size={18} />
//                     {isEditMode ? "Update" : "Record Payment"}
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>

//           {/* Party & Receipt No */}
//           <div className={styles.formSection}>
//             <h2 className={styles.sectionTitle}>
//               <Users size={20} />
//               Party & Receipt
//             </h2>
//             <div className={styles.formGrid}>
//               <div className={styles.formGroup}>
//                 <label htmlFor="party" className={styles.label}>
//                   Party <span className={styles.required}>*</span>
//                 </label>
//                 <select
//                   id="party"
//                   value={form.partyId}
//                   onChange={(e) => handlePartyChange(e.target.value)}
//                   required
//                   className={styles.input}
//                   disabled={loadingData}
//                 >
//                   <option value="">Select Party</option>
//                   {parties.map((p) => (
//                     <option key={p.partyId} value={p.partyId}>
//                       {p.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div className={styles.formGroup}>
//                 <label htmlFor="receiptNo" className={styles.label}>
//                   Receipt No <span className={styles.required}>*</span>
//                 </label>
//                 <input
//                   id="receiptNo"
//                   type="text"
//                   value={form.receiptNo}
//                   onChange={(e) => setForm({ ...form, receiptNo: e.target.value })}
//                   required
//                   className={styles.input}
//                   placeholder="e.g. REC-001"
//                   disabled={loadingData}
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Date & Phone */}
//           <div className={styles.formSection}>
//             <h2 className={styles.sectionTitle}>
//               <Calendar size={20} />
//               Date & Contact
//             </h2>
//             <div className={styles.formGrid}>
//               <div className={styles.formGroup}>
//                 <label htmlFor="paymentDate" className={styles.label}>
//                   Payment Date <span className={styles.required}>*</span>
//                 </label>
//                 <input
//                   id="paymentDate"
//                   type="date"
//                   value={form.paymentDate}
//                   onChange={(e) => setForm({ ...form, paymentDate: e.target.value })}
//                   required
//                   className={styles.input}
//                   disabled={loadingData}
//                 />
//               </div>

//               <div className={styles.formGroup}>
//                 <label htmlFor="phoneNumber" className={styles.label}>
//                   Phone Number <span className={styles.required}>*</span>
//                 </label>
//                 <div className={styles.inputIcon}>
//                   <Phone size={18} />
//                   <input
//                     id="phoneNumber"
//                     type="text"
//                     value={form.phoneNumber}
//                     onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
//                     required
//                     className={styles.input}
//                     placeholder="10-digit mobile"
//                     maxLength={10}
//                     disabled={loadingData}
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Amount & Payment Type */}
//           <div className={styles.formSection}>
//             <h2 className={styles.sectionTitle}>
//               <IndianRupee size={20} />
//               Payment Details
//             </h2>
//             <div className={styles.formGrid}>
//               <div className={styles.formGroup}>
//                 <label htmlFor="receivedAmount" className={styles.label}>
//                   Received Amount <span className={styles.required}>*</span>
//                 </label>
//                 <div className={styles.inputIcon}>
//                   <IndianRupee size={18} />
//                   <input
//                     id="receivedAmount"
//                     type="number"
//                     step="0.01"
//                     min="0.01"
//                     value={form.receivedAmount}
//                     onChange={(e) => setForm({ ...form, receivedAmount: e.target.value })}
//                     required
//                     className={styles.input}
//                     placeholder="0.00"
//                     disabled={loadingData}
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
//                   disabled={loadingData}
//                 >
//                   {PAYMENT_TYPES.map((type) => (
//                     <option key={type} value={type}>
//                       {type.replace(/_/g, " ")}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           </div>

//           {/* Description */}
//           <div className={styles.formSection}>
//             <div className={styles.formGroup}>
//               <label htmlFor="description" className={styles.label}>
//                 Description (optional)
//               </label>
//               <textarea
//                 id="description"
//                 value={form.description}
//                 onChange={(e) => setForm({ ...form, description: e.target.value })}
//                 className={`${styles.input} ${styles.textarea}`}
//                 placeholder="Notes about this payment..."
//                 rows={3}
//                 disabled={loadingData}
//               />
//             </div>
//           </div>

//           {/* Summary */}
//           <div className={styles.summarySection}>
//             <h2 className={styles.sectionTitle}>Payment Summary</h2>
//             <div className={styles.summaryGrid}>
//               <div className={styles.summaryItem}>
//                 <span className={styles.summaryLabel}>Total Received</span>
//                 <span className={`${styles.summaryValue} ${styles.summaryValueBold}`}>
//                   <IndianRupee size={14} />
//                   {parseFloat(form.receivedAmount || 0).toFixed(2)}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </form>
//       )}
//     </div>
//   );
// };

// export default CreatePaymentIn;












"use client";

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../../utils/axiosInstance"; // Shared API with interceptors
import { toast } from "react-toastify";
import styles from "../Styles/Form.module.css";
import {
  ArrowLeft,
  CheckCircle,
  Users,
  Calendar,
  Phone,
  IndianRupee,
  FileText,
  Loader,
} from "lucide-react";

const PAYMENT_TYPES = [
  "CASH",
  "UPI",
  "CREDIT_CARD",
  "DEBIT_CARD",
  "NET_BANKING",
  "WALLET",
  "CHEQUE",
  "OTHER",
];

const CreatePaymentIn = () => {
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
  const [parties, setParties] = useState([]);

  const [form, setForm] = useState({
    partyId: "",
    receiptNo: "",
    paymentDate: new Date().toISOString().split("T")[0],
    phoneNumber: "",
    receivedAmount: "",
    paymentType: "CASH",
    description: "",
  });

  // Receipt Number Auto-generation
  const getNextReceiptNumberPreview = () => {
    if (!companyId) return "REC/NEW";
    const year = new Date().getFullYear();
    const key = `paymentInReceiptCounter_${companyId}_${year}`;
    const counter = parseInt(localStorage.getItem(key) || "0", 10);
    return `REC/${year}/${counter + 1}`;
  };

  const reserveNextReceiptNumber = () => {
    if (!companyId) return "REC/NEW";
    const year = new Date().getFullYear();
    const key = `paymentInReceiptCounter_${companyId}_${year}`;
    let counter = parseInt(localStorage.getItem(key) || "0", 10);
    counter += 1;
    localStorage.setItem(key, String(counter));
    return `REC/${year}/${counter}`;
  };

  // Show preview receipt number when creating new payment
  useEffect(() => {
    if (editId || !companyId) return;
    const preview = getNextReceiptNumberPreview();
    setForm(prev => ({ ...prev, receiptNo: preview }));
  }, [editId, companyId]);

  const handleReceiptNoChange = (e) => {
    let value = e.target.value.trim().toUpperCase();

    if (value === "REC" || value === "REC/" || value.startsWith("REC/")) {
      const nextNumber = reserveNextReceiptNumber();
      setForm(prev => ({ ...prev, receiptNo: nextNumber }));
      return;
    }

    setForm(prev => ({ ...prev, receiptNo: value }));
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

  /* ==================== FETCH DATA ==================== */
  const fetchParties = async () => {
    try {
      const res = await api.get(`/company/${companyId}/parties`);
      setParties(res.data || []);
    } catch (err) {
      toast.error("Failed to load parties");
    }
  };

  const fetchPayment = async (paymentInId) => {
    setLoadingData(true);
    try {
      const res = await api.get(`/paymentIn/${paymentInId}`);
      const p = res.data;

      setForm({
        partyId: p.partyResponseDto?.partyId?.toString() || "",
        receiptNo: p.receiptNo || "",
        paymentDate: p.paymentDate?.split("T")[0] || "",
        phoneNumber: p.phoneNumber || "",
        receivedAmount: p.receivedAmount?.toString() || "",
        paymentType: p.paymentType || "CASH",
        description: p.description || "",
      });
    } catch (err) {
      toast.error("Failed to load payment");
      navigate("/payment_in");
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (token && companyId) {
      fetchParties();
      if (editId) fetchPayment(editId);
    }
  }, [token, companyId, editId]);

  /* ==================== PARTY AUTO-FILL ==================== */
  const handlePartyChange = (partyId) => {
    const party = parties.find((p) => p.partyId === Number(partyId));
    if (party) {
      setForm((prev) => ({
        ...prev,
        partyId,
        phoneNumber: party.phoneNo || "",
      }));
    } else {
      setForm((prev) => ({ ...prev, partyId, phoneNumber: "" }));
    }
  };

  /* ==================== SUBMIT ==================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const required = ["partyId", "receiptNo", "paymentDate", "phoneNumber", "receivedAmount"];
    const missing = required.find((f) => !form[f]);
    if (missing) {
      toast.error("Please fill all required fields");
      return;
    }

    if (parseFloat(form.receivedAmount) <= 0) {
      toast.error("Received amount must be greater than 0");
      return;
    }

    const payload = {
      partyId: parseInt(form.partyId),
      receiptNo: form.receiptNo.trim(),
      paymentDate: form.paymentDate,
      phoneNumber: form.phoneNumber.trim(),
      receivedAmount: parseFloat(form.receivedAmount),
      paymentType: form.paymentType,
      description: form.description.trim() || null,
    };

    try {
      setLoading(true);

      if (editId) {
        await api.put(`/paymentIn/${editId}`, payload);
        toast.success("Payment updated!");
      } else {
        await api.post(`/company/${companyId}/add/payment-in`, payload);
        toast.success("Payment recorded!");

        // Increment counter only after successful creation
        if (companyId) {
          const year = new Date().getFullYear();
          const key = `paymentInReceiptCounter_${companyId}_${year}`;
          const current = parseInt(localStorage.getItem(key) || "0", 10);
          localStorage.setItem(key, String(current + 1));
        }
      }

      navigate("/payment_in");
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to ${editId ? "update" : "create"} payment`);
    } finally {
      setLoading(false);
    }
  };

  const isEditMode = !!editId;

  return (
    <div className={styles.container}>
      {loadingData ? (
        <div className={styles.loadingContainer}>
          <Loader className={styles.spinnerIcon} />
          <p>Loading payment...</p>
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
                      <FileText className={styles.titleIcon} />
                      Edit Payment In
                    </>
                  ) : (
                    <>
                      <IndianRupee className={styles.titleIcon} />
                      Record Payment In
                    </>
                  )}
                </h1>
                <p className={styles.subtitle}>
                  {isEditMode ? `Receipt #${form.receiptNo}` : "Money received from party"}
                </p>
              </div>
            </div>
            <div className={styles.headerActions}>
              <button
                type="button"
                onClick={() => navigate("/payment_in")}
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
                    {isEditMode ? "Update" : "Record Payment"}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Party & Receipt No */}
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>
              <Users size={20} />
              Party & Receipt
            </h2>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="party" className={styles.label}>
                  Party <span className={styles.required}>*</span>
                </label>
                <select
                  id="party"
                  value={form.partyId}
                  onChange={(e) => handlePartyChange(e.target.value)}
                  required
                  className={styles.input}
                  disabled={loadingData}
                >
                  <option value="">Select Party</option>
                  {parties.map((p) => (
                    <option key={p.partyId} value={p.partyId}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="receiptNo" className={styles.label}>
                  Receipt No <span className={styles.required}>*</span>
                </label>
                <input
                  id="receiptNo"
                  type="text"
                  value={form.receiptNo}
                  onChange={handleReceiptNoChange}
                  required
                  className={styles.input}
                  placeholder="Type REC to auto-generate"
                  disabled={loadingData || isEditMode}
                />
              </div>
            </div>
          </div>

          {/* Date & Phone */}
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>
              <Calendar size={20} />
              Date & Contact
            </h2>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="paymentDate" className={styles.label}>
                  Payment Date <span className={styles.required}>*</span>
                </label>
                <input
                  id="paymentDate"
                  type="date"
                  value={form.paymentDate}
                  onChange={(e) => setForm({ ...form, paymentDate: e.target.value })}
                  required
                  className={styles.input}
                  disabled={loadingData}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="phoneNumber" className={styles.label}>
                  Phone Number <span className={styles.required}>*</span>
                </label>
                <div className={styles.inputIcon}>
                  <Phone size={18} />
                  <input
                    id="phoneNumber"
                    type="text"
                    value={form.phoneNumber}
                    onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                    required
                    className={styles.input}
                    placeholder="10-digit mobile"
                    maxLength={10}
                    disabled={loadingData}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Amount & Payment Type */}
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>
              <IndianRupee size={20} />
              Payment Details
            </h2>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="receivedAmount" className={styles.label}>
                  Received Amount <span className={styles.required}>*</span>
                </label>
                <div className={styles.inputIcon}>
                  <IndianRupee size={18} />
                  <input
                    id="receivedAmount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={form.receivedAmount}
                    onChange={(e) => setForm({ ...form, receivedAmount: e.target.value })}
                    required
                    className={styles.input}
                    placeholder="0.00"
                    disabled={loadingData}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="paymentType" className={styles.label}>
                  Payment Type
                </label>
                <select
                  id="paymentType"
                  value={form.paymentType}
                  onChange={(e) => setForm({ ...form, paymentType: e.target.value })}
                  className={styles.input}
                  disabled={loadingData}
                >
                  {PAYMENT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className={styles.formSection}>
            <div className={styles.formGroup}>
              <label htmlFor="description" className={styles.label}>
                Description (optional)
              </label>
              <textarea
                id="description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className={`${styles.input} ${styles.textarea}`}
                placeholder="Notes about this payment..."
                rows={3}
                disabled={loadingData}
              />
            </div>
          </div>

          {/* Summary */}
          <div className={styles.summarySection}>
            <h2 className={styles.sectionTitle}>Payment Summary</h2>
            <div className={styles.summaryGrid}>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Total Received</span>
                <span className={`${styles.summaryValue} ${styles.summaryValueBold}`}>
                  <IndianRupee size={14} />
                  {parseFloat(form.receivedAmount || 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
          {/* FORM ACTION BUTTONS */}
          <div className={styles.formActions}>
            <button
              type="button"
              onClick={() => navigate("/payment_in")}
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
                  {isEditMode ? "Updating..." : "Recording..."}
                </>
              ) : isEditMode ? (
                <>
                  <CheckCircle size={18} />
                  Update Payment
                </>
              ) : (
                <>
                  <CheckCircle size={18} />
                  Record Payment
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CreatePaymentIn;