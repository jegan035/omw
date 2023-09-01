import React, { useContext, useReducer, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Store } from "../store";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import axios from "axios";
import { getError } from "../utils";
import MessageBox from "../components/MessageBox";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, order: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "PAY_REQUEST":
      return { ...state, loadingPay: true };
    case "PAY_SUCCESS":
      return { ...state, loadingPay: false, successPay: true };
    case "PAY_FAIL":
      return { ...state, loadingPay: false };
    case "PAY_RESET":
      return { ...state, loadingPay: false, successPay: false };
    default:
      return state;
  }
}

const OrderScreen = () => {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const params = useParams();
  const { id: orderId } = params;
  const navigate = useNavigate();
  const [{ loading, error, order, successPay, loadingPay }, dispatch] =
    useReducer(reducer, {
      loading: true,
      order: {},
      error: "",
      successPay: false,
      loadingPay: false,
    });
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: order.totalPrice },
          },
        ],
      })
      .then((orderID) => {
        return orderID;
      });
  }

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        dispatch({ type: "PAY_REQUEST" });
        const { data } = await axios.put(
          `/api/orders/${order._id}/pay`,
          details,
          {
            headers: { authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({ type: "PAY_SUCCESS", payload: data });
        toast.success("Order is paid");
      } catch (err) {
        dispatch({ type: "PAY_FAIL", payload: getError(err) });
        toast.error(getError(err));
      }
    });
  }
  function onError(err) {
    toast.error(getError(err));
  }

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };

    if (!userInfo) {
      return navigate("/signin");
    }

    if (!order._id || successPay|| (order._id && order._id !== orderId)) {
      fetchOrder();
      if (successPay) {
        dispatch({ type: 'PAY_RESET' });
      }
    } else {
      const loadPaypalScript = async () => {
        const { data: clientId } = await axios.get("/api/keys/paypal", {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": clientId,
            currency: "USD",
          },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };
      loadPaypalScript();
    }
  }, [order, userInfo, orderId, navigate, paypalDispatch,successPay]);
  return loading ? (
    <div>loding...</div>
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <>
      <div className="order-container">
        <Helmet>
          <title>Order {orderId}</title>
        </Helmet>
        <h1 className="section-title">Order {orderId}</h1>
        <div className="section">
          <div className="section-title">Shipping</div>
          <div className="shipping-address">
            <strong>Name:</strong> {order.shippingAddress.fullName}
            <br />
            <strong>Address:</strong> {order.shippingAddress.address},{" "}
            {order.shippingAddress.city}, {order.shippingAddress.postalCode},{" "}
            {order.shippingAddress.country}
          </div>
          <div className="message-box success-box">
            {order.isDelivered ? (
              <MessageBox variant="success success-box">
                Delivered at {order.deliveredAt}
              </MessageBox>
            ) : (
              <MessageBox variant="danger danger-box">Not Delivered</MessageBox>
            )}
          </div>
        </div>
        <div className="section">
          <div className="section-title">Payment</div>
          <div>
            <strong>Method:</strong> {order.paymentMethod}
          </div>
          {order.isPaid ? (
            <MessageBox variant="success success-box">
              Paid at {order.paidAt}
            </MessageBox>
          ) : (
            <MessageBox variant="danger danger-box">Not Paid</MessageBox>
          )}
        </div>
        <div className="section">
          <div className="section-title">Items</div>
          <div>
            {order.orderItems.map((item) => (
              <div key={item._id} className="item">
                <div className="item-image">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="item-details">
                  <Link to={`/product/${item.slug}`}>{item.name}</Link>
                </div>
                <div className="item-quantity">{item.quantity}</div>
                <div className="item-price">${item.price}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="order-summary1">
        <div className="order-summary-title">Order Summary</div>
        <div>
          <div>
            <div>Items:${order.itemsPrice.toFixed(2)}</div>
          </div>
          <div>
            <div>Shipping:${order.shippingPrice.toFixed(2)}</div>
          </div>
          <div>
            <div>Tax:${order.taxPrice.toFixed(2)}</div>
          </div>
          <div className="order-total">
            <strong>Order Total : ${order.totalPrice.toFixed(2)}</strong>
          </div>
          {!order.isPaid && (
            <div>
              {isPending ? (
                <h1>loading...</h1>
              ) : (
                <div className="paypal">
                  <PayPalButtons
                    createOrder={createOrder}
                    onApprove={onApprove}
                    onError={onError}
                  ></PayPalButtons>
                </div>
              )}
              {loadingPay&& <h1>loading..</h1>}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default OrderScreen;
