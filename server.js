const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const Router = require('koa-router')()
const Line = require('@line/bot-sdk')
const calendar = require('./service/calendar')
var koa2Req = require('koa2-request');
require('dotenv').config()
const app = new Koa()
app.use(bodyParser())
const request = require('request')
var moment = require('moment-timezone');

const config = {
    channelAccessToken : process.env.channelAccessToken || "",
    channelSecret : process.env.channelSecret || "" 
}

const client = new Line.Client(config)

Router.get('/calendar', async(ctx) => {
    //ctx.body = "a"
    //const a =  await koa2Req(`https://kalender-bali.herokuapp.com/v1/details?bulan=9&tahun=2018&tanggal=14`)
    const b = await moment().tz("Asia/Makassar");
    ctx.body = b.format('DD')
})

Router.post('/callback', async(ctx) => {
    const results = await Promise.all(
        ctx.request.body.events.map(async e => {
            //if(e.message.text == 'hari ini'){
                const now = await moment().tz("Asia/Makassar");
                console.log(`https://kalender-bali.herokuapp.com/v1/details?bulan=${now.format('MM')}&tahun=${now.format('YYYY')}&tanggal=${now.format('DD')}`)
                //const details = await koa2Req(`https://kalender-bali.herokuapp.com/v1/details?bulan=${now.format('MM')}&tahun=${now.format('YYYY')}&tanggal=${now.format('DD')}`)
                //console.log(details)
                //const body = JSON.parse(details.body)
                const echo = {
                    type: 'template',
                    altText: 'Confirm alt text',
                    template: {
                      type: 'confirm',
                      text: 'Do it?',
                      actions: [
                        { label: 'Yes', type: 'message', text: 'Yes!' },
                        { label: 'No', type: 'message', text: 'No!' },
                      ],
                    },
                  }
                ctx.body = echo;
                return client.replyMessage(e.replyToken, echo);

            //}
        })
    )
    //ctx.body = await Promise.all(results.map(result => result.json()))
})

// event handler
function handleEvent(event) {
    if (event.type !== 'message' || event.message.type !== 'text') {
      // ignore non-text-message event
      return Promise.resolve(null);
    }

    if(event.message.text == 'hari ini') {
        const details = request.get(`https://kalender-bali.herokuapp.com/v1/details?bulan=9&tahun=2018&tanggal=14`)
        const echo = { type: 'text', text: details.body.details.sasih }
        return client.replyMessage(event.replyToken, echo);
    }
  
    // // create a echoing text message
    // const echo = { type: 'text', text: event.message.text };
  
    // // use reply API
    // return client.replyMessage(event.replyToken, echo);
  }

//app.use(Line.middleware(config))
app.use(Router.routes())

app.listen(process.env.PORT || 3000)