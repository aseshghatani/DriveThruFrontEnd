import { Box, Button, Container, TextField, Typography } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function VerifyOtp() {
  const [code, setCode] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.mail;
  const [message, setMessage] = useState("");
  const data = {
    mail: email,
    code: code,
  };

  const verifyOtp = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/auth/verify-otp",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (response.data.success) {
        const { token, user } = response.data.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        navigate("/", {
          state: { token: token },
          replace: true,
        });
      } else {
        setMessage("Otp Verification failed!");
      }
      console.log(response);
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Otp Verification failed due to network error");
      }
    }
  };
  return (
    <div>
      <>
        <Navbar />
        <Container sx={{ mt: 5, p: 2 }}>
          <Box>
            <Typography variant="h4">Login/Register</Typography>
          </Box>
          <Box>
            <Box
              sx={{
                mt: 2,
                display: "flex",
                flexDirection: "column",
                width: 300,
              }}
            >
              {message && (
                <Typography sx={{ color: "red" }}>{message}</Typography>
              )}
              <TextField
                sx={{ mt: 2 }}
                id="outlined-basic"
                value={code}
                label="OTP"
                onChange={(e) => setCode(e.target.value)}
              />
              <Button variant="contained" sx={{ mt: 2 }} onClick={verifyOtp}>
                Verify Otp
              </Button>
            </Box>
          </Box>
        </Container>
      </>
    </div>
  );
}
