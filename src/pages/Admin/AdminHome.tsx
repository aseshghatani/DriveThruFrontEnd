import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { replace, useNavigate } from "react-router-dom";
import AdminNavbar from "../../components/AdminNavbar";
import axios from "axios";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
interface User {
  username: string;
  name: string;
  id: number;
  role: string;
}

export default function AdminHome() {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken");
    const storedUser = localStorage.getItem("admin");

    if (!storedToken || !storedUser) {
      navigate("/admin/login");
      return;
    }

    try {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    } catch (e) {
      console.error("Failed to parse stored user", e);
      navigate("/admin/login");
    }
  }, [navigate]);

  // ✅ Guard: don't try to read user.id / name until user is loaded
  if (!user || !token) {
    return <div>Loading...</div>;
  }
  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to Log out");
    if (!confirmed) return;

    navigate("/admin/login", { replace: true });
    localStorage.removeItem("admin");
    localStorage.removeItem("adminToken");
  };

  const handleRestaurant = async () => {
    try {
      const response = await axios("http://localhost:8080/restaurant/all");
      if (response.data.success) {
        navigate("/admin/restaurant", {
          state: {
            restaurant: response.data.data,
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
      <Container>
        <Box sx={{ mt: 3 }}>
          <Typography>ID: {user.id}</Typography>
          <Typography>Name: {user.name}</Typography>
          <Typography>Username: {user.username}</Typography>
          <Typography>Role:{user.role}</Typography>
          <Button sx={{ mt: 3 }} variant="contained" onClick={handleLogout}>
            Logout
          </Button>
        </Box>

        <Box sx={{ display: "flex", mt: 3, flexDirection: "column", gap: 3 }}>
          <Card>
            <CardActionArea
              onClick={handleRestaurant}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Typography sx={{ cursor: "pointer" }} variant="h5">
                  Restaurants
                </Typography>
                <ArrowForwardIcon />
              </CardContent>
            </CardActionArea>
          </Card>
          <Card>
            <CardActionArea
              onClick={handleRestaurant}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Typography sx={{ cursor: "pointer" }} variant="h5">
                  Users
                </Typography>
                <ArrowForwardIcon />
              </CardContent>
            </CardActionArea>
          </Card>
          <Card>
            <CardActionArea
              onClick={handleRestaurant}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "start",
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Typography sx={{ cursor: "pointer" }} variant="h5">
                  Orders
                </Typography>
                <ArrowForwardIcon />
              </CardContent>
            </CardActionArea>
          </Card>
        </Box>
      </Container>
    </>
  );
}
