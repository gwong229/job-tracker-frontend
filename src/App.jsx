import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";

function Home() {
  const { user, logout } = useAuth();
  return (
    <div className="max-w-xl mx-auto mt-16 text-center">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">Job Application Tracker</h1>
      <p className="mb-4">Logged in as {user.username}</p>
      <button
        onClick={logout}
        className="bg-gray-200 rounded px-3 py-2 font-semibold"
      >
        Log Out
      </button>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;