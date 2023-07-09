import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  Flex,
  Input,
  FormLabel,
  Heading,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "../firebase/clientApp";
import { Link } from "react-router-dom";
import useEnterKeyPress from "../hooks/useEnterKeyPress";
import CustomAlert from "./CustomAlert";

const SignupForm = () => {
  const [showAlert, setShowAlert] = useState<boolean>(false);
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
      setShowAlert(true);
      return;
    }

    if (signupForm.password.length < 6) {
      setCustomErrorMessage("Password should be at least 6 characters long");
      setShowAlert(true);
      return;
    }

    try {
      await createUserWithEmailAndPassword(
        signupForm.email,
        signupForm.password
      );
      await fetch("https://gpt-cat.onrender.com/createUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: signupForm.email,
        }),
      });
      chrome.runtime.sendMessage(
        { action: "setValue", email: signupForm.email },
        function (response) {
          console.log("Received response from background.js:", response);
        }
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
    setShowAlert(false);
    setSignupForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const bgImage = useColorModeValue(
    "../images/login-light.jpeg",
    "../images/login-dark.avif"
  );
  const inputBG = useColorModeValue("white", "blackAlpha.300");
  const color = useColorModeValue("black", "white");

  useEnterKeyPress(buttonRef);

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
      <CustomAlert
        title="Error!"
        description={customErrorMessage}
        showAlert={showAlert}
        setShowAlert={setShowAlert}
      ></CustomAlert>
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
          focusBorderColor="teal.500"
          _hover={{ borderColor: "teal.500" }}
          _focus={{ borderColor: "teal.500", bg: inputBG }}
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
          focusBorderColor="teal.500"
          _hover={{ borderColor: "teal.500" }}
          _focus={{ borderColor: "teal.500", bg: inputBG }}
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
          focusBorderColor="teal.500"
          _hover={{ borderColor: "teal.500" }}
          _focus={{ borderColor: "teal.500", bg: inputBG }}
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
          <Link to="/resetPassword">
            <Text
              color="gray.500"
              cursor="pointer"
              marginTop="1vh"
              fontSize="lg"
              _hover={{ textDecoration: "underline" }}
            >
              Reset your password
            </Text>
          </Link>
        </Flex>
      </form>
    </Flex>
  );
};
export default SignupForm;
