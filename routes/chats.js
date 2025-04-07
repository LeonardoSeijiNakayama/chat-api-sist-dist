const express = require('express');
const router = express.Router();
const {cadastros} = require('../data/db');
const {chats} = require('../data/db');
const Chat = require('../models/Chat');



router.get('/chats', (req, res) =>{
    const userId = req.query.userId;
    
    const userExists = cadastros.find(user => user.id === userId);

    if(!userExists){
        return res.status(400).json({error: 'Usuário não encontrado'});
    }

    res.json(userExists.chats);
});

router.post('/chats', (req, res) =>{
    const {creatorId, participants, messages} = req.body;

    if(!creatorId || !participants || !messages){
        return res.status(400).json({error: 'Id do criador, participantes e Mensagens são obrigatórios'});
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

    const creatorExists = cadastros.find(user => user.id === creatorId);

    if(!creatorExists){
        return res.status(400).json({error: 'Usuário criador não encontrado'});
    }


    thisChatId = chats.length + 1;
    
    const newChat = new Chat(thisChatId, participants, messages);
    creatorExists.chats.push(newChat)
    chats.push(newChat);
    res.status(201).json(newChat);
});

module.exports = router;