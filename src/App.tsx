import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { setUser, logout } from "./app/features/userSlice";

import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Dashboard } from "./pages/Dashboard";
import { RoomPage } from "./pages/RoomPage";
import { MyBookings } from "./pages/MyBookings";
import { CreateRoom } from "./pages/CreateRoom";

function App() {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const role = userDoc.exists() ? userDoc.data().role : "user";

        dispatch(
          setUser({
            email: user.email || "",
            uid: user.uid,
            role: role,
          })
        );
      } else {
        dispatch(logout());
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        Checking who you are...
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={isAuthenticated ? <Dashboard /> : <Navigate to="/register" />}
      />

      <Route
        path="/room/:id"
        element={isAuthenticated ? <RoomPage /> : <Navigate to="/login" />}
      />

      <Route
        path="/my-bookings"
        element={isAuthenticated ? <MyBookings /> : <Navigate to="/login" />}
      />

      <Route
        path="/login"
        element={!isAuthenticated ? <Login /> : <Navigate to="/" />}
      />

      <Route
        path="/create-room"
        element={isAuthenticated ? <CreateRoom /> : <Navigate to="/login" />}
      />

      <Route
        path="/register"
        element={!isAuthenticated ? <Register /> : <Navigate to="/" />}
      />
    </Routes>
  );
}

export default App;
