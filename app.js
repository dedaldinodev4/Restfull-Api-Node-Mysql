const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');



//* Rotas *//
const productRoute  =   require('./routes/product.routes');
const orderRoute    =   require('./routes/orders.routes');
const userRoute     =   require('./routes/user.routes');
const imageRoute    =   require('./routes/image.routes');    
const categoryRoute =   require('./routes/category.routes');

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));//Diretorio Totalmente público
app.use(bodyParser.urlencoded({ extended: false})); // Apenas dados simples
app.use(bodyParser.json()); // Json de entrada no body


//* CORS *//
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Header',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).send({});
    }

    next();
})

//* Usando Rotas *//
app.use('/products', productRoute);
app.use('/orders', orderRoute);
app.use('/users', userRoute);
app.use('/images', imageRoute);
app.use('/categories', categoryRoute);

app.use((req, res, next) => {
    const erro = new Error('Não Encontrado');
    erro.status = 404;
    next(erro);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    return res.send({
        erro: {
            mensagem: error.message
        }
        
    })
});

module.exports = app;