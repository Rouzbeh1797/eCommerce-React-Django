import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Form,
  Button,
  ListGroup,
  Image,
  Card,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CheckoutSteps from "../components/CheckoutSteps";
import Message from "../components/Message";

import { createOrder } from "../actions/orderActions";

import { ORDER_CREATE_RESET } from "../constants/orderConstants";

function PlaceOrderScreen({ history }) {
  const orderCreate = useSelector((state) => state.orderCreate);
  const { order, error, success } = orderCreate;
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  cart.itemsPrice = cart.cartItems.reduce((total, item) => {
    return (total += item.qty * item.price);
  }, 0);

  cart.shippingPrice = cart.itemsPrice > 100 ? 0 : 25;

  cart.taxPrice = (cart.itemsPrice + cart.shippingPrice) * 0.05;
  cart.totalPrice = cart.taxPrice + cart.shippingPrice + cart.itemsPrice;

  if (!cart.paymentMethod) {
    history.push(`/payment`);
  }

  useEffect(() => {
    if (success) {
      history.push(`./order/${order._id}`);
      dispatch({ type: ORDER_CREATE_RESET });
    }
  }, [success, history]);

  const placeOrder = () => {
    dispatch(
      createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      })
    );
  };
  return (
    <div>
      <CheckoutSteps step1 step2 step3 step4></CheckoutSteps>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>adress:</strong>
                {cart.shippingAddress.address}, {cart.shippingAddress.city},{" "}
                {cart.shippingAddress.postalcode},{" "}
                {cart.shippingAddress.country},
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method:</strong>
                {cart.paymentMethod}
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order items</h2>
              {cart.cartItems.length === 0 ? (
                <Message varaint="info">Your card is empty</Message>
              ) : (
                <ListGroup varaint="flush">
                  {cart.cartItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}{" "}
                          </Link>
                        </Col>

                        <Col md={4}>
                          {item.qty} X ${item.price}=$
                          {(item.qty * item.price).toFixed(2)}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summery</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Item:</Col>
                  <Col>${cart.itemsPrice.toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Shipping:</Col>
                  <Col>${cart.shippingPrice.toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Tax:</Col>
                  <Col>${cart.taxPrice.toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Total:</Col>
                  <Col>${cart.totalPrice.toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                {error && <Message variant="danger">{error}</Message>}
              </ListGroup.Item>

              <ListGroup.Item>
                <Button
                  type="button"
                  className="btn-block"
                  disabled={cart.cartItems === 0}
                  onClick={placeOrder}
                >
                  Place Order
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default PlaceOrderScreen;