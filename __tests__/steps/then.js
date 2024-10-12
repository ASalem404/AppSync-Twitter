const AWS = require("aws-sdk");
const http = require("axios");
const fs = require("fs");
const user_exists_in_UsersTable = async (id) => {
  const DynamoDB = new AWS.DynamoDB.DocumentClient();

  console.log(`looking for user [${id}] in table [${process.env.USERS_TABLE}]`);
  const resp = await DynamoDB.get({
    TableName: process.env.USERS_TABLE,
    Key: {
      id,
    },
  }).promise();

  expect(resp.Item).toBeTruthy();

  return resp.Item;
};

const user_can_upload_image_to_url = async (
  uploadUrl,
  filePath,
  contentType
) => {
  const data = fs.readFileSync(filePath);

  await http({
    method: "put",
    uploadUrl,
    Headers: {
      ContentType: contentType,
    },
    data,
  });

  console.log("Uploaded image to: ", uploadUrl);
};

const user_can_download_image_from = async (downloadUrl) => {
  const resp = await http(url);

  console.log("Image Downloaded!");

  return resp.data;
};
module.exports = {
  user_exists_in_UsersTable,
  user_can_upload_image_to_url,
  user_can_download_image_from,
};
