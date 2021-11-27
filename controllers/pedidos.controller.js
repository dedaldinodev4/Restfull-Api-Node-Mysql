const mysql = require('../mysql');

exports.getPedidos = async (req, res, next) => {
    try {
        const query = `SELECT 
                            pedidos.id_pedido,
                            pedidos.qtd,
                            produtos.id,
                            produtos.nome,
                            produtos.preco 
                        FROM pedidos JOIN produtos 
                        ON pedidos.id_produto=produtos.id`;
        const result = await mysql.execute(query);
        const response = {
            quantidade: result.length,
            pedidos: result.map(pedido => {
                return {
                    id_pedido: pedido.id_pedido,
                    quantidade: pedido.qtd,
                    produto: {
                        id_produto: pedido.id_produto,
                        nome: pedido.nome,
                        preco: pedido.preco
                    },
                    request: {
                        tipo: 'GET',
                        descricao: 'Retorna detalhe de um pedido específico',
                        url: 'http://localhost:3000/pedidos/' + pedido.id_pedido
                    }
                }
            })
        }
        return res.status(200).send(response);
    } catch (error) {
        return res.status(500).send({message: error});
    }
};

exports.postPedidos = async (req, res, next) => {
    try {

        const query = 'INSERT INTO pedidos (id_produto, qtd) VALUES (?,?)';
        const result = await mysql.execute(query, 
            [req.body.id_produto, 
                req.body.quantidade]);
        
        const response = {
            message: "Pedido inserido com sucesso",
            pedido: {
                id_pedido: result.id_pedido,
                id_produto: req.body.id_produto,
                quantidade: req.body.quantidade,
                request: {
                    tipo: 'GET',
                    descricao: 'Retorna todos os pedidos',
                    url: 'http://localhost:3000/pedidos'
                }
            }
        }
        
        return res.status(201).send(response);

    } catch(error) {
        return res.status(500).send({ message: error});
    } 
}

exports.getUmPedido = async (req, res, next) => {
    try {
        const queryAll = `SELECT 
                            pedidos.id_pedido,
                            pedidos.qtd,
                            produtos.id,
                            produtos.nome,
                            produtos.preco 
                        FROM pedidos JOIN produtos 
                            ON pedidos.id_produto=produtos.id
                        WHERE pedidos.id_pedido=?`;
        const result = await mysql.execute(queryAll, [req.params.id_pedido]);
        
        if (result.length === 0) {
            return res.status(404).send({
                message: "Não foi encontrado pedido com este ID "+req.params.id_pedido
            });
        }

        const response = {
            pedido: {
                id_pedido: result[0].id_pedido,
                quantidade: result[0].qtd,
                produto: {
                    id_produto: result[0].id,
                    nome: result[0].nome,
                    preco: result[0].preco
                },
                request: {
                    tipo: 'GET',
                    descricao: 'Retorna todos os pedidos',
                    url: 'http://localhost:3000/pedidos'
                }
            }
        }
        return res.status(200).send(response);

    } catch (error) {
        return res.status(500).send({ message: error});
    }
};

exports.updatePedido = async (req, res, next) => {
    try {
        const queryAll = 'SELECT * FROM pedidos WHERE id_pedido=?';
        const result = await mysql.execute(queryAll, [req.body.id_pedido]);

        if (result.length === 0) {
            return res.status(404).send({
                message: "Não foi encontrado pedido com este ID "+req.body.id_pedido
            });
        }

        const queryPut = `UPDATE pedidos SET id_produto = ?, 
                            qtd = ? WHERE id_pedido = ?`;
        await mysql.execute(queryPut,
            [req.body.id_produto, 
                req.body.quantidade, 
                req.body.id_pedido] 
        );

        const response = {
            message: "Pedido atualizado com sucesso",
            pedido: {
                id_pedido: req.body.id_pedido,
                id_produto: req.body.id_produto,
                quantidade: req.body.quantidade,
                request: {
                    tipo: 'GET',
                    descricao: 'Retorna detalhe de um pedido específico',
                    url: 'http://localhost:3000/pedidos/' + req.body.id_pedido
                }
            }
        }
        return res.status(202).send(response);

    } catch (error) {
        return res.status(500).send({ message: error});
    }
};

exports.deletePedido = async (req, res, next) => {
    try {
        const queryAll = 'SELECT * FROM pedidos WHERE id_pedido=?';
        const result = await mysql.execute(queryAll, [req.body.id_pedido]);
        
        if (result.length === 0) {
            return res.status(404).send({
                message: "Não foi encontrado pedido com este ID "+req.body.id_pedido
            });
        }

        const queryRemove = `DELETE FROM pedidos WHERE id_pedido = ?`;
        await mysql.execute(queryRemove, [req.body.id_pedido]);
        const response = {
            message: "Pedido removido com sucesso",
            request: {
                tipo: 'POST',
                descricao: 'Insere um pedido',
                url: 'http://localhost:3000/pedidos',
                body: {
                    id_produto: "Number",
                    quantidade: "Number"
                }
            }
        }
        return res.status(202).send(response);

    } catch (error) {
        return res.status(500).send({ message: error})
    }
}