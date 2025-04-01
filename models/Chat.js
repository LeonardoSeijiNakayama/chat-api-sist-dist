class Chat {
    constructor(id, participants, messages = []) {
      this.id = id;
      this.participants = participants;
      this.messages = messages;
      this.clients = new Set(); 
    }
  }
  
  module.exports = Chat;
  