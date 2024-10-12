const dynamodb = require("aws-sdk/clients/dynamodb");
const ulid = require("ulid");
const { TweetTypes } = require("../lib/constants");
const { TWEETS_TABLE, TIMELINES_TABLE, USERS_TABLE } = process.env;

const dynamoClient = new dynamodb.DocumentClient();

module.exports.handler = async (event) => {
  const { username } = event.identity;
  const { text } = event.arguments;
  const id = ulid.ulid();
  const timestamp = new Date().toJSON();

  const tweetItem = {
    __typename: TweetTypes.TWEET,
    id,
    text,
    createdAt: timestamp,
    creator: username,
    likes: 0,
    replies: 0,
    retweets: 0,
  };

  await dynamoClient
    .transactWrite({
      TransactItems: [
        {
          Put: {
            TableName: TWEETS_TABLE,
            Item: tweetItem,
          },
        },
        {
          Put: {
            TableName: TIMELINES_TABLE,
            Item: {
              userId: username,
              tweetId: id,
              timestamp,
            },
          },
        },
        {
          Update: {
            TableName: USERS_TABLE,
            Key: { id: username },
            UpdateExpression: "ADD tweetsCount :one",
            ExpressionAttributeValues: {
              ":one": 1,
            },
            ConditionExpression: "attribute_exists(id)",
          },
        },
      ],
    })
    .promise();

  return tweetItem;
};
