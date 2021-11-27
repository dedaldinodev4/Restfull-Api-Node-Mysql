const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Controller = require('../controllers/pedidos.controller');

router.get('/', Controller.getPedidos);
router.post('/', auth.obrigatorio, Controller.postPedidos);
router.get('/:id_pedido', Controller.getUmPedido);
router.patch('/', auth.obrigatorio, Controller.updatePedido);
router.delete('/', auth.obrigatorio, Controller.deletePedido);

module.exports = router;