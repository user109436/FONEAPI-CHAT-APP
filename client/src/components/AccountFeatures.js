import React from "react";
import { Link } from "@mui/material";
import { hasErrors, resetErrors } from "../utils/Utilities";
import axios from "axios";
export const AccountMailingFeatures = ({
  loginForm,
  setLoginForm,
  setAlert,
  endpoint,
  textLink,
}) => {
  const handleClick = async (e) => {
    e.preventDefault();

    resetErrors(loginForm, "password");
    const errors = hasErrors(loginForm, "password");
    setLoginForm({ ...loginForm });
    if (!errors) {
      try {
        //3. submit to API
        const { data } = await axios.post(`/api/account/${endpoint}`, {
          email: loginForm.email,
        });
        setAlert({ message: data.message, type: "success" });
      } catch (err) {
        if (err?.response?.data) {
          setAlert({ message: err.response.data.message, type: "error" });
        }
        // errors for no internet connection or could not connect to the server
      }
    }
  };
  return (
    <>
      <Link href="#" variant="body2" onClick={handleClick}>
        {textLink}
      </Link>
    </>
  );
};
