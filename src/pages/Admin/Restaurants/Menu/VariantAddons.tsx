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
  Snackbar,
  Alert,
  Typography,
  IconButton,
} from "@mui/material";
import React, { useState } from "react";
import { getCart, saveCart } from "../../../../utils/cart";

// Interfaces
interface Variant {
  id: number;
  item_name: string;
  price: number;
}

interface VariantGroup {
  id: number;
  name: string;
  variants: Variant[];
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
  menuId: number;
  menuName: string;
  addOnGroup: AddOnGroup[];
  variantGroup: VariantGroup[];
  menuPrice: number;
}

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

type Cart = OrderItem[];

function addToCart(item: Omit<OrderItem, "id">): Cart {
  const cart = getCart();

  const existingIndex = cart.findIndex((cartItem: OrderItem) => {
    const sameMenu = cartItem.menu_id === item.menu_id;
    const sameVariants =
      JSON.stringify(cartItem.selections.variant) ===
      JSON.stringify(item.selections.variant);
    const sameAddons =
      JSON.stringify(cartItem.selections.addon) ===
      JSON.stringify(item.selections.addon);
    return sameMenu && sameVariants && sameAddons;
  });

  if (existingIndex !== -1) {
    cart[existingIndex].quantity += 1;
    cart[existingIndex].total_price =
      cart[existingIndex].unit_price * cart[existingIndex].quantity;
  } else {
    const newItem: OrderItem = {
      ...item,
      id: Date.now(),
    };
    cart.push(newItem);
  }

  saveCart(cart);
  return cart;
}

export default function VariantAddons({
  menuId,
  menuPrice,
  menuName,
  addOnGroup,
  variantGroup,
}: addOnVariantProp) {
  const [open, setOpen] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(
    null,
  );
  const [selectedAddons, setSelectedAddons] = useState<number[]>([]);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  const [quantity, setQuantity] = useState<number>(() => {
    const cart = getCart();
    const existing = cart.find((item: OrderItem) => item.menu_id === menuId);
    return existing ? existing.quantity : 0;
  });

  const selectedVariant = variantGroup
    .flatMap((g) => g.variants)
    .find((v) => v.id === selectedVariantId);

  const selectedAddonItems = addOnGroup
    .flatMap((g) => g.addOns)
    .filter((a) => selectedAddons.includes(a.id));

  const totalPrice =
    (selectedVariant?.price ?? menuPrice) +
    selectedAddonItems.reduce((sum, a) => sum + a.price, 0);

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setSelectedVariantId(null);
    setSelectedAddons([]);
  };

  const handleVariantChange = (variantId: number) => {
    setSelectedVariantId(variantId);
  };

  const toggleAddon = (addonId: number) => {
    setSelectedAddons((prev) =>
      prev.includes(addonId)
        ? prev.filter((id) => id !== addonId)
        : [...prev, addonId],
    );
  };

  const handleDecrement = () => {
    const cart = getCart();
    const index = cart.findIndex((item: OrderItem) => item.menu_id === menuId);
    if (index === -1) return;

    if (cart[index].quantity === 1) {
      cart.splice(index, 1);
      setQuantity(0);
    } else {
      cart[index].quantity -= 1;
      cart[index].total_price = cart[index].unit_price * cart[index].quantity;
      setQuantity(cart[index].quantity);
    }
    saveCart(cart);
  };

  const handleConfirm = () => {
    if (variantGroup.length > 0 && selectedVariantId === null) {
      setSnackbar({
        open: true,
        message: "Please select a variant.",
        severity: "error",
      });
      return;
    }

    const variantSelections: VariantSelection[] = selectedVariant
      ? [{ name: selectedVariant.item_name, price: selectedVariant.price }]
      : [];

    const addonSelections: AddonSelection[] = selectedAddonItems.map((a) => ({
      name: a.item_name,
      price: a.price,
    }));

    const updatedCart = addToCart({
      menu_id: menuId,
      menu_name: menuName,
      selections: {
        variant: variantSelections,
        addon: addonSelections,
      },
      unit_price: totalPrice,
      total_price: totalPrice,
      quantity: 1,
    });

    const inCart = updatedCart.find(
      (item: OrderItem) => item.menu_id === menuId,
    );
    setQuantity(inCart ? inCart.quantity : 0);

    setSnackbar({
      open: true,
      message: `${menuName} added to cart!`,
      severity: "success",
    });
    handleClose();
  };

  return (
    <>
      {/* ADD BUTTON or +/- CONTROLS */}
      {quantity === 0 ? (
        <Button variant="outlined" color="success" onClick={handleOpen}>
          Add
        </Button>
      ) : (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            border: "1px solid",
            borderColor: "success.main",
            borderRadius: 1,
            overflow: "hidden",
            width: "fit-content",
          }}
        >
          <IconButton
            size="small"
            color="success"
            onClick={handleDecrement}
            sx={{ borderRadius: 0, px: 1 }}
          >
            −
          </IconButton>

          <Typography
            fontWeight={700}
            color="success.main"
            sx={{ px: 1.5, minWidth: "24px", textAlign: "center" }}
          >
            {quantity}
          </Typography>

          <IconButton
            size="small"
            color="success"
            onClick={handleOpen}
            sx={{ borderRadius: 0, px: 1 }}
          >
            +
          </IconButton>
        </Box>
      )}

      {/* DIALOG */}
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
          {/* VARIANTS */}
          {variantGroup?.map((group) => (
            <Box key={group.id} sx={{ mb: 3 }}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                {group.name}
              </Typography>
              <RadioGroup
                value={selectedVariantId?.toString() || ""}
                onChange={(e) => handleVariantChange(Number(e.target.value))}
              >
                {group.variants?.map((item) => (
                  <FormControlLabel
                    key={item.id}
                    value={item.id.toString()}
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
                ))}
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
            onClick={handleConfirm}
          >
            Add to Cart
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
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
