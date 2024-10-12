require("dotenv").config();
const fs = require("fs");
const velocityMapper = require("amplify-appsync-simulator/lib/velocity/value-mapper/mapper");
const velocityTemplate = require("amplify-velocity-template");
const AWS = require("aws-sdk");
const { GraphQL } = require("../lib/graphql");

const REGION = process.env.AWS_REGION;
const COGNITO_USER_POOL_ID = process.env.COGNITO_USER_POOL_ID;
const COGNITO_CLIENT_ID = process.env.COGNITO_USER_POOL_CLIENT_ID;
const APPSYNC_API_URL = process.env.APPSYNC_API_URL;

const when_we_invoke_getImgeUploadUrl = async (
  username,
  extension,
  contentType
) => {
  const handler = require("../../functions/get-upload-url").handler;

  const context = {};
  const event = {
    identity: {
      username,
    },
    arguments: {
      extension,
      contentType,
    },
  };

  return await handler(event, context);
};

const invoke_confirmSignup = async (username, name, email) => {
  const handler = require("../../functions/confirm-user-signup").handler;
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

const we_invoke_an_appsync_template = (templatePath, context) => {
  const template = fs.readFileSync(templatePath, { encoding: "utf-8" });
  const ast = velocityTemplate.parse(template);
  const compiler = new velocityTemplate.Compile(ast, {
    valueMapper: velocityMapper.map,
    escape: false,
  });
  return compiler.render(context);
};
const a_user_calls_getMyProfile = async (user) => {
  const getMyProfile = `query getMyProfile {
    getMyProfile {
      ... myProfileFields

      tweets {
        nextToken
        tweets {
          ... iTweetFields
        }
      }
    }
  }`;

  const data = await GraphQL(
    process.env.APPSYNC_API_URL,
    getMyProfile,
    {},
    user.accessToken
  );
  const profile = data.getMyProfile;

  console.log(`[${user.username}] - fetched profile`);

  return profile;
};
const a_user_calls_editMyProfile = async (user, input) => {
  const editMyProfile = `mutation editProfile($input: ProfileInput!) {
    editProfile(newProfile: $input) {
    id
    likesCount
    bio
    backgroundImageUrl
    birthDate
    createdAt
    followersCount
    imageUrl
    location
    name
    screenName
    tweetsCount
    website
    followingCount
    }
  }`;

  const variables = { input };

  const data = await GraphQL(
    APPSYNC_API_URL,
    editMyProfile,
    variables,
    user.accessToken
  );
  const profile = data.editProfile;

  console.log(`[${user.username}] - update his profile`);

  return profile;
};

const a_user_calls_getAnUploadUrl = async (user, extension, contentType) => {
  const getImageUploadUrl = `query getImageUploadUrl($extension: String, $contentType: String) {
    getImageUploadUrl(extension: $extension, contentType: $contentType) `;

  const variables = { extension, contentType };

  const data = await GraphQL(
    APPSYNC_API_URL,
    getImageUploadUrl,
    variables,
    user.accessToken
  );
  const url = data.getImageUploadUrl;

  console.log(`[${user.username}] - got an image upload url!`);

  return url;
};

module.exports = {
  invoke_confirmSignup,
  a_user_signs_up,
  when_we_invoke_getImgeUploadUrl,
  we_invoke_an_appsync_template,
  a_user_calls_getMyProfile,
  a_user_calls_editMyProfile,
  a_user_calls_getAnUploadUrl,
};
