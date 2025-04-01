//Importa o Express, que facilita a criação de servidores e rotas em Node.js.
const express = require('express');
const router = express.Router();
const {cadastros} = require('../data/db');
const {chats} = require('../data/db');
const Message = require(`../models/Message`);

// Simulando banco de dados em memória com um array vazio

// Rota GET para buscar todas as mensagens
//app.get('/api/messages'): Define uma rota do tipo GET no caminho /api/messages.
//(req, res) => {}: É uma função callback que será executada quando a rota for acessada. req = Requisição, res = Resposta
router.get('/messages', (req, res) => {
  const chatId = req.query.chatId;

  if(!chatId){
    return res.status(401).json({error: 'Id do chat é obrigatório'});
  }

  const chatExists = chats.find(n => n.id === Number(chatId));

  if(!chatExists){
    return res.status(401).json({error: 'Id do chat inválido'});
  }

  //Envia a lista messages em formato JSON como resposta.
  res.json(chatExists.messages);
});

// Rota POST para adicionar uma nova mensagem
router.post('/messages', (req, res) => {
  //Usa desestruturação para extrair userId e content do req.body (o corpo da requisição).
  const { userId, chatId, content, userName } = req.body;

  if( !userId || !chatId || !content || !userName){
    return res.status(400).json({ error: 'Úsuário e conteúdo são obrigatórios'});
  }

  const userExists = cadastros.find(user => user.id === userId);

  if(!userExists){
    return res.status(400).json({error: 'Usuário não encontrado'});
  }

  const chatExists = chats.find(n => n.id === chatId);

  if(!chatExists){
    return res.status(400).json({error: 'Chat inválido'});
  }

  const userIsInChat = chatExists.participants.find(user => user.id === userId);

  if(!userIsInChat){
    return res.status(400).json({error : 'Esse usuário não está nesse chat'});
  }

  const newMessage = new Message(chatExists.messages.length + 1, userId, chatId, content, userName);
  chatExists.messages.push(newMessage);
  res.status(201).json(newMessage);
});

module.exports = router;



