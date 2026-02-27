import { Box, Container, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminNavbar() {
  return (
    <>
      <Box sx={{ py: 2, bgcolor: "primary.main", color: "white" }}>
        <Container>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h3">DriveThru</Typography>

            <Typography sx={{ cursor: "pointer" }} variant="h4">
              Admin
            </Typography>
          </Box>
        </Container>
      </Box>
    </>
  );
}
