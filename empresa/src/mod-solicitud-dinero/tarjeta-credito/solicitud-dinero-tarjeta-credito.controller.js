const { pool } = require('../../config');
const { prepararRechazarRendicionTarjetaCreditoTesoreria, prepararAprobarRendicionTarjetaCreditoTesoreria } = require('../../mod-correo/notificaciones/tarjeta-credito/correo-tarjeta-credito');


//Crear solicitud tarjeta de credito
const createSolicitudTarjetaCredito = async (req, res) => {
    const { id_empleado } = req.params;
    const { motivo_solicitud } = req.body;
    //tiene solicitud tarjeta-credito pendiente
    const consulta = await pool.query(`select *, to_char(s.fecha_solicitud::timestamp with time zone, 'dd/MM/yyyy HH24:MI:SS'::text) AS "fecha_solicitud"  from solicitud_dinero s join tipos_solicitudes ts on s.id_tipo_solicitud=ts.id_tipo_solicitud where id_empleado=$1 and s.id_tipo_solicitud=4 order by id_solicitud_dinero desc;`, [id_empleado]);
    //estado = consulta.rows[0].estado;
    //console.log('Estado:', estado);
    try {
        const response = await pool.query(`insert into solicitud_dinero(id_empleado,monto_solicitado,motivo_solicitud, id_tipo_solicitud, fecha_solicitud,estado,sub_tipo) values($1,0,$2,4,now(),'pendiente',0);`, [id_empleado, motivo_solicitud]);
        //console.log(response);
        if (response.rowCount > 0) {
            res.status(200).json({
                message: 'solicitud de dinero - tarjeta de credito, cargada correctamente'
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


const aprobarRendicionTarjetaCreditoTesoreria = async (req, res) => {
    try {
        const { id_solicitud_dinero } = req.params;
        const consulta = await pool.query(`select * from solicitud_dinero s join tipos_solicitudes ts 
        on s.id_tipo_solicitud=ts.id_tipo_solicitud where id_solicitud_dinero=$1 `, [id_solicitud_dinero]);
        //console.log(consulta);
        const tipoEstado = await pool.query(`select es.id_estado_solicitud, es.id_solicitud_dinero,es.id_tipo_estado_solicitud,
        es.motivo, ts.descripcion_tipo_estado, es.fecha, es.id_empleado from estados_solicitud es 
        join tipos_estado_solicitud ts on es.id_tipo_estado_solicitud= ts.id_tipo_estado_solicitud 
        where id_solicitud_dinero=$1 order by fecha desc limit 1`, [id_solicitud_dinero]);
        //id_tipo_estado_solicitud=20(presentacion de rendicion finalrealizada)
        if (consulta.rows[0].estado == 'pendiente' && tipoEstado.rows[0].id_tipo_estado_solicitud == 20) {
            const response = await pool.query(`insert into estados_solicitud(motivo,fecha,id_tipo_estado_solicitud,id_empleado,id_solicitud_dinero) values
            ('',now(),17,$1,$2);`, [consulta.rows[0].id_empleado, id_solicitud_dinero]);
            if (response.rowCount > 0) {
                //Enviar mail a empleado
                await prepararAprobarRendicionTarjetaCreditoTesoreria(id_solicitud_dinero, req, res);
                const respuesta = await pool.query(`update solicitud_dinero set estado='finalizado' where id_solicitud_dinero= $1`, [id_solicitud_dinero]);
                res.status(200).json({
                    message: 'Rendición tarjeta de crédito aprobada. Circuito cerrado. '
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


const rechazarRendicionTarjetaCreditoTesoreria = async (req, res) => {
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
                await prepararRechazarRendicionTarjetaCreditoTesoreria(id_solicitud_dinero, req, res);
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
    createSolicitudTarjetaCredito,
    aprobarRendicionTarjetaCreditoTesoreria,
    rechazarRendicionTarjetaCreditoTesoreria
}

