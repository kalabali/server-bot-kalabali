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
    ctx.body = "Callback"
    console.log('oke')
})

app.use(Line.middleware(config))
app.use(Router.routes())
app.use(bodyParser())
app.listen(process.env.PORT || 3000)