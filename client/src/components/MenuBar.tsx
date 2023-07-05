import React, { useState, useContext } from "react";
import { HStack, Text, Icon, useToken, useColorModeValue } from "@chakra-ui/react";
import {  FaBookmark, FaUser, FaHome, FaFire } from "react-icons/fa";
import { PathContext } from "../Providers/PathProvider";
import { Link } from "react-router-dom";

const MenuBar: React.FC = () => {
  const [selected, setSelected] = useState<number>(1);
  const [teal400] = useToken("colors", ["teal.400"]);

  const getBackgroundColor = (index: number) => {
    return selected === index ? teal400 : "none";
  };

  const getTextColor = (index: number) => {
    return selected === index ? "white" : teal400;
  };

  const handleClick = (index: number) => {
    setSelected(index);
  };

  const path = useContext(PathContext);

  return (
    <HStack
      justifyContent="space-around"
      alignItems="center"
      width="100vw"
      height="10vh"
      padding="1vh 5vw"
      borderTopWidth="1px"
      borderTopColor={useColorModeValue('blackAlpha.700','gray.400')}
    >
      
      <Link to="/bookmarks">
      <HStack
        cursor="pointer"
        padding="1vh 4vh"
        bg={getBackgroundColor(0)}
        onClick={() => handleClick(0)}
        borderRadius={20}
        transition="width 0.3s ease-in"
      >
        <Icon boxSize="6vh" color={getTextColor(0)} as={FaBookmark} />
        {selected === 0 && (
          <Text color="white" fontSize="md">
            Bookmarks
          </Text>
        )}
      </HStack>
      </Link>
      <Link to="/">
      <HStack
        cursor="pointer"
        padding="1vh 4vh"
        bg={getBackgroundColor(1)}
        onClick={() => handleClick(1)}
        borderRadius={20}
        transition="width .3s ease-in"
      >
        <Icon boxSize="6vh" color={getTextColor(1)} as={FaHome} />
        {selected === 1 && (
          <Text color="white" fontSize="md">
            Prompts
          </Text>
        )}
      </HStack>
      </Link>
      <Link to="/topPrompts">
        <HStack
          cursor="pointer"
          padding="1vh 4vh"
          bg={getBackgroundColor(2)}
          onClick={() => handleClick(2)}
          borderRadius={20}
          transition="width 0.3s ease-in"
        >
          <Icon boxSize="6vh" color={getTextColor(2)} as={FaFire} />
          {selected === 2 && (
            <Text color="white" fontSize="md">
              Top
            </Text>
          )}
        </HStack>
      </Link>
      <Link to="/profile">
        <HStack
          cursor="pointer"
          padding="1vh 4vh"
          bg={getBackgroundColor(3)}
          onClick={() => handleClick(3)}
          borderRadius={20}
          transition="width 0.3s ease-in"
        >
          <Icon boxSize="6vh" color={getTextColor(3)} as={FaUser} />
          {selected === 3 && (
            <Text color="white" fontSize="md">
              Profile
            </Text>
          )}
        </HStack>
      </Link>
    </HStack>
  );
};

export default MenuBar;
