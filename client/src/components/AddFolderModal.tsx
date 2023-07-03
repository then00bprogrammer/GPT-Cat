import {
  Button,
  HStack,
  Heading,
  Input,
  InputGroup,
  InputLeftAddon,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
} from "@chakra-ui/react";
import { useState } from "react";
import { addFolder } from "../handlers/addFolder";

const AddFolderModal = ({
  isOpen,
  onClose,
  path,
}: {
  isOpen: boolean;
  onClose: () => void;
  path: string[];
}) => {
  const [folderName, setFolderName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleAddFolder = async () => {
    setIsLoading(true);
    await addFolder(folderName, path);
    setIsLoading(false);
    onClose();
  };

  return (
    <>
      <Modal size="sm" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalBody>
            <Heading margin="2% auto" size="xl" textAlign="center">
              Create New Folder
            </Heading>
            <InputGroup
              size="sm"
              flexDir="column"
              alignItems="center"
              justifyContent="center"
            >
              <InputGroup margin={2}>
                <InputLeftAddon children="Folder Name: " />
                <Input
                  type="text"
                  focusBorderColor="gray.100"
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                />
              </InputGroup>
            </InputGroup>
          </ModalBody>
          <ModalFooter>
            <HStack>
              <Button
                isLoading={isLoading}
                bg="teal.400"
                color="white"
                variant="solid"
                _hover={{ bg: "teal.500" }}
                onClick={handleAddFolder}
              >
                Add Folder
              </Button>
              <Button
                colorScheme="red"
                variant="outline"
                _hover={{ bg: "red.500", color: "white" }}
                onClick={() => onClose()}
              >
                Cancel
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddFolderModal;
