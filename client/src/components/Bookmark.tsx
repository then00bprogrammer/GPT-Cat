import { useState, useEffect, useContext } from "react";
import {
  VStack,
  HStack,
  Icon,
  Text,
  Spacer,
  Heading,
} from "@chakra-ui/react";
import {
  FaEllipsisV,
  FaRegFolderOpen,
} from "react-icons/fa";
import { PathContext } from "../Providers/PathProvider";
import File from "./File";

type Folder = {
  name: string;
  _id: string;
};

type File = {
  name: string;
  content: string;
  folder: string;
  _id: string;
  parentId: string;
};

type HistoryItem = {
  folders: Folder[];
  files: File[];
};

const Bookmark = () => {
  const pathContext = useContext(PathContext);
  const [path, setPath] = useState<string[]>([]);
  const [data, setData] = useState<Folder[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  console.log(files);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const fetchData = async (id?: string, folderName?: string) => {
    const resp = await fetch(`http://localhost:5000/${id ? id : ""}`);
    const { folders, files } = await resp.json();
    const newHistoryItem: HistoryItem = { folders, files };
    setHistory((prevHistory) => [...prevHistory, newHistoryItem]);
    setData(folders);
    setFiles(files);
    if (folderName) setPath((previousPath) => [...previousPath, folderName]);
    pathContext?.updatePath(path);
  };

  const handleBack = () => {
    const historyLength = history.length;
    const pathLength = path.length;
    if (historyLength > 1) {
      const latestData = history[historyLength - 2];
      setHistory((prevHistory) => prevHistory.slice(0, historyLength - 1));
      setPath((previousPath) => previousPath.slice(0, pathLength - 1));
      pathContext?.updatePath(path.slice(0, pathLength - 1));
      setData(latestData.folders);
      setFiles(latestData.files);
    }
  };

  return (
    <VStack padding="5vw" minHeight="80vh" width="100%" overflowY="hidden">
      <Heading color='gray.700'>BOOKMARKS</Heading>
      <VStack width="full" height="100%" overflowY="auto">
        <HStack
          cursor="pointer"
          padding="2vw"
          fontSize="xl"
          width="100%"
          bg="gray.200"
          borderRadius={10}
        >
          <Icon as={FaRegFolderOpen} />
          <Text>Sample Bookmarks</Text>
          <Spacer />
          <Icon as={FaEllipsisV} />
        </HStack>
        <HStack
          cursor="pointer"
          padding="2vw"
          fontSize="xl"
          width="100%"
          bg="gray.200"
          borderRadius={10}
        >
          <Icon as={FaRegFolderOpen} />
          <Text>Sample Bookmarks</Text>
          <Spacer />
          <Icon as={FaEllipsisV} />
        </HStack>
        <HStack
          cursor="pointer"
          padding="2vw"
          fontSize="xl"
          width="100%"
          bg="gray.200"
          borderRadius={10}
        >
          <Icon as={FaRegFolderOpen} />
          <Text>Sample Bookmarks</Text>
          <Spacer />
          <Icon as={FaEllipsisV} />
        </HStack>
      </VStack>
    </VStack>
  );
};

export default Bookmark;
