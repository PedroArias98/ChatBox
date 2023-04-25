import React from "react";
import { Box } from "@mui/material";
import { MdClose } from "react-icons/md";

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <Box
      sx={{
        px: 1.5,
        py: 0.5,
        m: 1,
        mb: 1,
        borderRadius: "10px",
        background: "#6c77ff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
      onClick={handleFunction}
    >
      {user.name}
      <MdClose />
    </Box>
  );
};

export default UserBadgeItem;
