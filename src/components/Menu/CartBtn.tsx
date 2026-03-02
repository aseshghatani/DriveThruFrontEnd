import React, { useEffect, useState } from "react";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Box, Typography } from "@mui/material";
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

export default function CartBtn() {
  const navigate = useNavigate();

  // ✅ Fix scoping — declare outside if block
  const storedUser = localStorage.getItem("user");
  const user: User | null = storedUser ? JSON.parse(storedUser) : null;
  const id = user?.id;

  const [cartCount, setCartCount] = useState<number>(() => {
    try {
      const raw = sessionStorage.getItem("cart");
      return raw ? JSON.parse(raw).length : 0;
    } catch {
      return 0;
    }
  });

  useEffect(() => {
    const handleCartUpdate = () => {
      try {
        const raw = sessionStorage.getItem("cart");
        setCartCount(raw ? JSON.parse(raw).length : 0);
      } catch {
        setCartCount(0);
      }
    };

    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, []);

  const handleCart = () => {
    if (id) navigate(`/${id}/cart`);
  };

  return (
    <>
      <Box
        onClick={handleCart}
        sx={{
          cursor: "pointer",
          position: "fixed",
          right: "50px",
          bottom: "80px",
        }}
      >
        <Box
          sx={{
            position: "relative",
            inset: 0,
            gap: 2,
            padding: "20px",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#ff5200",
          }}
        >
          {/* ✅ Cart count badge */}
          {cartCount > 0 && (
            <span
              style={{
                position: "absolute",
                width: "35px",
                height: "35px",
                top: "-10%",
                left: "-10%",
                padding: "5px",
                backgroundColor: "#000000",
                color: "white",
                borderRadius: "50%",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {cartCount}
            </span>
          )}
          <Typography color="white" variant="h6">
            Cart
          </Typography>
          <ShoppingCartIcon htmlColor="#ffffff" />
        </Box>
      </Box>
    </>
  );
}
