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
  FaRegThumbsUp,
  FaThumbsUp,
} from "react-icons/fa";
import { AuthContext } from "../Providers/AuthProvider";

type Props = {
  _id: string;
  name: string;
  content: string;
  likes: string;
  isLiked: boolean;
};

const PublicPrompt = ({ _id, name, content,likes,isLiked }: Props) => {
  const [hasLiked,setHasLiked] = useState<boolean>(isLiked);
  const [numberOfLikes,setHasNumberOfLikes] = useState<number>(parseInt(likes));

  const currentUser = useContext(AuthContext);
  const [isDeleted, setIsDeleted] = useState<boolean>(false);
  const bg = useColorModeValue("gray.200", "gray.600");
  const { isOpen, onToggle } = useDisclosure();
  const [isCopied, setIsCopied] = useState<boolean>(false);

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

  const handleLike = async ()=>{
    if (!hasLiked) {
        setHasLiked(true);
        setHasNumberOfLikes(numberOfLikes+1);
        await fetch('http://localhost:5000/like', {
          method: 'POST',
          body: JSON.stringify({ id: _id, email: currentUser?.email }),
          headers: {
            'Content-Type': 'application/json'
          }
        })
      }
      else {
        setHasLiked(false);
        setHasNumberOfLikes(numberOfLikes-1)
        await fetch('http://localhost:5000/unlike', {
          method: 'POST',
          body: JSON.stringify({ id: _id, email: currentUser?.email }),
          headers: {
            'Content-Type': 'application/json'
          }
        })
      }
  }

  if (!isDeleted) {
    return (
      <VStack width="full">
        <HStack
          padding="2vw"
          fontSize="xl"
          width="95%"
          bg={bg}
          borderRadius={10}
          color={useColorModeValue("black", "white")}
          overflowX="hidden"
        >
          <Icon as={FaFileAlt} onClick={onToggle} cursor="pointer" />
          <Text
            outline="none"
            border="none"
            borderBottom="none"
            bg="none"
            paddingRight="5vw"
            color="black"
            style={{ caretColor: "white" }}
          >
            {name}
          </Text>
          <Spacer />
          <Text>{numberOfLikes}</Text>
          <Icon
            as={hasLiked?FaThumbsUp:FaRegThumbsUp}
            cursor="pointer"
            onClick={handleLike}
          />
        </HStack>
        <Box width="full" as={Collapse} in={isOpen} animateOpacity>
          <HStack
            width="95%"
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
              {isCopied && <Text fontSize='sm' >Prompt copied!</Text>}
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
