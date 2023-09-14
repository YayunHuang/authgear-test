import { ChangeEvent, FormEvent, useCallback, useState } from "react";
import "./App.css";
import { signinWithEmailAndOTP } from "./api";
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
}

const EmailAndOTPLogin: React.FC<ScreenProps> = (props) => {
  const [emailValue, setEmailValue] = useState("");

  const { navigateToScreen, currentScreen } = props;
  console.log(currentScreen)

  const handleEmailChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setEmailValue(event.target.value);
    },
    []
  );

  const handleEmailSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();

      const jsonData = await signinWithEmailAndOTP(
        window.location.search,
        emailValue
      );

      const authentication = jsonData?.result?.flow_step?.authentication;
      const id = jsonData?.result?.id;
      const flowRef = jsonData?.result?.flow_reference?.type;

      if (authentication === "primary_oob_otp_email" && id && flowRef) {
        navigateToScreen({ name: "OTPInput", flowId: id, flowRef: flowRef });
      }
    },
    [emailValue]
  );

  return (
    <Container component="main" maxWidth="xs">
      <Typography variant="h5" component="h5">
        Sign in with Email + OTP
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
              variant="outlined"
              onClick={() => navigateToScreen({ name: "EmailAndPwdLogin" })}
            >
              Password
            </Button>
            <Button
              variant="contained"
              onClick={() => navigateToScreen({ name: "EmailAndOTPLogin" })}
            >
              OTP
            </Button>
          </ButtonGroup>
        </Grid>
        <Box
          component="form"
          onSubmit={handleEmailSubmit}
          noValidate
          sx={{ mt: 1 }}
        >
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
            onClick={() => navigateToScreen({ name: "EmailAndPwdLogin" })}
          >
            Sign in with Email and Password
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default EmailAndOTPLogin;
