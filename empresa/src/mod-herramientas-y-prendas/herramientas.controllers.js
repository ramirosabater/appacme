
const { pool } = require('../config');
const { transporter } = require('../libs/mailer');
const { nuevaSolicitud } = require('../mails/nuevaSolicitud');


//Para RRHH
const getAllSolicitudes = async (req, res) => {
    try {
        const response = await pool.query(`select s.id_solicitud,s.id_empleado, u.nombre,u.apellido,s.estado,s.descargo_recursos,s.estado_respuesta_empleado,s.respuesta_empleado,  to_char(s.fecha_pedido::timestamp with time zone, 'dd/MM/yyyy'::text) AS "fecha_pedido" from solicitud s join empleados em on s.id_empleado=em.id_empleado join usuarios u on u.id_usuario=em.id_empleado order by s.id_solicitud desc`);
        if (response.rowCount > 0) {
            res.status(200).json(response.rows)
        } else {
            res.status(200).json(response.rows)
        }
    } catch (error) {
        res.status(500).json({ message: error });
    }
};

//Para RRHH
const getAllDetalle_Solicitudes = async (req, res) => {
    try {
        const response = await pool.query(`select s.id_solicitud, e.codigo_elemento, s.id_empleado,s.id_jefe_directo, e.desc_elemento,ds.cantidad,ds.talle, s.estado,   to_char(s.fecha_pedido::timestamp with time zone, 'dd/MM/yyyy'::text) AS "fecha_pedido" from solicitud s join detalle_solicitud ds on s.id_solicitud=ds.id_solicitud 
        join elementos e on ds.id_elemento=e.id_elemento order by s.fecha_pedido desc`);
        if (response.rowCount > 0) {
            res.status(200).json(response.rows)
        } else {
            res.status(200).json(response.rows)
        }
    } catch (error) {
        res.status(500).json({ message: error });
    }
};

//Para jefe directo
const getSolicitudesByJefeDirecto = async (req, res) => {
    try {
        const { jefe_directo } = req.params;
        const response = await pool.query(`select s.id_solicitud,s.id_empleado, u.nombre,u.apellido,s.estado,   to_char(s.fecha_pedido::timestamp with time zone, 'dd/MM/yyyy'::text) AS "fecha_pedido", s.estado_respuesta_empleado from solicitud s join empleados em on s.id_empleado=em.id_empleado join usuarios u on u.id_usuario=em.id_empleado where s.id_jefe_directo=$1 order by id_solicitud desc
        `, [jefe_directo]);

        if (response.rowCount > 0) {
            res.status(200).json(response.rows);
        } else {
            res.status(200).json();
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error al consultar solicitudes'
        });
    }
};

//Para Jefe_Directo
const getAllDetalle_SolicitudesByJefe = async (req, res) => {
    try {
        const { jefe_directo } = req.params;
        const response = await pool.query(`select s.id_solicitud, e.codigo_elemento, s.id_empleado,s.id_jefe_directo, e.desc_elemento,ds.cantidad,ds.talle, s.estado,   to_char(s.fecha_pedido::timestamp with time zone, 'dd/MM/yyyy'::text) AS "fecha_pedido" from solicitud s join detalle_solicitud ds on s.id_solicitud=ds.id_solicitud 
        join elementos e on ds.id_elemento=e.id_elemento where s.id_jefe_directo=$1 order by s.fecha_pedido desc`, [jefe_directo]);
        if (response.rowCount > 0) {
            res.status(200).json(response.rows)
        } else {
            res.status(200).json(response.rows)
        }
    } catch (error) {
        res.status(500).json({ message: error });
    }
};

//Para empleado
const getSolicitudesByEmpleado = async (req, res) => {
    try {
        const { id_empleado } = req.params;
        const response = await pool.query(`select s.id_solicitud,s.id_empleado, u.nombre,u.apellido,s.estado,s.descargo_recursos,s.estado_respuesta_empleado,s.respuesta_empleado,   to_char(s.fecha_pedido::timestamp with time zone, 'dd/MM/yyyy'::text) AS "fecha_pedido" from solicitud s join empleados em on s.id_empleado=em.id_empleado join usuarios u on u.id_usuario=em.id_empleado where s.id_empleado=$1 order by s.id_solicitud desc
        `, [id_empleado]);

        if (response.rowCount > 0) {
            res.status(200).json(response.rows);
        } else {
            res.status(200).json();
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error al consultar solicitudes'
        });
    }
};

//Detalle_solicitud Empleado
const getAllDetalle_SolicitudesByEmpleado = async (req, res) => {
    try {
        const { id_empleado } = req.params;
        const response = await pool.query(`select s.id_solicitud, e.codigo_elemento, s.id_empleado,s.id_jefe_directo, e.desc_elemento,ds.cantidad,ds.talle, s.estado, s.fecha_pedido from solicitud s join detalle_solicitud ds on s.id_solicitud=ds.id_solicitud 
        join elementos e on ds.id_elemento=e.id_elemento where s.id_empleado=$1 order by s.fecha_pedido desc`, [id_empleado]);
        if (response.rowCount > 0) {
            res.status(200).json(response.rows)
        } else {
            res.status(200).json(response.rows)
        }
    } catch (error) {
        res.status(500).json({ message: error });
    }
};


//Para jefe directo
// Modifica la función realizarSolicitud
const realizarSolicitud = async (req, res) => {
    try {
        const { id_jefe_directo, id_empleado, datos } = req.body;

        const response = await pool.query(`insert into solicitud (id_jefe_directo,id_empleado,fecha_pedido,estado) values($1,$2,now(),3);`, [id_jefe_directo, id_empleado]);

        if (response.rowCount > 0) {
            const result = await pool.query(`select s.id_solicitud,s.id_empleado, u.nombre,u.apellido,s.estado, s.fecha_pedido from solicitud s join empleados em on s.id_empleado=em.id_empleado join usuarios u on u.id_usuario=em.id_empleado where s.id_jefe_directo= $1 order by id_solicitud desc limit 1`, [id_jefe_directo]);
            const detallePromises = [];
            for (const element of datos) {
                const consulta = await pool.query(`insert into detalle_solicitud (id_solicitud,id_elemento,cantidad,talle) values($1,$2,$3,$4)`, [result.rows[0].id_solicitud, element.id_elemento, element.cantidad, element.talle]);
                //console.log(element);
            }
            const id_solicitud = result.rows[0].id_solicitud;
            await enviarMailRecursosHumanos(id_solicitud, req, res);
            //res.status(200).json('Operación realizada con éxito');
        } else {
            res.status(500).json('Error al crear la solicitud');
        }
    } catch (error) {
        console.error(error);
        res.status(500).json('Error interno del servidor');
    }
};

// Modifica la función enviarMailRecursosHumanos para recibir res como argumento
const enviarMailRecursosHumanos = async (id_solicitud, req, res) => {
    var req = { params: { id_solicitud } };
    try {
        const data = await pool.query(`select s.id_solicitud, s.id_jefe_directo, s.id_empleado, to_char(s.fecha_pedido::timestamp with time zone, 'dd/MM/yyyy'::text) AS "fecha_pedido", s.estado, s.descargo_recursos, s.estado_respuesta_empleado, s.respuesta_empleado, s.fecha_entrega from solicitud s where id_solicitud = $1`, [id_solicitud]);
        //console.log('Solicitud by id:', data.rows);
        if (data.rowCount > 0) {
            const detalle = await pool.query(`select d.id_elemento, d.cantidad, d.talle, el.desc_elemento from detalle_solicitud d, elementos el where d.id_elemento = el.id_elemento and d.id_solicitud = $1`, [id_solicitud]);
            data.rows[0].datos = detalle.rows;
        } else {
            res.status(200).json([])
        }
        const jefeDirecto = await pool.query(`select * from usuarios where id_usuario=$1`, [data.rows[0].id_jefe_directo]);
        const empleado = await pool.query(`select * from usuarios where id_usuario=$1`, [data.rows[0].id_empleado]);
        data.rows[0].jefe = jefeDirecto.rows;
        data.rows[0].empleado = empleado.rows;
        //console.log('DATA:', data.rows[0]);
        const html = nuevaSolicitud(data.rows[0]);

        await transporter.sendMail({
            from: `"Solicitud N° 00-${data.rows[0].id_solicitud} de herramientas y prendas " <notificaciones@acme.com.ar>`,
            to: `rrhh@acme.com.ar`,// cambiar mail por el de rrhh
            subject: `Solicitud de herramientas y prendas para empleado ✔`,
            html: html,
        });
        res.status(200).json('Operación realizada con éxito');;
    } catch (error) {
        console.error(error);
        //reject('Error al enviar el correo');
    }
}

//respuesta de RRHH a solicitud de jefe
const aprobarSolicitudRRHH = async (req, res) => {
    try {
        const { id_solicitud } = req.params;
        const consulta = await pool.query(`select * from solicitud where id_solicitud=$1 `, [id_solicitud]);

        //console.log(consulta);
        if (consulta.rows[0].estado == 3) {
            const response = await pool.query(`update solicitud set estado=1, descargo_recursos='' where id_solicitud=$1`, [id_solicitud]);
            if (response.rowCount > 0) {
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


//respuesta de RRHH a solicitud de jefe
const denegarSolicitudRRHH = async (req, res) => {
    try {
        const { descargo_recursos, id_solicitud } = req.body;
        const consulta = await pool.query(`select * from solicitud where id_solicitud=$1 `, [id_solicitud]);
        //console.log(consulta);
        if (consulta.rows[0].estado == 3) {
            const response = await pool.query(`update solicitud set estado=2, descargo_recursos=$1 where id_solicitud=$2`, [descargo_recursos, id_solicitud]);
            if (response.rowCount > 0) {
                res.status(200).json({
                    message: 'Solicitud denegada'
                });
            } else {
                res.status(501).json({
                    message: 'No pudo editarse solicitud'
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

// Recepcion Empleado
const recepcionEmpleado = async (req, res) => {
    try {
        const { id_solicitud } = req.params;
        const consulta = await pool.query(`select * from solicitud where id_solicitud=$1 `, [id_solicitud]);
        //console.log(consulta);
        if (consulta.rows[0].estado == 1 && consulta.rows[0].estado_respuesta_empleado == null) {
            const response = await pool.query(`update solicitud set estado_respuesta_empleado=1, descargo_recursos='' where id_solicitud=$1`, [id_solicitud]);
            if (response.rowCount > 0) {
                res.status(200).json({
                    message: 'Se confirma recepción'
                });
            } else {
                res.status(501).json({
                    message: 'No pudo confirmarse recepción'
                });
            }
        } else {
            res.status(200).json('No se pudo realizar acción.')
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error al editar solicitud'
        });
    }
};

//Rechazo Empleado con descargo
const rechazoEmpleado = async (req, res) => {
    try {
        const { respuesta_empleado, id_solicitud } = req.body;
        const consulta = await pool.query(`select * from solicitud where id_solicitud=$1 `, [id_solicitud]);
        //console.log(consulta);
        if (consulta.rows[0].estado == 1 && consulta.rows[0].estado_respuesta_empleado == null) {
            const response = await pool.query(`update solicitud set estado_respuesta_empleado=2, respuesta_empleado=$1 where id_solicitud=$2`, [respuesta_empleado, id_solicitud]);
            if (response.rowCount > 0) {
                res.status(200).json({
                    message: 'Se rechaza recepción de pedido'
                });
            } else {
                res.status(501).json({
                    message: 'No se pudo rechazar recepción'
                });
            }
        } else {
            res.status(200).json('No se pudo realizar acción.')
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error al editar solicitud'
        });
    }
};

const ListadoHerramientasPrendas = async (req, res) => {
    try {
        const response = await pool.query(`select * from elementos`);
        res.status(200).json(response.rows);
    }
    catch (err) {
        res.status(500).json({
            message: "Error al obtener elementos"
        });
    }

}

const getSolicitudById = async (req, res) => {
    const { id_solicitud } = req.params;
    try {
        const response = await pool.query(`select s.id_solicitud, s.id_jefe_directo, s.id_empleado, to_char(s.fecha_pedido::timestamp with time zone, 'dd/MM/yyyy'::text) AS "fecha_pedido", s.estado, s.descargo_recursos, s.estado_respuesta_empleado, s.respuesta_empleado, s.fecha_entrega from solicitud s where id_solicitud = $1`, [id_solicitud]);
        //console.log(response.rows)
        if (response.rowCount > 0) {
            const detalle = await pool.query(`select d.id_elemento, d.cantidad, d.talle, el.desc_elemento from detalle_solicitud d, elementos el where d.id_elemento = el.id_elemento and d.id_solicitud = $1`, [id_solicitud]);
            response.rows[0].datos = detalle.rows;
            console.log(response.rows)
            res.status(200).json(response.rows);
        } else {
            res.status(200).json([])
        }
    }
    catch (err) {
        res.status(500).json({ "messaje": "Error al obtener solicitud by id" })
    }
}


module.exports = {
    getAllSolicitudes,
    getAllDetalle_Solicitudes,
    getSolicitudesByJefeDirecto,
    getAllDetalle_SolicitudesByJefe,
    realizarSolicitud,
    aprobarSolicitudRRHH,
    denegarSolicitudRRHH,
    recepcionEmpleado,
    rechazoEmpleado,
    getSolicitudesByEmpleado,
    getAllDetalle_SolicitudesByEmpleado,
    ListadoHerramientasPrendas,
    getSolicitudById
};