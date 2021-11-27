const express = require('express');
const router = express.Router();
const multer = require('multer');
const auth = require('../middleware/auth');

const Controller = require('../controllers/produtos.controller');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().getTime() + file.originalname);
    }
});



const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }    
}

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

router.get('/', Controller.getProdutos);
router.post('/', 
    upload.single('produto_imagem'), 
    auth.obrigatorio ,
    Controller.postProdutos    
);
router.get('/:id_produto', Controller.getUmProduto);
router.patch('/', auth.obrigatorio, Controller.updateProduto);
router.delete('/', auth.obrigatorio, Controller.deleteProduto);

router.post('/:id_produto/imagem', 
    auth.obrigatorio, 
    upload.single('produto_imagem'),
    Controller.postImagem
);

router.get('/:id_produto/imagens', Controller.getImagens);
 
module.exports = router;