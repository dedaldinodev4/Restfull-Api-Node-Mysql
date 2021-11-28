
const mysql = require('../mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.createUser = async (req, res, next) => {

    try {

        var query = 'SELECT * FROM users WHERE email = ?';
        const result = await mysql.execute(query, [ req.body.email] );

        if (result.length > 0) {
            return res.status(409).send({ message: 'Usuário já existe'});
        }

        const hash = await bcrypt.hashSync(req.body.password, 10);
        query = 'INSERT INTO users (email, password) VALUES (?,?)';
        const results = await mysql.execute(query, [ req.body.email, hash]);
        

        const response = {
            message: 'Usuário criado com sucesso',
            createdUsers: { email: req.body.email }
        
        }
        return res.status(201).send(response);

    } catch (error) {
        return res.status(500).send({ error: error });
    }
   

    
};

exports.loginUser = async (req, res, next) => {

    try {
        const query = `SELECT * FROM users WHERE email = ?`;
        const results = await mysql.execute(query, [req.body.email]);

        if (results.length < 1) {
            return res.status(401).send({ message: 'Falha na autenticação' });
        }

        if (await bcrypt.compareSync(req.body.password, results[0].password)) {
            const token = jwt.sign(
                {
                    userId: results[0].userId,
                    email: results[0].email
                },
                process.env.JWT_KEY,
                {
                    expiresIn: "1h"
                }
            );
            return res.status(200).send({
                message: 'Autenticado com sucesso',
                token: token
            });
        }

        return res.status(401).send({ message: 'Falha na autenticação'})
    } catch (error) {
        return res.status(500).send({ message: 'Falha na autenticação' });
    }

   
};