const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const bodyParser = require('body-parser');
const messageRoutes = require('./api/messages');
const cadastroRoutes = require('./api/cadastros');
const chatRoutes = require('./api/chats');

const app = express();
const server = http.createServer(app);
const PORT = 3000;

// Configuração do Socket.IO
const io = new Server(server, {
  cors: { origin: "http://localhost:5173" } // Libera conexão do frontend
});

// Middlewares
app.use(bodyParser.json());

// Rotas HTTP
app.use('/api', cadastroRoutes);
app.use('/api', messageRoutes);
app.use('/api', chatRoutes);

// Eventos do Socket.IO
io.on('connection', (socket) => {
  console.log('Usuário conectado via Socket.IO');

  socket.on('message', (data) => {
    // Broadcast da mensagem para todos os clientes
    io.emit('message', { 
      text: data.text, 
      username: data.username 
    });

    // --- Opcional: Salvar no "banco de dados" em memória ---
    const chatId = data.chatId; // Adicione chatId ao frontend
    const chatExists = chats.find(chat => chat.id === chatId);
    if (chatExists) {
      const newMessage = new Message(
        chatExists.messages.length + 1,
        data.userId, // Adicione userId ao frontend
        chatId,
        data.text,
        data.username
      );
      chatExists.messages.push(newMessage);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});