import {
  HStack,
  Icon,
  Spacer,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useState } from "react";
import {
  FaCheck,
  FaPencilAlt,
  FaRegFolderOpen,
  FaTrashAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import DeleteFolderModal from "./DeleteFolder";

const Folder = ({ name, _id }: { name: string; _id: string }) => {
  const [isDeleted, setIsDeleted] = useState<boolean>(false);
  const bg = useColorModeValue("gray.200", "gray.600");
  const [editable, setEditable] = useState<boolean>(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [inputName, setInputName] = useState(name);
  const onDeleteClose = () => {
    setIsDeleteOpen(false);
  };

  const handleToggleEdit = async (
    event: React.MouseEvent<SVGSVGElement, MouseEvent>,
    _id: string
  ) => {
    const toSubmit: boolean = editable;
    setEditable(!editable);
    if (toSubmit) {
      try {
        await fetch(`http://localhost:5000/folders/${_id}`, {
          method: "PATCH",
          body: JSON.stringify({ name: inputName }),
          headers: {
            "Content-Type": "application/json",
          },
        });
      } catch (error) {
        console.log("An error occurred while editing the file", error);
      }
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLDivElement>) => {
    setInputName(event.target.innerText);
  };
  if (!isDeleted)
  return (
    <HStack
      key={_id}
      cursor="pointer"
      padding="2vw"
      fontSize="xl"
      width="95%"
      bg={bg}
      borderRadius={10}
      marginRight="5%"
    >
      <DeleteFolderModal
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        id={_id}
        setIsDeleted={setIsDeleted}
      />
      <Link to={`/prompts/${_id}/${name}`}>
        <Icon as={FaRegFolderOpen} />
      </Link>
      <Text
        outline="none"
        border="none"
        borderBottom={editable ? "2px dashed" : "none"}
        contentEditable={editable}
        onInput={handleChange}
        paddingRight="5vw"
        bg={editable ? "gray.500" : "none"}
        color={editable ? "white" : "black"}
        style={{ caretColor: "white" }}
      >
        {name}
      </Text>
      <Spacer />
      <Icon
        as={editable ? FaCheck : FaPencilAlt}
        onClick={(event: React.MouseEvent<SVGSVGElement, MouseEvent>) =>
          handleToggleEdit(event, _id)
        }
        cursor="pointer"
      />
      <Icon
        as={FaTrashAlt}
        cursor="pointer"
        onClick={() => setIsDeleteOpen(!isDeleteOpen)}
      />
    </HStack>
  );
  else return null;
};

export default Folder;
