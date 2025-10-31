import React from 'react';
import styles from './AdminDashboard.module.css';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, Users, ShoppingCart, TrendingUp, CheckCircle, Activity, Clock } from 'lucide-react';

// Sample Data
const revenueData = [
  { month: 'Jan', revenue: 4000 },
  { month: 'Feb', revenue: 3000 },
  { month: 'Mar', revenue: 5000 },
  { month: 'Apr', revenue: 4500 },
  { month: 'May', revenue: 6000 },
  { month: 'Jun', revenue: 5500 },
];

const categoryData = [
  { name: 'Electronics', value: 35 },
  { name: 'Clothing', value: 25 },
  { name: 'Food', value: 20 },
  { name: 'Books', value: 20 },
];

const recentActivity = [
  { id: 1, user: 'John Doe', action: 'Placed order #1234', time: '2 min ago', status: 'success' },
  { id: 2, user: 'Jane Smith', action: 'Registered new account', time: '15 min ago', status: 'info' },
  { id: 3, user: 'Mike Johnson', action: 'Updated profile', time: '1 hour ago', status: 'warning' },
  { id: 4, user: 'Sarah Lee', action: 'Completed purchase #1235', time: '2 hours ago', status: 'success' },
];

const stats = [
  { title: 'Total Revenue', value: '$54,239', change: '+12.5%', icon: DollarSign, iconClass: 'iconRevenue' },
  { title: 'Total Users', value: '1,429', change: '+8.2%', icon: Users, iconClass: 'iconUsers' },
  { title: 'Total Invoices', value: '842', change: '+23.1%', icon: ShoppingCart, iconClass: 'iconOrders' },
  { title: 'Growth Rate', value: '32.5%', change: '+4.3%', icon: TrendingUp, iconClass: 'iconGrowth' },
];

const AdminDashboard = () => {
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
                  <TrendingUp size={14} style={{ marginRight: '4px' }} />
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
                  <XAxis dataKey="month" tick={{ fill: '#6b7280' }} />
                  <YAxis tick={{ fill: '#6b7280' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  />
                  <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className={styles.chartCard}>
            <h3 className={styles.chartTitle}>Sales by Category</h3>
            <div className={styles.chartContainer}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fill: '#6b7280' }} angle={-45} textAnchor="end" height={80} />
                  <YAxis tick={{ fill: '#6b7280' }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className={styles.activityCard}>
          <div className={styles.activityHeader}>
            <h3 className={styles.activityTitle}>Recent Activity</h3>
            <a href="#" className={styles.viewAll}>View all</a>
          </div>
          <div className={styles.activityList}>
            {recentActivity.map((act) => (
              <div key={act.id} className={styles.activityItem}>
                <div className={styles.activityInfo}>
                  <div className={`${styles.activityIcon} ${styles[
                    act.status === 'success' ? 'iconSuccess' :
                    act.status === 'info' ? 'iconInfo' : 'iconWarning'
                  ]}`}>
                    {act.status === 'success' ? <CheckCircle size={16} /> :
                     act.status === 'info' ? <Activity size={16} /> :
                     <Clock size={16} />}
                  </div>
                  <div className={styles.activityText}>
                    <h4>{act.user}</h4>
                    <p>{act.action}</p>
                  </div>
                </div>
                <span className={styles.activityTime}>{act.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;