import { useContext } from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ThemeContext } from './ThemeProvider';
import { CartContext } from './CartContext';
import { AuthContext } from './AuthProvider';
import { toast } from 'react-toastify';

export default function OrchidsPresentation({ orchids }) {
  const { theme, dark } = useContext(ThemeContext);
  const { dispatch } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const addToCart = (orchid) => {
    dispatch({ type: 'ADD_ITEM', payload: { ...orchid, price: 10 } });
    toast.success(`Added ${orchid.name} to cart!`);
  };

  return (
    <Container fluid className="px-0">
      <Row className="g-4">
        {orchids.map((orchid) => (
          <Col
            key={orchid.id}
            xs={12} sm={6} md={4} lg={3}
            className="d-flex align-items-stretch"
          >
            <Card
              className="w-100 shadow-sm border-0 d-flex flex-column transition-all"
              style={{ 
                backgroundColor: theme.cardBg, 
                color: theme.cardText,
                borderRadius: '12px',
                overflow: 'hidden'
              }}
            >
              {/* Image & Overlay Badges */}
              <div className="position-relative" style={{ height: "230px", overflow: "hidden", backgroundColor: dark ? "#1a1a1a" : "#f1f1f1" }}>
                <Card.Img
                  variant="top"
                  src={orchid.image}
                  alt={orchid.name}
                  style={{ 
                    height: "100%", 
                    width: "100%", 
                    objectFit: "cover",
                    transition: "transform 0.3s ease" 
                  }}
                  onError={(e) => {
                    e.target.src = "https://placehold.co/400x300?text=Orchid";
                  }}
                />
                
                {/* Floating Badges */}
                <div className="position-absolute top-0 end-0 p-2 d-flex flex-column gap-1 align-items-end">
                  {orchid.isSpecial && (
                    <Badge bg="danger" className="shadow-sm">Special</Badge>
                  )}
                  {orchid.isNatural && (
                    <Badge bg="success" className="shadow-sm">Natural</Badge>
                  )}
                </div>
              </div>

              {/* Card Body */}
              <Card.Body className="d-flex flex-column p-3 text-start">
                <div className="d-flex justify-content-between align-items-start mb-2 gap-1">
                  <Card.Title 
                    className="fw-bold fs-6 mb-0 text-truncate" 
                    title={orchid.name}
                    style={{ maxWidth: '70%' }}
                  >
                    {orchid.name}
                  </Card.Title>
                  <Badge bg="secondary" className="text-truncate" style={{ maxWidth: '30%' }}>
                    {orchid.category}
                  </Badge>
                </div>

                <div className="mb-2 text-warning small">
                  {'⭐'.repeat(Math.round(orchid.rating || 5))}
                  <span className="text-muted ms-1 small">({orchid.rating || 5})</span>
                </div>

                <div className="small text-muted mb-3 flex-grow-1">
                  <div><strong>Origin:</strong> {orchid.origin}</div>
                  <div><strong>Color:</strong> {orchid.color}</div>
                  <div className="text-success fw-bold fs-6 mt-1">$10</div>
                </div>

                {/* Bottom Action Buttons: Uniform alignment across all cards */}
                <div className="mt-auto pt-3 border-top">
                  <div className="d-flex gap-2">
                    <Button
                      as={Link}
                      to={`/detail/${orchid.id}`}
                      variant={dark ? "outline-light" : "outline-dark"}
                      size="sm"
                      className="flex-fill d-flex align-items-center justify-content-center py-2"
                    >
                      Detail
                    </Button>
                    
                    <Button 
                      variant="success"
                      size="sm"
                      onClick={() => addToCart(orchid)}
                      className="flex-fill d-flex align-items-center justify-content-center py-2"
                    >
                      Add to Cart
                    </Button>
                  </div>

                  {/* Admin Fast Edit shortcut */}
                  {user && user.role === 'admin' && (
                    <Button
                      as={Link}
                      to="/admin/orchids"
                      variant="outline-warning"
                      size="sm"
                      className="w-100 mt-2 py-1 small d-flex align-items-center justify-content-center"
                    >
                      ⚙️ Edit in Admin Dashboard
                    </Button>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
