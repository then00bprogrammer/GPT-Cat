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
import { useState, useRef } from "react";
import useEnterKeyPress from "../../hooks/useEnterKeyPress";

const EditPromptModal = ({
  isOpen,
  onClose,
  _id,
}: {
  isOpen: boolean;
  onClose: () => void;
  _id: string;
}) => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [promptName, setPromptName] = useState<string>("");
  const [promptText, setPromptText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
                <InputLeftAddon children="Name: " />
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
                  colorScheme="red"
                  variant="outline"
                  _hover={{
                    bg: "red.500",
                    color: "white",
                    borderColor: "red.500",
                  }}
                  onClick={() => onClose()}
                >
                  Edit
                </Button>
              </LightMode>
              <LightMode>
                <Button
                  colorScheme="red"
                  variant="outline"
                  _hover={{
                    bg: "red.500",
                    color: "white",
                    borderColor: "red.500",
                  }}
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

export default EditPromptModal;
