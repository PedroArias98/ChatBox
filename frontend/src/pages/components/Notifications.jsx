import React, { useContext } from "react";
import { Button, Box } from "@mui/material";

import { ChatContext } from "../../Context/ChatProvider";
const Notifications = () => {
  const { answerCall, call, callAccepted } = useContext(ChatContext);
  return (
    <>
      {call.isReceivingCall && !callAccepted && (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <h1>{call.name} is calling:</h1>
          <Button variant="contained" onClick={answerCall}>
            Answer
          </Button>
        </Box>
      )}
    </>
  );
};

export default Notifications;
