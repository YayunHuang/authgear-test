export const signinWithEmailAndOTP = async (
  query: string,
  emailValue: string
) => {
  const resp = await fetch(
    `https://cube-crisp-110.authgear-staging.com/api/v1/authentication_flows${query}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bind_user_agent: false,
        flow_reference: {
          type: "login_flow",
          id: "default",
        },
        batch_input: [
          {
            identification: "email",
            login_id: emailValue,
          },
          {
            authentication: "primary_oob_otp_email",
            index: 1,
          },
        ],
      }),
    }
  );

  const jsonData = await resp.json();
  return jsonData;
};

export const signinWithEmailAndPassword = async (
  query: string,
  emailValue: string,
  pwdValue: string
) => {
  const resp = await fetch(
    `https://cube-crisp-110.authgear-staging.com/api/v1/authentication_flows${query}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bind_user_agent: false,
        flow_reference: {
          type: "login_flow",
          id: "default",
        },
        batch_input: [
          {
            identification: "email",
            login_id: emailValue,
          },
          {
            authentication: "primary_password",
            password: pwdValue,
          },
        ],
      }),
    }
  );

  const jsonData = await resp.json();
  return jsonData;
};

export const submitOTPSignin = async (OTPValue: string, flowId: string) => {
  const resp = await fetch(
    `https://cube-crisp-110.authgear-staging.com/api/v1/authentication_flows/${flowId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: {
          code: OTPValue,
        },
      }),
    }
  );

  const jsonData = await resp.json();
  return jsonData;
};

export const resendOTP = async (flowId: string) => {
  const resp = await fetch(
    `https://cube-crisp-110.authgear-staging.com/api/v1/authentication_flows/${flowId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: {
          resend: true,
        },
      }),
    }
  );

  const jsonData = await resp.json();
  return jsonData;
};

export const signupWithEmail = async (
  query: string,
  emailValue: string,
  authenticationMethod: string,
  pwdValue?: string,
) => {
  const batchInput =
    authenticationMethod === "primary_password"
      ? [
          {
            identification: "email",
            login_id: emailValue,
          },
          {
            authentication: authenticationMethod,
            new_password: pwdValue,
          },
        ]
      : [
          {
            identification: "email",
            login_id: emailValue,
          },
          {
            authentication: authenticationMethod,
          },
        ];
  const resp = await fetch(
    `https://cube-crisp-110.authgear-staging.com/api/v1/authentication_flows${query}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bind_user_agent: false,
        flow_reference: {
          type: "signup_flow",
          id: "default",
        },
        batch_input: batchInput
      }),
    }
  );

  const jsonData = await resp.json();
  return jsonData;
};

export const signupWithPhone = async (
  query: string,
  phoneValue: string,
  authenticationMethod: string,
  pwdValue: string,
) => {
  const batchInput =
    authenticationMethod === "primary_password"
      ? [
          {
            identification: "phone",
            login_id: phoneValue,
          },
          {
            authentication: authenticationMethod,
            new_password: pwdValue,
          },
        ]
      : [
          {
            identification: "phone",
            login_id: phoneValue,
          },
          {
            authentication: authenticationMethod,
          },
          {
            channel: "sms",
          },
        ];
  const resp = await fetch(
    `https://cube-crisp-110.authgear-staging.com/api/v1/authentication_flows${query}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bind_user_agent: false,
        flow_reference: {
          type: "signup_flow",
          id: "default",
        },
        batch_input: batchInput
      }),
    }
  );

  const jsonData = await resp.json();
  return jsonData;
};


export const signupWithOTP = async (OTPValue: string, flowId: string) => {
  const resp = await fetch(
    `https://cube-crisp-110.authgear-staging.com/api/v1/authentication_flows/${flowId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bind_user_agent: false,
        batch_input: [
          {
            code: OTPValue,
          },
        ],
      }),
    }
  );
  const jsonData = await resp.json();
  return jsonData;
};


export const otpAuthentication = async (flowId: string) => {
  const resp = await fetch(
    `https://cube-crisp-110.authgear-staging.com/api/v1/authentication_flows/${flowId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bind_user_agent: false,
        batch_input: [
          {
            authentication: "primary_oob_otp_email",
          },
        ],
      }),
    }
  );

  const jsonData = await resp.json();
  return jsonData;
};

export const signinWithPhoneAndOTP = async (
  query: string,
  phoneValue: string
) => {
  const resp = await fetch(
    `https://cube-crisp-110.authgear-staging.com/api/v1/authentication_flows${query}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bind_user_agent: false,
        flow_reference: {
          type: "login_flow",
          id: "default",
        },
        batch_input: [
          {
            identification: "phone",
            login_id: phoneValue,
          },
          {
            authentication: "primary_oob_otp_sms",
          },
          {
            channel: "sms",
          },
        ],
      }),
    }
  );

  const jsonData = await resp.json();
  return jsonData;
};

export const signinWithPhoneAndPassword = async (
  query: string,
  phoneValue: string,
  pwdValue: string
) => {
  const resp = await fetch(
    `https://cube-crisp-110.authgear-staging.com/api/v1/authentication_flows${query}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bind_user_agent: false,
        flow_reference: {
          type: "login_flow",
          id: "default",
        },
        batch_input: [
          {
            identification: "phone",
            login_id: phoneValue,
          },
          {
            authentication: "primary_password",
            password: pwdValue,
          },
        ],
      }),
    }
  );

  const jsonData = await resp.json();
  return jsonData;
};

