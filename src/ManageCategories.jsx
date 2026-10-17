import { useContext, useState } from 'react';
import { Container, Table, Button, Modal, Form, Card } from 'react-bootstrap';
import { CategoryContext } from './CategoryContext';
import { ThemeContext } from './ThemeProvider';
import { Link } from 'react-router-dom';

export default function ManageCategories() {
  const { categories, loading, addCategory, updateCategory, deleteCategory } = useContext(CategoryContext);
  const { theme, dark } = useContext(ThemeContext);

  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  const handleClose = () => {
    setShowModal(false);
    setEditingCategory(null);
    setFormData({ name: '', description: '' });
  };

  const handleShowAdd = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '' });
    setShowModal(true);
  };

  const handleShowEdit = (category) => {
    setEditingCategory(category);
    setFormData({ name: category.name, description: category.description || '' });
    setShowModal(true);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete category "${name}"?`)) {
      deleteCategory(id);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingCategory) {
      updateCategory(editingCategory.id, formData);
    } else {
      addCategory(formData);
    }
    handleClose();
  };

  return (
    <Container className="py-4">
      <Card className="shadow-sm border-0 mb-4" style={{ backgroundColor: theme.cardBg, color: theme.cardText }}>
        <Card.Body className="d-flex justify-content-between align-items-center">
          <div>
            <h3 className="mb-1">Category Management (Admin Only)</h3>
            <p className="text-muted mb-0">Endpoints: <code>/categories</code> and <code>/categories/:categoryId</code></p>
          </div>
          <div className="d-flex gap-2">
            <Button as={Link} to="/admin/orchids" variant="outline-primary">
              Manage Orchids
            </Button>
            <Button variant="success" onClick={handleShowAdd}>
              + Add New Category
            </Button>
          </div>
        </Card.Body>
      </Card>

      {loading ? (
        <p className="text-center">Loading categories...</p>
      ) : (
        <Table striped bordered hover responsive variant={dark ? "dark" : "light"} className="shadow-sm">
          <thead>
            <tr>
              <th style={{ width: '10%' }}>ID</th>
              <th style={{ width: '25%' }}>Category Name</th>
              <th>Description</th>
              <th style={{ width: '20%' }} className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id}>
                <td>{cat.id}</td>
                <td className="fw-bold">{cat.name}</td>
                <td>{cat.description || <em>No description provided</em>}</td>
                <td className="text-center">
                  <Button 
                    variant="warning" 
                    size="sm" 
                    className="me-2" 
                    onClick={() => handleShowEdit(cat)}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="danger" 
                    size="sm" 
                    onClick={() => handleDelete(cat.id, cat.name)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4">No categories found.</td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

      {/* Add / Edit Category Modal */}
      <Modal show={showModal} onHide={handleClose} data-bs-theme={dark ? "dark" : "light"}>
        <Modal.Header closeButton className={dark ? 'bg-dark text-light border-secondary' : ''}>
          <Modal.Title>{editingCategory ? 'Edit Category' : 'Add New Category'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body className={dark ? 'bg-dark text-light' : ''}>
            <Form.Group className="mb-3">
              <Form.Label>Category Name</Form.Label>
              <Form.Control 
                type="text" 
                required 
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g. Dendrobium, Cattleya..."
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3} 
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description about this orchid genus..."
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className={dark ? 'bg-dark border-secondary' : ''}>
            <Button variant="secondary" onClick={handleClose}>Cancel</Button>
            <Button variant="primary" type="submit">
              {editingCategory ? 'Update Category' : 'Save Category'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}
