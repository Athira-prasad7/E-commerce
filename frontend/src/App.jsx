import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductList from "../Pages/ProductList";
import ProductDetails from "../Pages/ProductDetails";
import Navbar from "../components/Navbar";
import CartPage from '/pages/CartPage';

function App() {
  return (
    <Router>
      <Nabvar/>
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/product/:id" element={<ProductDetails />} /> 
        <Route path="/cart" element={<CartPage/>}/>
      </Routes>
    </Router>
  );
}

export default App;
