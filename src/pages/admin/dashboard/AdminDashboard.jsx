// import React from 'react';
// import styles from './AdminDashboard.module.css';
// import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
// import { Users, ShoppingCart, TrendingUp, CheckCircle, Activity, Clock } from 'lucide-react';

// // Simple Rupee Symbol Component (No external dependency)
// const RupeeIcon = ({ size = 20 }) => (
//   <span
//     style={{
//       fontSize: `${size}px`,
//       fontWeight: 'bold',
//       lineHeight: 1,
//       display: 'inline-block',
//       color: 'inherit',
//     }}
//   >
//     ₹
//   </span>
// );

// // Sample Data
// const revenueData = [
//   { month: 'Jan', revenue: 4000 },
//   { month: 'Feb', revenue: 3000 },
//   { month: 'Mar', revenue: 5000 },
//   { month: 'Apr', revenue: 4500 },
//   { month: 'May', revenue: 6000 },
//   { month: 'Jun', revenue: 5500 },
// ];

// const categoryData = [
//   { name: 'Electronics', value: 35 },
//   { name: 'Clothing', value: 25 },
//   { name: 'Food', value: 20 },
//   { name: 'Books', value: 20 },
// ];

// const recentActivity = [
//   { id: 1, user: 'John Doe', action: 'Placed order #1234', time: '2 min ago', status: 'success' },
//   { id: 2, user: 'Jane Smith', action: 'Registered new account', time: '15 min ago', status: 'info' },
//   { id: 3, user: 'Mike Johnson', action: 'Updated profile', time: '1 hour ago', status: 'warning' },
//   { id: 4, user: 'Sarah Lee', action: 'Completed purchase #1235', time: '2 hours ago', status: 'success' },
// ];

// const stats = [
//   { title: 'Total Revenue (₹)', value: '54,239', change: '+12.5%', icon: RupeeIcon, iconClass: 'iconRevenue' },
//   { title: 'Total Users', value: '1,429', change: '+8.2%', icon: Users, iconClass: 'iconUsers' },
//   { title: 'Total Invoices', value: '842', change: '+23.1%', icon: ShoppingCart, iconClass: 'iconOrders' },
//   { title: 'Growth Rate', value: '32.5%', change: '+4.3%', icon: TrendingUp, iconClass: 'iconGrowth' },
// ];

// const AdminDashboard = () => {
//   return (
//     <div className={styles.container}>
//       <div className={styles.wrapper}>
//         {/* Header */}
//         <header className={styles.header}>
//           <h1 className={styles.title}>Admin Dashboard</h1>
//           <p className={styles.subtitle}>Welcome back! Here's what's happening with your store today.</p>
//         </header>

//         {/* Stats */}
//         <div className={styles.statsGrid}>
//           {stats.map((stat, i) => (
//             <div key={i} className={styles.statCard}>
//               <div className={styles.statContent}>
//                 <h3>{stat.title}</h3>
//                 <p className={styles.statValue}>
//                   {stat.title.includes('Revenue') ? `₹${stat.value}` : stat.value}
//                 </p>
//                 <p className={styles.statChange}>
//                   <TrendingUp size={14} style={{ marginRight: '4px' }} />
//                   {stat.change} from last month
//                 </p>
//               </div>
//               <div className={`${styles.iconWrapper} ${styles[stat.iconClass]}`}>
//                 <stat.icon size={20} />
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Charts */}
//         <div className={styles.chartsGrid}>
//           <div className={styles.chartCard}>
//             <h3 className={styles.chartTitle}>Revenue Overview</h3>
//             <div className={styles.chartContainer}>
//               <ResponsiveContainer width="100%" height="100%">
//                 <LineChart data={revenueData}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                   <XAxis dataKey="month" tick={{ fill: '#6b7280' }} />
//                   <YAxis tick={{ fill: '#6b7280' }} />
//                   <Tooltip
//                     contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
//                     formatter={(value) => `₹${value}`}
//                   />
//                   <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981' }} />
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>
//           </div>

//           <div className={styles.chartCard}>
//             <h3 className={styles.chartTitle}>Sales by Category</h3>
//             <div className={styles.chartContainer}>
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart data={categoryData}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                   <XAxis dataKey="name" tick={{ fill: '#6b7280' }} angle={-45} textAnchor="end" height={80} />
//                   <YAxis tick={{ fill: '#6b7280' }} />
//                   <Tooltip />
//                   <Bar dataKey="value" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </div>
//         </div>

//         {/* Recent Activity */}
//         <div className={styles.activityCard}>
//           <div className={styles.activityHeader}>
//             <h3 className={styles.activityTitle}>Recent Activity</h3>
//             <a href="#" className={styles.viewAll}>View all</a>
//           </div>
//           <div className={styles.activityList}>
//             {recentActivity.map((act) => (
//               <div key={act.id} className={styles.activityItem}>
//                 <div className={styles.activityInfo}>
//                   <div className={`${styles.activityIcon} ${styles[
//                     act.status === 'success' ? 'iconSuccess' :
//                     act.status === 'info' ? 'iconInfo' : 'iconWarning'
//                   ]}`}>
//                     {act.status === 'success' ? <CheckCircle size={16} /> :
//                      act.status === 'info' ? <Activity size={16} /> :
//                      <Clock size={16} />}
//                   </div>
//                   <div className={styles.activityText}>
//                     <h4>{act.user}</h4>
//                     <p>{act.action}</p>
//                   </div>
//                 </div>
//                 <span className={styles.activityTime}>{act.time}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;






// import React from 'react';
// import styles from './AdminDashboard.module.css';
// import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
// import { Users, ShoppingCart, TrendingUp, CheckCircle, Activity, Clock } from 'lucide-react';

// // Sample Data
// const revenueData = [
//   { month: 'Jan', revenue: 4000 },
//   { month: 'Feb', revenue: 3000 },
//   { month: 'Mar', revenue: 5000 },
//   { month: 'Apr', revenue: 4500 },
//   { month: 'May', revenue: 6000 },
//   { month: 'Jun', revenue: 5500 },
// ];

// const categoryData = [
//   { name: 'Electronics', value: 35 },
//   { name: 'Clothing', value: 25 },
//   { name: 'Food', value: 20 },
//   { name: 'Books', value: 20 },
// ];

// const recentActivity = [
//   { id: 1, user: 'John Doe', action: 'Placed order #1234', time: '2 min ago', status: 'success' },
//   { id: 2, user: 'Jane Smith', action: 'Registered new account', time: '15 min ago', status: 'info' },
//   { id: 3, user: 'Mike Johnson', action: 'Updated profile', time: '1 hour ago', status: 'warning' },
//   { id: 4, user: 'Sarah Lee', action: 'Completed purchase #1235', time: '2 hours ago', status: 'success' },
// ];

// const stats = [
//   { title: 'Total Revenue', value: '$54,239', change: '+12.5%', icon: TrendingUp, iconClass: 'iconRevenue' },
//   { title: 'Total Users', value: '1,429', change: '+8.2%', icon: Users, iconClass: 'iconUsers' },
//   { title: 'Total Invoices', value: '842', change: '+23.1%', icon: ShoppingCart, iconClass: 'iconOrders' },
//   { title: 'Growth Rate', value: '32.5%', change: '+4.3%', icon: TrendingUp, iconClass: 'iconGrowth' },
// ];

// const AdminDashboard = () => {
//   return (
//     <div className={styles.container}>
//       <div className={styles.wrapper}>
//         {/* Header */}
//         <header className={styles.header}>
//           <h1 className={styles.title}>Admin Dashboard</h1>
//           <p className={styles.subtitle}>Welcome back! Here's what's happening with your store today.</p>
//         </header>

//         {/* Stats */}
//         <div className={styles.statsGrid}>
//           {stats.map((stat, i) => (
//             <div key={i} className={styles.statCard}>
//               <div className={styles.statContent}>
//                 <h3>{stat.title}</h3>
//                 <p className={styles.statValue}>{stat.value}</p>
//                 <p className={styles.statChange}>
//                   <TrendingUp size={14} style={{ marginRight: '4px' }} />
//                   {stat.change} from last month
//                 </p>
//               </div>
//               <div className={`${styles.iconWrapper} ${styles[stat.iconClass]}`}>
//                 <stat.icon size={20} />
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Charts */}
//         <div className={styles.chartsGrid}>
//           <div className={styles.chartCard}>
//             <h3 className={styles.chartTitle}>Revenue Overview</h3>
//             <div className={styles.chartContainer}>
//               <ResponsiveContainer width="100%" height="100%">
//                 <LineChart data={revenueData}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                   <XAxis dataKey="month" tick={{ fill: '#6b7280' }} />
//                   <YAxis tick={{ fill: '#6b7280' }} />
//                   <Tooltip
//                     contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
//                   />
//                   <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981' }} />
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>
//           </div>

//           <div className={styles.chartCard}>
//             <h3 className={styles.chartTitle}>Sales by Items</h3>
//             <div className={styles.chartContainer}>
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart data={categoryData}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                   <XAxis dataKey="name" tick={{ fill: '#6b7280' }} angle={-45} textAnchor="end" height={80} />
//                   <YAxis tick={{ fill: '#6b7280' }} />
//                   <Tooltip />
//                   <Bar dataKey="value" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </div>
//         </div>

//         {/* Recent Activity */}
//         <div className={styles.activityCard}>
//           <div className={styles.activityHeader}>
//             <h3 className={styles.activityTitle}>Recent Activity</h3>
//             <a href="#" className={styles.viewAll}>View all</a>
//           </div>
//           <div className={styles.activityList}>
//             {recentActivity.map((act) => (
//               <div key={act.id} className={styles.activityItem}>
//                 <div className={styles.activityInfo}>
//                   <div className={`${styles.activityIcon} ${styles[
//                     act.status === 'success' ? 'iconSuccess' :
//                     act.status === 'info' ? 'iconInfo' : 'iconWarning'
//                   ]}`}>
//                     {act.status === 'success' ? <CheckCircle size={16} /> :
//                      act.status === 'info' ? <Activity size={16} /> :
//                      <Clock size={16} />}
//                   </div>
//                   <div className={styles.activityText}>
//                     <h4>{act.user}</h4>
//                     <p>{act.action}</p>
//                   </div>
//                 </div>
//                 <span className={styles.activityTime}>{act.time}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;











// import React from 'react';
// import styles from './AdminDashboard.module.css';
// import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
// import { DollarSign, Users, ShoppingCart, TrendingUp, CheckCircle, Activity, Clock } from 'lucide-react';

// // Sample Data
// const revenueData = [
//   { month: 'Jan', revenue: 4000 },
//   { month: 'Feb', revenue: 3000 },
//   { month: 'Mar', revenue: 5000 },
//   { month: 'Apr', revenue: 4500 },
//   { month: 'May', revenue: 6000 },
//   { month: 'Jun', revenue: 5500 },
// ];

// const categoryData = [
//   { name: 'Electronics', value: 35 },
//   { name: 'Clothing', value: 25 },
//   { name: 'Food', value: 20 },
//   { name: 'Books', value: 20 },
// ];

// const recentActivity = [
//   { id: 1, user: 'John Doe', action: 'Placed order #1234', time: '2 min ago', status: 'success' },
//   { id: 2, user: 'Jane Smith', action: 'Registered new account', time: '15 min ago', status: 'info' },
//   { id: 3, user: 'Mike Johnson', action: 'Updated profile', time: '1 hour ago', status: 'warning' },
//   { id: 4, user: 'Sarah Lee', action: 'Completed purchase #1235', time: '2 hours ago', status: 'success' },
// ];

// const stats = [
//   { title: 'Total Revenue', value: '$54,239', change: '+12.5%', icon: DollarSign, iconClass: 'iconRevenue' },
//   { title: 'Total Users', value: '1,429', change: '+8.2%', icon: Users, iconClass: 'iconUsers' },
//   { title: 'Total Invoices', value: '842', change: '+23.1%', icon: ShoppingCart, iconClass: 'iconOrders' },
//   { title: 'Growth Rate', value: '32.5%', change: '+4.3%', icon: TrendingUp, iconClass: 'iconGrowth' },
// ];

// const AdminDashboard = () => {
//   return (
//     <div className={styles.container}>
//       <div className={styles.wrapper}>
//         {/* Header */}
//         <header className={styles.header}>
//           <h1 className={styles.title}>Admin Dashboard</h1>
//           <p className={styles.subtitle}>Welcome back! Here's what's happening with your store today.</p>
//         </header>

//         {/* Stats */}
//         <div className={styles.statsGrid}>
//           {stats.map((stat, i) => (
//             <div key={i} className={styles.statCard}>
//               <div className={styles.statContent}>
//                 <h3>{stat.title}</h3>
//                 <p className={styles.statValue}>{stat.value}</p>
//                 <p className={styles.statChange}>
//                   <TrendingUp size={14} style={{ marginRight: '4px' }} />
//                   {stat.change} from last month
//                 </p>
//               </div>
//               <div className={`${styles.iconWrapper} ${styles[stat.iconClass]}`}>
//                 <stat.icon size={20} />
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Charts */}
//         <div className={styles.chartsGrid}>
//           <div className={styles.chartCard}>
//             <h3 className={styles.chartTitle}>Revenue Overview</h3>
//             <div className={styles.chartContainer}>
//               <ResponsiveContainer width="100%" height="100%">
//                 <LineChart data={revenueData}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                   <XAxis dataKey="month" tick={{ fill: '#6b7280' }} />
//                   <YAxis tick={{ fill: '#6b7280' }} />
//                   <Tooltip
//                     contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
//                   />
//                   <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981' }} />
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>
//           </div>

//           <div className={styles.chartCard}>
//             <h3 className={styles.chartTitle}>Sales by Items</h3>
//             <div className={styles.chartContainer}>
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart data={categoryData}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                   <XAxis dataKey="name" tick={{ fill: '#6b7280' }} angle={-45} textAnchor="end" height={80} />
//                   <YAxis tick={{ fill: '#6b7280' }} />
//                   <Tooltip />
//                   <Bar dataKey="value" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </div>
//         </div>

//         {/* Recent Activity */}
//         {/* <div className={styles.activityCard}>
//           <div className={styles.activityHeader}>
//             <h3 className={styles.activityTitle}>Recent Activity</h3>
//             <a href="#" className={styles.viewAll}>View all</a>
//           </div>
//           <div className={styles.activityList}>
//             {recentActivity.map((act) => (
//               <div key={act.id} className={styles.activityItem}>
//                 <div className={styles.activityInfo}>
//                   <div className={`${styles.activityIcon} ${styles[
//                     act.status === 'success' ? 'iconSuccess' :
//                     act.status === 'info' ? 'iconInfo' : 'iconWarning'
//                   ]}`}>
//                     {act.status === 'success' ? <CheckCircle size={16} /> :
//                      act.status === 'info' ? <Activity size={16} /> :
//                      <Clock size={16} />}
//                   </div>
//                   <div className={styles.activityText}>
//                     <h4>{act.user}</h4>
//                     <p>{act.action}</p>
//                   </div>
//                 </div>
//                 <span className={styles.activityTime}>{act.time}</span>
//               </div>
//             ))}
//           </div>
//         </div> */}
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;






// "use client";

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import config from "../../../config/apiconfig";
// import styles from "./AdminDashboard.module.css";

// import {
//   LineChart,
//   Line,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";

// import {
//   DollarSign,
//   Users,
//   ShoppingCart,
//   TrendingUp,
//   CheckCircle,
//   Activity,
//   Clock,
//   Loader2,
// } from "lucide-react";

// const AdminDashboard = () => {
//   // Auth & Company ID (same as all your other pages)
//   const userData = JSON.parse(localStorage.getItem("eBilling") ?? "{}");
//   const token = userData?.accessToken ?? "";
//   const companyId = userData?.selectedCompany?.id ?? "";

//   // State
//   const [dashboardData, setDashboardData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Fetch Dashboard Data
//   const fetchDashboard = async () => {
//     if (!token || !companyId) {
//       toast.error("Session expired or no company selected.");
//       setLoading(false);
//       return;
//     }

//     try {
//       setLoading(true);
//       const res = await axios.get(
//         `${config.BASE_URL}/company/${companyId}/dashboard`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       setDashboardData(res.data);
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to load dashboard");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDashboard();
//   }, [token, companyId]);

//   // Formatters
//   const formatCurrency = (value) =>
//     new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//       minimumFractionDigits: 2,
//     }).format(value);

//   const formatNumber = (value) =>
//     new Intl.NumberFormat("en-IN").format(value);

//   // Chart Data (from API)
//   const revenueData =
//     dashboardData?.monthlyRevenueSummary?.map((m) => ({
//       month: m.monthName.slice(0, 3), // Jan, Feb, etc.
//       revenue: m.totalRevenue,
//     })) || [];

//   const categoryData =
//     dashboardData?.itemSaleSummary?.map((i) => ({
//       name: i.itemName.length > 15 ? `${i.itemName.slice(0, 12)}…` : i.itemName,
//       value: i.totalSaleCount,
//     })) || [];

//   // Stats (dynamic from API)
//   const stats = [
//     {
//       title: "Total Revenue",
//       value: dashboardData ? formatCurrency(dashboardData.totalRevenue) : "—",
//       change: dashboardData ? `+${dashboardData.growthRate.toFixed(1)}%` : "—",
//       icon: DollarSign,
//       iconClass: "iconRevenue",
//     },
//     {
//       title: "Total Users",
//       value: "1,429", // Replace with real field if backend adds it
//       change: "+8.2%",
//       icon: Users,
//       iconClass: "iconUsers",
//     },
//     {
//       title: "Total Invoices",
//       value: dashboardData ? formatNumber(dashboardData.totalSaleOrder) : "—",
//       change: "+23.1%",
//       icon: ShoppingCart,
//       iconClass: "iconOrders",
//     },
//     {
//       title: "Growth Rate",
//       value: dashboardData ? `${dashboardData.growthRate.toFixed(1)}%` : "—",
//       change: "+4.3%",
//       icon: TrendingUp,
//       iconClass: "iconGrowth",
//     },
//   ];

//   // Recent Activity (kept exactly as in your original)
//   const recentActivity = [
//     { id: 1, user: "John Doe", action: "Placed order #1234", time: "2 min ago", status: "success" },
//     { id: 2, user: "Jane Smith", action: "Registered new account", time: "15 min ago", status: "info" },
//     { id: 3, user: "Mike Johnson", action: "Updated profile", time: "1 hour ago", status: "warning" },
//     { id: 4, user: "Sarah Lee", action: "Completed purchase #1235", time: "2 hours ago", status: "success" },
//   ];

//   // Loading UI
//   if (loading) {
//     return (
//       <div className={styles.container}>
//         <div className={styles.wrapper} style={{ textAlign: "center", padding: "4rem" }}>
//           <Loader2 size={48} className={styles.spinner} />
//           <p style={{ marginTop: "1rem", color: "#6b7280" }}>Loading dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   // Main Render (100% same as your original design)
//   return (
//     <div className={styles.container}>
//       <div className={styles.wrapper}>
//         {/* Header */}
//         <header className={styles.header}>
//           <h1 className={styles.title}>Admin Dashboard</h1>
//           <p className={styles.subtitle}>
//             Welcome back! Here's what's happening with your store today.
//           </p>
//         </header>

//         {/* Stats */}
//         <div className={styles.statsGrid}>
//           {stats.map((stat, i) => (
//             <div key={i} className={styles.statCard}>
//               <div className={styles.statContent}>
//                 <h3>{stat.title}</h3>
//                 <p className={styles.statValue}>{stat.value}</p>
//                 <p className={styles.statChange}>
//                   <TrendingUp size={14} style={{ marginRight: "4px" }} />
//                   {stat.change} from last month
//                 </p>
//               </div>
//               <div className={`${styles.iconWrapper} ${styles[stat.iconClass]}`}>
//                 <stat.icon size={20} />
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Charts */}
//         <div className={styles.chartsGrid}>
//           <div className={styles.chartCard}>
//             <h3 className={styles.chartTitle}>Revenue Overview</h3>
//             <div className={styles.chartContainer}>
//               <ResponsiveContainer width="100%" height="100%">
//                 <LineChart data={revenueData}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                   <XAxis dataKey="month" tick={{ fill: "#6b7280" }} />
//                   <YAxis tick={{ fill: "#6b7280" }} />
//                   <Tooltip
//                     contentStyle={{
//                       backgroundColor: "#fff",
//                       border: "1px solid #e5e7eb",
//                       borderRadius: "8px",
//                     }}
//                     formatter={(value) => formatCurrency(value)}
//                   />
//                   <Line
//                     type="monotone"
//                     dataKey="revenue"
//                     stroke="#10b981"
//                     strokeWidth={3}
//                     dot={{ fill: "#10b981" }}
//                   />
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>
//           </div>

//           <div className={styles.chartCard}>
//             <h3 className={styles.chartTitle}>Sales by Items</h3>
//             <div className={styles.chartContainer}>
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart data={categoryData}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                   <XAxis
//                     dataKey="name"
//                     tick={{ fill: "#6b7280" }}
//                     angle={-45}
//                     textAnchor="end"
//                     height={80}
//                   />
//                   <YAxis tick={{ fill: "#6b7280" }} />
//                   <Tooltip />
//                   <Bar dataKey="value" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </div>
//         </div>

//         {/* Recent Activity - Commented out exactly as in original */}
//         {/* <div className={styles.activityCard}>
//           <div className={styles.activityHeader}>
//             <h3 className={styles.activityTitle}>Recent Activity</h3>
//             <a href="#" className={styles.viewAll}>View all</a>
//           </div>
//           <div className={styles.activityList}>
//             {recentActivity.map((act) => (
//               <div key={act.id} className={styles.activityItem}>
//                 <div className={styles.activityInfo}>
//                   <div
//                     className={`${styles.activityIcon} ${
//                       act.status === "success"
//                         ? styles.iconSuccess
//                         : act.status === "info"
//                         ? styles.iconInfo
//                         : styles.iconWarning
//                     }`}
//                   >
//                     {act.status === "success" ? (
//                       <CheckCircle size={16} />
//                     ) : act.status === "info" ? (
//                       <Activity size={16} />
//                     ) : (
//                       <Clock size={16} />
//                     )}
//                   </div>
//                   <div className={styles.activityText}>
//                     <h4>{act.user}</h4>
//                     <p>{act.action}</p>
//                   </div>
//                 </div>
//                 <span className={styles.activityTime}>{act.time}</span>
//               </div>
//             ))}
//           </div>
//         </div> */}
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;








"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import config from "../../../config/apiconfig";
import styles from "./AdminDashboard.module.css";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  DollarSign,
  Users,
  ShoppingCart,
  TrendingUp,
  CheckCircle,
  Activity,
  Clock,
  Loader2,
} from "lucide-react";

const AdminDashboard = () => {
  const userData = JSON.parse(localStorage.getItem("eBilling") || "{}");
  const token = userData?.accessToken || "";
  const companyId = userData?.selectedCompany?.id || "";

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    if (!token || !companyId) {
      toast.error("Session expired or no company selected.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(
        `${config.BASE_URL}/company/${companyId}/dashboard`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setDashboardData(res.data);
      console.log("Dashboard Data:", res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load dashboard");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [token, companyId]);

  // Format currency for tooltips (keeps ₹)
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(value);
  };

  // Plain number with commas (no ₹) – for Total Revenue card
  const formatPlainNumber = (value) =>
    new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);

  // Prepare chart data
  const revenueData = dashboardData?.monthlyRevenueSummary?.map((item) => ({
    month: item.monthName.slice(0, 3),
    revenue: item.totalRevenue,
  })) || [];

  const categoryData = dashboardData?.itemSaleSummary?.map((item) => ({
    name: item.itemName.length > 12 ? item.itemName.slice(0, 10) + "…" : item.itemName,
    value: item.totalSaleCount,
  })) || [];

  // Stats with real API data
  const stats = [
    {
      title: "Total Revenue",
      value: dashboardData ? formatPlainNumber(dashboardData.totalRevenue) : "—", // No ₹
      change: dashboardData ? `+${dashboardData.growthRate.toFixed(1)}%` : "—",
      icon: DollarSign,
      iconClass: "iconRevenue",
    },
    {
      title: "Total Users",
      value: "1,429",
      change: "+8.2%",
      icon: Users,
      iconClass: "iconUsers",
    },
    {
      title: "Total Invoices",
      value: dashboardData ? dashboardData.totalSaleOrder.toLocaleString("en-IN") : "—",
      change: "+23.1%",
      icon: ShoppingCart,
      iconClass: "iconOrders",
    },
    {
      title: "Growth Rate",
      value: dashboardData ? `${dashboardData.growthRate.toFixed(1)}%` : "—",
      change: "+4.3%",
      icon: TrendingUp,
      iconClass: "iconGrowth",
    },
  ];

  // Sample recent activity
  const recentActivity = [
    { id: 1, user: "John Doe", action: "Placed order #1234", time: "2 min ago", status: "success" },
    { id: 2, user: "Jane Smith", action: "Registered new account", time: "15 min ago", status: "info" },
    { id: 3, user: "Mike Johnson", action: "Updated profile", time: "1 hour ago", status: "warning" },
    { id: 4, user: "Sarah Lee", action: "Completed purchase #1235", time: "2 hours ago", status: "success" },
  ];

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.wrapper} style={{ textAlign: "center", paddingTop: "100px" }}>
          <Loader2 size={48} className={styles.spinner} />
          <p style={{ marginTop: "16px", color: "#6b7280" }}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* Header */}
        <header className={styles.header}>
          <h1 className={styles.title}>Admin Dashboard</h1>
          <p className={styles.subtitle}>Welcome back! Here's what's happening with your store today.</p>
        </header>

        {/* Stats */}
        <div className={styles.statsGrid}>
          {stats.map((stat, i) => (
            <div key={i} className={styles.statCard}>
              <div className={styles.statContent}>
                <h3>{stat.title}</h3>
                <p className={styles.statValue}>{stat.value}</p>
                <p className={styles.statChange}>
                  <TrendingUp size={14} style={{ marginRight: "4px" }} />
                  {stat.change} from last month
                </p>
              </div>
              <div className={`${styles.iconWrapper} ${styles[stat.iconClass]}`}>
                <stat.icon size={20} />
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className={styles.chartsGrid}>
          <div className={styles.chartCard}>
            <h3 className={styles.chartTitle}>Revenue Overview</h3>
            <div className={styles.chartContainer}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fill: "#6b7280" }} />
                  <YAxis tick={{ fill: "#6b7280" }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px" }}
                    formatter={(value) => formatCurrency(value)}
                  />
                  <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} dot={{ fill: "#10b981" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className={styles.chartCard}>
            <h3 className={styles.chartTitle}>Sales by Items</h3>
            <div className={styles.chartContainer}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fill: "#6b7280" }} angle={-45} textAnchor="end" height={80} />
                  <YAxis tick={{ fill: "#6b7280" }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Activity - unchanged */}
        {/* <div className={styles.activityCard}> ... </div> */}
      </div>
    </div>
  );
};

export default AdminDashboard;