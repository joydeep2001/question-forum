"use client";

import ResponsiveAppBar from "@/components/AppBar";
import Grid from "@mui/material/Grid2";
import { Paper, Stack } from "@mui/material";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";

import SearchBox from "@/components/SearchBox";
import Chip from "@mui/material/Chip";
import ActionCard from "@/components/ActionCard";

const Banner = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: "150px 250px",
  textAlign: "center",
  color: theme.palette.text.secondary,
  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
  position: "relative",
  backgroundImage: "url('/banner.jpg')",
}));

export default function Home() {
  function handleDelete() {
    console.log("Eat 5 start do nothing");
  }
  function handleClick() {
    console.log("Eat 5 start do nothing");
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <ResponsiveAppBar />
      <Grid container>
        <Grid size={12}>
          <Banner>
            <SearchBox />
          </Banner>
        </Grid>
        <Grid size={12}>
          <Stack direction="row" spacing={1} sx={{ padding: 4 }}>
            <Chip
              label="Recent posts"
              color="primary"
              onClick={handleClick}
              onDelete={handleDelete}
            />

            <Chip
              label="React"
              color="primary"
              onClick={handleClick}
              onDelete={handleDelete}
            />
          </Stack>
        </Grid>
        <Grid size={12}>
          <Box sx={{ padding: 4 }}>
            <ActionCard
              title="random title"
              description="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s"
              imageURL="/test_q.png"
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
