import { Spacer, VStack, useColorMode, useColorModeValue } from "@chakra-ui/react";
import "./App.css";
import MenuBar from "./components/MenuBar";
import NavBar from "./components/NavBar";
import Prompts from "./components/Prompts";
import Auth from "./components/SignUp";
import { MemoryRouter as Router, Routes, Route } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./Providers/AuthProvider";
import Profile from "./components/Profile";
import Bookmarks from "./components/Bookmarks";
import LogIn from "./components/LogIn";
import TopPrompts from "./components/TopPrompts";

function App() {
  const currentUser = useContext(AuthContext);
  const { toggleColorMode } = useColorMode();
  const bg = useColorModeValue('white', 'gray.900');
  
  return (
    <VStack
      height="600px"
      width="450px"
      borderRadius={10}
      alignItems="flex-start"
      bg={bg}
      spacing={0}
    >
      {currentUser ? (
        <Router>
          <NavBar />
          <Routes>
            <Route path="/" element={<Prompts />} />
            <Route path="/topPrompts" element={<TopPrompts />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
            <Route path="/prompts/:id/:folderName" element={<Prompts />} />
            <Route path="/login" element={<LogIn />} />
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
