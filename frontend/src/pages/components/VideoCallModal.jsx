import { React, useState } from "react";
import Modal from "@mui/material/Modal";
import { ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import IconButton from "@mui/material/IconButton";

import { Link } from "react-router-dom";

import CallIcon from "@mui/icons-material/Call";

import darkTheme from "../misc/theme";

import VideoPlayer from "./VideoPlayer";
import VideoOptions from "./VideoOptions";
import Notifications from "./Notifications";
import { MdWifiTetheringErrorRounded } from "react-icons/md";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "#252331",
  borderRadius: "10px",
  display: "flex",
  flexDirection: "column",

  boxShadow: 24,
  p: 4,
  color: "#fafafa",
};

const openWindow = () => {
  window.open("/video");
};

export const VideoCallModal = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <div>
      <IconButton onClick={openWindow} variant="outlined">
        <CallIcon />
      </IconButton>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <ThemeProvider theme={darkTheme}>
          <Box sx={style}>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              sx={{ mb: 3 }}
            >
              Llamada de Video
            </Typography>

            <VideoPlayer />
            <VideoOptions>
              <Notifications />
            </VideoOptions>
          </Box>
        </ThemeProvider>
      </Modal>
    </div>
  );
};
