import { Box, colors, Container, Typography } from "@mui/material";
import React from "react";

function Navbar() {
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
            <Typography variant="h4">User</Typography>
          </Box>
        </Container>
      </Box>
    </>
  );
}

export default Navbar;
