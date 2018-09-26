const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const Router = require('koa-router')()
const Line = require('@line/bot-sdk')
const calendar = require('./service/calendar')
const dateValidator = require("./utils/date-validator")
// const memCache = require('memory-cache');
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
                pushPenanggal(e.source.userId, replies); 
                 console.log(e.postback.params.date)
                 let date = moment(e.postback.params.date)
                 const echo = await calendar(date);
                 ctx.body = echo;
                 return client.replyMessage(e.replyToken, echo);
               }
            } else if(e.type == 'message'){
                //checking interaction
                if(e.message.text.toLowerCase() == "penanggal" && e.message.text.length == 9){
                    let replies = [];
                    replies.push({
                        type: "text",
                        text: "Penanggal adalah menu untuk mengetahui informasi lebih lanjut pada tanggal tertentu seperti, hari raya, peringatan, libur nasional, wuku, sasih, dll. Kakak cukup mengetikan 'Penanggal hari ini' atau 'Penanggal dd mm yyyy'. Ayo mulai cari tahu informasi yang kakak inginkan mulai dari hari ini atau langsung ke tanggal yang ingin kakak kepoin."
                    })
                    replies.push({
                        type: 'template',
                        altText: "Kakak mau kepoin yang mana?",
                        template: {
                            type: "confirm",
                            text: "Kakak mau kepoin yang mana?",
                            actions: [
                                {
                                    type: "message",
                                    label: "Hari ini",
                                    text: "penanggal hari ini"
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
                else if(e.message.text.toLowerCase().substr(0,9) == "penanggal" && e.message.text.length > 9){
                    let message = e.message.text.toLowerCase().substr(9).trim()
                    message = message.split(" ");
                    let replies = [];
                    if(`${message[1]} ${message[2]}` == "hari ini"){
                        replies.push({
                            type: "sticker",
                            packageId: 2,
                            stickerId: 161
                        })
                        replies.push({
                            type: "text",
                            text: "Antos dumun. Kari ngebitan kalendar.\n ------- \n Tunggu Sebentar"
                        })                 
                        pushPenanggal(e.source.userId, replies);  
                        const date = await moment().tz("Asia/Makassar");
                        const echo = await calendar(date);
                        return client.replyMessage(e.replyToken, echo);
                    }
                    else{                        
                        if(message.length == 3){
                            let dateVal = new Date(message[2], dateValidator.parseMonth(message[1]), message[0]);
                            console.log({
                                dateVal
                            })
                            if(dateVal == "Invalid Date"){
                                return bingung(e.replyToken) 
                            }
                            else{                                
                                replies.push({
                                    type: "sticker",
                                    packageId: 2,
                                    stickerId: 161
                                })
                                replies.push({
                                    type: "text",
                                    text: "Antos dumun. Kari ngebitan kalendar.\n ------- \n Tunggu Sebentar"
                                })                 
                                pushPenanggal(e.source.userId, replies);
                                if(message[2].length == 1)
                                    message[2] = `0${message[2]}`;                                
                                let date = moment(`${message[2]}-${dateValidator.parseMonth(message[1])}-${message[0]}`)                                
                                const echo = await calendar(date);
                                return client.replyMessage(e.replyToken, echo);  
                            }
                        }
                        else{
                           return bingung(e.replyToken)
                        }                          
                        
                    }
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
                return bingung(e.replyToken);
              }
            }
        })
    )
    .then(all => {
        console.log({all})
    })
    //ctx.body = await Promise.all(results.map(result => result.json()))
})

function bingung(replyToken){
    let replies = [];
    replies.push({
        type: "sticker",
        packageId: 1,
        stickerId: 108
    })
    replies.push({
        type: "text",
        text: "Maaf, sepertinya pesan yang kakak berikan salah. Kala jadi bingung."
    })                                         
    return client.replyMessage(replyToken, replies);  
}

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


function pushPenanggal(userId, message){
    console.log({
        userId,
        message
    })
    client.pushMessage(userId, message);
}
//app.use(Line.middleware(config))
app.use(Router.routes())

app.listen(process.env.PORT || 3000)