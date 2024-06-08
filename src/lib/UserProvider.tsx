import { signOut } from "firebase/auth";
import { ReactNode, createContext, useState } from "react";
import { auth } from "./firebase";

type UserContext = {
  currentUser: object;
  login: (userId: string, iconUrl: string, displayName: string, introduction: string)=>void;
  logout: ()=>void;
  update: ( iconUrl: string, displayName: string, introduction: string)=>void;
}

export const UserContext = createContext<UserContext | undefined>(undefined);

type Props = {
  children: ReactNode;
};

export const UserProvider:React.FC<Props> = ({ children }) => {
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