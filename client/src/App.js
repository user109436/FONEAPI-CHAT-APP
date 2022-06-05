import { useContext, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import { useJwt } from "react-jwt";
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
  const { auth, setAuth, setLoggedInUser } = useContext(AuthContext);
  let { decodedToken } = useJwt(localStorage.getItem("token"));

  //VERIFY the TOKEN to API, if malformed logout
  useEffect(() => {
    const fetchData = async () => {
      let token = localStorage.getItem("token");
      if (!token) return false;
      try {
        const res = await axios.post(`/api/users/identify-user`, {
          token,
        });
        const { doc } = res?.data;
        if (doc) {
          setLoggedInUser(doc);
          setAuth(token);
        }
      } catch (err) {
        //token is malformed removed -> logout and clear localStorage
        try {
          console.log("Token Malformed Logging Out User...");
          await axios.post(`/api/account/logout`);
          localStorage.clear();
          setAuth(null);
          window.location.reload(); //reload page
        } catch (err) {
          console.log(err);
        }
      }
    };
    console.log(`exp:`, decodedToken?.exp);
    if (decodedToken?.role) {
      setAuth({ ...decodedToken });
    }
    fetchData();
  }, [decodedToken]);
  return (
    <>
      <ThemeProvider theme={theme}>
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute isAllowed={!auth} redirectPath="/chat">
                  <Login />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chat"
              element={
                <ProtectedRoute isAllowed={auth}>
                  <Chat />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </>
  );
}

export default App;
