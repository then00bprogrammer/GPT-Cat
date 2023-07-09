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
  FaCheck,
  FaCopy,
  FaFileAlt,
  FaLock,
  FaLockOpen,
  FaPencilAlt,
  FaTrashAlt,
} from "react-icons/fa";
import DeleteFileModal from "./DeleteFile";
import { AuthContext } from "../Providers/AuthProvider";
import MakePromptPublic from "./MakePromptPublic";

const File = ({ _id, name, content, view }: {
  _id: string;
  name: string;
  content: string;
  view: string;
}) => {
  const currentUser = useContext(AuthContext);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [isDeleted, setIsDeleted] = useState<boolean>(false);
  const [isMakePublicModalOpen, setisMakePublicModalOpen] = useState<boolean>(false);
  const bg = useColorModeValue("gray.200", "gray.600");
  const { isOpen, onToggle } = useDisclosure();
  const [editable, setEditable] = useState<boolean>(false);
  const [inputName, setInputName] = useState(name);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [visible,setVisible] = useState<boolean>(view==='public');

  const textColor = useColorModeValue('black','gray.50');

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

  const handleToggleEdit = async (
    event: React.MouseEvent<SVGSVGElement, MouseEvent>
  ) => {
    const toSubmit: boolean = editable;
    setEditable(!editable);
    if (toSubmit) {
      try {
        await fetch(`https://gpt-cat.onrender.com/files/${_id}`, {
          method: "PATCH",
          body: JSON.stringify({ name: inputName, email: currentUser?.email }),
          headers: {
            "Content-Type": "application/json",
          },
        });
      } catch (error) {
        console.log("An error occurred while editing the file", error);
      }
    }
  };

  const handleChangeVisibility = async ()=>{
    try{
      if(!visible){
        setVisible(true);
        setisMakePublicModalOpen(true);
      }
      else{
        setVisible(false);
        await fetch('https://gpt-cat.onrender.com/files/changeVisibility',{
          method:'PATCH',
          headers:{
            'Content-type':'application/json'
          },
          body:JSON.stringify({
            view:'public',
            id:_id
          })
        })
      }
    }
    catch (error){
      console.log('An error occured while changing visibility');
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLDivElement>) => {
    setInputName(event.target.innerText);
  };

  const onDeleteClose = () => {
    setIsDeleteOpen(false);
  };

  const onMakePublicClose = ()=>{
    setisMakePublicModalOpen(false);
  }

  if (!isDeleted) {
    return (
      <VStack width="full">
        <DeleteFileModal
          isOpen={isDeleteOpen}
          onClose={onDeleteClose}
          id={_id}
          setIsDeleted={setIsDeleted}
        />
        <MakePromptPublic
        isOpen={isMakePublicModalOpen}
        onClose={onMakePublicClose}
        id={_id}
        />
        <HStack
          marginLeft='5vw'
          marginRight='5vw'
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
            cursor='pointer'
            onClick={onToggle}
            fontSize='sm'
            outline="none"
            border="none"
            borderBottom={editable ? "2px dashed" : "none"}
            contentEditable={editable}
            onInput={handleChange}
            bg={editable ? "gray.500" : "none"}
            paddingRight="5vw"
            color={editable ? "white" : textColor}
            style={{ caretColor: "white" }}
          >
            {name}
          </Text>
          <Spacer />
          <Icon
            onClick={handleChangeVisibility}
            as={visible?FaLockOpen:FaLock}
            cursor="pointer"
          />
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
        <Box width="full" as={Collapse} in={isOpen} animateOpacity>
          <HStack
            width="100%"
            p="1vh 3vw"
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

export default File;
