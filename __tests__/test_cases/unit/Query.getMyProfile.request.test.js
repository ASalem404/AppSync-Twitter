const given = require("../../steps/given");
const when = require("../../steps/when");
const chance = require("chance").Chance();
const path = require("path");

describe("Query.getMyProfile.request template", () => {
  it("Should use username as 'id'", () => {
    const templatePath = path.resolve(
      __dirname,
      "../../../mapping-templates/Query.getMyProfile.request.vtl"
    );

    const username = chance.guid();
    const context = given.an_appsync_context({ username }, {});
    const result = when.we_invoke_an_appsync_template(templatePath, context);

    const regex = new RegExp(
      `"version"\\s*:\\s*"2018-05-29".*"operation"\\s*:\\s*"GetItem".*"key"\\s*:\\s*{[^}]*"id"\\s*:\\s*{"S":"${username}"}`,
      "s"
    );

    expect(result).toMatch(regex);
  });
});
