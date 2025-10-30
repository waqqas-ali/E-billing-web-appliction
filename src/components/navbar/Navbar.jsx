// import React, { useState } from 'react';
// import { Bell, User } from "lucide-react";
// import { LogOut, MoveUpRight, Settings, CreditCard, FileText } from "lucide-react";
// import { Link } from "react-router-dom"; 
// import styles from "./Navbar.module.css";

// const Navbar = () => {
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);

//   const user = {
//     name: "Eugene An",
//     role: "Prompt Engineer",
//     avatar: "https://via.placeholder.com/40",
//   };

//   return (
//     <header className={styles.navbar}>
//       <div className={styles.leftSection}>
//         <input type="text" placeholder="Search..." className={styles.search} />
//       </div>
//       <div className={styles.rightSection}>
//         <Bell className={styles.icon} />
//         <div className={styles.userDropdown}>
//           <button
//             onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//             className={styles.userButton}
//           >
//             <User className={styles.icon} />
//           </button>
//           {isDropdownOpen && (
//             <div className={styles.dropdownMenu}>
//               <div className={styles.userInfo}>
//                 <img src={user.avatar} alt="User avatar" className={styles.avatar} />
//                 <div>
//                   <div className={styles.userName}>{user.name}</div>
//                   <div className={styles.userRole}>{user.role}</div>
//                 </div>
//               </div>
//               <Link to="/" className={styles.dropdownItem} onClick={() => setIsDropdownOpen(false)}>
//                 <span className={styles.dropdownIcon}><CreditCard className={styles.dropdownIcon} /></span> Subscription
//               </Link>
//               <Link to="/" className={styles.dropdownItem} onClick={() => setIsDropdownOpen(false)}>
//                 <span className={styles.dropdownIcon}><MoveUpRight className={styles.dropdownIcon} /></span> Free Trial
//               </Link>
//               <Link to="/settings" className={styles.dropdownItem} onClick={() => setIsDropdownOpen(false)}>
//                 <span className={styles.dropdownIcon}><Settings className={styles.dropdownIcon} /></span> Settings
//               </Link>
//               <Link to="/" className={styles.dropdownItem} onClick={() => setIsDropdownOpen(false)}>
//                 <span className={styles.dropdownIcon}><FileText className={styles.dropdownIcon} /></span> Terms & Policies
//               </Link>
//               <Link to="/login" className={styles.dropdownItem} onClick={() => setIsDropdownOpen(false)}>
//                 <span className={styles.dropdownIcon}><LogOut className={styles.dropdownIcon} /></span> Logout
//               </Link>
//             </div>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Navbar;








// src/components/Navbar.jsx
import React, { useState, useRef, useEffect } from "react";
import { Bell, User, LogOut, Settings, CreditCard, FileText, MoveUpRight, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  const user = {
    name: "Eugene An",
    role: "Prompt Engineer",
    avatar: "https://via.placeholder.com/40",
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close search on Escape
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setSearchOpen(false);
    };
    if (searchOpen) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [searchOpen]);

  const handleLogout = () => {
    if (!window.confirm("Are you sure you want to log out?")) return;
    localStorage.removeItem("eBilling");
    toast.info("Logged out successfully");
    navigate("/login");
    setIsOpen(false);
  };

  return (
    <header className={styles.navbar}>
      {/* Left: Search */}
      <div className={styles.left}>
        <div className={`${styles.searchWrapper} ${searchOpen ? styles.searchOpen : ""}`}>
          <Search className={styles.searchIcon} />
          <input
            ref={searchRef}
            type="text"
            placeholder="Search..."
            className={styles.searchInput}
            onFocus={() => setSearchOpen(true)}
            onBlur={() => setSearchOpen(false)}
          />
        </div>
      </div>

      {/* Right: Icons + User */}
      <div className={styles.right}>
        <button className={styles.iconBtn} aria-label="Notifications">
          <Bell className={styles.icon} />
        </button>

        <div className={styles.dropdown} ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={styles.userBtn}
            aria-label="User menu"
          >
            <User className={styles.icon} />
          </button>

          {isOpen && (
            <div className={styles.menu}>
              {/* User Info */}
              <div className={styles.userInfo}>
                <img src={user.avatar} alt={user.name} className={styles.avatar} />
                <div>
                  <div className={styles.userName}>{user.name}</div>
                  <div className={styles.userRole}>{user.role}</div>
                </div>
              </div>

              {/* Menu Items */}
              <Link to="/subscription" className={styles.item} onClick={() => setIsOpen(false)}>
                <CreditCard className={styles.itemIcon} />
                Subscription
              </Link>
              <Link to="/trial" className={styles.item} onClick={() => setIsOpen(false)}>
                <MoveUpRight className={styles.itemIcon} />
                Free Trial
              </Link>
              <Link to="/settings" className={styles.item} onClick={() => setIsOpen(false)}>
                <Settings className={styles.itemIcon} />
                Settings
              </Link>
              <Link to="/terms" className={styles.item} onClick={() => setIsOpen(false)}>
                <FileText className={styles.itemIcon} />
                Terms & Policies
              </Link>
              <button onClick={handleLogout} className={`${styles.item} ${styles.logout}`}>
                <LogOut className={styles.itemIcon} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;