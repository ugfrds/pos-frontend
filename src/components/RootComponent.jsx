import React from "react";
import AdminNavBar from "./biz/AdminNavBar";
import SideBarComponent from "./SideBarComponent";
import { Outlet } from "react-router-dom";
import { Box, Toolbar } from "@mui/material"; // Import Box and Toolbar from Material-UI

export default function RootComponent() {
  const drawerWidth = 250; // Define the width of the drawer

  return (
    <Box sx={{ display: 'flex' }}> {/* Use flexbox for overall layout */}
      <AdminNavBar /> {/* AdminNavBar is likely fixed at the top */}

      <SideBarComponent /> {/* The permanent drawer */}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` }, // Adjust main content width
          ml: { sm: `${drawerWidth}px` }, // Push main content to the right
          mt: '64px', // Account for the height of the AdminNavBar (assuming default AppBar height)
          backgroundColor: "#DEE3E9",
          minHeight: "100vh",
        }}
      >
        <Toolbar /> {/* This is to push content below the fixed AdminNavBar */}
        <Outlet />
      </Box>
    </Box>
  );
}
