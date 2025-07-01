import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/NavBar";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import HomePage from "./pages/HomePage";
import SingUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/PorfilePage";
import { Toaster } from "react-hot-toast";
import { useThemeStore } from "./store/useThemeStore";

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    checkAuth();
  }, []);
  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className=" size-10 animate-spin" />
      </div>
    );
  return (
    <div data-theme={theme}>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SingUpPage /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route path="/settings" element={<SettingsPage />} />
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
