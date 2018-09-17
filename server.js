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
                        "type": "bubble",
                        "styles": {
                          "footer": {
                            "separator": true
                          }
                        },
                        "body": {
                          "type": "box",
                          "layout": "vertical",
                          "contents": [
                            {
                              "type": "text",
                              "text": "Kalender Bali",
                              "weight": "bold",
                              "color": "#1DB446",
                              "size": "sm"
                            },
                            {
                              "type": "text",
                              "text": "17 September 2018",
                              "weight": "bold",
                              "size": "xl",
                              "margin": "md"
                            },
                            {
                              "type": "text",
                              "text": "Events : Tilem",
                              "size": "xs",
                              "color": "#aaaaaa",
                              "wrap": true
                            },
                            {
                              "type": "separator",
                              "margin": "xxl"
                            },
                            {
                              "type": "box",
                              "layout": "vertical",
                              "margin": "xxl",
                              "spacing": "sm",
                              "contents": [
                                {
                                  "type": "box",
                                  "layout": "horizontal",
                                  "contents": [
                                    {
                                      "type": "text",
                                      "text": "Energy Drink",
                                      "size": "sm",
                                      "color": "#555555",
                                      "flex": 0
                                    },
                                    {
                                      "type": "text",
                                      "text": "$2.99",
                                      "size": "sm",
                                      "color": "#111111",
                                      "align": "end"
                                    }
                                  ]
                                },
                                {
                                  "type": "box",
                                  "layout": "horizontal",
                                  "contents": [
                                    {
                                      "type": "text",
                                      "text": "Chewing Gum",
                                      "size": "sm",
                                      "color": "#555555",
                                      "flex": 0
                                    },
                                    {
                                      "type": "text",
                                      "text": "$0.99",
                                      "size": "sm",
                                      "color": "#111111",
                                      "align": "end"
                                    }
                                  ]
                                },
                                {
                                  "type": "box",
                                  "layout": "horizontal",
                                  "contents": [
                                    {
                                      "type": "text",
                                      "text": "Bottled Water",
                                      "size": "sm",
                                      "color": "#555555",
                                      "flex": 0
                                    },
                                    {
                                      "type": "text",
                                      "text": "$3.33",
                                      "size": "sm",
                                      "color": "#111111",
                                      "align": "end"
                                    }
                                  ]
                                },
                                {
                                  "type": "separator",
                                  "margin": "xxl"
                                },
                                {
                                  "type": "box",
                                  "layout": "horizontal",
                                  "margin": "xxl",
                                  "contents": [
                                    {
                                      "type": "text",
                                      "text": "ITEMS",
                                      "size": "sm",
                                      "color": "#555555"
                                    },
                                    {
                                      "type": "text",
                                      "text": "3",
                                      "size": "sm",
                                      "color": "#111111",
                                      "align": "end"
                                    }
                                  ]
                                },
                                {
                                  "type": "box",
                                  "layout": "horizontal",
                                  "contents": [
                                    {
                                      "type": "text",
                                      "text": "TOTAL",
                                      "size": "sm",
                                      "color": "#555555"
                                    },
                                    {
                                      "type": "text",
                                      "text": "$7.31",
                                      "size": "sm",
                                      "color": "#111111",
                                      "align": "end"
                                    }
                                  ]
                                },
                                {
                                  "type": "box",
                                  "layout": "horizontal",
                                  "contents": [
                                    {
                                      "type": "text",
                                      "text": "CASH",
                                      "size": "sm",
                                      "color": "#555555"
                                    },
                                    {
                                      "type": "text",
                                      "text": "$8.0",
                                      "size": "sm",
                                      "color": "#111111",
                                      "align": "end"
                                    }
                                  ]
                                },
                                {
                                  "type": "box",
                                  "layout": "horizontal",
                                  "contents": [
                                    {
                                      "type": "text",
                                      "text": "CHANGE",
                                      "size": "sm",
                                      "color": "#555555"
                                    },
                                    {
                                      "type": "text",
                                      "text": "$0.69",
                                      "size": "sm",
                                      "color": "#111111",
                                      "align": "end"
                                    }
                                  ]
                                }
                              ]
                            },
                            {
                              "type": "separator",
                              "margin": "xxl"
                            }
                          ]
                        }
                      }
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