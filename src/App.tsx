import { Routes, Route } from "react-router-dom";
import ProductPage from "./pages/productPage/ProductPage";
import NavbarWithState from "./components/NavBar";

function App() {
  return (
    <main className=" font-oxygen  ">
      <NavbarWithState />
      <Routes>
        <Route path="/" element={<ProductPage />} />
        <Route path="/products/:id" element={<ProductPage />} />
      </Routes>
    </main>
  );
}

export default App;
