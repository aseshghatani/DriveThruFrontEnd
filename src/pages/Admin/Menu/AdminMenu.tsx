import { Box, Container } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { data, useLocation, useParams } from "react-router-dom";
import AdminNavbar from "../../../components/AdminNavbar";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import EditCreateMenu from "../../../components/Menu/EditCreateMenu";
import DeletePage from "../../../components/DeletePage";

interface MenuData {
  id: number;
  name: string;
  veg: boolean;
  available: boolean;
  sellingPrice: number;
  retailPrice: number;
}

export default function AdminMenu() {
  const { id } = useParams();
  const restaurantId = id ? Number(id) : 0;
  const [menu, setMenu] = useState<MenuData[] | null>(null);
  const location = useLocation();
  const fetchMenuReload = async () => {
    axios
      .get(`http://localhost:8080/menu/${restaurantId}`)
      .then((res) => setMenu(res.data.data || res.data))
      .catch(console.error);
  };
  useEffect(() => {
    if (location.state?.menu) {
      setMenu(location.state.menu); // use passed state if available
      return;
    }

    const fetchMenu = async () => {
      const response = await axios.get(
        `http://localhost:8080/menu/${restaurantId}`,
      );
      if (response.data.success) {
        setMenu(response.data.data);
      }
    };

    fetchMenu();
  }, [id]);

  const columns: GridColDef<(typeof menu)[number]>[] = [
    { field: "id", headerName: "ID", width: 90 },

    { field: "name", headerName: "Menu Name", width: 150 },
    {
      field: "available",
      headerName: "Available",
      width: 90,
      valueGetter: (_, menu) =>
        menu.available ? "Available" : " Out of Stock",
    },
    {
      field: "veg",
      headerName: "Is Veg",
      width: 90,
      valueGetter: (_, menu) => (menu.veg ? "Veg" : "Non-Veg"),
    },
    { field: "sellingPrice", headerName: "Selling Price", width: 100 },
    { field: "retailPrice", headerName: "Retail Price", width: 100 },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      flex: 1,
      type: "actions",
      renderCell: (parms) => (
        <>
          {
            <EditCreateMenu
              menuData={parms.row as MenuData}
              onSave={async (data) => {
                const response = await axios.put(
                  `http://localhost:8080/menu/edit/${parms.id}`,
                  data,
                );
                if (response.data.success) {
                  fetchMenuReload();
                } else {
                  console.log(response.data.message);
                }
              }}
            />
          }
          <DeletePage
            name={parms.row.name}
            id={parms.row.id}
            onDelete={async (id) => {
              await axios.delete(`http://localhost:8080/menu/delete/${id}`);
              await fetchMenuReload();
            }}
          />
        </>
      ),
    },
  ];

  return (
    <>
      <AdminNavbar />
      <Container>
        <Box sx={{ mt: 3 }}>
          <EditCreateMenu
            onSave={async (data) => {
              console.log(data);
              const response = await axios.post(
                `http://localhost:8080/menu/create/${restaurantId}`,
                data,
              );
              if (response.data.success) {
                fetchMenuReload();
                console.log(response.data.message);
              }
            }}
          />
        </Box>
        <Box sx={{ height: 400, width: "100%", mt: 3 }}>
          <DataGrid
            rows={menu}
            columns={columns}
            pageSizeOptions={[5, 10, 25]}
          />
        </Box>
      </Container>
    </>
  );
}
