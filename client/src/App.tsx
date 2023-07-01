import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Divider, HStack, Icon, Spacer, VStack } from "@chakra-ui/react";
import "./App.css"
import MenuBar from "./components/MenuBar";
import NavBar from "./components/NavBar";
import { FaFileAlt } from "react-icons/fa";
import Prompts from "./components/Prompts";
import Auth from "./components/Auth";
import Loading from "./components/Loading";

function App() {
  return (
    <VStack height='600px' width='450px' borderRadius={10} alignItems='flex-start'>
      <NavBar />
      <Divider padding='0 5vw' borderColor='black.600' bg='blackAlpha.600' />
      <HStack marginTop='1vh' marginLeft='5vw' marginRight='5vw' color='teal.400' width='full' alignItems='center' justifyContent='flex-start'>
        <Icon as={FaFileAlt}></Icon>
        <Breadcrumb fontWeight='medium' fontSize='sm' >
          <BreadcrumbItem>
            <BreadcrumbLink href='#'>Home</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <BreadcrumbLink href='#'>About</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink href='#'>Current</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </HStack>
      <Prompts />
      {/* <Auth /> */}
      {/* <Loading /> */}
      <Spacer />
      <Divider padding='0 5vw' borderColor='black.600' bg='blackAlpha.600' />
      <MenuBar />
    </VStack>
  );
}

export default App;