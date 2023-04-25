import React from "react";
import { Box, Avatar, Typography } from "@mui/material";
const UserListItem = ({ user, handleFunction }) => {
  return (
    <Box
      onClick={handleFunction}
      sx={{
        width: "90%",
        display: "flex",
        alignItems: "center",

        borderRadius: "10px",
        background: "#212121",
        px: 2,
        mt: "5px",

        ":hover": {
          background: "#6c77ff",
        },
      }}
    >
      <Avatar name={user.name} src={user.pic} />
      <Box sx={{ p: "10px" }}>
        <Typography>{user.name}</Typography>
        <Typography fontSize="xs">{user.email}</Typography>
      </Box>
    </Box>
  );
};

export default UserListItem;
