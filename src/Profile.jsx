import { useContext, useState } from 'react';
import { Container, Card, Form, Button, Row, Col, Image, Badge, Alert } from 'react-bootstrap';
import { AuthContext } from './AuthProvider';
import { ThemeContext } from './ThemeProvider';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { user, updateProfile } = useContext(AuthContext);
  const { theme, dark } = useContext(ThemeContext);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    avatar: user?.avatar || '',
    phone: user?.phone || '',
    bio: user?.bio || ''
  });

  if (!user) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="warning" className="d-inline-block p-4">
          <h4>Please Log In</h4>
          <p>You need to sign in with your Google account to view and edit your profile.</p>
          <Button as={Link} to="/" variant="primary">Back to Home</Button>
        </Alert>
      </Container>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(formData);
  };

  return (
    <Container className="py-4" style={{ maxWidth: '800px' }}>
      <Card 
        className="shadow-sm border-0" 
        style={{ backgroundColor: theme.cardBg, color: theme.cardText }}
      >
        <Card.Header className="d-flex justify-content-between align-items-center py-3">
          <h4 className="mb-0">Member Profile Management</h4>
          <Badge bg={user.role === 'admin' ? 'danger' : 'success'} className="fs-6 text-uppercase">
            {user.role}
          </Badge>
        </Card.Header>
        <Card.Body className="p-4">
          <Row className="mb-4 align-items-center">
            <Col xs="auto">
              <Image 
                src={formData.avatar || "https://placehold.co/100x100"} 
                roundedCircle 
                width="90" 
                height="90" 
                style={{ objectFit: 'cover', border: '3px solid #0d6efd' }}
                alt="Avatar"
              />
            </Col>
            <Col>
              <h5 className="mb-1">{user.name}</h5>
              <p className="text-muted mb-0">{user.email}</p>
              <small className="text-info">Google Authenticated Account</small>
            </Col>
          </Row>

          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    required 
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control 
                    type="email" 
                    value={user.email} 
                    disabled 
                    className="bg-light text-muted"
                  />
                  <Form.Text className="text-muted">Email is linked to Google ID and cannot be changed.</Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Avatar URL</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="avatar" 
                    value={formData.avatar} 
                    onChange={handleChange} 
                    placeholder="https://..."
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleChange} 
                    placeholder="e.g. 0901234567"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-4">
              <Form.Label>Bio & Interests</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3} 
                name="bio" 
                value={formData.bio} 
                onChange={handleChange} 
                placeholder="Share your passion for orchids..."
              />
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button as={Link} to="/" variant={dark ? "outline-light" : "outline-secondary"}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Save Profile Changes
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
