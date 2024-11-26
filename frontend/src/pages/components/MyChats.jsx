import React, { useDebugValue, useEffect, useState } from "react";
import axios from "axios";
import axiosInstance from "../../config/axiosInstance";
import { ChatState } from "../../Context/ChatProvider";
import { Box, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import ChatLoading from "./ChatLoading";
import Stack from "@mui/material/Stack";
import { getSender } from "../../config/chatLogics";
import VideoPlayer from "./VideoPlayer";

import io from "socket.io-client";

import GroupChatModal from "./GroupChatModal";

const ENDPOINT = "https://chatbox-production-08a4.up.railway.app";
var socket, selectedChatCompare;
const MyChats = ({ fetchAgain }) => {
  const [socketConnected, setSocketConnected] = useState(false);

  useEffect(() => {
    socket = io(ENDPOINT);

    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
  }, []);

  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, user, setUser, chats, setChats } =
    ChatState();

  const fetchChats = async () => {
    // if (!loggedUser) {
    //   console.log("usuario no loggeado");
    //   return;
    // }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axiosInstance.get("/api/chat", config);
      setChats(data);

      console.log(data);
    } catch (error) {
      alert("no se han podido encontrar los chats");
      console.log(error);
    }
  };

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
      setLoggedUser(userInfo);
    }
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

                {/* TODO: Mostrar el ultimo mensaje enviado ( bug con los mensajes que son encriptados) 

                {chat.latestMessage && (
                  <Typography fontSize="xs">
                    {chat.latestMessage.content.length > 40
                      ? chat.latestMessage.content.substring(0, 41) + "..."
                      : chat.latestMessage.content}
                  </Typography>
                )} */}
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
