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

    const regex = new RegExp(
      `{
\\s*"version"\\s*:\\s*"2018-05-29",\\s*
"operation"\\s*:\\s*"UpdateItem",\\s*
"key"\\s*:\\s*{\\s*"id"\\s*:\\s*{"S"\\s*:\\s*${username}}\\s*},\\s*
"update"\\s*:\\s*{\\s*
"expression"\\s*:\\s*"SET #name = :name, imageUrl = :imageUrl, bio = :bio, backgroundImageUrl = :backgroundImageUrl, #location = :location, website = :website",\\s*
"expressionNames"\\s*:\\s*{\\s*"#name"\\s*:\\s*"name",\\s*"#location"\\s*:\\s*"location"\\s*},\\s*
"expressionValues"\\s*:\\s*{\\s*
":name"\\s*:\\s*{"S"\\s*:\\s*ASA},\\s*
":imageUrl"\\s*:\\s*{"NULL"\\s*:\\s*true},\\s*
":bio"\\s*:\\s*{"S"\\s*:\\s*TEST},\\s*
":backgroundImageUrl"\\s*:\\s*{"NULL"\\s*:\\s*true},\\s*
":location"\\s*:\\s*{"NULL"\\s*:\\s*true},\\s*
":website"\\s*:\\s*{"NULL"\\s*:\\s*true}\\s*}\\s*},\\s*
"condition"\\s*:\\s*{\\s*
"expression"\\s*:\\s*"attribute_exists\\(id\\)"\\s*}\\s*}`,
      "s"
    );

    expect(result).toMatch(regex);
  });
});

// const x = {
//     version: "2018-05-29",
//     operation: "UpdateItem",
//     key: {
//         id: { S: ${username} },
//   },
//   update: {
//     expression:
//       "SET #name = :name, imageUrl = :imageUrl, bio = :bio, backgroundImageUrl = :backgroundImageUrl, #location = :location, website = :website ",
//     expressionNames: {
//       "#name": "name",
//       "#location": "location",
//     },
//     expressionValues: {
//       ":name": {S: ASA},
//       ":imageUrl":{NULL: true},
//       ":bio": {S: TEST},
//       ":backgroundImageUrl":{NULL: true},
//       ":location": {NULL: true},
//       ":website": {NULL: true},
//     },
//   },
//   condition: {
//     expression: "attribute_exists(id)",
//   },
// };
