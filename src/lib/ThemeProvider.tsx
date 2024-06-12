import { ReactNode, createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

type ThemeContext = {
  theme: Theme;
  toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContext>({
  theme: "dark",
  toggleTheme: () => {},
});

type Props = {
  children: ReactNode;
};

export const ThemeProvider: React.FC<Props> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const savedTheme: string | null = localStorage.getItem("theme");
    if (savedTheme !== null) {
      setTheme(savedTheme as Theme);
    }    
    document.body.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.body.classList.remove(theme);
    document.body.classList.add(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContext => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useUserはUserPriovider内でのみ利用が可能です');
  }
  return context;
};