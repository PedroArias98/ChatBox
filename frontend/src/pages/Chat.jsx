import React, { useEffect, useState } from "react";
import "../App.css";

import axios from "axios";
import axiosInstance from "../config/axiosInstance";
import { Typography, Divider } from "@mui/material";
import { Container } from "@mui/material";
import { Box } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";

import SideDrawer from "./components/SideDrawer";
import MyChats from "./components/MyChats";
import ChatBox from "./components/ChatBox";
import { ChatState } from "../Context/ChatProvider";

import darkTheme from "./misc/theme";

const ChatList = () => {
  const [chats, setchats] = useState([]);
  //let lista = JSON.parse(chats);

  const fetchChats = async () => {
    const { data } = await axiosInstance.get("/api/chat");
    setchats(data);
    console.log(data);
  };
  useEffect(() => {
    //fetchChats();
  }, []);

  return (
    <>
      <Container
        style={{ background: "#212121" }}
        sx={{
          display: "flex",
          flexDirection: "column",
          borderRight: 1,
          borderColor: "grey.800",
        }}
        maxWidth="false"
        disableGutters
      >
        <Container
          maxWidth="false"
          disableGutters
          style={{
            paddingLeft: "30px",
            paddingTop: "20px",

            height: "90px",
          }}
        >
          <Typography class="subtitle" style={{ margin: 0 }}>
            {" "}
            Mis Chats
          </Typography>
        </Container>
        <Divider />

        {chats.map((chat) => (
          <Container maxWidth="false" disableGutters style={{ margin: "0px" }}>
            <Box sx={{ borderRadius: "4px", padding: "10px", margin: "5px" }}>
              <Typography variant="h6" style={{ paddingLeft: "10px" }}>
                {" "}
                {chat.chatName}
              </Typography>

              <Typography variant="subtitle2" style={{ paddingLeft: "10px" }}>
                Lorem ipsum dolor sit amet conse...
              </Typography>
            </Box>
            <Divider />
          </Container>
        ))}
      </Container>
    </>
  );
};

export const Chat = () => {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);
  return (
    <div style={{ width: "100%" }}>
      <ThemeProvider theme={darkTheme}>
        {user && <SideDrawer user={user} />}
        <Box
          sx={{
            display: "flex",

            justifyContent: "space-between",
            width: "100%",
            height: "93vh",
            backgroundColor: "#211F2C",
          }}
        >
          {user && <MyChats fetchAgain={fetchAgain} />}
          {user && (
            <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
          )}
        </Box>
      </ThemeProvider>
    </div>
  );
};

export default Chat;
