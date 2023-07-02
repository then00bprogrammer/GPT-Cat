import { useState } from "react";
import {
  Box,
  Collapse,
  HStack,
  Icon,
  Spacer,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import {
  FaCheck,
  FaCopy,
  FaEllipsisV,
  FaFileAlt,
  FaPencilAlt,
  FaTrashAlt,
} from "react-icons/fa";
import AddPromptModal from "./AddPromptModal";
import DeleteFileModal from "./DeleteFile";

type Props = {
  _id: string;
  name: string;
  content: string;
};

const File = ({ _id, name, content }: Props) => {
  const { isOpen, onToggle } = useDisclosure();
  const [editable, setEditable] = useState<boolean>(false);
  const [textContent, setTextContent] = useState(content);

  const handleCopy = async () => {
    const text = content;
    if ("clipboard" in navigator) {
      await navigator.clipboard.writeText(text);
    } else {
      document.execCommand("copy", true, text);
    }
  };

  const handleToggleEdit = (
    event: React.MouseEvent<SVGSVGElement, MouseEvent>
  ) => {
    setEditable(!editable);
    if (!editable) {
      console.log(textContent);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLDivElement>) => {
    setTextContent(event.target.innerText);
  };

  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const onDeleteClose = () => {
    setIsDeleteOpen(false);
  };

  return (
    <VStack width="full">
      <DeleteFileModal isOpen={isDeleteOpen} onClose={onDeleteClose}></DeleteFileModal>
      <HStack
        padding="2vw"
        fontSize="xl"
        width="100%"
        bg="gray.200"
        borderRadius={10}
      >
        <Icon as={FaFileAlt} onClick={onToggle} cursor="pointer" />
        <Text
          outline="none"
          border="none"
          borderBottom={editable ? '2px dashed' : 'none'}
          contentEditable={editable}
          onInput={handleChange}
          bg={editable ? 'gray.500' : 'none'}
          paddingRight='5vw'
          color={editable?'white':'black'}
          caret-color="white"
        >
          {name}
        </Text>
        <Spacer />
        <Icon
          as={editable ? FaCheck : FaPencilAlt}
          onClick={handleToggleEdit}
          cursor="pointer"
        />
        <Icon as={FaTrashAlt} cursor="pointer" onClick={()=>setIsDeleteOpen(!isDeleteOpen)}/>
      </HStack>
      <Collapse in={isOpen} animateOpacity>
        <HStack
          width="390px"
          p="1vh 4vw"
          color="white"
          mt="1"
          bg="teal.500"
          rounded="md"
          shadow="md"
          fontSize="md"
        >
          <Text>{content}</Text>
          <Spacer />
          <Icon as={FaCopy} cursor="pointer" onClick={handleCopy} />
        </HStack>
      </Collapse>
    </VStack>
  );
};

export default File;
