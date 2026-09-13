const { query, response } = require('express');
const { pool } = require('../config');
const { transporter } = require('../libs/mailer');
const { prepararDatosSolicitudViajeVendedores } = require('../mod-correo/notificaciones/correo-solicitud-dinero')
const { prepararDatosRendicionTarjeta, prepararDatosRendicionCajaChica } = require('../mod-correo/notificaciones/caja-chica/correo-caja-chica')

//Get Solicitud by id_empleado
const getSolicitudDineroById_empleado = async (req, res) => {
    try {
        const { id_empleado } = req.params;
        const response = await pool.query(`select *, to_char(s.fecha_solicitud::timestamp with time zone, 'dd/MM/yyyy HH24:MI:SS'::text) AS "fecha_solicitud"  from solicitud_dinero s join tipos_solicitudes ts 
        on s.id_tipo_solicitud=ts.id_tipo_solicitud where id_empleado=$1 order by id_solicitud_dinero desc;`, [id_empleado]);
        if (response.rowCount > 0) {
            res.status(200).json(response.rows)
        } else {
            res.status(200).json(response.rows)
        }
    }
    catch (error) {
        res.status(500).json({
            message: 'Error al obtener solicitud de dinero'
        });
    }
};

//Get Solicitud by jefe_directo
const getSolicitudDineroByJefeDirecto = async (req, res) => {
    try {
        const { id_jefe_directo } = req.params;
        const response = await pool.query(`select s.id_solicitud_dinero,s.monto_solicitado,s.motivo_solicitud,
        s.id_tipo_solicitud,ts.descripcion,s.estado,s.sub_tipo, u.nombre,u.apellido,e.n_legajo,to_char(s.fecha_solicitud::timestamp with time zone, 'dd/MM/yyyy HH24:MI:SS'::text) AS "fecha_pedido" from solicitud_dinero s join tipos_solicitudes ts 
        on s.id_tipo_solicitud=ts.id_tipo_solicitud join empleados e 
        on s.id_empleado = e.id_empleado join usuarios u on u.id_usuario=e.id_empleado  where e.jefe_directo =$1 and (s.id_tipo_solicitud = 1 or s.id_tipo_solicitud = 2) order by s.id_solicitud_dinero desc
        `, [id_jefe_directo]);
        if (response.rowCount > 0) {
            res.status(200).json(response.rows)
        } else {
            res.status(200).json(response.rows)
        }
    }
    catch (error) {
        res.status(500).json({
            message: 'Error al obtener solicitud de dinero'
        });
    }
};

//Get Solicitud by jefe_directo
const getSolicitudDineroByAdministracion = async (req, res) => {
    try {
        const response = await pool.query(`select s.id_solicitud_dinero, s.monto_solicitado,s.motivo_solicitud,s.estado, s.sub_tipo,
        s.id_tipo_solicitud,ts.descripcion,u.nombre,u.apellido,e.n_legajo,
        to_char(s.fecha_solicitud::timestamp with time zone, 'dd/MM/yyyy HH24:MI:SS'::text) AS "fecha_pedido" 
        from solicitud_dinero s join tipos_solicitudes ts on s.id_tipo_solicitud=ts.id_tipo_solicitud left join estados_solicitud es on s.id_solicitud_dinero=es.id_solicitud_dinero join empleados e on s.id_empleado = e.id_empleado join usuarios u on u.id_usuario=e.id_empleado where s.id_tipo_solicitud = 1 and
        es.id_tipo_estado_solicitud=1 order by s.id_solicitud_dinero desc`);
        if (response.rowCount > 0) {
            res.status(200).json(response.rows)
        } else {
            res.status(200).json(response.rows)
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener solicitud de dinero' });
    }
};

//Get Solicitud by tesoreria
const getSolicitudDineroByTesoreria = async (req, res) => {
    try {
        const response = await pool.query(`select DISTINCT ON (s.id_solicitud_dinero) s.id_solicitud_dinero, s.monto_solicitado,s.motivo_solicitud,s.estado,
        s.id_tipo_solicitud,ts.descripcion,s.cantidad_dias,u.nombre,u.apellido,e.n_legajo,
        to_char(s.fecha_solicitud::timestamp with time zone, 'dd/MM/yyyy HH24:MI:SS'::text) AS "fecha_pedido" 
        from solicitud_dinero s join tipos_solicitudes ts on s.id_tipo_solicitud=ts.id_tipo_solicitud left join estados_solicitud es on s.id_solicitud_dinero=es.id_solicitud_dinero join empleados e on s.id_empleado = e.id_empleado join usuarios u on u.id_usuario=e.id_empleado  where s.id_tipo_solicitud IN (2,3,4) 
        and es.id_tipo_estado_solicitud in (1,5,20)  order by s.id_solicitud_dinero desc
        `);
        if (response.rowCount > 0) {
            res.status(200).json(response.rows)
        } else {
            res.status(200).json(response.rows)
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener solicitud de dinero' });
    }
};

//Get Solicitud by rrhh
const getSolicitudDineroByRRHH = async (req, res) => {
    try {
        const response = await pool.query(`
        select s.*,ts.descripcion,u.nombre,u.apellido,e.n_legajo, to_char(s.fecha_solicitud::timestamp with time zone, 'dd/MM/yyyy HH24:MI:SS'::text) AS "fecha_pedido" from solicitud_dinero s join tipos_solicitudes ts 
        on s.id_tipo_solicitud=ts.id_tipo_solicitud join empleados e on e.id_empleado=s.id_empleado 
		join usuarios u on u.id_usuario=e.id_empleado  where s.id_tipo_solicitud=3 order by s.id_solicitud_dinero desc
       `);
        if (response.rowCount > 0) {
            res.status(200).json(response.rows)
        } else {
            res.status(200).json(response.rows)
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener solicitud de dinero' });
    }
};

//Get Solicitud_dinero by id_solicitud_dinero
const getSolicitudDineroByIdSolicitudDinero = async (req, res) => {
    try {
        const { id_solicitud_dinero } = req.params;
        const response = await pool.query(`select *, to_char(s.fecha_solicitud::timestamp with time zone, 'dd/MM/yyyy HH24:MI:SS'::text) AS "fecha_solicitud"  from solicitud_dinero s join tipos_solicitudes ts 
        on s.id_tipo_solicitud=ts.id_tipo_solicitud where id_solicitud_dinero=$1;`, [id_solicitud_dinero]);
        if (response.rowCount > 0) {
            const detalle = await pool.query(`select * from monto_por_tipo m join categorias_pedido c on m.id_categoria_pedido=c.id_categoria_pedido  where m.id_solicitud_dinero= $1`, [response.rows[0].id_solicitud_dinero]);
            //console.log(response.rows);
            response.rows[0].detalle = detalle.rows;

            const tipoEstado = await pool.query(`select es.id_estado_solicitud, es.id_solicitud_dinero,es.id_tipo_estado_solicitud,
            es.motivo, ts.descripcion_tipo_estado, to_char(es.fecha::timestamp with time zone, 'dd/MM/yyyy HH24:MI:SS'::text) AS "fecha", es.id_empleado from estados_solicitud es 
            join tipos_estado_solicitud ts on es.id_tipo_estado_solicitud= ts.id_tipo_estado_solicitud 
            where id_solicitud_dinero=$1 order by fecha asc`, [id_solicitud_dinero]);
            response.rows[0].tipo_estado = tipoEstado.rows;
            //console.log(response.rows);
            res.status(200).json(response.rows)
        } else {
            res.status(200).json(response.rows)
        }
    }
    catch (error) {
        res.status(500).json({
            message: 'Error al obtener solicitud de dinero'
        });
    }
};

//Get Tickets by id_solicitud_dinero
const geticketsByIdSolicitudDinero = async (req, res) => {
    try {
        const { id_solicitud_dinero } = req.params;
        const response = await pool.query(`select * from tickets where id_solicitud_dinero = $1 and estado ='activo' order by fecha_ticket desc;`, [id_solicitud_dinero]);
        if (response.rowCount > 0) {
            //console.log(response.rows);
            res.status(200).json(response.rows)
        } else {
            res.status(200).json(response.rows)
        }
    }
    catch (error) {
        res.status(500).json({
            message: 'Error al obtener ticket'
        });
    }
};

//Sumar monto de tickets por id_solicitud_dinero
const sumaMontoTotalTicketsByIdSolicitudDinero = async (req, res) => {
    try {
        const { id_solicitud_dinero } = req.params;
        const response = await pool.query(`select sum(t.importe_sin_iva) from tickets t where id_solicitud_dinero = $1`, [id_solicitud_dinero]);
        if (response.rowCount > 0) {
            //console.log(response.rows);
            res.status(200).json(response.rows)
        } else {
            res.status(200).json(response.rows)
        }
    }
    catch (error) {
        res.status(500).json({
            message: 'Error al obtener suma de tickets'
        });
    }
};

//Cargar ticket a solicitud
const adjuntarTicketSolicitudByIdSolicitudDinero = async (req, res) => {
    const { id_solicitud_dinero } = req.params;
    const { proveedor, punto_venta, nro_ticket, importe_sin_iva, fecha_ticket, cuit } = req.body;
    const file = req.file.path;
    try {
        const consulta = await pool.query(`select * from solicitud_dinero s join tipos_solicitudes ts 
        on s.id_tipo_solicitud=ts.id_tipo_solicitud where id_solicitud_dinero=$1`, [id_solicitud_dinero]);

        if (consulta.rowCount > 0) {
            const response = await pool.query(`insert into tickets (id_solicitud_dinero, proveedor,punto_venta, nro_ticket, importe_sin_iva,fecha_ticket,url_imagen,estado, cuit)
            values($1,$2,$3,$4,$5,$6,$7,'activo',$8)`, [id_solicitud_dinero, proveedor, punto_venta, nro_ticket, importe_sin_iva, fecha_ticket, file, cuit]);
            //console.log('Tickets', response.rows)
            if (response.rowCount > 0) {
                res.status(200).json({
                    message: 'Ticket cargado correctamente'
                });
            }
        } else {
            res.status(500).json({
                message: 'No se pudo adjuntar ticket'
            });
        }
    } catch (error) {
        res.status(501).json({
            message: 'Error al cargar ticket - Server'
        });
    }
}

//Eliminar ticket - Borrado logico
const eliminarTicketByIdTicket = async (req, res) => {
    const { id_ticket } = req.params;

    try {
        const consulta = await pool.query(`select * from tickets where id_ticket = $1 and estado='activo';`, [id_ticket]);

        if (consulta.rowCount > 0) {
            const response = await pool.query(`update tickets set estado ='eliminado' where id_ticket = $1;`, [id_ticket]);
            //console.log('Tickets', response.rows)
            if (response.rowCount > 0) {
                res.status(200).json({
                    message: 'Ticket eliminado correctamente'
                });
            }
        } else {
            res.status(500).json({
                message: 'No se puede eliminar ticket'
            });
        }
    } catch (error) {
        res.status(501).json({
            message: 'Error al eliminar ticket - Server'
        });
    }
}

//Notificar rendicion tickets
const notificarLiderPresentacionRendicionFinal = async (req, res) => {
    try {
        const { id_solicitud_dinero } = req.params;
        const consulta = await pool.query(`select * from solicitud_dinero s join tipos_solicitudes ts 
        on s.id_tipo_solicitud=ts.id_tipo_solicitud where id_solicitud_dinero=$1 `, [id_solicitud_dinero]);
        //console.log(consulta);
        if (consulta.rows[0].estado == 'pendiente') {
            const response = await pool.query(`insert into estados_solicitud(motivo,fecha,id_tipo_estado_solicitud,id_empleado,id_solicitud_dinero) values
            ('',now(),20,$1,$2);`, [consulta.rows[0].id_empleado, id_solicitud_dinero]);
            if (response.rowCount > 0) {
                //Enviar mail a lider
                await prepararDatosRendicionCajaChica(id_solicitud_dinero, req, res);
                res.status(200).json({
                    message: 'Presentacion de rendición final enviada'
                });
            } else {
                res.status(501).json({
                    message: 'No pudo enviarse rendición'
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

//get tipo solicitudes
const getTipoSolicitudes = async (req, res) => {
    try {
        const response = await pool.query(`select * from tipos_solicitudes;`);
        console.log('Categorias por aca');
        if (response.rowCount > 0) {
            res.status(200).json(response.rows)
        } else {
            res.status(200).json(response.rows)
        }
    } catch (error) {
        console.log('Categorias por aca');
        res.status(500).json({ message: error });
    }
};

//get categorias pedidos
const getCategoriasPedidos = async (req, res) => {
    try {
        const response = await pool.query(`select * from categorias_pedido;`);
        console.log('Categorias por aca');
        if (response.rowCount > 0) {
            res.status(200).json(response.rows)
        } else {
            res.status(200).json(response.rows)
        }
    } catch (error) {
        console.log('Categorias por aca');
        res.status(500).json({ message: error });
    }
};


const getConfiguraciones = async (req, res) => {
    const response = await pool.query(`select * from configuracion`);
    res.status(200).json(response.rows);
}


//Notificar rendicion final a tesoreria de tarjeta de credito
//Notificar rendicion tickets
const notificarTesoreriaPresentacionRendicionFinal = async (req, res) => {
    try {
        const { id_solicitud_dinero } = req.params;
        const consulta = await pool.query(`select * from solicitud_dinero s join tipos_solicitudes ts 
        on s.id_tipo_solicitud=ts.id_tipo_solicitud where id_solicitud_dinero=$1 `, [id_solicitud_dinero]);
        //console.log(consulta);
        if (consulta.rows[0].estado == 'pendiente') {
            const response = await pool.query(`insert into estados_solicitud(motivo,fecha,id_tipo_estado_solicitud,id_empleado,id_solicitud_dinero) values
            ('',now(),20,$1,$2);`, [consulta.rows[0].id_empleado, id_solicitud_dinero]);
            if (response.rowCount > 0) {
                //Enviar mail a lider
                await prepararDatosRendicionTarjeta(id_solicitud_dinero, req, res);
                res.status(200).json({
                    message: 'Presentacion de rendición final enviada'
                });
            } else {
                res.status(501).json({
                    message: 'No pudo enviarse rendición'
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


const descargarRendicionTicketsByUsuario = async (req, res) => {
    try {
        const { id_empleado, fecha_inicio, fecha_fin } = req.body;
        let query = `
            SELECT u.apellido || ' ' || u.nombre AS usuario, s.id_solicitud_dinero, t.proveedor,
                   t.fecha_ticket, t.punto_venta, t.nro_ticket, t.importe_sin_iva, t.cuit, s.estado
            FROM tickets t
            INNER JOIN solicitud_dinero s ON t.id_solicitud_dinero = s.id_solicitud_dinero
            INNER JOIN empleados e ON s.id_empleado = e.id_empleado
            INNER JOIN usuarios u ON e.id_empleado = u.id_usuario
            WHERE t.fecha_ticket::date BETWEEN $1 AND $2
            AND s.estado = 'finalizado'
            AND s.id_tipo_solicitud = 4
        `;

        const params = [fecha_inicio, fecha_fin];
        if (id_empleado) {
            params.push(id_empleado);
            query += ` AND s.id_empleado = $${params.length}`;
        }

        query += ` ORDER BY t.fecha_ticket ASC`;
        const response = await pool.query(query, params);
        res.json(response.rows);

    } catch (error) {
        console.error("Error al descargar la rendición de tickets:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};




module.exports = {
    getSolicitudDineroById_empleado,
    getSolicitudDineroByIdSolicitudDinero,
    geticketsByIdSolicitudDinero,
    getSolicitudDineroByJefeDirecto,
    sumaMontoTotalTicketsByIdSolicitudDinero,
    getTipoSolicitudes,
    getCategoriasPedidos,
    getConfiguraciones,
    adjuntarTicketSolicitudByIdSolicitudDinero,
    notificarLiderPresentacionRendicionFinal,
    getSolicitudDineroByAdministracion,
    getSolicitudDineroByTesoreria,
    getSolicitudDineroByRRHH,
    eliminarTicketByIdTicket,
    notificarTesoreriaPresentacionRendicionFinal,
    descargarRendicionTicketsByUsuario
}