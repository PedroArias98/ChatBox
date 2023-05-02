import { React, useReducer, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Grow, TextField } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CircularProgress from "@mui/material/CircularProgress";
import UserListItem from "./userAvatar/UserListItem";
import UserBadgeItem from "./userAvatar/UserBadgeItem";

import { ChatState } from "../../Context/ChatProvider";
import FormControl from "@mui/material/FormControl";

import IconButton from "@mui/material/IconButton";
import GroupsIcon from "@mui/icons-material/Groups";

import darkTheme from "../misc/theme";

import axios from "axios";

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

const GroupChatModal = ({ children }) => {
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user, chats, setChats } = ChatState();

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }
    try {
      setLoading(true);

      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      //console.log(data);
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

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      alert("Porfavor ingrese todos los campos");
    }
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.post(
        "/api/chat/group",
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );

      setChats([data, ...chats]);
      setOpen(false);
      alert("Nuevo grupo creado");
    } catch (error) {
      alert("No se ha podido crear el grupo");
    }
  };
  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      alert("Usuario ya agregado");
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <div>
      <IconButton onClick={handleOpen} variant="contained">
        <GroupsIcon />
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
              Crear Chat Grupal
            </Typography>
            <FormControl>
              <TextField
                placeholder="Nombre del Grupo"
                variant="outlined"
                sx={{ mb: 2 }}
                onChange={(e) => setGroupChatName(e.target.value)}
                size="small"
              />
            </FormControl>

            <FormControl>
              <TextField
                placeholder="Agregar Usuarios"
                variant="outlined"
                sx={{ mb: 1 }}
                onChange={(e) => handleSearch(e.target.value)}
                size="small"
              />
            </FormControl>
            <Box sx={{ display: "flex", flexWrap: "wrap" }}>
              {selectedUsers.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}
            </Box>

            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              {loading ? (
                <CircularProgress />
              ) : (
                searchResult
                  ?.slice(0, 4)
                  .map((user) => (
                    <UserListItem
                      key={user._id}
                      user={user}
                      handleFunction={() => handleGroup(user)}
                    />
                  ))
              )}
            </Typography>

            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 3 }}
              onClick={handleSubmit}
            >
              Crear Chat
            </Button>
          </Box>
        </ThemeProvider>
      </Modal>
    </div>
  );
};

export default GroupChatModal;
