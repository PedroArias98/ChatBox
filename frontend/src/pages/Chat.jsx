import React, { useEffect, useState } from "react";
import "../App.css";

import axios from "axios";
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
    const { data } = await axios.get("/api/chat");
    setchats(data);
    console.log(data);
  };
  useEffect(() => {
    fetchChats();
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

// const ChatBox = () => {
//   return (
//     <>
//       <Container
//         maxWidth="false"
//         disableGutters
//         style={{
//           paddingLeft: "35px",
//           paddingTop: "20px",

//           height: "90px",
//         }}
//       >
//         <Typography class="subtitle" style={{ margin: 0 }}>
//           {" "}
//           John Doe
//         </Typography>
//       </Container>
//       <Divider />
//       <Container
//         style={{
//           height: "80vh",
//           borderRadius: "8px",
//           paddingTop: 20,
//         }}
//       >
//         <Grid container justifyContent="flex-start">
//           <Box
//             maxWidth="40%"
//             style={{
//               background: "#6c77ff",
//               borderRadius: "8px",
//               padding: "10px",
//             }}
//           >
//             <Typography>
//               Lorem ipsum dolor sit, amet consectetur adipisicing elit. Pariatur
//               accusamus blanditiis eaque soluta molestiae quas unde eos laborum
//               ipsam, sint, est nulla. Veniam sit quod laboriosam maiores
//               pariatur quis rerum.
//             </Typography>
//           </Box>
//         </Grid>

//         <Grid container justifyContent="flex-end">
//           <Box
//             maxWidth="40%"
//             style={{
//               background: "#6c77ff",
//               borderRadius: "8px",
//               padding: "10px",
//             }}
//           >
//             <Typography>
//               Lorem ipsum dolor sit, amet consectetur adipisicing elit. Pariatur
//               accusamus
//             </Typography>
//           </Box>
//         </Grid>

//         <Grid container justifyContent="flex-start">
//           <Box
//             maxWidth="40%"
//             style={{
//               background: "#6c77ff",
//               borderRadius: "8px",
//               padding: "10px",
//             }}
//           >
//             <Typography>Lorem ipsum dolor</Typography>
//           </Box>
//         </Grid>
//       </Container>
//       <Divider />
//       <Container
//         style={{
//           background: "",
//           height: "10vh",
//           borderRadius: "8px",
//           padding: "10px",
//         }}
//       >
//         <Container style={{ display: "flex", height: "60%" }}>
//           <Input
//             placeholder="Escribe un mensaje aqui"
//             fullWidth
//             style={{
//               color: "white",
//               marginRight: "30px",
//             }}
//           />
//           <Button
//             size="large"
//             type="submit"
//             variant="contained"
//             endIcon={<SendIcon />}
//           >
//             Enviar
//           </Button>
//         </Container>
//       </Container>
//     </>
//   );
// };

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

      {/* <ThemeProvider theme={theme}>
        <Grid container alignItems="stretch" style={{ background: "#212121" }}>
          <Grid item xl={2} md={4} style={{ display: "flex" }}>
            <ChatList />
          </Grid>
          <Grid item xl={10} md={12}>
            <ChatBox />
          </Grid>
        </Grid>
      </ThemeProvider>
      */}
    </div>
  );
};

export default Chat;
