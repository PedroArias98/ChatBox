import React, { useContext } from "react";
import { Typography } from "@mui/material";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { ChatContext } from "../../Context/ChatProvider";
const videoStyles = {
  width: "550px",
};

const VideoPlayer = () => {
  const {
    name,
    callAccepted,
    myVideo,
    userVideo,
    callEnded,
    stream,
    call,
    user,
  } = useContext(ChatContext);

  return (
    <Grid
      container
      sx={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      {stream && (
        <Paper sx={{ padding: "10px", margin: "10px" }}>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom>
              Name
            </Typography>
            <video playsInline muted ref={myVideo} autoPlay />
          </Grid>
        </Paper>
      )}

      {/*The other user video*/}
      {callAccepted && !callEnded && (
        <Paper sx={{ padding: "10px", margin: "10px" }}>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom>
              Name
            </Typography>
            <video
              playsInline
              ref={userVideo}
              autoPlay
              className={videoStyles}
            />
          </Grid>
        </Paper>
      )}
    </Grid>
  );
};

export default VideoPlayer;
