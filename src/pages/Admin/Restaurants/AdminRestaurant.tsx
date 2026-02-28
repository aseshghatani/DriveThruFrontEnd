import { Box, Container } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AdminNavbar from "../../../components/AdminNavbar";
const columns: GridColDef<(typeof restaurants)[number]>[] = [
  { field: "id", headerName: "ID", width: 90 },

  { field: "name", headerName: "Restaurant Name", width: 150 },
  {
    field: "active",
    headerName: "Active",
    width: 90,
    valueGetter: (_, restaurants) =>
      restaurants.active ? "Active" : " InActive",
  },
  {
    field: "VegFriendly",
    headerName: "Is Veg",
    width: 90,
    valueGetter: (_, restaurants) =>
      restaurants.VegFriendly ? "Veg" : "Non-Veg",
  },
  { field: "likes", headerName: "Likes", width: 90 },
  { field: "dislikes", headerName: "Dislike", width: 90 },
  {
    field: "City",
    headerName: "City",
    width: 90,
    valueGetter: (_, restaurants) => restaurants.restaurantAddress.city,
  },
];
export default function AdminRestaurant() {
  const location = useLocation();
  const [restaurants, setRestaurants] = useState<any[]>([]);

  useEffect(() => {
    if (location.state?.restaurants) {
      setRestaurants(location.state.restaurants);
      return;
    }

    axios
      .get("http://localhost:8080/restaurant/all")
      .then((res) => setRestaurants(res.data.data || res.data))
      .catch(console.error);
  }, [location.state]);

  if (!restaurants.length) {
    return <Container sx={{ mt: 3 }}>Loading restaurants...</Container>;
  }

  return (
    <>
      <AdminNavbar />
      <Container sx={{ mt: 3 }}>
        <Box sx={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={restaurants}
            columns={columns}
            pageSizeOptions={[5, 10, 25]}
          />
        </Box>
      </Container>
    </>
  );
}
