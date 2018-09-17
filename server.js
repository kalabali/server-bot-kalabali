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
                const details = await koa2Req(`https://kalender-bali.herokuapp.com/v1/details?bulan=${now.format('MM')}&tahun=${now.format('YYYY')}&tanggal=${now.format('DD')}`)
                const body = JSON.parse(details.body)
                var events = ""
                if(body.details.events.length > 0){
                    events = body.details.events.join()
                }
                const echo =  {
                    "type": "flex",
                    "altText": "Kalender Bali - Hari Ini",
                    "contents": {
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
                              "text": now.format('DD MMMM YYYY'),
                              "weight": "bold",
                              "size": "xl",
                              "margin": "md"
                            },
                            {
                              "type": "text",
                              "text": "Events : " + events,
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
                              "type": "text",
                              "text": "Deskripsi",
                              "size": "xs",
                              "color": "#aaaaaa",
                              "wrap": true
                            },
                                {
                                  "type": "box",
                                  "layout": "horizontal",
                                  "contents": [
                                    {
                                      "type": "text",
                                      "text": "Day",
                                      "size": "sm",
                                      "color": "#555555",
                                      "flex": 0
                                    },
                                    {
                                      "type": "text",
                                      "text": body.details.day.day_name.caka,
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
                                      "text": "Wuku",
                                      "size": "sm",
                                      "color": "#555555",
                                      "flex": 0
                                    },
                                    {
                                      "type": "text",
                                      "text": body.details.wuku,
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
                                      "text": "Sasih",
                                      "size": "sm",
                                      "color": "#555555",
                                      "flex": 0
                                    },
                                    {
                                      "type": "text",
                                      "text": body.details.sasih,
                                      "size": "sm",
                                      "color": "#111111",
                                      "align": "end"
                                    }
                                  ]
                                },
                                {
                                  "type": "separator",
                                  "margin": "xxl"
                                }
                              ]
                            },
                            {
                              "type": "box",
                              "layout": "vertical",
                              "margin": "xxl",
                              "spacing": "sm",
                              "contents": [
                                 {
                              "type": "text",
                              "text": "Wewaran",
                              "size": "xs",
                              "color": "#aaaaaa",
                              "wrap": true
                            },
                                {
                                  "type": "box",
                                  "layout": "horizontal",
                                  "contents": [
                                    {
                                      "type": "text",
                                      "text": "Ekawara",
                                      "size": "sm",
                                      "color": "#555555",
                                      "flex": 0
                                    },
                                    {
                                      "type": "text",
                                      "text": body.details.wewaran.ekawara,
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
                                      "text": "Dwiwara",
                                      "size": "sm",
                                      "color": "#555555",
                                      "flex": 0
                                    },
                                    {
                                      "type": "text",
                                      "text": body.details.wewaran.dwiwara,
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
                                      "text": "Triwara",
                                      "size": "sm",
                                      "color": "#555555",
                                      "flex": 0
                                    },
                                    {
                                      "type": "text",
                                      "text": body.details.wewaran.triwara,
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
                                      "text": "Caturwara",
                                      "size": "sm",
                                      "color": "#555555",
                                      "flex": 0
                                    },
                                    {
                                      "type": "text",
                                      "text": body.details.wewaran.caturwara,
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
                                      "text": "Pancawara",
                                      "size": "sm",
                                      "color": "#555555",
                                      "flex": 0
                                    },
                                    {
                                      "type": "text",
                                      "text": body.details.wewaran.pancawara,
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
                                      "text": "Sadwara",
                                      "size": "sm",
                                      "color": "#555555",
                                      "flex": 0
                                    },
                                    {
                                      "type": "text",
                                      "text": body.details.wewaran.sadwara,
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
                                      "text": "Saptawara",
                                      "size": "sm",
                                      "color": "#555555",
                                      "flex": 0
                                    },
                                    {
                                      "type": "text",
                                      "text": body.details.wewaran.saptawara,
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
                                      "text": "Astawara",
                                      "size": "sm",
                                      "color": "#555555",
                                      "flex": 0
                                    },
                                    {
                                      "type": "text",
                                      "text": body.details.wewaran.astawara,
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
                                      "text": "Sangawara",
                                      "size": "sm",
                                      "color": "#555555",
                                      "flex": 0
                                    },
                                    {
                                      "type": "text",
                                      "text": body.details.wewaran.sangawara,
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
                                      "text": "Dasawara",
                                      "size": "sm",
                                      "color": "#555555",
                                      "flex": 0
                                    },
                                    {
                                      "type": "text",
                                      "text": body.details.wewaran.dasawara,
                                      "size": "sm",
                                      "color": "#111111",
                                      "align": "end"
                                    }
                                  ]
                                },
                                {
                                  "type": "separator",
                                  "margin": "xxl"
                                }
                              ]
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