
import { Grid, Box, Typography, CircularProgress,} from "@mui/material";
import Products from "./Products";
import Overview from "./Overview";

const Inventory = () => { 
   return (
    <Box>
      <Grid container sx={{ mx: 3, p: 3 }}>
        <Grid item md={9}>
          <Box
            sx={{
              margin: 3,
              bgcolor: "white",
              borderRadius: 2,
              padding: 3,
              height: "100%",
            }}
          >
            <Typography variant="h5" sx={{ m: 3, fontWeight: "bold" }}>
              Inventory
            </Typography>
            <Products   />
          </Box>
        </Grid>
        <Grid item md={3}>
          <Box
            sx={{
              margin: 3,
              bgcolor: "white",
              borderRadius: 2,
              padding: 3,
              height: "100%",
            }}
          >
            <Typography variant="h5" sx={{ m: 3, fontWeight: "bold" }}>
              Overview
            </Typography>
            <Overview />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Inventory;
