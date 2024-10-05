require("dotenv").config();
const AWS = require("aws-sdk");

const REGION = process.env.AWS_REGION;
const COGNITO_USER_POOL_ID = process.env.COGNITO_USER_POOL_ID;
const COGNITO_CLIENT_ID = process.env.COGNITO_USER_POOL_CLIENT_ID;
const APPSYNC_API_URL = process.env.APPSYNC_API_URL;

const handler = require("../../functions/confirm-user-signup").handler;
const invoke_confirmSignup = async (username, name, email) => {
  const context = {};
  const event = {
    version: "1",
    region: REGION,
    userPoolId: COGNITO_USER_POOL_ID,
    userName: username,
    triggerSource: "PostConfirmation_ConfirmSignUp",
    request: {
      userAttributes: {
        sub: username,
        "cognito:email_alias": email,
        "cognito:user_status": "CONFIRMED",
        email_verified: "false",
        name: name,
        email: email,
      },
    },
    response: {},
  };

  await handler(event, context);
};

const a_user_signs_up = async (password, name, email) => {
  const cognito = new AWS.CognitoIdentityServiceProvider();

  const response = await cognito
    .signUp({
      ClientId: COGNITO_CLIENT_ID,
      Username: email,
      Password: password,
      UserAttributes: [{ Name: "name", Value: name }],
    })
    .promise();

  const username = response.UserSub;

  console.log(`${email} . has signud up as ${username}`);

  // Cognito send a verification code to the email to confirm
  // and we need this code to continue and add the user to the ddb
  // to skip this step, we confirm the user manually as follow.
  await cognito
    .adminConfirmSignUp({
      Username: username,
      UserPoolId: COGNITO_USER_POOL_ID,
    })
    .promise();

  return {
    username,
    name,
    email,
  };
};

module.exports = {
  invoke_confirmSignup,
  a_user_signs_up,
};
