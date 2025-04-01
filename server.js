const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const messagesRoutes = require('./routes/messages'); // Ajuste o caminho se necessário
const chatsRoutes = require('./routes/chats');
const cadastrosRoutes = require('./routes/cadastros');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Rotas
app.use('/api', messagesRoutes);
app.use('/api', chatsRoutes);
app.use('/api', cadastrosRoutes);

// Rota básica para testar
app.get('/', (req, res) => {
  res.send('API do Chat Online');
});

// Iniciar servidor HTTP
const server = app.listen(PORT, () => {
  console.log(`Servidor HTTP rodando na porta ${PORT}`);
});

//###############################################################################################################################################

const WebSocket = require('ws');
const { chats, cadastros } = require('./data/db');
const Message = require('./models/Message');

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    const data = JSON.parse(message);

    // Usuário quer entrar no chat
    if (data.type === "join") {
      ws.userId = data.userId;
      ws.chatId = data.chatId;
      console.log('Entrou no join');

      const chatExists = chats.find(chat => chat.id === parseInt(data.chatId));
      if (!chatExists) {
        console.log('Caiu no erro 1');
        console.log(data.chatId);
        return ws.send(JSON.stringify({ type: "error", message: "Chat não encontrado." }));
      }

      const userIsInChat = chatExists.participants.find(user => user.id === parseInt(data.userId));
      if (!userIsInChat) {
        console.log('Caiu no erro 2');
        return ws.send(JSON.stringify({ type: "error", message: "Usuário não pertence ao chat." }));
      }

      chatExists.clients.add(ws);
      console.log(`Usuário ${data.userId} entrou no chat ${data.chatId}`);
    }

    // Usuário envia mensagem
    if (data.type === "message") {
      const { userId, chatId, content, userName } = data;

      const chatExists = chats.find(chat => chat.id === parseInt(chatId));
      if (!chatExists) {
        return ws.send(JSON.stringify({ type: "error", message: "Chat não encontrado." }));
      }

      const userExists = cadastros.find(user => user.id === parseInt(userId));
      if (!userExists) {
        return ws.send(JSON.stringify({ type: "error", message: "Usuário inválido." }));
      }

      const userIsInChat = chatExists.participants.find(user => user.id === parseInt(userId));
      if (!userIsInChat) {
        return ws.send(JSON.stringify({ type: "error", message: "Usuário não pertence ao chat." }));
      }

      const messageId = chatExists.messages.length+1;

      // Criar e armazenar a nova mensagem
      const newMessage = new Message(
        messageId,
        userId,
        chatId,
        content,
        userName
      );

      chatExists.messages.push(newMessage);

      // Enviar mensagem para todos os usuários do chat
      chatExists.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: "message", messageId, userId, userName, content}));
        }
      });
    }
  });

  ws.on("close", () => {
    if (ws.chatId) {
      const chat = chats.find(c => c.id === ws.chatId);
      if (chat && chat.clients) {
        chat.clients.delete(ws);
      }
    }
  });
});
