const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const Router = require('koa-router')()
const Line = require('@line/bot-sdk')
const calendar = require('./service/calendar')
const dateValidator = require("./utils/date-validator")
const utils = require("./service/utils")
const render = require('koa-ejs');
const serve = require('koa-static');
const cron = require("node-cron");
const fs = require('fs');
const path = require('path');
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

if(process.env.NODE_APP_INSTANCE === '0') {    
    cron.schedule('0 5 * * *', () => {
        let message = [{
            type: "text",
            text: `Selamat pagi, waktu sudah menunjukkan pukul 06.00 WITA.\n\nMarilah kita umat sedarma menghaturkan Puja Tri Sandhya.\n\nIngin menonaktifkan pengingat ini? Kakak bisa mengetikkan "Matikan Tri Sandhya"`
        }];
        fs.readFile(path.normalize(`${__dirname}/utils/push-notif/trisandya.json`), (err, data) => {
            if(err == null){                
                const semetons = JSON.parse(data);                                
                semetons.user_id.forEach(semeton => {
                    client.pushMessage(semeton, message);
                })
            }            
        })        
      }, {
        scheduled: true,
        timezone: "Asia/Jakarta"
      });
      
      cron.schedule('0 11 * * *', () => {
        let message = [{
            type: "text",
            text: `Selamat siang, waktu sudah menunjukkan pukul 12.00 WITA.\n\nMarilah kita umat sedarma menghaturkan Puja Tri Sandhya.\n\nIngin menonaktifkan pengingat ini? Kakak bisa mengetikkan "Matikan Tri Sandhya"`
        }];
        fs.readFile(path.normalize(`${__dirname}/utils/push-notif/trisandya.json`), (err, data) => {
            if(err == null){                
                const semetons = JSON.parse(data);                                
                semetons.user_id.forEach(semeton => {
                    client.pushMessage(semeton, message);
                })
            }            
        })        
      }, {
        scheduled: true,
        timezone: "Asia/Jakarta"
      });

      cron.schedule('0 17 * * *', () => {
        let message = [{
            type: "text",
            text: `Selamat Sore, waktu sudah menunjukkan pukul 18.00 WITA.\n\nMarilah kita umat sedarma menghaturkan Puja Tri Sandhya.\n\nIngin menonaktifkan pengingat ini? Kakak bisa mengetikkan "Matikan Tri Sandhya"`
        }];
        fs.readFile(path.normalize(`${__dirname}/utils/push-notif/trisandya.json`), (err, data) => {
            if(err == null){                
                const semetons = JSON.parse(data);                                
                semetons.user_id.forEach(semeton => {
                    client.pushMessage(semeton, message);
                })
            }            
        })        
      }, {
        scheduled: true,
        timezone: "Asia/Jakarta"
      });
}

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
                client.replyMessage(e.replyToken, replies);
                let date = moment(e.postback.params.date)
                const echo = await calendar.getCalendar(date);
                ctx.body = echo;                
                pushPenanggal(e.source.userId, echo); 
               }
            } else if(e.type == 'message' && e.message.type == "text"){
                //checking interaction
                // Fitur 1 Penanggal                
                if(e.message.text.toLowerCase().substring(0,9) == "penanggal"){
                    if(e.message.text.length == 9){
                        let replies = [];
                        replies.push({
                            type: "text",
                            text: `Hai kak, kakak dapat mengunakan menu penanggal untuk mencari tahu detail dari suatu hari.\n\nMulai dari hari raya, momen peringatan, wuku, dll.\n\nKakak dapat menggunakannya dengan mengetikkan "Penanggal dong".`
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
                    client.replyMessage(e.replyToken, [{
                        type: "text",
                        text: "\ud83d\udd0d Tunggu sebentar ya kak..."
                    }])
                    const date = await moment().tz("Asia/Makassar");
                    const echo = await calendar.getCalendar(date);                    
                    pushPenanggal(e.source.userId, echo);  
                }
                else if(e.message.text.toLowerCase().substr(0,9) == "penanggal" && e.message.text.length > 9){
                    let message = e.message.text.toLowerCase().substr(9).trim()
                    message = message.split(" ");
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
                            console.log("masuk sini")
                           return bingung(e.replyToken)
                        }                          
                        
                    }
              } //@fiture kalendar 
              else if((e.message.text.toLowerCase().substr(0,8) == "kalendar" || e.message.text.toLowerCase().substr(0,8) == "kalender")){ 
                  if(e.message.text.length == 8){ //user ngetik kalender
                    return client.replyMessage(e.replyToken, [                        
                        {
                            type: "text",
                            text: `Hai kak, kakak dapat mengunakan menu Kalender Bulanan untuk mengetahui informasi dalam 1 bulan.\n\nMulai dari hari raya, momen peringatan, libur nasional, dll.\n\nKakak dapat menggunakannya dengan mengetikkan "Kalender<spasi>bulan<spasi>tahun".`
                        }
                    ]); 
                  }
                  else if(e.message.text.length > 8){
                    const remainM = e.message.text.toLowerCase().substr(8).trim().split(" ");      console.log({
                        remainM
                    })
                    let monthIndex = utils.getMonthIndex(remainM[0]);
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
                    text: "Hai kak,\nMenu ini dapat digunakan untuk mencari hari raya / upacara tertentu yang akan datang setelah hari ini. \n\nMisal ketikkan : Cari Purnama atau Cari Kuningan\n\nAtau kakak dapat menggunakan daftar rerainan yang sering dicari dibawah ini.",
                    quickReply: {
                        items: [
                            {
                                type: "action",                                
                                action: {  
                                    "type":"message",
                                    "label":"Nyepi",
                                    "text":"Cari Nyepi"
                                }
                            },
                            {
                                type: "action",                                
                                action: {  
                                    "type":"message",
                                    "label":"Galungan",
                                    "text":"Cari Galungan"
                                }
                            },
                            {
                                type: "action",                                
                                action: {  
                                    "type":"message",
                                    "label":"Kuningan",
                                    "text":"Cari Kuningan"
                                }
                            },
                            {
                                type: "action",                                
                                action: {  
                                    "type":"message",
                                    "label":"Purnama",
                                    "text":"Cari Purnama"
                                }
                            },
                            {
                                type: "action",                                
                                action: {  
                                    "type":"message",
                                    "label":"Tilem",
                                    "text":"Cari Tilem"
                                }
                            },                           
                            {
                                type: "action",                                
                                action: {  
                                    "type":"message",
                                    "label":"Pagerwesi",
                                    "text":"Cari Pagerwesi"
                                }
                            },
                            {
                                type: "action",                                
                                action: {  
                                    "type":"message",
                                    "label":"Saraswati",
                                    "text":"Cari Saraswati"
                                }
                            },                            
                            {
                                type: "action",                                
                                action: {  
                                    "type":"message",
                                    "label":"Siwaratri",
                                    "text":"Cari Siwaratri"
                                }
                            },
                            {
                                type: "action",                                
                                action: {  
                                    "type":"message",
                                    "label":"Buda Kliwon",
                                    "text":"Cari Buda Kliwon"
                                }
                            },
                            {
                                type: "action",                                
                                action: {  
                                    "type":"message",
                                    "label":"Tumpek",
                                    "text":"Cari Tumpek"
                                }
                            },
                            {
                                type: "action",                                
                                action: {  
                                    "type":"message",
                                    "label":"Anggar Kasih",
                                    "text":"Cari Anggar Kasih"
                                }
                            }
                        ]
                    }
                }]);

              } else if(e.message.text.toLowerCase().indexOf("cari") != -1){
                    if(e.message.text.toLowerCase().substring(e.message.text.toLowerCase().indexOf("cari") + 5)){                        
                        const date = await moment().tz("Asia/Makassar");
                        const rerainan = e.message.text.toLowerCase().substring(e.message.text.toLowerCase().indexOf("cari") + 5);
                        const echo = await calendar.getRerainan(e.message.text.toLowerCase().substring(e.message.text.toLowerCase().indexOf("cari") + 5),date,'near')                        
                        let replies = [                            
                            {
                                type: "text",
                                text: "\udbc0\udc8f Hai kak, ketemu nih..."
                            },
                            echo                            
                        ]                        
                        if(rerainan == "nyepi" || rerainan == "galungan" || rerainan == "siwaratri" || rerainan == "pagerwesi" || rerainan == "tumpek" || rerainan == "anggar kasih" || rerainan == "buda kliwon" || rerainan == "saraswati" || rerainan == "purnama" || rerainan == "tilem" || rerainan == "kuningan"){
                            replies.push({
                                type: "text",
                                text: `Ingin lebih tahu apa itu Hari Raya ${rerainan}?\nCoba ketikkan "Apa itu ${rerainan}"`
                            })
                        }
                        client.replyMessage(e.replyToken, replies)
                        // pushPenanggal(e.source.userId, replies);
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
                    text: `Kala siap membantu, kakak dapat mengakses menu-menu yang ada dari menu "Kala Bali" yang ada di sebelah tombol menu.\n\n\udbc0\udca4 Penanggal\nPenanggal adalah menu untuk mencari tahu detail dari suatu hari.\nMulai dari hari raya, momen peringatan, wuku, dll.\nKakak dapat menggunakannya dengan mengetikkan "Penanggal dong".\n\n\udbc0\udca4 Kalender Bulanan\nMenu Kalender Bulanan digunakan untuk mengetahui informasi dalam 1 bulan.\nMulai dari hari raya, momen peringatan, libur nasional, dll.\nKakak dapat menggunakannya dengan mengetikkan "Kalender<spasi>bulan<spasi>tahun".\n\n\udbc0\udca4 Cari Hari Raya Terdekat\nMenu ini adalah untuk mencari hari penting / upacara tertentu yang akan datang setelah hari ini. \nMisal ketikkan : Cari Purnama atau Cari Kuningan\n\nKala Bali sangat mengapresiasi kritik dan masukan, kirimkan melalui email resmi kami : kalabalimedia@gmail.com`
                }]); 
              }
              else if(e.message.text.toLowerCase() == "om swastiastu"){
                return client.replyMessage(e.replyToken, [{
                    type: "text",
                    text: `Om swastiastu.`
                }]); 
              }
              else if(e.message.text.toLowerCase() == "hi" || e.message.text.toLowerCase() == "hallo" || e.message.text.toLowerCase() == "halo"|| e.message.text.toLowerCase() == "hai"|| e.message.text.toLowerCase() == "haii"){ //@TODO adding more gimmick
                return client.replyMessage(e.replyToken, [{
                    type: "text",
                    text: `Hallo kak.`
                }]); 
              }
              else if(e.message.text.toLowerCase() == "kala"|| e.message.text.toLowerCase() == "halo kala"|| e.message.text.toLowerCase() == "halo kala" || e.message.text.toLowerCase() == "halo kala bali"|| e.message.text.toLowerCase() == "hai kala"|| e.message.text.toLowerCase() == "hai kala bali" || e.message.text.toLowerCase() == "hallo kala"|| e.message.text.toLowerCase() == "hallo kala" || e.message.text.toLowerCase() == "hallo kala bali"){
                return client.replyMessage(e.replyToken, [{
                    type: "text",
                    text: `Hallo kak, ada yang bisa kala bantu?`
                }]); 
              }
              else if(e.message.text.toLowerCase() == "about" || e.message.text.toLowerCase() == "tentang" || e.message.text.toLowerCase() == "kala bali"){
                return client.replyMessage(e.replyToken, [{
                    type: "text",
                    text: `Kala Bali adalah aplikasi untuk mengakses informasi mengenai kalendar bali secara digital\nDibuat di Bali, oleh I Made Budi Surya Darma dan Teofilus Candra`
                }]); 
              }
              else if(e.message.text.toLowerCase() == "feedback" || e.message.text.toLowerCase() == "masukkan"){
                return client.replyMessage(e.replyToken, [{
                    type: "text",
                    text: `Kala Bali sangat mengapresiasi kritik dan masukan, kirimkan melalui email resmi kami : kalabalimedia@gmail.com`
                }]); 
              }
              else if(e.message.text.toLowerCase().indexOf("thank") != -1 || e.message.text.toLowerCase() == "terima kasih" || e.message.text.toLowerCase().indexOf("suksma") != -1){
                return client.replyMessage(e.replyToken, [
                {
                    "type": "sticker",
                    "packageId": "1",
                    "stickerId": "13"
                },
                {
                    type: "text",
                    text: `Terima kasih kembali kak.`
                }]); 
              }
              else if(e.message.text.toLowerCase().indexOf("matikan") != -1){                
                let message = e.message.text.toLowerCase().split(" ");
                const indexMati = message.indexOf("matikan");
                if(message[indexMati + 1] != undefined){                    
                    if(message[indexMati + 1] == "trisandya" || message[indexMati + 1] == "trisandhya"){
                        removeUser(e.source.userId, 'trisandya.json')
                        .then(status => {                            
                            return client.replyMessage(e.replyToken, [
                                {
                                    type: "text",
                                    text: `\udbc0\udc71 Mematikan notifikasi pengingat Tri Sandhya.\n\n Kakak bisa menghidupkannya pengingat lagi dengan mengetikkan "Hidupkan Tri Sandhya"`
                                }
                            ]);  
                        })
                    }
                    else if(message[indexMati + 1] == "tri"){                        
                        if(message[indexMati + 2] != undefined){
                            if(message[indexMati + 2] == "sandya" || message[indexMati + 2] == "sandhya"){
                                console.log("mati tri sandya")
                                removeUser(e.source.userId, 'trisandya.json')
                                .then(status => {
                                    if(status.success){
                                        return client.replyMessage(e.replyToken, [
                                            {
                                                type: "text",
                                                text: `\udbc0\udc71 Mematikan notifikasi pengingat Tri Sandhya.\n\nKakak bisa menghidupkannya pengingat lagi dengan mengetikkan "Hidupkan Tri Sandhya"`
                                            }
                                        ]);  
                                    }
                                    else if(!status.success){
                                        return client.replyMessage(e.replyToken, [
                                            {
                                                type: "text",
                                                text: `Kakak belum menghidupkan notifikasi pengingat Tri Sandhya. \n\nKakak bisa menghidupkannya pengingat dengan mengetikkan "Hidupkan Tri Sandhya"`
                                            }
                                        ]);  
                                    }                                    
                                })
                            }
                            else
                                return bingung(e.replyToken);        
                        }
                        else
                            return bingung(e.replyToken);        
                    }
                    else{
                        return bingung(e.replyToken);        
                    }
                }
                else{
                    return bingung(e.replyToken);        
                }
              }
              else if(e.message.text.toLowerCase().indexOf("hidupkan") != -1){                
                let message = e.message.text.toLowerCase().split(" ");
                const indexMati = message.indexOf("hidupkan");
                if(message[indexMati + 1] != undefined){                    
                    if(message[indexMati + 1] == "trisandya" || message[indexMati + 1] == "trisandhya"){
                        addUser(e.source.userId, 'trisandya.json')
                        .then(status => {                            
                            return client.replyMessage(e.replyToken, [
                                {
                                    type: "text",
                                    text: `\udbc0\udc71 Menghidupkan notifikasi pengingat Tri Sandhya.\n\n Kakak bisa menonaktifkan pengingat dengan mengetikkan "Matikan Tri Sandhya"`
                                }
                            ]);  
                        })
                    }
                    else if(message[indexMati + 1] == "tri"){                        
                        if(message[indexMati + 2] != undefined){
                            if(message[indexMati + 2] == "sandya" || message[indexMati + 2] == "sandhya"){
                                addUser(e.source.userId, 'trisandya.json')
                                .then(status => {   
                                    console.log({status})                                 
                                    if(status.success){
                                        return client.replyMessage(e.replyToken, [
                                            {
                                                type: "text",
                                                text: `\udbc0\udc71 Menghidupkan notifikasi pengingat Tri Sandhya.\n\n Kakak bisa menonaktifkan pengingat dengan mengetikkan "Matikan Tri Sandhya"`
                                            }
                                        ]);  
                                    }        
                                    else if(!status.success){
                                        return client.replyMessage(e.replyToken, [
                                            {
                                                type: "text",
                                                text: `Kakak sudah menghidupkan notifikasi pengingat Tri Sandhya. \n\nMau mematikannya? Kakak bisa mengetikkan "Matikan Tri Sandhya"`
                                            }
                                        ]);  
                                    }                            
                                })
                            }
                            else
                                return bingung(e.replyToken);        
                        }
                        else
                            return bingung(e.replyToken);        
                    }
                    else{
                        return bingung(e.replyToken);        
                    }
                }
                else{
                    return bingung(e.replyToken);        
                }
              }
              else if(e.message.text.toLowerCase().indexOf("apa itu") != -1){
                  let message = e.message.text.toLowerCase().split("apa itu");                  
                  let target = message[1].trim().replace(/ /g,"_");
                  target = target.replace(/\?/g,"");
                  fs.readFile(path.normalize(`${__dirname}/utils/desc/rerainan.json`), (err, data) => {
                      const rerainan = JSON.parse(data).rerainan;                       
                      if(rerainan[target] != undefined){
                        client.replyMessage(e.replyToken, [{
                            type: "text",
                            text: "Hai kak,\n\n" + rerainan[target].desc
                        }]);  
                      }
                      else{
                        bingung(e.replyToken);
                      }
                  })
              }
              else {                
                return bingung(e.replyToken);
              }
            }
            else if(e.type == "sticker" || e.type == "image" || e.type == "video" || e.type == "audio" || e.type == "file" || e.type == "location"){
                return bingung(e.replyToken)
            }
            if(e.type == "follow"){ //bot added as friend or unblocked
                const newUserId = e.source.userId;
                addUser(newUserId, "trisandya.json")
                .then(status => {
                    console.log({status})
                })
                addUser(newUserId, "follow.json")
                .then(status => {
                    console.log({status})
                })

            }
            if(e.type == "unfollow"){ //bot is blocked
                const semetonTarget = e.source.userId;
                removeUser(semetonTarget, 'trisandya.json')
                .then(status => {
                    console.log({status})
                })
            }
        })
    )
    .then(all => {
        console.log({all})
    })
    //ctx.body = await Promise.all(results.map(result => result.json()))
})

function addUser(userId, jsonName){
    return new Promise((resolve, reject) => {
        fs.readFile(path.normalize(`${__dirname}/utils/push-notif/${jsonName}`), (err, data) => { //tambhakan di push notif trisandya
            if(err == null){                
                const semetons = JSON.parse(data).user_id;                                
                if(semetons.indexOf(userId) == -1){
                    semetons.push(userId);
                    fs.writeFile(path.normalize(`${__dirname}/utils/push-notif/${jsonName}`), JSON.stringify({user_id: semetons}), err => {
                        if(err) console.log(err);
                        console.log(`User ${userId} added`);
                        resolve({success: true})
                    })                        
                }                        
                else{
                    console.log(`User ${userId} already exist`);
                    resolve({success: false})
                }
            }            
        }) 
    })
}

function removeUser(userId, jsonName){
    return new Promise((resolve, reject) => {
        fs.readFile(path.normalize(`${__dirname}/utils/push-notif/${jsonName}`), (err, data) => { //tambhakan di push notif trisandya
            if(err == null){                
                let semetons = JSON.parse(data).user_id;                                
                const semetonIndex = semetons.indexOf(userId);
                if(semetonIndex != -1){
                    if(semetonIndex == 0){
                        semetons.shift();
                    }
                    else if(semetonIndex == semetons.length - 1){
                        semetons.pop();
                    }
                    else{
                        const frontEl = semetons.slice(0, semetonIndex);
                        const backEl = semetons.slice(semetonIndex + 1);
                        semetons = frontEl.concat(backEl);                            
                    }                        
                    fs.writeFile(path.normalize(`${__dirname}/utils/push-notif/${jsonName}`), JSON.stringify({user_id: semetons}), err => {
                        if(err) console.log(err);
                        console.log(`User ${userId} removed`);
                        resolve({success: true});
                    })       
                }
                else{
                    console.log(`User ${userId} has been removed`);
                    resolve({success: false});
                }                    
            }            
        })        
    })
}

function bingung(replyToken){
    let replies = [];
    replies.push({
        type: "sticker",
        packageId: 1,
        stickerId: 108
    })
<<<<<<< HEAD
    let textArr = [
        {
            type: "text",
            text: "Maaf, sepertinya pesan yang kakak berikan salah. Kala jadi bingung."
        },
        {
            type: "text",
            text: "Maaf kak, kala masih belajar dan belum mengerti yang kakak mau. \udbc0\udc7c"
        },
        {
            type: "text",
            text: "Sepertinya kakak bingung \udbc0\udc1b.\n\nCoba ketikkan 'Bantuan'."
        },
    ]
    let index = Math.round(Math.random() * (2 - 0) + 0);
    replies.push(textArr[index]);
=======
    replies.push({
        type: "text",
        text: `Maaf, sepertinya pesan yang kakak berikan salah. Kala jadi bingung.\n\nKala masih belajar nih, kalau kakak bingung coba ketikkan "Bantuan".`
    })                                         
>>>>>>> 636d2940392d0703aec6ad6ff089c7dafdb97c0c
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
console.log(process.env.NODE_APP_INSTANCE)
app.listen(process.env.PORT || 3000)