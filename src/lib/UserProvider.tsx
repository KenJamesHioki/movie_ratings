import { signOut } from "firebase/auth";
import { ReactNode, createContext, useState } from "react";
import { auth } from "./firebase";

export const UserContext = createContext({
  currentUser: {
    userId: "",
    iconUrl: "",
    displayName: "",
  },
  login: (userId: string, iconUrl: string, displayName: string) => {},
  logout: () => {},
});

type Props = {
  children: ReactNode;
};

export const UserProvider = ({ children }: Props) => {
  const [currentUser, setCurrentUser] = useState({
    userId: "",
    iconUrl: "",
    displayName: "",
  });

  const login = (userId: string, iconUrl: string, displayName: string) => {
    setCurrentUser({ userId, iconUrl, displayName });
  };

  const logout = () => {
    setCurrentUser({ userId: "", iconUrl: "", displayName: "" });
    signOut(auth);
  };

  return (
    <UserContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};