import { createContext, useReducer, useEffect } from 'react';

// Define the initial state for the cart, load from local storage if exists
const loadInitialState = () => {
  try {
    const savedCart = localStorage.getItem('shopping_cart');
    if (savedCart) {
      return JSON.parse(savedCart);
    }
  } catch (e) {
    console.error("Failed to parse cart from local storage", e);
  }
  return { items: [] };
};

const initialState = loadInitialState();

// Define the reducer function
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(item => item.id === action.payload.id);
      if (existingItemIndex >= 0) {
        // Item exists, update quantity
        const newItems = [...state.items];
        newItems[existingItemIndex].quantity += 1;
        return { ...state, items: newItems };
      } else {
        // New item
        return { ...state, items: [...state.items, { ...action.payload, quantity: 1 }] };
      }
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload.id),
      };
    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(item => item.id !== id),
        };
      }
      const newItems = state.items.map(item =>
        item.id === id ? { ...item, quantity } : item
      );
      return { ...state, items: newItems };
    }
    case 'CLEAR_CART':
      return { items: [] };
    default:
      return state;
  }
};

// Create the Context
export const CartContext = createContext();

// Create the Provider component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Save to local storage whenever state changes
  useEffect(() => {
    localStorage.setItem('shopping_cart', JSON.stringify(state));
  }, [state]);

  // Calculate totals
  const totalQuantity = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ state, dispatch, totalQuantity, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};
