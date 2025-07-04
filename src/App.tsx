import { Routes, Route } from "react-router-dom";
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

function App() {
  return (
    <main className="  font-oxygen  ">
      <Toaster position="top-center" reverseOrder={false} />
      <NavbarWithState />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/products/:slug" element={<SingleProduct />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/report" element={<Report />} />
        <Route
          path="/favourites"
          element={
            <ProtectedRoute>
              <Favourites />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <MessagePage />
            </ProtectedRoute>
          }
        />
        <Route path="/store/:id" element={<StorePage />} />
      </Routes>
      <Footer />
    </main>
  );
}

export default App;
