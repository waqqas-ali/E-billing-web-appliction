// import { useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import axios from "axios";
// import config from "../../../config/apiconfig";
// import styles from "./Parties.module.css";

// const Add_Parties = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { party = {}, companyId, token } = location.state || {};

//   const states = [
//     "ANDHRA_PRADESH",
//     "ARUNACHAL_PRADESH",
//     "ASSAM",
//     "BIHAR",
//     "CHHATTISGARH",
//     "GOA",
//     "GUJARAT",
//     "HARYANA",
//     "HIMACHAL_PRADESH",
//     "JHARKHAND",
//     "KARNATAKA",
//     "KERALA",
//     "MADHYA_PRADESH",
//     "MAHARASHTRA",
//     "MANIPUR",
//     "MEGHALAYA",
//     "MIZORAM",
//     "NAGALAND",
//     "ODISHA",
//     "PUNJAB",
//     "RAJASTHAN",
//     "SIKKIM",
//     "TAMIL_NADU",
//     "TELANGANA",
//     "TRIPURA",
//     "UTTAR_PRADESH",
//     "UTTARAKHAND",
//     "WEST_BENGAL",
//     "OTHER",
//   ];

//   const gstTypes = [
//     "UNREGISTER_CONSUMER",
//     "REGISTERD_BUSSINESS_REGULAR",
//     "REGISTED_BUSSINESS_COMPOSITION",
//   ];

//   const [name, setName] = useState(party.name || "");
//   const [gstin, setGstin] = useState(party.gstin || "");
//   const [gstType, setGstType] = useState(party.gstType || "");
//   const [phoneNo, setPhoneNo] = useState(party.phoneNo || "");
//   const [state, setState] = useState(party.state || "");
//   const [emailId, setEmailId] = useState(party.emailId || "");
//   const [billingAddress, setBillingAddress] = useState(party.billingAddress || "");
//   const [shippingAddress, setShippingAddress] = useState(party.shipingAddress || "");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const handleCreateParty = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     const payload = {
//       name,
//       gstin,
//       gstType,
//       phoneNo,
//       state,
//       emailId,
//       billingAddress,
//       shipingAddress: shippingAddress,
//     };

//     try {
//       if (party.partyId) {
//         await axios.put(`${config.BASE_URL}/party/${party.partyId}`, payload, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         });
//         alert("Party updated successfully");
//       } else {
//         await axios.post(
//           `${config.BASE_URL}/company/${companyId}/created/party`,
//           payload,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         alert("Party created successfully");
//       }
//       navigate("/parties");
//     } catch (error) {
//       setError(error.response?.data?.message || "Failed to save party.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className={styles.formContainer}>
//       <div className={styles.formHeader}>
//         <div>
//           <h1 className={styles.formTitle}>
//             {party.partyId ? "Edit Party" : "Create Party"}
//           </h1>
//           <p className={styles.formSubtitle}>
//             {party.partyId ? "Update party details" : "Add a new party to your company"}
//           </p>
//         </div>
//         <button
//           onClick={() => navigate("/parties")}
//           className={styles.closeButton}
//           disabled={loading}
//         >
//           <i className="fas fa-times"></i> Close
//         </button>
//       </div>

//       {loading && (
//         <div className={styles.loading}>
//           <div className={styles.spinner}></div>
//           <p>{party.partyId ? "Updating..." : "Creating..."}</p>
//         </div>
//       )}

//       {error && <div className={styles.error}>{error}</div>}

//       <form onSubmit={handleCreateParty} className={styles.form}>
//         <div className={styles.formSection}>
//           <h2 className={styles.sectionTitle}>Party Information</h2>
//           <div className={styles.formRow}>
//             <div className={styles.formGroup}>
//               <label htmlFor="name">
//                 Name <span className={styles.required}>*</span>
//               </label>
//               <input
//                 type="text"
//                 id="name"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 className={styles.input}
//                 required
//                 disabled={loading}
//               />
//             </div>
//             <div className={styles.formGroup}>
//               <label htmlFor="gstin">GST No</label>
//               <input
//                 type="text"
//                 id="gstin"
//                 value={gstin}
//                 onChange={(e) => setGstin(e.target.value)}
//                 className={styles.input}
//                 disabled={loading}
//               />
//             </div>
//           </div>
//           <div className={styles.formRow}>
//             <div className={styles.formGroup}>
//               <label htmlFor="gstType">
//                 GST Type <span className={styles.required}>*</span>
//               </label>
//               <select
//                 id="gstType"
//                 value={gstType}
//                 onChange={(e) => setGstType(e.target.value)}
//                 required
//                 className={styles.select}
//                 disabled={loading}
//               >
//                 <option value="">Select GST Type</option>
//                 {gstTypes.map((type) => (
//                   <option key={type} value={type}>
//                     {type
//                       .replace(/_/g, " ")
//                       .toLowerCase()
//                       .replace(/\b\w/g, (c) => c.toUpperCase())}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className={styles.formGroup}>
//               <label htmlFor="state">
//                 State <span className={styles.required}>*</span>
//               </label>
//               <select
//                 id="state"
//                 value={state}
//                 onChange={(e) => setState(e.target.value)}
//                 required
//                 className={styles.select}
//                 disabled={loading}
//               >
//                 <option value="">Select State</option>
//                 {states.map((s) => (
//                   <option key={s} value={s}>
//                     {s
//                       .replace(/_/g, " ")
//                       .toLowerCase()
//                       .replace(/\b\w/g, (c) => c.toUpperCase())}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//           <div className={styles.formRow}>
//             <div className={styles.formGroup}>
//               <label htmlFor="phoneNo">Phone No</label>
//               <input
//                 type="tel"
//                 id="phoneNo"
//                 value={phoneNo}
//                 onChange={(e) => setPhoneNo(e.target.value)}
//                 className={styles.input}
//                 disabled={loading}
//               />
//             </div>
//             <div className={styles.formGroup}>
//               <label htmlFor="emailId">Email</label>
//               <input
//                 type="email"
//                 id="emailId"
//                 value={emailId}
//                 onChange={(e) => setEmailId(e.target.value)}
//                 className={styles.input}
//                 disabled={loading}
//               />
//             </div>
//           </div>
//         </div>

//         <div className={styles.formSection}>
//           <h2 className={styles.sectionTitle}>Address Details</h2>
//           <div className={styles.formGroup}>
//             <label htmlFor="billingAddress">Billing Address</label>
//             <textarea
//               id="billingAddress"
//               value={billingAddress}
//               onChange={(e) => setBillingAddress(e.target.value)}
//               className={styles.textarea}
//               disabled={loading}
//             ></textarea>
//           </div>
//           <div className={styles.formGroup}>
//             <label htmlFor="shippingAddress">Shipping Address</label>
//             <textarea
//               id="shippingAddress"
//               value={shippingAddress}
//               onChange={(e) => setShippingAddress(e.target.value)}
//               className={styles.textarea}
//               disabled={loading}
//             ></textarea>
//           </div>
//         </div>

//         <div className={styles.formActions}>
//           <button
//             type="submit"
//             className={styles.submitButton}
//             disabled={loading}
//           >
//             {party.partyId ? "Update Party" : "Create Party"}
//           </button>
//           <button
//             type="button"
//             className={styles.cancelButton}
//             onClick={() => navigate("/parties")}
//             disabled={loading}
//           >
//             Cancel
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default Add_Parties;






// // src/pages/Add_Parties.jsx
// import { useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import axios from "axios";
// import config from "../../../config/apiconfig";
// import { X, Loader2, AlertCircle } from "lucide-react";
// import styles from "./Parties.module.css";

// const Add_Parties = () => {
//   const navigate = useNavigate();
//   const { state } = useLocation();
//   const { party = {}, companyId, token } = state || {};

//   const states = [
//     "ANDHRA_PRADESH", "ARUNACHAL_PRADESH", "ASSAM", "BIHAR", "CHHATTISGARH",
//     "GOA", "GUJARAT", "HARYANA", "HIMACHAL_PRADESH", "JHARKHAND",
//     "KARNATAKA", "KERALA", "MADHYA_PRADESH", "MAHARASHTRA", "MANIPUR",
//     "MEGHALAYA", "MIZORAM", "NAGALAND", "ODISHA", "PUNJAB",
//     "RAJASTHAN", "SIKKIM", "TAMIL_NADU", "TELANGANA", "TRIPURA",
//     "UTTAR_PRADESH", "UTTARAKHAND", "WEST_BENGAL", "OTHER"
//   ];

//   const gstTypes = [
//     "UNREGISTER_CONSUMER",
//     "REGISTERD_BUSSINESS_REGULAR",
//     "REGISTED_BUSSINESS_COMPOSITION",
//   ];

//   const [form, setForm] = useState({
//     name: party.name || "",
//     gstin: party.gstin || "",
//     gstType: party.gstType || "",
//     phoneNo: party.phoneNo || "",
//     state: party.state || "",
//     emailId: party.emailId || "",
//     billingAddress: party.billingAddress || "",
//     shippingAddress: party.shipingAddress || "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     const payload = {
//       ...form,
//       shipingAddress: form.shippingAddress,
//     };

//     try {
//       if (party.partyId) {
//         await axios.put(`${config.BASE_URL}/party/${party.partyId}`, payload, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//       } else {
//         await axios.post(
//           `${config.BASE_URL}/company/${companyId}/created/party`,
//           payload,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//       }
//       navigate("/parties");
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to save party.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className={styles.formContainer}>
//       <div className={styles.formHeader}>
//         <div>
//           <h1 className={styles.formTitle}>
//             {party.partyId ? "Edit Party" : "Create Party"}
//           </h1>
//           <p className={styles.formSubtitle}>
//             {party.partyId ? "Update party details" : "Add a new business contact"}
//           </p>
//         </div>
//         <button
//           onClick={() => navigate("/parties")}
//           className={styles.closeBtn}
//           disabled={loading}
//         >
//           <X size={18} />
//         </button>
//       </div>

//       {loading && (
//         <div className={styles.loading}>
//           <Loader2 className={styles.spinner} size={40} />
//           <p>{party.partyId ? "Updating..." : "Creating..."}</p>
//         </div>
//       )}

//       {error && (
//         <div className={styles.error}>
//           <AlertCircle size={18} />
//           {error}
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className={styles.form}>
//         <section className={styles.section}>
//           <h2 className={styles.sectionTitle}>Party Information</h2>
//           <div className={styles.grid}>
//             <div className={styles.field}>
//               <label>
//                 Name <span className={styles.req}>*</span>
//               </label>
//               <input
//                 name="name"
//                 value={form.name}
//                 onChange={handleChange}
//                 required
//                 disabled={loading}
//               />
//             </div>
//             <div className={styles.field}>
//               <label>GST No</label>
//               <input name="gstin" value={form.gstin} onChange={handleChange} disabled={loading} />
//             </div>
//           </div>
//           <div className={styles.grid}>
//             <div className={styles.field}>
//               <label>
//                 GST Type <span className={styles.req}>*</span>
//               </label>
//               <select
//                 name="gstType"
//                 value={form.gstType}
//                 onChange={handleChange}
//                 required
//                 disabled={loading}
//               >
//                 <option value="">Select Type</option>
//                 {gstTypes.map((t) => (
//                   <option key={t} value={t}>
//                     {formatEnum(t)}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className={styles.field}>
//               <label>
//                 State <span className={styles.req}>*</span>
//               </label>
//               <select
//                 name="state"
//                 value={form.state}
//                 onChange={handleChange}
//                 required
//                 disabled={loading}
//               >
//                 <option value="">Select State</option>
//                 {states.map((s) => (
//                   <option key={s} value={s}>
//                     {formatEnum(s)}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//           <div className={styles.grid}>
//             <div className={styles.field}>
//               <label>Phone</label>
//               <input name="phoneNo" value={form.phoneNo} onChange={handleChange} disabled={loading} />
//             </div>
//             <div className={styles.field}>
//               <label>Email</label>
//               <input name="emailId" type="email" value={form.emailId} onChange={handleChange} disabled={loading} />
//             </div>
//           </div>
//         </section>

//         <section className={styles.section}>
//           <h2 className={styles.sectionTitle}>Address</h2>
//           <div className={styles.field}>
//             <label>Billing Address</label>
//             <textarea
//               name="billingAddress"
//               value={form.billingAddress}
//               onChange={handleChange}
//               rows={3}
//               disabled={loading}
//             />
//           </div>
//           <div className={styles.field}>
//             <label>Shipping Address</label>
//             <textarea
//               name="shippingAddress"
//               value={form.shippingAddress}
//               onChange={handleChange}
//               rows={3}
//               disabled={loading}
//             />
//           </div>
//         </section>

//         <div className={styles.formActions}>
//           <button type="submit" className={styles.submitBtn} disabled={loading}>
//             {party.partyId ? "Update" : "Create"} Party
//           </button>
//           <button type="button" className={styles.cancelBtn} onClick={() => navigate("/parties")} disabled={loading}>
//             Cancel
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// const formatEnum = (val) =>
//   val
//     ? val
//         .replace(/_/g, " ")
//         .toLowerCase()
//         .replace(/\b\w/g, (c) => c.toUpperCase())
//     : "";

// export default Add_Parties;








// import React, { useState } from "react"
// import { useNavigate, useLocation } from "react-router-dom"
// import axios from "axios"
// import config from "../../../config/apiconfig"
// import styles from "../Styles/Form.module.css" // Unified with other forms
// import { toast } from "react-toastify"
// import {
//   X,
//   Loader,
//   AlertCircle,
//   Users,
//   Building,
//   Phone,
//   Mail,
//   MapPin,
//   CheckCircle,
//   ArrowLeft,
// } from "lucide-react"

// const Add_Parties = () => {
//   const navigate = useNavigate()
//   const { state } = useLocation()
//   const { party = {}, companyId, token } = state || {}

//   const states = [
//     "ANDHRA_PRADESH", "ARUNACHAL_PRADESH", "ASSAM", "BIHAR", "CHHATTISGARH",
//     "GOA", "GUJARAT", "HARYANA", "HIMACHAL_PRADESH", "JHARKHAND",
//     "KARNATAKA", "KERALA", "MADHYA_PRADESH", "MAHARASHTRA", "MANIPUR",
//     "MEGHALAYA", "MIZORAM", "NAGALAND", "ODISHA", "PUNJAB",
//     "RAJASTHAN", "SIKKIM", "TAMIL_NADU", "TELANGANA", "TRIPURA",
//     "UTTAR_PRADESH", "UTTARAKHAND", "WEST_BENGAL", "OTHER"
//   ]

//   const gstTypes = [
//     "UNREGISTER_CONSUMER",
//     "REGISTERD_BUSSINESS_REGULAR",
//     "REGISTED_BUSSINESS_COMPOSITION",
//   ]

//   const [form, setForm] = useState({
//     name: party.name || "",
//     gstin: party.gstin || "",
//     gstType: party.gstType || "",
//     phoneNo: party.phoneNo || "",
//     state: party.state || "",
//     emailId: party.emailId || "",
//     billingAddress: party.billingAddress || "",
//     shippingAddress: party.shipingAddress || "",
//   })

//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState("")

//   const handleChange = (e) => {
//     const { name, value } = e.target
//     setForm((prev) => ({ ...prev, [name]: value }))
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setLoading(true)
//     setError("")

//     const payload = {
//       ...form,
//       shipingAddress: form.shippingAddress,
//     }

//     try {
//       if (party.partyId) {
//         await axios.put(`${config.BASE_URL}/party/${party.partyId}`, payload, {
//           headers: { Authorization: `Bearer ${token}` },
//         })
//         toast.success("Party updated successfully!")
//       } else {
//         await axios.post(
//           `${config.BASE_URL}/company/${companyId}/created/party`,
//           payload,
//           { headers: { Authorization: `Bearer ${token}` } }
//         )
//         toast.success("Party created successfully!")
//       }
//       navigate("/parties")
//     } catch (err) {
//       const msg = err.response?.data?.message || "Failed to save party."
//       setError(msg)
//       toast.error(msg)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const isEditMode = !!party.partyId

//   const formatEnum = (val) =>
//     val
//       ? val
//           .replace(/_/g, " ")
//           .toLowerCase()
//           .replace(/\b\w/g, (c) => c.toUpperCase())
//       : ""

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
//                     <Building className={styles.titleIcon} />
//                     Edit Party
//                   </>
//                 ) : (
//                   <>
//                     <Users className={styles.titleIcon} />
//                     Create Party
//                   </>
//                 )}
//               </h1>
//               <p className={styles.subtitle}>
//                 {isEditMode ? "Update party details" : "Add a new business contact"}
//               </p>
//             </div>
//           </div>
//           <div className={styles.headerActions}>
//             <button
//               type="button"
//               onClick={() => navigate("/parties")}
//               className={styles.buttonSecondary}
//               disabled={loading}
//             >
//               <ArrowLeft size={18} />
//               Back
//             </button>
//             <button
//               type="submit"
//               className={styles.buttonPrimary}
//               disabled={loading}
//             >
//               {loading ? (
//                 <>
//                   <Loader size={18} className={styles.spinnerSmall} />
//                   Saving...
//                 </>
//               ) : (
//                 <>
//                   <CheckCircle size={18} />
//                   {isEditMode ? "Update" : "Create"} Party
//                 </>
//               )}
//             </button>
//           </div>
//         </div>

//         {/* Error Alert */}
//         {error && (
//           <div className={styles.alertError}>
//             <AlertCircle size={18} />
//             <span>{error}</span>
//           </div>
//         )}

//         {/* Party Information */}
//         <div className={styles.formSection}>
//           <h2 className={styles.sectionTitle}>
//             <Users size={20} />
//             Party Information
//           </h2>

//           <div className={styles.formGrid}>
//             <div className={styles.formGroup}>
//               <label htmlFor="name" className={styles.label}>
//                 Name <span className={styles.required}>*</span>
//               </label>
//               <input
//                 id="name"
//                 name="name"
//                 type="text"
//                 value={form.name}
//                 onChange={handleChange}
//                 required
//                 className={styles.input}
//                 disabled={loading}
//                 placeholder="Enter party name"
//               />
//             </div>

//             <div className={styles.formGroup}>
//               <label htmlFor="gstin" className={styles.label}>
//                 GST No
//               </label>
//               <input
//                 id="gstin"
//                 name="gstin"
//                 type="text"
//                 value={form.gstin}
//                 onChange={handleChange}
//                 className={styles.input}
//                 disabled={loading}
//                 placeholder="15-digit GSTIN"
//                 maxLength={15}
//               />
//             </div>
//           </div>

//           <div className={styles.formGrid}>
//             <div className={styles.formGroup}>
//               <label htmlFor="gstType" className={styles.label}>
//                 GST Type <span className={styles.required}>*</span>
//               </label>
//               <select
//                 id="gstType"
//                 name="gstType"
//                 value={form.gstType}
//                 onChange={handleChange}
//                 required
//                 className={styles.input}
//                 disabled={loading}
//               >
//                 <option value="">Select GST Type</option>
//                 {gstTypes.map((t) => (
//                   <option key={t} value={t}>
//                     {formatEnum(t)}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className={styles.formGroup}>
//               <label htmlFor="state" className={styles.label}>
//                 State <span className={styles.required}>*</span>
//               </label>
//               <div className={styles.inputIcon}>
//                 <MapPin size={18} />
//                 <select
//                   id="state"
//                   name="state"
//                   value={form.state}
//                   onChange={handleChange}
//                   required
//                   className={styles.input}
//                   disabled={loading}
//                 >
//                   <option value="">Select State</option>
//                   {states.map((s) => (
//                     <option key={s} value={s}>
//                       {formatEnum(s)}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           </div>

//           <div className={styles.formGrid}>
//             <div className={styles.formGroup}>
//               <label htmlFor="phoneNo" className={styles.label}>
//                 Phone
//               </label>
//               <div className={styles.inputIcon}>
//                 <Phone size={18} />
//                 <input
//                   id="phoneNo"
//                   name="phoneNo"
//                   type="text"
//                   value={form.phoneNo}
//                   onChange={handleChange}
//                   className={styles.input}
//                   disabled={loading}
//                   placeholder="10-digit mobile"
//                   maxLength={10}
//                 />
//               </div>
//             </div>

//             <div className={styles.formGroup}>
//               <label htmlFor="emailId" className={styles.label}>
//                 Email
//               </label>
//               <div className={styles.inputIcon}>
//                 <Mail size={18} />
//                 <input
//                   id="emailId"
//                   name="emailId"
//                   type="email"
//                   value={form.emailId}
//                   onChange={handleChange}
//                   className={styles.input}
//                   disabled={loading}
//                   placeholder="example@domain.com"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Address Section */}
//         <div className={styles.formSection}>
//           <h2 className={styles.sectionTitle}>
//             <MapPin size={20} />
//             Address Details
//           </h2>

//           <div className={styles.formGroup}>
//             <label htmlFor="billingAddress" className={styles.label}>
//               Billing Address
//             </label>
//             <textarea
//               id="billingAddress"
//               name="billingAddress"
//               value={form.billingAddress}
//               onChange={handleChange}
//               rows={3}
//               className={`${styles.input} ${styles.textarea}`}
//               disabled={loading}
//               placeholder="Full billing address..."
//             />
//           </div>

//           <div className={styles.formGroup}>
//             <label htmlFor="shippingAddress" className={styles.label}>
//               Shipping Address
//             </label>
//             <textarea
//               id="shippingAddress"
//               name="shippingAddress"
//               value={form.shippingAddress}
//               onChange={handleChange}
//               rows={3}
//               className={`${styles.input} ${styles.textarea}`}
//               disabled={loading}
//               placeholder="Same as billing or enter new..."
//             />
//           </div>
//         </div>
//       </form>
//     </div>
//   )
// }

// export default Add_Parties








"use client";

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../../utils/axiosInstance"; // 👈 Shared API with interceptors
import { toast } from "react-toastify";
import styles from "../Styles/Form.module.css";
import {
  X,
  Loader,
  AlertCircle,
  Users,
  Building,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";

const Add_Parties = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const passedParty = state?.party || {}; // Only use party data from navigation state

  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("eBilling") || "{}")
  );

  const companyId = userData?.selectedCompany?.id;
  const token = userData?.accessToken;

  const states = [
    "ANDHRA_PRADESH", "ARUNACHAL_PRADESH", "ASSAM", "BIHAR", "CHHATTISGARH",
    "GOA", "GUJARAT", "HARYANA", "HIMACHAL_PRADESH", "JHARKHAND",
    "KARNATAKA", "KERALA", "MADHYA_PRADESH", "MAHARASHTRA", "MANIPUR",
    "MEGHALAYA", "MIZORAM", "NAGALAND", "ODISHA", "PUNJAB",
    "RAJASTHAN", "SIKKIM", "TAMIL_NADU", "TELANGANA", "TRIPURA",
    "UTTAR_PRADESH", "UTTARAKHAND", "WEST_BENGAL", "OTHER"
  ];

  const gstTypes = [
    "UNREGISTER_CONSUMER",
    "REGISTERD_BUSSINESS_REGULAR",
    "REGISTED_BUSSINESS_COMPOSITION",
  ];

  const [form, setForm] = useState({
    name: passedParty.name || "",
    gstin: passedParty.gstin || "",
    gstType: passedParty.gstType || "",
    phoneNo: passedParty.phoneNo || "",
    state: passedParty.state || "",
    emailId: passedParty.emailId || "",
    billingAddress: passedParty.billingAddress || "",
    shippingAddress: passedParty.shipingAddress || "", // Keep as per backend field name
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Sync userData if token/company changes (e.g., switch company, logout)
  useEffect(() => {
    const handleStorageChange = () => {
      const updated = JSON.parse(localStorage.getItem("eBilling") || "{}");
      setUserData(updated);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Redirect if not authenticated or no company selected
  useEffect(() => {
    if (!token || !companyId) {
      toast.info("Please select a company first.");
      navigate("/company-list");
    }
  }, [token, companyId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!token || !companyId) {
      toast.error("Session expired or no company selected.");
      navigate("/company-list");
      return;
    }

    const payload = {
      ...form,
      shipingAddress: form.shippingAddress, // Match backend field name exactly
    };

    try {
      if (passedParty.partyId) {
        // Update existing party
        await api.put(`/party/${passedParty.partyId}`, payload);
        toast.success("Party updated successfully!");
      } else {
        // Create new party
        await api.post(`/company/${companyId}/created/party`, payload);
        toast.success("Party created successfully!");
      }
      navigate("/parties");
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to save party.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const isEditMode = !!passedParty.partyId;

  const formatEnum = (val) =>
    val
      ? val
          .replace(/_/g, " ")
          .toLowerCase()
          .replace(/\b\w/g, (c) => c.toUpperCase())
      : "";

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
                    <Building className={styles.titleIcon} />
                    Edit Party
                  </>
                ) : (
                  <>
                    <Users className={styles.titleIcon} />
                    Create Party
                  </>
                )}
              </h1>
              <p className={styles.subtitle}>
                {isEditMode ? "Update party details" : "Add a new business contact"}
              </p>
            </div>
          </div>
          <div className={styles.headerActions}>
            <button
              type="button"
              onClick={() => navigate("/parties")}
              className={styles.buttonSecondary}
              disabled={loading}
            >
              <ArrowLeft size={18} />
              Back
            </button>
            <button
              type="submit"
              className={styles.buttonPrimary}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader size={18} className={styles.spinnerSmall} />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle size={18} />
                  {isEditMode ? "Update" : "Create"} Party
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className={styles.alertError}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Party Information */}
        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>
            <Users size={20} />
            Party Information
          </h2>

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.label}>
                Name <span className={styles.required}>*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                required
                className={styles.input}
                disabled={loading}
                placeholder="Enter party name"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="gstin" className={styles.label}>
                GST No
              </label>
              <input
                id="gstin"
                name="gstin"
                type="text"
                value={form.gstin}
                onChange={handleChange}
                className={styles.input}
                disabled={loading}
                placeholder="15-digit GSTIN"
                maxLength={15}
              />
            </div>
          </div>

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="gstType" className={styles.label}>
                GST Type <span className={styles.required}>*</span>
              </label>
              <select
                id="gstType"
                name="gstType"
                value={form.gstType}
                onChange={handleChange}
                required
                className={styles.input}
                disabled={loading}
              >
                <option value="">Select GST Type</option>
                {gstTypes.map((t) => (
                  <option key={t} value={t}>
                    {formatEnum(t)}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="state" className={styles.label}>
                State <span className={styles.required}>*</span>
              </label>
              <div className={styles.inputIcon}>
                <MapPin size={18} />
                <select
                  id="state"
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  required
                  className={styles.input}
                  disabled={loading}
                >
                  <option value="">Select State</option>
                  {states.map((s) => (
                    <option key={s} value={s}>
                      {formatEnum(s)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="phoneNo" className={styles.label}>
                Phone
              </label>
              <div className={styles.inputIcon}>
                <Phone size={18} />
                <input
                  id="phoneNo"
                  name="phoneNo"
                  type="text"
                  value={form.phoneNo}
                  onChange={handleChange}
                  className={styles.input}
                  disabled={loading}
                  placeholder="10-digit mobile"
                  maxLength={10}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="emailId" className={styles.label}>
                Email
              </label>
              <div className={styles.inputIcon}>
                <Mail size={18} />
                <input
                  id="emailId"
                  name="emailId"
                  type="email"
                  value={form.emailId}
                  onChange={handleChange}
                  className={styles.input}
                  disabled={loading}
                  placeholder="example@domain.com"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Address Section */}
        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>
            <MapPin size={20} />
            Address Details
          </h2>

          <div className={styles.formGroup}>
            <label htmlFor="billingAddress" className={styles.label}>
              Billing Address
            </label>
            <textarea
              id="billingAddress"
              name="billingAddress"
              value={form.billingAddress}
              onChange={handleChange}
              rows={3}
              className={`${styles.input} ${styles.textarea}`}
              disabled={loading}
              placeholder="Full billing address..."
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="shippingAddress" className={styles.label}>
              Shipping Address
            </label>
            <textarea
              id="shippingAddress"
              name="shippingAddress"
              value={form.shippingAddress}
              onChange={handleChange}
              rows={3}
              className={`${styles.input} ${styles.textarea}`}
              disabled={loading}
              placeholder="Same as billing or enter new..."
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default Add_Parties;