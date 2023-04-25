import React from "react";
import { ChatState } from "../../Context/ChatProvider";
import { Box } from "@mui/material";
import SingleChat from "./SingleChat";
const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      sx={{
        p: 3,
        background: "#252331",
        flexDirection: "column",
        m: 2,
        alignItems: "center",
      }}
      width={{ base: "100%", md: "68%" }}
      borderRadius={"10"}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default ChatBox;
