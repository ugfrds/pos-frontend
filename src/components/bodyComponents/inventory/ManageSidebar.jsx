import React from 'react';
import { Box, Typography, List, ListItem, ListItemButton, ListItemText } from '@mui/material';

const ManageSidebar = () => {
  return (
    <Box
      sx={{
        margin: 3,
        bgcolor: 'white',
        borderRadius: 2,
        padding: 3,
        height: '100%',
      }}
    >
      <Typography variant="h5" sx={{ m: 3, fontWeight: 'bold' }}>
        Manage
      </Typography>
      <List>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemText primary="Manage Products" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemText primary="Manage Categories" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemText primary="Inventory Settings" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
};

export default ManageSidebar;
