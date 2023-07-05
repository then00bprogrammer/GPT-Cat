import {
  HStack,
  Icon,
  Spacer,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import DeleteBookmarkModal from "./DeleteBookmark";

type Chat = {
  query: string;
  response: string;
};

type Bookmarks = {
  _id: string;
  name: string;
  conversation: Chat[];
};

const Bookmark = ({ _id, name, conversation }: Bookmarks) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [isDeleted, setIsDeleted] = useState<boolean>(false);
  const onDeleteClose = () => {
    setIsDeleteOpen(false);
  };
  if(!isDeleted){
      return (
        <VStack width="full">
          <DeleteBookmarkModal
            isOpen={isDeleteOpen}
            onClose={onDeleteClose}
            id={_id}
            setIsDeleted={setIsDeleted}
          />
          <HStack
            key={_id}
            cursor="pointer"
            padding="2vw"
            fontSize="xl"
            width="100%"
            bg={useColorModeValue("gray.200", "gray.600")}
            borderRadius={10}
          >
            <Text>{name}</Text>
            <Spacer />
            <Icon as={FaTrashAlt} cursor="pointer" onClick={()=>setIsDeleteOpen(true)}/>
          </HStack>
        </VStack>
      );
  }
  else return null;
};

export default Bookmark;
