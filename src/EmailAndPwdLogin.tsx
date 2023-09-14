import { ChangeEvent, FormEvent, useCallback, useState } from "react";
import { signinWithEmailAndPassword } from "./api";
import { ScreenComponent } from "./App";
import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";

interface ScreenProps {
  navigateToScreen: (screen: ScreenComponent) => void;
  navigateBack: () => void;
  currentScreen: ScreenComponent;
  accountMethod: string;
  loginMethod: string;
}

const EmailAndPwdLoginScreen: React.FC<ScreenProps> = (props) => {
  const [emailValue, setEmailValue] = useState("");
  const [pwdValue, setPwdValue] = useState("");

  const { navigateToScreen } = props;

  const handleEmailChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setEmailValue(event.target.value);
    },
    []
  );
  const handlePwdChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setPwdValue(event.target.value);
    },
    []
  );

  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();

      const jsonData = await signinWithEmailAndPassword(
        window.location.search,
        emailValue,
        pwdValue
      );
      const finish_redirect_uri = jsonData?.result?.data?.finish_redirect_uri;
      if (jsonData?.result?.finished) window.alert("ok");
      if (typeof finish_redirect_uri === "string") {
        window.location.href = finish_redirect_uri;
      }
    },
    [emailValue, pwdValue]
  );

  return (
    <Container component="main" maxWidth="xs">
      <Typography variant="h5" component="h5">
        Sign in with Email + Password
      </Typography>
      <Box
        sx={{
          marginTop: 5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Grid container>
          <ButtonGroup
            fullWidth
            aria-label="outlined primary button group"
            sx={{ mb: 1 }}
          >
            <Button
              variant="outlined"
              onClick={() => navigateToScreen({ name: "Signup" })}
            >
              Sign up
            </Button>
            <Button variant="contained">Sign in</Button>
          </ButtonGroup>
          <ButtonGroup fullWidth>
            <Button
              variant="contained"
              onClick={() => navigateToScreen({ name: "EmailAndPwdLogin" })}
            >
              Password
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigateToScreen({ name: "EmailAndOTPLogin" })}
            >
              OTP
            </Button>
          </ButtonGroup>
        </Grid>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={handleEmailChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={handlePwdChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Submit
          </Button>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => navigateToScreen({ name: "EmailAndOTPLogin" })}
          >
            Sign in with Email and OTP
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default EmailAndPwdLoginScreen;
