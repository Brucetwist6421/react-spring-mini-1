import { Box, Container, Link, Typography } from "@mui/material";

interface FooterProps {
  company?: string;
}

export default function Footer({ company = "My Company" }: FooterProps) {
  return (
    <Box 
      component="footer" 
      sx={{ 
        py: 5, 
        px: 2, 
        mt: "auto", 
        backgroundColor: "#f1f5f9", // 헤더보다 약간 더 짙은 회색 (Slate 100)
        borderTop: "1px solid #e2e8f0",
      }}
    >
      <Container maxWidth="lg">
        <Box 
          sx={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            flexDirection: { xs: "column", sm: "row" },
            gap: 1
          }}
        >
          <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 500 }}>
            © {new Date().getFullYear()} 
            <Box component="span" sx={{ color: "#334155", ml: 0.5, fontWeight: 600 }}>
              {company}
            </Box>
            . All rights reserved.
          </Typography>

          <Box sx={{ display: "flex", gap: 3 }}>
            <Link 
              href="#" 
              underline="none" 
              sx={{ 
                fontSize: "0.85rem", 
                color: "#64748b", 
                "&:hover": { color: "#38bdf8" } 
              }}
            >
              Privacy Policy
            </Link>
            <Link 
              href="#" 
              underline="none" 
              sx={{ 
                fontSize: "0.85rem", 
                color: "#64748b", 
                "&:hover": { color: "#38bdf8" } 
              }}
            >
              Contact
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}