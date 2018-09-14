const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const Router = require('koa-router')()
const Line = require('@line/bot-sdk')
const calendar = require('./service/calendar')
require('dotenv').config()
const app = new Koa()
app.use(bodyParser())
const config = {
    channelAccessToken : process.env.channelAccessToken || "",
    channelSecret : process.env.channelSecret || "" 
}

const client = new Line.Client(config)

Router.get('/calendar', async(ctx) => {
    await calendar(12,12,12).then((res) => {
        ctx.body = res
    })
})

Router.post('/callback', async(ctx) => {
    Promise
    .all(ctx.request.body.events.map(handleEvent))
    .then((result) => {
        ctx.status = 200
        ctx.body = result
    })
    .catch((err) => {
      console.error(err);
      ctx.status = 500;
    });
    
    console.log(ctx.request.body)
    console.log(ctx.request.rawBody)
})

// event handler
function handleEvent(event) {
    if (event.type !== 'message' || event.message.type !== 'text') {
      // ignore non-text-message event
      return Promise.resolve(null);
    }

    if(event.message.text == 'hari ini') {
        calendar(12,12,12).then((res) => {
            return client.replyMessage(event.replyToken, res.details.sasih);
        })
    }
  
    // create a echoing text message
    const echo = { type: 'text', text: event.message.text };
  
    // use reply API
    return client.replyMessage(event.replyToken, echo);
  }

//app.use(Line.middleware(config))
app.use(Router.routes())

app.listen(process.env.PORT || 3000)