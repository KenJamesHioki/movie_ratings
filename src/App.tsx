import React, { useContext, useEffect, useState } from "react";
import "./App.css";
import { Login } from "./component/pages/Login";
import { UserContext } from "./lib/UserProvider";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./lib/firebase";
import { Home } from "./component/pages/Home";
import { doc, getDoc } from "firebase/firestore";
import { Movie } from "./component/pages/Movie";
import { Route, Routes } from "react-router-dom";
import { Profile } from "./component/pages/Profile";
import { Loader } from "./component/atoms/Loader";
import { EditProfile } from "./component/pages/EditProfile";

function App() {
  const { currentUser, login, logout } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, async (user) => {
      setIsLoading(true);
      try {
        if (user) {
          const userInfoSnap = await getDoc(doc(db, "users", user.uid));
          login(
            user.uid,
            userInfoSnap.data().iconUrl,
            userInfoSnap.data().displayName,
            userInfoSnap.data().introduction,
          );
        } else {
          logout();
        }
      } catch (error: any) {
        console.error(error.message);
      } finally {
        setIsLoading(false);
      }
    });

    return () => unSub();
  }, []);

  console.log(currentUser);

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={currentUser.userId ? <Home /> : <Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/:userId" element={<Profile />} />
        <Route path="/edit_profile" element={<EditProfile />} />
        <Route path="/movie/:movieId" element={<Movie />} />
      </Routes>
      {isLoading && <Loader />}
    </div>
  );
}

export default App;
