/* eslint-disable react/prop-types */
import { useContext } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import MainLayout from "./Main";
import HamsterLoader from "../loaders/hamster";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ component }) => {
  const { isLoggedIn, isLoadingScreen } = useContext(AuthContext);

  console.log("PrivateRoute status:", {
    isLoggedIn: isLoggedIn,
    isLoadingScreen: isLoadingScreen,
  });

  if (isLoadingScreen) {
    return <HamsterLoader />;
  }

  if (isLoggedIn) {
    return <MainLayout>{component}</MainLayout>;
  }

  return <Navigate to="/authentication" replace />;
};

export default PrivateRoute;
