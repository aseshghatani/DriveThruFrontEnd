import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  TextField,
  type SelectChangeEvent,
} from "@mui/material";

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

interface EditButtonProps {
  restaurant: Restaurant;
  onSave: (data: Restaurant) => Promise<void>;
}

export default function EditButton({
  restaurant,
  onSave,
  children,
}: React.PropsWithChildren<EditButtonProps>) {
  const [open, setOpen] = useState(false);

  const [formValues, setFormValues] = useState<Restaurant>({
    ...restaurant,
    restaurantAddress: {
      city: restaurant.restaurantAddress?.city ?? "",
      address: restaurant.restaurantAddress?.address ?? "",
      landmark: restaurant.restaurantAddress?.landmark ?? "",
    },
  });

  const isEditing = restaurant.id !== 0;

  const handleSelectChange = (name: string) => (e: SelectChangeEvent) => {
    const value = e.target.value;
    if (name === "active") {
      setFormValues((prev) => ({ ...prev, active: value === "true" }));
    } else if (name === "vegFriendly") {
      setFormValues((prev) => ({ ...prev, VegFriendly: value === "true" }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "city" || name === "address" || name === "landmark") {
      setFormValues((prev) => ({
        ...prev,
        restaurantAddress: { ...prev.restaurantAddress, [name]: value },
      }));
      return;
    }
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSave(formValues);
      setOpen(false);
    } catch (error) {
      console.error("Save failed:", error);
    }
  };

  const handleClose = () => setOpen(false);
  const handleClickOpen = () => setOpen(true);

  return (
    <>
      <Button variant="contained" onClick={handleClickOpen}>
        {children}
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {isEditing ? `Edit ${restaurant.name}` : "Add Restaurant"}
        </DialogTitle>

        <form onSubmit={handleSubmit}>
          <DialogContent
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 2,
            }}
          >
            <TextField
              autoFocus
              required
              margin="dense"
              name="name"
              label="Name"
              value={formValues.name}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              required
              margin="dense"
              name="city"
              label="City"
              value={formValues.restaurantAddress?.city ?? ""}
              onChange={handleChange}
              fullWidth
            />

            <Select
              name="active"
              value={formValues.active ? "true" : "false"}
              onChange={handleSelectChange("active")}
              fullWidth
            >
              <MenuItem value="true">Active</MenuItem>
              <MenuItem value="false">In-Active</MenuItem>
            </Select>

            <Select
              name="vegFriendly"
              value={formValues.VegFriendly ? "true" : "false"}
              onChange={handleSelectChange("vegFriendly")}
              fullWidth
            >
              <MenuItem value="true">Veg</MenuItem>
              <MenuItem value="false">Non‑Veg</MenuItem>
            </Select>

            <TextField
              required
              margin="dense"
              name="address"
              label="Address"
              value={formValues.restaurantAddress?.address ?? ""}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              required
              margin="dense"
              name="landmark"
              label="Landmark"
              value={formValues.restaurantAddress?.landmark ?? ""}
              onChange={handleChange}
              fullWidth
            />
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}