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

  const getDataProfile = () => {
    getDataPrivate("/api/v1/protected/data")
      .then((resp) => {
        setIsLoadingScreen(false);
        if (resp?.user_logged) {
          setUserProfile((prev) => ({ ...prev, ...resp }));
          setIsLoggedIn(true);
        } else {
          jwtStorage.removeItem();
          setIsLoggedIn(false);
        }
      })
      .catch((err) => {
        setIsLoadingScreen(false);
        setIsLoggedIn(false);
        jwtStorage.removeItem();
        console.log(err);
      });
  };

  useEffect(() => {
    jwtStorage.retrieveToken().then((token) => {
      if (token) {
        const decoded = jwtDecode(token);
        setUserProfile((prev) => ({
          ...prev,
          id_users: decoded.sub, // simpan id_users dari token
        }));
        getDataProfile();
      } else {
        setIsLoadingScreen(false);
      }
    });
  }, []);

  const login = (access_token) => {
    jwtStorage.storeToken(access_token);
    const decoded = jwtDecode(access_token);
    setUserProfile({ id_users: decoded.sub }); // simpan saat login
    getDataProfile();
    navigate("/beranda", { replace: true });
  };

  const logout = () => {
    logoutAPI()
      .then((resp) => {
        if (resp?.isLoggedOut) {
          jwtStorage.removeItem();
          setIsLoggedIn(false);
          setUserProfile({});
          navigate("/login", { replace: true });
        }
      })
      .catch((err) => {
        jwtStorage.removeItem();
        setIsLoggedIn(false);
        setUserProfile({});
        navigate("/login", { replace: true });
        console.log(err);
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
