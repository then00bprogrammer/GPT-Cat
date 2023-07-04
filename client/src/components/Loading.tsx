import React from "react";
import { Flex, Heading } from "@chakra-ui/react";
import { Player } from "@lottiefiles/react-lottie-player";
import Ball from '../assets/ball.json'

const Loading = () => {
  return (
    <Flex width='100vw' marginTop='5vh' height='85vh' flexDirection='column' alignItems='center' justifyContent='center'>   
      <Player
      autoplay
      loop
      src={Ball}
      style={{ height: '80%', width: '100%' }}
    /></Flex>
  );
};

export default Loading;
