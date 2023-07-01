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
  Textarea,
} from "@chakra-ui/react";
import { addPrompt } from "../handlers/addPrompt";
import { useContext, useState } from "react";
import { PathContext } from "../Providers/PathProvider";

const AddPromptModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const pathContext = useContext(PathContext);
  const [promptName, setPromptName] = useState<string>('');
  const [promptText, setPromptText] = useState<string>('');

  const handleAddPrompt = async (name: string, text: string) => {
    await addPrompt(promptName,pathContext?.path,promptText);
  };

  return (
    <>
      <Modal size="sm" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalBody>
            <Heading margin="2% auto" size="xl" textAlign="center">
              Enter your prompt
            </Heading>
            <InputGroup size="sm" flexDir="column" alignItems='center' justifyContent='center'>
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
              <Button
                bg="teal.400"
                color="white"
                variant="solid"
                _hover={{ bg: "teal.500" }}
                onClick={() => handleAddPrompt(promptName, promptText)}
              >
                Add Prompt
              </Button>
              <Button
                colorScheme="red"
                variant="outline"
                _hover={{ bg: "red.500",color:"white" }}
                onClick={()=>onClose()}
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

export default AddPromptModal;
