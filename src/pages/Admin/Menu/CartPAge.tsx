import React, { useEffect, useState } from "react";
import Navbar from "../../../components/Navbar";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Container,
  Snackbar,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { clearCart, removeFromCart } from "../../../utils/cart";
import axios from "axios";
import { useParams } from "react-router-dom";

interface AddonSelection {
  name: string;
  price: number;
}

interface VariantSelection {
  name: string;
  price: number;
}

interface OrderItem {
  id: number;
  menu_id: number;
  menu_name: string;
  selections: {
    addon: AddonSelection[];
    variant: VariantSelection[];
  };
  unit_price: number;
  total_price: number;
  quantity: number;
}
interface Orders {
  order_number: number;
  total_amount: number;
  item_count: number;
  orderItems: OrderItem[];
  createdAt: string;
  status: string;
}

type Cart = OrderItem[];
export default function CartPAge() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });
  const userId = useParams();
  useEffect(() => {
    const fetchCart = sessionStorage.getItem("cart") ?? "[]";
    setCart(JSON.parse(fetchCart));
  }, []);
  const handleCartRemove = (id: number) => {
    removeFromCart(id);
    setCart((prev) => (prev ? prev.filter((item) => item.id !== id) : []));
  };
  const totalPrice = cart?.reduce((sum, item) => sum + item.total_price, 0);

  const { id } = useParams(); // ✅ destructure properly

  const handleOrder = async () => {
    if (!cart || cart.length === 0) return;

    const payload: Omit<
      Orders,
      "id" | "order_number" | "createdAt" | "updatedAt" | "status"
    > = {
      total_amount: totalPrice ?? 0,
      item_count: cart.length,
      orderItems: cart.map((item) => ({
        id: item.id,
        menuId: item.menu_id,
        menuName: item.menu_name,
        selections: {
          variant: item.selections.variant,
          addon: item.selections.addon,
        },
        unit_price: item.unit_price,
        total_price: item.total_price,
        quantity: item.quantity,
        createdAt: "",
        updatedAt: "",
      })),
    };

    try {
      const res = await axios.post(
        `http://localhost:8080/order/${id}/create`,
        payload,
      );
      if (res.data.success) {
        clearCart();
        setCart([]);
        setSnackbar({
          open: true,
          message: `HURRAH! Order Placed Successfully`,
          severity: "success",
        });
      } else {
        console.log("error while placing order", res.data.message);
      }
    } catch (error) {
      console.error("Order failed:", error);
    }
  };
  return (
    <>
      <Navbar />
      <Box sx={{ height: "80px" }}></Box>
      <Container sx={{ mt: 3 }}>
        <Box
          sx={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h5" sx={{ mt: 3 }}>
            Cart
          </Typography>
          {cart?.length > 0 ? (
            <Button onClick={handleOrder} color="warning" variant="contained">
              Place Order
            </Button>
          ) : (
            ""
          )}
        </Box>

        <Box sx={{ mt: 3 }}>
          <Accordion defaultExpanded>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              {cart?.length > 0 ? (
                <Typography>Wow Your cart makes me Hungry!</Typography>
              ) : (
                <Typography>Your Cart is empty Add Something to Eat</Typography>
              )}
            </AccordionSummary>
            <AccordionDetails>
              {cart?.map((item) => (
                <Box
                  key={item.id}
                  sx={{
                    display: "flex",
                    gap: 5,
                    width: "100%",
                    justifyContent: "space-between",
                    mt: 3,
                  }}
                >
                  <Typography>
                    {" "}
                    {item.menu_name} x {item.quantity} - ₹{item.total_price}
                  </Typography>
                  <Typography> </Typography>
                  <Button onClick={() => handleCartRemove(item.id)}>
                    Delete
                  </Button>
                </Box>
              ))}

              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderTop: "1px solid gray",
                  py: 2,
                  mt: 2,
                }}
              >
                <Typography>Total Amount:</Typography>
                <Typography>₹{totalPrice} </Typography>
              </Box>
            </AccordionDetails>
          </Accordion>
        </Box>
      </Container>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
