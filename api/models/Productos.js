/**
 * Productos.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    titulo:{
        type: 'string',
        required: true
    },
    slug: {
        type: 'string',
        required: true
    },
    precio: {
        type: 'integer'
    },
    estado: {
        type: 'boolean',
        defaultsTo: true
    },
    foto:{
        type: 'string'
    },
    categoria:{
        model: 'categoria'
    },
    codigo:{
        type: 'string'
    }
  },

};

