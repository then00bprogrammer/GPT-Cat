import { useState } from "react";
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
  FaLock,
  FaLockOpen,
  FaPencilAlt,
  FaTrashAlt,
} from "react-icons/fa";

import DeleteFileModal from "../Modals/DeleteFileModal";
import MakePromptPublicModal from "../Modals/MakePromptPublicModal";
import EditPromptModal from "../Modals/EditPromptModal";

const File = ({
  _id,
  name,
  content,
  view,
}: {
  _id: string;
  name: string;
  content: string;
  view: string;
}) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [isMakePublicModalOpen, setisMakePublicModalOpen] =
    useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const bg = useColorModeValue("gray.200", "gray.600");

  const [isDeleted, setIsDeleted] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(view === "public");
  
  const { isOpen, onToggle } = useDisclosure();
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
    }, 1000);
  };

  const handleChangeVisibility = async () => {
    try {
      if (!visible) {
        setVisible(true);
        setisMakePublicModalOpen(true);
      } else {
        setVisible(false);
        await fetch("https://gpt-cat.onrender.com/files/changeVisibility", {
          method: "PATCH",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            view: "public",
            id: _id,
          }),
        });
      }
    } catch (error) {
      console.log("An error occured while changing visibility");
    }
  };

  if (!isDeleted) {
    return (
      <VStack width="full">
        <MakePromptPublicModal
          isOpen={isMakePublicModalOpen}
          onClose={() => setisMakePublicModalOpen(false)}
          id={_id}
        />
        <DeleteFileModal
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          id={_id}
          setIsDeleted={setIsDeleted}
        />
        <EditPromptModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          _id={_id}
        />
        <HStack
          marginLeft="5vw"
          marginRight="5vw"
          padding="2vw"
          fontSize="xl"
          width="90%"
          bg={bg}
          borderRadius={10}
          color={textColor}
          overflowX="hidden"
        >
          <Icon as={FaFileAlt} onClick={onToggle} cursor="pointer" />
          <Text
            cursor="pointer"
            onClick={onToggle}
            fontSize="sm"
            outline="none"
            border="none"
            paddingRight="5vw"
            color={textColor}
            style={{ caretColor: "white" }}
          >
            {name}
          </Text>
          <Spacer />
          <Icon
            onClick={handleChangeVisibility}
            as={visible ? FaLockOpen : FaLock}
            cursor="pointer"
          />
          <Icon
            as={FaPencilAlt}
            onClick={()=>setIsEditModalOpen(true)}
            cursor="pointer"
          />
          <Icon
            as={FaTrashAlt}
            cursor="pointer"
            onClick={() => setIsDeleteOpen(!isDeleteOpen)}
          />
        </HStack>
        <Box width="full" as={Collapse} in={isOpen} animateOpacity>
          <HStack
            width="90%"
            marginLeft="5vw"
            marginRight="5vw"
            marginTop="1"
            marginBottom="1"
            p="1vh 3vw"
            color="white"
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

export default File;
