import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
}

export const theme = extendTheme({
  config,
  fonts: {
    body: "Open Sans, sans-serif",
  },
  styles: {
    global: () => ({
      '*': {
        WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
      },
      body: {
        bg: "none",
        height:'600px',
        width:'450px'
      },
      '::-webkit-scrollbar-track': {
        borderRadius: '10px',
        backgroundColor: 'gray.200',
        boxShadow: "inset 0 0 6px rgba(0,0,0,0.3)"
      },
      '::-webkit-scrollbar': {
        width: '12px',
        backgroundColor: 'gray.200',
      },
      '::-webkit-scrollbar-thumb': {
        borderRadius: "10px",
        backgroundColor: 'gray.600',
        boxShadow: "inset 0 0 6px rgba(0,0,0,.3)",
      },
    }),
  },
});
