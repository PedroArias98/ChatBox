import React, { useContext, useState } from "react";
import { Button, TextField, Grid } from "@mui/material";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import { ChatContext } from "../../Context/ChatProvider";
import { ThemeProvider } from "@emotion/react";
import darkTheme from "../misc/theme";

import { CopyToClipboard } from "react-copy-to-clipboard";

const VideoOptions = ({ children }) => {
  const {
    me,
    callAccepted,
    name,
    setName,
    callEnded,
    leaveCall,
    callUser,
    selectedChat,
  } = useContext(ChatContext);

  const [idToCall, setIdToCall] = useState("");

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ background: "#252331" }}>
        <form noValidate autoComplete="off">
          {/* <Grid container>
            <Grid item xs={12} md={6}>
              {callAccepted && !callEnded ? (
                <Button variant="contained" onClick={leaveCall}>
                  Colgar
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={() => callUser("6427fb4a2c3e33c2f7c5908a")}
                >
                  Llamar
                </Button>
              )}
            </Grid>
          </Grid> */}

          <form noValidate autoComplete="off">
            <Grid container>
              <Grid item xs={12} md={6}>
                <Typography gutterBottom variant="h6">
                  Account Info
                </Typography>
                <TextField
                  label="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  fullWidth
                />
                <CopyToClipboard text={me}>
                  <Button variant="contained" color="primary" fullWidth>
                    Copy Your ID
                  </Button>
                </CopyToClipboard>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography gutterBottom variant="h6">
                  Make a call
                </Typography>
                <TextField
                  label="ID to call"
                  value={idToCall}
                  onChange={(e) => setIdToCall(e.target.value)}
                  fullWidth
                />
                {callAccepted && !callEnded ? (
                  <Button
                    variant="contained"
                    color="secondary"
                    fullWidth
                    onClick={leaveCall}
                  >
                    Hang Up
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => callUser(idToCall)}
                  >
                    Call
                  </Button>
                )}
              </Grid>
            </Grid>
          </form>
        </form>

        {children}
      </Box>
    </ThemeProvider>
  );
};

export default VideoOptions;
