import { Divider, Spacer, VStack } from "@chakra-ui/react";
import "./App.css"
import MenuBar from "./components/MenuBar";
import NavBar from "./components/NavBar";
import Prompts from "./components/Prompts";
import Auth from "./components/Auth";

function App() {
  return (
    <VStack height='600px' width='450px' borderRadius={10} alignItems='flex-start'>
      <NavBar />
      <Divider padding='0 5vw' borderColor='black.600' bg='blackAlpha.600' />
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