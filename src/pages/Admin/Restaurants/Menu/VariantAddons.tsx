import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

// Your interfaces (fixed VariantGroup)
interface Variant {
  id: number;
  item_name: string;
  price: number;
}

interface VariantGroup {
  id: number;
  name: string;
  variants: Variant[]; // ✅ Fixed: "variants" not "variant"
}

interface AddOn {
  id: number;
  item_name: string;
  price: number;
}

interface AddOnGroup {
  id: number;
  name: string;
  addOns: AddOn[];
}

interface addOnVariantProp {
  menuName: string;
  addOnGroup: AddOnGroup[];
  variantGroup: VariantGroup[];
  menuPrice: number;
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
}
const CART_KEY = "cart";
interface cart extends Array<OrderItem> {}
export default function VariantAddons({
  menuPrice,
  menuName,
  addOnGroup,
  variantGroup,
}: addOnVariantProp) {
  const [open, setOpen] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(
    null,
  ); // ✅ Use ID only
  const [selectedAddons, setSelectedAddons] = useState<number[]>([]); // ✅ IDs only

  // ✅ Find selected variant & calculate total
  const selectedVariant = variantGroup
    .flatMap((g) => g.variants)
    .find((v) => v.id === selectedVariantId);

  const totalPrice =
    (selectedVariant?.price ?? menuPrice) +
    addOnGroup
      .flatMap((g) => g.addOns.filter((a) => selectedAddons.includes(a.id)))
      .reduce((sum, a) => sum + a.price, 0);

  const handleOpen = () => {
    console.log("Variant Group:", variantGroup);
    console.log("AddOn Group:", addOnGroup);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedVariantId(null);
    setSelectedAddons([]);
  };

  const handleVariantChange = (variantId: number) => {
    console.log("Variant selected:", variantId); // ✅ Debug
    setSelectedVariantId(variantId);
  };

  const toggleAddon = (addonId: number) => {
    setSelectedAddons((prev) =>
      prev.includes(addonId)
        ? prev.filter((id) => id !== addonId)
        : [...prev, addonId],
    );
  };

  return (
    <>
      <Button variant="outlined" color="success" onClick={handleOpen}>
        Add
      </Button>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ pb: 1 }} variant="h6">
          {menuName}
        </DialogTitle>

        <Typography variant="h6" fontWeight="bold" sx={{ px: 3, pb: 2 }}>
          {addOnGroup.length === 0 && variantGroup.length === 0
            ? "Add to Cart?"
            : "Customise as per your taste"}
        </Typography>

        <DialogContent sx={{ p: 3, pb: 2 }}>
          {/* VARIANTS - Fixed RadioGroup */}
          {variantGroup?.map((group) => (
            <Box key={group.id} sx={{ mb: 3 }}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                {group.name}
              </Typography>

              <RadioGroup
                value={selectedVariantId?.toString() || ""} // ✅ ID as string
                onChange={(e) => handleVariantChange(Number(e.target.value))}
              >
                {group.variants?.map(
                  (
                    item, // ✅ "variants" plural
                  ) => (
                    <FormControlLabel
                      key={item.id}
                      value={item.id.toString()} // ✅ String value
                      control={<Radio size="small" />}
                      label={
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            width: "100%",
                          }}
                        >
                          <Typography>{item.item_name}</Typography>
                          <Typography color="success.main">
                            +₹{item.price}
                          </Typography>
                        </Box>
                      }
                    />
                  ),
                )}
              </RadioGroup>
            </Box>
          ))}

          {/* ADDONS */}
          {addOnGroup?.map((group) => (
            <Box key={group.id} sx={{ mb: 3 }}>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                sx={{ mb: 2, fontWeight: 600 }}
              >
                {group.name}
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {group.addOns?.map((addon) => (
                  <FormControlLabel
                    key={addon.id}
                    control={
                      <Checkbox
                        size="small"
                        checked={selectedAddons.includes(addon.id)}
                        onChange={() => toggleAddon(addon.id)}
                      />
                    }
                    label={
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          width: "100%",
                        }}
                      >
                        <Typography variant="body2" fontWeight={500}>
                          {addon.item_name}
                        </Typography>
                        <Typography variant="caption" color="success.main">
                          +₹{addon.price}
                        </Typography>
                      </Box>
                    }
                    sx={{ m: 0 }}
                  />
                ))}
              </Box>
            </Box>
          ))}
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Typography fontWeight={600} color="success.main">
            Total: ₹{totalPrice}
          </Typography>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            variant="contained"
            sx={{ bgcolor: "success.main", color: "white" }}
            onClick={handleClose} // ✅ Add onAddToCart later
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
