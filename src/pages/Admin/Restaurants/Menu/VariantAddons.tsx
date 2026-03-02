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
import React, { useCallback, useEffect, useRef, useState } from "react";

// ... your interfaces remain the same ...

export default function VariantAddons({
  menuName,
  addOnGroup,
  variantGroup,
}: addOnVariantProp) {
  const [open, setOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<number[]>([]);

  const handleOpen = () => {
    setOpen(true);
    console.log("AddonGroup:", addOnGroup);
    console.log("VariantGroup:", variantGroup);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const toggleAddon = (addonId: number) => {
    setSelectedAddons((prev) =>
      prev.includes(addonId)
        ? prev.filter((id) => id !== addonId)
        : [...prev, addonId],
    );
  };
  const [price, setPrice] = useState(0);
  const prevVariantPrice = useRef(0);

  const handleChange = (selectedPrice: number) => {
    setPrice(selectedPrice);
  };
  return (
    <>
      <Button variant="outlined" color="success" onClick={handleOpen}>
        Add
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1 }} variant="h6">
          {menuName}
        </DialogTitle>

        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ px: 3, pb: 2, color: "text.primary" }}
        >
          Customise as per your taste
        </Typography>

        <DialogContent sx={{ p: 3, pb: 2 }}>
          {/* VARIANTS - Radio Buttons (Single Select) */}
          {variantGroup?.map((group) => (
            <Box key={group.id} sx={{ mb: 3 }}>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                sx={{ mb: 1, fontWeight: 600 }}
              >
                {group.name}
              </Typography>
              <RadioGroup name={`variant-${group.id}`}>
                {group.variants?.map((item) => (
                  <FormControlLabel
                    key={item.id}
                    value={item.id.toString()}
                    control={
                      <Radio
                        size="small"
                        checked={selectedVariant === item.id}
                        onChange={() => handleChange(item.price)}
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
                          {item.item_name}
                        </Typography>
                        <Typography variant="caption" color="success.main">
                          +₹{item.price}
                        </Typography>
                      </Box>
                    }
                    sx={{ my: 0.5 }}
                  />
                ))}
              </RadioGroup>
            </Box>
          ))}

          {/* ✅ ADDONS - Checkboxes (Multi Select) */}
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
          <Typography>{price}</Typography>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            variant="contained"
            sx={{ bgcolor: "success.main", color: "white" }}
            onClick={handleClose}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
