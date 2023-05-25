import React, { useDebugValue, useEffect, useState } from "react";
import axios from "axios";
import { ChatState } from "../../Context/ChatProvider";
import { Box, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import ChatLoading from "./ChatLoading";
import Stack from "@mui/material/Stack";
import { getSender } from "../../config/chatLogics";
import VideoPlayer from "./VideoPlayer";

import GroupChatModal from "./GroupChatModal";
const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, user, setUser, chats, setChats } =
    ChatState();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get("/api/chat", config);
      setChats(data);
      console.log(data);
    } catch (error) {
      alert("no se han podido encontrar los chats");
      console.log(error);
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);
  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDirection={"column"}
      alignItems={"center"}
      sx={{ p: 3, m: 2 }}
      width={{ base: "100%", md: "31%" }}
      borderRadius={"10"}
    >
      <Box
        sx={{
          display: "flex",
          pb: 3,
          px: 3,
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
          color: "#fafafa",
        }}
      >
        <Typography variant="h5">My Chats</Typography>

        <GroupChatModal></GroupChatModal>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          p: 3,
          background: "#211F2C",
          width: "100%",
          height: "100%",
          borderRadius: "10px",
          overflowY: "hidden",
        }}
      >
        {chats ? (
          <Stack>
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                bgcolor={selectedChat === chat ? "#6c77ff" : "#252331"}
                sx={{
                  px: 3,
                  py: 2,
                  borderRadius: "10px",
                  mt: "5px",
                  color: "#FAFAFA",
                }}
                key={chat._id}
              >
                <Typography>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Typography>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
