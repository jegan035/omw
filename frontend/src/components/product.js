import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import './product.css';
import { Store } from '../store';
import axios from 'axios';

function Product(props) {
  const { product } = props;

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;



  const addToCartHandler = async (item) => {
    const existItem = cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert("OOPS! out of stock");
      return;
    }
    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...item, quantity },
    });
  };

  return (
     <div className="product-item">
       <Link to={`/product/${product.slug}`}>
      <img src={product.image} alt={product.name} className="product-image" height="250px" width="200px"/>
      </Link>
      <Link to={`/product/${product.slug}`} className="product-link">
      <h3>{product.name}</h3>
      </Link>
          <p className="product-price">${product.price}</p>
          {product.countInStock === 0 ? (
             <button className='out-of-stock' type='button' disabled>
             Out of stock
           </button>
            ) : (
          <button className="add-to-cart-button" onClick={()=>addToCartHandler(product)}>Add to Cart</button>
          )}
    </div>
   
  );
}

export default Product;

