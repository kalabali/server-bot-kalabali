const koa2Req = require('koa2-request')
const utils = require("./utils")
const fs = require('fs-extra')

//penanggal

async function getCalendar (date) {
    console.log(`http://117.53.46.40:4000/v1/details?bulan=${date.format('MM')}&tahun=${date.format('YYYY')}&tanggal=${date.format('DD')}`)
    const details = await koa2Req(`http://117.53.46.40:4000/v1/details?bulan=${date.format('MM')}&tahun=${date.format('YYYY')}&tanggal=${date.format('DD')}`)
    const body = JSON.parse(details.body)

    var filename = body.details.image.substring(body.details.image.lastIndexOf('/')+1);
    // Async with promises:
    fs.copy('/root/vhost/api-kalender-bali/public/calendar/'+filename, '/root/vhost/server-bot-kalabali/public/calendar/'+filename)
        .then(() => console.log('success!'))
        .catch(err => console.error(err))

    var events = "Tidak ada"
    if(body.details.events.length > 0){
        console.log(body.details.events.length)
        events = body.details.events.map(e => e.event_name).join(',')
    }
    return {
        "type": "flex",
        "altText": "Kalender Bali - Hari Ini",
        "contents": {
            "type": "bubble",
            "hero": {
                "type": "image",
                "url": "https://www.kalabali.com/calendar/"+filename,
                "size": "full",
                "aspectRatio": "20:13",
                "aspectMode": "fit"
            },
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
                "color": "#d83d43",
                "size": "sm"
                },
                {
                    "type": "text",
                    "text": date.format('DD MMMM YYYY'),
                    "weight": "bold",
                    "size": "xl",
                    "margin": "md"
                },
                {
                    "type": "text",
                    "text": "Hari Raya / Peringatan : " + events,
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
}

//kalender bulanan

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
        message += `Pada bulan ${utils.getMonthName(date.bulan)} tahun ${date.tahun}, tidak ada catatan tentang rerainan, hari peringatan, atau libur nasional nih 🤔 🤔 🤔.
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
            message += `• ${body.calendar.raws.libur_nasional.length} libur nasional 😍 😍 😍'\n`;
        }
        else{
            message += `• Tidak ada libur nasional nih kak 😭 😭 😭`; 
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
    if(body.results.length == 0){
        return {
            type: "text",
            text: "Tidak ada rerainan"
        }
    } else {

        var arrayRes = [
            {
              "type": "text",
              "text": rerainan.charAt(0).toUpperCase() + rerainan.substr(1) + " " + (type == 'all' ? 'Semua' : 'Terdekat'),
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
            if(parseInt(element.query.month) > parseInt(date.format('MM'))){

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
          }
        });

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
    
    console.log(result)
    return result
    }
}


module.exports = {
    getCalendar,
    getMonthCalendar,
    getRerainan
}