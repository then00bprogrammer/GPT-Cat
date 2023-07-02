import React, { useState, useEffect, useRef} from "react";
import { Button, Flex, Input, FormLabel, Box, Heading, Text } from "@chakra-ui/react";
import {
  useSignInWithEmailAndPassword,
} from "react-firebase-hooks/auth";
import { auth } from "../firebase/clientApp";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

const LogIn = () => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [signupForm, setSignupForm] = useState({
    email: "",
    password: "",
  });

  const [
    signInWithEmailAndPassword,
    user,
    loading,
    error,
  ] = useSignInWithEmailAndPassword(auth);

  const [customErrorMessage, setCustomErrorMessage] = useState<string>("");

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await signInWithEmailAndPassword(
        signupForm.email,
        signupForm.password
      );
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
    const handleKeyDown = (event:any) => {
      if (event.key === 'Enter') {
        buttonRef.current?.click()
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <Flex
      width="100vw"
      height="100vh"
      flexDir='column'
      alignItems="center"
      justifyContent="center"
      bgImage="https://images.unsplash.com/photo-1432821596592-e2c18b78144f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bG9naW58ZW58MHx8MHx8fDA%3D&w=1000&q=80"
      bgPosition="center"
      bgRepeat="no-repeat"
      bgSize="cover"
    >
      <Heading fontSize='4xl' color='white'> LOGIN</Heading>
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
          bg='white'
          borderColor="teal.500"
          _hover={{ borderColor: "teal.500" }}
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
          bg='white'
          borderColor="teal.500"
          _hover={{ borderColor: "teal.500" }}
        />
        
        <Flex width="full" flexDir='column' alignItems="center" justifyContent="center">
          <Button
            width="25vw"
            height="50px"
            bg="teal.400"
            color="white"
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
          <Link to ='/auth'>
          <Text color='gray.500' fontSize='lg'>New here?</Text>
          </Link>
        </Flex>
      </form>
    </Flex>
  );
};
export default LogIn;
