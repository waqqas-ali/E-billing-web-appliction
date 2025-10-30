import React, { useState } from "react";
import { Outlet } from "react-router-dom";

import styles from "./AdminLayout.module.css";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div className={styles.mainSection}>
        {/* Navbar */}
        <div className={styles.navbarWrapper}>
          <Navbar />
        </div>

        <div className={styles.content}>
          {/* Main-Content */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
