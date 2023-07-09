import { useState, useEffect, useContext } from "react";
import {
  VStack,
  useColorModeValue,
  Flex,
  Heading,
  Select,
} from "@chakra-ui/react";
import { AuthContext } from "../Providers/AuthProvider";
import Ball from "../assets/ball.json";
import { Player } from "@lottiefiles/react-lottie-player";
import PublicPrompt from "./PublicPrompt";

type PublicPrompt = {
  name: string;
  content: string;
  _id: string;
  likes: string;
  likedBy: string[];
  starredBy: string[];
};

const TopPrompts = () => {
  const currentUser = useContext(AuthContext);
  const bodyBG = useColorModeValue("white", "gray.800");
  const fontColor = useColorModeValue("black", "white");

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [prompts, setPrompts] = useState<PublicPrompt[]>([]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const resp = await fetch("http://localhost:5000/");
      const prompts = await resp.json();
      setPrompts(prompts);
    } catch (error) {
      console.log("Couldnt fetch data", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <VStack
      paddingTop="5vw"
      paddingBottom="5vw"
      minHeight="80vh"
      width="100%"
      overflowY="hidden"
      color={fontColor}
      bg={bodyBG}
    >
      {isLoading ? (
        <Flex
          bg={useColorModeValue("white", "gray.800")}
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="100%"
          width="100%"
        >
          <Player
            autoplay
            loop
            src={Ball}
            style={{ height: "100%", width: "100%" }}
          />
        </Flex>
      ) : (
        <>
          <VStack width="100%" height="100%" overflowY="auto">
            <Heading
              color={useColorModeValue("gray.700", "white")}
              marginBottom="1vh"
            >
              Top Prompts
            </Heading>
            <Select
              width='90%'
              marginLeft='5vw' marginRight='5vw'
              placeholder="Select Categories"
              bg="gray.500"
              borderColor="gray.500"
              focusBorderColor="gray.600"
              color="white"
            >
              <option value="option1" style={{ color: "black" }}>
                Option 1
              </option>
              <option value="option2" style={{ color: "black" }}>
                Option 2
              </option>
              <option value="option3" style={{ color: "black" }}>
                Option 3
              </option>
            </Select>
            {prompts.map((prompt) => (
              <PublicPrompt
                key={prompt._id}
                _id={prompt._id}
                name={prompt.name}
                content={prompt.content}
                likes={prompt.likes}
                isLiked={
                  currentUser?.email
                    ? prompt.likedBy.includes(currentUser.email)
                    : false
                }
                isStarred={
                  currentUser?.email
                    ? prompt.starredBy.includes(currentUser?.email)
                    : false
                }
              />
            ))}
          </VStack>
        </>
      )}
    </VStack>
  );
};

export default TopPrompts;
