const request = require('request')

function getCalendar (date, month, year) {
    return new Promise(function(resolve,reject){
        request.get(`https://kalender-bali.herokuapp.com/v1/details?bulan=9&tahun=2018&tanggal=14`, (err, res) => {
            return resolve(res.body)
        })
    })
}

module.exports = getCalendar