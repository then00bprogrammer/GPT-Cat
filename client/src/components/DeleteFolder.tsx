import { useState, useContext, useRef } from "react";
import {
  Button,
  Flex,
  Heading,
  LightMode,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
} from "@chakra-ui/react";
import { Player } from "@lottiefiles/react-lottie-player";
import Dustbin from "../assets/trash-can.json";
import { AuthContext } from "../Providers/AuthProvider";
import useEnterKeyPress from "../hooks/useEnterKeyPress";

const DeleteFolderModal = ({
  isOpen,
  onClose,
  id,
  setIsDeleted,
}: {
  isOpen: boolean;
  onClose: () => void;
  id: string;
  setIsDeleted: any;
}) => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const currentUser = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleDeleteFolder = async () => {
    try {
      setIsDeleted(true);
      onClose();
      await fetch(`http://localhost:5000/folders/${id}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("An error occurred while deleting the file:", error);
    }
  };

  useEnterKeyPress(buttonRef);
  
  return (
    <>
      <Modal size={["xs", "xs", "lg", "lg"]} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalBody>
            <Heading margin="2% auto" size="xl" textAlign="center">
              Are you sure you would like to delete this folder and its
              contents?
            </Heading>
            <Player
              autoplay
              loop
              src={Dustbin}
              style={{ height: "60%", width: "60%" }}
            />
          </ModalBody>
          <ModalFooter border={0}>
            <Flex
              justifyContent="center"
              alignItems="center"
              width="full"
              border={0}
            >
              <LightMode>
                <Button
                  ref={buttonRef}
                  isLoading={isLoading}
                  variant="outline"
                  colorScheme="red"
                  size="lg"
                  width="40%"
                  borderRadius={5}
                  _hover={{ bg: "red.500", color: "white" }}
                  onClick={handleDeleteFolder}
                >
                  Delete
                </Button>
              </LightMode>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default DeleteFolderModal;
