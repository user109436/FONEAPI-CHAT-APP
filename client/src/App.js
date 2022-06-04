import { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { blue } from "@mui/material/colors";
//utilities
import { ProtectedRoute } from "./utils/Auth";

//context
import AuthContext from "./provider/AuthProvider";

//pages
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import NotFound from "./pages/404";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: blue[500],
    },
  },
  typography: {
    fontFamily: "Quicksand",
    fontWeightLight: 400,
    fontWeightRegular: 500,
    fontWeightMedium: 600,
    fontWeightBold: 700,
  },
});

function App() {
  // const { auth, setAuth, setLoggedInUser } = useContext(AuthContext);
  return (
    <>
      <ThemeProvider theme={theme}>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </>
  );
}

export default App;
