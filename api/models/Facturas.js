/**
 * Facturas.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    cliente:{
        type: 'string'
    },
    direccionCliente:{
        type: 'string'
    },
    celularCliente:{
        type: 'string'
    },
    domicilio:{
        type: 'boolean'
    },
    mesa:{
        type: 'boolean'
    },
    idVendedor:{
        model: 'personas',
        required: true
    },
    estado:{
        type: 'number',  //0 proceso- 1 completado 2 Eliminado 3 Cancelado 4 Novedad 5 Enviado 
        defaultsTo: 0
    },
    codigo:{
        type: 'string',
        required: true
    },
    precio:{
        type: 'integer',
        defaultsTo: 0
    },
    create:{
        type: 'string'
    },
    comision:{
        type: 'integer',
        defaultsTo: 0
    },
    fecha_pedido:{
        type: 'string',
        required: true
    },
    detalles:{
        type: 'string'
    }

  },

};

