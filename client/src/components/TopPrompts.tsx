import { useState, useEffect, useContext, useRef } from "react";
import {
  VStack,
  useColorModeValue,
  Heading,
  Select,
  Flex,
  HStack,
} from "@chakra-ui/react";
import { AuthContext } from "../Providers/AuthProvider";
import PublicPrompt from "./PublicPrompt";
import { Player } from "@lottiefiles/react-lottie-player";
import Ball from "../assets/ball.json";

type PublicPromptType = {
  name: string;
  content: string;
  _id: string;
  likes: string;
  likedBy: string[];
  starredBy: string[];
};

type CategoryType = {
  name: string;
};

const TopPrompts = () => {
  const currentUser = useContext(AuthContext);
  const bodyBG = useColorModeValue("white", "gray.800");
  const fontColor = useColorModeValue("black", "white");

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [prompts, setPrompts] = useState<PublicPromptType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [currentCategory, setCurrentCategory] = useState<string | null >(null);

  const fetchData = async () => {
    console.log(currentCategory);
    setIsLoading(true);
    try {
      let resp;
      if (currentCategory === null || currentCategory==='')
        resp = await fetch("https://gpt-cat.onrender.com/");
      else
        resp = await fetch(
          `https://gpt-cat.onrender.com/getTopPromptsByCategory/${currentCategory}`
        );

      const promptsData = await resp.json();
      setPrompts(promptsData);
    } catch (error) {
      console.log("Could not fetch data", error);
    }
    setIsLoading(false);
  };

  const fetchCategories = async () => {
    try {
      let resp;
      resp = await fetch("https://gpt-cat.onrender.com/getCategories");
      const allCategories = await resp.json();
      setCategories(allCategories);
    } catch (error) {
      console.log("Could not fetch categories", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchData();
  }, [currentCategory]);

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
      <VStack width="100%" height="100%" overflowY="auto">
        <Heading
          color={useColorModeValue("gray.700", "white")}
          marginBottom="1vh"
        >
          Top Prompts
        </Heading>
        <Select
          width="90%"
          marginLeft="5vw"
          marginRight="5vw"
          placeholder={"General"}
          _placeholder={{color:'white'}}
          bg="gray.400"
          borderColor="gray.400"
          focusBorderColor="gray.500"
          color="black"
          onChange={(e) => {
            setCurrentCategory(e.target.value);
          }}
        >
          {categories.map((category, index) => (
            <option
              value={category.name}
              style={{ color: "black",backgroundColor:'teal.200' }}
              key={index}
            >
              {category.name}
            </option>
          ))}
        </Select>

        {isLoading && (
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
        )}

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
    </VStack>
  );
};

export default TopPrompts;
