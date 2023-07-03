import React, { createContext, useEffect, useState } from "react";
import { auth } from "../firebase/clientApp";
import { useAuthState } from "react-firebase-hooks/auth";
import { Flex, Heading, useColorModeValue } from "@chakra-ui/react";
import { Player } from "@lottiefiles/react-lottie-player";
import Cat from "../assets/cat.json";

interface User {
  email: string | null | undefined;
  photoURL: string | null | undefined;
  displayName: string | null | undefined;
}

const AuthContext = createContext<User | null | undefined>(null);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, loading, error] = useAuthState(auth);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    if (!loading) {
      setCurrentUser({
        email: user?.email,
        photoURL: user?.email,
        displayName: user?.displayName,
      });

      if (user && user.email) {
        localStorage.setItem("email", user.email);
      }
    }
  }, [loading, user]);

  if (loading) {
    return (
      <Flex
        bg={useColorModeValue("white", "gray.900")}
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="600px"
        width="450px"
      >
        <Heading color={useColorModeValue('black','white')}>Loading...</Heading>
        <Player
          autoplay
          loop
          src={Cat}
          style={{ height: "100%", width: "100%" }}
        />
      </Flex>
    );
  }

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};

export { AuthProvider, AuthContext };
