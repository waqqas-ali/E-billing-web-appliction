// import {
//   BarChart2,
//   Receipt,
//   Building2,
//   CreditCard,
//   Folder,
//   Wallet,
//   Users2,
//   Shield,
//   MessagesSquare,
//   Video,
//   Settings,
//   HelpCircle,
//   Menu,
//   Home,
//   DollarSign,
//   ReceiptIndianRupee,
//   Package,
//   Repeat,
//   FileText,
//   LogOut,
//   ChevronDown,
//   ChevronUp,
// } from "lucide-react";
// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import styles from "./Sidebar.module.css";

// const Sidebar = () => {
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [isSalesOpen, setIsSalesOpen] = useState(false);
//   const navigate = useNavigate();

//   const handleNavigation = () => setIsMobileMenuOpen(false);

//   const NavItem = ({ to, icon: Icon, children, onClick }) => {
//     if (to) {
//       return (
//         <Link to={to} onClick={handleNavigation} className={styles.navItem}>
//           {Icon && <Icon className={styles.navIcon} />}
//           <span className={styles.navText}>{children}</span>
//         </Link>
//       );
//     }
//     return (
//       <button onClick={onClick} className={styles.navItem}>
//         {Icon && <Icon className={styles.navIcon} />}
//         <span className={styles.navText}>{children}</span>
//       </button>
//     );
//   };

//   const handleLogOut = () => {
//     if (!window.confirm("Are you sure you want to log out?")) return;
//     localStorage.removeItem("eBilling");
//     toast.info("You have been logged out.");
//     navigate("/login");
//   };

//   return (
//     <>
//       <button
//         className={styles.mobileMenuButton}
//         onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//       >
//         <Menu className={styles.menuIcon} />
//       </button>

//       <nav
//         className={`${styles.nav} ${isMobileMenuOpen ? styles.navOpen : ""}`}
//       >
//         <div className={styles.navContainer}>
//           <Link to="/" className={styles.logo}>
//             <div className={styles.logoContent}>
//               <span className={styles.logoText}>E-Billing</span>
//             </div>
//           </Link>

//           <div className={styles.menuContainer}>
//             <div className={styles.menuSections}>
//               <div className={styles.menuItems}>
//                 <NavItem to="/" icon={Home}>
//                   Dashboard
//                 </NavItem>
//                 <NavItem to="/parties" icon={Users2}>
//                   Parties
//                 </NavItem>
//                 <NavItem to="/items" icon={Package}>
//                   Items
//                 </NavItem>

//                 <div className={styles.submenuWrapper}>
//                   <button
//                     onClick={() => setIsSalesOpen(!isSalesOpen)}
//                     className={styles.navItem}
//                   >
//                     <DollarSign className={styles.navIcon} />
//                     <span className={styles.navText}>Sales</span>
//                     {isSalesOpen ? (
//                       <ChevronUp className={styles.chevron} />
//                     ) : (
//                       <ChevronDown className={styles.chevron} />
//                     )}
//                   </button>

//                   {isSalesOpen && (
//                     <div className={styles.submenu}>
//                       <NavItem to="/sales" icon={Receipt}>
//                         New Sale
//                       </NavItem>
//                       <NavItem to="/sales_history" icon={FileText}>
//                         Sales Order
//                       </NavItem>
//                       <NavItem to="/sales_returns" icon={Repeat}>
//                         Returns
//                       </NavItem>
//                     </div>
//                   )}
//                 </div>

//                 <NavItem to="/transaction" icon={ReceiptIndianRupee}>
//                   Transactions
//                 </NavItem>
//                 <NavItem to="/invoice" icon={Receipt}>
//                   Invoices
//                 </NavItem>
//                 <NavItem to="/report" icon={FileText}>
//                   Reports
//                 </NavItem>
//                 <NavItem to="/category" icon={Folder}>
//                   Category
//                 </NavItem>
//               </div>
//             </div>
//           </div>

//           <div className={styles.footer}>
//             <div className={styles.menuItems}>
//               <NavItem to="/company-list" icon={Building2}>
//                 Change Company
//               </NavItem>
//               <NavItem to="/settings" icon={Settings}>
//                 Settings
//               </NavItem>
//               <NavItem to="/" icon={HelpCircle}>
//                 Help
//               </NavItem>
//               <NavItem icon={LogOut} onClick={handleLogOut}>
//                 Logout
//               </NavItem>
//             </div>
//           </div>
//         </div>
//       </nav>

//       {isMobileMenuOpen && (
//         <div
//           className={styles.overlay}
//           onClick={() => setIsMobileMenuOpen(false)}
//         />
//       )}
//     </>
//   );
// };

// export default Sidebar;





// import {
//   BarChart2,
//   Receipt,
//   Building2,
//   CreditCard,
//   Folder,
//   Wallet,
//   Users2,
//   Shield,
//   MessagesSquare,
//   Video,
//   Settings,
//   HelpCircle,
//   Menu,
//   Home,
//   DollarSign,
//   ReceiptIndianRupee,
//   Package,
//   Repeat,
//   FileText,
//   LogOut,
//   ChevronDown,
//   ChevronUp,
//   // New icons for Purchase
//   ShoppingCart,
//   FileCheck,
//   ArrowLeftCircle,
// } from "lucide-react";
// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import styles from "./Sidebar.module.css";

// const Sidebar = () => {
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [isSalesOpen, setIsSalesOpen] = useState(false);
//   const [isPurchaseOpen, setIsPurchaseOpen] = useState(false); // New state
//   const navigate = useNavigate();

//   const handleNavigation = () => setIsMobileMenuOpen(false);

//   const NavItem = ({ to, icon: Icon, children, onClick }) => {
//     if (to) {
//       return (
//         <Link to={to} onClick={handleNavigation} className={styles.navItem}>
//           {Icon && <Icon className={styles.navIcon} />}
//           <span className={styles.navText}>{children}</span>
//         </Link>
//       );
//     }
//     return (
//       <button onClick={onClick} className={styles.navItem}>
//         {Icon && <Icon className={styles.navIcon} />}
//         <span className={styles.navText}>{children}</span>
//       </button>
//     );
//   };

//   const handleLogOut = () => {
//     if (!window.confirm("Are you sure you want to log out?")) return;
//     localStorage.removeItem("eBilling");
//     toast.info("You have been logged out.");
//     navigate("/login");
//   };

//   return (
//     <>
//       <button
//         className={styles.mobileMenuButton}
//         onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//       >
//         <Menu className={styles.menuIcon} />
//       </button>

//       <nav
//         className={`${styles.nav} ${isMobileMenuOpen ? styles.navOpen : ""}`}
//       >
//         <div className={styles.navContainer}>
//           <Link to="/" className={styles.logo}>
//             <div className={styles.logoContent}>
//               <span className={styles.logoText}>E-Billing</span>
//             </div>
//           </Link>

//           <div className={styles.menuContainer}>
//             <div className={styles.menuSections}>
//               <div className={styles.menuItems}>
//                 <NavItem to="/" icon={Home}>
//                   Dashboard
//                 </NavItem>
//                 <NavItem to="/parties" icon={Users2}>
//                   Parties
//                 </NavItem>
//                 <NavItem to="/items" icon={Package}>
//                   Items
//                 </NavItem>

//                 {/* Sales Dropdown */}
//                 <div className={styles.submenuWrapper}>
//                   <button
//                     onClick={() => setIsSalesOpen(!isSalesOpen)}
//                     className={styles.navItem}
//                   >
//                     <DollarSign className={styles.navIcon} />
//                     <span className={styles.navText}>Sales</span>
//                     {isSalesOpen ? (
//                       <ChevronUp className={styles.chevron} />
//                     ) : (
//                       <ChevronDown className={styles.chevron} />
//                     )}
//                   </button>

//                   {isSalesOpen && (
//                     <div className={styles.submenu}>
//                       <NavItem to="/sales" icon={Receipt}>
//                         New Sale
//                       </NavItem>
//                       <NavItem to="/sales_history" icon={FileText}>
//                         Sales Order
//                       </NavItem>
//                       <NavItem to="/sales_returns" icon={Repeat}>
//                         Returns
//                       </NavItem>
//                     </div>
//                   )}
//                 </div>

//                 {/* Purchase Dropdown - NEW */}
//                 <div className={styles.submenuWrapper}>
//                   <button
//                     onClick={() => setIsPurchaseOpen(!isPurchaseOpen)}
//                     className={styles.navItem}
//                   >
//                     <ShoppingCart className={styles.navIcon} />
//                     <span className={styles.navText}>Purchase</span>
//                     {isPurchaseOpen ? (
//                       <ChevronUp className={styles.chevron} />
//                     ) : (
//                       <ChevronDown className={styles.chevron} />
//                     )}
//                   </button>

//                   {isPurchaseOpen && (
//                     <div className={styles.submenu}>
//                       <NavItem to="/new_purchase" icon={Receipt}>
//                         New Purchase
//                       </NavItem>
//                       <NavItem to="/purchase_order" icon={FileCheck}>
//                         Purchase Order
//                       </NavItem>
//                       <NavItem to="/purchase_returns" icon={ArrowLeftCircle}>
//                         Purchase Return
//                       </NavItem>
//                     </div>
//                   )}
//                 </div>

//                 <NavItem to="/transaction" icon={ReceiptIndianRupee}>
//                   Transactions
//                 </NavItem>
//                 <NavItem to="/invoice" icon={Receipt}>
//                   Invoices
//                 </NavItem>
//                 <NavItem to="/report" icon={FileText}>
//                   Reports
//                 </NavItem>
//                 <NavItem to="/category" icon={Folder}>
//                   Category
//                 </NavItem>
//               </div>
//             </div>
//           </div>

//           <div className={styles.footer}>
//             <div className={styles.menuItems}>
//               <NavItem to="/company-list" icon={Building2}>
//                 Change Company
//               </NavItem>
//               <NavItem to="/settings" icon={Settings}>
//                 Settings
//               </NavItem>
//               <NavItem to="/" icon={HelpCircle}>
//                 Help
//               </NavItem>
//               <NavItem icon={LogOut} onClick={handleLogOut}>
//                 Logout
//               </NavItem>
//             </div>
//           </div>
//         </div>
//       </nav>

//       {isMobileMenuOpen && (
//         <div
//           className={styles.overlay}
//           onClick={() => setIsMobileMenuOpen(false)}
//         />
//       )}
//     </>
//   );
// };

// export default Sidebar;






import {
  Home,
  Users2,
  Package,
  DollarSign,
  ShoppingCart,
  Receipt,
  FileText,
  Repeat,
  FileCheck,
  ArrowLeftCircle,
  ReceiptIndianRupee,
  Folder,
  Building2,
  Settings,
  HelpCircle,
  LogOut,
  ChevronDown,
  ChevronUp,
  Menu,
  Truck,               // Delivery
  Wallet,              // Expense
  Tag,                 // Expense Category
  ArrowDownCircle,     // Payment In
  ArrowUpCircle,       // Payment Out
  ClipboardList,       // Quotation (valid icon)
} from "lucide-react";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styles from "./Sidebar.module.css";

const Sidebar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSalesOpen, setIsSalesOpen] = useState(false);
  const [isPurchaseOpen, setIsPurchaseOpen] = useState(false);
  const [isExpenseOpen, setIsExpenseOpen] = useState(false);
  const [isTransactionOpen, setIsTransactionOpen] = useState(false);

  const navigate = useNavigate();

  const handleNavigation = () => setIsMobileMenuOpen(false);

  const NavItem = ({ to, icon: Icon, children, onClick }) => {
    if (to) {
      return (
        <Link to={to} onClick={handleNavigation} className={styles.navItem}>
          {Icon && <Icon className={styles.navIcon} />}
          <span className={styles.navText}>{children}</span>
        </Link>
      );
    }
    return (
      <button onClick={onClick} className={styles.navItem}>
        {Icon && <Icon className={styles.navIcon} />}
        <span className={styles.navText}>{children}</span>
      </button>
    );
  };

  const handleLogOut = () => {
    if (!window.confirm("Are you sure you want to log out?")) return;
    localStorage.removeItem("eBilling");
    toast.info("You have been logged out.");
    navigate("/login");
  };

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button
        className={styles.mobileMenuButton}
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <Menu className={styles.menuIcon} />
      </button>

      {/* Sidebar */}
      <nav
        className={`${styles.nav} ${isMobileMenuOpen ? styles.navOpen : ""}`}
      >
        <div className={styles.navContainer}>
          {/* Logo */}
          <Link to="/" className={styles.logo}>
            <div className={styles.logoContent}>
              <span className={styles.logoText}>Techgicus E-Billing</span>
            </div>
          </Link>

          {/* Main Menu */}
          <div className={styles.menuContainer}>
            <div className={styles.menuSections}>
              <div className={styles.menuItems}>
                <NavItem to="/" icon={Home}>
                  Dashboard
                </NavItem>
                <NavItem to="/parties" icon={Users2}>
                  Parties
                </NavItem>
                <NavItem to="/items" icon={Package}>
                  Items
                </NavItem>

                {/* Sales Dropdown */}
                <div className={styles.submenuWrapper}>
                  <button
                    onClick={() => setIsSalesOpen(!isSalesOpen)}
                    className={styles.navItem}
                  >
                    <DollarSign className={styles.navIcon} />
                    <span className={styles.navText}>Sales</span>
                    {isSalesOpen ? (
                      <ChevronUp className={styles.chevron} />
                    ) : (
                      <ChevronDown className={styles.chevron} />
                    )}
                  </button>

                  {isSalesOpen && (
                    <div className={styles.submenu}>
                      <NavItem to="/sales" icon={Receipt}>
                        New Sale
                      </NavItem>
                      <NavItem to="/sales_history" icon={FileText}>
                        Sales Order
                      </NavItem>
                      <NavItem to="/sales_returns" icon={Repeat}>
                        Returns
                      </NavItem>
                    </div>
                  )}
                </div>

                {/* Purchase Dropdown */}
                <div className={styles.submenuWrapper}>
                  <button
                    onClick={() => setIsPurchaseOpen(!isPurchaseOpen)}
                    className={styles.navItem}
                  >
                    <ShoppingCart className={styles.navIcon} />
                    <span className={styles.navText}>Purchase</span>
                    {isPurchaseOpen ? (
                      <ChevronUp className={styles.chevron} />
                    ) : (
                      <ChevronDown className={styles.chevron} />
                    )}
                  </button>

                  {isPurchaseOpen && (
                    <div className={styles.submenu}>
                      <NavItem to="/new_purchase" icon={Receipt}>
                        New Purchase
                      </NavItem>
                      <NavItem to="/purchase_order" icon={FileCheck}>
                        Purchase Order
                      </NavItem>
                      <NavItem to="/purchase_returns" icon={ArrowLeftCircle}>
                        Purchase Return
                      </NavItem>
                    </div>
                  )}
                </div>

                {/* Delivery */}
                <NavItem to="/delivery" icon={Truck}>
                  Delivery
                </NavItem>

                {/* Expense Dropdown */}
                <div className={styles.submenuWrapper}>
                  <button
                    onClick={() => setIsExpenseOpen(!isExpenseOpen)}
                    className={styles.navItem}
                  >
                    <Wallet className={styles.navIcon} />
                    <span className={styles.navText}>Expense</span>
                    {isExpenseOpen ? (
                      <ChevronUp className={styles.chevron} />
                    ) : (
                      <ChevronDown className={styles.chevron} />
                    )}
                  </button>

                  {isExpenseOpen && (
                    <div className={styles.submenu}>
                      <NavItem to="/expense" icon={FileText}>
                        Expense
                      </NavItem>
                      <NavItem to="/expense_item" icon={FileText}>
                        Expense Item
                      </NavItem>
                      <NavItem to="/expense_category" icon={Tag}>
                        Expense Category
                      </NavItem>
                    </div>
                  )}
                </div>

                {/* Transaction Dropdown */}
                <div className={styles.submenuWrapper}>
                  <button
                    onClick={() => setIsTransactionOpen(!isTransactionOpen)}
                    className={styles.navItem}
                  >
                    <ReceiptIndianRupee className={styles.navIcon} />
                    <span className={styles.navText}>Transaction</span>
                    {isTransactionOpen ? (
                      <ChevronUp className={styles.chevron} />
                    ) : (
                      <ChevronDown className={styles.chevron} />
                    )}
                  </button>

                  {isTransactionOpen && (
                    <div className={styles.submenu}>
                      <NavItem to="/payment_in" icon={ArrowDownCircle}>
                        Payment In
                      </NavItem>
                      <NavItem to="/payment_out" icon={ArrowUpCircle}>
                        Payment Out
                      </NavItem>
                      {/* <NavItem to="/quotation" icon={ClipboardList}>
                        Quotation
                      </NavItem> */}
                    </div>

                  )}
                </div>
                <NavItem to="/quotation" icon={ClipboardList}>
                  Quotation
                </NavItem>
                {/* Other Items */}
                {/* <NavItem to="/invoice" icon={Receipt}>
                  Invoices
                </NavItem>
                <NavItem to="/report" icon={FileText}>
                  Reports
                </NavItem> */}
                <NavItem to="/category" icon={Folder}>
                  Category
                </NavItem>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className={styles.footer}>
            <div className={styles.menuItems}>
              <NavItem to="/company-list" icon={Building2}>
                Change Company
              </NavItem>
              <NavItem to="/settings" icon={Settings}>
                Settings
              </NavItem>
              <NavItem to="/" icon={HelpCircle}>
                Help
              </NavItem>
              <NavItem icon={LogOut} onClick={handleLogOut}>
                Logout
              </NavItem>
            </div>
          </div>
        </div>
      </nav>

      {/* Overlay for Mobile */}
      {isMobileMenuOpen && (
        <div
          className={styles.overlay}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
