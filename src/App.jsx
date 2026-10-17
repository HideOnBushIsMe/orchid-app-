import { Routes, Route } from 'react-router-dom';
import { useContext } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Navigation from './Navigation';
import Footer from './Footer';
import Orchids from './Orchids';
import Detail from './Detail';
import Naturals from './Naturals';
import Contact from './Contact';
import Cart from './Cart';
import Dashboard from './Dashboard';
import ManageCategories from './ManageCategories';
import Profile from './Profile';
import AdminRoute from './AdminRoute';
import OrchidProvider from './OrchidContext';
import CategoryProvider from './CategoryContext';
import AuthProvider from './AuthProvider';
import ThemeProvider, { ThemeContext } from './ThemeProvider';
import { CartProvider } from './CartContext';

function AppContent() {
  const { theme } = useContext(ThemeContext);

  return (
    <div style={{
      backgroundColor: theme.backgroundColor,
      color: theme.color,
      transition: 'all 0.3s ease'
    }}>
      <Navigation />
      <ToastContainer position="bottom-right" autoClose={3000} />
      <main className="min-vh-100">
        <div className="container-fluid py-4">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Orchids />} />
            <Route path="/orchids" element={<Orchids />} />
            <Route path="/detail/:id" element={<Detail />} />
            <Route path="/orchids/:id" element={<Detail />} />
            <Route path="/naturals" element={<Naturals />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cart" element={<Cart />} />
            
            {/* Member Profile Route */}
            <Route path="/profile" element={<Profile />} />

            {/* Admin Restricted Routes */}
            <Route path="/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
            <Route path="/admin/orchids" element={<AdminRoute><Dashboard /></AdminRoute>} />
            <Route path="/admin/categories" element={<AdminRoute><ManageCategories /></AdminRoute>} />
            <Route path="/categories" element={<AdminRoute><ManageCategories /></AdminRoute>} />
            <Route path="/categories/:categoryId" element={<AdminRoute><ManageCategories /></AdminRoute>} />
          </Routes>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <CartProvider>
          <CategoryProvider>
            <OrchidProvider>
              <AppContent />
            </OrchidProvider>
          </CategoryProvider>
        </CartProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
