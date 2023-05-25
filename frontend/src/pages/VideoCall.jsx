import React from "react";
import VideoPlayer from "./components/VideoPlayer";
import VideoOptions from "./components/VideoOptions";
import Notifications from "./components/Notifications";
import { Box } from "@mui/material";
import darkTheme from "./misc/theme";
import { ThemeProvider } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

export const VideoCall = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          background: "#211F2C",
        }}
      >
        <Typography variant="h5" sx={{ color: "#FAFAFA" }}>
          Llamada de Video
        </Typography>
        <VideoPlayer />
        <VideoOptions>
          <Notifications />
        </VideoOptions>
      </Box>
    </ThemeProvider>
  );
};
