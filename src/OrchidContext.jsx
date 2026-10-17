import { createContext, useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import { Orchids as fallbackOrchids } from './ListOfOrchids';
import { AuthContext } from './AuthProvider';

export const OrchidContext = createContext();

// MockAPI URL for Orchids: /orchids and /orchids/:orchidId
const API_URL = 'https://6a48ad2ba033dcb98d64c6a1.mockapi.io/orchids';

export default function OrchidProvider({ children }) {
  const { user } = useContext(AuthContext);

  // Initialize with fallback orchids containing initial feedback schema
  const [orchids, setOrchids] = useState(() => {
    return fallbackOrchids.map((item, idx) => ({
      ...item,
      feedback: idx === 0 ? [
        {
          rating: 5,
          comment: "Awesome orchid!!!",
          author: "student@gmail.com",
          date: "2024-10-16T17:57:28.556094Z"
        }
      ] : (item.feedback || [])
    }));
  });

  const [loading, setLoading] = useState(false);

  const fetchOrchids = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Failed to fetch from MockAPI');
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        // Ensure feedback array exists on all fetched items
        const normalized = data.map(item => ({
          ...item,
          feedback: Array.isArray(item.feedback) ? item.feedback : []
        }));
        setOrchids(normalized);
      }
    } catch {
      console.warn('MockAPI orchids not responding. Using local dataset.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrchids();
  }, []);

  // Admin CRUD Protection
  const addOrchid = async (orchidData) => {
    if (user?.role !== 'admin') {
      toast.error('Access Denied: Only Admin can create orchids');
      return false;
    }

    const payload = {
      ...orchidData,
      feedback: orchidData.feedback || []
    };

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        toast.success('Orchid added successfully');
        fetchOrchids();
        return true;
      }
      throw new Error();
    } catch {
      const newOrchid = { ...payload, id: String(Date.now()) };
      setOrchids(prev => [...prev, newOrchid]);
      toast.success('Orchid added successfully (saved locally)');
      return true;
    }
  };

  const updateOrchid = async (id, orchidData, isFeedbackOnly = false) => {
    // Only Admin can edit orchid info, unless it is a member submitting feedback
    if (!isFeedbackOnly && user?.role !== 'admin') {
      toast.error('Access Denied: Only Admin can update orchid details');
      return false;
    }

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orchidData)
      });
      if (res.ok) {
        if (!isFeedbackOnly) toast.success('Orchid updated successfully');
        fetchOrchids();
        return true;
      }
      throw new Error();
    } catch {
      setOrchids(prev => prev.map(o => o.id === id ? { ...o, ...orchidData } : o));
      if (!isFeedbackOnly) toast.success('Orchid updated successfully (saved locally)');
      return true;
    }
  };

  const deleteOrchid = async (id) => {
    if (user?.role !== 'admin') {
      toast.error('Access Denied: Only Admin can delete orchids');
      return false;
    }

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        toast.success('Orchid deleted successfully');
        fetchOrchids();
        return true;
      }
      throw new Error();
    } catch {
      setOrchids(prev => prev.filter(o => o.id !== id));
      toast.success('Orchid deleted successfully (removed locally)');
      return true;
    }
  };

  // Dedicated member feedback submission
  const submitFeedback = async (orchidId, feedbackEntry) => {
    const target = orchids.find(o => String(o.id) === String(orchidId));
    if (!target) return false;

    const currentFeedback = Array.isArray(target.feedback) ? target.feedback : [];
    
    // Constraint check: One feedback per member
    if (currentFeedback.some(f => f.author === feedbackEntry.author)) {
      toast.warning('You have already submitted feedback for this orchid');
      return false;
    }

    const updatedFeedback = [...currentFeedback, feedbackEntry];
    const updatedOrchid = {
      ...target,
      feedback: updatedFeedback
    };

    const success = await updateOrchid(orchidId, updatedOrchid, true);
    if (success) {
      toast.success('Thank you for your feedback & rating!');
      return true;
    }
    return false;
  };

  return (
    <OrchidContext.Provider value={{ 
      orchids, 
      loading, 
      addOrchid, 
      updateOrchid, 
      deleteOrchid, 
      submitFeedback,
      fetchOrchids 
    }}>
      {children}
    </OrchidContext.Provider>
  );
}
