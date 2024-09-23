const velocityUtil = require("amplify-appsync-simulator/lib/velocity/util");
const chance = require("chance").Chance();

const a_random_user = () => {
  const firstName = chance.first({ nationality: "en" });
  const lastName = chance.first({ nationality: "en" });
  const suffix = chance.string({
    pool: "abcdefghijklmnopqrstuvwxyz",
    length: 4,
  });

  const name = firstName + " " + lastName + " " + suffix;
  const password = chance.string({ length: 8 });
  const email = `${firstName}.${lastName}.${suffix}@appsyncbackend.com`;

  return { name, email, password };
};

const an_appsync_context = (identity, args, result, source, info, prev) => {
  const util = velocityUtil.create([], new Date(), Object());
  const context = {
    identity,
    args,
    arguments: args,
    result,
    source,
    info,
    prev,
  };
  return {
    context,
    ctx: context,
    util,
    utils: util,
  };
};

module.exports = {
  a_random_user,
  an_appsync_context,
};
