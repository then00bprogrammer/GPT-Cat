import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  Flex,
  Input,
  FormLabel,
  Box,
  Heading,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "../firebase/clientApp";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

const SignupForm = () => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [signupForm, setSignupForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [createUserWithEmailAndPassword, user, loading, error] =
    useCreateUserWithEmailAndPassword(auth);

  const [customErrorMessage, setCustomErrorMessage] = useState<string>("");

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (signupForm.password !== signupForm.confirmPassword) {
      setCustomErrorMessage("Passwords do not match");
      return;
    }

    if (signupForm.password.length < 6) {
      setCustomErrorMessage("Password should be at least 6 characters long");
      return;
    }

    try {
      await createUserWithEmailAndPassword(
        signupForm.email,
        signupForm.password
      );
      await fetch("http://localhost:5000/createUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: signupForm.email,
        }),
      });
      setSignupForm({
        email: "",
        password: "",
        confirmPassword: "",
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

  const bgImage = useColorModeValue(
    "https://images.unsplash.com/photo-1432821596592-e2c18b78144f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bG9naW58ZW58MHx8MHx8fDA%3D&w=1000&q=80",
    "https://images.unsplash.com/photo-1511406361295-0a1ff814c0ce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGRhcmslMjBsb2dpbiUyMHBhZ2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60"
  );
  const inputBG = useColorModeValue("white", "blackAlpha.300");
  const color = useColorModeValue("black", "white");

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

  return (
    <Flex
      width="100vw"
      height="100vh"
      flexDir="column"
      alignItems="center"
      justifyContent="center"
      bgImage={bgImage}
      bgPosition="center"
      bgRepeat="no-repeat"
      bgSize="cover"
    >
      <Heading fontSize="4xl" color="white">
        {" "}
        REGISTER
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
          color={color}
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
          bg={inputBG}
          color={color}
          borderColor="teal.500"
          _hover={{ borderColor: "teal.500" }}
        />
        <FormLabel color="white">Confirm Password</FormLabel>
        <Input
          name="confirmPassword"
          placeholder="Confirm Password"
          type="password"
          mb={2}
          onChange={onChange}
          width="75vw"
          bg={inputBG}
          color={color}
          borderColor="teal.500"
          _hover={{ borderColor: "teal.500" }}
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
            Sign Up
          </Button>
          <Link to="/">
            <Text color="gray.500" fontSize="lg">
              Already a Member?
            </Text>
          </Link>
        </Flex>
      </form>
    </Flex>
  );
};
export default SignupForm;
