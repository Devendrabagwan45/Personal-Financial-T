import { useContext } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import AddTransaction from "./components/AddTransaction";
import Analysis from "./components/Analysis";
import HomePage from "./pages/HomePage";
import { Authcontext } from "../context/AuthContext";
import { Toaster } from "react-hot-toast";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";

const App = () => {
  const { authUser } = useContext(Authcontext);

  return (
    <div className="">
      <Toaster />
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/add"
          element={
            authUser ? (
              <AddTransaction
                onAddTransaction={(transaction) => {
                  /* handle transaction */
                }}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/analysis"
          element={authUser ? <Analysis /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        />
      </Routes>
    </div>
  );
};

export default App;
