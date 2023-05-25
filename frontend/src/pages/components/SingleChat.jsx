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
import { VideoCallModal } from "./VideoCallModal";
import VideoPlayer from "./VideoPlayer";

import IconButton from "@mui/material/IconButton";

import { Link } from "react-router-dom";

import CallIcon from "@mui/icons-material/Call";

import axios from "axios";
import { ScrollableChat } from "./ScrollableChat";

import io from "socket.io-client";

const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();

  const { user, selectedChat, setSelectedChat } = ChatState();

  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const [pic, setPic] = useState("");
  const [file, setFile] = useState(false);

  const openWindow = () => {
    window.open("/video");
  };

  useEffect(() => {
    socket = io(ENDPOINT);

    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);

      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        setFile(false);
        if (file) {
          alert("aaaaa");
        }
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            isFile: file,
            chatId: selectedChat._id,
          },
          config
        );
        console.log(data);

        socket.emit("new message", data);

        setMessages([...messages, data]);
      } catch (error) {
        alert("Ha ocurrido un error");
      }
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

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      alert("No se han podido recuperar los mensajes");
    }
  };

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]); //cada que se seleccione un chat, se obtienen los mensajes

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        //TODO notificacion
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
  });

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);

    //TODO Indicador de escribiendo
  };

  const postDetails = (pics) => {
    setLoading(true);
    if (pics === undefined) {
      alert("pic is undefined");
      return;
    }
    if (pics.type === "image/jpeg" || "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chatBox");
      data.append("cloud_name", "deby6roey");
      fetch("https://api.cloudinary.com/v1_1/deby6roey/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          setFile(true);
          setNewMessage(data.url.toString());

          console.log(data.url.toString());

          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      alert("porfavor selecciona una imagen");
    }
  };

  return (
    <>
      {console.log("la pic ess:" + pic)}
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

              <IconButton onClick={openWindow} variant="outlined">
                <CallIcon />
              </IconButton>
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
              minHeight: "70vh",
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
                  overflow: "hidden",
                  overflowY: "scroll",
                  scrollbarWidth: "none",
                }}
              >
                <ScrollableChat messages={messages} />
              </Box>
            )}

            <FormControl onKeyDown={sendMessage} isRequired sx={{ mt: 3 }}>
              {isTyping ? <div>Loading...</div> : <></>}
              <Input
                type="file"
                onChange={(e) => {
                  postDetails(e.target.files[0]);
                  e.target.value = null;

                  // console.log("hola" + e.target.files[0].toString());
                  // console.log("la img es " + picture);
                  // console.log("el msj es " + newMessage);
                }}
              />

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
