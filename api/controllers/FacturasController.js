/**
 * FacturasController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

let Procedures = Object();
let EstadosList = ["En Proceso", 'Completado', 'Eliminado', 'Cancelado', 'Novedad', 'Enviando'];
const _ = require('lodash');
const moment = require('moment'),
momentz = require('moment-timezone');

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
    data.create = fechasEt();
    resultado = await Facturas.create( data ).fetch();
    return resultado;
}

Procedures.createFacturaArticulo = async(data)=>{
    let resultado = Object();
    data.create = fechasEt();
    resultado = await FacturasArticulos.create(data);
    return resultado;
}

function fechasEt() {
 let fecha = momentz();
 fecha.tz('America/Bogota').format('ha z');  // 5am PDT
 sails.log.info(60, new moment(fecha).format(), 'hora', new moment().format());
 fecha = new moment(fecha).add(0, 'days');
 fecha = new moment(fecha).format('DD/MM/YYYY');
 return fecha;
}


Procedures.update = async( req, res )=>{
    let params = req.allParams();
    // actualizacion de la factura
    await Facturas.update( { id: params.id }, params );

    let result = await ResumenCuenta.validandoEventosNew( params );

    if( !result.status !== 200 ) return res.status( 200 ).send( result );
    return res.status(200).send( { status: 200, data: "Completado Exitos"});
}

Procedures.resumen = async( req, res )=>{
    let params = req.allParams();
    let resultado = Array();
    resultado = await FacturasArticulos.find( { where: { create: params.where.create } } ).limit( 10000 ).populate('producto');
    console.log("****", resultado.length)
    let result = Object({
        pizzas: [],
        pizzasGrande: [],
        pizzasMediana: [],
        pizzeta: [],
        gaceosas: [],
        lasana: [],
        valorPizzas: 0,
        valorPizzasGrande: 0,
        valorPizzasMediana: 0,
        valorPizzetas: 0,
        valorGaceosa: 0,
        valorlasana: 0,
        valorTotal: 0
    });
    //console.log("***************", resultado );
    for( let row of resultado ){
        try {
            /*  Pizza porcion */
            if( row.producto.categoria == 1 ){
                let filtro = _.findIndex( result.pizzas, [ 'id', row.producto.id ] );
                //console.log("******++index", filtro)
                if( filtro >= 0 ){
                    result.pizzas[ filtro ].cantidad++;
                    result.pizzas[ filtro ].precioTotal= result.pizzas[ filtro ].cantidad * result.pizzas[ filtro ].precio;
                }else result.pizzas.push( {
                    titulo: row.producto.titulo,
                    id: row.producto.id,
                    cantidad: 1,
                    precio: row.precio,
                    categoria: row.producto.categoria,
                    precioTotal: row.cantidad * row.precio
                });
                result.valorPizzas+= row.precio * row.cantidad;
            }
            /* Pizza Grande */
            if( row.producto.categoria == 6 ){
                let filtro = _.findIndex( result.pizzasGrande, [ 'id', row.producto.id ] );
                //console.log("******++index", filtro)
                if( filtro >= 0 ){
                    result.pizzasGrande[ filtro ].cantidad++;
                    result.pizzasGrande[ filtro ].precioTotal= result.pizzasGrande[ filtro ].cantidad * result.pizzasGrande[ filtro ].precio;
                }else result.pizzasGrande.push( {
                    titulo: row.producto.titulo,
                    id: row.producto.id,
                    cantidad: 1,
                    precio: row.precio,
                    categoria: row.producto.categoria,
                    precioTotal: row.cantidad * row.precio
                });
                result.valorPizzasGrande+= row.precio * row.cantidad;
            }

            /* Pizza Mediana */
            if( row.producto.categoria == 4 ){
                let filtro = _.findIndex( result.pizzasMediana, [ 'id', row.producto.id ] );
                //console.log("******++index", filtro)
                if( filtro >= 0 ){
                    result.pizzasMediana[ filtro ].cantidad++;
                    result.pizzasMediana[ filtro ].precioTotal= result.pizzasMediana[ filtro ].cantidad * result.pizzasMediana[ filtro ].precio;
                }else result.pizzasMediana.push( {
                    titulo: row.producto.titulo,
                    id: row.producto.id,
                    cantidad: 1,
                    precio: row.precio,
                    categoria: row.producto.categoria,
                    precioTotal: row.cantidad * row.precio
                });
                result.valorPizzasMediana+= row.precio * row.cantidad;
            }

            /* Pizzetas */
            if( row.producto.categoria == 5 ){
                let filtro = _.findIndex( result.pizzeta, [ 'id', row.producto.id ] );
                //console.log("******++index", filtro)
                if( filtro >= 0 ){
                    result.pizzeta[ filtro ].cantidad++;
                    result.pizzeta[ filtro ].precioTotal= result.pizzeta[ filtro ].cantidad * result.pizzeta[ filtro ].precio;
                }else result.pizzeta.push( {
                    titulo: row.producto.titulo,
                    id: row.producto.id,
                    cantidad: 1,
                    precio: row.precio,
                    categoria: row.producto.categoria,
                    precioTotal: row.cantidad * row.precio
                });
                result.valorPizzetas+= row.precio * row.cantidad;
            }

            /** Gaceosa */
            if( row.producto.categoria == 2 ){
                let filtro = _.findIndex( result.gaceosas, [ 'id', row.producto.id ] );
                //console.log("******++index", filtro)
                if( filtro >= 0 ){
                    result.gaceosas[ filtro ].cantidad++;
                    result.gaceosas[ filtro ].precioTotal= result.gaceosas[ filtro ].cantidad * result.gaceosas[ filtro ].precio;
                }else result.gaceosas.push( {
                    titulo: row.producto.titulo,
                    id: row.producto.id,
                    cantidad: 1,
                    precio: row.precio,
                    categoria: row.producto.categoria,
                    precioTotal: row.cantidad * row.precio
                });
                result.valorGaceosa+= row.precio * row.cantidad;
            }
            /**  Lasaña */
            if( row.producto.categoria == 3 ){
                let filtro = _.findIndex( result.lasana, [ 'id', row.producto.id ] );
                //console.log("******++index", filtro)
                if( filtro >= 0 ){
                    result.lasana[ filtro ].cantidad++;
                    result.lasana[ filtro ].precioTotal= result.lasana[ filtro ].cantidad * result.lasana[ filtro ].precio;
                }else result.lasana.push( {
                    titulo: row.producto.titulo,
                    id: row.producto.id,
                    cantidad: 1,
                    precio: row.precio,
                    categoria: row.producto.categoria,
                    precioTotal: row.cantidad * row.precio
                });
                result.valorlasana+= row.precio * row.cantidad;
            }
            result.valorTotal = result.valorPizzas + result.valorPizzasGrande + result.valorPizzasMediana + result.valorPizzetas + result.valorGaceosa + result.valorlasana;
        } catch (error) {
            continue;
        }
    }
    return res.status( 200 ).send( result );

}

module.exports = Procedures;