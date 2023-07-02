import React, { useContext } from 'react'
import { Avatar, HStack, Spacer, Text } from '@chakra-ui/react'
import { AuthContext } from '../Providers/AuthProvider';

const NavBar: React.FC = () => {
  const currentUser = useContext(AuthContext);
  const imageURL = currentUser?.photoURL || undefined;
  return (
    <HStack width='100vw' height='10vh' padding='1vh 5vw' borderBottomWidth='1px' borderBottomColor='blackAlpha.700'>
        <Avatar src='https://img.lovepik.com/element/45001/6381.png_860.png'/>
        <Text textAlign='center' fontWeight='bold' fontSize='2xl'>GPT Cat</Text>
        <Spacer/>
        <Avatar src={imageURL}/>
    </HStack>
  )
}

export default NavBar;