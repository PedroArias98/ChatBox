import React from "react";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../../config/chatLogics";
import { ChatState } from "../../Context/ChatProvider";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { Avatar } from "@mui/material";

export const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  return (
    <div style={{ overflowX: "hidden", overflowY: "auto" }}>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Avatar
                src={m.sender.pic}
                name={m.sender.name}
                sx={{ mr: 1, mt: "7px" }}
              />
            )}

            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? "#6c77ff" : "#343145"
                }`,
                color: "#fafafa",

                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
    </div>
  );
};
