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
  <ChakraProvider theme={theme}>
    <AuthProvider>
      <PathProvider>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </PathProvider>
    </AuthProvider>
  </ChakraProvider>
);
