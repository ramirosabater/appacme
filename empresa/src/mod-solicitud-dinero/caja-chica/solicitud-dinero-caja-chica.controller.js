const { pool } = require('../../config');
const { prepararDatosSolicitudCajaChica, prepararAprobarCajaChicaJefeDirecto, prepararRechazarCajaChicaJefeDirecto, prepararAprobarCajaChicaAdministracion, prepararRechazarCajaChicaAdministracion, prepararAprobarRendicionCajaChicaJefeDirecto, prepararRechazarRendicionCajaChicaJefeDirecto, prepararAprobarRendicionCajaChicaAdministracion, prepararRechazarRendicionCajaChicaAdministracion } = require('../../mod-correo/notificaciones/caja-chica/correo-caja-chica');


//Crear solicitud caja chica
const createSolicitudCajaChica = async (req, res) => {
    const { id_empleado } = req.params;
    const { motivo_solicitud, monto, sub_tipo } = req.body;
    const consulta = await pool.query('select * from configuracion where id_configuracion=1;')
    const montoMaximo = consulta.rows[0].valor;

    if (sub_tipo == 0 && monto > montoMaximo) {
        res.status(500).json({
            message: 'La solicitud excede monto maximo permitido.'
        })
    } else {
        try {
            const response = await pool.query(`insert into solicitud_dinero(id_empleado,monto_solicitado,motivo_solicitud, id_tipo_solicitud, fecha_solicitud,estado, sub_tipo)
            values($1,$2,$3,1,now(),'pendiente',$4);`, [id_empleado, monto, motivo_solicitud, sub_tipo]);
            if (response.rowCount > 0) {
                const result = await pool.query(`select * from solicitud_dinero where id_empleado=$1 order by id_solicitud_dinero desc limit 1`, [id_empleado]);
                await prepararDatosSolicitudCajaChica(result.rows[0].id_solicitud_dinero, id_empleado, motivo_solicitud, monto, req, res)
                res.status(200).json({
                    message: 'solicitud de caja chica cargada correctamente'
                    //Envio de notificacion
                });
            } else {
                res.status(500).json({
                    message: 'No se pudo crear solicitud'
                });
            }
        } catch (error) {
            res.status(501).json({
                message: 'Error al crear solicitud'
            });
        }
    }
}


const aprobarCajaChicaJefeDirecto = async (req, res) => {
    try {
        const { id_solicitud_dinero } = req.params;
        const consulta = await pool.query(`select * from solicitud_dinero s join tipos_solicitudes ts 
        on s.id_tipo_solicitud=ts.id_tipo_solicitud where id_solicitud_dinero=$1 `, [id_solicitud_dinero]);
        if (consulta.rows[0].estado == 'pendiente') {
            const response = await pool.query(`insert into estados_solicitud(motivo,fecha,id_tipo_estado_solicitud,id_empleado,id_solicitud_dinero) values
            ('',now(),1,$1,$2);`, [consulta.rows[0].id_empleado, id_solicitud_dinero]);
            if (response.rowCount > 0) {
                //Enviar mail a administracion
                await prepararAprobarCajaChicaJefeDirecto(id_solicitud_dinero, req, res);
                res.status(200).json({
                    message: 'Solicitud aprobada'
                });
            } else {
                res.status(501).json({
                    message: 'No pudo aprobarse solicitud'
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


const denegarCajaChicaJefeDirecto = async (req, res) => {
    try {
        const { id_solicitud_dinero } = req.params;
        const { motivo } = req.body;
        const consulta = await pool.query(`select * from solicitud_dinero s join tipos_solicitudes ts 
        on s.id_tipo_solicitud=ts.id_tipo_solicitud where id_solicitud_dinero=$1 `, [id_solicitud_dinero]);
        if (consulta.rows[0].estado == 'pendiente') {
            const response = await pool.query(`insert into estados_solicitud(motivo,fecha,id_tipo_estado_solicitud,id_empleado,id_solicitud_dinero) values
            ($1,now(),2,$2,$3);`, [motivo, consulta.rows[0].id_empleado, id_solicitud_dinero]);
            if (response.rowCount > 0) {
                const response = await pool.query(`update solicitud_dinero set estado='rechazado' where id_solicitud_dinero= $1`, [id_solicitud_dinero]);
                //mail de notificacion
                await prepararRechazarCajaChicaJefeDirecto(id_solicitud_dinero, motivo, req, res);
                res.status(200).json({
                    message: 'Solicitud denegara'
                });
            } else {
                res.status(501).json({
                    message: 'No pudo  solicitud'
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


const aprobarCajaChicaAdministracion = async (req, res) => {
    try {
        const { id_solicitud_dinero } = req.params;
        const consulta = await pool.query(`select * from solicitud_dinero s join tipos_solicitudes ts 
        on s.id_tipo_solicitud=ts.id_tipo_solicitud where id_solicitud_dinero=$1 `, [id_solicitud_dinero]);
        if (consulta.rows[0].estado == 'pendiente') {
            const response = await pool.query(`insert into estados_solicitud(motivo,fecha,id_tipo_estado_solicitud,id_empleado,id_solicitud_dinero) values
            ('',now(),3,$1,$2);`, [consulta.rows[0].id_empleado, id_solicitud_dinero]);
            if (response.rowCount > 0) {
                await prepararAprobarCajaChicaAdministracion(id_solicitud_dinero, req, res);
                res.status(200).json({
                    message: 'Solicitud aprobada'
                });
            } else {
                res.status(501).json({
                    message: 'No pudo aprobarse solicitud'
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


const denegarCajaChicaAdministracion = async (req, res) => {
    try {
        const { id_solicitud_dinero } = req.params;
        const { motivo } = req.body;
        const consulta = await pool.query(`select * from solicitud_dinero s join tipos_solicitudes ts 
        on s.id_tipo_solicitud=ts.id_tipo_solicitud where id_solicitud_dinero=$1 `, [id_solicitud_dinero]);
        //console.log(consulta);
        if (consulta.rows[0].estado == 'pendiente') {
            const response = await pool.query(`insert into estados_solicitud(motivo,fecha,id_tipo_estado_solicitud,id_empleado,id_solicitud_dinero) values
            ($1,now(),4,$2,$3);`, [motivo, consulta.rows[0].id_empleado, id_solicitud_dinero]);
            if (response.rowCount > 0) {
                const response = await pool.query(`update solicitud_dinero set estado='rechazado' where id_solicitud_dinero= $1`, [id_solicitud_dinero]);
                //Mail a empleado
                await prepararRechazarCajaChicaAdministracion(id_solicitud_dinero, motivo, req, res);
                res.status(200).json({
                    message: 'Solicitud denegara'
                });
            } else {
                res.status(501).json({
                    message: 'No pudo  solicitud'
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


const aprobarRendicionCajaChicaJefeDirecto = async (req, res) => {
    try {
        const { id_solicitud_dinero } = req.params;
        const consulta = await pool.query(`select * from solicitud_dinero s join tipos_solicitudes ts 
        on s.id_tipo_solicitud=ts.id_tipo_solicitud where id_solicitud_dinero=$1 `, [id_solicitud_dinero]);
        //console.log(consulta);
        if (consulta.rows[0].estado == 'pendiente') {
            const response = await pool.query(`insert into estados_solicitud(motivo,fecha,id_tipo_estado_solicitud,id_empleado,id_solicitud_dinero) values
            ('',now(),11,$1,$2);`, [consulta.rows[0].id_empleado, id_solicitud_dinero]);
            if (response.rowCount > 0) {
                await prepararAprobarRendicionCajaChicaJefeDirecto(id_solicitud_dinero, req, res);
                res.status(200).json({
                    message: 'Rendición de solicitud aprobada.'
                });
            } else {
                res.status(501).json({
                    message: 'No pudo aprobarse rendición.'
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


const rechazarPresentacionRendicionFinalCajaChicaJefeDirecto = async (req, res) => {
    try {
        const { id_solicitud_dinero } = req.params;
        const consulta = await pool.query(`select * from solicitud_dinero s join tipos_solicitudes ts 
         on s.id_tipo_solicitud=ts.id_tipo_solicitud where id_solicitud_dinero=$1 `, [id_solicitud_dinero]);
        //console.log(consulta);
        if (consulta.rows[0].estado == 'pendiente') {
            const response = await pool.query(`insert into estados_solicitud(motivo,fecha,id_tipo_estado_solicitud,id_empleado,id_solicitud_dinero) values
             ('',now(),21,$1,$2);`, [consulta.rows[0].id_empleado, id_solicitud_dinero]);
            if (response.rowCount > 0) {
                await prepararRechazarRendicionCajaChicaJefeDirecto(id_solicitud_dinero, req, res);
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


const cierreCircuitoCajaChicaAdministracion = async (req, res) => {
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
            ('',now(),13,$1,$2);`, [consulta.rows[0].id_empleado, id_solicitud_dinero]);
            if (response.rowCount > 0) {
                await prepararAprobarRendicionCajaChicaAdministracion(id_solicitud_dinero, req, res);
                const respuesta = await pool.query(`update solicitud_dinero set estado='finalizado' where id_solicitud_dinero= $1`, [id_solicitud_dinero]);
                res.status(200).json({
                    message: 'Rendición de caja chica aprobada. Circuito cerrado. '
                });
            } else {
                res.status(501).json({
                    message: 'No pudo aprobarse rendición.'
                });
            }
        } else {
            res.status(200).json('No se puede realizar acción ya que el estado del pedido fue editado o el jefe directo no aprobo rendicion aun.')
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error al editar solicitud'
        });
    }
};

const rechazarRendicionCajaChicaAdministracion = async (req, res) => {
    try {
        const { id_solicitud_dinero } = req.params;
        const consulta = await pool.query(`select * from solicitud_dinero s join tipos_solicitudes ts 
         on s.id_tipo_solicitud=ts.id_tipo_solicitud where id_solicitud_dinero=$1 `, [id_solicitud_dinero]);
        //console.log(consulta);
        if (consulta.rows[0].estado == 'pendiente') {
            const response = await pool.query(`insert into estados_solicitud(motivo,fecha,id_tipo_estado_solicitud,id_empleado,id_solicitud_dinero) values
             ('',now(),14,$1,$2);`, [consulta.rows[0].id_empleado, id_solicitud_dinero]);
            if (response.rowCount > 0) {
                await prepararRechazarRendicionCajaChicaAdministracion(id_solicitud_dinero, req, res);
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
    createSolicitudCajaChica,
    aprobarCajaChicaJefeDirecto,
    denegarCajaChicaJefeDirecto,
    aprobarCajaChicaAdministracion,
    denegarCajaChicaAdministracion,
    rechazarPresentacionRendicionFinalCajaChicaJefeDirecto,
    aprobarRendicionCajaChicaJefeDirecto,
    cierreCircuitoCajaChicaAdministracion,
    rechazarRendicionCajaChicaAdministracion
}