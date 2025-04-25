import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import RegisterPage from "./pages/RegisterPage";
import ScanPage from "./pages/ScanPage";
import HistoryPage from "./pages/HistoryPage";


function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/scan"
        element={
          <PrivateRoute>
            <ScanPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/history"
        element={
          <PrivateRoute>
            <HistoryPage />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;

