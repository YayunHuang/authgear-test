import { ChangeEvent, FormEvent, useCallback, useState } from "react";
import "./App.css";
import { ScreenComponent } from "./App";
import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { signinWithTOTP, submitTOTP } from "./api";
import QRCode from "qrcode.react";

interface ScreenProps {
  navigateToScreen: (screen: ScreenComponent) => void;
  navigateBack: () => void;
  flowRef?: string;
  currentScreen: ScreenComponent;
  secretUri: string;
}

const TOTPInput: React.FC<ScreenProps> = (props) => {
  const [TOTPValue, setTOTPValue] = useState("");
  const [displayName, setDisplayName] = useState("");

  const { navigateBack, currentScreen, flowRef, navigateToScreen, secretUri } =
    props;
  console.log(flowRef);

  const handleOTPChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setTOTPValue(event.target.value);
    },
    []
  );

  const handleDisplayNameChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setDisplayName(event.target.value);
    },
    []
  );

  const handleTOTPSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();
      console.log("Submit");
      let jsonData = null;
      switch (currentScreen.flowRef) {
        case "signup_flow":
          jsonData = await submitTOTP(
            currentScreen.flowId ?? "",
            TOTPValue,
            displayName
          );
          if (jsonData.error) {
            window.alert("Something went wrong: " + JSON.stringify(jsonData.error.reason));
            throw new Error("unexpected response: " + JSON.stringify(jsonData));
          }
          break;
        case "login_flow":
          jsonData = await signinWithTOTP(
            currentScreen.flowId ?? "",
            TOTPValue
          );
          if (jsonData.error) {
            window.alert("Something went wrong: " + JSON.stringify(jsonData.error.reason));
            throw new Error("unexpected response: " + JSON.stringify(jsonData));
          }
          break;
      }

      const finished = jsonData?.result?.finished;
      if (finished) window.alert("ok");
      if (finished) {
        const finish_redirect_uri = jsonData?.result?.data?.finish_redirect_uri;
        if (typeof finish_redirect_uri === "string") {
          window.location.href = finish_redirect_uri;
        }
      }
    },
    [TOTPValue, displayName]
  );

  return (
    <Container component="main" maxWidth="xs">
      {flowRef === "signup_flow" ? (
        <Box>
          <Paper sx={{ padding: "20px", mb: 3 }}>
            <Typography variant="h6">QR Code for TOTP</Typography>
            <QRCode value={secretUri} />
          </Paper>

          <Typography
            sx={{ mb: 2, whiteSpace: "pre-line", overflowWrap: "break-word" }}
          >
            {secretUri}
          </Typography>
        </Box>
      ) : (
        <></>
      )}
      <Typography variant="h5" component="h5">
        Enter TOTP code
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
          <ButtonGroup fullWidth aria-label="outlined primary button group">
            <Button
              variant={flowRef === "signup_flow" ? "contained" : "outlined"}
              onClick={() => navigateToScreen({ name: "Signup" })}
            >
              Sign up
            </Button>
            <Button
              variant={flowRef === "login_flow" ? "contained" : "outlined"}
              onClick={() => navigateToScreen({ name: "Login" })}
            >
              Sign in
            </Button>
          </ButtonGroup>
        </Grid>
        <Box
          component="form"
          onSubmit={handleTOTPSubmit}
          noValidate
          sx={{ mt: 1 }}
        >
          {flowRef === "signup_flow" ? (
            <TextField
              margin="normal"
              required
              fullWidth
              id="diplayName"
              label="Display Name"
              name="displayName"
              autoComplete="displayName"
              autoFocus
              onChange={handleDisplayNameChange}
            />
          ) : (
            <></>
          )}
          <TextField
            margin="normal"
            required
            fullWidth
            id="totp"
            label="TOTP code"
            name="totp"
            autoComplete="totp"
            autoFocus
            onChange={handleOTPChange}
          />

          <ButtonGroup fullWidth sx={{ mt: 3, mb: 2 }}>
            <Button type="submit" variant="contained">
              Submit
            </Button>
          </ButtonGroup>
          <Button
            fullWidth
            variant="outlined"
            sx={{ mt: 1 }}
            onClick={() => navigateBack()}
          >
            Back
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default TOTPInput;
