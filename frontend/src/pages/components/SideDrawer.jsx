import React, { useImperativeHandle } from "react";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import axios from "axios";

import TemporaryDrawer from "./Drawer";
import ChatLoading from "./ChatLoading";
import UserListItem from "./userAvatar/UserListItem";

import { ChatState } from "../../Context/ChatProvider";

import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";

import { styled } from "@mui/material/styles";
import { Box, List, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { AiFillWechat, AiFillFileAdd, AiFillVideoCamera } from "react-icons/ai";
import { MdImageNotSupported, MdPersonSearch } from "react-icons/md";
import { TextField, Input } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";

import Badge from "@mui/material/Badge";
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import CssBaseline from "@mui/material/CssBaseline";
import IconButton from "@mui/material/IconButton";
import Snackbar from "@mui/material/Snackbar";
import CircularProgress from "@mui/material/CircularProgress";

import { MdChevronLeft } from "react-icons/md";
import "../../App.css";

import io from "socket.io-client";

const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

//import { TemeProvider } from "@emotion/react";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

const OfflineBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#FAFAFA",
    color: "#FAFAFA",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
}));

const LightTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
}));

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#3f51b5",
    },
    secondary: {
      main: "#b39ddb",
    },
  },
});

const SideDrawer = ({ userObj, email, avatar, children }) => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();

  const [socketConnected, setSocketConnected] = useState(false);

  useEffect(() => {
    socket = io(ENDPOINT);

    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("disconnected", () => setSocketConnected(false));

    return () => {
      socket.disconnect();
    };
  }, []);

  const { setSelectedChat, user, chats, setChats, status, setStatus } =
    ChatState();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          width: anchor === "top" || anchor === "bottom" ? "auto" : 350,
        }}
        role="presentation"
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography class="subtitle" style={{ marginLeft: "20px" }}>
            Buscar Usuarios
          </Typography>
          <IconButton onClick={toggleDrawer(anchor, false)} sx={{ margin: 2 }}>
            {theme.direction === "ltr" ? <MdChevronLeft /> : <MdChevronLeft />}
          </IconButton>
        </Box>

        <Divider />
        <Box sx={{ p: 2, display: "flex", justifyContent: "space-between" }}>
          <TextField
            placeholder="Buscar por nombre o email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            sx={{}}
          />
          <Button variant="contained" onClick={handleSearch}>
            Ir
          </Button>
        </Box>
      </Box>
      {loading ? (
        <ChatLoading />
      ) : (
        searchResult?.map((userObj) => (
          <Box sx={{ px: 2 }}>
            <UserListItem
              key={userObj._id}
              user={userObj}
              handleFunction={() => accessChat(userObj._id)}
            />
          </Box>
        ))
      )}
    </ThemeProvider>
  );

  const ariaLabel = { "aria-label": "description" };

  const history = useHistory();

  const logOutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  };

  const handleSearch = async () => {
    if (!search) {
      //TODO implementar un toast
      alert("Ingresar algo a buscar");

      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);

      setLoading(false);

      setSearchResult(data);
    } catch (error) {
      alert("ha ocurrido un error");
      console.log(error);
    }
    console.log(search);
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post("/api/chat", { userId }, config);
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      toggleDrawer("left", false);
    } catch (error) {
      alert("error al crear el chat");
      console.log(error);
    }
  };
  return (
    <>
      <Box
        sx={{
          backgroundColor: "#252331",
          display: "flex",
          justifyContent: "space-between",
          width: "100",
          height: "7vh",
        }}
      >
        <LightTooltip title="Buscar Usuarios">
          <React.Fragment key={"left"}>
            <Button size="small" onClick={toggleDrawer("left", true)}>
              <MdPersonSearch size={30} />

              <TextField
                placeholder="Buscar Usuario"
                variant="outlined"
                inputProps={ariaLabel}
                style={{ marginLeft: 10 }}
                size="small"
              />
            </Button>
            <Drawer
              anchor={"left"}
              open={state["left"]}
              onClose={toggleDrawer("left", false)}
              variant="persistent"
            >
              {list("left")}
              {loadingChat && <CircularProgress />}
            </Drawer>
          </React.Fragment>
        </LightTooltip>

        <div>
          <Button
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
          >
            {socketConnected ? (
              <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                variant="dot"
              >
                <Avatar src={user.pic}></Avatar>
              </StyledBadge>
            ) : (
              <OfflineBadge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                variant="dot"
              >
                <Avatar src={user.pic}></Avatar>
              </OfflineBadge>
            )}
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem onClick={handleClose} sx={{ backgroundColor: "343145" }}>
              <Avatar src={user.pic}></Avatar>
              <Button sx={{ color: "white" }}>
                {user.name}
                <br />
                {user.email}
              </Button>
            </MenuItem>

            <MenuItem onClick={handleClose}>Conectado</MenuItem>

            <MenuItem onClick={logOutHandler}>Logout</MenuItem>
          </Menu>
        </div>
      </Box>
    </>
  );
};

export default SideDrawer;
