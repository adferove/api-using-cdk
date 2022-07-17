const AWS = require("aws-sdk");

exports.handler = async function (event) {
  console.log("Adriancho");
  const item = {
    id: Date.now().toString(),
  };
  const savedItem = await saveItem(item);
  return sendRespose(200, JSON.stringify({ message: "Its working" }));
};

const sendRespose = (status, body) => {
  const response = {
    statusCode: status,
    headers: {
      "Content-type": "application/json",
    },
    body,
  };
  return response;
};

async function saveItem(item) {
  const dynamo = new AWS.DynamoDB.DocumentClient();
  const params = {
    TableName: process.env.MY_DYNAMO_TABLE,
    Item: item,
  };
  return dynamo.put(params).promise().then(() => item);
}
