import { ReactNode, createContext, useEffect, useState } from "react";

type Theme = 'light' | 'dark';

type ThemeContext = {
  theme: Theme;
  toggleTheme: ()=>void;
}

export const ThemeContext = createContext<ThemeContext | undefined>(undefined);

type Props = {
  children: ReactNode;
}

export const ThemeProvider: React.FC<Props> =({children})=> {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(()=> {
    document.body.classList.add(theme);
  },[])

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme);
    document.body.classList.remove(theme);
    document.body.classList.add(newTheme);
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}