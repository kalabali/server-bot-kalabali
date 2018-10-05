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
                return bingung(e.replyToken);
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