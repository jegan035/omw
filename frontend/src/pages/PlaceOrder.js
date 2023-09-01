import  axios from 'axios'; 
import React, { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';

import { Link, useNavigate } from 'react-router-dom';
import { Store } from '../store';
import {toast} from 'react-toastify'
import {getError} from '../utils'


const reducer = (state, action) => {
  switch (action.type) {
    case 'CREATE_REQUEST':
      return { ...state, loading: true };
    case 'CREATE_SUCCESS':
      return { ...state, loading: false };
    case 'CREATE_FAIL':
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default function PlaceOrderScreen() {
  const navigate = useNavigate();

  const [{ loading }, dispatch] = useReducer(reducer, {
    loading: false,
  });

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100; // 123.2345 => 123.23
  cart.itemsPrice = round2(
    cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  );
  cart.shippingPrice = cart.itemsPrice > 100 ? round2(0) : round2(10);
  cart.taxPrice = round2(0.15 * cart.itemsPrice);
  cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;

  const placeOrderHandler = async () => {
    try {
      dispatch({ type: 'CREATE_REQUEST' });

      const { data } = await axios.post(
        '/api/orders',
        {
          orderItems: cart.cartItems,
          shippingAddress: cart.shippingAddress,
          paymentMethod: cart.paymentMethod,
          itemsPrice: cart.itemsPrice,
          shippingPrice: cart.shippingPrice,
          taxPrice: cart.taxPrice,
          totalPrice: cart.totalPrice,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      ctxDispatch({ type: 'CART_CLEAR' });
      dispatch({ type: 'CREATE_SUCCESS' });
      localStorage.removeItem('cartItems');
      navigate(`/order/${data.order._id}`);
    } catch (err) {
      dispatch({ type: 'CREATE_FAIL' });
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    if (!cart.paymentMethod) {
      navigate('/payment');
    }
  }, [cart, navigate]);
  return (
    <div className="place-order-container">
      <Helmet>
        <title>Preview Order</title>
      </Helmet>
      <h1>Preview Order</h1>
      <div className="order-details">
        <div className="shipping-details">
          <strong>Name:</strong> {cart.shippingAddress.fullname} <br />
          <strong>Address:</strong> {cart.shippingAddress.address},
          {cart.shippingAddress.city}, {cart.shippingAddress.postalCode},
          {cart.shippingAddress.country} <br />
          <Link to="/shipping">Edit</Link>
        </div>
        <div className="payment-details">
          <h1>Payment</h1>
          <strong>Method:</strong> {cart.paymentMethod} <br />
          <Link to="/payment">Edit</Link>
        </div>
        <div className="item-list">
          <h1>Items</h1>
          <div>
            {cart.cartItems.map((item) => (
              <div key={item._id} className="item">
                <img src={item.image} alt={item.name} height={100} />&nbsp; &nbsp; &nbsp; &nbsp; 
                <Link to={`/product/${item.slug}`}>{item.name}</Link>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 
                <span>{item.quantity}</span>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 
                <span>${item.price}</span>
              </div>
            ))}
          </div>
          <Link to="/cart">Edit</Link>
        </div>
        <div className="order-summary">
          <h1>Order Summary</h1>
          <ul>
            <li>
              <strong>Items</strong>
              <span>${cart.itemsPrice.toFixed(2)}</span>
            </li>
            <li>
              <strong>Shipping</strong>
              <span>${cart.shippingPrice.toFixed(2)}</span>
            </li>
            <li>
              <strong>Tax</strong>
              <span>${cart.taxPrice.toFixed(2)}</span>
            </li>
            <li>
              <strong>Order Total</strong>
              <span>${cart.totalPrice.toFixed(2)}</span>
            </li>
          </ul>
          <div className="place-order-button">
            <button
              type="button"
              onClick={placeOrderHandler}
              disabled={cart.cartItems.length === 0}
            >
              Place Order
            </button>
           
          </div>
        </div>
      </div>
    </div>
  );
}