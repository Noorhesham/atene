import { Routes, Route, Outlet } from "react-router-dom";
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
import DashboardLayout from "./components/layouts/DashboardLayout";
import UsersManagement from "./pages/dashboard/users/UsersManagement";
import DashboardHome from "./components/(dashboard)/components/DashBoardHome";
import OrdersPage from "./components/(dashboard)/orders/OrdersPage";
import ProductCreationExample from "./components/productCreation/ProductCreationExample";

// Layout components using Outlet pattern
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

const DashboardProtectedLayout = () => (
  <ProtectedRoute>
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
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

        {/* Dashboard Routes */}
        <Route path="/dashboard" element={<DashboardProtectedLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="users" element={<User />} />
          <Route path="stores" element={<StoresManagement />} />
          <Route path="products" element={<ProductsManagement />} />
          <Route path="sections" element={<SectionsManagement />} />
          <Route path="reports" element={<ReportsManagement />} />
          <Route path="notifications" element={<NotificationsManagement />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </main>
  );
}

// Dashboard page components (you'll need to create these)

const User = () => (
  <div>
    <UsersManagement />
  </div>
);
const StoresManagement = () => <div>Stores Management</div>;
const ProductsManagement = () => <ProductCreationExample />;
const SectionsManagement = () => <div>Sections Management</div>;
const ReportsManagement = () => <div>Reports Management</div>;
const NotificationsManagement = () => <div>Notifications Management</div>;
const Settings = () => <div>Settings</div>;

export default App;
