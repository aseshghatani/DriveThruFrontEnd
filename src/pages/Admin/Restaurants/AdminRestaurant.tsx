import { Box, Button, Container } from "@mui/material";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import AdminNavbar from "../../../components/AdminNavbar";
import AddIcon from "@mui/icons-material/Add";
import EditButton from "../../../components/EditButton";
import DeletePage from "../../../components/DeletePage";
interface RestaurantAddress {
  city: string;
  address: string;
  landmark: string;
}

interface Restaurant {
  id: number;
  name: string;
  active: boolean;
  VegFriendly: boolean;
  restaurantAddress?: RestaurantAddress;
}

export default function AdminRestaurant() {
  const location = useLocation();
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const fetchRestaurants = async () => {
    axios
      .get("http://localhost:8080/restaurant/all")
      .then((res) => setRestaurants(res.data.data || res.data))
      .catch(console.error);
  };
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
    {
      field: "action",
      headerName: "Action",
      width: 150,
      flex: 1,
      type: "actions",
      renderCell: (parms) => (
        <>
          <EditButton
            restaurant={parms.row}
            onSave={async (data) => {
              console.log("Id of the current restuarant:", data.id);
              console.log("sending backed data", data);
              const payload = {
                name: data.name,
                active: data.active,
                vegFriendly: data.VegFriendly, // camelCase to match backend
                city: data.restaurantAddress?.city ?? "",
                address: data.restaurantAddress?.address ?? "",
                landmark: data.restaurantAddress?.landmark ?? "",
              };

              await axios.put(
                `http://localhost:8080/restaurant/update/${data.id}`,
                payload,
              );
              await fetchRestaurants();
            }}
          >
            <EditIcon />
          </EditButton>

          <DeletePage
            name={parms.row.name}
            id={parms.row.id}
            onDelete={async (id) => {
              await axios.delete(`http://localhost:8080/restaurant/${id}`);
              await fetchRestaurants();
            }}
          />
        </>
      ),
    },
  ];
  if (!restaurants.length) {
    return <Container sx={{ mt: 3 }}>Loading restaurants...</Container>;
  }

  return (
    <>
      <AdminNavbar />

      <Container sx={{ mt: 3 }}>
        <Box>
          <EditButton
            restaurant={{
              id: 0,
              name: "",
              active: true,
              VegFriendly: false,
              restaurantAddress: {
                city: "",
                address: "",
                landmark: "",
              },
            }}
            onSave={async (data) => {
              console.log("Id of the current restuarant:", data.id);
              console.log("sending backed data", data);
              const payload = {
                name: data.name,
                active: data.active,
                vegFriendly: data.VegFriendly, // camelCase to match backend
                city: data.restaurantAddress?.city ?? "",
                address: data.restaurantAddress?.address ?? "",
                landmark: data.restaurantAddress?.landmark ?? "",
              };

              await axios.post("http://localhost:8080/restaurant", payload);
              await fetchRestaurants();
            }}
          >
            Create
            <AddIcon />
          </EditButton>
        </Box>

        <Box sx={{ height: 400, width: "100%", mt: 3 }}>
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
