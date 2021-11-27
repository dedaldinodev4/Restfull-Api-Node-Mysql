
const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.registerUser = (req, res, next) => {

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ message: error})}
        conn.query('SELECT * FROM usuarios WHERE email=?', [req.body.email], (err, done, field) => {
            if (err) { return res.status(500).send({ message: err})}

            if(done.length > 0) {
                return res.status(409).send({ message: 'Já existe este email no banco'});
            }

            bcrypt.hash(req.body.senha, 10, (err, hash) => {
                if (err) { return res.status(500).send({ message: err})}

                conn.query(
                    'INSERT INTO usuarios (email, senha) VALUES (?,?)',
                    [req.body.email, hash],
                    (error, result, field) => {
                        conn.release(); //* Para a conexão *//
                        if(error) { return res.status(500).send({error: error}) }
                        const response = {
                            message: "Usuário inserido com sucesso",
                            usuário: {
                                id_usuario: result.insertId,
                                email: req.body.email,
                                request: {
                                    tipo: 'GET',
                                    descricao: 'Retorna todos os usuários',
                                    url: 'http://localhost:3000/usuarios'
                                }
                            }
                        }
                        return res.status(201).send(response);
                    }
                )

            })
        })

    });
};

exports.loginUser =  (req, res, next) => {

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ message: error})}
        conn.query('SELECT * FROM usuarios WHERE email=?', [req.body.email], (err, results, field) => {
            conn.release();

            if (err) { return res.status(500).send({ message: err})}

            if(results.length < 1) {
                return res.status(401).send({ message: 'Falha na autenticação'});
            }

            bcrypt.compare(req.body.senha, results[0].senha, (err, result) => {
                if (err) { 
                    return res.status(401).send({ message: 'Falha na autenticação'})
                }

                if (result) { 
                    const token = jwt.sign({
                        id_usuario: results[0].id_usuario,
                        email: results[0].email
                    }, process.env.JWT_KEY, {
                        expiresIn: "1h"
                    })
                    
                    return res.status(200).send({ 
                        message: 'Autenticado com sucesso',
                        token: token
                    })
                    
                }

                return res.status(401).send({ message: 'Falha na autenticação'})

            })
        })

    });
};