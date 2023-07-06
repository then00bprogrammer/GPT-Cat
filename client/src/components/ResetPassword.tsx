import React, { useState, useRef, useContext } from "react";
import {
  Button,
  Flex,
  Input,
  FormLabel,
  Heading,
  useColorModeValue,
  LightMode,
  Alert,
  AlertIcon,
  Box,
  AlertTitle,
  AlertDescription,
  CloseButton,
  Icon,
} from "@chakra-ui/react";
import useEnterKeyPress from "../hooks/useEnterKeyPress";
import { AuthContext } from "../Providers/AuthProvider";
import { auth } from "../firebase/clientApp";
import { useSendPasswordResetEmail } from "react-firebase-hooks/auth";
import { FaArrowLeft, FaChevronLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const onClose = () => {
    setShowAlert(false);
  };
  const currentUser = useContext(AuthContext);
  const [sendPasswordResetEmail, sending, error] =
    useSendPasswordResetEmail(auth);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [email, setEmail] = useState<string>("");

  const bgImage = useColorModeValue(
    "https://images.unsplash.com/photo-1432821596592-e2c18b78144f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bG9naW58ZW58MHx8MHx8fDA%3D&w=1000&q=80",
    "https://images.unsplash.com/photo-1511406361295-0a1ff814c0ce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGRhcmslMjBsb2dpbiUyMHBhZ2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60"
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
      <LightMode>
        {showAlert && (
          <Alert status="success" color="black">
            <AlertIcon />
            <Box>
              <AlertTitle>Email Sent!</AlertTitle>
              <AlertDescription>
                Please check your email and follow the procedure listed to reset
                your password!
              </AlertDescription>
            </Box>
            <CloseButton
              alignSelf="flex-start"
              position="relative"
              right={-1}
              top={-1}
              onClick={onClose}
            />
          </Alert>
        )}
      </LightMode>
        <Icon
          color={useColorModeValue('white','black')}
          cursor='pointer'
          as={FaArrowLeft}
          boxSize={9}
          position="fixed"
          top="5vh"
          right="7.5vh"
          onClick={() => navigate(-1)}
        >
        </Icon>
      <Heading fontSize="4xl" color="white" marginBottom="5vh">
        RESET PASSWORD
      </Heading>
      <form>
        <FormLabel color="white">Email address</FormLabel>
        <Input
          required
          name="email"
          placeholder="email"
          type="email"
          mb={2}
          onChange={(event) => setEmail(event.target.value)}
          width="75vw"
          bg={inputBG}
          color={color}
          borderColor='red.500'
          focusBorderColor='red.500'
          _hover={{ borderColor: 'red.500', outline: "none" }}
        />
        <Flex
          width="full"
          flexDir="column"
          alignItems="center"
          justifyContent="center"
        >
          <Button
            isLoading={sending}
            width="25vw"
            height="50px"
            bg="red.500"
            color="white"
            variant="solid"
            _hover={{ bg: "red.600" }}
            mt={5}
            mb={2}
            size="lg"
            ref={buttonRef}
            onClick={async (event) => {
              event.preventDefault();
              const success = await sendPasswordResetEmail(email);
              if (success) setShowAlert(true);
              else console.log(error);
            }}
          >
            Reset
          </Button>
        </Flex>
      </form>
    </Flex>
  );
};
export default ResetPassword;
