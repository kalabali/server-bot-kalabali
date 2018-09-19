const koa2Req = require('koa2-request')

async function getCalendar (date) {
    console.log(`https://kalender-bali.herokuapp.com/v1/details?bulan=${date.format('MM')}&tahun=${date.format('YYYY')}&tanggal=${date.format('DD')}`)
    const details = await koa2Req(`https://kalender-bali.herokuapp.com/v1/details?bulan=${date.format('MM')}&tahun=${date.format('YYYY')}&tanggal=${date.format('DD')}`)
    const body = JSON.parse(details.body)
    var events = ""
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
                "url": body.details.image,
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
                "color": "#1DB446",
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
}

module.exports = getCalendar