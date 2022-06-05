import * as React from "react";
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Typography,
} from "@mui/material";
import { fullname } from "../utils/Utilities";
import { styled } from "@mui/material/styles";
const CustomizedListItem = styled(ListItem)`
  border-bottom: 1px solid #e0e0e0;
`;

export const ChatHead = ({ item }) => {
  return (
    <CustomizedListItem button>
      <ListItemIcon>
        <Avatar alt="Avatar" />
      </ListItemIcon>
      <ListItemText
        primary={
          <Typography noWrap variant="body2">
            {item?.roomName}
          </Typography>
        }
        secondary={
          <Typography noWrap variant="body2" sx={{ fontSize: "12px" }}>
            {`${fullname(item?.lastMessage?.sender)}: ${
              item?.lastMessage?.message
            }`}
          </Typography>
        }
      >
        chat room
      </ListItemText>
    </CustomizedListItem>
  );
};
