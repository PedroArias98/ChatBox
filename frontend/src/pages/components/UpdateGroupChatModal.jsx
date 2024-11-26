import { useState } from "react";
import React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { ThemeProvider } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import darkTheme from "../misc/theme";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "./userAvatar/UserBadgeItem";
import UserListItem from "./userAvatar/UserListItem";
import { FormControl, TextField, Input } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";

import { MdOutlineEdit } from "react-icons/md";

import axios from "axios";
import axiosInstance from "../../config/axiosInstance";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "#252331",
  borderRadius: "10px",
  display: "flex",
  flexDirection: "column",

  boxShadow: 24,
  p: 4,
  color: "#fafafa",
};

export const UpdateGroupChatModal = ({
  fetchAgain,
  setFetchAgain,
  fetchMessages,
}) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState();
  const [searchResult, setSearchResult] = useState();
  const [loading, setLoading] = useState(false);

  const [selectedUsers, setSelectedUsers] = useState();

  const [renameLoading, setRenameLoading] = useState(false);

  const { selectedChat, setSelectedChat, user } = ChatState();

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      alert("Solo los admins pueden remover a alguien");
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axiosInstance.put(
        `/api/chat/groupremove`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      user1._id === user._id ? setSelectedChat() : setSelectedChat(data); //si el usuario loggeado sale del grupo. Se deja de mostrar el chat
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      alert("Ha ocurrido un error");
    }
  };

  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      //setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axiosInstance.put(
        `/api/chat/rename`,
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );

      console.log(data._id);
      // setSelectedChat("");
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      // setRenameLoading(false);
    } catch (error) {
      alert("ha ocurrrido un error");
      //setRenameLoading(false);
    }
    setGroupChatName("");
  };

  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      alert("El usuario ya se encuentra en el grupo");
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      alert("No tienes el persmiso de administrador");
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        "/api/chat/groupadd",
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
    } catch (error) {
      alert("ha ocurrido un error al agregar el usuario");
    }
    setLoading(false);
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }
    try {
      setLoading(true);

      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      console.log(data);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      alert("Ha ocurrido un error");
    }
  };

  const handleDelete = (deletedUser) => {
    setSelectedUsers(
      selectedUsers.filter((sel) => sel._id !== deletedUser._id)
    );
  };

  return (
    <div>
      <IconButton onClick={handleOpen} variant="outlined">
        <MoreVertIcon />
      </IconButton>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <ThemeProvider theme={darkTheme}>
          <Box sx={style}>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              sx={{ mb: 3 }}
            >
              {selectedChat.chatName}
            </Typography>

            <Box sx={{ width: "100%", display: "flex", flexWrap: "wrap" }}>
              {selectedChat.users.map((u) => (
                <UserBadgeItem
                  key={user._id}
                  user={u}
                  admin={selectedChat.groupAdmin}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </Box>

            <FormControl
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyItems: "center",
                justifyContent: "space-around",
                pt: 3,
              }}
            >
              <TextField
                placeholder="Chat Name"
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
                size="small"
              />

              <Button
                variant="contained"
                onClick={handleRename}
                endIcon={<EditIcon />}
              >
                Rename
              </Button>
            </FormControl>

            <FormControl
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyItems: "center",
                justifyContent: "space-around",
                pt: 3,
                pb: 3,
              }}
            >
              <TextField
                placeholder="Agregar Usuario"
                onChange={(e) => handleSearch(e.target.value)}
                sx={{ px: 1 }}
                size="small"
                fullWidth
              />
            </FormControl>

            {loading ? (
              <CircularProgress />
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleAddUser(user)}
                  />
                ))
            )}

            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Button variant="outlined" color="error" sx={{ mx: 4 }}>
                Leave Group
              </Button>
              <Button variant="contained" color="error" sx={{ mx: 4 }}>
                Delete Group
              </Button>
            </Box>
          </Box>
        </ThemeProvider>
      </Modal>
    </div>
  );
};
