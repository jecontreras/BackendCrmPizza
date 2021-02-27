/**
 * FacturasController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

let Procedures = Object();
let EstadosList = ["En Proceso", 'Completado', 'Eliminado', 'Cancelado', 'Novedad', 'Enviando'];
const _ = require('lodash');

Procedures.querys = async(req, res)=>{
    let params = req.allParams();
    let resultado = Object();
    resultado = await QuerysServices(Facturas,params);
    for(let row of resultado.data){
    	row.idVendedor = await Personas.findOne({id: row.idVendedor});
        row.productos = await FacturasArticulos.find({factura: row.id}).populate('producto');
        row.estadoName = EstadosList[row.estado];
    }
    return res.ok( { status: 200, ...resultado } );
}

Procedures.create = async(req, res)=>{
    let params = req.allParams();
    let resultado = Object();
    params.factura.cliente = params.cliente;
    resultado = await Procedures.createFactura( params.factura );
    for(let row of params.articulo){
        let data = {
            factura: resultado.id,
            precio: row.precio,
            descripcion: row.descripcion,
            cantidad: row.cantidad || 1,
            producto: row.id
        };
        let respor = await Procedures.createFacturaArticulo( data );
    }
    resultado = await Facturas.findOne( { id: resultado.id } ).populate( 'idVendedor' );
    resultado.productos = await FacturasArticulos.find( { factura: resultado.id } ).populate( 'producto' );
    let rpx = await ResumenCuenta.validandoEventosNew( { id: resultado.id, idVendedor: resultado.idVendedor.id, estado: resultado.estado } );
    return res.ok( { status:200, data: resultado } );
}

Procedures.createFactura = async(data)=>{
    let resultado = Object();
    resultado = await Facturas.create(data).fetch();
    return resultado;
}

Procedures.createFacturaArticulo = async(data)=>{
    let resultado = Object();
    resultado = await FacturasArticulos.create(data);
    return resultado;
}

Procedures.update = async( req, res )=>{
    let params = req.allParams();
    // actualizacion de la factura
    await Facturas.update( { id: params.id }, params );

    let result = await ResumenCuenta.validandoEventosNew( params );

    if( !result.status !== 200 ) return res.status( 200 ).send( result );
    return res.status(200).send( { status: 200, data: "Completado Exitos"});
}

module.exports = Procedures;