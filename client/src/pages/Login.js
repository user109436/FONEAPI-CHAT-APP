import * as React from "react";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  Container,
  Alert,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { hasErrors, resetErrors } from "../utils/Utilities";
import { AccountMailingFeatures } from "../components/AccountFeatures";
import AuthContext from "../provider/AuthProvider";
function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://foneapi-chat-app.herokuapp.com/">
        FONEAPI
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const Login = () => {
  //declartion
  const { setAuth, setLoggedInUser } = React.useContext(AuthContext);
  const [loginForm, setLoginForm] = React.useState({
    email: "",
    password: "",
    emailError: false,
    passwordError: false,
  });
  const [alert, setAlert] = React.useState({
    message: "",
    type: "success",
  });
  const [loading, setLoading] = React.useState(false);

  const navigate = useNavigate();

  // 1. LOG-IN submit form to API
  const handleSubmit = async () => {
    // 1. reset to iniatial state and make btn loading
    resetErrors(loginForm);
    setLoading(true);

    // 2. check for errors
    const errors = hasErrors(loginForm);
    setLoginForm({ ...loginForm });
    if (!errors) {
      try {
        //3. submit to API
        const { data } = await axios.post("/api/account/login", loginForm);

        //4. Save Token and User Info for Login then Redirect to Chat Page
        if (data.status === "success" && data.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.data.user));
          setAuth(data.token);
          setLoggedInUser(data.data.user);
          navigate("/chat");
        }
      } catch (err) {
        if (err?.response?.data) {
          setAlert({ message: err.response.data.message, type: "error" });
        }
        // errors for no internet connection or could not connect to the server
      }
    }
    setLoading(false);
  };

  //text input on forms
  const handleChange = (e) => {
    const { name, value } = e.target;

    //remove errors if there's value
    if (value.length > 0) {
      loginForm[`${name}Error`] = false;
    }

    setLoginForm({ ...loginForm, [name]: value });
  };
  // 2. FORGOT PASSWORD
  // 3. RESEND EMAIL VERIFICATION
  return (
    <ThemeProvider theme={darkTheme}>
      <Container component="main" maxWidth="md">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar
            src="https://foneapi.com/images/logo.svg"
            variant="square"
            sx={{ width: 300, margin: 4 }}
            alt="FONEAPI LOGO"
          />
          <Typography component="div" variant="h6">
            CHAT APP LOGIN
          </Typography>
          <Typography variant="overline">
            In Completion to the FONEAPI 4th Assesstment
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            {/* ALERTS */}
            {alert?.message ? (
              <Alert severity={alert?.type}>{alert?.message}</Alert>
            ) : (
              ""
            )}

            {/* INPUT FIELDS */}
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              error={loginForm.emailError}
              value={loginForm.email}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              error={loginForm.passwordError}
              value={loginForm.password}
              onChange={handleChange}
            />
            <Button
              onClick={handleSubmit}
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? "Submitting..." : "LOG IN"}
            </Button>
            <Grid container>
              <Grid item xs>
                <AccountMailingFeatures
                  loginForm={loginForm}
                  setLoginForm={setLoginForm}
                  setAlert={setAlert}
                  endpoint={"forgot-password"}
                  textLink={"Forgot Password?"}
                />
              </Grid>
              <Grid item xs>
                <AccountMailingFeatures
                  loginForm={loginForm}
                  setLoginForm={setLoginForm}
                  setAlert={setAlert}
                  endpoint={"signup/resend-email-verification"}
                  textLink={"Resend Email Verification?"}
                />
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Create Account"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
};
export default Login;
