import { createTheme } from "@mui/material/styles";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#6c77ff",
    },
    secondary: {
      main: "#b39ddb",
    },
  },

  components: {
    MuiMenu: {
      styleOverrides: {
        list: {
          '&[role="menu"]': {
            backgroundColor: "#343145",
          },
        },
      },
    },
  },
});

export default darkTheme;
