const mysql = require('../mysql');

exports.deleteImage = async (req, res, next) => {
    try {
        
        var query = 'SELECT * FROM products WHERE productId=?';
        const result = await mysql.execute(query,[req.body.productId]);
        if (result.length == 0) {
            return res.status(404).send({
                message: "Não foi encontrado produto com este ID "+req.body.productId
            });
        }

        query = 'SELECT * FROM productImages WHERE imageId=?';
        const resultImg = await mysql.execute(query, [req.params.imageId]);
        if (resultImg.length == 0) {
            return res.status(404).send({
                message: "Não foi encontrada Imagem com este ID"
            });
        }

        query = 'DELETE FROM productImages WHERE imageId = ?';
        await mysql.execute(query, [req.params.imageId]);
        const response = {
            message: "Imagem removida com sucesso",
            request: {
                type: 'POST',
                description: 'Insere uma imagem no produto',
                url: process.env.URL_API +'products/'+req.body.productId+'/imagem',
                body: {
                    productId: "Number",
                    path: "File"
                }
            }
        }
        return res.status(202).send(response);
    } catch (error) {
        return res.status(500).send({ error: error});
    }
};