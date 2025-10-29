import {
  Box,
  Grid,
  AppBar,
  Container,
  Typography,
  Paper,
  IconButton,
  Avatar,
  Badge,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  Tooltip,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import {
  NotificationsOutlined,
  Settings,
  Logout,
  AccountCircleOutlined,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { useState } from "react";

export default function NavBarComponent() {
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const open = Boolean(anchorEl);
  const notificationOpen = Boolean(notificationAnchorEl);

  const handleAvatarClicked = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationClicked = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const notificationHandleClose = () => {
    setNotificationAnchorEl(null);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <Grid container>
      <Grid item md={12}>
        <Paper elevation={4}>
          <AppBar sx={{ padding: 2 }} position="static">
            <Container maxWidth="xxl">
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="h6"
                  component="a"
                  href="/"
                  sx={{
                    mx: 2,
                    display: { xs: "none", md: "flex" },
                    fontWeight: 700,
                    letterSpacing: ".2rem",
                    color: "inherit",
                    textDecoration: "none",
                  }}
                >
                  ADIMS
                </Typography>

                {/* Desktop: Manage Inventory Button */}
                <Box sx={{ display: { xs: "none", md: "flex" } }}>
                  <IconButton color="inherit" href="/manage-inventory">
                    <Typography sx={{ marginRight: 2 }}>Manage Inventory</Typography>
                  </IconButton>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "right",
                    alignItems: "center",
                  }}
                >
                  <IconButton color="inherit">
                    <Badge variant="dot" color="error" invisible={false}>
                      <NotificationsOutlined
                        sx={{ width: 32, height: 32 }}
                        onClick={handleNotificationClicked}
                      />
                    </Badge>
                  </IconButton>
                  <Menu
                    open={notificationOpen}
                    anchorEl={notificationAnchorEl}
                    onClick={notificationHandleClose}
                    onClose={notificationHandleClose}
                  >
                    <MenuItem>Notification number 1</MenuItem>
                    <Divider />
                    <MenuItem>Notification number 2</MenuItem>
                    <MenuItem>Notification number 3</MenuItem>
                  </Menu>

                  {/* Avatar for Desktop */}
                  <IconButton
                    onClick={handleAvatarClicked}
                    size="small"
                    sx={{ mx: 2 }}
                    aria-haspopup="true"
                  >
                    <Tooltip title="account settings">
                      <Avatar sx={{ width: 32, height: 32 }}>Z</Avatar>
                    </Tooltip>
                  </IconButton>
                  <Typography fontFamily={"Inter"}>ADMI ZAKARYAE</Typography>

                  {/* Hamburger Menu for Mobile */}
                  <IconButton
                    color="inherit"
                    onClick={toggleMobileMenu}
                    sx={{ display: { xs: "block", md: "none" } }}
                  >
                    <MenuIcon />
                  </IconButton>
                </Box>
              </Box>
            </Container>
          </AppBar>
        </Paper>
      </Grid>

      {/* Drawer for Mobile Menu */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={toggleMobileMenu}
      >
        <List sx={{ width: 250 }}>
          {/* Manage Inventory Button in Drawer */}
          <ListItem button onClick={toggleMobileMenu} href="/manage-inventory">
            <ListItemText primary="Manage Inventory" />
          </ListItem>
          <Divider />
          {/* Avatar and Settings Options */}
          <ListItem button onClick={toggleMobileMenu}>
            <ListItemIcon>
              <AccountCircleOutlined fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItem>
          <Divider />
          <ListItem button onClick={toggleMobileMenu}>
            <ListItemIcon>
              <Settings fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItem>
          <ListItem button onClick={toggleMobileMenu}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>
    </Grid>
  );
}


{
  /* <Grid item md={7}>
                  <Paper
                    component="form"
                    sx={{
                      p: "2px 4px",
                      width: "50%",
                      mx: "auto",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <InputBase
                      sx={{ ml: 1, flex: 1 }}
                      placeholder="Search "
                      inputProps={{ "aria-label": "search" }}
                    />
                    <IconButton
                      type="button"
                      sx={{ p: "10px" }}
                      aria-label="search"
                    >
                      <Search />
                    </IconButton>
                  </Paper>
                </Grid> */
}
