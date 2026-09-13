const { pool } = require('../../config');
const { transporter } = require('../../libs/mailer');
const { prepararDatosSolicitudViajeVendedores,             prepararAprobarSolicitudViajeVendedoresJefeDirecto, 
    prepararRechazarSolicitudViajeVendedoresJefeDirecto, prepararAprobarSolicitudViajeVendedoresTesoreria,
    prepararRechazarSolicitudViajeVendedoresTesoreria, prepararAprobarRendicionViajeVendedoresJefeDirecto, 
    prepararRechazarRendicionViajeVendedoresJefeDirecto, prepararAprobarRendicionViajeVendedoresTesoreria, prepararRechazarRendicionViajeVendedoresTesoreria } = require('../../mod-correo/notificaciones/correo-solicitud-dinero');


//VIAJE VENDEDORES----------------------------------------
//Para jefe directo
// Modifica la función realizarSolicitud
const crearSolicitudViajeVendedores = async (req, res) => {
    try {
        const { id_empleado } = req.params;
        const { motivo_solicitud, datos } = req.body;
        monto = 0;
        //console.log('Datos: '+ datos);
        const response = await pool.query(`insert into solicitud_dinero(id_empleado,monto_solicitado,motivo_solicitud, id_tipo_solicitud, fecha_solicitud,estado) values($1,0,$2,2,now(),'pendiente');`, [id_empleado, motivo_solicitud]);

        if (response.rowCount > 0) {
            const result = await pool.query(`select * from solicitud_dinero where id_empleado=$1 order by id_solicitud_dinero desc limit 1`, [id_empleado]);
            //console.log('Result:'+ result.rows[0].id_solicitud_dinero);
            for (const element of datos) {
                console.log('Element: ' + element.importe);
                monto += element.importe;
                const consulta = await pool.query(`insert into monto_por_tipo(id_solicitud_dinero,id_categoria_pedido,importe,observaciones) values($1,$2,$3,$4);`, [result.rows[0].id_solicitud_dinero, element.id_categoria_pedido, element.importe,
                element.observaciones]);
            }
            const setMonto = await pool.query(`update solicitud_dinero set monto_solicitado=$1 where id_solicitud_dinero= $2;`, [monto, result.rows[0].id_solicitud_dinero]);
            console.log('monto total:' + monto);

            await prepararDatosSolicitudViajeVendedores(result.rows[0].id_solicitud_dinero, id_empleado, motivo_solicitud, datos, req, res);

            res.status(200).json('Solicitud cargada con éxito');
        } else {
            res.status(500).json('Error al crear la solicitud');
        }
    } catch (error) {
        console.error(error);
        res.status(500).json('Error interno del servidor');
    }
}

const aprobarViajeVendedoresJefeDirecto = async (req, res) => {
    try {
        const { id_solicitud_dinero } = req.params;
        const consulta = await pool.query(`select * from solicitud_dinero s join tipos_solicitudes ts 
        on s.id_tipo_solicitud=ts.id_tipo_solicitud where id_solicitud_dinero=$1 `, [id_solicitud_dinero]);
        //console.log(consulta);
        if (consulta.rows[0].estado == 'pendiente' && consulta.rows[0].id_tipo_solicitud == 2) {
            const response = await pool.query(`insert into estados_solicitud(motivo,fecha,id_tipo_estado_solicitud,id_empleado,id_solicitud_dinero) values
            ('',now(),1,$1,$2);`, [consulta.rows[0].id_empleado, id_solicitud_dinero]);
            if (response.rowCount > 0) {
                //Enviar mail a tesoreria
                await prepararAprobarSolicitudViajeVendedoresJefeDirecto(id_solicitud_dinero, req,res);
                res.status(200).json({
                    message: 'Solicitud aprobada'
                });
            } else {
                res.status(501).json({
                    message: 'No pudo aprobarse solicitud'
                });
            }
        } else {
            res.status(200).json('No se puede realizar acción.')
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error al editar solicitud'
        });
    }
};

const rechazarViajeVendedoresJefeDirecto = async (req, res) => {
    try {
        const { id_solicitud_dinero } = req.params;
        const { motivo } = req.body;
        const consulta = await pool.query(`select * from solicitud_dinero s join tipos_solicitudes ts 
        on s.id_tipo_solicitud=ts.id_tipo_solicitud where id_solicitud_dinero=$1 `, [id_solicitud_dinero]);
        //console.log(consulta);
        if (consulta.rows[0].estado == 'pendiente' && consulta.rows[0].id_tipo_solicitud == 2) {
            const response = await pool.query(`insert into estados_solicitud(motivo,fecha,id_tipo_estado_solicitud,id_empleado,id_solicitud_dinero) values
            ($1,now(),2,$2,$3);`, [motivo, consulta.rows[0].id_empleado, id_solicitud_dinero]);
            if (response.rowCount > 0) {
                const response = await pool.query(`update solicitud_dinero set estado='rechazado' where id_solicitud_dinero= $1`, [id_solicitud_dinero]);
                //Enviar mail a empleado
                await prepararRechazarSolicitudViajeVendedoresJefeDirecto(id_solicitud_dinero, req, res);
                res.status(200).json({
                    message: 'Solicitud denegara'
                });
            } else {
                res.status(501).json({
                    message: 'No se pudo denegar solicitud'
                });
            }
        } else {
            res.status(200).json('No se puede realizar acción.')
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error al editar solicitud'
        });
    }
};

const aprobarViajeVendedoresTesoreria = async (req, res) => {
    try {
        const { id_solicitud_dinero } = req.params;
        const consulta = await pool.query(`select * from solicitud_dinero s join tipos_solicitudes ts 
        on s.id_tipo_solicitud=ts.id_tipo_solicitud where id_solicitud_dinero=$1 `, [id_solicitud_dinero]);
        //console.log(consulta);
        const tipoEstado = await pool.query(`select es.id_estado_solicitud, es.id_solicitud_dinero,es.id_tipo_estado_solicitud,
        es.motivo, ts.descripcion_tipo_estado, es.fecha, es.id_empleado from estados_solicitud es 
        join tipos_estado_solicitud ts on es.id_tipo_estado_solicitud= ts.id_tipo_estado_solicitud 
        where id_solicitud_dinero=$1 order by fecha desc limit 1`, [id_solicitud_dinero]);

        if (consulta.rows[0].estado == 'pendiente' && tipoEstado.rows[0].id_tipo_estado_solicitud == 1) {
            const response = await pool.query(`insert into estados_solicitud(motivo,fecha,id_tipo_estado_solicitud,id_empleado,id_solicitud_dinero) values
            ('',now(),7,$1,$2);`, [consulta.rows[0].id_empleado, id_solicitud_dinero]);
            if (response.rowCount > 0) {
                //Enviar mail a empleado
                await prepararAprobarSolicitudViajeVendedoresTesoreria(id_solicitud_dinero, req, res);
               res.status(200).json({
                    message: 'Pedido aprobado. '
                });
            } else {
                res.status(501).json({
                    message: 'No pudo aprobarse pedido.'
                });
            }
        } else {
            res.status(200).json('No se puede realizar acción.')
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error al editar solicitud'
        });
    }
};

const rechazarViajeVendedoresTesoreria = async (req, res) => {
    try {
        const { id_solicitud_dinero } = req.params;
        const { motivo } = req.body;
        const consulta = await pool.query(`select * from solicitud_dinero s join tipos_solicitudes ts 
        on s.id_tipo_solicitud=ts.id_tipo_solicitud where id_solicitud_dinero=$1 `, [id_solicitud_dinero]);
        //console.log(consulta);
        if (consulta.rows[0].estado == 'pendiente' && consulta.rows[0].id_tipo_solicitud == 2) {
            const response = await pool.query(`insert into estados_solicitud(motivo,fecha,id_tipo_estado_solicitud,id_empleado,id_solicitud_dinero) values
            ($1,now(),8,$2,$3);`, [motivo, consulta.rows[0].id_empleado, id_solicitud_dinero]);
            if (response.rowCount > 0) {
                const response = await pool.query(`update solicitud_dinero set estado='rechazado' where id_solicitud_dinero= $1`, [id_solicitud_dinero]);
                //Enviar mail a empleado
                await prepararRechazarSolicitudViajeVendedoresTesoreria(id_solicitud_dinero, req, res);
                res.status(200).json({
                    message: 'Solicitud denegara'
                });
            } else {
                res.status(501).json({
                    message: 'No se pudo denegar solicitud'
                });
            }
        } else {
            res.status(200).json('No se puede realizar acción.')
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error al editar solicitud'
        });
    }
};

const aprobarRendicionViajeVendedoresJefeDirecto = async (req, res) => {
    try {
        const { id_solicitud_dinero } = req.params;
        const consulta = await pool.query(`select * from solicitud_dinero s join tipos_solicitudes ts 
        on s.id_tipo_solicitud=ts.id_tipo_solicitud where id_solicitud_dinero=$1 `, [id_solicitud_dinero]);
        //console.log(consulta);
        const tipoEstado = await pool.query(`select es.id_estado_solicitud, es.id_solicitud_dinero,es.id_tipo_estado_solicitud,
        es.motivo, ts.descripcion_tipo_estado, es.fecha, es.id_empleado from estados_solicitud es 
        join tipos_estado_solicitud ts on es.id_tipo_estado_solicitud= ts.id_tipo_estado_solicitud 
        where id_solicitud_dinero=$1 order by fecha desc limit 1`, [id_solicitud_dinero]);

        if (consulta.rows[0].estado == 'pendiente' /* && tipoEstado.rows[0].id_tipo_estado_solicitud == 7 */) {
            const response = await pool.query(`insert into estados_solicitud(motivo,fecha,id_tipo_estado_solicitud,id_empleado,id_solicitud_dinero) values
            ('',now(),11,$1,$2);`, [consulta.rows[0].id_empleado, id_solicitud_dinero]);
            if (response.rowCount > 0) {
                //Enviar mail a tesoreria
                await prepararAprobarRendicionViajeVendedoresJefeDirecto(id_solicitud_dinero,req,res);
               res.status(200).json({
                    message: 'Rendición aprobada. '
                });
            } else {
                res.status(501).json({
                    message: 'No pudo aprobarse rendición.'
                });
            }
        } else {
            res.status(200).json('No se puede realizar acción.')
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error al editar solicitud'
        });
    }
};

const rechazarRendicionViajeVendedoresJefeDirecto = async (req, res) => {
    try {
        const { id_solicitud_dinero } = req.params;
        const consulta = await pool.query(`select * from solicitud_dinero s join tipos_solicitudes ts 
         on s.id_tipo_solicitud=ts.id_tipo_solicitud where id_solicitud_dinero=$1 `, [id_solicitud_dinero]);
        //console.log(consulta);
        if (consulta.rows[0].estado == 'pendiente') {
            const response = await pool.query(`insert into estados_solicitud(motivo,fecha,id_tipo_estado_solicitud,id_empleado,id_solicitud_dinero) values
             ('',now(),12,$1,$2);`, [consulta.rows[0].id_empleado, id_solicitud_dinero]);
            if (response.rowCount > 0) {
                //Enviar mail a Solicitante-empleado
                await prepararRechazarRendicionViajeVendedoresJefeDirecto(id_solicitud_dinero, req, res);
                res.status(200).json({
                    message: 'Presentacion de rendición final rechazada.'
                });
            } else {
                res.status(501).json({
                    message: 'No pudo rechazarse presentacion'
                });
            }
        } else {
            res.status(200).json('No se puede realizar acción ya que el estado del pedido fue editado')
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error al editar solicitud'
        });
    }
};

const aprobarRendicionViajeVendedoresTesoreria = async (req, res) => {
    try {
        const { id_solicitud_dinero } = req.params;
        const consulta = await pool.query(`select * from solicitud_dinero s join tipos_solicitudes ts 
        on s.id_tipo_solicitud=ts.id_tipo_solicitud where id_solicitud_dinero=$1 `, [id_solicitud_dinero]);
        //console.log(consulta);
        const tipoEstado = await pool.query(`select es.id_estado_solicitud, es.id_solicitud_dinero,es.id_tipo_estado_solicitud,
        es.motivo, ts.descripcion_tipo_estado, es.fecha, es.id_empleado from estados_solicitud es 
        join tipos_estado_solicitud ts on es.id_tipo_estado_solicitud= ts.id_tipo_estado_solicitud 
        where id_solicitud_dinero=$1 order by fecha desc limit 1`, [id_solicitud_dinero]);

        if (consulta.rows[0].estado == 'pendiente' && tipoEstado.rows[0].id_tipo_estado_solicitud == 11) {
            const response = await pool.query(`insert into estados_solicitud(motivo,fecha,id_tipo_estado_solicitud,id_empleado,id_solicitud_dinero) values
            ('',now(),17,$1,$2);`, [consulta.rows[0].id_empleado, id_solicitud_dinero]);
            if (response.rowCount > 0) {
                //Enviar mail a empleado
                await prepararAprobarRendicionViajeVendedoresTesoreria(id_solicitud_dinero, req, res);
                const respuesta = await pool.query(`update solicitud_dinero set estado='finalizado' where id_solicitud_dinero= $1`, [id_solicitud_dinero]);
                res.status(200).json({
                    message: 'Rendición viaje vendedores aprobada. Circuito cerrado. '
                });
            } else {
                res.status(501).json({
                    message: 'No pudo aprobarse rendición.'
                });
            }
        } else {
            res.status(200).json('No se puede realizar acción.')
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error al editar solicitud'
        });
    }
};


const rechazarRendicionViajeVendedoresTesoreria = async (req, res) => {
    try {
        const { id_solicitud_dinero } = req.params;
        const consulta = await pool.query(`select * from solicitud_dinero s join tipos_solicitudes ts 
         on s.id_tipo_solicitud=ts.id_tipo_solicitud where id_solicitud_dinero=$1 `, [id_solicitud_dinero]);
        //console.log(consulta);
        if (consulta.rows[0].estado == 'pendiente') {
            const response = await pool.query(`insert into estados_solicitud(motivo,fecha,id_tipo_estado_solicitud,id_empleado,id_solicitud_dinero) values
             ('',now(),18,$1,$2);`, [consulta.rows[0].id_empleado, id_solicitud_dinero]);
            if (response.rowCount > 0) {
                //Enviar mail a Solicitante-empleado
                await prepararRechazarRendicionViajeVendedoresTesoreria(id_solicitud_dinero, req, res);
                res.status(200).json({
                    message: 'Presentacion de rendición final rechazada.'
                });
            } else {
                res.status(501).json({
                    message: 'No pudo rechazarse presentacion'
                });
            }
        } else {
            res.status(200).json('No se puede realizar acción ya que el estado del pedido fue editado')
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error al editar solicitud'
        });
    }
};


module.exports = {
    crearSolicitudViajeVendedores,
    aprobarViajeVendedoresJefeDirecto,
    rechazarViajeVendedoresJefeDirecto,
    aprobarViajeVendedoresTesoreria,
    rechazarViajeVendedoresTesoreria,
    aprobarRendicionViajeVendedoresJefeDirecto,
    rechazarRendicionViajeVendedoresJefeDirecto,
    aprobarRendicionViajeVendedoresTesoreria,
    rechazarRendicionViajeVendedoresTesoreria
    
}