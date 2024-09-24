require("dotenv").config();
const AWS = require("aws-sdk");

const COGNITO_USER_POOL_ID = process.env.COGNITO_USER_POOL_ID;
const COGNITO_CLIENT_ID = process.env.COGNITO_USER_POOL_CLIENT_ID;

const chance = require("chance").Chance();
const a_random_user = () => {
  const firstName = chance.first({ nationality: "en" });
  const lastName = chance.first({ nationality: "en" });
  const suffix = chance.string({
    pool: "abcdefghijklmnopqrstuvwxyz",
    length: 4,
  });

  const name = firstName + " " + lastName + " " + suffix;
  const password = chance.string({ length: 8 });
  const email = `${firstName}.${lastName}.${suffix}@appsyncbackend.com`;

  return { name, email, password };
};

const an_authanticated_user = async () => {
  const { name, email, password } = a_random_user();
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

  const auth = await cognito
    .initiateAuth({
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: COGNITO_CLIENT_ID,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
      },
    })
    .promise();

  console.log(`${email} - has signd in.`);
  return {
    username,
    name,
    email,
    idToken: auth.AuthenticationResult.IdToken,
    accessToken: auth.AuthenticationResult.AccessToken,
  };
};
module.exports = {
  a_random_user,
  an_authanticated_user,
};
