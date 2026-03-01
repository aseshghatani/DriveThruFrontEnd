import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import AdminNavbar from "../../../components/AdminNavbar";
import { Box, Container, Typography } from "@mui/material";
import CollapsibleTable from "../../../components/Menu/CollapsibleTable";

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
export default function Variant() {
  const [addOnGroup, setAddOnGroup] = useState<AddOnGroup[] | null>(null);
  const { id } = useParams<{ id: string }>();
  const restaurantId = id ? Number(id) : 0;
  const location = useLocation();
  useEffect(() => {
    const fetchMenuData = async () => {
      if (location.state?.data) {
        // ✅ Optional chaining!
        setAddOnGroup(location.state.data);
        return;
      }

      const response = await axios.get(
        `http://localhost:8080/menu/variant/${restaurantId}`,
      );
      if (response.data.success) {
        setAddOnGroup(response.data.data.addOnGroups);
      } else {
        console.log("error fetching data", response.data.message);
      }
    };
    fetchMenuData();
  }, [restaurantId, location.state?.data]);

  return (
    <>
      <AdminNavbar />
      <Container sx={{ mt: 5 }}>
        {addOnGroup ? (
          <CollapsibleTable addOnGroups={addOnGroup} />
        ) : (
          <Typography>Loading...</Typography>
        )}
      </Container>
    </>
  );
}
