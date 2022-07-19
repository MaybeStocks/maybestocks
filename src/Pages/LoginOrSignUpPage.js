import { useState } from "react";
import Button from "@mui/material/Button";
import LoginPage from "../Pages/LoginPage";
import SignUpPage from "../Pages/SignUpPage";
import "./LoginOrSignUpPage.css";

function LoginOrSignUpPage() {
  const [showSignUp, setShowSignUp] = useState(false);

  const onClick = () => setShowSignUp(!showSignUp);

  return (
    <>
      <div className="header">
        {showSignUp ? (
          <>
            <SignUpPage />
            <div>
              Already have an account?
              <Button size="small" onClick={onClick}>
                Sign In
              </Button>
              here!
            </div>
          </>
        ) : (
          <>
            {" "}
            <LoginPage />
            <div>
              Don't have an account?
              <Button size="small" onClick={onClick}>
                Sign Up
              </Button>
              here!
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default LoginOrSignUpPage;
