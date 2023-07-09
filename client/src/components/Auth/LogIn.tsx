import React, { useState, useRef, useContext } from "react";
import {
  Button,
  Flex,
  Input,
  FormLabel,
  Heading,
  Text,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  useSignInWithEmailAndPassword,
} from "react-firebase-hooks/auth";
import { auth } from "../../firebase/clientApp";
import { Link, useNavigate } from "react-router-dom";
import useEnterKeyPress from "../../hooks/useEnterKeyPress";
import CustomAlert from "../CustomAlert";

const LogIn = () => {
  const [showAlert,setShowAlert]=useState<boolean>(false);
  const navigate = useNavigate();
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
      chrome.runtime.sendMessage(
        { action: "setValue", email: signupForm.email },
        function (response) {
          console.log("Received response from background.js:", response);
        }
      );
      setSignupForm({
        email: "",
        password: "",
      });
      navigate("/");
    } catch (error) {
      console.log(error);
      setCustomErrorMessage("Internal Server Error");
    }
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowAlert(false);
    setCustomErrorMessage("");
    setSignupForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  useEnterKeyPress(buttonRef);

  const colorMode = useColorMode();
  const bgImage = useColorModeValue(
    "../images/login-light.jpeg",
    "../images/login-dark.avif"
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
      <CustomAlert title='Error!' description={customErrorMessage} showAlert={showAlert} setShowAlert={setShowAlert}></CustomAlert>
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
          focusBorderColor="teal.500"
          _hover={{ borderColor: "teal.500" }}
          _focus={{ borderColor: "teal.500", bg: inputBG }}
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
          focusBorderColor="teal.500"
          _hover={{ borderColor: "teal.500" }}
          _focus={{ borderColor: "teal.500", bg: inputBG }}
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
            <Text
              color="gray.500"
              fontSize="lg"
              _hover={{ textDecoration: "underline" }}
            >
              New here?
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
export default LogIn;
