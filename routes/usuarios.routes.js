const express = require('express');
const router = express.Router();
const Controller = require('../controllers/usuarios.controller');

router.post('/cadastrar', Controller.registerUser);
router.post('/login', Controller.loginUser);

module.exports = router;