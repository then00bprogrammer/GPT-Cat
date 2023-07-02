import React, { useState } from "react";
import {
  Button,
  Flex,
  Input,
  FormLabel,
  Box,
  Heading,
  Text,
} from "@chakra-ui/react";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "../firebase/clientApp";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

const SignupForm = () => {
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

  return (
    <Flex
      width="100vw"
      height="100vh"
      flexDir="column"
      alignItems="center"
      justifyContent="center"
      bgImage="https://images.unsplash.com/photo-1432821596592-e2c18b78144f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bG9naW58ZW58MHx8MHx8fDA%3D&w=1000&q=80"
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
          bg="white"
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
          bg="white"
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
          bg="white"
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
