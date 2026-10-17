import { useContext } from 'react';
import { ThemeContext } from './ThemeProvider';

export default function Footer() {
  const { dark } = useContext(ThemeContext);
  
  return (
    <footer style={{
      background: dark ? "#1a1d20" : "#5F7F55",
      height: "100px",
      textAlign: "center",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      marginTop: "50px",
      transition: 'background 0.3s ease'
    }}>
      <p className="mb-0">&copy; 2026 Orchid Collection Lab by Nguyen Minh Bang. Thank you customer.</p>
    </footer>
  );
}

