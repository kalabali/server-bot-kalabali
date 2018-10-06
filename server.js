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
                        type: "text",
                        text: "\ud83d\udd0d Tunggu sebentar ya kak..."
                    })                                 
                console.log(e.postback.params.date)
                let date = moment(e.postback.params.date)
                const echo = await calendar.getCalendar(date);
                ctx.body = echo;
                client.replyMessage(e.replyToken, echo);
                pushPenanggal(e.source.userId, replies); 
               }
            } else if(e.type == 'message' && e.message.type == "text"){
                //checking interaction
                // Fitur 1 Penanggal
                if(e.message.text.toLowerCase().substring(0,9) == "penanggal"){
                    if(e.message.text.length == 9){
                        let replies = [];
                        replies.push({
                            type: "text",
                            text: `Hai kak, kakak dapat mengunakan menu penanggal untuk mencari tahu detail dari suatu hari.\nMulai dari hari raya, momen peringatan, wuku, dll.\nKakak dapat menggunakannya dengan mengetikkan "Penanggal dong".`
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
                    else if(e.message.text.toLowerCase() == "penanggal dong"){
                        let replies = [];
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
                    else{                        
                        return client.replyMessage(e.replyToken, [
                            {
                                type: "text",
                                text: 'Maaf, kala tidak mengerti tanggal yang ingin kakak cari. \udbc0\udc92 \n Kakak bisa mengetikkan "Penanggal dong" untuk menggunakan menu penanggal.'
                            }
                        ]);     
                    }
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
                            type: "text",
                            text: "\ud83d\udd0d Tunggu sebentar ya kak..."
                        })                 
                        const date = await moment().tz("Asia/Makassar");
                        const echo = await calendar.getCalendar(date);
                        client.replyMessage(e.replyToken, replies);
                        pushPenanggal(e.source.userId, echo);  
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
                                    type: "text",
                                    text: "\ud83d\udd0d Tunggu sebentar ya kak..."
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
              } //@fiture kalendar 
              else if((e.message.text.toLowerCase().substr(0,8) == "kalendar" || e.message.text.toLowerCase().substr(0,8) == "kalender")){ 
                  if(e.message.text.length == 8){ //user ngetik kalender
                    return client.replyMessage(e.replyToken, [                        
                        {
                            type: "text",
                            text: `Hai kak, kakak dapat mengunakan menu Kalender Bulanan untuk mengetahui informasi dalam 1 bulan.\nMulai dari hari raya, momen peringatan, libur nasional, dll.\nKakak dapat menggunakannya dengan mengetikkan "Kalender<spasi>bulan<spasi>tahun".`
                        }
                    ]); 
                  }
                  else if(e.message.text.length > 8){
                    const remainM = e.message.text.toLowerCase().substr(8).trim().split(" ");      console.log({
                        remainM
                    })
                    let monthIndex = utils.getMonthIndex(remainM[0]);
                    console.log({
                        remainM,
                        monthIndex
                    })
                    if(monthIndex === -1){
                        return client.replyMessage(e.replyToken, [                        
                            {
                                type: "text",
                                text: "Maaf, kala tidak mengerti kalender bulan apa yang ingin kakak cari. \udbc0\udc92"
                            }
                        ]);                                     
                    }
                    else{
                        // let today = new Date();
                        let year;
                        if(remainM.length > 1){ //validate the year here
                            let tempY = remainM[1];
                            if(!isNaN(parseInt(tempY)) && (parseInt(tempY) >= 2013 || parseInt(tempY) <= 2020)){
                                year = tempY;                                
                            }   

                        }
                        else if(remainM.length == 1){
                            console.log("masuk")                            
                            let today = new Date();
                            year = today.getFullYear();
                            console.log({
                                year
                            })
                        }
                        if(year != undefined){                            
                            monthIndex = monthIndex < 10 ? `0${monthIndex}`: monthIndex;
                            let date = new Date(`${remainM[1]}-${monthIndex}-01`);
                            if(date != "Invalid Date"){                            
                                client.replyMessage(e.replyToken, [
                                    {
                                        type: "text",
                                        text: "\ud83d\udd0d Tunggu sebentar ya kak..."
                                    }
                                ]);                                 
                                const echo = await calendar.getMonthCalendar({
                                    bulan: utils.getMonthIndex(remainM[0]),
                                    tahun: year
                                });                              
                                pushPenanggal(e.source.userId, echo);
                            }
                            else{
                                return client.replyMessage(e.replyToken, [ {
                                    type: "text",
                                    text: "Maaf, kala tidak mengerti kalender bulan apa yang ingin kakak cari. \udbc0\udc92"
                                }]);                                     
                            }
                        }                     
                        else{
                            return client.replyMessage(e.replyToken, [ {
                                type: "text",
                                text: "Maaf, kala tidak mengerti kalender bulan apa yang ingin kakak cari. \udbc0\udc92"
                            }]);                                     
                        }   
                    }
                  }                  
              } 
              else if(e.message.text.toLowerCase() == "cari"){
                
                return client.replyMessage(e.replyToken, [{
                    type: "text",
                    text: "Cari \nMenu ini adalah untuk mencari hari penting / upacara tertentu yang akan datang setelah hari ini. \nMisal ketikkan : Cari Purnama atau Cari Kuningan"
                }]);

              } else if(e.message.text.toLowerCase().indexOf("cari") != -1){
                    if(e.message.text.toLowerCase().substring(e.message.text.toLowerCase().indexOf("cari") + 5)){
                        const date = await moment().tz("Asia/Makassar");
                        console.log(e.message.text.toLowerCase().substring(e.message.text.toLowerCase().indexOf("cari") + 5))
                        const echo = await calendar.getRerainan(e.message.text.toLowerCase().substring(e.message.text.toLowerCase().indexOf("cari") + 5),date,'all')
                        return client.replyMessage(e.replyToken, echo)
                    } else {
                        return client.replyMessage(e.replyToken, [{
                            type: "text",
                            text: "Kala belum bisa menemukan hari upacara itu. Hmm, nanti kala cari lagi ya."
                        }]); 
                    }
              }
              else if(e.message.text.toLowerCase() == "bantuan" || e.message.text.toLowerCase() == "help" || e.message.text.toLowerCase() == "tolong"){
                return client.replyMessage(e.replyToken, [{
                    type: "text",
                    text: `Kala siap membantu, kakak dapat mengakses menu-menu yang ada dari menu "Kala Bali" di sebelah tombol menu.\n\n\udbc0\udca4 Penanggal\nPenanggal adalah menu untuk mencari tahu detail dari suatu hari.\nMulai dari hari raya, momen peringatan, wuku, dll.\nKakak dapat menggunakannya dengan mengetikkan "Penanggal dong".\n\n\udbc0\udca4 Kalender Bulanan\nMenu Kalender Bulanan digunakan untuk mengetahui informasi dalam 1 bulan.\nMulai dari hari raya, momen peringatan, libur nasional, dll.\nKakak dapat menggunakannya dengan mengetikkan "Kalender<spasi>bulan<spasi>tahun".\n\n\udbc0\udca4 Cari Hari Raya Terdekat\nMenu ini adalah untuk mencari hari penting / upacara tertentu yang akan datang setelah hari ini. \nMisal ketikkan : Cari Purnama atau Cari Kuningan`
                }]); 
              }
              else if(e.message.text.toLowerCase() == "om swastiastu" || e.message.text.toLowerCase() == "hallo"){
                return client.replyMessage(e.replyToken, [{
                    type: "text",
                    text: `Om swastiastu.`
                }]); 
              }
              else if(e.message.text.toLowerCase() == "hi" || e.message.text.toLowerCase() == "hallo"){
                return client.replyMessage(e.replyToken, [{
                    type: "text",
                    text: `Hallo kak.`
                }]); 
              }
              else if(e.message.text.toLowerCase() == "kala"){
                return client.replyMessage(e.replyToken, [{
                    type: "text",
                    text: `Hallo kak, ada yang bisa kala bantu?`
                }]); 
              }
              else if(e.message.text.toLowerCase() == "about" || e.message.text.toLowerCase() == "tentang" || e.message.text.toLowerCase() == "kala bali"){
                return client.replyMessage(e.replyToken, [{
                    type: "text",
                    text: `Kala Bali adalah aplikasi untuk mengakses informasi mengenai kalendar bali secara digital\nDibuat di Bali, oleh I Made Surya Budi Surya Darma dan Teofilus Candra`
                }]); 
              }
              else if(e.message.text.toLowerCase() == "feedback" || e.message.text.toLowerCase() == "masukkan"){
                return client.replyMessage(e.replyToken, [{
                    type: "text",
                    text: `Kala Bali sangat mengapresiasi kritik dan masukan, kirimkan melalui email resmi kami : kalabalimedia@gmail.com`
                }]); 
              }
              else {                
                return bingung(e.replyToken);
              }
            }
            else if(e.type == "sticker" || e.type == "image" || e.type == "video" || e.type == "audio" || e.type == "file" || e.type == "location"){
                return bingung(e.replyToken)
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
    client.pushMessage(userId, message);
}
//app.use(Line.middleware(config))
app.use(Router.routes())
console.log(process.env.PORT)
app.listen(process.env.PORT || 3000)