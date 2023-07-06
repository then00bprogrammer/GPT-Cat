import {
  HStack,
  Icon,
  Spacer,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaExternalLinkAlt, FaTrashAlt } from "react-icons/fa";
import DeleteBookmarkModal from "./DeleteBookmark";

type Bookmarks = {
  _id: string;
  name: string;
  link: string;
};

const Bookmark = ({ _id, name, link }: Bookmarks) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [isDeleted, setIsDeleted] = useState<boolean>(false);
  const textColor = useColorModeValue('black','gray.50');
  const onDeleteClose = () => {
    setIsDeleteOpen(false);
  };

  const handleRedirect = () => {
    chrome.tabs.create({ url: link });
  };

  if (!isDeleted) {
    return (
      <VStack width="full">
        <DeleteBookmarkModal
          isOpen={isDeleteOpen}
          onClose={onDeleteClose}
          id={_id}
          setIsDeleted={setIsDeleted}
        />
        <HStack
          color={textColor}
          key={_id}
          cursor="pointer"
          padding="2vw"
          fontSize="xl"
          width="95%"
          marginRight="5%"
          bg={useColorModeValue("gray.200", "gray.600")}
          borderRadius={10}
          overflowX="hidden"
        >
          <Text
            color={textColor}
            fontSize="sm"
            onClick={handleRedirect}
            _hover={{ textDecoration: "underline" }}
          >
            {name}
          </Text>
          <Spacer />
          <Icon
            as={FaExternalLinkAlt}
            cursor="pointer"
            onClick={handleRedirect}
          />
          <Icon
            as={FaTrashAlt}
            cursor="pointer"
            onClick={() => setIsDeleteOpen(true)}
          />
        </HStack>
      </VStack>
    );
  } else return null;
};

export default Bookmark;
