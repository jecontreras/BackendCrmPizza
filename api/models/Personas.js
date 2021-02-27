/**
 * Personas.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    rol:{
        model: 'roles',
        required: true
    },
    idToken:{
        type: 'string'
    },
    cedula:{
        type: 'string'
    },
    email:{
        type: 'string',
        required: true
    },
    password:{
        type: 'string',
        required: true
    },
    nombre:{
        type: 'string',
        required: true  
    },
    apellido:{
        type: 'string',
        required: true  
    },
    celular:{
        type: 'string'
    },
    username:{
        type: 'string',
        required: true
    },
    idFoto:{
        type: 'string',
        defaultsTo: './assets/perfil.png'
    },
    estado:{
        type: 'number',  //0 activo - 1 eliminado 
        defaultsTo: 0
    }

  },
    customToJSON: function(){
    return _.omit(this, ['password', 'salt']);
  }

};

