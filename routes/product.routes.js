const express = require('express');
const router = express.Router();
const multer = require('multer');
const auth = require('../middleware/auth');

const ProductsController = require('../controllers/product.controller');

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

router.get('/', ProductsController.getProducts);
router.post('/', 
    auth.required ,
    upload.single('image'), 
    ProductsController.postProduct    
);
router.get('/:productId', ProductsController.getProductDetail);
router.patch('/:productId', auth.required, ProductsController.updateProduct);
router.delete('/:productId', auth.required, ProductsController.deleteProduct);

//* Images *//
router.post('/:productId/image', 
    auth.required, 
    upload.single('image'),
    ProductsController.postImage
);

router.get('/:productId/images', ProductsController.getImages);
 
module.exports = router;