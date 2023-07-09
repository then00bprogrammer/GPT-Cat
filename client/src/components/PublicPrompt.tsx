import { useContext, useState } from "react";
import {
  Box,
  Collapse,
  HStack,
  Icon,
  Spacer,
  Text,
  VStack,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import {
  FaCopy,
  FaFileAlt,
  FaRegStar,
  FaRegThumbsUp,
  FaStar,
  FaThumbsUp,
} from "react-icons/fa";
import { AuthContext } from "../Providers/AuthProvider";

type Props = {
  _id: string;
  name: string;
  content: string;
  likes: string;
  isLiked: boolean;
  isStarred: boolean;
};

const PublicPrompt = ({
  _id,
  name,
  content,
  likes,
  isLiked,
  isStarred,
}: Props) => {
  const [hasLiked, setHasLiked] = useState<boolean>(isLiked);
  const [hasStarred, setHasStarred] = useState<boolean>(isStarred);
  const [numberOfLikes, setHasNumberOfLikes] = useState<number>(
    parseInt(likes)
  );

  const currentUser = useContext(AuthContext);
  const [isDeleted, setIsDeleted] = useState<boolean>(false);
  const bg = useColorModeValue("gray.200", "gray.600");
  const { isOpen, onToggle } = useDisclosure();
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const textColor = useColorModeValue("black", "gray.50");

  const handleCopy = async () => {
    const text: string = content;
    if ("clipboard" in navigator) {
      await navigator.clipboard.writeText(text);
    } else {
      document.execCommand("copy", true, text);
    }

    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const handleLike = async () => {
    if (!hasLiked) {
      setHasLiked(true);
      setHasNumberOfLikes(numberOfLikes + 1);
      await fetch("https://gpt-cat.onrender.com/like", {
        method: "POST",
        body: JSON.stringify({ id: _id, email: currentUser?.email }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else {
      setHasLiked(false);
      setHasNumberOfLikes(numberOfLikes - 1);
      await fetch("https://gpt-cat.onrender.com/unlike", {
        method: "POST",
        body: JSON.stringify({ id: _id, email: currentUser?.email }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  };

  const handleStar = async () => {
    if (!hasStarred) {
      setHasStarred(true);
      await fetch("https://gpt-cat.onrender.com/star", {
        method: "POST",
        body: JSON.stringify({ id: _id, email: currentUser?.email }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else {
      setHasStarred(false);
      await fetch("https://gpt-cat.onrender.com/unstar", {
        method: "POST",
        body: JSON.stringify({ id: _id, email: currentUser?.email }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  };

  if (!isDeleted) {
    return (
      <VStack width="full">
        <HStack
          color={textColor}
          padding="2vw"
          fontSize="xl"
          width="90%"
          marginLeft="5vw"
          marginRight="5vw"
          bg={bg}
          borderRadius={10}
          overflowX="hidden"
        >
          <Icon as={FaFileAlt} onClick={onToggle} cursor="pointer" />
          <Text
            fontSize="sm"
            outline="none"
            border="none"
            borderBottom="none"
            bg="none"
            paddingRight="5vw"
            color={textColor}
            style={{ caretColor: "white" }}
          >
            {name}
          </Text>
          <Spacer />
          <Text>{numberOfLikes}</Text>
          <Icon
            as={hasLiked ? FaThumbsUp : FaRegThumbsUp}
            cursor="pointer"
            onClick={handleLike}
          />
          <Icon
            onClick={handleStar}
            cursor="pointer"
            marginLeft={1}
            as={hasStarred ? FaStar : FaRegStar}
          />
        </HStack>
        <Box width="full" as={Collapse} in={isOpen} animateOpacity>
          <HStack
            width="100%"
            p="1vh 3vw"
            marginRight="5%"
            color="white"
            mt="1"
            mb="1"
            bg="teal.500"
            rounded="md"
            shadow="md"
            fontSize="md"
          >
            <Text>{content}</Text>
            <Spacer />
            <HStack>
              {isCopied && <Text fontSize="sm">Prompt copied!</Text>}
              <Icon as={FaCopy} cursor="pointer" onClick={handleCopy} />
            </HStack>
          </HStack>
        </Box>
      </VStack>
    );
  } else {
    return null;
  }
};

export default PublicPrompt;
