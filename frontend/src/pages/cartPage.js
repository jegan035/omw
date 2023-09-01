import React, { useContext } from "react";
import { Store } from "../store";
import { Helmet } from "react-helmet-async";
import { Link ,useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinusCircle, faPlusCircle, faTrash } from "@fortawesome/free-solid-svg-icons";
import MessageBox from "../components/MessageBox";
import axios from "axios";


export default function CartScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const updateCartHandler = async (item, quantity) => {
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert("Sorry. Product is out of stock");
      return;
    }
    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...item, quantity },
    });
  };

  const removeItemHandler = (item) => {
    ctxDispatch({ type: "CART_REMOVE_ITEM", payload: item });
  };
  const checkoutHandler = () => {
    navigate('/signin?redirect=/shipping');
  };

  return (
    <div className="cart-screen">
      <Helmet>
        <title>Shopping Cart</title>
      </Helmet>
      <h1>Shopping Cart</h1>
      <div>
        {cartItems.length === 0 ? (
          <MessageBox>
            Cart is empty. <Link to="/">Go Shopping</Link>
          </MessageBox>
        ) : (
          <ul className="cart-items">
            {cartItems.map((item) => (
              <li key={item._id} className="cart-item">
                <div className="item-details">
                  <img src={item.image} alt={item.name} className="store-image" />{" "}
                  <div className="item-name">
                    <Link to={`/product/${item.slug}`}>{item.name}</Link>
                  </div>
                </div>
                <div className="item-actions">
                  <button
                    onClick={() => updateCartHandler(item, item.quantity - 1)}
                    disabled={item.quantity === 1}
                  >
                    <FontAwesomeIcon icon={faMinusCircle} />
                  </button>{" "}
                  <span>{item.quantity}</span>{" "}
                  <button
                    onClick={() => updateCartHandler(item, item.quantity + 1)}
                    disabled={item.quantity === item.countInStock}
                  >
                    <FontAwesomeIcon icon={faPlusCircle} />
                  </button>
                </div>
                <div className="item-price">${item.price}</div>
                <div className="item-remove">
                  <button onClick={() => removeItemHandler(item)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="subtotal">
        <div className="subtotal-text">
          <h3>
            Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)} items) : $
            {cartItems.reduce((a, c) => a + c.price * c.quantity, 0)}
          </h3>
        </div>
        <div className="checkout-button">
           
          <button type="button"
                      variant="primary"
                      onClick={checkoutHandler}
                      disabled={cartItems.length === 0}>
            Proceed to Checkout
          </button>
          
        </div>
      </div>
    </div>
  );
}
