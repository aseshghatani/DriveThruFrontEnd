import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Container,
  Typography,
} from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function HomePage() {
  const city = [
    {
      name: "Kolkata",
    },
    {
      name: "Mumbai",
    },
    {
      name: "Delhi",
    },
    {
      name: "Chennai",
    },
    {
      name: "Bangalore",
    },
  ];
  const navigate = useNavigate();
  const handleReq = (city: String) => {
    navigate(`/restaurants?city=${city.toLocaleLowerCase()}`);
  };
  return (
    <>
      <Navbar />
      <Container sx={{ mt: 3 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 3,
          }}
        >
          {city.map((city) => (
            <Card>
              <CardActionArea
                onClick={() => handleReq(city.name)}
                sx={{
                  maxWidth: 345,
                  aspectRatio: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CardContent>
                  <Typography sx={{ cursor: "pointer" }} variant="h5">
                    {city.name}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Box>
      </Container>
    </>
  );
}
