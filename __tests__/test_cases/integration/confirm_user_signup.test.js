const given = require("../../steps/given");
const when = require("../../steps/when");
const then = require("../../steps/then");
const chance = require("chance").Chance();
describe("When ConfirmSignupUser runs", () => {
  it("Should save the user information in the dynamoDB table", async () => {
    const { email, name } = given.a_random_user();
    const username = chance.guid();

    await when.invoke_confirmSignup(username, name, email);

    const ddbUser = await then.user_exists_in_UsersTable(username);
    expect(ddbUser).toMatchObject({
      id: username,
      name,
      createdAt: expect.stringMatching(
        /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d(?:\.\d+)?Z?/g
      ),
      followersCount: 0,
      followingCount: 0,
      tweetsCount: 0,
      likesCount: 0,
    });

    const [firstName, lastName] = name.split(" ");
    expect(ddbUser.screenName).toContain(firstName);
    expect(ddbUser.screenName).toContain(lastName);
  });
});
