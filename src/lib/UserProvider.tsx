import { signOut } from "firebase/auth";
import { ReactNode, createContext, useContext, useState } from "react";
import { auth } from "./firebase";

type User = {
  userId: string;
  iconUrl: string;
  displayName: string;
  introduction: string;
};

type UserContext = {
  currentUser: User;
  login: (
    userId: string,
    iconUrl: string,
    displayName: string,
    introduction: string
  ) => void;
  logout: () => void;
  update: (iconUrl: string, displayName: string, introduction: string) => void;
};

const UserContext = createContext<UserContext>({
  currentUser: {
    userId: "",
    iconUrl: "",
    displayName: "",
    introduction: "",
  },
  login: () => {},
  logout: () => {},
  update: () => {},
});

type Props = {
  children: ReactNode;
};

export const UserProvider: React.FC<Props> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>({
    userId: "",
    iconUrl: "",
    displayName: "",
    introduction: "",
  });

  const login = (
    userId: string,
    iconUrl: string,
    displayName: string,
    introduction: string
  ) => {
    setCurrentUser({ userId, iconUrl, displayName, introduction });
  };

  const logout = () => {
    setCurrentUser({
      userId: "",
      iconUrl: "",
      displayName: "",
      introduction: "",
    });
    signOut(auth);
  };

  const update = (
    iconUrl: string,
    displayName: string,
    introduction: string
  ) => {
    setCurrentUser({ ...currentUser, iconUrl, displayName, introduction });
  };

  return (
    <UserContext.Provider value={{ currentUser, login, logout, update }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContext => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserはUserPriovider内でのみ利用が可能です');
  }
  return context;
};