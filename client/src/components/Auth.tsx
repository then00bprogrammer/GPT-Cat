import React from 'react';
import { Avatar, Button, VStack } from '@chakra-ui/react';
import { useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/clientApp';

const Auth = () => {
  const [signInWithGoogle, guser, gloading, gerror] = useSignInWithGoogle(auth);
  const handleSignIn= async()=>{
    await signInWithGoogle();
  }
  return (
    <VStack
      width='100vw'
      height='100vh'
      alignItems='center'
      justifyContent='center'
      bgImage='https://images.unsplash.com/photo-1432821596592-e2c18b78144f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bG9naW58ZW58MHx8MHx8fDA%3D&w=1000&q=80'
      bgPosition='center'
      bgRepeat='no-repeat'
      bgSize='cover'
      padding={0}
    >
      <Button
        width='70%'
        height='15%'
        bg="whiteAlpha.900"
        color="black"
        fontWeight="bold"
        fontSize='lg'
        borderRadius="10px"
        _hover={{ bg: 'gray.100', textDecoration: 'none' }}
        onClick={()=>handleSignIn()}
      >
        <Avatar
          src='https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png'
          mr={4}
        />
        Login with Google
      </Button>
    </VStack>
  );
};

export default Auth;
