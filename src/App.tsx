import { useState } from "react";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

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
          <Home />
        </CssBaseline>
      </ThemeProvider>
    </>
  );
}

export default App;
