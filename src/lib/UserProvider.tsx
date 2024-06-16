import { signOut } from "firebase/auth";
import {
  ReactNode,
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import { auth, db } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

type User = {
  userId: string;
  iconUrl: string;
  displayName: string;
  introduction: string;
};

type UserContext = {
  currentUser: User;
  logout: () => void;
  update: (iconUrl: string, displayName: string, introduction: string) => void;
  isAuthChecked: boolean;
};

const UserContext = createContext<UserContext>({
  currentUser: {
    userId: "",
    iconUrl: "",
    displayName: "",
    introduction: "",
  },
  logout: () => {},
  update: () => {},
  isAuthChecked: false,
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
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {    
    const unSub = onAuthStateChanged(auth, async (user) => {
      if (user) {        
        const docSnap = await getDoc(doc(db, "users", user.uid));
        if (docSnap.exists()) {
          setCurrentUser({
            userId: user.uid,
            iconUrl: docSnap.data().iconUrl,
            displayName: docSnap.data().displayName,
            introduction: docSnap.data().introduction,
          });
        } else {
          setCurrentUser({
            userId: "",
            iconUrl: "",
            displayName: "",
            introduction: "",
          });
        }
      } else {
        setCurrentUser({
          userId: "",
          iconUrl: "",
          displayName: "",
          introduction: "",
        });
      }
      setIsAuthChecked(true);
    });

    return () => unSub();
  }, []);

  const logout = () => {
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
    <UserContext.Provider
      value={{ currentUser, logout, update, isAuthChecked }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContext => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserはUserProvider内でのみ利用が可能です");
  }
  return context;
};
