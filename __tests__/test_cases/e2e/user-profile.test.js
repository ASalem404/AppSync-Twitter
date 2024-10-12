require("dotenv").config();
const path = require("path");
const Chance = require("chance");
const given = require("../../steps/given");
const when = require("../../steps/when");
const then = require("../../steps/then");

const { BUCKET_NAME } = process.env;

describe("Test an Authanticated user interactions with his profile.", () => {
  let user, profile;

  beforeAll(async () => {
    user = await given.an_authanticated_user();
  });

  it("Should return the user profile when fetch getMyProfile Query.", async () => {
    profile = await when.a_user_calls_getMyProfile(user);

    expect(profile).toMatchObject({
      id: user.username,
      name: user.name,
      imageUrl: null,
      backgroundImageUrl: null,
      bio: null,
      location: null,
      website: null,
      birthDate: null,
      createdAt: expect.stringMatching(
        /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d(?:\.\d+)?Z?/g
      ),
      followersCount: 0,
      followingCount: 0,
      tweetsCount: 0,
      likesCount: 0,
    });

    const [firstName, lastName] = profile.name.split(" ");
    expect(profile.screenName).toContain(firstName);
    expect(profile.screenName).toContain(lastName);
  });

  it("Should get an upload url to upload his profile image", async () => {
    const extension = ".png",
      contentType = "image/png";
    const uploadUrl = await when.a_user_calls_getAnUploadUrl(
      user,
      extension,
      contentType
    );

    const regex = new RegExp(
      `https://${BUCKET_NAME}.s3-accelerate.amazonaws.com/${user.username}/.*${
        extension || ""
      }\?.*Content-Type=${
        contentType ? contentType.replace("/", "%2F") : "image%2Fjpeg"
      }.*`
    );

    expect(uploadUrl).toMatch(regex);

    const filePath = path.join(__dirname, "../../data/image.png");
    await then.user_can_upload_image_to_url(uploadUrl, filePath, "image/png");

    const downloadUrl = uploadUrl.split("?")[0];
    await then.user_can_download_image_from(downloadUrl);
  });

  it("Should return the new profile when call editMyProfile Query.", async () => {
    const newName = Chance().first();
    const input = {
      name: newName,
    };
    const newProfile = await when.a_user_calls_editMyProfile(user, input);

    expect(newProfile).toMatchObject({ ...profile, name: newName });
  });
});
