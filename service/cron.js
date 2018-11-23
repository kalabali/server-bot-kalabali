const cron = require("node-cron");
const fs = require('fs');
const path = require('path');
const client = require('../config/line')

export const message_pagi = [{
    type: "text",
    text: `Selamat pagi, waktu sudah menunjukkan pukul 06.00 WITA.\n\nMarilah kita umat sedarma menghaturkan Puja Tri Sandhya.\n\nIngin menonaktifkan pengingat ini? Kakak bisa mengetikkan "Matikan Tri Sandhya"`
}];

export const message_siang = [{
    type: "text",
    text: `Selamat siang, waktu sudah menunjukkan pukul 12.00 WITA.\n\nMarilah kita umat sedarma menghaturkan Puja Tri Sandhya.\n\nIngin menonaktifkan pengingat ini? Kakak bisa mengetikkan "Matikan Tri Sandhya"`
}];

export const message_sore = [{
    type: "text",
    text: `Selamat Sore, waktu sudah menunjukkan pukul 18.00 WITA.\n\nMarilah kita umat sedarma menghaturkan Puja Tri Sandhya.\n\nIngin menonaktifkan pengingat ini? Kakak bisa mengetikkan "Matikan Tri Sandhya"`
}];

export default function cron_schedule(cronTime, message){
    cron.schedule(cronTime, () => {
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