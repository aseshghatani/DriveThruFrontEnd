import { useState } from "react";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline, Menu } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import VerifyOtp from "./pages/VerifyOtp";
import Profile from "./pages/Profile";

import ProtectedRoute from "./components/ProtectedRoute";
import MenuPage from "./pages/MenuPage";
import HomePage from "./pages/HomePage";
import Restaurant from "./pages/Restaurant";
import Login from "./pages/Admin/Login";
import AdminHome from "./pages/Admin/AdminHome";
import AdminRestaurant from "./pages/Admin/Restaurants/AdminRestaurant";
import DataGridDemo from "./components/DataGridDemo";

function App() {
  const theme = createTheme({
    palette: {
      mode: "light",
      // background: {
      //   default: "#0f1214",
      // },
      // text: {
      //   primary: "white",
      // },

      // 👈 THIS makes everything white background
    },
  });

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline>
          <Routes>
            <Route path="/send-otp" element={<Home />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            <Route path="/admin/login" element={<Login />} />
            <Route path="/restaurants" element={<Restaurant />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute redirectTo="/admin/login">
                  <AdminHome />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/restaurant"
              element={
                <ProtectedRoute redirectTo="/admin/login">
                  <AdminRestaurant />
                </ProtectedRoute>
              }
            />
            <Route path="/admin/trial" element={<DataGridDemo />} />
          </Routes>
        </CssBaseline>
      </ThemeProvider>
    </>
  );
}

export default App;
