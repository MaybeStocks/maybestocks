import { useEffect, useState, useRef } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import SendIcon from "@mui/icons-material/Send";
import TextField from "@mui/material/TextField";
import { useAuth, db } from "../hooks/useAuth";
import Popup from "../components/Popup/Popup";

import {
  query,
  onSnapshot,
  orderBy,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

function ForumPage() {
  // This is how we update firestore
  const [messages, setMessagesState] = useState([]);
  // This will store the current text in the input box
  const [newText, setNewTextState] = useState("");
  const [failurePopup, setFailurePopup] = useState(false);
  const scrollDown = useRef();

  const { user } = useAuth();

  useEffect(() => {
    const colRef = collection(db, "Messages");
    const q = query(colRef, orderBy("time"));
    function fetchData() {
      onSnapshot(q, (querySnapshot) => {
        const allMessages = [];
        querySnapshot.forEach((doc) => {
          allMessages.push(doc.data());
        });
        setMessagesState(allMessages);
      });
    }
    fetchData();
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    const colRef = collection(db, "Messages");
    if (newText !== "") {
      await addDoc(colRef, {
        text: newText,
        time: serverTimestamp(),
        username: user?.displayName,
      });
    } else {
      setFailurePopup(true);
    }
  };

  useEffect(() => {
    setTimeout(
      scrollDown.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      }),
      100
    );
  }, [messages]);

  return (
    <>
      {messages.map((obj) => (
        <Grid
          container
          direction="column"
          justifyContent="space-evenly"
          alignItems="stretch"
          sx={{
            border: 1,
            m: 2,
            p: 1,
            borderRadius: 2,
            width: 1 / 4,
            mx: "auto",
          }}
        >
          {obj.username + ": " + obj.text}
          <div>
            {
            (obj.time === null) 
            ? <div> Loading... </div> 
            : obj.time.toDate().toLocaleTimeString() + " " + obj.time.toDate().toDateString()
            }
          </div>
        </Grid>
      ))}
      <form>
        <Box
          component="form"
          sx={{
            "& .MuiTextField-root": { m: 1, width: "25ch" },
          }}
          noValidate
          autoComplete="off"
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              flexWrap: "wrap",
            }}
            ref={scrollDown}
          >
            <TextField
              id="outlined-textarea"
              label="Enter your message here"
              multiline
              onChange={(event) => setNewTextState(event.target.value)}
            />
            <IconButton
              color="primary"
              aria-label="submit"
              onClick={sendMessage}
            >
              <SendIcon fontSize="large" />
            </IconButton>
          </div>
        </Box>
      </form>

      <Popup trigger={failurePopup} setTrigger={setFailurePopup}>
        <h2>Empty field!</h2>
        <div>Please type in a message.</div>
      </Popup>
    </>
  );
}

export default ForumPage;
