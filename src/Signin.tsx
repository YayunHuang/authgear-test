import { ChangeEvent, FormEvent, useCallback, useMemo, useState } from "react";
import {
  signinWithEmailAndOTP,
  signinWithEmailAndPassword,
  signinWithPhoneAndOTP,
  signinWithPhoneAndPassword,
} from "./api";
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

const Signin: React.FC<ScreenProps> = (props) => {
  const [emailValue, setEmailValue] = useState("");
  const [signinType, setSigninType] = useState("email");
  const [signinMethod, setSigninMethod] = useState("password");
  const [pwdValue, setPwdValue] = useState("");
  const [twoFAEnabled, setTwoFAEnabled] = useState(true);

  const { navigateToScreen } = props;

  const displaySigninType = useMemo(() => {
    return signinType === "email" ? "Email" : "Phone";
  }, [signinType]);

  const signupLabel = useMemo(() => {
    return signinType === "email" ? "Email Address" : "Phone Number";
  }, [signinType]);

  const displaySigninMethod = useMemo(() => {
    return signinMethod === "otp" ? "OTP" : "Password";
  }, [signinMethod]);

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

  const navigateToTOTPInput = (id: string, flowRef: string) => {
    navigateToScreen({ name: "TOTPInput", flowId: id, flowRef: flowRef });
  };

  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();
      let jsonData = null;
      switch (signinType) {
        case "email":
          if (signinMethod === "otp") {
            jsonData = await signinWithEmailAndOTP(
              window.location.search,
              emailValue
            );

            if (jsonData.error) {
              window.alert("Something went wrong: " + JSON.stringify(jsonData.error.reason));
              throw new Error(
                "unexpected response: " + JSON.stringify(jsonData)
              );
            }

            const authentication = jsonData?.result?.flow_step?.authentication;
            const id = jsonData?.result?.id;
            const flowRef = jsonData?.result?.flow_reference?.type;

            if (authentication === "primary_oob_otp_email" && id && flowRef) {
              navigateToScreen({
                name: "OTPInput",
                flowId: id,
                flowRef: flowRef,
                twoFAEnabled: twoFAEnabled,
              });
            }
          } else if (signinMethod === "password") {
            jsonData = await signinWithEmailAndPassword(
              window.location.search,
              emailValue,
              pwdValue
            );

            if (jsonData.error) {
              window.alert("Something went wrong: " + JSON.stringify(jsonData.error.reason));
              throw new Error(
                "unexpected response: " + JSON.stringify(jsonData)
              );
            }
            const finish_redirect_uri =
              jsonData?.result?.data?.finish_redirect_uri;
            if (jsonData?.result?.finished) window.alert("ok");
            if (typeof finish_redirect_uri === "string") {
              window.location.href = finish_redirect_uri;
            }

            const id = jsonData?.result?.id;
            const flowRef = jsonData?.result?.flow_reference?.type;
            navigateToTOTPInput(id, flowRef);
          }
          break;
        case "phone":
          if (signinMethod === "otp") {
            jsonData = await signinWithPhoneAndOTP(
              window.location.search,
              emailValue
            );

            if (jsonData.error) {
              window.alert("Something went wrong: " + JSON.stringify(jsonData.error.reason));
              throw new Error(
                "unexpected response: " + JSON.stringify(jsonData)
              );
            }

            const authentication = jsonData?.result?.flow_step?.authentication;
            const id = jsonData?.result?.id;
            const flowRef = jsonData?.result?.flow_reference?.type;

            if (authentication === "primary_oob_otp_sms" && id && flowRef) {
              navigateToScreen({
                name: "OTPInput",
                flowId: id,
                flowRef: flowRef,
                twoFAEnabled: twoFAEnabled,
              });
            }
          } else if (signinMethod === "password") {
            jsonData = await signinWithPhoneAndPassword(
              window.location.search,
              emailValue,
              pwdValue
            );

            if (jsonData.error) {
              window.alert("Something went wrong: " + JSON.stringify(jsonData.error.reason));
              throw new Error(
                "unexpected response: " + JSON.stringify(jsonData)
              );
            }

            const finish_redirect_uri =
              jsonData?.result?.data?.finish_redirect_uri;
            if (jsonData?.result?.finished) window.alert("ok");
            if (typeof finish_redirect_uri === "string") {
              window.location.href = finish_redirect_uri;
            }

            const id = jsonData?.result?.id;
            const flowRef = jsonData?.result?.flow_reference?.type;
            navigateToTOTPInput(id, flowRef);
          }
          break;
      }
    },
    [emailValue, pwdValue]
  );

  return (
    <Container component="main" maxWidth="xs">
      <Typography variant="h5" component="h5">
        Sign in with {displaySigninType} + {displaySigninMethod}
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
          <ButtonGroup
            fullWidth
            aria-label="outlined primary button group"
            sx={{ mb: 1 }}
          >
            <Button
              variant={signinType === "email" ? "contained" : "outlined"}
              onClick={() => setSigninType("email")}
            >
              Email
            </Button>
            <Button
              variant={signinType === "email" ? "outlined" : "contained"}
              onClick={() => setSigninType("phone")}
            >
              Phone
            </Button>
          </ButtonGroup>
          <ButtonGroup fullWidth aria-label="outlined primary button group">
            <Button
              variant={signinMethod === "otp" ? "outlined" : "contained"}
              onClick={() => setSigninMethod("password")}
            >
              Password
            </Button>
            <Button
              variant={signinMethod === "password" ? "outlined" : "contained"}
              onClick={() => setSigninMethod("otp")}
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
            id={signinType}
            label={signupLabel}
            name={signinType}
            autoComplete={signinType}
            autoFocus
            onChange={handleEmailChange}
          />
          {signinMethod === "password" ? (
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

export default Signin;
