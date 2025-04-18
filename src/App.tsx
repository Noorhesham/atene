import { Routes, Route } from "react-router-dom";
import ProductPage from "./pages/productPage/ProductPage";
import NavbarWithState from "./components/NavBar";
import Footer from "./components/Footer";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/signup";
import Report from "./pages/report/Report";
import Favourites from "./pages/favourites/Favourites";

function App() {
  return (
    <main className=" bg-gray-50 font-oxygen  ">
      <NavbarWithState />
      <Routes>
        <Route path="/" element={<ProductPage />} />
        <Route path="/products/:id" element={<ProductPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/report" element={<Report />} />
        <Route path="/favourites" element={<Favourites />} />
      </Routes>
      <Footer />
    </main>
  );
}

export default App;
