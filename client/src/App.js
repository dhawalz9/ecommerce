import {Routes, Route} from "react-router-dom"
import HomePage from "./pages/Home.js";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Pagenotfound from "./pages/Pagenotfound";
import Policy from "./pages/Policy";
import Register from "./pages/Auth/Register.js";
import Login from "./pages/Auth/Login.js";
import Dashboard from "./pages/user/Dashboard.js";
import PrivateRoute from "./components/Routes/Private.js";
import ForgotPassword from "./pages/Auth/ForgotPassword.js";
import AdminRoute from "./components/Routes/AdminRoute.js";
import AdminDashboard from "./pages/admin/AdminDashboard.js";
import Users from "./pages/admin/Users.js";
import CreateProduct from "./pages/admin/CreateProduct.js";
import CreateCategory from "./pages/admin/CreateCategory.js";
import Orders from "./pages/user/Orders.js";
import Profile from "./pages/user/Profile.js";
import UpdateProduct from "./pages/admin/UpdateProduct.js";
import Products from "./pages/admin/Products.js";
import Search from "./pages/Search.js";
import ProductDetails from "./pages/ProductDetails.js";
import CategoryProduct from "./pages/CategoryProduct.js";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/product/:slug" element={<ProductDetails/>}/>
        <Route path="/category/:slug" element={<CategoryProduct/>}/>
        <Route path="/search" element={<Search/>}/>
        <Route path="/dashboard" element={<PrivateRoute/>}>
          <Route path="user" element={<Dashboard/>}/>
          <Route path="user/orders" element={<Orders/>}/>
          <Route path="user/profile" element={<Profile/>}/>
        </Route>
        <Route path="/dashboard" element={<AdminRoute/>}>
          <Route path="admin" element={<AdminDashboard/>}/>
          <Route path="admin/create-category" element={<CreateCategory/>}/>
          <Route path="admin/create-product" element={<CreateProduct/>}/>
          <Route path="admin/product/:slug" element={<UpdateProduct/>}/>
          <Route path="admin/products" element={<Products/>}/>
          <Route path="admin/users" element={<Users/>}/>
        </Route>
        <Route path="/register" element={<Register/>}/>
        <Route path="/forgot-password" element={<ForgotPassword/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/contact" element={<Contact/>}/>
        <Route path="/policy" element={<Policy/>}/>
        <Route path="*" element={<Pagenotfound/>}/>
      </Routes>
    </>
  );
}

export default App;