import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import ProductPage from "./pages/productPage/ProductPage";
import NavbarWithState from "./components/NavBar";
import Footer from "./components/Footer";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/signup";
import Report from "./pages/report/Report";
import Favourites from "./pages/favourites/Favourites";
import MessagePage from "./pages/messages/MessagePage";
import StorePage from "./pages/store/StorePage";
import SingleProduct from "./pages/singleProduct/Product";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import HomePage from "./pages/home/HomePage";
import DashboardShell from "./components/layouts/DashboardLayout";

import DashboardHome from "./components/(dashboard)/components/DashBoardHome";
import OrdersPage from "./components/(dashboard)/orders/OrdersPage";
import ProductCreationExample from "./components/productCreation/ProductCreationExample";
import CouponsPage from "./components/(dashboard)/coupons/CouponsPage";
import StoreCreationForm from "./components/(dashboard)/Store/StoreCreation";
import { useAuth } from "./context/AuthContext";
import UsersPage from "./pages/admin/UsersPage";
import { User } from "./types/auth";
import RolesAndPermissionsPage from "./pages/admin/roles/RolesPage";
import UserCreation from "./pages/admin/users/add/UserCreation";
import StoreManagementPage from "./pages/admin/store/StoreManagment";
import StoreCratePage from "./pages/admin/store/add/StoreCratePage";
import CategoriesPage from "./pages/admin/categories/CategoriesPage";
import ProductsPageDashboard from "./pages/admin/products/ProductsPageDashboard";
import CategoryCreatePage from "./pages/admin/categories/add/CategoryCreatPage";
import AttributesPage from "./pages/admin/attributes/AttributesPage";
import AttributeCreatPage from "./pages/admin/attributes/add/AttributeCreatPage";
  
// Admin Layout Component
const AdminLayout = () => {
  const { user, isLoading } = useAuth() as { user: User | null; isLoading: boolean };

  if (isLoading) {
    return <div>Loading, please wait...</div>;
  }

  const isSuperAdmin = user?.user?.user_type === "admin";

  if (isSuperAdmin) {
    return <Outlet />;
  }

  return <Navigate to="/dashboard" replace />;
};

const DashboardLayout = () => {
  const { user, isLoading } = useAuth() as { user: User | null; isLoading: boolean };

  if (isLoading) {
    return <div>Loading, please wait...</div>;
  }

  if (user) {
    const isSuperAdmin = user.user.roles.some((role) => role.name === "superadmin");
    if (isSuperAdmin) {
      return <Navigate to="/admin" replace />;
    }
    return <Outlet />;
  }

  // If no user, redirect to login
  return <Navigate to="/login" replace />;
};

const PublicLayout = () => (
  <>
    <NavbarWithState />
    <Outlet />
    <Footer />
  </>
);

const ProtectedLayout = () => (
  <ProtectedRoute>
    <PublicLayout />
  </ProtectedRoute>
);

const AdminProtectedLayout = () => (
  <ProtectedRoute>
    <DashboardShell>
      <AdminLayout />
    </DashboardShell>
  </ProtectedRoute>
);

const RegularDashboardLayout = () => (
  <ProtectedRoute>
    <DashboardShell>
      <DashboardLayout />
    </DashboardShell>
  </ProtectedRoute>
);

function App() {
  return (
    <main className="font-oxygen">
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="products" element={<ProductPage />} />
          <Route path="products/:slug" element={<SingleProduct />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="store/:id" element={<StorePage />} />
        </Route>

        {/* Protected Routes */}
        <Route path="/" element={<ProtectedLayout />}>
          <Route path="favourites" element={<Favourites />} />
          <Route path="chat" element={<MessagePage />} />
          <Route path="report" element={<Report />} />
        </Route>

        {/* Regular Dashboard Routes */}
        <Route path="/dashboard" element={<RegularDashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="products" element={<ProductsManagement />} />
          <Route path="stores" element={<StoresManagement />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminProtectedLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="categories">
            <Route index element={<CategoriesPage />} />
            <Route path="add" element={<CategoryCreatePage />} />
            <Route path="edit/:id" element={<CategoryCreatePage />} />
          </Route>

          {/* Admin Protected Routes */}
          <Route path="users" element={<AdminLayout />}>
            <Route index element={<UsersPage />} />
            <Route path="roles" element={<RolesAndPermissionsPage />} />
            <Route path="add" element={<UserCreation />} />
          </Route>

          <Route path="stores">
            <Route index element={<StoreManagementPage />} />
            <Route path="add" element={<StoreCratePage />} />
            <Route path="add/:id" element={<StoreCratePage />} />
          </Route>
          <Route path="coupons" element={<CouponsManagement />} />
          <Route path="products">
            <Route index element={<ProductsPageDashboard />} />
            <Route path="add" element={<ProductCreationExample />} />
            <Route path="add/:id" element={<ProductCreationExample />} />
          </Route>
          <Route path="sections" element={<SectionsManagement />} />
          <Route path="reports" element={<ReportsManagement />} />
          <Route path="notifications" element={<NotificationsManagement />} />
          <Route path="settings" element={<Settings />} />
          <Route path="attributes">
            <Route index element={<AttributesPage />} />
            <Route path="add" element={<AttributeCreatPage />} />
            <Route path="edit/:id" element={<AttributeCreatPage />} />
          </Route>
        </Route>
      </Routes>
    </main>
  );
}

// Placeholder components
const StoresManagement = () => <StoreCreationForm />;
const CouponsManagement = () => <CouponsPage />;
const ProductsManagement = () => <ProductCreationExample />;
const SectionsManagement = () => <div className="p-4">Sections Management Page</div>;
const ReportsManagement = () => <div className="p-4">Reports Management Page</div>;
const NotificationsManagement = () => <div className="p-4">Notifications Management Page</div>;
const Settings = () => <div className="p-4">Settings Page</div>;

export default App;
