require("dotenv").config();
const when = require("../../steps/when");
const chance = require("chance").Chance();

const { BUCKET_NAME } = process.env;

describe("Getting a Presigned Upload Url", () => {
  it("Should return a url to be used in uploading an image.", async () => {
    const username = chance.guid();
    const extension = ".png";
    const contentType = "image/png";
    const presigndUrl = await when.when_we_invoke_getImgeUploadUrl(
      username,
      extension,
      contentType
    );

    const regex = new RegExp(
      `https://${BUCKET_NAME}.s3-accelerate.amazonaws.com/${username}/.*${
        extension || ""
      }\?.*Content-Type=${
        contentType ? contentType.replace("/", "%2F") : "image%2Fjpeg"
      }.*`
    );

    expect(presigndUrl).toMatch(regex);
  });
});
