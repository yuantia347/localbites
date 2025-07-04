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
  const { isLoggedIn, isLoadingScreen } = useContext(AuthContext);

  if (isLoadingScreen) {
    return <div>Loading...</div>; // atau bisa ganti dengan spinner/loading page
  }

  return (
    <Routes>
      {/* Public route */}
      <Route path="/" element={<Authentication />} />

      {/* Protected Routes */}
      {isLoggedIn ? (
        <>
          <Route element={<MainLayout />}>
            <Route path="/beranda" element={<Beranda />} />
            <Route path="/usahakuliner" element={<UsahaKuliner />} />
            <Route path="/rekomendasisosmed" element={<RekomendasiSosmed />} />
            <Route path="/resepmasakan" element={<ResepMasakan />} />
            <Route path="/favoritsaya" element={<FavoritSaya />} />
          </Route>
        </>
      ) : (
        <>
          {/* Kalau belum login dan coba akses route selain "/", redirect ke "/" */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </>
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
