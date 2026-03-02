import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Container,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios";
interface City {
  name: string; // Changed from 'city' to 'name'
}

export default function HomePage() {
  const navigate = useNavigate();
  const [cities, setCities] = useState<string[] | null>(null); // Now string[]

  useEffect(() => {
    const fetchCity = async () => {
      try {
        const res = await axios.get("http://localhost:8080/restaurant/city");
        if (res.data.success) {
          setCities(res.data.data); // Direct array: ["Benagaluru", "Kolkata"]
        }
      } catch (error) {
        console.log("API error:", error);
      }
    };
    fetchCity();
  }, []); // Remove 'city' dependency - causes infinite loop

  const handleReq = (cityName: string) => {
    navigate(`/restaurants?city=${cityName.toLowerCase()}`);
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
          {cities?.map((cityName, index) => (
            <Card key={index}>
              <CardActionArea
                onClick={() => handleReq(cityName)} // Pass string directly
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
                    {cityName} {/* Display string directly */}
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
