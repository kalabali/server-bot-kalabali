const memCache = require('memory-cache')

const command = [
    "#detailhari"
]
function incoming(event){
    let response;
    if(event.type === 'message' || event.message.type === 'text'){
        if(event.message.text.indexOf("#") !== -1 && command.indexOf(event.message.text) !== -1){ //check if user imputting available command
           if(event.message.text === "#detailhari"){
                response = {
                    type: 'template',
                    altText: "Detail Hari",
                    template: {
                        text: "Detail hari (#detailhari) adalah menu untuk mengetahui informasi lebih lanjut pada tanggal tertentu seperti, event, wuku, sasih, dll. Ayo mulai cari tahu informasi yang kamu inginkan mulai dari hari ini atau langsung ke tanggal yang ingin kamu kepoin.",
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
                }
           }
        }
        else{
            if(event.message.text === "hari ini"){
                response = {
                    type: 'text',
                    text: "samlekum"
                }
            }
        }
        console.log({
            response
        })
        return response;
    }
}

module.exports = {
    incoming
}