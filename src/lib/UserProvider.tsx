import { signOut } from "firebase/auth";
import { ReactNode, createContext, useState } from "react";
import { auth } from "./firebase";

export const UserContext = createContext({
  currentUser: {
    userId: "",
    iconUrl: "",
    displayName: "",
    introduction: "",
  },
  login: (userId: string, iconUrl: string, displayName: string, introduction: string) => {},
  logout: () => {},
  update: ( iconUrl: string, displayName: string, introduction: string) => {},
});

type Props = {
  children: ReactNode;
};

export const UserProvider = ({ children }: Props) => {
  const [currentUser, setCurrentUser] = useState({
    userId: "",
    iconUrl: "",
    displayName: "",
    introduction: "",
  });

  const login = (userId: string, iconUrl: string, displayName: string, introduction: string) => {
    setCurrentUser({ userId, iconUrl, displayName, introduction });
  };

  const logout = () => {
    setCurrentUser({ userId: "", iconUrl: "", displayName: "", introduction: "" });
    signOut(auth);
  };

  const update =(iconUrl: string, displayName: string, introduction: string)=> {
    setCurrentUser({...currentUser, iconUrl , displayName, introduction});
  }

  return (
    <UserContext.Provider value={{ currentUser, login, logout, update }}>
      {children}
    </UserContext.Provider>
  );
};