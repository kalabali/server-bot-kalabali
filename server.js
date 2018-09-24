const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const Router = require('koa-router')()
const Line = require('@line/bot-sdk')
const calendar = require('./service/calendar')
const memCache = require('memory-cache');
require('dotenv').config()
const app = new Koa()
app.use(bodyParser())

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
            console.log({
                events: e
            })
            if(e.type == 'postback') {
               if(e.postback.data == 'DATE'){
                 console.log(e.postback.params.date)
                 let date = moment(e.postback.params.date)
                 const echo = await calendar(date);
                 ctx.body = echo;
                 return client.replyMessage(e.replyToken, echo);
               }
            } else if(e.type == 'message'){
                //checking interaction
                if(e.message.text == "#penanggal"){
                    let replies = [];
                    replies.push({
                        type: "text",
                        text: "Penanggal adalah menu untuk mengetahui informasi lebih lanjut pada tanggal tertentu seperti, event, wuku, sasih, dll. Ayo mulai cari tahu informasi yang kamu inginkan mulai dari hari ini atau langsung ke tanggal yang ingin kamu kepoin."
                    })
                    replies.push({
                        type: 'template',
                        altText: "Detail Hari",
                        template: {
                            type: "buttons",
                            text: "Kakak mau kepoin yang mana?",
                            actions: [
                                {
                                    type: "message",
                                    label: "Hari ini",
                                    text: "hari ini"
                                },
                                {  
                                    "type":"datetimepicker",
                                    "label":"Pilih Tanggal",
                                    "data":"DATE",
                                    "mode":"date"
                                 }
                            ]
                        }                    
                    })                   
                    return client.replyMessage(e.replyToken, replies);     
                }
                else if(e.message.text == 'hari ini'){
                    let replies = [];
                    replies.push({
                        type: "sticker",
                        packageId: 2,
                        stickerId: 161
                    })
                    replies.push({
                        type: "text",
                        text: "Antos dumun. Kari ngebitan kalendar.\n ------- \n Tunggu Sebentar"
                    })
                    pushPenanggal(e.source.userId);   
                    return client.replyMessage(e.replyToken, replies);   
              } else if(e.message.text == 'pilih hari'){
                  const echo = {
                      type: 'template',
                      altText: 'Memilih hari',
                      template: {
                        type: 'buttons',
                        text: 'Pilih Hari',
                        actions: [
                          { type: 'datetimepicker', label: 'Klik Disini', data: 'DATE', mode: 'date' }
                        ],
                      },
                    }

                    return client.replyMessage(e.replyToken, echo);
              } else {
                console.log("Tidak ada")
              }
            }
        })
    )
    .then(all => {
        console.log(all)
    })
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
  }


function pushPenanggal(userId){
    console.log({
        userId        
    })
    const date = await moment().tz("Asia/Makassar");
    const echo = await calendar(date);
    client.pushMessage(userId, echo);
}
//app.use(Line.middleware(config))
app.use(Router.routes())

app.listen(process.env.PORT || 3000)