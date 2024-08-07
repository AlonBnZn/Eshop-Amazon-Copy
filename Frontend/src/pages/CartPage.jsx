import axios from "axios";
import { useContext } from "react";
import { toast } from "react-toastify";
import { ADD_TO_CART, GET_FAIL, REMOVE_FROM_CART } from "../actions";
import Title from "../components/shared/Title";
import { Col, Row } from "react-bootstrap";
import ItemsInCart from "../components/cart/ItemsInCart";
import { Store } from "../Store";
import Checkout from "../components/cart/Checkout";
import { useNavigate } from "react-router-dom";
const CartPage = () => {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;
  const navigate = useNavigate();

  const updateCartHandler = async (item, quantity) => {
    try {
      const { data: product } = await axios.get(`/api/v1/products${item._id}`);
      if (product.countInStock < quantity) {
        toast("Sorry, Product is out of stock");
        return;
      }
      ctxDispatch({ type: ADD_TO_CART, payload: { ...item, quantity } });
    } catch (err) {
      ctxDispatch({ type: GET_FAIL, payload: err.message });
      toast.error(err);
    }
  };
  const removeItemHandler = (item) => {
    ctxDispatch({
      type: REMOVE_FROM_CART,
      payload: item,
    });
  };
  const checkoutHandler = () => {
    navigate("/signin?redirect=/shipping");
  };
  return (
    <div>
      <Title title={"Shopping Cart"} />
      <Row>
        <Col md={8}>
          <ItemsInCart
            updateCartHandler={updateCartHandler}
            cartItems={cartItems}
            removeItemHandler={removeItemHandler}
          />
        </Col>
        <Col md={4}>
          <Checkout cartItems={cartItems} checkoutHandler={checkoutHandler} />
        </Col>
      </Row>
    </div>
  );
};

export default CartPage;
