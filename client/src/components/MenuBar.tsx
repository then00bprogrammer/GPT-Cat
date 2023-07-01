import React, { useState, useContext } from 'react';
import { HStack, Text, Icon, useToken } from '@chakra-ui/react';
import { FaPlus, FaBookmark, FaUser } from 'react-icons/fa';
import AddPromptModal from './AddPromptModal';
import { PathContext } from '../Providers/PathProvider';

const MenuBar: React.FC = () => {
  const [selected, setSelected] = useState<number>(-1);
  const [teal400,] = useToken("colors", ["teal.400"]);
  const [isOpen,setIsOpen] = useState<boolean>(false);
  const onClose=()=>{
    setIsOpen(false);
  }
  const handleAddPrompt=()=>{
    setIsOpen(true);
  }

  const handleClick = (index: number) => {
    setSelected(index);
    if(index==1) handleAddPrompt();
  };

  const getBackgroundColor = (index: number) => {
    return selected === index ? teal400 : 'white';
  };

  const getTextColor = (index: number) => {
    return selected === index ? 'white' : teal400;
  };

  const path = useContext(PathContext);

  return (
    <HStack justifyContent='space-around' alignItems='center' width='100vw' height='8vh' padding='1vh 5vw'>
      <AddPromptModal isOpen={isOpen} onClose={onClose}></AddPromptModal>
      <HStack
        cursor='pointer'
        padding='1vh 4vh'
        bg={getBackgroundColor(0)}
        onClick={() => handleClick(0)}
        borderRadius={20}
        transition="width 0.3s ease-in"
      >
        <Icon boxSize='6vh' color={getTextColor(0)} as={FaBookmark} />
        {selected === 0 && <Text color='white' fontSize='md'>Bookmarks</Text>}
      </HStack>
      <HStack
        cursor='pointer'
        padding='1vh 4vh'
        bg={getBackgroundColor(1)}
        onClick={() => handleClick(1)}
        borderRadius={20}
        transition="width .3s ease-in"
      >
        <Icon boxSize='6vh' color={getTextColor(1)} as={FaPlus} />
        {selected === 1 && <Text color='white' fontSize='md'>Add Prompt</Text>}
      </HStack>
      <HStack
        cursor='pointer'
        padding='1vh 4vh'
        bg={getBackgroundColor(2)}
        onClick={() => handleClick(2)}
        borderRadius={20}
        transition="width 0.3s ease-in"
      >
        <Icon boxSize='6vh' color={getTextColor(2)} as={FaUser} />
        {selected === 2 && <Text color='white' fontSize='md'>Profile</Text>}
      </HStack>
    </HStack>
  );
};

export default MenuBar;
