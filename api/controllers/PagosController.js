/**
 * PagosController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

let Procedures = Object();

Procedures.querys = async(req, res)=>{
    let params = req.allParams();
    let resultado = Object();
    resultado = await QuerysServices(Pagos,params);
    for( let row of resultado.data ){
      row.idPersona = await Personas.findOne( { id: row.idPersona } );
    }
    return res.ok( { status: 200, ...resultado } );
}

Procedures.create = async( req, res )=>{
  let params = req.allParams();
  let resultado = Object();
  resultado = await ResumenCuenta.validandoEntrada( {
    valorEntrante: params.monto,
    tipoEntrada: 1,
    idPersona: params.idPersona
  } );
  resultado = await Pagos.create( params ).fetch();
  resultado = await ResumenCuenta.restandoPuntos( { idVendedor: params.idPersona } );
  return res.status( 200 ).send( resultado );
}

module.exports = Procedures;
