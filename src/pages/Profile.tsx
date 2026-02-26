import { Box, Button, Container, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  is_veg: boolean;
  createdAt: string;
  updatedAt: string;
}
export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (!token || !storedUser) {
      navigate("/send-otp", { replace: true });
      return;
    }
    setUser(JSON.parse(storedUser));
  }, [navigate]);
  const handleLogOut = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/send-otp", { replace: true });
  };
  if (!user) {
    return null;
  }
  return (
    <>
      <Container sx={{ mt: 3 }}>
        <Typography variant="h2">Welcome</Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            sx={{ mt: 2 }}
            id="outlined-basic"
            value={user.name}
            label="Name"
          />
          <TextField
            sx={{ mt: 2 }}
            id="outlined-basic"
            value={user.email}
            label="email"
          />
          <TextField
            sx={{ mt: 2 }}
            id="outlined-basic"
            value={user.phone}
            label="phone"
          />
        </Box>
        <TextField
          sx={{ mt: 2 }}
          id="outlined-basic"
          value={user.is_veg ? "veg" : "Non-veg"}
          label="preferences"
        />
        <Box sx={{ mt: 3 }}>
          <Button variant="contained" onClick={handleLogOut}>
            Log Out
          </Button>
        </Box>
      </Container>
    </>
  );
}
