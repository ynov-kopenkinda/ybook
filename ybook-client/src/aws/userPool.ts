import * as AmazonCognitoIdentity from "amazon-cognito-identity-js";
import { env } from "../env";

export const userPool = new AmazonCognitoIdentity.CognitoUserPool({
  ClientId: env.REACT_APP_COGNITO_CLIENT_ID,
  UserPoolId: env.REACT_APP_COGNITO_USERPOOL_ID,
});
