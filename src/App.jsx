import { Routes, Route, Outlet } from "react-router-dom";

import "antd/dist/reset.css";
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";
import "./assets/styles/adaptive.css";

import Beranda from "./pages/Beranda";
import PrivateRoute from "./components/layout/PrivateRoute";
import AuthProvider from "./providers/AuthProvider";

import Authentication from "./pages/Authentication";
import MainLayout from "./components/layout/Main"; 
import RekomendasiSosmed from "./pages/RekomendasiSosmed";
import ResepMasakan from "./pages/ResepMasakan";
import FavoritSaya from "./pages/FavoritSaya";
import UsahaKuliner from "./pages/Usahakuliner";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Authentication />} />
          <Route path="/authentication" element={<Authentication />} />

          {/* Protected Routes with Layout */}
          <Route element={<PrivateRoute component={<MainLayout />} />}>
            <Route path="/beranda" element={<Beranda />} />
            <Route path="/usahakuliner" element={<UsahaKuliner />} />
            <Route path="/rekomendasisosmed" element={<RekomendasiSosmed />} />
            <Route path="/resepmasakan" element={<ResepMasakan />} />
            <Route path="/favoritsaya" element={<FavoritSaya />} />
          </Route>
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
