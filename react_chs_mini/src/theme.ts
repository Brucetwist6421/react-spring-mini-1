import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1565c0", // 딥블루
      contrastText: "#fff",
    },
    secondary: {
      main: "#ffb300", // 앰버
    },
    background: {
      default: "#f4f6f8",
      paper: "#ffffff",
    },
  },
  shape: {
    borderRadius: 10,
  },
  typography: {
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiAppBar: {
      defaultProps: {
        elevation: 2,
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 10,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        contained: {
          boxShadow: "none",
          textTransform: "none",
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        "body": {
          backgroundColor: "#f4f6f8",
        },
        // RichTreeView / TreeItem 커스터마이징 예시
        ".MuiTreeItem-root .MuiTreeItem-label": {
          paddingRight: 8,
        },
        ".MuiTreeItem-root.Mui-selected > .MuiTreeItem-content .MuiTreeItem-label": {
          backgroundColor: "rgba(21,101,192,0.08)",
        },
      },
    },
  },
});

export default theme;