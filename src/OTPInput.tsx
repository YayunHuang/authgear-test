import { ChangeEvent, FormEvent, useCallback, useState } from "react";
import "./App.css";
import { ScreenComponent } from "./App";
import {
  otpAuthentication,
  resendOTP,
  submitOTPSignin,
  signupWithOTP,
} from "./api";
import {
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
} from "@mui/material";

interface ScreenProps {
  navigateToScreen: (screen: ScreenComponent) => void;
  navigateBack: () => void;
  flowRef?: string;
  currentScreen: ScreenComponent;
  twoFAEnabled?: boolean;
  emailValue: string;
}

const OTPInput: React.FC<ScreenProps> = (props) => {
  const [OTPValue, setOTPValue] = useState("");

  const {
    navigateBack,
    currentScreen,
    flowRef,
    navigateToScreen,
    twoFAEnabled,
    emailValue,
  } = props;

  const handleOTPChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setOTPValue(event.target.value);
    },
    []
  );

  const handleSendOTP = useCallback(async (event: FormEvent) => {
    event.preventDefault();
    await resendOTP(currentScreen.flowId ?? "");
  }, []);

  const generateSecretUri = (email: string, secret: string) => {
    return `otpauth://totp/Authgear%20Test:${email}?secret=${secret}&issuer=Authgear%20Test&algorithm=SHA1&digits=6&period=30`;
  };

  const handleOTPSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();
      let jsonData = null;

      switch (flowRef) {
        case "login_flow":
          jsonData = await submitOTPSignin(
            OTPValue,
            currentScreen.flowId ?? ""
          );

          if (jsonData.error) {
            window.alert("Something went wrong: " + JSON.stringify(jsonData.error.reason));
            throw new Error("unexpected response: " + JSON.stringify(jsonData));
          }
          const finish_redirect_uri =
            jsonData?.result?.data?.finish_redirect_uri;
          if (typeof finish_redirect_uri === "string") {
            window.location.href = finish_redirect_uri;
          }
          if (twoFAEnabled) {
            const id = jsonData?.result?.id;
            const newFlowRef = jsonData?.result?.flow_reference?.type;
            navigateToScreen({
              name: "TOTPInput",
              flowId: id,
              flowRef: newFlowRef,
            });
          }
          break;
        case "signup_flow":
          jsonData = await signupWithOTP(
            OTPValue,
            currentScreen.flowId ?? "",
            twoFAEnabled ?? false
          );

          if (jsonData.error) {
            window.alert("Something went wrong: " + JSON.stringify(jsonData.error.reason));
            throw new Error("unexpected response: " + JSON.stringify(jsonData));
          }
          const type = jsonData?.result?.flow_step?.type;
          const id = jsonData?.result?.id;
          const newFlowRef = jsonData?.result?.flow_reference?.type;

          const finished = jsonData?.result?.finished;
          if (jsonData?.result?.finished) window.alert("ok");
          if (finished) {
            const finish_redirect_uri =
              jsonData?.result?.data?.finish_redirect_uri;
            if (typeof finish_redirect_uri === "string") {
              window.location.href = finish_redirect_uri;
            }
          }

          if (twoFAEnabled) {
            const secret = jsonData?.result?.data?.secret;
            const secretUri = generateSecretUri(emailValue, secret);

            navigateToScreen({
              name: "TOTPInput",
              flowId: id,
              flowRef: newFlowRef,
              secretUri: secretUri,
            });
          } else if (type === "verify" && id && newFlowRef) {
            navigateToScreen({
              name: "OTPInput",
              flowId: id,
              flowRef: newFlowRef,
              emailValue: emailValue,
            });
          } else if (type === "authenticate" && id && newFlowRef) {
            const newJsonData = await otpAuthentication(id);
            if (newJsonData.error) {
              window.alert("Something went wrong: " + JSON.stringify(jsonData.error.reason));
            throw new Error(
                "unexpected response: " + JSON.stringify(jsonData)
              );
            }
            const newId = newJsonData?.result?.id;
            const newFlowRef = newJsonData?.result?.flow_reference?.type;
            navigateToScreen({
              name: "OTPInput",
              flowId: newId,
              flowRef: newFlowRef,
            });
          }
          break;
      }
    },
    [OTPValue]
  );

  return (
    <Container component="main" maxWidth="xs">
      <Typography variant="h5" component="h5">
        Enter OTP code
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
          <FormControlLabel
            label="Enable 2FA"
            sx={{ mt: 1 }}
            control={
              <Checkbox
                disabled
                checked={twoFAEnabled}
                inputProps={{ "aria-label": "controlled" }}
              />
            }
          />
        </Grid>
        <Box
          component="form"
          onSubmit={handleOTPSubmit}
          noValidate
          sx={{ mt: 1 }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="otp"
            label="OTP code"
            name="otp"
            autoComplete="otp"
            autoFocus
            onChange={handleOTPChange}
          />
          <ButtonGroup fullWidth sx={{ mt: 3, mb: 2 }}>
            <Button type="submit" variant="contained">
              Submit
            </Button>
            <Button variant="outlined" onClick={handleSendOTP}>
              Resend OTP
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

export default OTPInput;
