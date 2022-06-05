import * as React from "react";
import AuthContext from "../provider/AuthProvider";
import { Grid, List, ListItem, ListItemText, Typography } from "@mui/material";
import moment from "moment";
import axios from "axios";
import { fullname } from "../utils/Utilities";

const ChatHistory = ({ chatRoomMessages, setChatRoomMessages }) => {
  const { selectedChatRoom, loggedInUser } = React.useContext(AuthContext);
  React.useEffect(() => {
    //get all chats in the selected chatroom
    if (!selectedChatRoom) return;
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `/api/chats/chatroom/${selectedChatRoom._id}`
        );
        setChatRoomMessages(data.doc);
      } catch (err) {
        if (err?.response?.data) {
          console.log(err);
        }
        // errors for no internet connection or could not connect to the server
      }
    };
    fetchData();
  }, [selectedChatRoom]);
  const scrollRef = React.useRef();
  return (
    <List className="messageArea border-b" sx={{ overflowY: "auto" }}>
      {chatRoomMessages?.map((message) => (
        <ListItem key={message._id}>
          <Grid container>
            <Grid item xs={12}>
              <ListItemText
                align={
                  message.sender?._id === loggedInUser?._id ? "right" : "left"
                }
                primary={
                  <>
                    <Typography
                      variant="caption"
                      sx={{
                        display: "block",
                        color: "gray",
                      }}
                    >
                      {fullname(message.sender)}
                    </Typography>
                    <Typography
                      sx={{
                        color: "white",
                        padding: "5px 12px",
                        borderRadius: "50px",
                        display: "inline-block",
                      }}
                      className={
                        message.sender?._id === loggedInUser?._id
                          ? "grey-bg"
                          : "blue-bg"
                      }
                      variant="body2"
                    >
                      {message.message}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "gray",
                        fontSize: "10px",
                      }}
                      display="block"
                    >
                      {moment(message.createdAt).format(
                        "MMMM Do YYYY, h:mm:ss a"
                      )}
                    </Typography>
                  </>
                }
              ></ListItemText>
            </Grid>
            {/* Scroll to Bottom when new message received */}
            <Grid item xs={12}>
              <div ref={scrollRef}>
                <ListItemText></ListItemText>
              </div>
            </Grid>
          </Grid>
        </ListItem>
      ))}
    </List>
  );
};

export default ChatHistory;
