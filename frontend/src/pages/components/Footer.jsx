import { Box, Container, Divider, Typography, IconButton } from "@mui/material";
import { AiFillGithub, AiFillLinkedin, AiFillTwitterCircle } from "react-icons/ai";

const Footer = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#1C1A27",
        color: "#aaa",
        mt: 6,
        py: 4,
      }}
      component="footer"
    >
      <Container maxWidth="lg">
        {/* Divider line */}
        <Divider sx={{ mb: 3, borderColor: "#333" }} />

        {/* Main content */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            textAlign: { xs: "center", md: "left" },
          }}
        >
          {/* Left side */}
          <Typography variant="body2">
            © {new Date().getFullYear()} ChatBox. Todos los derechos reservados.
          </Typography>

          {/* Right side: social icons */}
          <Box>
            <IconButton color="inherit" href="https://github.com" target="_blank">
              <AiFillGithub size={28} />
            </IconButton>
            <IconButton color="inherit" href="https://linkedin.com" target="_blank">
              <AiFillLinkedin size={28} />
            </IconButton>
            <IconButton color="inherit" href="https://twitter.com" target="_blank">
              <AiFillTwitterCircle size={28} />
            </IconButton>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;