import { createContext, useState } from "react";
const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [selectedChatRoom, setSelectedChatRoom] = useState(null);
  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        loggedInUser,
        setLoggedInUser,
        selectedChatRoom,
        setSelectedChatRoom,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
