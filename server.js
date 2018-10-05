const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const Router = require('koa-router')()
const Line = require('@line/bot-sdk')
const calendar = require('./service/calendar')
const dateValidator = require("./utils/date-validator")
const utils = require("./service/utils")
const render = require('koa-ejs');
const path = require('path');
const serve = require('koa-static');
// const memCache = require('memory-cache');
require('dotenv').config()
const app = new Koa()
app.use(bodyParser())

var moment = require('moment-timezone');

render(app, {
    root: path.join(__dirname, 'view'),
    layout: 'index',
    viewExt: 'html',
    cache: false,
    debug: false
});

app.use(serve(__dirname + '/view'));
app.use(serve(__dirname + '/public'));

const config = {
    channelAccessToken : process.env.channelAccessToken || "",
    channelSecret : process.env.channelSecret || "" 
}

const client = new Line.Client(config)

Router.get('/', async(ctx) => {
    await ctx.render('index');
})

Router.get('/calendar', async(ctx) => {
    ctx.body = "Calendar"
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
                 const echo = await calendar.getCalendar(date);
                 ctx.body = echo;
                 return client.replyMessage(e.replyToken, echo);
               }
            } else if(e.type == 'message'){
                //checking interaction
                // Fitur 1 Penanggal
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
                else if(e.message.text.toLowerCase().indexOf("hari ini") != -1){
                    const date = await moment().tz("Asia/Makassar");
                    const echo = await calendar.getCalendar(date);
                    return client.replyMessage(e.replyToken, echo);
                }
                else if(e.message.text.toLowerCase().substr(0,9) == "penanggal" && e.message.text.length > 9){
                    let message = e.message.text.toLowerCase().substr(9).trim()
                    message = message.split(" ");
                    console.log({
                        message
                    })
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
                        const echo = await calendar.getCalendar(date);
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
                                const echo = await calendar.getCalendar(date);
                                return client.replyMessage(e.replyToken, echo);  
                            }
                        }
                        else{
                           return bingung(e.replyToken)
                        }                          
                        
                    }
              } else if((e.message.text.toLowerCase().substr(0,8) == "kalendar" || e.message.text.toLowerCase().substr(0,8) == "kalender") && e.message.text.length > 8){ 
                  const remainM = e.message.text.toLowerCase().substr(8).trim().split(" ");       
                  const monthIndex = utils.getMonthIndex(remainM[0]);
                  if(monthIndex === -1 || remainM.length < 2){
                    return client.replyMessage(e.replyToken, {
                        type: "text",
                        text: "wadoooh"
                    });                                     
                  }
                  else{
                      monthIndex = monthIndex < 10 ? `0${monthIndex}`: monthIndex;
                      let date = new Date(`${remainM[1]}-${monthIndex}-01`);
                      if(date != "Invalid Date"){
                        const echo = await calendar.getMonthCalendar({
                            bulan: utils.getMonthIndex(remainM[0]),
                            tahun: remainM[1]
                          });  
                        return client.replyMessage(e.replyToken, echo);                                 
                      }
                      else{
                        return client.replyMessage(e.replyToken, {
                            type: "text",
                            text: "wadoooh salah format"
                        });                                     
                      }
                  }
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
        const details = request.get(`http://kalabali.com:4000/v1/details?bulan=9&tahun=2018&tanggal=14`)
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
console.log(process.env.PORT)
app.listen(process.env.PORT || 3000)