import React, { useState, useEffect } from "react";
import "./App.css";
import EmailAndPwdLoginScreen from "./EmailAndPwdLogin";
import EmailAndOTPLogin from "./EmailAndOTPLogin";
import OTPInput from "./OTPInput";
import Signup from "./Signup";
import Signin from "./Signin";

export interface ScreenComponent {
  name: string;
  flowId?: string;
  flowRef?: string;
  option?: string;
}

const App: React.FC = () => {
  const [screenStack, setScreenStack] = useState<ScreenComponent[]>([]);
  const [currentScreen, setCurrentScreen] = useState<ScreenComponent>({
    name: "Login",
  });

  useEffect(() => {
    window.onpopstate = (event: PopStateEvent) => {
      if (event.state) {
        setCurrentScreen(event.state.screen);
      }
    };
  }, []);

  const navigateToScreen = (screen: ScreenComponent) => {
    if (screen !== currentScreen) {
      setScreenStack((prevStack) => [...prevStack, currentScreen]);
      setCurrentScreen(screen);
    }
  };

  console.log("screen", currentScreen);

  const navigateBack = () => {
    if (screenStack.length > 0) {
      const previousScreen = screenStack.pop();
      setCurrentScreen(previousScreen || { name: "Login" });
    }
  };

  const renderCurrentScreen = () => {
    switch (currentScreen.name) {
      case "EmailAndPwdLogin":
        return (
          <EmailAndPwdLoginScreen
            navigateToScreen={navigateToScreen}
            navigateBack={navigateBack}
            currentScreen={currentScreen}
            accountMethod="Email"
            loginMethod="password"
          />
        );
      case "EmailAndOTPLogin":
        return (
          <EmailAndOTPLogin
            navigateToScreen={navigateToScreen}
            navigateBack={navigateBack}
            currentScreen={currentScreen}
          />
        );
      case "Login":
        return (
          <Signin
            navigateToScreen={navigateToScreen}
            navigateBack={navigateBack}
            currentScreen={currentScreen}
          />
        );
      case "OTPInput":
      case "Authenticate":
        return (
          <OTPInput
            navigateToScreen={navigateToScreen}
            navigateBack={navigateBack}
            currentScreen={currentScreen}
            flowRef={currentScreen.flowRef}
          />
        );
      case "Signup":
        return (
          <Signup
            navigateToScreen={navigateToScreen}
            navigateBack={navigateBack}
            currentScreen={currentScreen}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div>
      {/* <h1>Authgear test</h1> */}
      {renderCurrentScreen()}
    </div>
  );
};

export default App;
