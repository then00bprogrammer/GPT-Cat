import { useState, useEffect, useContext } from "react";
import { VStack, useColorModeValue, Flex, Heading } from "@chakra-ui/react";
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
      const resp = await fetch("https://gpt-cat.onrender.com/");
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
      padding="5vw"
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
          <VStack width="full" height="100%" overflowY="auto">
            <Heading color={useColorModeValue("gray.700", "white")} marginBottom='1vh'>
              Top Prompts
            </Heading>
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
                    :false
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
