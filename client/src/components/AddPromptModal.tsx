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
  Textarea,
} from "@chakra-ui/react";
import { addPrompt } from "../handlers/addPrompt";
import { useState, useContext, useRef } from "react";
import { AuthContext } from "../Providers/AuthProvider";
import useEnterKeyPress from "../hooks/useEnterKeyPress";

const AddPromptModal = ({
  isOpen,
  onClose,
  path,
  setFiles,
}: {
  isOpen: boolean;
  onClose: () => void;
  path: string[];
  setFiles: any;
}) => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const currentUser = useContext(AuthContext);
  const [promptName, setPromptName] = useState<string>("");
  const [promptText, setPromptText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleAddPrompt = async () => {
    setIsLoading(true);
    const newFile = await addPrompt(
      promptName,
      path,
      promptText,
      currentUser?.email
    );
    console.log(newFile);
    setFiles((prevFiles: any) => [...prevFiles, newFile]);
    setIsLoading(false);
    onClose();
  };

  useEnterKeyPress(buttonRef);
  return (
    <>
      <Modal size="sm" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalBody>
            <Heading margin="2% auto" size="xl" textAlign="center">
              Enter your prompt
            </Heading>
            <InputGroup
              size="sm"
              flexDir="column"
              alignItems="center"
              justifyContent="center"
            >
              <InputGroup margin={2}>
                <InputLeftAddon children="Prompt Name: " />
                <Input
                  type="text"
                  focusBorderColor="gray.100"
                  value={promptName}
                  onChange={(e) => setPromptName(e.target.value)}
                />
              </InputGroup>
              <Textarea
                placeholder="Enter Your Prompt here"
                focusBorderColor="gray.100"
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
              />
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
                  onClick={handleAddPrompt}
                >
                  Add Prompt
                </Button>
              </LightMode>
              <LightMode>
                <Button
                  colorScheme="red"
                  variant="outline"
                  _hover={{ bg: "red.500", color: "white" }}
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

export default AddPromptModal;
