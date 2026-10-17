import { useContext, useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Alert } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { CartContext } from './CartContext';
import { ThemeContext } from './ThemeProvider';
import { Link } from 'react-router-dom';

export default function Cart() {
  const { state, dispatch, totalQuantity, totalPrice } = useContext(CartContext);
  const { theme, dark } = useContext(ThemeContext);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  const updateQuantity = (id, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity: parseInt(quantity) } });
  };

  const removeItem = (id) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } });
  };

  const formik = useFormik({
    initialValues: {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      paymentMethod: 'COD',
      agreeTerms: false,
    },
    validationSchema: Yup.object({
      fullName: Yup.string()
        .min(3, 'Full name must be at least 3 characters')
        .required('Full name is required'),
      email: Yup.string()
        .email('Invalid email format')
        .required('Email is required'),
      phone: Yup.string()
        .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits")
        .required('Phone is required'),
      address: Yup.string()
        .required('Address is required'),
      paymentMethod: Yup.string()
        .oneOf(['COD', 'Card'], 'Invalid Payment Method')
        .required('Required'),
      agreeTerms: Yup.boolean()
        .oneOf([true], 'You must accept the terms and conditions'),
    }),
    onSubmit: (values, { resetForm }) => {
      setOrderDetails({
        customer: values,
        items: [...state.items],
        totalQuantity,
        totalPrice
      });
      setOrderConfirmed(true);
      dispatch({ type: 'CLEAR_CART' });
      resetForm();
    },
  });

  if (orderConfirmed) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="success">
          <Alert.Heading>Order Confirmed Successfully!</Alert.Heading>
          <p>Thank you for your purchase, {orderDetails.customer.fullName}.</p>
          <hr />
          <h5 className="mt-4">Order Summary</h5>
          <p className="mb-1"><strong>Email:</strong> {orderDetails.customer.email}</p>
          <p className="mb-1"><strong>Phone:</strong> {orderDetails.customer.phone}</p>
          <p className="mb-1"><strong>Address:</strong> {orderDetails.customer.address}</p>
          <p className="mb-4"><strong>Payment:</strong> {orderDetails.customer.paymentMethod}</p>
          
          <Table striped bordered hover variant={dark ? "dark" : "light"} className="mt-3">
            <thead>
              <tr>
                <th>Item</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {orderDetails.items.map(item => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>${item.price}</td>
                  <td>{item.quantity}</td>
                  <td>${item.price * item.quantity}</td>
                </tr>
              ))}
              <tr>
                <td colSpan="3" className="text-end"><strong>Total:</strong></td>
                <td><strong>${orderDetails.totalPrice}</strong></td>
              </tr>
            </tbody>
          </Table>

          <Button as={Link} to="/" variant="success" className="mt-3">
            Continue Shopping
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h2 className="mb-4">Shopping Cart</h2>
      <Row>
        <Col lg={7} className="mb-4">
          <Card className="shadow-sm border-0" style={{ backgroundColor: theme.cardBg, color: theme.cardText }}>
            <Card.Body>
              {state.items.length === 0 ? (
                <div className="text-center py-4">
                  <p className="fs-5">Your cart is empty.</p>
                  <Button as={Link} to="/" variant={dark ? "light" : "dark"}>Browse Orchids</Button>
                </div>
              ) : (
                <Table responsive variant={dark ? "dark" : "light"} className="align-middle">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.items.map(item => (
                      <tr key={item.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px' }} 
                              className="me-3"
                            />
                            <span>{item.name}</span>
                          </div>
                        </td>
                        <td>${item.price}</td>
                        <td>
                          <Form.Control
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, e.target.value)}
                            style={{ width: '80px' }}
                          />
                        </td>
                        <td>
                          <Button variant="danger" size="sm" onClick={() => removeItem(item.id)}>
                            Remove
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={5}>
          <Card className="shadow-sm border-0" style={{ backgroundColor: theme.cardBg, color: theme.cardText }}>
            <Card.Body>
              <h4 className="mb-3">Checkout</h4>
              <div className="d-flex justify-content-between mb-3 border-bottom pb-2">
                <span>Total Items:</span>
                <strong>{totalQuantity}</strong>
              </div>
              <div className="d-flex justify-content-between mb-4 border-bottom pb-2 fs-5">
                <span>Total Price:</span>
                <strong className="text-success">${totalPrice}</strong>
              </div>

              <Form onSubmit={formik.handleSubmit}>
                <Form.Group className="mb-3" controlId="fullName">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    {...formik.getFieldProps('fullName')}
                    isInvalid={formik.touched.fullName && formik.errors.fullName}
                    disabled={state.items.length === 0}
                  />
                  <Form.Control.Feedback type="invalid">{formik.errors.fullName}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    {...formik.getFieldProps('email')}
                    isInvalid={formik.touched.email && formik.errors.email}
                    disabled={state.items.length === 0}
                  />
                  <Form.Control.Feedback type="invalid">{formik.errors.email}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="phone">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="text"
                    {...formik.getFieldProps('phone')}
                    isInvalid={formik.touched.phone && formik.errors.phone}
                    disabled={state.items.length === 0}
                  />
                  <Form.Control.Feedback type="invalid">{formik.errors.phone}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="address">
                  <Form.Label>Shipping Address</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    {...formik.getFieldProps('address')}
                    isInvalid={formik.touched.address && formik.errors.address}
                    disabled={state.items.length === 0}
                  />
                  <Form.Control.Feedback type="invalid">{formik.errors.address}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Payment Method</Form.Label>
                  <div>
                    <Form.Check
                      inline
                      label="Cash on Delivery"
                      type="radio"
                      id="paymentCOD"
                      name="paymentMethod"
                      value="COD"
                      checked={formik.values.paymentMethod === 'COD'}
                      onChange={formik.handleChange}
                      disabled={state.items.length === 0}
                    />
                    <Form.Check
                      inline
                      label="Credit Card"
                      type="radio"
                      id="paymentCard"
                      name="paymentMethod"
                      value="Card"
                      checked={formik.values.paymentMethod === 'Card'}
                      onChange={formik.handleChange}
                      disabled={state.items.length === 0}
                    />
                  </div>
                </Form.Group>

                <Form.Group className="mb-4" controlId="agreeTerms">
                  <Form.Check
                    type="checkbox"
                    label="I agree to the terms and conditions"
                    {...formik.getFieldProps('agreeTerms')}
                    isInvalid={formik.touched.agreeTerms && formik.errors.agreeTerms}
                    disabled={state.items.length === 0}
                  />
                  <Form.Control.Feedback type="invalid" style={{ display: formik.touched.agreeTerms && formik.errors.agreeTerms ? 'block' : 'none' }}>
                    {formik.errors.agreeTerms}
                  </Form.Control.Feedback>
                </Form.Group>

                <div className="d-grid">
                  <Button 
                    variant="success" 
                    type="submit" 
                    size="lg"
                    disabled={state.items.length === 0}
                  >
                    Place Order
                  </Button>
                </div>
              </Form>

            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
