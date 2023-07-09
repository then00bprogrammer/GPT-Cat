import {
  Button,
  HStack,
  Heading,
  Input,
  InputGroup,
  InputLeftAddon,
  LightMode,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
} from "@chakra-ui/react";
import { useContext, useState, useRef } from "react";
import { addFolder } from "../../handlers/addFolder";
import { AuthContext } from "../../Providers/AuthProvider";

const AddFolderModal = ({
  isOpen,
  onClose,
  path,
  setFolders,
}: {
  isOpen: boolean;
  onClose: () => void;
  path: string[];
  setFolders: any;
}) => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const currentUser = useContext(AuthContext);
  const [folderName, setFolderName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleAddFolder = async () => {
    setIsLoading(true);
    const newFolder = await addFolder(folderName, path, currentUser?.email);
    setFolders((prevFolders:any) => [...prevFolders, newFolder]);
    setIsLoading(false);
    onClose();
  };

  const handleKeyDown = (event:any) => {
    if (event.key === 'Enter') {
      buttonRef.current?.click()
    }
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
                  onKeyDown={handleKeyDown}
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
            <LightMode>
              <Button
                ref={buttonRef}
                isLoading={isLoading}
                bg="teal.400"
                color="white"
                variant="solid"
                _hover={{ bg: "teal.500" }}
                onClick={handleAddFolder}
              >
                Add Folder
              </Button>
              </LightMode>
              <LightMode>
              <Button
                colorScheme="red"
                variant="outline"
                _hover={{ bg: "red.500", color: "white", borderColor:'red.500' }}
                onClick={() => onClose()}
              >
                Cancel
              </Button>
              </LightMode>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddFolderModal;
