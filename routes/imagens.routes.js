const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const Controller = require('../controllers/imagens.controller');

router.delete('/:id_imagem', auth.obrigatorio, Controller.deleteImagem);

module.exports = router;