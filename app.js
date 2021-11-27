const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');



//* Rotas *//
const rotaProdutos  =   require('./routes/produtos.routes');
const rotaPedidos   =   require('./routes/pedidos.routes');
const rotaUsuarios  =   require('./routes/usuarios.routes');
const rotaImagens   =   require('./routes/imagens.routes');    

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
app.use('/produtos', rotaProdutos);
app.use('/pedidos', rotaPedidos);
app.use('/usuarios', rotaUsuarios);
app.use('/imagens', rotaImagens);

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