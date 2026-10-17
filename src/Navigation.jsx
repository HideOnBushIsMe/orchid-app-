import { useContext, useState } from 'react';
import { Navbar, Container, Nav, NavDropdown, Button, Image, Badge, Modal } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthProvider';
import { ThemeContext } from './ThemeProvider';
import { CategoryContext } from './CategoryContext';
import { CartContext } from './CartContext';

export default function Navigation() {
  const { user, loginWithGoogle, logout } = useContext(AuthContext);
  const { theme, toggle, dark } = useContext(ThemeContext);
  const { categories } = useContext(CategoryContext);
  const { totalQuantity } = useContext(CartContext);
  const navigate = useNavigate();

  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleGoogleLogin = (role) => {
    loginWithGoogle(role);
    setShowLoginModal(false);
  };

  return (
    <>
      <Navbar 
        style={{ backgroundColor: theme.backgroundColor }} 
        variant={dark ? "dark" : "light"} 
        expand="lg" 
        sticky="top"
        className="shadow-sm transition-all py-2"
      >
        <Container>
          <Navbar.Brand as={Link} to="/" className="fw-bold fs-4">
            🌸 Orchids Collection
          </Navbar.Brand>
          
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">Home</Nav.Link>
              <Nav.Link as={Link} to="/naturals">Naturals</Nav.Link>
              
              {/* Categories NavDropdown */}
              <NavDropdown title="Categories" id="categories-nav-dropdown">
                {categories.map((cat) => (
                  <NavDropdown.Item 
                    key={cat.id || cat.name} 
                    as={Link} 
                    to={`/?category=${encodeURIComponent(cat.name)}`}
                  >
                    {cat.name}
                  </NavDropdown.Item>
                ))}
              </NavDropdown>

              <Nav.Link as={Link} to="/contact">Contact</Nav.Link>
              
              <Nav.Link as={Link} to="/cart">
                Cart {totalQuantity > 0 && <Badge bg="success" pill>{totalQuantity}</Badge>}
              </Nav.Link>

              {/* Admin Access Control Dropdown */}
              {user && user.role === 'admin' && (
                <NavDropdown 
                  title={<span className="text-warning fw-bold">Admin Panel ⚙️</span>} 
                  id="admin-nav-dropdown"
                >
                  <NavDropdown.Item as={Link} to="/admin/orchids">
                    Manage Orchids (/orchids)
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/admin/categories">
                    Manage Categories (/categories)
                  </NavDropdown.Item>
                </NavDropdown>
              )}
            </Nav>

            <Nav className="align-items-center gap-2">
              {/* Dark / Light Toggle */}
              <Button
                variant={dark ? "outline-light" : "outline-dark"}
                size="sm"
                onClick={toggle}
                className="rounded-pill px-3 me-2"
              >
                {dark ? "☀️ Light" : "🌙 Dark"}
              </Button>

              {/* User Dropdown / Login */}
              {user ? (
                <NavDropdown 
                  title={
                    <span className="d-inline-flex align-items-center">
                      <Image 
                        src={user.avatar || "https://placehold.co/32x32"} 
                        roundedCircle 
                        width="30" 
                        height="30" 
                        className="me-2 border" 
                        alt="avatar"
                      />
                      <span style={{ color: theme.color }}>{user.name}</span>
                      <Badge bg={user.role === 'admin' ? 'danger' : 'primary'} className="ms-2">
                        {user.role}
                      </Badge>
                    </span>
                  }
                  id="user-profile-dropdown"
                  align="end"
                >
                  <div className="px-3 py-1 text-muted small">
                    Logged in as: <strong>{user.email}</strong>
                  </div>
                  <NavDropdown.Divider />
                  <NavDropdown.Item as={Link} to="/profile">
                    👤 My Profile
                  </NavDropdown.Item>
                  {user.role === 'admin' && (
                    <NavDropdown.Item as={Link} to="/admin/orchids">
                      📊 Admin Dashboard
                    </NavDropdown.Item>
                  )}
                  <NavDropdown.Divider />
                  <NavDropdown.Item 
                    onClick={() => { logout(); navigate('/'); }}
                    className="text-danger"
                  >
                    🚪 Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <Button 
                  variant="primary" 
                  size="sm" 
                  onClick={() => setShowLoginModal(true)}
                  className="rounded-pill px-3 shadow-sm d-flex align-items-center gap-2"
                >
                  <span>Sign in with Google</span>
                </Button>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Google Sign-in Interactive Modal */}
      <Modal 
        show={showLoginModal} 
        onHide={() => setShowLoginModal(false)} 
        centered
        data-bs-theme={dark ? "dark" : "light"}
      >
        <Modal.Header closeButton className={dark ? 'bg-dark text-light border-secondary' : ''}>
          <Modal.Title>Sign in with Google Account</Modal.Title>
        </Modal.Header>
        <Modal.Body className={`p-4 ${dark ? 'bg-dark text-light' : ''}`}>
          <p className="text-muted mb-4">
            Select an account to authenticate for grading or demonstration purposes:
          </p>

          <div className="d-grid gap-3">
            <Button 
              variant="outline-primary" 
              className="py-2 text-start d-flex align-items-center justify-content-between"
              onClick={() => handleGoogleLogin("member")}
            >
              <div>
                <strong className="d-block">Minh Bằng (Student Member)</strong>
                <small className="text-muted">student@gmail.com</small>
              </div>
              <Badge bg="primary">Member</Badge>
            </Button>

            <Button 
              variant="outline-danger" 
              className="py-2 text-start d-flex align-items-center justify-content-between"
              onClick={() => handleGoogleLogin("admin")}
            >
              <div>
                <strong className="d-block">Administrator</strong>
                <small className="text-muted">admin@orchid.com</small>
              </div>
              <Badge bg="danger">Admin</Badge>
            </Button>
          </div>
        </Modal.Body>
        <Modal.Footer className={dark ? 'bg-dark border-secondary' : ''}>
          <Button variant="secondary" size="sm" onClick={() => setShowLoginModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
