import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import AdminPanel from "./components/AdminPanel";
import ClientPanel from "./components/ClientPanel";
import SellerPanel from "./components/SellerPanel";
import Layout from "./components/Layout";
import type { LoginResponse } from "./services/api";

function App() {
  const [user, setUser] = useState<LoginResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData: LoginResponse) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <Layout user={user} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Admin Routes */}
          {user.role === "ADMIN" && (
            <>
              <Route path="/admin" element={<AdminPanel user={user} />} />
              <Route path="/users" element={<AdminPanel user={user} />} />
              <Route path="/products" element={<AdminPanel user={user} />} />
              <Route path="/orders" element={<AdminPanel user={user} />} />
            </>
          )}

          {/* Seller Routes */}
          {(user.role === "VENDEDOR" || user.role === "ADMIN") && (
            <>
              <Route path="/seller" element={<SellerPanel user={user} />} />
              <Route
                path="/manage-orders"
                element={<SellerPanel user={user} />}
              />
              <Route
                path="/manage-products"
                element={<SellerPanel user={user} />}
              />
            </>
          )}

          {/* Client Routes */}
          {(user.role === "CLIENTE" || user.role === "ADMIN") && (
            <>
              <Route path="/client" element={<ClientPanel user={user} />} />
              <Route path="/my-orders" element={<ClientPanel user={user} />} />
              <Route path="/catalog" element={<ClientPanel user={user} />} />
            </>
          )}

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
