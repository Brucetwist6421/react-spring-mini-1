import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

interface FooterProps {
  company?: string;
}

export default function Footer({ company = "My Company" }: FooterProps) {
  return (
    <AppBar position="static" component="footer" color="primary" sx={{ mt: 4 }}>
      <Toolbar>
        <Container sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="body2" color="inherit">
            © {new Date().getFullYear()} {company}
          </Typography>
          <Box>
            <Link color="inherit" href="/about" sx={{ mr: 2 }}>
              About
            </Link>
            <Link color="inherit" href="/contact">
              Contact
            </Link>
          </Box>
        </Container>
      </Toolbar>
    </AppBar>
  );
}