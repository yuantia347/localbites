import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";

import "antd/dist/reset.css";
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";
import "./assets/styles/adaptive.css";

import Beranda from "./pages/Beranda";
import Authentication from "./pages/Authentication";
import MainLayout from "./components/layout/Main";
import RekomendasiSosmed from "./pages/RekomendasiSosmed";
import ResepMasakan from "./pages/ResepMasakan";
import FavoritSaya from "./pages/FavoritSaya";
import UsahaKuliner from "./pages/Usahakuliner";
import AuthProvider, { AuthContext } from "./providers/AuthProvider";

function AppRoutes() {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <Routes>
      {/* Jika sudah login, akses "/" akan diarahkan ke "/beranda" */}
      <Route path="/" element={isLoggedIn ? <Navigate to="/beranda" /> : <Authentication />} />

      {/* Protected Routes */}
      {isLoggedIn ? (
        <Route element={<MainLayout />}>
          <Route path="/beranda" element={<Beranda />} />
          <Route path="/usahakuliner" element={<UsahaKuliner />} />
          <Route path="/rekomendasisosmed" element={<RekomendasiSosmed />} />
          <Route path="/resepmasakan" element={<ResepMasakan />} />
          <Route path="/favoritsaya" element={<FavoritSaya />} />
        </Route>
      ) : (
        <Route path="*" element={<Navigate to="/" replace />} />
      )}
    </Routes>
  );
}

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </div>
  );
}

export default App;
