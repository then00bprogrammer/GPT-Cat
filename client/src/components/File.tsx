import { useState } from "react";
import {
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
  FaCheck,
  FaCopy,
  FaFileAlt,
  FaPencilAlt,
  FaTrashAlt,
} from "react-icons/fa";
import DeleteFileModal from "./DeleteFile";

type Props = {
  _id: string;
  parentId: string;
  name: string;
  content: string;
};

const File = ({ _id, name, content, parentId }: Props) => {
  const [isDeleted, setIsDeleted] = useState<boolean>(false);
  const bg = useColorModeValue("gray.200", "gray.600");
  const { isOpen, onToggle } = useDisclosure();
  const [editable, setEditable] = useState<boolean>(false);
  const [inputName, setInputName] = useState(name);

  const handleCopy = async () => {
    const text:string = content;
    if ("clipboard" in navigator) {
      await navigator.clipboard.writeText(text);
    } else {
      document.execCommand("copy", true, text);
    }
  };

  const handleToggleEdit = async (
    event: React.MouseEvent<SVGSVGElement, MouseEvent>
  ) => {
    const toSubmit:boolean = editable;
    setEditable(!editable);
    if (toSubmit) {
      try {
        await fetch(`http://localhost:5000/files/${_id}/${parentId}`, {
          method: "PATCH",
          body: JSON.stringify({ name: inputName }),
          headers: {
            "Content-Type": "application/json",
          },
        });
      } catch (error) {
        console.log("An error occurred while editing the file", error);
      }
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLDivElement>) => {
    setInputName(event.target.innerText);
  };

  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const onDeleteClose = () => {
    setIsDeleteOpen(false);
  };

  if (!isDeleted) {
    return (
      <VStack width="full">
        <DeleteFileModal
          isOpen={isDeleteOpen}
          onClose={onDeleteClose}
          id={_id}
          parentId={parentId}
          setIsDeleted={setIsDeleted}
        />
        <HStack
          padding="2vw"
          fontSize="xl"
          width="95%"
          marginRight="5%"
          bg={bg}
          borderRadius={10}
          color={useColorModeValue('black','white')}
          overflowX="hidden"
        >
          <Icon as={FaFileAlt} onClick={onToggle} cursor="pointer" />
          <Text
            outline="none"
            border="none"
            borderBottom={editable ? "2px dashed" : "none"}
            contentEditable={editable}
            onInput={handleChange}
            bg={editable ? "gray.500" : "none"}
            paddingRight="5vw"
            color={editable ? "white" : "black"}
            style={{ caretColor: "white" }}
          >
            {name}
          </Text>
          <Spacer />
          <Icon
            as={editable ? FaCheck : FaPencilAlt}
            onClick={handleToggleEdit}
            cursor="pointer"
          />
          <Icon
            as={FaTrashAlt}
            cursor="pointer"
            onClick={() => setIsDeleteOpen(!isDeleteOpen)}
          />
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
  } else {
    return null;
  }
};

export default File;
