import { useState } from 'react';
import { Player } from "@lottiefiles/react-lottie-player";
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
import Dustbin from "../assets/trash-can.json";

const DeleteFileModal = ({
  isOpen,
  onClose,
  id,
  parentId,
  setIsDeleted,
}: {
  isOpen: boolean;
  onClose: () => void;
  id: string;
  parentId: string;
  setIsDeleted: any;
}) => {
  const [isLoading,setIsLoading] = useState<boolean>(false);
  const handleDeleteFile = async () => {
    try {
      setIsLoading(true);
      await fetch(`http://localhost:5000/files/${id}/${parentId}`, {
        method: "DELETE",
      });
      setIsLoading(false);
      setIsDeleted(true);
      onClose();
    } catch (error) {
      console.error("An error occurred while deleting the file:", error);
    }
  };

  return (
    <>
      <Modal size={["xs", "xs", "lg", "lg"]} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalBody>
            <Heading margin="2% auto" size="xl" textAlign="center">
              Are you sure you would like to delete this file?
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
                  isLoading={isLoading}
                  variant="outline"
                  colorScheme="red"
                  size="lg"
                  width="40%"
                  borderRadius={5}
                  _hover={{ bg: "red.500", color: "white" }}
                  onClick={handleDeleteFile}
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

export default DeleteFileModal;