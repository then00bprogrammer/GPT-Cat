import React from 'react'
import { Avatar, HStack, Spacer, Text } from '@chakra-ui/react'

const NavBar: React.FC = () => {
  return (
    <HStack width='100vw' height='10vh' padding='1vh 5vw'>
        <Avatar src='https://img.lovepik.com/element/45001/6381.png_860.png'/>
        <Text textAlign='center' fontWeight='bold' fontSize='2xl'>GPT Cat</Text>
        <Spacer/>
        <Avatar src='https://lh3.googleusercontent.com/a/AAcHTtd0-5ujaFy63136jWFz3YpvPli7zEEupRGdOv-TZA=s96-c'/>
    </HStack>
  )
}

export default NavBar;