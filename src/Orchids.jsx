import { useContext, useState, useMemo, useEffect } from 'react';
import { Container, Row, Col, Form, InputGroup, Button, Badge } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import { OrchidContext } from './OrchidContext';
import { CategoryContext } from './CategoryContext';
import { ThemeContext } from './ThemeProvider';
import OrchidsPresentation from './OrchidsPresentation';

export default function Orchids() {
  const { orchids } = useContext(OrchidContext);
  const { categories } = useContext(CategoryContext);
  const { theme, dark } = useContext(ThemeContext);
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Sync category filter with URL query param if present
  useEffect(() => {
    const urlCat = searchParams.get('category');
    if (urlCat) {
      setSelectedCategory(urlCat);
    }
  }, [searchParams]);

  // Combined list of categories
  const categoryOptions = useMemo(() => {
    const listFromContext = categories.map(c => c.name);
    const listFromOrchids = orchids.map(o => o.category).filter(Boolean);
    const set = new Set([...listFromContext, ...listFromOrchids]);
    return ['All', ...Array.from(set)];
  }, [categories, orchids]);

  // Filtered orchids by name and category
  const filteredOrchids = useMemo(() => {
    return orchids.filter(orchid => {
      const name = (orchid.name || '').toLowerCase();
      const query = searchQuery.toLowerCase().trim();
      const matchName = name.includes(query);

      const matchCategory = selectedCategory === 'All' || orchid.category === selectedCategory;
      return matchName && matchCategory;
    });
  }, [orchids, searchQuery, selectedCategory]);

  const handleReset = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSearchParams({});
  };

  return (
    <Container fluid="lg" className="py-2">
      {/* Search and Category Filter Toolbar */}
      <div 
        className="p-3 mb-4 rounded shadow-sm border-0" 
        style={{ 
          backgroundColor: dark ? '#212529' : '#ffffff', 
          border: dark ? '1px solid #444' : '1px solid #e9ecef' 
        }}
      >
        <Row className="g-3 align-items-center">
          <Col md={6}>
            <InputGroup>
              <InputGroup.Text style={{ backgroundColor: dark ? '#343a40' : '#f8f9fa', color: theme.color }}>
                🔍
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search orchids by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ backgroundColor: dark ? '#2b3035' : '#ffffff', color: theme.color }}
              />
              {searchQuery && (
                <Button variant={dark ? "secondary" : "outline-secondary"} onClick={() => setSearchQuery('')}>
                  ✕
                </Button>
              )}
            </InputGroup>
          </Col>

          <Col md={4}>
            <Form.Select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                if (e.target.value === 'All') {
                  setSearchParams({});
                } else {
                  setSearchParams({ category: e.target.value });
                }
              }}
              style={{ backgroundColor: dark ? '#2b3035' : '#ffffff', color: theme.color }}
            >
              {categoryOptions.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? '🌸 All Categories' : `Category: ${cat}`}
                </option>
              ))}
            </Form.Select>
          </Col>

          <Col md={2} className="text-md-end">
            {(searchQuery || selectedCategory !== 'All') && (
              <Button variant="outline-danger" size="sm" onClick={handleReset} className="w-100">
                Reset Filters
              </Button>
            )}
          </Col>
        </Row>

        <div className="mt-3 d-flex justify-content-between align-items-center">
          <span className="text-muted small">
            Showing <strong>{filteredOrchids.length}</strong> of {orchids.length} orchids
          </span>
          {selectedCategory !== 'All' && (
            <Badge bg="info" className="text-dark">
              Filtering by: {selectedCategory}
            </Badge>
          )}
        </div>
      </div>

      {/* Grid presentation */}
      {filteredOrchids.length === 0 ? (
        <div className="text-center py-5">
          <h4>No orchids match your search or filter.</h4>
          <p className="text-muted">Try adjusting your keyword or selecting a different category.</p>
          <Button variant="primary" onClick={handleReset}>Clear All Filters</Button>
        </div>
      ) : (
        <OrchidsPresentation orchids={filteredOrchids} />
      )}
    </Container>
  );
}
