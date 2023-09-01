import axios from "axios";
import { useContext, useEffect, useReducer } from "react";
import {  useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Store } from "../store";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, product: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function ProductScreen() {
  const navigate = useNavigate();
  const params = useParams();
  const { slug } = params;

  const [{ loading, error, product }, dispatch] = useReducer(reducer, {
    product: {},
    loading: true,
    error: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const result = await axios.get(`/api/products/slug/${slug}`);
        dispatch({ type: "FETCH_SUCCESS", payload: result.data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: err.message });
      }
    };

    fetchData();
  }, [slug]);

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart } = state;
  const addToCartHandler = async () => {
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;//increase the quantity of the product 
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) //if product out of stock it show error message
    {
      window.alert('OOPS!product out of stock ');
      return;
    }
    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...product, quantity },
    });
    navigate('/cart')
  };

  return loading ? (
    <div>Loading...</div>
  ) : error ? (
    <div>{error}</div>
  ) : (
    <div>
      
          <img
            className="img-larger"
            src={product.image}
            alt={product.name}
          ></img>
        
        
          <div className="list">
            <div >
              <div className="p1">
                <Helmet>
                  <title>{product.name}</title>
                </Helmet>
                <h1>{product.name}</h1>
              </div>
              <div className="p2">
                Price:${product.price}
              </div>
              <div className="p3">
                <p>
                  Description:<br></br>
                  {product.description}
                </p>
              </div>
              <div>
                  <h4>Status:</h4>
                    {product.countInStock > 0 ? (
                      <span className="success-badge">In Stock</span>
                    ) : (
                      <span className="danger-badge">Out of Stock</span>
                    )}
              </div>
              {product.countInStock > 0 && (
                <div>
                  <div className="d-grid">
                    <button onClick={addToCartHandler} variant="primary">
                      Add to Cart
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        
    </div>
  );
}

export default ProductScreen;
