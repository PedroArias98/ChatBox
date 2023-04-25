import React, { useState, useEffect } from "react";
import { ChatState } from "../../Context/ChatProvider";
import {
  Box,
  CircularProgress,
  FormControl,
  Input,
  TextField,
  Divider,
} from "@mui/material";
import image from "../../images/Chatting-amico.svg";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import { getSender, getSenderData } from "../../config/chatLogics";
import { UpdateGroupChatModal } from "./UpdateGroupChatModal";

import axios from "axios";
import { ScrollableChat } from "./ScrollableChat";

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();

  const { user, selectedChat, setSelectedChat } = ChatState();

  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage)
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        console.log(data);

        setMessages([...messages, data]);
      } catch (error) {
        alert("Ha ocurrido un error");
      }
  };

  const fetchMessages = async () => {
    if (!selectedChat) {
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      setLoading(true);

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      console.log(messages);
      setMessages(data);
      setLoading(false);
    } catch (error) {
      alert("No se han podido recuperar los mensajes");
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [selectedChat]); //cada que se seleccione un chat, se obtienen los mensajes

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    //TODO Indicador de escribiendo
  };

  return (
    <>
      {selectedChat ? (
        <>
          {!selectedChat.isGroupChat ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                background: "",
                alignSelf: "start",
                justifyContent: "space-between",
              }}
            >
              <Avatar
                src={getSenderData(user, selectedChat.users).pic}
                sx={{ width: 50, height: 50 }}
              ></Avatar>
              <Typography
                variant="h5"
                sx={{
                  px: 2,

                  color: "#FAFAFA",
                }}
              >
                {getSender(user, selectedChat.users)}
              </Typography>
            </Box>
          ) : (
            <>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",

                  width: "100%",
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    px: 2,
                    pb: 2,
                    color: "#FAFAFA",
                  }}
                >
                  {selectedChat.chatName.toUpperCase()}
                </Typography>
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </Box>
            </>
          )}
          <Divider />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              p: 3,
              m: 3,
              background: "#252331",
              width: "100%",
              height: "100%",
              borderTop: 1,
              borderColor: "#343145",
            }}
          >
            {loading ? (
              <CircularProgress
                size={80}
                sx={{ alignSelf: "center", margin: "auto" }}
              />
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  overflowY: "scroll",
                  scrollbarWidth: "none",
                }}
              >
                <ScrollableChat messages={messages} />
              </Box>
            )}

            <FormControl onKeyDown={sendMessage} isRequired sx={{ mt: 3 }}>
              <TextField
                variant="outlined"
                placeholder="Escribe un mensaje"
                onChange={typingHandler}
                value={newMessage}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          sx={{
            color: "#FAFAFA",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            alignContent: "center",
          }}
        >
          <img src={image} width={300} height={300}></img>
          <Typography variant="h4">ChatBox</Typography>
          Click en un usuario para empezar a chatear
        </Box>
      )}
    </>
  );
};

export default SingleChat;
