const Line = require('@line/bot-sdk')
require('dotenv').config()

const config = {
    channelAccessToken : process.env.channelAccessToken || "",
    channelSecret : process.env.channelSecret || "" 
}
const client = new Line.Client(config);
export default client;