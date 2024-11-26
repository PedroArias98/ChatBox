import React from "react";
import { useState } from "react";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";

import { alertTitleClasses, Container, FormLabel } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import TabContext from "@material-ui/lab/TabContext";
import TabList from "@material-ui/lab/TabList";
import TabPanel from "@material-ui/lab/TabPanel";
import Input from "@mui/material/Input";

import darkTheme from "./misc/theme";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        ChatBox
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

export default function LabTabs() {
  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList
            onChange={handleChange}
            indicatorColor="primary"
            aria-label="lab API tabs example"
          >
            <Tab label="Inicia Sesion" value="1" />
            <Tab label="Registrarse" value="2" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <SignIn></SignIn>
        </TabPanel>
        <TabPanel value="2">
          <SignUp></SignUp>
        </TabPanel>
        <TabPanel value="3">Item Three</TabPanel>
      </TabContext>
    </Box>
  );
}

const SignIn = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
      password: data.get("password"),
    });
  };

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState();
  // const history = useHistory();

  const history = useHistory();

  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      alert("favor de llenar todos los campos");
      setLoading(false);
      return;
    }
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/user/login",
        { email, password },
        { email, password },
        config
      );
      //alert("Inicio de sesion Exitoso");
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      history.push("/chats");
    } catch (error) {
      alert("ha ocurrido un error", error);
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <Container>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}></Avatar>
        <Typography component="h1" variant="h5">
          Bienvenido denuevo
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Correo"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Contraseña"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <Box sx={{ mt: 1, mb: 2 }}>
            <Button
              style={{ minWidth: "60px", minHeight: "50px" }}
              type="submit"
              size="large"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2, borderRadius: "18px" }}
              onClick={submitHandler}
            >
              Sign In
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

const SignUp = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
      password: data.get("password"),
    });
  };

  const history = useHistory();
  function navigateTo(url) {
    history.push(url);
  }

  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [state, setLoading] = useState(false);
  const [pic, setPic] = useState();

  //const navigate = useNavigate();

  const submitHandler = async () => {
    setLoading(true);
    if (!name || !email || !password || !confirmPassword) {
      alert("Porfavor, introducir todos los campos");
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
    console.log(name, email, password, pic);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/user",
        {
          name,
          email,
          password,
          pic,
        },
        config
      );
      alert("Registro completado");
      localStorage.setItem("userInfo", JSON.Stringify(data));
      setLoading(false);
      navigateTo("/chats");
    } catch (error) {
      alert("Ha ocurrido un error", error);
    }
  };

  const postDetails = (pics) => {
    setLoading(true);
    if (pics === undefined) {
      alert("pic is undefined");
      return;
    }
    if (pics.type === "image/jpeg" || "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chatBox");
      data.append("cloud_name", "deby6roey");
      fetch("https://api.cloudinary.com/v1_1/deby6roey/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          console.log("hola2" + data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      alert("porfavor selecciona una imagen");
    }
  };
  // if (pics.type === "image/jpeg" || "image/png") {
  //}

  return (
    <Container>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}></Avatar>
        <Typography component="h1" variant="h5">
          Registrate
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Nombre"
            name="nombre"
            autoComplete="nombre"
            autoFocus
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Correo"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Contraseña"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirmar contraseña"
            type="password"
            id="confirmPassword"
            autoComplete="current-password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <Input type="file" onChange={(e) => postDetails(e.target.files[0])} />
          <Box sx={{ mt: 1, mb: 2 }}>
            <Button
              style={{ minWidth: "60px", minHeight: "50px" }}
              type="submit"
              size="large"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2, borderRadius: "18px" }}
              onClick={submitHandler}
            >
              Sign Up
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export const Login = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
      password: data.get("password"),
    });
  };
  return (
    <Container>
      <ThemeProvider theme={darkTheme}>
        <Container
          component="main"
          maxWidth="xs"
          sx={{
            marginTop: 4,
            background: "#212121",
            borderRadius: "8px",

            borderColor: "#6B728E",
          }}
        >
          <CssBaseline />
          <Box
            sx={{
              marginTop: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              paddingTop: 4,
            }}
          >
            <LabTabs></LabTabs>
          </Box>
          <Copyright sx={{ mt: 8, mb: 4, pb: 2 }} />
        </Container>
      </ThemeProvider>
    </Container>
  );
};
