const Chance = require("chance");
const given = require("../../steps/given");
const when = require("../../steps/when");

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

  it("Should return the new profile when call editMyProfile Query.", async () => {
    const newName = Chance().first();
    const input = {
      name: newName,
    };
    const newProfile = await when.a_user_calls_editMyProfile(user, input);

    expect(newProfile).toMatchObject({ ...profile, name: newName });
  });
});
