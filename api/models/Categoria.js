/**
 * Categoria.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    nombre:{
        type: 'string'
    },
    estado:{
        type: 'number',  //0 activo - 1 eliminado 
        defaultsTo: 0
    },
    ordenar:{
      type: 'number',
      defaultsTo: 0
    }
  },

};

