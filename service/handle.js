const comand = [
    "#detailhari"
]
function incoming(event){
    let response;
    if(event.type === 'message' || event.message.type === 'text'){
        if(event.message.text.indexOf("#") !== -1 && comand.indexOf(event.message.text) !== -1){ //check if user imputting available command
            response = {
                type: 'text',
                text: "command is: " + event.message.text
            }
        }
        else{
            response = {
                type: 'text',
                text: "command undefined: " + event.message.text
            }
        }
        return response;
    }
}

module.exports = {
    incoming
}