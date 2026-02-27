import React, { useEffect, useState } from "react";
import AdminNavbar from "../../components/AdminNavbar";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/admin/login",
        {
          username: username,
          password: password,
        },
        {
          headers: { "Content-Type": "application/json" },
        },
      );
      if (response.data.success) {
        const { user, token } = response.data.data;
        localStorage.setItem("adminToken", token);
        localStorage.setItem("admin", JSON.stringify(user));
        navigate("/admin", {
          state: {
            token: token,
          },
        });
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <AdminNavbar />

      <Container sx={{ mt: 5, p: 2 }}>
        <Box>
          <Typography variant="h4">Admin Login</Typography>
        </Box>
        <Box>
          <Box
            sx={{ mt: 2, display: "flex", flexDirection: "column", width: 300 }}
          >
            <TextField
              id="outlined-basic"
              value={username}
              label="username"
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              sx={{ mt: 2 }}
              id="outlined-basic"
              value={password}
              label="password"
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button variant="contained" sx={{ mt: 2 }} onClick={handleLogin}>
              Login
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
}
