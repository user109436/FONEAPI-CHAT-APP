import * as React from "react";
import AuthContext from "../provider/AuthProvider";

import { Box, Grid, TextField, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
// import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { hasErrors, resetErrors } from "../utils/Utilities";
import axios from "axios";

const ChatBox = ({ setChatRoomMessages }) => {
  //states
  const { selectedChatRoom } = React.useContext(AuthContext);
  const [processing, setProcessing] = React.useState(false);
  const [message, setMessage] = React.useState({
    message: "",
    messageError: false,
  });

  //functions
  const handleChange = (e) => {
    const { name, value } = e.target;
    setMessage({ [name]: value });
  };

  const handleSubmit = async () => {
    setProcessing(true);
    resetErrors(message);
    const errors = hasErrors(message);
    if (!errors) {
      try {
        const { data } = await axios.post(
          `/api/chats/chatroom/${selectedChatRoom._id}`,
          message
        );
        //get all messages in this chatroom
        setChatRoomMessages(data.doc);

        //reset composer only if sent
        setMessage({
          message: "",
          messageError: false,
        });
      } catch (err) {
        if (err?.response?.data) {
          console.log(err.response.data);
        }
        // errors for no internet connection or could not connect to the server
      }
    }
    setProcessing(false);
  };
  const submitOnEnter = () => {};

  //IMPLEMENTATION OF AWS S3
  // const handleImageChange = () => {};

  return (
    <>
      <Grid
        container
        justifyContent="space-around"
        alignItems="center"
        sx={{ marginTop: 4 }}
      >
        <Grid item xs={8}>
          <TextField
            autoFocus
            variant="outlined"
            margin="dense"
            label="Type Something"
            name="message"
            value={message.message}
            onChange={handleChange}
            onKeyUp={submitOnEnter}
            fullWidth
            disabled={processing}
          />
        </Grid>
        <Grid item xs={2}>
          <Box color="primary" aria-label="add">
            <IconButton
              disabled={processing}
              color="primary"
              aria-label="send message"
              component="span"
              onClick={(e) => handleSubmit(e)}
            >
              <SendIcon fontSize="large" />
            </IconButton>

            {/* IMPLEMENT AWS S3 BUCKET HERE */}

            {/* <IconButton
              color="primary"
              aria-label="send image"
              component="span"
            >
              <AddPhotoAlternateIcon fontSize="large" />
            </IconButton> */}
          </Box>
        </Grid>
      </Grid>
    </>
  );
};
export default ChatBox;
