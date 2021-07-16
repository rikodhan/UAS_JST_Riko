var express = require('express');
var r = express.Router();

// load pre-trained model
const model = require('./sdk/model.js');

// Bot Setting
const TelegramBot = require('node-telegram-bot-api');
const token = '1630793924:AAGJ7WmAw1_qC_sVqv_ZLIxFNHFI6UtjcBs'
const bot = new TelegramBot(token, {polling: true});


// bots
bot.onText(/\/start/, (msg) => { 
    console.log(msg)
    bot.sendMessage(
        msg.chat.id,
        `hello, welcome...\n
        click /predict`
    );   
});

// input i and r
state = 0;
bot.onText(/\/predict/, (msg) => { 
    bot.sendMessage(
        msg.chat.id,
        `masukan nilai x1|x1|x3 contoh 9|9|9`
    );   
    state = 1;
});

bot.on('message', (msg) => { 
    if(state == 1){
        s = msg.text.split("|");
        x1 = s[0]
        x2 = s[1]
        x3 = s[2]
        model.predict(
            [
                parseFloat(s[0]),
                parseFloat(s[1]),
                parseFloat(s[2])
            ]
         ).then((jres)=>{
            bot.sendMessage(
                msg.chat.id,
                `nilai y1 yang diprediksi adalah ${jres[0]}`
            );
             bot.sendMessage(
                msg.chat.id,
                `nilai y2 yang diprediksi adalah ${jres[1]}`
            );
             bot.sendMessage(
                msg.chat.id,
                `nilai y3 yang diprediksi adalah ${jres[2]}`
            );
        })
     }else{
         state = 0
     }
})
    
// routers
r.get('/prediction/:x1/:x2/:x3', function(req, res, next) {    
    model.predict(
        [
            parseFloat(req.params.x1), // string to float
            parseFloat(req.params.x2),
            parseFloat(req.params.x3),
        ]
    ).then((jres)=>{
        res.json(jres);
    })
});

module.exports = r;
