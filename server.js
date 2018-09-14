const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const Router = require('koa-router')()

const app = new Koa()

Router.post('/callback', async(ctx) => {
    ctx.body = "Callback"
    console.log('oke')
})

app.use(Router.routes())
app.use(bodyParser())
app.listen(3000)