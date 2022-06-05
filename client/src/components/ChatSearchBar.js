import * as React from "react";
import axios from "axios";

export default function ChatSearchBar() {
  //fethc all users
  const [contacts, setContacts] = React.useState(null);
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`/api/users`);
        setContacts(data);
      } catch (err) {
        if (err?.response?.data) {
          console.log(err);
        }
        // errors for no internet connection or could not connect to the server
      }
    };
    fetchData();
  }, []);
  if (!contacts) {
    return "Loading...";
  }
  return "place search bar here";
}
