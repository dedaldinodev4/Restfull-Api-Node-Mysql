const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const imageController = require('../controllers/image.controller');

router.delete('/:imageId', auth.required, imageController.deleteImage);

module.exports = router;