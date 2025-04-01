class Message {
    constructor(id, userId, chatId, content, userName) {
      this.id = id;
      this.userId = userId;
      this.chatId = chatId;
      this.content = content;
      this.timestamp = new Date().toISOString();
      this.userName = userName;
    }
  }
  
  module.exports = Message;
  