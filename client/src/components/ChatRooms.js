import React, { useState, useEffect, memo } from "react";
import AuthContext from "../provider/AuthProvider";
import { Grid, Divider, List, Box } from "@mui/material";
import axios from "axios";
import CircularIndeterminate from "./CircularIndeterminate";
import { ChatHead } from "./ChatHead";
import ChatSearchBar from "./ChatSearchBar";
const ChatRooms = () => {
  const { loggedInUser, auth, setSelectedChatRoom } =
    React.useContext(AuthContext);
  const [contacts, setContacts] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `/api/chatrooms/user/${loggedInUser?._id}`
        );
        setContacts(data.doc);
      } catch (err) {
        if (err?.response?.data) {
          //    setAlert({ message: err.response.data.message, type: "error" });
          console.log(err);
        }
        // errors for no internet connection or could not connect to the server
      }
    };
    fetchData();
  }, [loggedInUser]);
  if (!auth) {
    return <CircularIndeterminate />;
  }
  return (
    <Box>
      <Grid container>
        <Grid item xs={12} className="border-b">
          <ChatSearchBar />
        </Grid>
      </Grid>
      <Divider />
      <List dense>
        {contacts?.map((item) => (
          <div key={item._id} onClick={() => setSelectedChatRoom(item)}>
            <ChatHead item={item} />
          </div>
        ))}
        <Divider />
      </List>
    </Box>
  );
};

export default memo(ChatRooms);
