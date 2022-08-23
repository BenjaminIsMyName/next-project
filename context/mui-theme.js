// import { green } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";

const dark = createTheme({
  direction: "rtl",
  palette: {
    mode: "dark",
    primary: {
      main: "rgb(20, 20, 20)",
      // contrastText: "white",
    },
    secondary: {
      main: "rgb(50, 50, 50)",
      // contrastText: "white",
    },
    error: {
      main: "rgb(200, 50, 50)",
    },
    warning: {
      main: "rgb(255, 255, 0)",
    },
    info: {
      main: "rgb(0, 255, 255)",
    },
    success: {
      main: "rgb(20, 150, 20)",
    },
    text: {
      main: "rgb(255, 255, 255)",
    },
  },
});

export { dark };
