import * as React from "react";
import { Grid, Box, Typography } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import AuthContext from "../provider/AuthProvider";
import ChatBox from "../components/ChatBox";
import ChatHistory from "../components/ChatHistory";
import ChatRooms from "../components/ChatRooms";
const darkTheme = createTheme({
  palette: {
    mode: "light",
  },
});
const Chat = () => {
  const { selectedChatRoom } = React.useContext(AuthContext);
  const [chatRoomMessages, setChatRoomMessages] = React.useState(null);

  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <Grid container className="chat-section" sx={{ overflow: "hidden" }}>
          <Grid
            item
            xs={3}
            className="border-r"
            sx={{ overflowY: "auto", height: "100vh" }}
          >
            <ChatRooms />
          </Grid>
          <Grid item xs={9} sx={{ overflowY: "auto", height: "100vh" }}>
            <Grid container direction="column" justifyContent="space-around">
              <Grid item xs={9} align="center" sx={{ overflow: "hidden" }}>
                <Box className="border-b" sx={{ padding: 1 }}>
                  <Typography>
                    {selectedChatRoom
                      ? selectedChatRoom?.roomName
                      : "Chatroom Name"}
                  </Typography>
                </Box>
                <ChatHistory
                  chatRoomMessages={chatRoomMessages}
                  setChatRoomMessages={setChatRoomMessages}
                />
              </Grid>
              <Grid item xs={3}>
                <ChatBox
                  chatRoomMessages={chatRoomMessages}
                  setChatRoomMessages={setChatRoomMessages}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </ThemeProvider>
    </>
  );
};

export default Chat;
