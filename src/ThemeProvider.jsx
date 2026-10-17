import { createContext, useState } from "react";

const themes = {
  dark: {
    backgroundColor: "#212529",
    color: "white",
    cardBg: "#343a40",
    cardText: "white"
  },
  light: {
    backgroundColor: "#f8f9fa",
    color: "black",
    cardBg: "white",
    cardText: "black"
  },
};

export const ThemeContext = createContext();

export default function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => {
    return localStorage.getItem("dark") === "true";
  });

  const toggle = () => {
    const isDark = !dark;
    localStorage.setItem("dark", String(isDark));
    setDark(isDark);
  };

  const theme = dark ? themes.dark : themes.light;

  return (
    <ThemeContext.Provider value={{ theme, toggle, dark }}>
      {children}
    </ThemeContext.Provider>
  );
}

