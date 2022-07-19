import { useAuth } from "../hooks/useAuth";
import Button from "@mui/material/Button";
import SignIn from "../components/SignIn/SignIn";
import logo from "../images/maybestockslogo.png";

function LoginPage() {
  const { signInWithGoogle } = useAuth();

  return (
    <>
      <img src={logo} alt="img" width="420px" height="auto" />
      <SignIn />
      <Button variant="contained" color="primary" onClick={signInWithGoogle}>
        Sign in with Google
      </Button>
    </>
  );
}

export default LoginPage;
