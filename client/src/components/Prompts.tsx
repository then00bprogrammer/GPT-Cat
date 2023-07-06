import { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  VStack,
  HStack,
  Icon,
  Text,
  Spacer,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverHeader,
  useColorModeValue,
  Flex,
  Button,
} from "@chakra-ui/react";
import { FaArrowLeft, FaFolder, FaPen, FaPlus } from "react-icons/fa";
import AddPromptModal from "./AddPromptModal";
import File from "./File";
import AddFolderModal from "./AddFolderModal";
import Folder from "./Folder";
import { AuthContext } from "../Providers/AuthProvider";
import Ball from "../assets/ball.json";
import { Player } from "@lottiefiles/react-lottie-player";

type Folder = {
  name: string;
  id: string;
};

type File = {
  name: string;
  content: string;
  id: string;
  view: string;
};

const Prompts = () => {
  const currentUser = useContext(AuthContext);
  const { id } = useParams<{ id: string }>();
  const { folderName } = useParams<{ folderName: string }>();
  const bodyBG = useColorModeValue("white", "gray.800");
  const fontColor = useColorModeValue("black", "white");
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [path, setPath] = useState<string[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [isNewFileModalOpen, setisNewFileModalOpen] = useState<boolean>(false);
  const [isNewFolderModalOpen, setIsNewFolderModalOpen] =
    useState<boolean>(false);
  const [back, setBack] = useState<boolean>(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const resp = await fetch(
        `https://gpt-cat.onrender.com/${currentUser?.email}/${
          id != undefined ? id : ""
        }`
      );
      const { folders, files } = await resp.json();
      setFolders(folders);
      setFiles(files);
      if (id === undefined) setPath([]);
      if (folderName && !back)
        setPath((previousPath) => [...previousPath, folderName]);
      if (back) setBack(false);
    } catch (error) {
      console.log("Couldnt fetch data", error);
    }
    setIsLoading(false);
  };

  const handleBack = () => {
    setBack(true);
    navigate(-1);
    setPath((previousPath) => previousPath.slice(0, path.length - 1));
  };

  const handleJump = (index: number) => {
    console.log(index);
    setBack(true);
    navigate(-index);
    setPath((previousPath) => previousPath.slice(0, path.length - index));
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  return (
    <VStack
      padding="5vw"
      minHeight="80vh"
      width="100%"
      overflowY="hidden"
      color={fontColor}
      bg={bodyBG}
    >
      {isLoading ? (
        <Flex
          bg={useColorModeValue("white", "gray.800")}
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="100%"
          width="100%"
        >
          <Player
            autoplay
            loop
            src={Ball}
            style={{ height: "100%", width: "100%" }}
          />
        </Flex>
      ) : (
        <>
          <AddPromptModal
            isOpen={isNewFileModalOpen}
            onClose={() => setisNewFileModalOpen(false)}
            path={path}
            setFiles={setFiles}
          />
          <AddFolderModal
            isOpen={isNewFolderModalOpen}
            onClose={() => setIsNewFolderModalOpen(false)}
            path={path}
            setFolders={setFolders}
          />
          <HStack
            marginBottom="1vh"
            color="teal.400"
            width="full"
            alignItems="center"
            justifyContent="flex-start"
            fontSize="xl"
            overflowY="hidden"
            overflowX='hidden'
          >
            <Link to="#">
              <Text fontWeight="bold">/</Text>
            </Link>

            <Breadcrumb fontWeight="medium" fontSize="sm">
              {path &&
                path.map((pathItem, index) => (
                  <BreadcrumbItem key={index}>
                    <BreadcrumbLink
                      href="#"
                      onClick={() => handleJump(path.length - index - 1)}
                    >
                      {pathItem}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                ))}
            </Breadcrumb>
            <Spacer />
            <Popover placement="left-end" isLazy>
              <PopoverTrigger >
                <Button bg="none" _hover={{ bg: "none" }} padding={0} margin={0}>
                  <Icon color='teal.400' cursor="pointer" as={FaPlus}/>
                </Button>
              </PopoverTrigger>
              <PopoverContent width="fit-content" border={0} fontSize="md" cursor='pointer'>
                <PopoverArrow bg="gray.100" />
                <PopoverHeader
                  padding="1vh 2vh"
                  borderBottom="2px solid black"
                  bg="gray.100"
                  onClick={() => setIsNewFolderModalOpen(true)}
                >
                  <HStack>
                    <Icon as={FaFolder} marginRight={2} />
                    <Text fontSize="md">New folder</Text>
                  </HStack>
                </PopoverHeader>
                <PopoverHeader
                  padding="1vh 2vh"
                  bg="gray.100"
                  onClick={() => setisNewFileModalOpen(true)}
                >
                  <HStack>
                    <Icon as={FaPen} marginRight={2} />
                    <Text fontSize="md">Add Prompt</Text>
                  </HStack>
                </PopoverHeader>
              </PopoverContent>
            </Popover>
            <Icon cursor="pointer" as={FaArrowLeft} onClick={handleBack} />
          </HStack>
          <VStack width="full" height="100%" overflowY="auto">
            {folders.map((folder) => (
              <Folder
                key={folder.id}
                _id={folder.id}
                name={folder.name}
              ></Folder>
            ))}
            {files.map((file) => (
              <File
                key={file.id}
                _id={file.id}
                name={file.name}
                content={file.content}
                view={file.view}
              />
            ))}
          </VStack>
        </>
      )}
    </VStack>
  );
};

export default Prompts;
