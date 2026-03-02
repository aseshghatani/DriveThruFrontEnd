import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import CircleIcon from "@mui/icons-material/Circle";

import {
  Box,
  Button,
  CircularProgress,
  Container,
  Icon,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useLocation, useParams } from "react-router-dom";
import VariantAddons from "./Admin/Restaurants/Menu/VariantAddons";
interface Menu {
  id: number;
  name: string;
  veg: boolean;
  available: boolean;
  sellingPrice: number;
  retailPrice: number;
  description: string;
  addOnGroups: AddOnGroup[];
  variantGroup: VariantGroup[];
}
interface AddOnGroup {
  id: number;
  name: string;
  multiple_select: boolean;
  addOns: AddOn[];
}
interface VariantGroup {
  id: number;
  name: string;
  multiple_select: boolean;
  addOns: Variant[];
}
interface Variant {
  id: number;
  item_name: string;
  price: number;
}
interface AddOn {
  id: number;
  item_name: string;
  price: number;
}
export default function MenuPage() {
  const [menu, setMenu] = useState<Menu[] | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (location.state?.menu) {
      setMenu(location.state.menu as Menu[]);
      setLoading(false);
      return;
    }
  }, [location.state]);

  useEffect(() => {
    if (!id || location.state?.menu) return;

    const fetchMenu = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8080/menu/${id}`);
        setMenu(response.data.data);
      } catch (error) {
        console.error("Menu error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <Container sx={{ mt: 3 }}>
          <CircularProgress />
        </Container>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Box sx={{ height: "80px" }}></Box>
      <Container sx={{ mt: 3 }}>
        <Box sx={{ borderBottom: 2 }}>
          <Typography variant="h3" fontWeight="bold" mb={4}>
            Menu
          </Typography>
        </Box>

        {menu?.map((item) => (
          <Box
            key={item.id}
            sx={{
              mt: 3,
              borderBottom: 1,
              py: 3,
            }}
          >
            <Box sx={{ flex: 1, mt: 2 }}>
              <Box>
                {item.veg ? (
                  // ✅ Veg (Green)
                  <Box
                    sx={{
                      border: "2px solid #0f8a44",
                      borderRadius: "5px",
                      width: 20,
                      height: 20,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <CircleIcon
                      sx={{ width: "10px", height: "10px" }}
                      color="success"
                    />
                  </Box>
                ) : (
                  // ✅ Non-Veg (Red/Orange)
                  <Box
                    sx={{
                      border: "2px solid #ff4444", // Red border
                      borderRadius: "5px",
                      width: 20,
                      height: 20,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <CircleIcon
                      sx={{ width: "10px", height: "10px" }}
                      color="error"
                    />
                  </Box>
                )}
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="h6" fontWeight="bold">
                  {item.name.toUpperCase()}
                </Typography>
                {/* Veg Badge */}
              </Box>

              <Box
                sx={{ mt: 0, display: "flex", alignItems: "baseline", gap: 1 }}
              >
                <Typography
                  variant="body1"
                  sx={{ textDecoration: "line-through" }}
                >
                  ₹{item.retailPrice}
                </Typography>
                <Typography variant="h6">₹{item.sellingPrice}</Typography>
              </Box>
              <Typography variant="body1" sx={{ mt: 1 }}>
                {item.description}
              </Typography>
              {!item.available && (
                <Typography color="error.main" variant="body2">
                  Currently Unavailable
                </Typography>
              )}
            </Box>
            <Box sx={{ mt: 3 }}>
              <VariantAddons
                addOnGroup={item.addOnGroups}
                variantGroup={item.variantGroup}
                menuName={`${item.name} • ${item.sellingPrice}`}
              />
            </Box>
          </Box>
        ))}
      </Container>
    </>
  );
}
