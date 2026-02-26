import React, { useState } from "react";
import Navbar from "../components/Navbar";
import {
  Box,
  Button,
  colors,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";

function Home() {
  const [email, setEmail] = useState("");
  const handleSendOtp = async () => {
    try {
      const response = await axios.post("http://localhost:8080/auth/send-otp", {
        email: email,
      });
      console.log(email);
      console.log(response);
    } catch (error) {
      console.log(error);
      alert("failed to send otp");
    }
  };

  return (
    <>
      <Container sx={{ mt: 5, p: 2 }}>
        <Box>
          <Typography variant="h4">Login/Register</Typography>
        </Box>
        <Box>
          <Box
            sx={{ mt: 2, display: "flex", flexDirection: "column", width: 300 }}
          >
            <TextField
              id="outlined-basic"
              value={email}
              label="email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button variant="contained" sx={{ mt: 2 }} onClick={handleSendOtp}>
              Send Otp
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
}

export default Home;
