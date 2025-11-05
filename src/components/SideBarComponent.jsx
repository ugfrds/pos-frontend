import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  IconButton,
  Box,
} from "@mui/material";
import {
  HomeOutlined,
  Inventory2Outlined,
  SettingsOutlined,
  DescriptionOutlined,
  MonetizationOnOutlined,
  CardTravelOutlined,
  TrendingUpOutlined,
  PeopleAltOutlined,
  ExpandLess,
  ExpandMore,
  Menu,
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";

export default function DrawerSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPage = location.pathname;

  const [drawerOpen, setDrawerOpen] = useState(false); // For toggling the Drawer
  const [manageOpen, setManageOpen] = useState(true); // For toggling the "Manage" section

  // Sidebar items
  const sidebarItems = [
    { title: "Home", icon: <HomeOutlined />, route: "/" },
    { title: "Inventory", icon: <Inventory2Outlined />, route: "/inventory" },
    { title: "Expenses", icon: <CardTravelOutlined />, route: "/expenses" },
    { title: "Customers", icon: <PeopleAltOutlined />, route: "/customers" },
    { title: "Revenue", icon: <MonetizationOnOutlined />, route: "/revenue" },
    { title: "Growth", icon: <TrendingUpOutlined />, route: "/growth" },
    { title: "Reports", icon: <DescriptionOutlined />, route: "/reports" },
    { title: "Settings", icon: <SettingsOutlined />, route: "/settings" },
  ];

  // Handle navigation
  const handleNavigate = (route) => {
    navigate(route);
  };

  return (
    <>
      {/* Toggle Button for Small Screens */}
      <IconButton
        color="primary"
        onClick={() => setDrawerOpen(true)}
        sx={{ display: { md: "none" }, position: "fixed", top: 16, left: 16, zIndex: 1300 }}
      >
        <Menu />
      </IconButton>

      {/* Drawer */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        variant="temporary"
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { width: 250 },
        }}
      >
        <SidebarContent
          items={sidebarItems}
          currentPage={currentPage}
          manageOpen={manageOpen}
          setManageOpen={setManageOpen}
          handleNavigate={handleNavigate}
        />
      </Drawer>

      {/* Persistent Drawer for Larger Screens */}
      <Drawer
        open
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": { width: 250, boxSizing: "border-box" },
        }}
      >
        <SidebarContent
          items={sidebarItems}
          currentPage={currentPage}
          manageOpen={manageOpen}
          setManageOpen={setManageOpen}
          handleNavigate={handleNavigate}
        />
      </Drawer>
    </>
  );
}

function SidebarContent({ items, currentPage, manageOpen, setManageOpen, handleNavigate }) {
  return (
    <Box sx={{ width: 250, bgcolor: "background.paper", height: "100%" }}>
      <List>
        {/* Manage Section with Collapse */}
        <ListItemButton onClick={() => setManageOpen(!manageOpen)}>
          <ListItemText primary="Manage" primaryTypographyProps={{ fontWeight: "bold" }} />
          {manageOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={manageOpen} timeout="auto" unmountOnExit>
          {items.map((item, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton
                selected={currentPage === item.route}
                onClick={() => handleNavigate(item.route)}
                sx={{ pl: 4 }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.title}
                  primaryTypographyProps={{
                    color: currentPage === item.route ? "primary" : "inherit",
                    fontWeight: currentPage === item.route ? "bold" : "normal",
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </Collapse>
      </List>
    </Box>
  );
}
