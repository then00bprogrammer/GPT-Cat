import {
  Box,
  Button,
  CloseButton,
  Heading,
  LightMode,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useContext, useState } from "react";
import { AuthContext } from "../Providers/AuthProvider";
import {
  useSignOut,
  useSendPasswordResetEmail,
} from "react-firebase-hooks/auth";
import { auth } from "../firebase/clientApp";
import { Link } from "react-router-dom";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";

const Profile = () => {
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const onClose = ()=>{
    setShowAlert(false);
  }
  const currentUser = useContext(AuthContext);
  const [sendPasswordResetEmail, sending, error] =
    useSendPasswordResetEmail(auth);
  const displayName = currentUser?.displayName
    ? currentUser.displayName
    : currentUser?.email?.split("@")[0];
  const [signOut] = useSignOut(auth);
  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <VStack
      bgImage="../images/profile.avif"
      bgPosition="center"
      bgRepeat="no-repeat"
      bgSize="cover"
      width="full"
      height="80vh"
      justifyContent="center"
      alignItems="center"
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
      <Heading color="gray.300" size="4xl" marginBottom="5vh">
        PROFILE
      </Heading>
      <Text color="gray.300" fontSize="2xl" fontWeight="semibold">
        {displayName}
      </Text>
      <Text color="gray.300" fontSize="2xl" fontWeight="semibold">
        {currentUser?.email}
      </Text>
      <LightMode>
        <Link to="/">
          <Button
            marginTop="2vh"
            variant="solid"
            colorScheme="red"
            size="lg"
            onClick={handleSignOut}
          >
            Log Out
          </Button>
        </Link>
        <Text
          color="gray.300"
          cursor="pointer"
          marginTop="1vh"
          fontSize="md"
          _hover={{ textDecoration: "underline" }}
          onClick={async () => {
            if (!currentUser?.email) return;
            const success = await sendPasswordResetEmail(currentUser.email);
            if(success) setShowAlert(true);
          }}
        >
          Reset your password
        </Text>
      </LightMode>
    </VStack>
  );
};

export default Profile;
