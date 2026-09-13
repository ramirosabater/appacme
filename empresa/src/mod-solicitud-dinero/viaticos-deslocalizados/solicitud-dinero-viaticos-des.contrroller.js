const { pool } = require('../../config');
const { transporter } = require('../../libs/mailer');
const { preparaSolicitudViaticosDeslocalizados, prepararAprobarViaticosDeslocalizadosRRHH,
    prepararRechazarViaticosDeslocalizadosRRHH, prepararFinalizarCircuitoViaticosDeslocalizados } = require('../../mod-correo/notificaciones/viaticos-deslocalizados/correo-viaticos-deslocalizados');


//Crear solicitud viaticos deslocalizados
const createSolicitudViaticosDeslocalizados = async (req, res) => {
    const { id_empleado } = req.params;
    const { motivo_solicitud, cantidad_dias } = req.body;
    const consulta = await pool.query('select * from configuracion where id_configuracion=2')
    const monto = consulta.rows[0].valor;
    console.log('Monto por dia:' + monto);
    const montoSolicitado = monto * cantidad_dias;
    console.log('Monto total:' + montoSolicitado);
    if (!monto) {
        res.status(500).json({
            message: 'No se puede realizar la solicitud, comunicarse a RRHH.'
        })
    } else {
        try {
            const response = await pool.query(`insert into solicitud_dinero(id_empleado,monto_solicitado,motivo_solicitud, id_tipo_solicitud, fecha_solicitud,estado,cantidad_dias)
            values($1,$2,$3,3,now(),'pendiente',$4);`, [id_empleado, montoSolicitado, motivo_solicitud, cantidad_dias]);
            if (response.rowCount > 0) {
                const result = await pool.query(`select * from solicitud_dinero where id_empleado=$1 order by id_solicitud_dinero desc limit 1`, [id_empleado]);
                //Enviar mail a rrhh
                await preparaSolicitudViaticosDeslocalizados(result.rows[0].id_solicitud_dinero, req, res);
                res.status(200).json({
                    message: 'solicitud de viaticos deslocalizados cargada correctamente'
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

const aprobarViaticosDeslocalizadosRRHH = async (req, res) => {
    try {
        const { id_solicitud_dinero } = req.params;
        const consulta = await pool.query(`select * from solicitud_dinero s join tipos_solicitudes ts 
        on s.id_tipo_solicitud=ts.id_tipo_solicitud where id_solicitud_dinero=$1 `, [id_solicitud_dinero]);
        //console.log(consulta);
        if (consulta.rows[0].estado == 'pendiente' && consulta.rows[0].id_tipo_solicitud == 3) {
            const response = await pool.query(`insert into estados_solicitud(motivo,fecha,id_tipo_estado_solicitud,id_empleado,id_solicitud_dinero) values
            ('',now(),5,$1,$2);`, [consulta.rows[0].id_empleado, id_solicitud_dinero]);
            if (response.rowCount > 0) {
                //Enviar mail a tesoreria
                await prepararAprobarViaticosDeslocalizadosRRHH(id_solicitud_dinero, req, res);
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

const rechazarViaticosDeslocalizadosRRHH = async (req, res) => {
    try {
        const { id_solicitud_dinero } = req.params;
        const { motivo } = req.body;
        const consulta = await pool.query(`select * from solicitud_dinero s join tipos_solicitudes ts 
        on s.id_tipo_solicitud=ts.id_tipo_solicitud where id_solicitud_dinero=$1 `, [id_solicitud_dinero]);
        //console.log(consulta);
        if (consulta.rows[0].estado == 'pendiente' && consulta.rows[0].id_tipo_solicitud == 3) {
            const response = await pool.query(`insert into estados_solicitud(motivo,fecha,id_tipo_estado_solicitud,id_empleado,id_solicitud_dinero) values
            ($1,now(),6,$2,$3);`, [motivo, consulta.rows[0].id_empleado, id_solicitud_dinero]);
            if (response.rowCount > 0) {
                const response = await pool.query(`update solicitud_dinero set estado='rechazado' where id_solicitud_dinero= $1`, [id_solicitud_dinero]);
                //Enviar mail a empleado
                await prepararRechazarViaticosDeslocalizadosRRHH(id_solicitud_dinero, req, res);
                res.status(200).json({
                    message: 'Solicitud denegara'
                });
            } else {
                res.status(501).json({
                    message: 'No pudo  solicitud'
                });
            }
        } else {
            res.status(200).json('No se puede realizar acción')
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error al editar solicitud'
        });
    }
};

const cierreViaticosDeslocalizadosTesoreria = async (req, res) => {
    try {
        const { id_solicitud_dinero } = req.params;
        const consulta = await pool.query(`select * from solicitud_dinero s join tipos_solicitudes ts 
        on s.id_tipo_solicitud=ts.id_tipo_solicitud where id_solicitud_dinero=$1 `, [id_solicitud_dinero]);
        //console.log(consulta);
        const tipoEstado = await pool.query(`select es.id_estado_solicitud, es.id_solicitud_dinero,es.id_tipo_estado_solicitud,
        es.motivo, ts.descripcion_tipo_estado, es.fecha, es.id_empleado from estados_solicitud es 
        join tipos_estado_solicitud ts on es.id_tipo_estado_solicitud= ts.id_tipo_estado_solicitud 
        where id_solicitud_dinero=$1 order by fecha desc limit 1`, [id_solicitud_dinero]);

        if (consulta.rows[0].estado == 'pendiente' && tipoEstado.rows[0].id_tipo_estado_solicitud == 5) {
            const response = await pool.query(`insert into estados_solicitud(motivo,fecha,id_tipo_estado_solicitud,id_empleado,id_solicitud_dinero) values
            ('',now(),17,$1,$2);`, [consulta.rows[0].id_empleado, id_solicitud_dinero]);
            if (response.rowCount > 0) {
                const respuesta = await pool.query(`update solicitud_dinero set estado='finalizado' where id_solicitud_dinero= $1`, [id_solicitud_dinero]);
                //Enviar mail a empleado
                await prepararFinalizarCircuitoViaticosDeslocalizados(id_solicitud_dinero, req, res);
                res.status(200).json({
                    message: 'Rendición de viaticos deslocalizados aprobada. Circuito cerrado. '
                });
            } else {
                res.status(501).json({
                    message: 'No pudo aprobarse rendición.'
                });
            }
        } else {
            res.status(200).json('No se puede realizar acción ya que el estado del pedido fue editado o rrhh no aprobo pedido.')
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error al editar solicitud'
        });
    }
};


module.exports = {
    createSolicitudViaticosDeslocalizados,
    aprobarViaticosDeslocalizadosRRHH,
    rechazarViaticosDeslocalizadosRRHH,
    cierreViaticosDeslocalizadosTesoreria
}