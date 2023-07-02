import { useState, useEffect, useContext } from 'react';
import {
  VStack,
  HStack,
  Icon,
  Text,
  Spacer,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@chakra-ui/react';
import { FaArrowLeft, FaEllipsisV, FaFileAlt, FaRegFolderOpen, FaSlash } from 'react-icons/fa';
import AddPromptModal from './AddPromptModal';
import { PathContext } from '../Providers/PathProvider';
import File from './File';

type Folder = {
  name: string;
  _id: string;
};

type File = {
  name: string,
  content: string,
  folder: string,
  _id: string,
  parentId: string,
}

type HistoryItem = {
  folders: Folder[];
  files: File[];
};

const Prompts = () => {
  const pathContext = useContext(PathContext);
  const [path, setPath] = useState<string[]>([]);
  const [data, setData] = useState<Folder[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  console.log(files);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const fetchData = async (id?: string, folderName?: string) => {
    const resp = await fetch(`http://localhost:5000/${id ? id : ''}`);
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

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <VStack padding='5vw' minHeight='80vh' width='100%' overflowY='hidden'>
      <HStack
        marginBottom='1vh'
        color='teal.400'
        width='full'
        alignItems='center'
        justifyContent='flex-start'
        fontSize='xl'
        overflowY='hidden'
      >
      
        <Text fontWeight='bold'>/</Text>
        <Breadcrumb fontWeight='medium' fontSize='sm'>
          {path &&
            path.map((pathItem, index) => {
              return (
                <BreadcrumbItem key={index}>
                  <BreadcrumbLink href='#'>{pathItem}</BreadcrumbLink>
                </BreadcrumbItem>
              );
            })}
        </Breadcrumb>
        <Spacer/>
        <Icon cursor='pointer' as={FaArrowLeft} onClick={()=>handleBack()}/>
      </HStack>
      <VStack width='full' height='80%' overflowY='auto'>
      {data.map((folder) => (
          <HStack
            cursor='pointer'
            padding='2vw'
            fontSize='xl'
            width='100%'
            bg='gray.200'
            borderRadius={10}
            onClick={()=>fetchData(folder._id,folder.name)}
          >
            <Icon as={FaRegFolderOpen} />
            <Text>{folder.name}</Text>
            <Spacer />
            <Icon as={FaEllipsisV} />
          </HStack>
      ))}
      {files.map((file) => (
          <File _id={file._id} name={file.name} content={file.content}></File>
      ))}
      </VStack>
      
    </VStack>
  );
};

export default Prompts;
