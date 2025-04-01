const express = require('express');
const router = express.Router();
const {cadastros} = require('../data/db');
const {chats} = require('../data/db');
const Chat = require('../models/Chat');



router.get('/chats', (req, res) =>{
    res.json(chats);
});

router.post('/chats', (req, res) =>{
    const { participants, messages} = req.body;

    if( !participants || !messages){
        return res.status(400).json({error: 'Participantes e Mensagens são obrigatórios'});
    }

    let flag = true;
    let userExists;

    for(const participant of participants){
        userExists = cadastros.find(user => user.id === participant.id);
        if(!userExists){
            flag = false;
            break;
        }
    }

    if(!flag){
        return res.status(400).json({error: 'Todos os participantes da conversa devem ser usuários válidos'});
    }

    thisChatId = chats.length + 1;
    
    const newChat = new Chat(thisChatId, participants, messages);
    chats.push(newChat);
    res.status(201).json(newChat);
});

module.exports = router;