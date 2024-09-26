import { Box, Typography, Link,  } from "@mui/material";
import Grid from "@mui/material/Grid2";

export default function Footer() {
  return (
    <Box
      sx={{
        bgcolor: "#f5f5f5",
        py: 3,
        margin: 0,
        borderTop: "1px solid #e0e0e0",
        width: "100%",
        textAlign: "center",

      }}
    >
      <Grid container justifyContent="center" spacing={4}>
        <Grid>
          <Link href="/terms" underline="hover" sx={{ color: "text.secondary" }}>
            Terms & Conditions
          </Link>
        </Grid>
        <Grid>
          <Link href="/privacy" underline="hover" sx={{ color: "text.secondary" }}>
            Privacy Policy
          </Link>
        </Grid>
      </Grid>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        &copy; {new Date().getFullYear()} Your Company. All rights reserved.
      </Typography>
    </Box>
  );
}
