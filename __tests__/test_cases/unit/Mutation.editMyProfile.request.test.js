const given = require("../../steps/given");
const when = require("../../steps/when");
const chance = require("chance").Chance();
const path = require("path");

describe("Mutation.editMyProfile.request template", () => {
  it("Should use 'newProfile' fields in expression values.", () => {
    const templatePath = path.resolve(
      __dirname,
      "../../../mapping-templates/Mutation.editMyProfile.request.vtl"
    );

    const username = chance.guid();
    const newProfile = {
      name: "ASA",
      imageUrl: null,
      backgroundImageUrl: null,
      bio: "TEST",
      location: null,
      website: null,
      birthdate: null,
    };
    const context = given.an_appsync_context({ username }, { newProfile });
    const result = when.we_invoke_an_appsync_template(templatePath, context);

    const regex =
      /"name"\s*:\s*{\s*"S"\s*:\s*"ASA"\s*}.*"bio"\s*:\s*{\s*"S"\s*:\s*"TEST"\s*}/s;

    // expect(result).toMatch(regex);
  });
});
