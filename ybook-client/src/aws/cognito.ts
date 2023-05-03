import { userPool } from "./userPool";
import * as AmazonCognitoIdentity from "amazon-cognito-identity-js";

export function login({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<string> {
  const authenticationData = {
    Username: email,
    Password: password,
  };
  const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
    authenticationData
  );
  const userData = {
    Username: email,
    Pool: userPool,
  };
  const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
  return new Promise((res, rej) => {
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess(session, userConfirmationNecessary) {
        if (userConfirmationNecessary) {
          rej(new Error("User is not confirmed"));
        }
        const token = session.getIdToken().getJwtToken();
        res(token);
      },
      onFailure(err) {
        rej(err);
      },
    });
  });
}

export function logout() {
  const cognitoUser = userPool.getCurrentUser();
  if (cognitoUser === null) {
    return;
  }
  cognitoUser.signOut();
}

export async function register({
  name,
  surname,
  email,
  password,
}: {
  name: string;
  surname: string;
  email: string;
  password: string;
}) {
  const attributeList = [
    new AmazonCognitoIdentity.CognitoUserAttribute({
      Name: "name",
      Value: name,
    }),
    new AmazonCognitoIdentity.CognitoUserAttribute({
      Name: "given_name",
      Value: surname,
    }),
    new AmazonCognitoIdentity.CognitoUserAttribute({
      Name: "email",
      Value: email,
    }),
  ];
  await new Promise<AmazonCognitoIdentity.ISignUpResult>((res, rej) => {
    userPool.signUp(email, password, attributeList, [], (err, data) => {
      if (err || data === undefined) {
        rej(err);
      } else {
        res(data);
      }
    });
  });
  return email;
}

export async function verifyEmail({
  email,
  code,
}: {
  email: string;
  code: string;
}) {
  const userData = {
    Username: email,
    Pool: userPool,
  };
  const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
  return new Promise<unknown>((res, rej) => {
    cognitoUser.confirmRegistration(code, true, (err, result) => {
      if (err) {
        rej(err);
      } else {
        res(result);
      }
    });
  });
}

export async function requestVerificationCode({ email }: { email: string }) {
  const cognitoUser = new AmazonCognitoIdentity.CognitoUser({
    Username: email,
    Pool: userPool,
  });
  return new Promise((res, rej) => {
    cognitoUser.forgotPassword({
      onSuccess(data) {
        res(data);
      },
      onFailure(err) {
        rej(err);
      },
    });
  });
}

export async function updatePassword({
  email,
  code,
  newPassword,
}: {
  email: string;
  code: string;
  newPassword: string;
}) {
  const cognitoUser = new AmazonCognitoIdentity.CognitoUser({
    Username: email,
    Pool: userPool,
  });
  return new Promise((res, rej) => {
    cognitoUser.confirmPassword(code, newPassword, {
      onSuccess() {
        res(undefined);
      },
      onFailure(err) {
        rej(err);
      },
    });
  });
}

export async function refreshSession() {
  const cognitoUser = userPool.getCurrentUser();
  if (cognitoUser === null) {
    return;
  }
  const session = await new Promise<AmazonCognitoIdentity.CognitoUserSession>(
    (res, rej) => {
      cognitoUser.getSession(
        (
          err: Error | null,
          session: AmazonCognitoIdentity.CognitoUserSession | null
        ) => {
          if (session === null) {
            rej(err);
          } else {
            res(session);
          }
        }
      );
    }
  );
  const refresh_token = session.getRefreshToken();
  return new Promise<AmazonCognitoIdentity.CognitoUserSession | undefined>(
    (res, rej) => {
      cognitoUser.refreshSession(
        refresh_token,
        (err, session: AmazonCognitoIdentity.CognitoUserSession) => {
          if (err) {
            res(undefined);
          } else {
            res(session);
          }
        }
      );
    }
  );
}
