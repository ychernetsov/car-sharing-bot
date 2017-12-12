'use strict'

const Telegram = require('telegram-node-bot');
const User = require("../db/models/user");
const db = require("../db");
const isAuth = require("../services/check-access.service");

class StartController extends Telegram.TelegramBaseController {
    startHandler($) {
    	isAuth.check(User, $)
    		.then(isAuth => {
    			if (isAuth) {
    				$.sendMessage("Вы авторизированы");
    				$.sendMessage("Чтобы просмотреть доступные поездки, нажмите /list");
    			} else {
    				$.sendMessage("Чтобы войти - пердоставьте номер телефона", {
                            'parse_mode': 'Markdown',
                            'reply_markup': JSON.stringify({
                              "keyboard": [[{
                              	"text": "Share contact",
                              	"request_contact": true
                              }],
                              [{
                              	"text": "Reject",
                              	"request_contact": false
                              }]],
                              "one_time_keyboard": true,
                              "resize_keyboard": true
                            })
                        })
    	$.waitForRequest
    		.then($=> {
    			console.log($.message.contact !== null)
    			if($.message.contact !== null) {
    				$.sendMessage("Вы авторизированы");
    				$.sendMessage("Чтобы просмотреть доступные поездки, нажмите /list");
			        const user = {
			            "user_id": $.message.from.id,
			            "name": $.message.from.firstName,
			            "phone": $.message.contact.phoneNumber,
			            "notification_date": new Date().getTime()
			        }
			        this.isUserExists($.message.from.id, function(err, doc) {
			            if (doc.length > 0) {
			                console.log('Such user already exists ');
			            } else {
			                User.create(user, function(err, doc) {
			                    if (doc) {
			                        console.log('user was created', doc);
			                    }
			                    if (err) {
			                        console.log('user isn\'t created with error', err.toString());
			                        return;
			                    }

			                })

			            }


			        })
    			} else {
    				$.sendMessage("Чтобы войти - пердоставьте номер телефона /start", {'parse_mode': 'Markdown'})
    			}
    		})
    			}
    		})
    	
        


        //$.sendMessage('Нажми /list чтобы вывести список актуальных направлений');

        // const user1 = User.findById("5a2f9a2e734d1d293235a171")
        // .then(res=> {
        // 	console.log("RES ", res)
        // });



    }

    isUserExists(chatId, cb) {
        User.find({
            "user_id": chatId
        }, function(err, doc) {

            cb(err, doc);
        })
    }

    get routes() {
        return {
            'startCommand': 'startHandler'
        }
    }
}

module.exports = StartController;