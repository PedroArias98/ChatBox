import React from "react";
import "../App.css";
import { CardHeader, Container } from "@mui/material";

import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";

import { Link } from "react-router-dom";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AppBar, Toolbar, Divider, IconButton } from "@mui/material";

import { AiFillWechat, AiFillFileAdd, AiFillVideoCamera } from "react-icons/ai";

import SendIcon from "@mui/icons-material/Send";

import { Login } from "../pages/Login";
import { Route } from "react-router-dom";

import sheet from "../images/sheet.png";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      {"ChatBox "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#3f51b5",
    },
    secondary: {
      main: "#b39ddb",
    },
  },
});

export const Home = () => {
  const navItems = ["Home", "About", "Contact"];

  const itemStyles = {
    border: 1,
    backgroundColor: "#212121",
    borderRadius: 2,
    height: "100%",
    textAlign: "center",
  };

  const tiers = [
    {
      icon: <AiFillWechat size={50} />,
      price: "Chatea",
      description:
        "Chats grupales o individuales, mantente en contacto con tus compañeros en todo momento.",
    },
    {
      icon: <AiFillFileAdd size={50} />,

      price: "Sube tareas",
      description:
        "Asigna y completa tareas dentro de un tiempo establecido para sumar puntos.",
    },
    {
      icon: <AiFillVideoCamera size={50} />,
      price: "Videollamadas",
      description:
        "En tiempo real para mejor comunicación con tus compañeros de equipo.",
    },
  ];

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
      password: data.get("password"),
    });
  };
  return (
    <Container maxWidth={false}>
      <ThemeProvider theme={theme}>
        <AppBar
          position="static"
          style={{ background: "transparent", boxShadow: "none" }}
        >
          <Toolbar variant="dense">
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            ></IconButton>
            <Typography
              variant="h3"
              color="inherit"
              component="div"
              style={{ flex: 1 }}
              class="smallText"
            >
              ChatBox
            </Typography>
            <Divider />
            <Box sx={{ flexDirection: "column-reverse" }}>
              <Link to="/login">
                <Button
                  size="large"
                  type="submit"
                  fullWidth
                  variant="contained"
                >
                  Sign In
                </Button>
              </Link>
            </Box>
          </Toolbar>
        </AppBar>

        <Container
          className="Container-landing"
          component="main"
          maxWidth="lg"
          sx={{
            marginTop: 6,
            borderRadius: "12px",
            borderColor: "#6B728E",
          }}
        >
          <CssBaseline />
          <Box
            sx={{
              marginTop: 2,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              padding: 3,
            }}
          >
            <Box>
              <Grid
                container
                spacing={0}
                alignItems="center"
                justifyContent="center"
              >
                <Grid item xl={7}>
                  <Typography class="title">
                    Haciendo el trabajo en equipo mas fácil.
                  </Typography>
                  <Typography
                    sx={{ mt: 0, pt: 0 }}
                    component="h1"
                    variant="h2"
                    class="subtitle"
                  >
                    La distacia ya no será un impedimento. Con ChatBox tienes
                    todas las herramientas que necesitas para poder colaborar
                    con tus equipos de una forma sencilla y eficiente.
                  </Typography>
                  <Button
                    size="large"
                    type="submit"
                    variant="contained"
                    sx={{ mt: 3, mb: 2, borderRadius: "18px" }}
                  >
                    Empezar
                  </Button>
                </Grid>

                <Grid item xl={5} style={{}}>
                  <img src={sheet} />
                </Grid>
              </Grid>
            </Box>
          </Box>

          {/* <Copyright sx={{ mt: 8, mb: 4, pb: 2 }} /> */}
        </Container>

        <Container
          maxWidth="lg"
          sx={{
            marginTop: 4,

            borderRadius: "8px",
            //border: 1,
            //borderColor: "#6B728E",
          }}
        >
          <Typography
            component="h1"
            class="title2"
            align="center"
            mt={5}
            mb={5}
          >
            Todo lo que puedes hacer
          </Typography>

          <Typography
            component="h1"
            class="subtitle"
            align="center"
            mt={2}
            mb={10}
          >
            Echa un vistazo a las caracteristicas que tiene la aplicacion de
            ChatBox.
          </Typography>
          <Container maxWidth="xl" component="main">
            <Grid container spacing={5} alignItems="stretch" paddingBottom={5}>
              {tiers.map((tier) => (
                // Enterprise card is full width at sm breakpoint
                <Grid
                  item
                  key={tier.icon}
                  xs={12}
                  sm={tier.icon === "Enterprise" ? 12 : 6}
                  md={4}
                  style={{ display: "flex" }}
                >
                  <Card
                    style={{
                      borderRadius: 10,
                      paddingLeft: 8,
                      paddingRight: 8,
                      background: "#212121",
                    }}
                  >
                    <CardHeader
                      title={tier.icon}
                      subheader={tier.subheader}
                      titleTypographyProps={{ align: "center" }}
                      subheaderTypographyProps={{
                        align: "center",
                      }}
                    ></CardHeader>
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "baseline",
                          mb: 2,
                        }}
                      >
                        <Typography
                          component="h1"
                          variant="h2"
                          class="smallTextGradient2"
                        >
                          {tier.price}
                        </Typography>
                      </Box>

                      <Typography variant="subtitle" align="center">
                        {tier.description}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button fullWidth variant={tier.buttonVariant}>
                        {tier.buttonText}
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>

          {/* <Grid
            container
            spacing={0}
            alignItems="center"
            justifyContent="center"
          >
            <Grid item xl={3} xs={12} margin={2} sx={itemStyles}>
              <Card>
                <CardContent>
                  <Box
                    sx={{
                      //display: "flex",
                      justifyContent: "center",
                      alignItems: "baseline",
                      mb: 2,
                    }}
                  >
                    <Typography component="h1" variant="h2" class="smallText">
                      Sube tus tareas.
                    </Typography>
                    <Typography
                      component="h2"
                      variant="h3"
                      color="text.primary"
                      class="subtitle"
                    >
                      Crea chats grupales o individualess
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xl={3} xs={12} margin={2} sx={itemStyles}>
              <Card>
                <CardContent>
                  <Box
                    sx={{
                      //display: "flex",
                      justifyContent: "center",
                      alignItems: "baseline",
                      mb: 2,
                    }}
                  >
                    <Typography component="h1" variant="h2" class="smallText">
                      Sube tus tareas.
                    </Typography>
                    <Typography
                      component="h2"
                      variant="h3"
                      color="text.primary"
                      class="subtitle"
                    >
                      Crea chats grupales o individualess
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xl={3} xs={12} margin={2} sx={itemStyles}>
              <Card>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "baseline",
                      mb: 2,
                    }}
                  >
                    <Typography component="h1" variant="h2" class="smallText">
                      Sube tus tareasadasdadadadadassasd.
                    </Typography>
                    <Typography
                      component="h2"
                      variant="h3"
                      color="text.primary"
                      class="subtitle"
                    >
                      Crea chats grupales o individualessaasdasdadadasdaads
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid> */}
        </Container>
      </ThemeProvider>
    </Container>
  );
};
