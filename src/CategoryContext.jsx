import { createContext, useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import { AuthContext } from './AuthProvider';

export const CategoryContext = createContext();

// MockAPI URL for Categories: /categories and /categories/:categoryId
const CATEGORIES_API_URL = 'https://6a48ad2ba033dcb98d64c6a1.mockapi.io/categories';

// Default initial categories in case MockAPI endpoint is not created yet
const INITIAL_CATEGORIES = [
  { id: '1', name: 'Cattleya', description: 'Known as the Queen of Orchids, famous for large showy flowers.' },
  { id: '2', name: 'Phalaenopsis', description: 'Moth Orchids, the most popular house orchid with long-lasting blooms.' },
  { id: '3', name: 'Dendrobium', description: 'Vast diversity, robust growth, and sprays of delicate blooms.' },
  { id: '4', name: 'Vanda', description: 'Renowned for striking vibrant blue and purple colors, thrives in bright light.' },
  { id: '5', name: 'Oncidium', description: 'Dancing Lady orchids, featuring sprays of vibrant yellow or bronze flowers.' },
  { id: '6', name: 'Cymbidium', description: 'Boat orchids, known for cold tolerance and dramatic cascading flower spikes.' }
];

export default function CategoryProvider({ children }) {
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch(CATEGORIES_API_URL);
      if (!res.ok) throw new Error('Failed to fetch categories');
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setCategories(data);
      }
    } catch {
      // Fallback gracefully to default categories
      console.warn('MockAPI categories endpoint not responding, using fallback data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // CRUD Protection: Only Admin can perform modifications
  const addCategory = async (categoryData) => {
    if (user?.role !== 'admin') {
      toast.error('Unauthorized: Only Admin can add categories');
      return false;
    }

    try {
      const res = await fetch(CATEGORIES_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData)
      });
      if (res.ok) {
        toast.success('Category added successfully');
        fetchCategories();
        return true;
      }
      throw new Error();
    } catch {
      // Local fallback in case MockAPI is offline
      const newCategory = { ...categoryData, id: String(Date.now()) };
      setCategories(prev => [...prev, newCategory]);
      toast.success('Category added successfully (saved locally)');
      return true;
    }
  };

  const updateCategory = async (id, categoryData) => {
    if (user?.role !== 'admin') {
      toast.error('Unauthorized: Only Admin can update categories');
      return false;
    }

    try {
      const res = await fetch(`${CATEGORIES_API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData)
      });
      if (res.ok) {
        toast.success('Category updated successfully');
        fetchCategories();
        return true;
      }
      throw new Error();
    } catch {
      setCategories(prev => prev.map(c => c.id === id ? { ...c, ...categoryData } : c));
      toast.success('Category updated successfully (updated locally)');
      return true;
    }
  };

  const deleteCategory = async (id) => {
    if (user?.role !== 'admin') {
      toast.error('Unauthorized: Only Admin can delete categories');
      return false;
    }

    try {
      const res = await fetch(`${CATEGORIES_API_URL}/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        toast.success('Category deleted successfully');
        fetchCategories();
        return true;
      }
      throw new Error();
    } catch {
      setCategories(prev => prev.filter(c => c.id !== id));
      toast.success('Category deleted successfully (removed locally)');
      return true;
    }
  };

  return (
    <CategoryContext.Provider value={{ categories, loading, addCategory, updateCategory, deleteCategory, fetchCategories }}>
      {children}
    </CategoryContext.Provider>
  );
}
