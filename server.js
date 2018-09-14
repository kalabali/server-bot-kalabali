const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const Router = require('koa-router')()
const Line = require('@line/bot-sdk')

const app = new Koa()
const config = {
    channelAccessToken : process.env.channelAccessToken || "",
    channelSecret : process.env.channelSecret || "" 
}

const client = new Line.Client(config)

Router.post('/callback', async(ctx) => {

    // Promise
    // .all(ctx.request.body.events.map(handleEvent))
    // .then((result) => ctx.body = result)
    // .catch((err) => {
    //   console.error(err);
    //   ctx.status = 500;
    // });
    
    console.log(ctx.request.body)
    console.log(ctx.request.rawBody)
})

// event handler
function handleEvent(event) {
    if (event.type !== 'message' || event.message.type !== 'text') {
      // ignore non-text-message event
      return Promise.resolve(null);
    }
  
    // create a echoing text message
    const echo = { type: 'text', text: event.message.text };
  
    // use reply API
    return client.replyMessage(event.replyToken, echo);
  }

//app.use(Line.middleware(config))
app.use(Router.routes())
app.use(bodyParser())
app.listen(process.env.PORT || 3000)