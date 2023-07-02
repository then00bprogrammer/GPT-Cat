import { Spacer, VStack } from "@chakra-ui/react";
import "./App.css";
import MenuBar from "./components/MenuBar";
import NavBar from "./components/NavBar";
import Prompts from "./components/Prompts";
import Auth from "./components/Auth";
import { MemoryRouter as Router, Routes, Route } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./Providers/AuthProvider";
import Profile from "./components/Profile";
import Bookmark from "./components/Bookmark";
import LogIn from "./components/LogIn";

function App() {
  const currentUser = useContext(AuthContext);
  return (
    <VStack
      height="600px"
      width="450px"
      borderRadius={10}
      alignItems="flex-start"
      bg="white"
      spacing={0}
    >
      {currentUser ? (
        <Router>
          <NavBar />
          <Routes>
            <Route path="/" element={<Prompts />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/bookmarks" element={<Bookmark />} />
          </Routes>
          <MenuBar />
        </Router>
      ) : (
        <Router>
          <Routes>
            <Route path="/" element={<LogIn />} />
            <Route path="/auth" element={<Auth />} />
          </Routes>
        </Router>
      )}
    </VStack>
  );
}

export default App;
