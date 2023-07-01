import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";
import { AuthProvider } from "./Providers/AuthProvider";
import { PathProvider } from "./Providers/PathProvider";
import { theme } from "./chakra/theme";
import "./firebase/clientApp";

const root = document.createElement("div");
root.className = "container";
document.body.appendChild(root);
const rootDiv = ReactDOM.createRoot(root);
rootDiv.render(
  <AuthProvider>
    <PathProvider>
      <ChakraProvider theme={theme}>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </ChakraProvider>
    </PathProvider>
  </AuthProvider>
);
