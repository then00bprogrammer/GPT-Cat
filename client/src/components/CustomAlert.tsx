import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Box,
  CloseButton,
  LightMode,
} from "@chakra-ui/react";

const CustomAlert = ({
  title,
  description,
  showAlert,
  setShowAlert,
}: {
  title: string;
  description: string;
  showAlert: boolean;
  setShowAlert: any;
}) => {
  const onClose = () => {
    setShowAlert(false);
  };

  return (
    <>
      {showAlert && (
        <LightMode>
          <Alert status="error" width="75vw">
            <AlertIcon />
            <Box width="90%">
              <AlertTitle>{title}</AlertTitle>
              <AlertDescription>{description}</AlertDescription>
            </Box>
            <CloseButton
              alignSelf="flex-start"
              position="relative"
              right={-1}
              top={-1}
              onClick={onClose}
            />
          </Alert>
        </LightMode>
      )}
    </>
  );
};

export default CustomAlert;
