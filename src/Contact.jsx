import { useContext } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Form, Button, Container, Card } from 'react-bootstrap';
import { ThemeContext } from './ThemeProvider';

export default function Contact() {
  const { theme, dark } = useContext(ThemeContext);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      message: '',
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(2, 'Name must be at least 2 characters')
        .required('Name is required'),
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      phone: Yup.string()
        .matches(/^[0-9]+$/, "Must be only digits")
        .min(10, 'Must be exactly 10 digits')
        .max(10, 'Must be exactly 10 digits')
        .required('Phone is required'),
      message: Yup.string()
        .min(10, 'Message must be at least 10 characters')
        .required('Message is required'),
    }),
    onSubmit: (values, { resetForm }) => {
      alert(JSON.stringify(values, null, 2));
      resetForm();
    },
  });

  return (
    <Container className="py-5 d-flex justify-content-center">
      <Card 
        style={{ width: '100%', maxWidth: '600px', backgroundColor: theme.cardBg, color: theme.cardText }}
        className="shadow border-0"
      >
        <Card.Body className="p-5">
          <h2 className="text-center mb-4">Contact Us</h2>
          <Form onSubmit={formik.handleSubmit}>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                {...formik.getFieldProps('name')}
                isInvalid={formik.touched.name && formik.errors.name}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.name}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                {...formik.getFieldProps('email')}
                isInvalid={formik.touched.email && formik.errors.email}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.email}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="phone">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                {...formik.getFieldProps('phone')}
                isInvalid={formik.touched.phone && formik.errors.phone}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.phone}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-4" controlId="message">
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                {...formik.getFieldProps('message')}
                isInvalid={formik.touched.message && formik.errors.message}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.message}
              </Form.Control.Feedback>
            </Form.Group>

            <div className="d-grid">
              <Button 
                variant={dark ? "light" : "dark"} 
                type="submit" 
                size="lg"
              >
                Send Message
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
