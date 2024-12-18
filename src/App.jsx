import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { CartProvider } from "./components/CartContext";
import Home from "./components/Home/Home";
import Login from "./components/Login/Login";
import Cart from "./components/Cart/Cart";
import Checkout from "./components/CheckOut/Checkout";
import OrderHistory from "./components/Orderhistory/OrderHistory";
import ProductDetails from "./components/ProductDetails/ProductDetails.jsx";
import Success from "./components/Success/Success.jsx";
import Accounts from "./components/Accounts/Accounts.jsx";
import Password from "./components/PasswordChange/Password.jsx";
import ChangeEmail from "./components/EmailChange/ChangeEmail.jsx";
import Delivery from "./components/Delivery/Delivery.jsx";
import FrontPage from "./components/FrontPage/FrontPage.jsx";
import Nav from "./components/Nav/Nav.jsx";
import Craft from "./components/craft/Craft.jsx";
import Gift from "./components/GiftProduct/Gift.jsx";
import Organic from "./components/Organicproduct/Organic.jsx";
import Bedproduct from "./components/Bedsheet/Bedproduct.jsx";
import Footer from "./components/Footer/Footer.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AnimatePresence } from "framer-motion";

function App() {
    return (
        <CartProvider>
        <ToastContainer
    position="top-right"
    autoClose={5000} // Adjust duration as needed
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
/>

            <Router>
                <Nav />
                <Main />
                <Footer />
            </Router>
        </CartProvider>
    );
}

function Main() {
    const location = useLocation();

    // Trigger a toast when the location changes
    useEffect(() => {
        // toast.info(`Navigated to ${location.pathname}`);
    }, [location]);

    return (
        <AnimatePresence mode="wait">
            <Routes>
                <Route path="/" element={<FrontPage />} />
                <Route path="/products" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/craft" element={<Craft />} />
                <Route path="/Gift-products" element={<Gift />} />
                <Route path="/Organic-products" element={<Organic />} />
                <Route path="/Bedsheet-products" element={<Bedproduct />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/success" element={<Success />} />
                <Route path="/order-history" element={<OrderHistory />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/Youraccounts" element={<Accounts />} />
                <Route path="/YourAddress" element={<Delivery />} />
                <Route path="/change-password" element={<Password />} />
                <Route path="/change-email" element={<ChangeEmail />} />
            </Routes>
        </AnimatePresence>
    );
}

export default App;
