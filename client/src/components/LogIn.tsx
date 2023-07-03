import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Flex,
  Input,
  FormLabel,
  Box,
  Heading,
  Text,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "../firebase/clientApp";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

const LogIn = () => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [signupForm, setSignupForm] = useState({
    email: "",
    password: "",
  });

  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);

  const [customErrorMessage, setCustomErrorMessage] = useState<string>("");

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await signInWithEmailAndPassword(signupForm.email, signupForm.password);
      setSignupForm({
        email: "",
        password: "",
      });
    } catch (error) {
      console.log(error);
      setCustomErrorMessage("Internal Server Error");
    }
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCustomErrorMessage("");
    setSignupForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === "Enter") {
        buttonRef.current?.click();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const colorMode = useColorMode();
  const bgImage = useColorModeValue(
    "https://images.unsplash.com/photo-1432821596592-e2c18b78144f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bG9naW58ZW58MHx8MHx8fDA%3D&w=1000&q=80",
    "https://images.unsplash.com/photo-1511406361295-0a1ff814c0ce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGRhcmslMjBsb2dpbiUyMHBhZ2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60"
  );
  const color = useColorModeValue("black", "white");
  const inputBG = useColorModeValue("white", "blackAlpha.300");

  return (
    <Flex
      width="100vw"
      height="100vh"
      flexDir="column"
      alignItems="center"
      justifyContent="center"
      bgImage={bgImage}
      color={color}
      bgPosition="center"
      bgRepeat="no-repeat"
      bgSize="cover"
    >
      <Heading fontSize="4xl" color="white">
        {" "}
        LOGIN
      </Heading>
      <form onSubmit={onSubmit}>
        <FormLabel color="white">Email address</FormLabel>
        <Input
          required
          name="email"
          placeholder="email"
          type="email"
          mb={2}
          onChange={onChange}
          width="75vw"
          bg={inputBG}
          borderColor="teal.500"
          _hover={{ borderColor: "teal.500" }}
          color={color}
        />
        <FormLabel color="white">Password</FormLabel>
        <Input
          required
          name="password"
          placeholder="password"
          type="password"
          mb={2}
          onChange={onChange}
          width="75vw"
          bg={inputBG}
          borderColor="teal.500"
          _hover={{ borderColor: "teal.500" }}
          color={color}
        />

        <Flex
          width="full"
          flexDir="column"
          alignItems="center"
          justifyContent="center"
        >
          <Button
            width="25vw"
            height="50px"
            bg="teal.400"
            variant="solid"
            _hover={{ bg: "teal.500" }}
            mt={5}
            mb={2}
            size="lg"
            type="submit"
            isLoading={loading}
            ref={buttonRef}
          >
            Login
          </Button>
          <Link to="/auth">
            <Text color="gray.500" fontSize="lg">
              New here?
            </Text>
          </Link>
        </Flex>
      </form>
    </Flex>
  );
};
export default LogIn;
