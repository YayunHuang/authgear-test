import { ChangeEvent, FormEvent, useCallback, useMemo, useState } from "react";
import { signupWithEmail, signupWithPhone } from "./api";
import { ScreenComponent } from "./App";
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
  currentScreen: ScreenComponent;
}

const Signup: React.FC<ScreenProps> = (props) => {
  const [emailValue, setEmailValue] = useState("");
  const [signupType, setSignupType] = useState("email");
  const [signupMethod, setSignupMethod] = useState("password");
  const [pwdValue, setPwdValue] = useState("");
  const [twoFAEnabled, setTwoFAEnabled] = useState(true);

  const { navigateToScreen } = props;

  const displaySignupType = useMemo(() => {
    return signupType === "email" ? "Email" : "Phone";
  }, [signupType]);

  const signupLabel = useMemo(() => {
    return signupType === "email" ? "Email Address" : "Phone Number";
  }, [signupType]);

  const authenticationMethod = useMemo(() => {
    return signupMethod === "otp"
      ? signupType === "email"
        ? "primary_oob_otp_email"
        : "primary_oob_otp_sms"
      : "primary_password";
  }, [signupMethod, signupType]);

  const displaySignupMethod = useMemo(() => {
    return signupMethod === "otp" ? "OTP" : "Password";
  }, [signupMethod]);

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

  const handleTwoFAChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTwoFAEnabled(event.target.checked);
  };

  const generateSecretUri = (email: string, secret: string) => {
    return `otpauth://totp/Authgear%20Test:${email}?secret=${secret}&issuer=Authgear%20Test&algorithm=SHA1&digits=6&period=30`;
  };

  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();
      let jsonData = null;
      switch (signupType) {
        case "email":
          jsonData = await signupWithEmail(
            window.location.search,
            emailValue,
            authenticationMethod,
            twoFAEnabled,
            pwdValue
          );
          if (jsonData.error) {
            window.alert("Something went wrong: " + JSON.stringify(jsonData.error.reason));
            throw new Error("unexpected response: " + JSON.stringify(jsonData));
          }
          break;
        case "phone":
          jsonData = await signupWithPhone(
            window.location.search,
            emailValue,
            authenticationMethod,
            pwdValue,
            twoFAEnabled
          );
          if (jsonData.error) {
            window.alert("Something went wrong: " + JSON.stringify(jsonData.error.reason));
            throw new Error("unexpected response: " + JSON.stringify(jsonData));
          }
      }
      const id = jsonData?.result?.id;
      const flowRef = jsonData?.result?.flow_reference?.type;

      if (signupMethod === "otp" && id && flowRef) {
        navigateToScreen({
          name: "OTPInput",
          flowId: id,
          flowRef: flowRef,
          twoFAEnabled: twoFAEnabled,
          emailValue: emailValue,
        });
      } else if (twoFAEnabled) {
        const secret = jsonData?.result?.data?.secret;
        const secretUri = generateSecretUri(emailValue, secret);
        navigateToScreen({
          name: "TOTPInput",
          flowId: id,
          flowRef: flowRef,
          secretUri: secretUri,
        });
      }

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
        Sign up with {displaySignupType} + {displaySignupMethod}
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
            <Button variant="contained">Sign up</Button>
            <Button
              variant="outlined"
              onClick={() => navigateToScreen({ name: "Login" })}
            >
              Sign in
            </Button>
          </ButtonGroup>
          <ButtonGroup
            fullWidth
            aria-label="outlined primary button group"
            sx={{ mb: 1 }}
          >
            <Button
              variant={signupType === "email" ? "contained" : "outlined"}
              onClick={() => setSignupType("email")}
            >
              Email
            </Button>
            <Button
              variant={signupType === "email" ? "outlined" : "contained"}
              onClick={() => setSignupType("phone")}
            >
              Phone
            </Button>
          </ButtonGroup>
          <ButtonGroup fullWidth aria-label="outlined primary button group">
            <Button
              variant={signupMethod === "otp" ? "outlined" : "contained"}
              onClick={() => setSignupMethod("password")}
            >
              Password
            </Button>
            <Button
              variant={signupMethod === "password" ? "outlined" : "contained"}
              onClick={() => setSignupMethod("otp")}
            >
              OTP
            </Button>
          </ButtonGroup>
          <FormControlLabel
            label="Enable 2FA"
            sx={{ mt: 1 }}
            control={
              <Checkbox
                disabled
                checked={twoFAEnabled}
                onChange={handleTwoFAChange}
                inputProps={{ "aria-label": "controlled" }}
              />
            }
          />
        </Grid>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id={signupType}
            label={signupLabel}
            name={signupType}
            autoComplete={signupType}
            autoFocus
            onChange={handleEmailChange}
          />
          {signupMethod === "password" ? (
            <TextField
              margin="normal"
              required
              fullWidth
              id="password"
              label="Password"
              name="password"
              autoComplete="password"
              onChange={handlePwdChange}
            />
          ) : (
            <></>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Submit
          </Button>
          {/* <Button
            fullWidth
            variant="outlined"
            sx={{ mt: 1 }}
            onClick={() => navigateBack()}
          >
            Back
          </Button> */}
        </Box>
      </Box>
    </Container>
  );
};

export default Signup;
