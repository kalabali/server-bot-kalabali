const koa2Req = require('koa2-request')
const utils = require("./utils")
const fs = require('fs-extra')
require('dotenv').config()
const penanggal = require('./line_templates/penanggal')

/**
 * SERVICE PENANGGAL
 */

async function getCalendar (date) {
    const details = await koa2Req(`${process.env.BASE_URL}/v1/details?bulan=${date.format('MM')}&tahun=${date.format('YYYY')}&tanggal=${date.format('DD')}`)
    const body = JSON.parse(details.body)

    const filename = body.details.image.substring(body.details.image.lastIndexOf('/')+1);
    // Async with promises:
    fs.copy(`${process.env.PROJECT_PATH}api-kalender-bali/public/calendar/${filename}`, `${process.env.PROJECT_PATH}server-bot-kalabali/public/calendar/${filename}`)
        .then(() => console.log('success!'))
        .catch(err => console.error(err))

    var events = "Tidak ada"
    if(body.details.events.length > 0){
        console.log(body.details.events.length)
        events = body.details.events.map(e => e.event_name).join(',')
    }
    const dateReadable = date.format('DD MMMM YYYY')
    return penanggal({body , filename, events, dateReadable})
}

/**
 * 
 * MONTHLY CALENDAR SERVICE 
 */

async function getMonthCalendar (date) {
    console.log(`http://117.53.46.40:4000/v1/calendar?bulan=${date.bulan}&tahun=${date.tahun}`)
    const response = await koa2Req(`http://117.53.46.40:4000/v1/calendar?bulan=${date.bulan}&tahun=${date.tahun}`)
    const body = JSON.parse(response.body)  
    
    var filenameFull = body.calendar.image.full.substring(body.calendar.image.full.lastIndexOf('/')+1);
    var filenamePreview = body.calendar.image.preview.substring(body.calendar.image.preview.lastIndexOf('/')+1);
    
    // Async with promises:
    fs.copy('/root/vhost/api-kalender-bali/public/calendar-month/full/'+filenameFull, '/root/vhost/server-bot-kalabali/public/calendar-month/full/'+filenameFull)
        .then(() => console.log('success!'))
        .catch(err => console.error(err))

    fs.copy('/root/vhost/api-kalender-bali/public/calendar-month/preview/'+filenamePreview, '/root/vhost/server-bot-kalabali/public/calendar-month/preview/'+filenamePreview)
        .then(() => console.log('success!'))
        .catch(err => console.error(err))
    
    let replies = [];
    replies.push({
            type: "image",
            originalContentUrl: "https://www.kalabali.com/calendar-month/full/"+filenameFull,
            previewImageUrl: "https://www.kalabali.com/calendar-month/preview/"+filenamePreview
    })
    let message = `Hai Kak, ketemu nih.\n`;
    if(body.calendar.raws.rerainan.length == 0 && body.calendar.raws.peringatan.length == 0 && body.calendar.raws.libur_nasional.length == 0){
        message += `Pada bulan ${utils.getMonthName(date.bulan)} tahun ${date.tahun}, tidak ada catatan tentang rerainan, hari peringatan, atau libur nasional nih.
        `;
    }
    else{
        message += `Pada bulan ${utils.getMonthName(date.bulan)} ${date.tahun} ini kakak bakal ketemu\n`;
        if(body.calendar.raws.rerainan.length > 0){
            message += `• ${body.calendar.raws.rerainan.length} hari yang termasuk rerainan ${body.calendar.raws.peringatan.length > 0 ? "" : ", dan"}\n`
        }
        if(body.calendar.raws.peringatan.length > 0){
            message += `• ${body.calendar.raws.peringatan.length} peringatan nasional, dan\n`
        }
        if(body.calendar.raws.libur_nasional.length > 0){
            message += `• ${body.calendar.raws.libur_nasional.length} libur nasional \udbc0\udc78 \udbc0\udc78 \udbc0\udc78\n`;
        }
        else{
            message += `• Tidak ada libur nasional nih kak \udbc0\udc7c \udbc0\udc94 \udbc0\udc7c`; 
        }
    }    
    replies.push({
        type: "text",
        text: message
    })
    return replies;
}

// cari rerainan

async function getRerainan (rerainan, date, type) {
    var response = {}
    if(type == 'all') {
        response = await koa2Req(`http://117.53.46.40:4000/v1/cari?keyword=${rerainan}&bulan=${date.format('MM')}&tahun=${date.format('YYYY')}&tanggal=${date.format('DD')}&filter=all`)
    } else {
        response = await koa2Req(`http://117.53.46.40:4000/v1/cari?keyword=${rerainan}&bulan=${date.format('MM')}&tahun=${date.format('YYYY')}&tanggal=${date.format('DD')}&filter=near`)
    }
    
    const body = JSON.parse(response.body)
    console.log({
        body: body.results,
        length: body.results.length,
        url: `http://117.53.46.40:4000/v1/cari?keyword=${rerainan}&bulan=${date.format('MM')}&tahun=${date.format('YYYY')}&tanggal=${date.format('DD')}&filter=all`
    })
    if(body.results.length == 0){        
        return {
            type: "text",
            text: `Maaf kak, kala tidak menemukan rerainan dengan kata kunci ${rerainan} \udbc0\udc92`
        }
    } else {
        var arrayRes = [
            {
              "type": "text",
              "text": "Hari Raya " + rerainan.charAt(0).toUpperCase() + rerainan.substr(1) + " " + (type == 'all' ? 'Terdekat' : 'Terdekat'),
              "weight": "bold",
              "color": "#d83d43",
              "size": "lg"
            },
            {
              "type": "separator",
              "margin": "xxl"
            },
          ]
          
        body.results.forEach(element => {
            var events = [
            {
                "type": "text",
                "text": element.data.date + " " + element.data.month + " " + element.data.year,
                "size": "xs",
                "color": "#aaaaaa",
                "wrap": true
            }
            ]
            element.data.events.forEach(event => {
                events.push({
                    "type": "box",
                    "layout": "baseline",
                    "spacing": "sm",
                    "contents": [
                    {
                        "type": "text",
                        "text": "Rerainan",
                        "color": "#aaaaaa",
                        "size": "sm",
                        "flex": 2
                    },
                    {
                        "type": "text",
                        "text": event.event_name,
                        "wrap": true,
                        "color": "#666666",
                        "size": "sm",
                        "flex": 5
                    }
                    ]
                })
            })

            events.push(
                {
                    "type": "separator",
                    "margin": "xxl"
                }
            )

            arrayRes.push({
                "type": "box",
                "layout": "vertical",
                "margin": "lg",
                "spacing": "sm",
                "contents": events
            },
            )
        });

        if(arrayRes.length == 2){
            return {
                type: "text",
                text: "Tidak ada rerainan "+ rerainan + " dalam waktu dekat"
            }
        } else {
            var result = {
                "type": "flex",
                "altText": "Hasil cari rerainan",
                "contents": 
                    {
                    "type": "bubble",
                    "body": {
                      "type": "box",
                      "layout": "vertical",
                      "contents": arrayRes
                    }
                  }
                }
            return result
        }
    }
}


module.exports = {
    getCalendar,
    getMonthCalendar,
    getRerainan
}