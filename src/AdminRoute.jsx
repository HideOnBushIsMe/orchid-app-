import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { Container, Card, Button } from 'react-bootstrap';
import { AuthContext } from './AuthProvider';
import { ThemeContext } from './ThemeProvider';

export default function AdminRoute({ children }) {
  const { user } = useContext(AuthContext);
  const { theme, dark } = useContext(ThemeContext);

  if (!user) {
    return (
      <Container className="py-5 text-center">
        <Card className="p-4 mx-auto shadow-sm" style={{ maxWidth: '500px', backgroundColor: theme.cardBg, color: theme.cardText }}>
          <h3 className="text-warning mb-3">Authentication Required</h3>
          <p>You need to be logged in with an Admin account to access this page.</p>
          <Button variant="primary" onClick={() => window.location.href = '/'}>
            Return to Home
          </Button>
        </Card>
      </Container>
    );
  }

  if (user.role !== 'admin') {
    return (
      <Container className="py-5 text-center">
        <Card className="p-5 mx-auto shadow border-danger" style={{ maxWidth: '550px', backgroundColor: theme.cardBg, color: theme.cardText }}>
          <h2 className="text-danger mb-3">403 - Access Denied</h2>
          <p className="lead mb-4">
            Hello <strong>{user.name}</strong>, your account (<code>{user.email}</code>) has <strong>MEMBER</strong> permissions. 
            Full CRUD operations on Orchids and Categories are restricted exclusively to <strong>ADMIN</strong> users.
          </p>
          <div>
            <Button variant="outline-primary" onClick={() => window.location.href = '/'}>
              Go to Orchids Gallery
            </Button>
          </div>
        </Card>
      </Container>
    );
  }

  return children;
}
