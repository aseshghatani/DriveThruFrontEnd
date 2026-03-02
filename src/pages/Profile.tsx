import { Box, Button, Container, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios";
import Accordion from "@mui/material/Accordion";
import AccordionActions from "@mui/material/AccordionActions";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { green } from "@mui/material/colors";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  is_veg: boolean;
  createdAt: string;
  updatedAt: string;
}

interface OrderHistory {
  id: number;
  order_number: number;
  total_amount: number;
  item_count: number;
  orderItems: OrderItem[];
  createdAt: string;
  status: string;
  updatedAt: string;
}

interface OrderItem {
  id: number;
  menu_id: number;
  menu_name: string;
  selections: {
    addon: Addon[];
    variant: Variant[];
  };
  unit_price: number;
  total_price: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

interface Addon {
  name: string;
  price: number;
}

interface Variant {
  name: string;
  price: number;
}
export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [orderHistory, setOrderHistory] = useState<OrderHistory[] | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (!token || !storedUser) {
      navigate("/send-otp", { replace: true });
      return;
    }
    setUser(JSON.parse(storedUser));
  }, [navigate]);
  useEffect(() => {
    const fetchorderHistory = async () => {
      console.log(user.id);
      const res = await axios.get(`http://localhost:8080/order/${user?.id}`);
      if (res.data.success) {
        setOrderHistory(res.data.data);
        return;
      }
    };
    fetchorderHistory();
  }, [user?.id]);
  const handleLogOut = () => {
    const confirmed = window.confirm("Are you sure you want to Log out");
    if (!confirmed) return;
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/send-otp", { replace: true });
  };
  if (!user) {
    return null;
  }
  return (
    <>
      <Navbar />
      <Box sx={{ height: "80px" }}></Box>
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

        <Box>
          <Typography variant="h3" sx={{ mt: 3 }}>
            Orders
          </Typography>
          <Box sx={{ mt: 3 }}>
            {orderHistory?.map((orders) => (
              <Accordion key={orders.id}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                >
                  <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
                    <Typography component="span">
                      order-id: #{orders.order_number}
                    </Typography>
                    <span
                      style={{
                        padding: 3,
                        borderRadius: 5,
                        color: "white",
                        backgroundColor:
                          orders.status === "PENDING"
                            ? "#ff9900" // Orange
                            : orders.status === "COMPLETED"
                              ? "#09a7099f" // Green
                              : "#f443369f", // Red for CANCELLED
                      }}
                    >
                      {orders.status}
                    </span>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  {orders.orderItems.map((items) => (
                    <Box
                      sx={{
                        display: "flex",
                        gap: 5,
                        width: "100%",
                        justifyContent: "space-between",
                      }}
                      key={items.id}
                    >
                      <Typography>
                        {items.menu_name} x{items.quantity}
                      </Typography>
                      <Typography>₹{items.total_price}</Typography>
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
                    <Typography>₹{orders.total_amount}</Typography>
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Box>
      </Container>
    </>
  );
}
