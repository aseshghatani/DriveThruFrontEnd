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
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const handleSendOtp = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/auth/send-otp",
        {
          to: email,
        },
        {
          headers: { "Content-Type": "application/json" },
        },
      );
      if (response.data.success) {
        navigate("/verify-otp", {
          state: { mail: email, success: response.data.success },
          replace: true,
        });
      }
    } catch (error) {
      console.log(error);
      alert("failed to send otp");
    }
    console.log(email);
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
