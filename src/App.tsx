import { Routes, Route } from "react-router-dom";
import ProductPage from "./pages/productPage/ProductPage";
import NavbarWithState from "./components/NavBar";
import Footer from "./components/Footer";

function App() {
  return (
    <main className=" font-oxygen  ">
      <NavbarWithState />
      <Routes>
        <Route path="/" element={<ProductPage />} />
        <Route path="/products/:id" element={<ProductPage />} />
      </Routes>
      <Footer />
    </main>
  );
}

export default App;
