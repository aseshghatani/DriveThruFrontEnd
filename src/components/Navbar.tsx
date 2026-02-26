import { Box, colors, Container, Typography } from "@mui/material";
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
function Navbar() {
  const navigate = useNavigate();
  const [checkUser, setCheckUser] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (!token || !storedUser) {
      setCheckUser(false);
    } else {
      setUser(JSON.parse(storedUser));
      setCheckUser(true);
    }
  });

  const handleClick = () => {
    if (checkUser) {
      navigate("/profile");
    }
  };

  return (
    <>
      <Box sx={{ py: 2, bgcolor: "primary.main", color: "white" }}>
        <Container>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h3">DriveThru</Typography>
            {checkUser && <Typography variant="h4">{user?.name}</Typography>}
          </Box>
        </Container>
      </Box>
    </>
  );
}

export default Navbar;
