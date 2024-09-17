import * as React from "react";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";

import SearchIcon from "@mui/icons-material/Search";
import { Button } from "@mui/material";

export default function SearchBox() {
  return (
    <Paper
      sx={{
        p: "2px 4px",
        display: "flex",
        alignItems: "center",
        width: "100%",
      }}
    >
      <SearchIcon />
      <InputBase
        sx={{ ml: 1, flex: 1, }}
        placeholder="Search by Tag"
        inputProps={{ "aria-label": "search by tag" }}
        fullWidth
      />
      <Button variant="contained">Search</Button>
    </Paper>
  );
}
