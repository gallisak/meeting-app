import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { setUser, logout } from "./app/features/userSlice";

import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Dashboard } from "./pages/Dashboard";
import { RoomPage } from "./pages/RoomPage";
import { MyBookings } from "./pages/MyBookings";

function App() {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(
          setUser({
            email: user.email || "",
            uid: user.uid,
            role: "user",
          })
        );
      } else {
        dispatch(logout());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 font-sans">
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? <Dashboard /> : <Navigate to="/register" />
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/room/:id"
          element={isAuthenticated ? <RoomPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/my-bookings"
          element={isAuthenticated ? <MyBookings /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
