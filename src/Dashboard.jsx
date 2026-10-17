import { useContext, useState } from 'react';
import { Table, Button, Modal, Form, Card, Container, Badge } from 'react-bootstrap';
import { OrchidContext } from './OrchidContext';
import { CategoryContext } from './CategoryContext';
import { AuthContext } from './AuthProvider';
import { ThemeContext } from './ThemeProvider';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { orchids, addOrchid, updateOrchid, deleteOrchid, loading } = useContext(OrchidContext);
  const { categories } = useContext(CategoryContext);
  const { user } = useContext(AuthContext);
  const { theme, dark } = useContext(ThemeContext);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    rating: '5',
    isSpecial: false,
    isNatural: false,
    image: '',
    color: '',
    origin: '',
    category: ''
  });

  // Only allow admin
  if (!user || user.role !== 'admin') {
    return (
      <Container className="text-center mt-5">
        <h3 className="text-danger">Access Denied. Please log in as Admin.</h3>
      </Container>
    );
  }

  const handleClose = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({ name: '', rating: '5', isSpecial: false, isNatural: false, image: '', color: '', origin: '', category: '' });
  };

  const handleShow = () => {
    setEditingId(null);
    setFormData({
      name: '',
      rating: '5',
      isSpecial: false,
      isNatural: false,
      image: '/assets/img1.jpg',
      color: '',
      origin: '',
      category: categories[0]?.name || 'Cattleya'
    });
    setShowModal(true);
  };

  const handleEdit = (orchid) => {
    setEditingId(orchid.id);
    setFormData({
      name: orchid.name || '',
      rating: String(orchid.rating || 5),
      isSpecial: Boolean(orchid.isSpecial),
      isNatural: Boolean(orchid.isNatural),
      image: orchid.image || '',
      color: orchid.color || '',
      origin: orchid.origin || '',
      category: orchid.category || (categories[0]?.name || 'Cattleya')
    });
    setShowModal(true);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete orchid "${name}"?`)) {
      deleteOrchid(id);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      rating: Number(formData.rating)
    };

    if (editingId) {
      updateOrchid(editingId, payload);
    } else {
      addOrchid(payload);
    }
    handleClose();
  };

  return (
    <Container className="py-4">
      <Card className="shadow-sm border-0 mb-4" style={{ backgroundColor: theme.cardBg, color: theme.cardText }}>
        <Card.Body className="d-flex flex-wrap justify-content-between align-items-center gap-3">
          <div>
            <h3 className="mb-1">Admin Dashboard - Manage Orchids</h3>
            <p className="text-muted mb-0">Endpoints: <code>/orchids</code> and <code>/orchids/:orchidId</code></p>
          </div>
          <div className="d-flex gap-2">
            <Button as={Link} to="/admin/categories" variant="outline-success">
              Manage Categories
            </Button>
            <Button variant="primary" onClick={handleShow}>
              + Add New Orchid
            </Button>
          </div>
        </Card.Body>
      </Card>

      {loading ? (
        <p className="text-center py-5">Loading orchids data from MockAPI...</p>
      ) : (
        <Table 
          striped 
          bordered 
          hover 
          variant={dark ? "dark" : "light"} 
          responsive 
          className="shadow-sm align-middle mb-0"
        >
          <thead>
            <tr>
              <th style={{ width: '60px' }}>ID</th>
              <th style={{ width: '70px' }}>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Origin</th>
              <th>Rating</th>
              <th>Feedbacks</th>
              <th className="text-center" style={{ width: '220px', whiteSpace: 'nowrap' }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {orchids.map(orchid => (
              <tr key={orchid.id}>
                <td>{orchid.id}</td>
                <td>
                  <img 
                    src={orchid.image} 
                    alt={orchid.name} 
                    style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px' }} 
                    onError={(e) => { e.target.src = "https://placehold.co/48x48?text=Img"; }}
                  />
                </td>
                <td className="fw-bold">{orchid.name}</td>
                <td>
                  <Badge bg="secondary">{orchid.category}</Badge>
                </td>
                <td>{orchid.origin}</td>
                <td>
                  <span className="text-warning">{'⭐'.repeat(Math.round(orchid.rating || 5))}</span>
                </td>
                <td>
                  <Badge bg="info" text="dark">
                    {orchid.feedback ? orchid.feedback.length : 0} reviews
                  </Badge>
                </td>
                <td className="text-center">
                  <div className="d-inline-flex gap-1 justify-content-center align-items-center flex-nowrap">
                    {/* View Detail Button */}
                    <Button 
                      as={Link} 
                      to={`/detail/${orchid.id}`} 
                      variant={dark ? "outline-light" : "outline-secondary"} 
                      size="sm"
                      title="View public detail"
                    >
                      Detail
                    </Button>
                    
                    {/* Edit Button */}
                    <Button 
                      variant="warning" 
                      size="sm" 
                      onClick={() => handleEdit(orchid)}
                      title="Edit orchid"
                    >
                      Edit
                    </Button>
                    
                    {/* Delete Button */}
                    <Button 
                      variant="danger" 
                      size="sm" 
                      onClick={() => handleDelete(orchid.id, orchid.name)}
                      title="Delete orchid"
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {orchids.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center py-4">No orchids found.</td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

      {/* Add / Edit Orchid Modal */}
      <Modal show={showModal} onHide={handleClose} data-bs-theme={dark ? "dark" : "light"}>
        <Modal.Header closeButton className={dark ? 'bg-dark text-light border-secondary' : ''}>
          <Modal.Title>{editingId ? 'Edit Orchid' : 'Add New Orchid'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body className={dark ? 'bg-dark text-light' : ''}>
            <Form.Group className="mb-3">
              <Form.Label>Orchid Name</Form.Label>
              <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select name="category" value={formData.category} onChange={handleChange} required>
                {categories.map(cat => (
                  <option key={cat.id || cat.name} value={cat.name}>{cat.name}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Image URL or Asset Path</Form.Label>
              <Form.Control 
                type="text" 
                name="image" 
                value={formData.image} 
                onChange={handleChange} 
                required 
                placeholder="/assets/img1.jpg" 
              />
            </Form.Group>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Origin</Form.Label>
                  <Form.Control type="text" name="origin" value={formData.origin} onChange={handleChange} required />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Color</Form.Label>
                  <Form.Control type="text" name="color" value={formData.color} onChange={handleChange} required />
                </Form.Group>
              </div>
            </div>

            <Form.Group className="mb-3">
              <Form.Label>Rating (1-5)</Form.Label>
              <Form.Control type="number" min="1" max="5" name="rating" value={formData.rating} onChange={handleChange} required />
            </Form.Group>

            <div className="d-flex gap-4 mb-2">
              <Form.Check type="checkbox" label="Is Special" name="isSpecial" checked={formData.isSpecial} onChange={handleChange} />
              <Form.Check type="checkbox" label="Is Natural" name="isNatural" checked={formData.isNatural} onChange={handleChange} />
            </div>
          </Modal.Body>
          <Modal.Footer className={dark ? 'bg-dark border-secondary' : ''}>
            <Button variant="secondary" onClick={handleClose}>Cancel</Button>
            <Button variant="primary" type="submit">{editingId ? 'Update Orchid' : 'Save Orchid'}</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}
