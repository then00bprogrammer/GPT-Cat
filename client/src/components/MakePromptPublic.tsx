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
import { useState, useContext, useRef } from "react";
import { AuthContext } from "../Providers/AuthProvider";
import useEnterKeyPress from "../hooks/useEnterKeyPress";

const MakePromptPublic = ({
  isOpen,
  onClose,
  id,
}: {
  isOpen: boolean;
  onClose: () => void;
  id: string;
}) => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const currentUser = useContext(AuthContext);
  const [categoryName, setCategoryName] = useState<string>("");
  const [authorName, setAuthorName] = useState<string>("");
  const [promotionalLink, setPromotionalLink] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChangeVisibility = async () => {
    setIsLoading(true);
    try {
      await fetch("https://gpt-cat.onrender.com/files/changeVisibility", {
        method: "PATCH",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          view: "private",
          id: id,
          category: categoryName,
          authorName: authorName,
          link: promotionalLink,
        }),
      });
    } catch (error) {
      console.log("An error occured while changing visibility");
    }
    onClose();
    setIsLoading(false);
  };

  useEnterKeyPress(buttonRef);
  return (
    <>
      <Modal size="sm" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalBody>
            <Heading margin="2% auto" size="xl" textAlign="center">
              Make prompt public
            </Heading>
            <InputGroup
              size="sm"
              flexDir="column"
              alignItems="center"
              justifyContent="center"
            >
              <InputGroup margin={2}>
                <InputLeftAddon children="Prompt Category: " />
                <Input
                  type="text"
                  focusBorderColor="gray.100"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                />
              </InputGroup>
              <InputGroup margin={2}>
                <InputLeftAddon children="Author Name: " />
                <Input
                  type="text"
                  focusBorderColor="gray.100"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                />
              </InputGroup>
              <InputGroup margin={2}>
                <InputLeftAddon children="Promotional Link: " />
                <Input
                  type="text"
                  focusBorderColor="gray.100"
                  value={promotionalLink}
                  onChange={(e) => setPromotionalLink(e.target.value)}
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
                  onClick={handleChangeVisibility}
                >
                  Add Prompt
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

export default MakePromptPublic;
