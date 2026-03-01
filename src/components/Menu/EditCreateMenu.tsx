import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React, { useState } from "react";

interface MenuData {
  name: string;
  veg: boolean;
  available: boolean;
  sellingPrice: number;
  retailPrice: number;
}

interface EditCreateMenuProps {
  menuData?: MenuData;
  onSave: (data: MenuData) => Promise<void>;
}

export default function EditCreateMenu({
  menuData,
  onSave,
  children,
}: React.PropsWithChildren<EditCreateMenuProps>) {
  const [open, setOpen] = useState(false);

  const [formValues, setFormValues] = useState<MenuData>({
    name: menuData?.name ?? "",
    veg: menuData?.veg ?? false,
    available: menuData?.available ?? false,
    sellingPrice: menuData?.sellingPrice ?? 0,
    retailPrice: menuData?.retailPrice ?? 0,
  });

  const hasName = !!menuData?.name;

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    if (name === "name") {
      setFormValues({ ...formValues, name: value });
      return;
    }

    if (name === "sellingPrice") {
      setFormValues({ ...formValues, sellingPrice: Number(value) || 0 });
      return;
    }

    if (name === "retailPrice") {
      setFormValues({ ...formValues, retailPrice: Number(value) || 0 });
      return;
    }

    // for any non‑string field, keep default
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSelectChange = (field: "veg" | "available") => {
    const handler = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
      const { value } = e.target;

      if (field === "available") {
        setFormValues({ ...formValues, available: value === "true" });
        return;
      }

      if (field === "veg") {
        setFormValues({ ...formValues, veg: value === "true" });
        return;
      }
    };

    return handler;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: send to backend
    await onSave(formValues);
    console.log("Save menu:", { ...formValues });
    handleClose();
  };

  return (
    <>
      <Button variant="contained" sx={{ mx: 3 }} onClick={handleOpen}>
        {hasName ? "Edit" : "Create"}

        {children}
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {hasName ? `Edit Menu ${menuData.name}` : "Create Menu"}
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

            <Select
              name="available"
              value={formValues.available ? "true" : "false"}
              onChange={handleSelectChange("available")}
              fullWidth
            >
              <MenuItem value="true">Available</MenuItem>
              <MenuItem value="false">Out of Stock</MenuItem>
            </Select>

            <Select
              name="veg"
              value={formValues.veg ? "true" : "false"}
              onChange={handleSelectChange("veg")}
              fullWidth
            >
              <MenuItem value="true">Veg</MenuItem>
              <MenuItem value="false">Non‑Veg</MenuItem>
            </Select>

            <TextField
              required
              margin="dense"
              name="sellingPrice"
              label="Selling Price"
              type="number"
              value={formValues.sellingPrice}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              required
              margin="dense"
              name="retailPrice"
              label="Retail Price"
              type="number"
              value={formValues.retailPrice}
              onChange={handleChange}
              fullWidth
            />
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              {hasName ? "Save" : "Create"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
