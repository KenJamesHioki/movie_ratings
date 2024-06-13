import "./App.css";
import { Login } from "./component/pages/Login";
import { useUser } from "./lib/UserProvider";
import { Home } from "./component/pages/Home";
import { Movie } from "./component/pages/Movie";
import { Route, Routes } from "react-router-dom";
import { MyPage } from "./component/pages/MyPage";
import { Loader } from "./component/atoms/Loader";
import { EditProfile } from "./component/pages/EditProfile";

function App() {
  const { currentUser, isAuthChecked } = useUser();

  if (!isAuthChecked) {
    return <Loader />;
  }

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={currentUser.userId ? <Home /> : <Login />} />
        <Route
          path="/:paramMovieTitle"
          element={currentUser.userId ? <Home /> : <Login />}
        />
        <Route
          path="/mypage"
          element={currentUser.userId ? <MyPage /> : <Login />}
        />
        <Route
          path="/mypage/:paramUserId"
          element={currentUser.userId ? <MyPage /> : <Login />}
        />
        <Route
          path="/edit_profile"
          element={currentUser.userId ? <EditProfile /> : <Login />}
        />
        <Route
          path="/movie/:paramMovieId"
          element={currentUser.userId ? <Movie /> : <Login />}
        />
      </Routes>
    </div>
  );
}

export default App;
