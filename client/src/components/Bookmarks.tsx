import { useState, useEffect, useContext } from "react";
import { VStack, Heading, useColorModeValue, Flex } from "@chakra-ui/react";
import { AuthContext } from "../Providers/AuthProvider";
import Bookmark from "./Bookmark";
import { Player } from "@lottiefiles/react-lottie-player";
import Ball from "../assets/ball.json";


type Bookmarks = {
  _id: string;
  name: string;
  link: string;
};

const Bookmarks = () => {
  const currentUser = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [bookmarks, setBookmarks] = useState<Bookmarks[]>([]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const resp = await fetch("https://gpt-cat.onrender.com/bookmarks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: currentUser?.email }),
      });
      const bookmarks = await resp.json();
      setBookmarks(bookmarks);
    } catch (error) {
      console.log("An error occured in fetching boookmarks", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const bodyBG = useColorModeValue("white", "gray.800");

  return (
    <VStack
      padding="5vw"
      minHeight="80vh"
      width="100%"
      overflowY="hidden"
      bg={bodyBG}
    >
      <Heading color={useColorModeValue("gray.700", "white")} marginBottom='1vh'>
        BOOKMARKS
      </Heading>
      {isLoading ? (
        <Flex
          bg={useColorModeValue("white", "gray.800")}
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="100%"
          width="full"
        >
          <Player
            autoplay
            loop
            src={Ball}
            style={{ height: "100%", width: "100%" }}
          />
        </Flex>
      ) : (
        <VStack width="full" height="100%" overflowY="auto">
          {bookmarks.map((bookmark, index) => {
            return (
              <Bookmark
                _id={bookmark._id}
                name={bookmark.name}
                link={bookmark.link}
              ></Bookmark>
            );
          })}
        </VStack>
      )}
    </VStack>
  );
};

export default Bookmarks;
