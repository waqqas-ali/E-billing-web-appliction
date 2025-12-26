import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";

import AdminLayout from "./layouts/adminlayout/AdminLayout";
import AdminDashboard from "./pages/admin/dashboard/AdminDashboard";
import Login from "./pages/auth/login/Login";
// import Register from "./pages/auth/register/Register";
import Parties from "./pages/admin/parties/Parties";
import Add_Parties from "./pages/admin/parties/Add_Parties";
import Sales from "./pages/admin/sales/Sales";
import SalesHistory from "./pages/admin/sales/SalesHistory";
import SalesReturns from "./pages/admin/sales/SalesReturns";
import CreateReturns from "./pages/admin/sales/CreateReturns";
import CreateSaleOrder from "./pages/admin/sales/CreateSaleOrder";
import CreateSale from "./pages/admin/sales/CreateSale";
import Createpurchase from "./pages/admin/Purchase/Createpurchase";
import New_purchase from "./pages/admin/Purchase/New_purchase";
import Purchase_order from "./pages/admin/Purchase/Purchase_order";
import Create_purchase_order from "./pages/admin/Purchase/Create_purchase_order";
import Purchase_return from "./pages/admin/Purchase/Purchase_return";
import Create_purchase_return from "./pages/admin/Purchase/Create_purchase_return";
import Delivery from "./pages/admin/delivery/Delivery";
import Create_delivery from "./pages/admin/delivery/Create_delivery";
import Expense from "./pages/admin/expense/Expense";
import Create_expense from "./pages/admin/expense/Create_expense";
import Expense_Category from "./pages/admin/expense/Expense_Category";
import Expense_item from "./pages/admin/expense/Expense_item";
import Payment_in from "./pages/admin/transaction/Payment_in";
import Create_payment_in from "./pages/admin/transaction/Create_payment_in";
import Payment_out from "./pages/admin/transaction/Payment_out";
import Create_payment_out from "./pages/admin/transaction/Create_payment_out";
import Items from "./pages/admin/items/Items";
import Add_Items from "./pages/admin/items/Add_Items";
// import Transaction from "./pages/admin/transaction/Transaction";
import Quotation from "./pages/admin/quotation/Quotation";
import Create_quotation from "./pages/admin/quotation/Create_quotation";
import Invoice from "./pages/admin/invoice/Invoice";
import Reports from "./pages/admin/reports/Reports";
import Settings from "./pages/admin/settings/Settings";
import SuperAdminLayout from "./layouts/superadminLayout/SuperAdminLayout";
import SuperAdminDashboard from "./pages/superadmin/dashboard/SuperAdminDashboard";
import CompanyList from "./pages/admin/company-list/CompanyList";
import CreateCompany from "./pages/admin/create-company/CreateCompany";
import Manage from "./pages/superadmin/manage/Manage";
import SubscriptionPlans from "./pages/admin/subscription-plans/SubscriptionPlans";
import Protected from "./Protected/Protected";
import Category from "./pages/admin/category/Category";

import Parties_Report from "./pages/admin/reports/Parties Report/Parties_Report";
import Profit_Loss_Report from "./pages/admin/reports/Profit Loss Report/ Profit_Loss_Report";
import Bill_Profit_Loss_Report from "./pages/admin/reports/Profit Loss Report/Bill_Profit_Loss_Report";
import Purchase_Report from "./pages/admin/reports/Purchase Report/Purchase_Report";
import Sale_Report from "./pages/admin/reports/Sale Report/ Sale";
import Statement_List from "./pages/admin/reports/Statement List/Statement_List";
import Register from "./pages/auth/register/Register";
import ForgotPassword from "./pages/auth/forgot-password/ForgotPassword";
const App = () => {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        {/* ================= Public Routes ================= */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/subscription-plans" element={<SubscriptionPlans />} />
        <Route path="/company-list" element={<CompanyList />} />
        <Route path="/create-company" element={<CreateCompany />} />

        {/* ================= Protected Routes ================= */}
        <Route element={<Protected />}>
          {/* ---------- Admin Routes ---------- */}
          <Route path="/" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />{" "}
            {/* default dashboard */}
            <Route path="parties" element={<Parties />} />
            <Route path="Add-parties" element={<Add_Parties />} />

            <Route path="sales" element={<Sales />} />
            <Route path="sales_history" element={< SalesHistory/>} />
            <Route path="sales_returns" element={<SalesReturns />} />
            <Route path="create-sale-order" element={<CreateSaleOrder />} />
            <Route path="createsale" element={<CreateSale />} />
            <Route path="create-returns" element={<CreateReturns />} />

            <Route path="new_purchase" element={<New_purchase />} />  
            <Route path="createpurchase" element={<Createpurchase />} />
            <Route path="purchase_order" element={<Purchase_order />} />
            <Route path="create_purchase_order" element={<Create_purchase_order />} />
            <Route path="purchase_returns" element={<Purchase_return />} />
            <Route path="create_purchase_return" element={<Create_purchase_return />} />

            <Route path="delivery" element={<Delivery />} />
            <Route path="create_delivery" element={<Create_delivery />} />

            <Route path="expense" element={<Expense />} />
            <Route path="create_expense" element={<Create_expense />} />
            <Route path="expense_category" element={<Expense_Category />} />
            <Route path="expense_item" element={<Expense_item />} />

            <Route path="payment_in" element={<Payment_in />} />
            <Route path="create_payment_in" element={<Create_payment_in />} />
            <Route path="payment_out" element={<Payment_out />} />
            <Route path="create_payment_out" element={<Create_payment_out />} />

            <Route path="items" element={<Items />} />
            <Route path="Add_items" element={<Add_Items />} />

            <Route path="quotation" element={<Quotation />} />
            <Route path="create_quotation" element={<Create_quotation />} />

            {/* <Route path="transaction" element={<Transaction />} /> */}
            <Route path="invoice" element={<Invoice />} />
            <Route path="report" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
            <Route path="category" element={<Category />} />

            <Route path="parties_report" element={<Parties_Report />} />
            <Route path="profit_loss_report" element={<Profit_Loss_Report />} />
            <Route path="bill_profit_loss_report" element={<Bill_Profit_Loss_Report />} />
            <Route path="purchase_report" element={<Purchase_Report />} />
            <Route path="sale_report" element={<Sale_Report />} />
            <Route path="statement_list" element={<Statement_List />} />
          </Route>

          <Route path="/super-admin" element={<SuperAdminLayout />}>
            <Route index element={<SuperAdminDashboard />} />{" "}
            {/* default dashboard */}
            <Route path="manage" element={<Manage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
