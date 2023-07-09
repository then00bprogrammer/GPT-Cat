import {
  Avatar,
  HStack,
  Icon,
  IconButton,
  Spacer,
  Text,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaMoon } from "react-icons/fa";
import { BsFillSunFill } from "react-icons/bs";

const NavBar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <HStack
      width="100vw"
      height="10vh"
      padding="1vh 5vw"
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("blackAlpha.700", "gray.400")}
    >
      <Avatar src="../images/icon-3.png" />
      <Text textAlign="center" fontWeight="bold" fontSize="2xl">
        GPT Cat
      </Text>
      <Spacer />
      <IconButton
        paddingTop='1vh'
        paddingBottom='1vh'
        onClick={toggleColorMode}
        aria-label="toggle color mode"
        bg={useColorModeValue("white", "gray.900")}
        _hover={{ bg: useColorModeValue("white", "gray.900") }}
        icon={<Icon as={useColorModeValue(FaMoon, BsFillSunFill)} boxSize={8} height='full' />}
      />
    </HStack>
  );
};

export default NavBar;
