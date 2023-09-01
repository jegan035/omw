import React, { useEffect, useState, useContext } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { Store } from "../store";

const PaymentMethodPage = () => {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { shippingAddress, paymentMethod },
  } = state;
  const [paymentMethodName, setPaymentMethod] = useState(paymentMethod || "PayPal");

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate("/shipping");
    }
  }, [shippingAddress, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    ctxDispatch({ type: "SAVE_PAYMENT_METHOD", payload: paymentMethodName });
    localStorage.setItem("paymentMethod", paymentMethodName);
    navigate("/placeorder");
  };

  return (
    <div className="payment-container">
      <Helmet>
        <title>Payment</title>
      </Helmet>
      <h1 className="payment-title">Payment Method</h1>
      <form onSubmit={submitHandler} className="payment-form">
        <div className="payment-option">
          <label className="payment-label">
            <input
              type="radio"
              name="paymentMethod"
              value="Paypal"
              checked={paymentMethodName === "Paypal"}
              onChange={() => setPaymentMethod("Paypal")}
            />{" "}
            PayPal
          </label>
        </div>
        
        <div className="submit-button">
          <button type="submit">Continue</button>
        </div>
      </form>
    </div>
  );
};

export default PaymentMethodPage;
