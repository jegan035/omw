import React, { useState, useContext } from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import HomeScreen from "./pages/homePage";
import ProductScreen from "./pages/productPage";
import CartScreen from "./pages/cartPage";
import ShippingAddressScreen from "./pages/ShippingAddressScreen";
import PaymentMethodPage from "./pages/PaymentMethodPage";
import SigninScreen from "./pages/signinPage";
import PlaceOrder from "./pages/PlaceOrder";
import OrderReceived from "./pages/orderReceived";
import SignupScreen from "./pages/signupPage";
import OrderScreen from './pages/orderPage';
import OrderHistoryScreen from './pages/orderhistoryPage';
import { Store } from "./store";

function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleDropdownClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const dropdownItems = [
    { label: "User Profile", path: "/profile" },
    { label: "Order History", path: "/orderhistory" },
  ];

  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
  };

  return (
    <BrowserRouter>
      <div>
        <ToastContainer position="bottom-center" limit={1} />
        <header>
          <Link to='/' style={{ textDecoration: 'none', color: 'black' }}>
            <h1>Hoot</h1>
          </Link>
          <img src="/images/hoot.png" alt="refresh" className="hoot" />
        </header>

        <div className="cart1">
          <Link to="/cart" className="nav-link">
            Cart
            {cart.cartItems.length > 0 && (
              <span className="custom-badge">
                {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}</span>
            )}
          </Link>
        </div>

        <div>
          {userInfo ? (
            <div className="si2">
              <div className="dropdown-title" onClick={handleDropdownClick}>
                {userInfo.name}
              </div>
              {isDropdownOpen && (
                <div className="dropdown-items">
                  {dropdownItems.map((item, index) => (
                    <Link
                      key={index}
                      to={item.path}
                      className="dropdown-item"
                      onClick={handleDropdownClick}
                    >
                      {item.label}
                    </Link>
                  ))}
                  <Link
                    to="#signout"
                    className="dropdown-item"
                    onClick={signoutHandler}
                  >
                    Sign Out
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <Link to="/signin" style={{ textDecoration: 'none', color: 'black' }} className="si1">
              Sign In
            </Link>
          )}
        </div>

        <main>
          <Routes>
            <Route path="/product/:slug" element={<ProductScreen />} />
            <Route path="/cart" element={<CartScreen />} />
            <Route path="/signin" element={<SigninScreen />} />
            <Route path="/signup" element={<SignupScreen />} />
            <Route path="/shipping" element={<ShippingAddressScreen />} />
            <Route path="/payment" element={<PaymentMethodPage />} />
            <Route path="/placeorder" element={<PlaceOrder />} />
            <Route path="/order/:id" element={<OrderScreen />} />
            <Route path="/orderhistory" element={<OrderHistoryScreen />} />
            <Route path="/orderreceived" element={<OrderReceived />} />
            <Route path="/" element={<HomeScreen />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
