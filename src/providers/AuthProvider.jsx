import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { getDataPrivate, logoutAPI } from "../utils/api";
import { jwtStorage } from "../utils/jwt_storage";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState({});
  const [isLoadingScreen, setIsLoadingScreen] = useState(true);

  const navigate = useNavigate();

  const getDataProfile = async () => {
    try {
      const resp = await getDataPrivate("/api/v1/protected/data");
      setIsLoadingScreen(false);

      if (resp?.user_logged) {
        setUserProfile((prev) => ({ ...prev, ...resp }));
        setIsLoggedIn(true);
      } else {
        jwtStorage.removeItem();
        setIsLoggedIn(false);
      }
    } catch (err) {
      setIsLoadingScreen(false);
      setIsLoggedIn(false);
      jwtStorage.removeItem();
      console.error("Error fetching profile:", err);
    }
  };

  useEffect(() => {
    jwtStorage.retrieveToken().then((token) => {
      if (token) {
        const decoded = jwtDecode(token);
        setUserProfile((prev) => ({
          ...prev,
          id_users: decoded.sub,
        }));
        getDataProfile();
      } else {
        setIsLoadingScreen(false);
      }
    });
  }, []);

  const login = async (access_token) => {
    try {
      jwtStorage.storeToken(access_token);
      const decoded = jwtDecode(access_token);
      setUserProfile({ id_users: decoded.sub });
      setIsLoggedIn(true); // Penting agar bisa akses route protected

      const resp = await getDataPrivate("/api/v1/protected/data");
      if (resp?.user_logged) {
        setUserProfile((prev) => ({ ...prev, ...resp }));
      }

      navigate("/beranda", { replace: true });
    } catch (err) {
      console.error("Login process failed:", err);
      jwtStorage.removeItem();
      setIsLoggedIn(false);
    }
  };

  const logout = () => {
    logoutAPI()
      .then((resp) => {
        jwtStorage.removeItem();
        setIsLoggedIn(false);
        setUserProfile({});
        navigate("/", { replace: true }); // ⬅️ Redirect ke halaman login
      })
      .catch((err) => {
        jwtStorage.removeItem();
        setIsLoggedIn(false);
        setUserProfile({});
        navigate("/", { replace: true }); // ⬅️ Tetap redirect jika gagal
        console.error("Logout error:", err);
      });
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        login,
        logout,
        userProfile,
        isLoadingScreen,
        setIsLoadingScreen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
