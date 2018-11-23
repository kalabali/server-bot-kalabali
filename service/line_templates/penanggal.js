export default function penanggal(data) {
    return {
        "type": "flex",
        "altText": "Kalender Bali - Hari Ini",
        "contents": {
            "type": "bubble",
            "hero": {
                "type": "image",
                "url": `https://www.kalabali.com/calendar/${data.filename}`,
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
                "contents": [{
                        "type": "text",
                        "text": "Kalender Bali",
                        "weight": "bold",
                        "color": "#d83d43",
                        "size": "sm"
                    },
                    {
                        "type": "text",
                        "text": data.dateReadable,
                        "weight": "bold",
                        "size": "xl",
                        "margin": "md"
                    },
                    {
                        "type": "text",
                        "text": `Hari Raya / Peringatan : ${data.events}`,
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
                        "contents": [{
                                "type": "text",
                                "text": "Deskripsi",
                                "size": "xs",
                                "color": "#aaaaaa",
                                "wrap": true
                            },
                            {
                                "type": "box",
                                "layout": "horizontal",
                                "contents": [{
                                        "type": "text",
                                        "text": "Hari",
                                        "size": "sm",
                                        "color": "#555555",
                                        "flex": 0
                                    },
                                    {
                                        "type": "text",
                                        "text": `${data.body.details.day.day_name.caka} (${data.body.details.day.day_name.masehi})`,
                                        "size": "sm",
                                        "color": "#111111",
                                        "align": "end"
                                    }
                                ]
                            },
                            {
                                "type": "box",
                                "layout": "horizontal",
                                "contents": [{
                                        "type": "text",
                                        "text": "Wuku",
                                        "size": "sm",
                                        "color": "#555555",
                                        "flex": 0
                                    },
                                    {
                                        "type": "text",
                                        "text": data.body.details.wuku,
                                        "size": "sm",
                                        "color": "#111111",
                                        "align": "end"
                                    }
                                ]
                            },
                            {
                                "type": "box",
                                "layout": "horizontal",
                                "contents": [{
                                        "type": "text",
                                        "text": "Sasih",
                                        "size": "sm",
                                        "color": "#555555",
                                        "flex": 0
                                    },
                                    {
                                        "type": "text",
                                        "text": data.body.details.sasih,
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
                        "contents": [{
                                "type": "text",
                                "text": "Wewaran",
                                "size": "xs",
                                "color": "#aaaaaa",
                                "wrap": true
                            },
                            {
                                "type": "box",
                                "layout": "horizontal",
                                "contents": [{
                                        "type": "text",
                                        "text": "Ekawara",
                                        "size": "sm",
                                        "color": "#555555",
                                        "flex": 0
                                    },
                                    {
                                        "type": "text",
                                        "text": data.body.details.wewaran.ekawara,
                                        "size": "sm",
                                        "color": "#111111",
                                        "align": "end"
                                    }
                                ]
                            },
                            {
                                "type": "box",
                                "layout": "horizontal",
                                "contents": [{
                                        "type": "text",
                                        "text": "Dwiwara",
                                        "size": "sm",
                                        "color": "#555555",
                                        "flex": 0
                                    },
                                    {
                                        "type": "text",
                                        "text": data.body.details.wewaran.dwiwara,
                                        "size": "sm",
                                        "color": "#111111",
                                        "align": "end"
                                    }
                                ]
                            },
                            {
                                "type": "box",
                                "layout": "horizontal",
                                "contents": [{
                                        "type": "text",
                                        "text": "Triwara",
                                        "size": "sm",
                                        "color": "#555555",
                                        "flex": 0
                                    },
                                    {
                                        "type": "text",
                                        "text": data.body.details.wewaran.triwara,
                                        "size": "sm",
                                        "color": "#111111",
                                        "align": "end"
                                    }
                                ]
                            },
                            {
                                "type": "box",
                                "layout": "horizontal",
                                "contents": [{
                                        "type": "text",
                                        "text": "Caturwara",
                                        "size": "sm",
                                        "color": "#555555",
                                        "flex": 0
                                    },
                                    {
                                        "type": "text",
                                        "text": data.body.details.wewaran.caturwara,
                                        "size": "sm",
                                        "color": "#111111",
                                        "align": "end"
                                    }
                                ]
                            },
                            {
                                "type": "box",
                                "layout": "horizontal",
                                "contents": [{
                                        "type": "text",
                                        "text": "Pancawara",
                                        "size": "sm",
                                        "color": "#555555",
                                        "flex": 0
                                    },
                                    {
                                        "type": "text",
                                        "text": data.body.details.wewaran.pancawara,
                                        "size": "sm",
                                        "color": "#111111",
                                        "align": "end"
                                    }
                                ]
                            },
                            {
                                "type": "box",
                                "layout": "horizontal",
                                "contents": [{
                                        "type": "text",
                                        "text": "Sadwara",
                                        "size": "sm",
                                        "color": "#555555",
                                        "flex": 0
                                    },
                                    {
                                        "type": "text",
                                        "text": data.body.details.wewaran.sadwara,
                                        "size": "sm",
                                        "color": "#111111",
                                        "align": "end"
                                    }
                                ]
                            },
                            {
                                "type": "box",
                                "layout": "horizontal",
                                "contents": [{
                                        "type": "text",
                                        "text": "Saptawara",
                                        "size": "sm",
                                        "color": "#555555",
                                        "flex": 0
                                    },
                                    {
                                        "type": "text",
                                        "text": data.body.details.wewaran.saptawara,
                                        "size": "sm",
                                        "color": "#111111",
                                        "align": "end"
                                    }
                                ]
                            },
                            {
                                "type": "box",
                                "layout": "horizontal",
                                "contents": [{
                                        "type": "text",
                                        "text": "Astawara",
                                        "size": "sm",
                                        "color": "#555555",
                                        "flex": 0
                                    },
                                    {
                                        "type": "text",
                                        "text": data.body.details.wewaran.astawara,
                                        "size": "sm",
                                        "color": "#111111",
                                        "align": "end"
                                    }
                                ]
                            },
                            {
                                "type": "box",
                                "layout": "horizontal",
                                "contents": [{
                                        "type": "text",
                                        "text": "Sangawara",
                                        "size": "sm",
                                        "color": "#555555",
                                        "flex": 0
                                    },
                                    {
                                        "type": "text",
                                        "text": data.body.details.wewaran.sangawara,
                                        "size": "sm",
                                        "color": "#111111",
                                        "align": "end"
                                    }
                                ]
                            },
                            {
                                "type": "box",
                                "layout": "horizontal",
                                "contents": [{
                                        "type": "text",
                                        "text": "Dasawara",
                                        "size": "sm",
                                        "color": "#555555",
                                        "flex": 0
                                    },
                                    {
                                        "type": "text",
                                        "text": data.body.details.wewaran.dasawara,
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