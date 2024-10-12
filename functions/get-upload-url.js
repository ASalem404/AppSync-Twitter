const S3 = require("aws-sdk/clients/s3");
const s3 = new S3({ useAccelerateEndpoint: true });
const ulid = require("ulid");

const { BUCKET_NAME } = process.env;

module.exports.handler = async (event) => {
  const id = ulid.ulid();

  let key = `${event.identity.username}/${id}`;
  const extension = event.arguments.extension;

  if (extension) {
    key = extension.startsWith(".")
      ? (key += extension)
      : (key += `.${extension}`);
  }

  const contentType = event.arguments.contentType || "image/jpeg";

  console.log(event.arguments.contentType);
  if (!contentType.startsWith("image"))
    throw new Error("Content Type should be an image.");

  const params = {
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: contentType,
    ACL: "public-read",
  };

  const signedUrl = s3.getSignedUrl("putObject", params);

  return signedUrl;
};
