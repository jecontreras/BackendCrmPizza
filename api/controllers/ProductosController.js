/**
 * ProductosController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

let Procedures = Object();
var crypto = require("crypto");

Procedures.querys = async (req, res) => {
    let params = req.allParams();
    let resultado = Object();

    resultado = await QuerysServices(Productos, params);
    for (let row of resultado.data) {
        row.foto = row.image;
        row.valor = row.precio;
        row.files = [ row.image ];
    }

    return res.ok({ status: 200, ...resultado });
}


module.exports = Procedures;