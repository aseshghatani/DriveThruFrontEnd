import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CircularProgress,
  Container,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

// ✅ Type definitions
interface RestaurantAddress {
  id: number;
  address: string;
  city: string;
  landmark: string;
}

interface Restaurant {
  id: number;
  name: string;
  VegFriendly: boolean;
  active: boolean;
  likes: number;
  dislikes: number;
  restaurantAddress: RestaurantAddress;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: Restaurant[];
}

export default function Restaurant() {
  const [searchParams] = useSearchParams();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]); // ✅ Typed
  const [loading, setLoading] = useState<boolean>(true);
  const city: string | null = searchParams.get("city");

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      if (!city) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get<ApiResponse>(
          "http://localhost:8080/restaurant",
          {
            params: { city },
          },
        );
        setRestaurants(response.data.data || []);
      } catch (error: unknown) {
        console.error("Error fetching restaurants:", error);
        setRestaurants([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [city]);

  return (
    <Container sx={{ mt: 3 }}>
      {/* Header */}
      <Typography
        variant="h4"
        gutterBottom
        sx={{ textTransform: "capitalize" }}
      >
        Restaurants in {city || "Unknown"}
      </Typography>

      {/* Content */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)", // ✅ Better responsive
          gap: 3,
        }}
      >
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : restaurants.length > 0 ? (
          // ✅ Map over typed restaurants
          restaurants.map((restaurant: Restaurant) => (
            <Card key={restaurant.id} sx={{ cursor: "pointer" }}>
              <CardActionArea>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    {restaurant.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    {restaurant.restaurantAddress?.city},{" "}
                    {restaurant.restaurantAddress?.address}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {restaurant.restaurantAddress?.landmark}
                  </Typography>
                  {restaurant.VegFriendly && (
                    <Typography color="success.main" fontWeight="bold">
                      🌿 Veg Friendly
                    </Typography>
                  )}
                </CardContent>
              </CardActionArea>
            </Card>
          ))
        ) : (
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ textAlign: "center", py: 8 }}
          >
            No restaurants found in {city || "your city"}
          </Typography>
        )}
      </Box>
    </Container>
  );
}
