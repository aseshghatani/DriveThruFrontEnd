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
          <Navbar />
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
            <Route path="/menu" element={<MenuPage />} />
          </Routes>
        </CssBaseline>
      </ThemeProvider>
    </>
  );
}

export default App;
