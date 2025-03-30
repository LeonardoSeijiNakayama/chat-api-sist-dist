const express = require('express');
const router = express.Router();
const {cadastros} = require('../data/db');
const User = require('../models/User');

router.get('/cadastros', (req, res) =>{
    res.json(cadastros);
});

router.post('/cadastros', (req, res) => {
    const {id, name, email, password} = req.body;

    if(!id || !name || !email || !password){
        return res.status(400).json({error : 'Usuário, id e email são obrigatórios'})
    }

    userExists = cadastros.find(user => user.id === id);

    if(userExists){
        return res.status(400).json({error: 'Id de usuário já está sendo utilizado'});
    }

    const newUser = new User(id, name, email, password);

    cadastros.push(newUser);
    res.status(201).json(newUser);
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = cadastros.find(u => u.email === email);
    
    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    if(user.password != password){
        return res.status(401).json({error: 'Senha inválida'});
    }
    // Simples validação (em produção, use bcrypt + JWT)
    res.json({ success: true, username: user.name });
  });

module.exports = router;