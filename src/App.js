import "./App.css";
import { useAuth } from "./hooks/useAuth";
import MainPage from "./Pages/MainPage";
import LoginOrSignUpPage from "./Pages/LoginOrSignUpPage";

function App() {
  const { user } = useAuth();

  return (
    <>
      <div className="App">{user 
        ? <MainPage /> 
        : <LoginOrSignUpPage />}</div>
    </>
  );
}

export default App;
