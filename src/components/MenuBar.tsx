import React, { useState } from 'react';
import { HStack, Text, Icon, useToken } from '@chakra-ui/react';
import { FaPlus, FaBookmark, FaUser } from 'react-icons/fa';

const MenuBar: React.FC = () => {
  const [selected, setSelected] = useState<number>(-1);
  const [teal400,] = useToken("colors", ["teal.400"]);

  const handleClick = (index: number) => {
    setSelected(index);
  };

  const getBackgroundColor = (index: number) => {
    return selected === index ? teal400 : 'white';
  };

  const getTextColor = (index: number) => {
    return selected === index ? 'white' : teal400;
  };

  return (
    <HStack justifyContent='space-around' alignItems='center' width='100vw' height='8vh' padding='1vh 5vw'>
      <HStack
        cursor='pointer'
        padding='1vh 2vh'
        bg={getBackgroundColor(0)}
        onClick={() => handleClick(0)}
        borderRadius={20}
        transition="background-color 0.3s"
      >
        <Icon boxSize='6vh' color={getTextColor(0)} as={FaBookmark} />
        {selected === 0 && <Text color='white'>Bookmarks</Text>}
      </HStack>
      <HStack
        cursor='pointer'
        padding='1vh 2vh'
        bg={getBackgroundColor(1)}
        onClick={() => handleClick(1)}
        borderRadius={20}
        transition="background-color 0.3s"
      >
        <Icon boxSize='6vh' color={getTextColor(1)} as={FaPlus} />
        {selected === 1 && <Text color='white'>Add Prompt</Text>}
      </HStack>
      <HStack
        cursor='pointer'
        padding='1vh 2vh'
        bg={getBackgroundColor(2)}
        onClick={() => handleClick(2)}
        borderRadius={20}
        transition="background-color 0.3s ease-in"
      >
        <Icon boxSize='6vh' color={getTextColor(2)} as={FaUser} />
        {selected === 2 && <Text color='white'>Profile</Text>}
      </HStack>
    </HStack>
  );
};

export default MenuBar;
