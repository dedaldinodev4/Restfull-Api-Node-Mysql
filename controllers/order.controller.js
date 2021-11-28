const mysql = require('../mysql');

exports.getOrders = async (req, res, next) => {
    try {
        const query = `SELECT 
                            orders.orderId,
                            orders.quantity,
                            products.productId,
                            products.name,
                            products.price 
                        FROM orders JOIN products 
                        ON orders.productId=products.productId`;
        const result = await mysql.execute(query);
        const response = {
            length: result.length,
            orders: result.map(order => {
                return {
                    orderId: order.orderId,
                    quantity: order.quantity,
                    product: {
                        productId: order.productId,
                        name: order.name,
                        price: order.price
                    },
                    request: {
                        type: 'GET',
                        description: 'Retorna detalhe de um pedido específico',
                        url: process.env.URL_API + 'orders/' +order.orderId
                    }
                }
            })
        }
        return res.status(200).send(response);
    } catch (error) {
        return res.status(500).send({ error: error});
    }
};

exports.postOrder = async (req, res, next) => {
    try {

        var query = 'SELECT * FROM products WHERE productId = ?';
        const resultProduct = await mysql.execute(query, [req.body.productId]);

        if (resultProduct.length == 0) {
            return res.status(404).send({ message: 'Produto não encontrado'});
        }

        query = 'INSERT INTO orders (productId, quantity) VALUES (?,?)';
        const result = await mysql.execute(query, 
            [req.body.productId, 
                req.body.quantity]);
        
        const response = {
            message: "Pedido inserido com sucesso",
            createdOrder: {
                orderId: result.orderId,
                productId: req.body.productId,
                quantity: req.body.quantity,
                request: {
                    type: 'GET',
                    description: 'Retorna todos os pedidos',
                    url: process.env.URL_API +'orders'
                }
            }
        }
        
        return res.status(201).send(response);

    } catch(error) {
        return res.status(500).send({ error: error});
    } 
}

exports.getOrderDetail = async (req, res, next) => {
    try {
        const query = 'SELECT * FROM orders WHERE orderId = ?';
        const result = await mysql.execute(queryAll, [req.params.orderId]);
        
        if (result.length === 0) {
            return res.status(404).send({
                message: "Não foi encontrado pedido com este ID "+req.params.orderId
            });
        }

        const response = {
            order: {
                orderId: result[0].orderId,
                productId: result[0].productId,
                quantity: result[0].quantity,
                request: {
                    type: 'GET',
                    description: 'Retorna todos os pedidos',
                    url: process.env.URL_API + 'orders'
                }
            }
        }
        return res.status(200).send(response);

    } catch (error) {
        return res.status(500).send({ error: error});
    }
};

exports.updateOrder = async (req, res, next) => {
    try {
        var query = 'SELECT * FROM orders WHERE orderId=?';
        const result = await mysql.execute(query, [req.params.orderId]);

        if (result.length == 0) {
            return res.status(404).send({
                message: "Não foi encontrado pedido com este ID "+req.params.orderId
            });
        }

        query = `UPDATE orders 
                    SET productId   = ?, 
                        quantity    = ? 
                 WHERE orderId      = ?`;
        await mysql.execute(query,
            [req.body.productId, 
                req.body.quantity, 
                req.params.orderId] 
        );

        const response = {
            message: "Pedido atualizado com sucesso",
            updateOrder: {
                orderId: req.params.orderId,
                productId: req.body.productId,
                quantity: req.body.quantity,
                request: {
                    type: 'GET',
                    description: 'Retorna os detalhes de um pedido específico',
                    url: process.env.URL_API + 'orders/' + req.params.orderId
                }
            }
        }
        return res.status(202).send(response);

    } catch (error) {
        return res.status(500).send({ error: error});
    }
};

exports.deleteOrder = async (req, res, next) => {
    try {
        var query = 'SELECT * FROM orders WHERE orderId=?';
        const result = await mysql.execute(query, [req.params.orderId]);
        
        if (result.length == 0) {
            return res.status(404).send({
                message: "Não foi encontrado pedido com este ID "+req.params.orderId
            });
        }

        query = `DELETE FROM orders WHERE orderId = ?`;
        await mysql.execute(query, [req.params.orderId]);
        const response = {
            message: "Pedido removido com sucesso",
            request: {
                type: 'POST',
                description: 'Insere um pedido',
                url: process.env.URL_API + 'orders',
                body: {
                    productId: "Number",
                    quantity: "Number"
                }
            }
        }
        return res.status(202).send(response);

    } catch (error) {
        return res.status(500).send({ error: error})
    }
}