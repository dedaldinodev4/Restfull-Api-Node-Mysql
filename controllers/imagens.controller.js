const mysql = require('../mysql');

exports.deleteImagem = async (req, res, next) => {
    try {
        
        const queryProduto = 'SELECT * FROM produtos WHERE id=?';
        const result = await mysql.execute(queryProduto,[req.body.id_produto]);
        if (result.length === 0) {
            return res.status(404).send({
                message: "Não foi encontrado produto com este ID"
            });
        }

        const queryAll = 'SELECT * FROM imagens_produtos WHERE id_imagem=?';
        const resultImg = await mysql.execute(queryAll, [req.params.id_imagem]);
        if (resultImg.length === 0) {
            return res.status(404).send({
                message: "Não foi encontrada Imagem com este ID"
            });
        }

        const queryRemove = 'DELETE FROM imagens_produtos WHERE id_imagem = ?';
        await mysql.execute(queryRemove, [req.body.id_produto]);
        const response = {
            message: "Imagem removida com sucesso",
            request: {
                tipo: 'POST',
                descricao: 'Insere uma imagem no produto',
                url: process.env.URL_API +'produtos/'+req.body.id_produto+'/imagem',
                body: {
                    id_produto: "Number",
                    imagem: "File"
                }
            }
        }
        return res.status(202).send(response);
    } catch (error) {
        return res.status(500).send({ message: error});
    }
};