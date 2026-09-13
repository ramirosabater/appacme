//const { response } = require('express');
const { pool } = require('../config');
const { transporter } = require('../libs/mailer');
const moment = require('moment-timezone');


//Obtener todas las  Vacaciones
const getVacaciones = async (req, res) => {
    try {
        const response = await pool.query(`select v.id_vacaciones,e.id_empleado,u.nombre,u.apellido,TO_CHAR(v.fecha_inicio,'DD/MM/YYYY')fecha_inicio,TO_CHAR(v.fecha_fin,'DD/MM/YYYY')fecha_fin ,TO_CHAR(v.fecha_reintegro,'DD/MM/YYYY')fecha_reintegro,v.cantidad_dias,v.created_at,v.update_at,v.estado,v.comentario from vacaciones v join empleados e on v.id_empleado=e.id_empleado join usuarios u on u.id_usuario=e.id_empleado order by id_vacaciones desc`);
        if (response.rowCount > 0) {
            res.status(200).json(response.rows)
        } else {
            res.status(200).json(response.rows)
        }
    } catch (error) {
        res.status(500).json({ message: error });
    }
}

//get vacaciones con filtros de estado, apellido usuario y sector. en el caso que el sector sea 0 se traen todos los sectores, en el caso que el apellido sea vacio se traen todos los apellidos, en el caso que el estado sea 0 se traen todos los estados
const getVacacionesFiltro = async (req, res) => {
    try {

        const { apellido, sector, estado } = req.body;
        //console.log(estado, apellido, sector);
        let query = `select v.id_vacaciones,e.id_empleado,u.nombre,u.apellido,TO_CHAR(v.fecha_inicio,'DD/MM/YYYY')fecha_inicio,TO_CHAR(v.fecha_fin,'DD/MM/YYYY')fecha_fin ,TO_CHAR(v.fecha_reintegro,'DD/MM/YYYY')fecha_reintegro,v.cantidad_dias,v.created_at,v.update_at,v.estado,v.comentario, s.descripcion from vacaciones v join empleados e on v.id_empleado=e.id_empleado join usuarios u on u.id_usuario=e.id_empleado join sectores s on s.id_sector=e.id_sector where 1=1 and u.id_estado=1`;
        const params = [];

        if (apellido != '') {
            params.push(`%${apellido}%`);
            query += ` and u.apellido like $${params.length}`;
        }
        if (sector != 0) {
            params.push(sector);
            query += ` and e.id_sector=$${params.length}`;
        }
        if (estado != '') {
            params.push(estado);
            query += ` and v.estado=$${params.length}`;
        }
        query += ` order by v.id_vacaciones desc`;

        const response = await pool.query(query, params);
        if (response.rowCount > 0) {
            res.status(200).json(response.rows)
        } else {
            res.status(200).json(response.rows)
        }
    } catch (error) {
        //console.log(error);
        res.status(500).json({ message: 'error al realizar el filtrado' });
    }
}

const getVacacionesFiltroBySector = async (req, res) => {
    try {

        const { sector } = req.body;
        //console.log(sector);
        let query = `select em.id_empleado, u.nombre, u.apellido, s.descripcion, em.dias_vacaciones, em.dias_restantes
        from empleados em, usuarios u, sectores s
        where em.id_empleado = u.id_usuario and em.id_sector = s.id_sector and u.id_estado = 1`;
        const params = [];

        if (sector != 0) {
            params.push(sector);
            query += ` and s.id_sector=$${params.length}`;
        }

        query += ` order by u.apellido asc`;

        const response = await pool.query(query, params);
        if (response.rowCount > 0) {
            res.status(200).json(response.rows)
        } else {
            res.status(200).json(response.rows)
        }
    } catch (error) {
        //console.log(error);
        res.status(500).json({ message: 'error al realizar el filtrado por sector' });
    }
}


//Get VacacionesById
const getVacacionesById = async (req, res) => {
    try {
        const { id_vacaciones } = req.params;
        const response = await pool.query(`select v.id_vacaciones,u.nombre,u.apellido,
        to_char(v.fecha_inicio::timestamp with time zone, 'dd/MM/yyyy'::text) AS "fecha_inicio",to_char(v.fecha_fin::timestamp with time zone, 'dd/MM/yyyy'::text) AS "fecha_fin",to_char(v.fecha_reintegro::timestamp with time zone, 'dd/MM/yyyy'::text) AS "fecha_reintegro", v.fecha_inicio as fecha_i,
        v.cantidad_dias,to_char(v.created_at::timestamp with time zone, 'dd/MM/yyyy'::text) AS "created_at",v.update_at,v.estado,v.comentario from vacaciones v join empleados e on v.id_empleado=e.id_empleado join usuarios u on u.id_usuario=e.id_empleado where id_vacaciones=$1`, [id_vacaciones]);

        if (response.rowCount > 0) {
            res.status(200).json(response.rows)
        } else {
            res.status(200).json(response.rows)
        }
    }
    catch (error) {
        res.status(500).json({
            message: 'Error al obtener vacaciones'
        });
    }
};


//Get Vacaciones by empleado
const getVacacionesByEmpleado = async (req, res) => {
    try {
        const { id_empleado } = req.params;
        const response = await pool.query(`select v.id_vacaciones,u.nombre,u.apellido,to_char(v.fecha_inicio::timestamp with time zone, 'dd/MM/yyyy'::text) AS "fecha_inicio",to_char(v.fecha_fin::timestamp with time zone, 'dd/MM/yyyy'::text) AS "fecha_fin",to_char(v.fecha_reintegro::timestamp with time zone, 'dd/MM/yyyy'::text) AS "fecha_reintegro",v.cantidad_dias,v.created_at,v.update_at,v.estado,v.comentario from vacaciones v join empleados e on v.id_empleado=e.id_empleado join usuarios u on u.id_usuario=e.id_empleado where v.id_empleado=$1 order by v.id_vacaciones desc`, [id_empleado]);

        if (response.rowCount > 0) {
            res.status(200).json(response.rows);
        } else {
            res.status(200).json(response.rows);
        }
    }
    catch (error) {
        res.status(500).json({
            message: 'Error al obtener vacaciones'
        });
    }
};


//Get VacacionesByEstado
//0 = pendiente / 1 = aceptada / 2 = denegada
const getVacacionesByEstado = async (req, res) => {
    try {
        const { estado } = req.body;
        const response = await pool.query(`select v.id_vacaciones,u.nombre,u.apellido,v.fecha_inicio,v.fecha_fin,v.fecha_reintegro,v.cantidad_dias,v.created_at,v.update_at,v.estado,v.comentario from vacaciones v join empleados e on v.id_empleado=e.id_empleado join usuarios u on u.id_usuario=e.id_empleado where v.estado=$1 order by v.id_vacaciones desc`, [estado]);

        if (response.rowCount > 0) {
            res.status(200).json(response.rows)
        } else {
            res.status(200).json(response.rows)
        }
    }
    catch (error) {
        res.status(500).json({
            message: 'Error al obtener vacaciones'
        });
    }
};


//Get Vacaciones por empleado y por estadp
const getVacacionesByEmpleadoEstado = async (req, res) => {
    try {
        const { id_empleado, estado } = req.body;
        const response = await pool.query(`select v.id_vacaciones,u.nombre,u.apellido,v.fecha_inicio,v.fecha_fin,v.fecha_reintegro,v.cantidad_dias,v.created_at,v.update_at,v.estado from vacaciones v join empleados e on v.id_empleado=e.id_empleado join usuarios u on u.id_usuario=e.id_empleado where v.id_empleado=$1 and v.estado=$2order by fecha_inicio desc`, [id_empleado, estado]);

        if (response.rowCount > 0) {
            res.status(200).json(response.rows)
        } else {
            res.status(200).json(response.rows)
        }
    }
    catch (error) {
        res.status(500).json({
            message: 'Error al obtener vacaciones'
        });
    }
};


//Nuevas vacaciones
//Falta Validar campos obligatorios
const solicitarVacaciones = async (req, res) => {
    const { id_empleado, fecha_inicio, fecha_fin, fecha_reintegro, update_at, estado } = req.body;
    //console.log('Formato fechas:', fecha_inicio, fecha_fin)
    const est = await pool.query(`select * from vacaciones where id_empleado=$1 and estado='0'`, [id_empleado]);
    if (est.rowCount > 0) {
        res.status(500).json({ message: 'No puede solicitar vacaciones. Tiene en revisión' })
    } else {
        try {

            const empleado = await pool.query(`select * from empleados where id_empleado=$1`, [id_empleado]);
            const usuario = await pool.query(`select * from usuarios where id_usuario = $1`, [id_empleado]);

            const fi = await formatearFechaConHora(fecha_inicio);
            const ff = await formatearFechaConHora(fecha_fin);
            const fr = await formatearFechaConHora(fecha_reintegro);
            //console.log('Formato fechas:', fi, ff)
            const fechaIni = await formatearFecha(fecha_inicio);
            const fechaFin = await formatearFecha(fecha_fin);
            const fechaRetorno = await formatearFecha(fecha_reintegro);

            //console.log(empleado);
            const nombre = usuario.rows[0].nombre;
            const apellido = usuario.rows[0].apellido;
            const d = empleado.rows[0].dias_restantes;
            const dias = await workingDays(fi, ff);
            //console.log('Dias Solicitados:', dias);

            const idJefe = empleado.rows[0].jefe_directo;
            //console.log(idJefe);
            const jd = await pool.query(`select * from usuarios where id_usuario=$1`, [idJefe]);
            const mail = jd.rows[0].email;

            if (dias > d) {
                //const dle = await pool.query(` delete from vacaciones where id_vacaciones = $1`, [id_vac])
                res.status(500).json({ message: 'No puede solicitar licencia. Excede los dias disponibles Usted dispone de: ' + d + ' dias' })
            } else {
                //  console.log(d, dias);
                const response = await pool.query('insert into vacaciones(id_empleado,fecha_inicio,fecha_fin,fecha_reintegro,cantidad_dias,created_at,update_at,estado)values($1,$2,$3,$4,$5,CURRENT_TIMESTAMP,$6,$7)', [id_empleado, fecha_inicio, fecha_fin, fecha_reintegro, dias, update_at, estado]);
                //console.log(response);

                if (response.rowCount > 0) {

                    let info = await transporter.sendMail({
                        from: '"Solicitud de vacaciones de Empleado " <notificaciones@acme.com.ar>', // sender address
                        to: `${mail}`, // list of receivers
                        subject: `Solicitud de Vacaciones Empleado ${nombre} ${apellido}✔`, // Subject line
                        //text: "Hello world?", // plain text body
                        html: `
                        <div style="margin: auto;width: 90%;">
        <div
            style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; text-align: center; margin: auto;">
            <div>
                <div style="background-color: #333333; height: 22px;">

                </div>
                <div style="background-color: #FFFFFF; height:25px; ">
                    <h4 style="margin-top: 5px;">Solicitud de Vacaciones</h4>
                </div>
                <div style="background-color: #FFCC00 ;height:180px;">
                    <a href="https://ibb.co/ZBbvhLt"><img
                            src="data:image/png;base64,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"
                            alt="Logo" style="height: 75px;padding-top: 2.5em;"></a>

                </div>
                <div style="background-color: #333333;height: 10px;"></div>
            </div>


            <div style="padding: 2em 0 2em;margin: 0 10% 0 10% ">
                <div>

                    <div style="text-align: left;">
                        <p style="font-family: serif;">Hola!</p>
                        <h4>${nombre} ${apellido}</h4>
                        <p style="font-family: serif;">
                            Solicita ${dias} día/s hábiles de vacaciones a partir del día ${fechaIni} hasta el
                            ${fechaFin} inclusive.
                            <br>
                            Se reintegrará a sus tareas el día ${fechaRetorno}.
                            <br><br>
                            Deja constancia de haber leído la política de vacaciones del corriente año, prestando
                            conformidad de la misma.
                            <br><br><br><br>
                            Para gestionar las vacaciones ingresa en:

                        </p>
                    </div>
                </div>
            </div>
        </div>

        <div>
            <div style="background-color: #FFCC00; height: 7px;"></div>
            <div style="background-color: #E8E8E8;height: 65px; padding-top: 1px;">
                <div style="margin: auto;text-align:left;">
                    <h2><a href="http://app.acme.com.ar/" style="margin-left: 10%;">app.acme.com.ar</a></h2>
                </div>
            </div>



        </div>

        <div style="background-color: #333333;height: 10px;margin-bottom: 4em;"></div>
    </div>

                
                        `, // html body
                    });



                    res.status(200).json({
                        message: 'Vacaciones solicitadas correctamente'
                    });
                } else {
                    res.status(500).json({
                        message: 'No se pudo solicitar vacaciones'
                    });
                }
            }
        } catch (error) {
            res.status(501).json({
                message: 'Error al solicitar vacaciones'
            });
        }
    }
}


const formatearFecha = async (fecha) => {
    try {
        const fechaObj = moment(fecha).tz('UTC');

        const year = fechaObj.format('YYYY');
        const month = fechaObj.format('MM');
        const day = fechaObj.format('DD');

        const formattedDate = `${day}-${month}-${year}`;
        return formattedDate;

    } catch (error) {
        return 'error convertir fecha server'
    }

}

const formatearFechaConHora = async (fecha) => {
    try {
        // Parsear la fecha y establecer la zona horaria
        const fechaObj = moment(fecha).tz('UTC');

        const year = fechaObj.format('YYYY');
        const month = fechaObj.format('MM');
        const day = fechaObj.format('DD');

        const formattedDate = `${year}-${month}-${day} 00:00:00`;

        return formattedDate;
    } catch (error) {
        return 'error formatear fecha con hora server';
    }
};


//Dias Laborales
const workingDays = async (fecha_inicio, fecha_fin) => {
    // const { fecha_inicio,fecha_fin } = req.body;
    const fecha_i = new Date(fecha_inicio);
    const fecha_f = new Date(fecha_fin);
    //console.log(fecha_i, fecha_f);
    try {

        const feriados = await pool.query(`select * from feriados order by fecha_feriado desc`);
        var contador = 0;
        var contadorFeriados = 0;

        for (var fecha = fecha_i; fecha <= fecha_f; fecha.setDate(fecha.getDate() + 1)) {
            for (var i = 0; i < feriados.rows.length; i++) {
                if (feriados.rows[i].fecha_feriado.getDay() == 0 || feriados.rows[i].fecha_feriado.getDay() == 6) {
                } else {
                    if (feriados.rows[i].fecha_feriado.toISOString().slice(0, 10) == fecha.toISOString().slice(0, 10)) {
                        contadorFeriados++;
                    }
                }
            }
            if (fecha.getDay() == 0 || fecha.getDay() == 6) {

            } else {
                // console.log(fecha.getDay());
                contador++;
            }
        }
        const total = contador - contadorFeriados;
        // res.status(200).json({ resultado: total });
        return total;

    } catch (error) {
        //res.status(500).json({ message: error });
        return 'error vacaciones server'
    }

}


//Revisar Vacaciones por jefe
const revisarVacacionesJefe = async (req, res) => {
    const { id_vacaciones, estado, comentario } = req.body;
    try {
        const consulta = await pool.query(`select v.id_vacaciones,e.id_empleado,e.id_empleado,u.nombre,u.apellido,v.fecha_inicio,v.fecha_fin,v.fecha_reintegro,v.cantidad_dias,v.created_at,v.update_at,v.estado from vacaciones v join empleados e on v.id_empleado=e.id_empleado join usuarios u on u.id_usuario=e.id_empleado where id_vacaciones=$1`, [id_vacaciones]);
        //console.log(consulta);
        if (consulta.rowCount > 0) {

            const response = await pool.query(`update vacaciones set estado=$1,comentario=$2 where id_vacaciones=$3`, [estado, comentario, id_vacaciones]);

            //console.log(response);

            if (response.rowCount > 0) {
                const revision = await pool.query(`select * from vacaciones where id_vacaciones=$1`, [id_vacaciones]);
                //console.log(revision);
                const fi = revision.rows[0].fecha_inicio;
                const ff = revision.rows[0].fecha_fin;
                const fr = revision.rows[0].fecha_reintegro;
                const comentario = revision.rows[0].comentario;

                const id = revision.rows[0].id_empleado;
                const empleado = await pool.query(`select * from empleados where id_empleado=$1`, [id]);
                const d = empleado.rows[0].dias_restantes;
                const usuario = await pool.query(`select * from usuarios where id_usuario = $1`, [id]);
                const nombre = usuario.rows[0].nombre;
                const apellido = usuario.rows[0].apellido;
                const mail = usuario.rows[0].email;

                const fechaI = await formatearFecha(fi);
                const fechaF = await formatearFecha(ff);
                const fechaR = await formatearFecha(fr);
                //console.log(id, d);

                if (revision.rows[0].estado == 0) {
                    res.status(500).json({
                        message: 'Vacaciones en revision'
                    });
                } else
                    if (revision.rows[0].estado == 2) {
                        //Enviar mail de notificacion
                        // send mail with defined transport object
                        let info = await transporter.sendMail({
                            from: '"Vacaciones Denegadas" <notificaciones@acme.com.ar>', // sender address
                            to: `${mail}`, // list of receivers
                            subject: "Vacaciones Denegadas ", // Subject line
                            //text: "Hello world?", // plain text body
                            html: `
                                <div style="margin: auto;width: 90%;">
        <div
            style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; text-align: center; margin: auto;">
            <div>
                <div style="background-color: #333333; height: 22px;">

                </div>
                <div style="background-color: #FFFFFF; height:25px; ">
                    <h4 style="margin-top: 5px;">Solicitud de Vacaciones RECHAZADA</h4>
                </div>
                <div style="background-color: #FFCC00 ;height:180px;">
                    <a href="https://ibb.co/ZBbvhLt"><img
                            src="data:image/png;base64,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"
                            alt="Logo" style="height: 75px;padding-top: 2.5em;"></a>

                </div>
                <div style="background-color: #333333;height: 10px;"></div>
            </div>


            <div style="padding: 2em 0 2em;margin: 0 10% 0 10% ">
                <div>

                    <div style="text-align: left;">
                        <p style="font-family: serif;">Hola</p>
                        <h4>${nombre} ${apellido}:</h4>
                        <p style="font-family: serif;">

                            Su solicitud de vacaciones para la fecha ${fechaI} hasta ${fechaF} a sido rechazada.
                            <br>
                            <br>
                            Comentario:
                            <br>
                            <br> ${comentario}
                            <br><br>
                           

                        </p>
                    </div>
                </div>
            </div>
        </div>

        <div>
            <div style="background-color: #FFCC00; height: 7px;"></div>
            <div style="background-color: #E8E8E8;height: 65px; padding-top: 1px;">
                <div style="margin: auto;text-align:left;">
                    <h2><a href="http://app.acme.com.ar/" style="margin-left: 10%;">app.acme.com.ar</a></h2>
                </div>
            </div>



        </div>

        <div style="background-color: #333333;height: 10px;margin-bottom: 4em;"></div>
    </div>
                        
                    `, // html body
                        });


                        res.status(200).json({

                            message: 'Vacaciones denegadas'
                        })
                    } else
                        if (revision.rows[0].estado == 1) {
                            const dias = await workingDays(fi, ff);
                            const dr = d - dias;
                            //console.log('cantidad de dias en revision jefe', dias, 'restantes', dr)
                            const cantidad_dias = await pool.query(`update empleados set dias_restantes=$1 where id_empleado=$2`, [dr, id]);

                            // send mail with defined transport object
                            let info = await transporter.sendMail({
                                from: '<notificaciones@acme.com.ar>', // sender address
                                to: `${mail}`, // USUARIO/ agregar RRHH
                                subject: "Solicitud de Vacaciones APROBADA✔", // Subject line
                                //text: "Hello world?", // plain text body
                                html: `
                                <div style="margin: auto;width: 90%;">
        <div
            style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; text-align: center; margin: auto;">
            <div>
                <div style="background-color: #333333; height: 22px;">

                </div>
                <div style="background-color: #FFFFFF; height:25px; ">
                    <h4 style="margin-top: 5px;">Solicitud de Vacaciones APROBADA</h4>
                </div>
                <div style="background-color: #FFCC00 ;height:180px;">
                    <a href="https://ibb.co/ZBbvhLt"><img
                            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAeAAAACKCAYAAAByzJkdAAAlNElEQVR4nO3deZRc1X3g8e+9r6q6q1ftCCGpJaENSSC0LxiwEVhCBguBPXNMvMzEc+LY43i8zTg5ccY5E5OT2PFxJmRhxk7sOF4C2GZizGIEMgGBMSAkAQLEog2EkNCuXqqr3r13/rjvdbdA6nqvq7urpf59zikJpK6qV4ve7917f7/fVZSnARv/z6RJF81VQXiVQ71fwWhgOaASPI4QQghxrnDAEw4OK9wDzmQ2vv76i9t7/P0psfN0ygXODBDClZmWljc/jFI3WdQHAq1qnfPP7/x/CCGEEMOKUgpQKAXGuoLG3YNzP9uzZ8Kd8O8hXTH0DPfv5c8VYCdOnbFUO/23gdZLHA5rLYDpcV/dfy9HCCGEOGvEI1wHBFprFApj7VNW2c++seuVJ/Ex0kW3U5wuAHcNmydPmfk/QX1VKZV11oRRuNdnuJ8QQggxXDnA4pxTOsg450rgvr5398v/K/r7d01JvzOQasBOmzatObTZH2ut11prwI94g4E+eiGEEOIcYIBA6wBr7b0ZXbp5586dx3lHEO45fazga7S0tIwIbeY+Hei11oQloqH14B67EEIIcdYKAGdNWNKBXhvazH0tLS0j4GvQY+DbcwScAcLJLTPu15nMahOGRaVUbnCPWQghhDh3OOeKQSaTs2H4q717XllDj8SseAQcAOHkyTP/RAeZ1TYMSxJ8hRBCiMoopXI2DEs6yKyePHnmn+CDbwCg4MMB3GkmT569UAXuCeecRhKthBBCiP7iAKuUss6o5Xv3vvQMfDjQcKcDMk7b7yqlstEPS/AVQggh+ocCUEplnbbfBTJwp9OAnTx11rogCBYYY7qGxkIIIYToN4ExJgyCYMHkqbPWAdavAVv7CZxzytf5CiGEEKKfKaUUzjms/QSAmjTpwrlovSWafnbI9LMQQggxEBygnHMlrF2gVaBXBUGQ5dT2kkIIIYToXwowQRBkVaBXaRyrov0UJPgKIYQQA0s53xl6lXao8dU+GiGEEGI4cajxavKUmRYZ/QohhBCDyUnDDSGEEGLwKdnLVwghhKgCCcBCCCFEFUgAFkIIIapAArAQQghRBRKAhRBCiCqQACyEEEJUgQRgIYQQogokAAshhBBVIAFYCCGEqAIJwEIIIUQVSAAWQgghqkACsBBCCFEFEoCFEEKIKpAALIQQQlSBBGAhhBCiCiQACyGEEFUgAVgIIYSoAgnAQgghRBVkqn0AQpyNlIpuCX7WAc75mxgaVJIPbqA5/90Qw5cEYFExpUBXcEJzDuwQPxP1fI2hhWIJSiFYp3xwjX/Q0RWVFaCUI9CQy0A2AB3NOVk7sCdfrSoLMgN9fGdS6XEbm+znQlO94Kfw33mtK/t3I85+EoBFRZTygaijqFAq/SnNOUVN1lGTHZojRK39CbOzBB1F/2dNddAyzjFxtGPCSMeYZseIekcuA5nAn9w7ioqjrXDgmGL/EcXrhxUHjyna2xWBduRrfEAeiIsPBbR1+uNIFcziiwcHdbUQqMENUkpBeyeU0h43dB17XU35oKYUNNeDxlUvCCsohoqOziEyGhdVIQFY9JmOTpjzp1q+uC6kUEp3RW8dNNTCP2/McP8zAQ15h004ghlogfbH19rhR4OTxzqWzbSsvMgyr8UycbSjqc6PbBUO3jEd7aJfHIqOIhxrhd0HNVt2ah57UfP0q5pDJ6Am64NGfwXi+DP5/PUhS2ZY2jqTfyYuun9nSfFnt2c5dLL7ImGgae3f649fZbh2oaG1o3u2IBHlP6c/+9cs+48pcpl3H7dSPriPqHP87CtFmuv7cJHSD4yFkfWOf3k44Ks/zDGywSUeuYtziwRg0WfxVfxNKw1rLjOUWhVBipOmsZCt82fJX23RQ2JBTCtAwYl2yGbgirmWD11muHyO5fyRDq0cxVBRDKFQ9MGu3EqwjkZcS2ZaLrvI8HurFTvfUtz/TMDPfhOwfa+iJgv5XPIp1DNRCkoWlsywXLPcUmqjT5/Jky9rvvNAwMgGMAP8uSjAGBhRD59ZG3LhBZawqFJdzCnlj/1bd1H2Ii4eAY+qd30bbVcotNDU6LouvMTwJQFY9Ek8mhg3wvHeeZbWo4rOUrqTmQN0QbFgmmXWBY5X3lTkc9VbDw60n2YODayab/nUmpCVsy25jA+0x9sBVHcClvLTtEmExr9frc7fv2Wc4/MfLPHxq0J+8duA2+7P8NI+RXOdD9iVvAfxFHSpDY6lDMDWQYNVrF8R8uNHgkGZkdAaTrQpVi8MaRnrePtIugs56A7ASd+3+POoRgA2Flw48Bc2YuiTACz6RCs42QmrLrFMG29pLSgyQfrHMRZGNzqunm94bk+WuprBTw2NE6yOtsKMCY6v3BRy/RKDUtBa8MFXq3SB7HTPoaBrsNxZgvaiIhvAJ1YZPrDY8Hf3ZvjOAxmshXxNZaPh+HjjW1IBfmR/6TTHkhmWTS9oGvLlR5WVcM6vnd+4wqBIf8yQPoj2vIga7ACcJoNenNukDlhUZO0iQ6D7PpUWT2OvXmBprB38tTCt/LEfa1fcfIXhF1/t5MblhrYCnOzoDmT9fZJWCjLROvORVqitgT+9OeRHXyoycazjeJsiU6V/ndZBbdYHRGPVgAaKeM16Xoth5WxLa6GyCx0hzibyVRepKeVHcC1jHZddZGnvTLde11N8Ar54imX+VEtHZ8rkmwpo1T0NectHS9z6qRINtXCkzR/DYAQChQ/ExsDhE3D5XMvP/7DIFXMNR9sUQR9mFSqlNbQV4Or5hmnnWQrFgRslKgWdoWLdUkNznSQjieFFArBIzQdNxZXzLBNGWYphhTWnDupqHKsXWkpmYEdcsTj4Bhr+/vdLfHptyLE2vzZYjZGnUn4a9lgrjGly/MsXi1y/1HD05OCPhBVQDGH8SMe1iyztKROi0jxPKYTzRgzs8wgxVEkAFqlZB7ms49pFBuMqD5haQaGoWHWJYUyTJTT9cphnFCfsAPzDp4vcsDzk8PGBmWpOKxP4RDAXHdt1SwxHWqsQhBUUS4oblocDNjLV2ieLXXWx5cLxAzvSFmIokgAsUvHBEmZf4Fgy3dJWqHzKWCkolGD6BMfSmY62zoGf/u0owjf/U4m1iw2HT/QtgWygBBrC0F/o/M3vFVk2y3CiY3DXRrWC9iLMa3GsmO0/5/5+fut8qdf6FSGOwZn5qIR1Phmt6/e+3qL7SwmSkAAsUvHBUnH1paZfGwg4Bxnt+MBiM6AnpkDD8TbF564L+ciVhsMnKw++LjqhmugWn2QreRla+3aXdTXwv/9LiTFN0BkObutC53wjjhtXGN/Puh8fWyvo6IRLWhzLZ/XPhdxAq8tBQ943j2nIV3CrBZ1nyHZ/E4NHypBEKsZCU96xeoGlM1T9NmWotS/LuXyOYdKYDIdOKLKn6WZUiUD7zOYr5hq+tD7keMoa2Z5stLlCoP2JNBN09zG2LqozDf06c/zcfTne1g6YeYHjax8p8dnbsuTqGLQyrTgZ633zDDMnZNh9UFGb7Z867Tj7fd2yEo15x9GUTVwGm1Kw/XVFW0H5C4UK3gPj/L+hXQf8xZ/E4OFLArBILG4XuGKWb8fYkaLNYTkKP+K7YDRcMc/yw4czjMy6fmtWoPBBsaEW/vQjJQINBZs+MNpoKFhfC9mM40S7Yu/bigPHFK0Ff4GSz8HYZseEUY7Rjd0tLeMG/GnEiVkfWmm49+mAe57SNNdX3jErCYW/gBjT7LhuieGbd2XJ5yqv0/bB1yd5rVlk6aggi34wOOcvsv7wn7M8saP/6qIDzZBqvyoGnwRgkZg/ISvWLLLkc45CUSXuBJWUdb62+PZHg34d/WrtA9mX1oUsmGb7NPUcB9dsBja/qrn7Sc0TOwJeP+SDbzHsbipRV+OzexdNt1y32HDFPEtG07c6V+XLlL6wrsSj22sGtX+xinpDX7/U8I8bMoQmqp2u4DG18slX65YZpp3nUnfrqpZcFmpz/tZfQVOmoIc3CcAikXg0NK7ZcdUlhkKKkhHnkgWMQPua4CUzLDMmOHbuV9TkKj9JxXXLU8Y5/vPVhtZC+ulOY6G5zrHzLc0378py72ZNa8Hv5BRvNZjLnDoFvfug4qV9Ge7YFLDyIstX1ocsm2U53p5u5iAOWJdOsXxwqeEHv84MWgN/rXzC2pyJjsvnWn75ZEBzfWXPbR3UZPzasrVnT0eoeE9n2dtZ9Jez4LpTDAU6Co7LZ1kuHO8opOj7nE1xmRea7taUhVL/TE36AKa4+UrDxNEudc9qY/1GAfc9E/DBW3Lc+VhARsOoBkddrnvbPuuiPr/OP2dN1u96U18Lm7ZrPvSNHN95IKCpzqVeR1UKikbx0feGNEZlQYMVuJwDpeGmFSG6gq5n0N145dKpfneptkFsvCLEUCNffZGci1tPusQnYefg35/XiX/eN2dQrFloqe+H1pTxphHjRzrWLze0F9PvDjSi3nHnYwGf/JscJ9oVoxr9PrKml2xnh3/tcVZ0U51v8PGV72e59e5s6traOHBdMsWxPApcarA6hmlo64D3zLFcNNHSUez72r/fP1qxbpnpl89XiLOZBGBRVjyFO3ksvGeOSdR60hElELXBX/48y5GTKtHesvFI++IWyyVTKjvZQzT6jTJ5p6Vs9mCiwPnw8wFf+G6WXNaPavvSKMRY/7wjGuDrd2T5xZMBzXV+3bhnCVNvt9BAEOAboAxSxzCIEtisH/F/cJmfmejLGnTcYWvCKMuahcm+R0KcyyQAi7K6W08aJowiUetJayGfc2zdFfDbHZpndmqfvJJgJGwdNNRGrSkrLHVy+BHv6oUGXPIHcs6v6R44pvgf38v6phFBZdnHzvkglMs4/vQnWd4+DmNHQGMemuvK30bUQyYDaxYaJox2FbcATcOvBSuuW2IY1xzto5v2MTS0FRRXz7e0jLOplwKEONdIEpYoywcj33oyzdqlc4oHt2qMhQ1bNTcsN4lO2kpBR0lx9XzDrXdnKIZ9y7z17RRhwijHwgtdqtG0dVBf67jlziyv7leMburbyPd0j1ubgzcOKf78p1nWLTO0FpIfl4u6R41tcoPawUtFHdBmnG957zzDTx8PGJGyHMq/dsf6QdhlSYizgQRg0au49eTMC/z+sO0J2kQ6/Ohx/1HFYy9pRjU6fvNSwBuHQ8Y2OUplRm6662TvWDrT8Kstfro27egznjqf1+IYP8K3uEwS6Jzz5UY73tD89LGAxjpfBtRfjPUdke7YFPCvjwYo0l9c1Gar00nJobhxpeHfnkxXJhZnci+eblk8/exMvor3ja5kD2FF/zQyEeeGs+yfgBhscevJa+YbRjW4RKNAa30d7G9fVrz+tqIxD/uOwG9e1ORzyTKAfT2tY+0ii0sxdXzKsQOhVVzcYsllkieOxSO1u58KePuEIjcA3YriIF9f49+r+pS3gZi6TbI+31aAlbMtF7c42lM0YvHJV7B+uU++KldHOxTLfIolX5JVqODWURyar01Uh4yARa+MjddjDcUU67HOwYatATZa94z//8OXJZuG9r2CFZfPtUwc7RtnpG1N6XsZO2ZPtJgUQTxeq9z4rCaXcQxUou5QGwllEqxxGwsjGxw3LDNsfjVLfW35zljxTMTEMXDNpeX3j3b4ZLOhVG/rHFww2jH9fEddLbg+fCkc/r04eEzJ+rcAJACLXsTThktnWuYlHPHEyUtvHlU8sSMgn/MZtHU18NtXFHsPKcaPKJ9A5Ddqh4ljLFfMtfzokYCRWVK1prQO8jUwaYwjTJiwFLcd3HVA8cp+7Xsfn+OlMnH3rl0HFBNGuV4vdOILo2sXGf7+vgwn2n15VW8fS1xC9R8vN7SMtRxtO3MjlHgDiH1HFM31jrqa6r//cevMb3+yVNFMiIvW/z/8lzmefLn/WlqKs5dMQYszims21yw01Nckmzq2Lgq2OxRvHPLBzNpoTfiI4vEXNbUJp6H9yNmf7JOUML3z2I3x3atGNfqLgCQDDhtdQLy6X1W0WcPZxH9mjoefC9h9UPW6thxvHTn1PN8spWtzgt4e3/oLofXLDaEpP4sSBPDLp4JU3dYGg1b++1DpTYiYfB3EacWbF4xpcqy6xNKRovaze/r51Dso/J8nzYBV2m9Zt2ymZfr56bpvgR8tN+bxFw8pRhqBduw9pCglCBbnAudAR0lzG58NqClzsaXwU9Hrl5uyF1PxLMqiCy2LLrS09ZKJ3jV7ckTx6+c0dbmhtVFB3Fyl0psQMQnA4rS09ifOZbOMD34JSnic8w3r3zwCT7wcnJJwFY+CnnxFseft3kdZsbj/9Ogmx6qU/afjIFFXQ1f9cdJgap1fpxsGsfcUmcDxy6cCimXe57hZypIZlgXTbK9LE0pBaBQ3LDfky0wnxyPxR57X7DkY9QGv7CUJMaRJABan5QCcYu0iS5Cw/691ftPyJ14Ouqaf4/vFpUkHjikee0GTTzil3TUNvshSl3IkC349Menx99RWUGfPLgH9IbpYeeY1zXO7lV977eU9M9bXSa9fbs5YVtbdQc3y/ksNbWXqneO2ob98OhgWMw9CSAAW7xI3sJg41nL5HEt7igYW8fTzmUqHlPJNOZJO78a78cyfYrl4ikt+LCreFMH1YR1RJV4zPpcE0XaJ924OypZtaQXtBcXqBZZJYzltVm/cQe39CywTx/TeQc1GZVkv79M8sUNTXysJSuLcJwFYvEuctXrlXMsFoy3FBGuv8fTzviPwxEvqtPW+1voR8tOvanYfSDYNDd2lUGsWpCiFiqacjVX+RJ4qmjoyKZO+zgVxl64NWwIOnYh6d5/hZ+Ms9UljLasXmNNOQ/t6cMcNvYySY85BbdbxwJaAI9FezcPs7RfDkARg8S5xu8O1iwzWJVsL7Zp+3hHw5hFF7jTB1eEf9+BxzaYUTTniPsRXX2oY3eibgSRtadkZ+mnNNF90paAxP/xO/z4Iwiv7FY+/pMuWAMXLA+uXG+pqT60hjnMIFs+wLCyzTgx+9H2iQ3HfMwG5YVD6JQRIABbvEPf8nTmhu/Vkkm3v4hZ7D27VXc03zkQrx4atQeKNFuLSlxkpjsnh9+ltK/gp7DT72CrgvGY3LEdgSvktAn/5lG8y3fvn6GdKFkyzLJ0eBdnoc0mTKW2t7+61+VXN83sVdbnkXcsGk6K7DWUlNyFiEoDFKbTq3ghhVMLRZnf2s+KJlwPqetn1KM6G3vyqZucBRW3Caei4RCXNqFwHcKJd0ZqgVrUnYxWTx7pU7SvPFdb6BKxHXwjYdSDKRO4teEaj5htXdm+wECdftYxzXJOgVth3vnJR7e/Q7RFtXbJtI8vdhIhJJyxxCmvTbwXoE2gcT+zQ7DtMrxsnOCAXwKETikdf0My6JqSjqAjKPE882rpinl+XPtqqel2ndQ4yCk52+JKilrGOTspfTOho2nr6+Y6R9dBe9CPp4RKH42z1t44qHtqm+dSakEIvn09c57vqEsPU8yz7jyrqcnC8U7Fmgd828Whr752vfO2vZuNzftp7qAWpuDvaZ27Lsm2X7pdWlPmcTLMLCcCih3jz+iUzHJdMSZv9rHhgS4C15RsO+Jpcx4YtAR9/r0k8DV0swaQxlvfMsdz+aLQdXm+ZuhoKHbDroGLlbOczs8s8V9fzjHXMmmj5zUuahtrhlZAVb4Rxz9MBH3ufKVs6VAz9lo/XLrL83T2+/Wh9rWPdclP2Ii7unHb3k5q9BxUjGvx3cKhRCvYdVry6X1XcQjKXkalo4Q3RyR5RDb4OU7F6YZi45jYeHex9W/HUKwGNef84vbbiU9BQC1t3aV7Zr8gnnYaG1LXJxile2KtTZUHHI/qr51tKZuDaIQ7Vk3AcFJ/ZqXl2ty5bE+yT3RQ3LAsZUQ8n2nz3skunlk++8o06fO3vUK/7ymV9qVRtBbd8buh+7mLwyQhYAN0nwtFNPvAk7TrlS338iOdHX+pEJ5yujZN0xjQ5SibZSSnuwLR8pmH6+Rl2H/RryGcKDn5607Ftl/I78CS83IzrV69bYrjt/oAT7b1Pd/dFPHIsN/V++jv3rblIGoGG4+2KezcHLJtlcL00JomXBy6eYlkx2/KzxwNuWmnIZRztnWeevo43J3j5TeVrf4fAxgu9cc5/1yppKTmMJlJEAhKABeADQlsnXD7X911Ounk9dO9tO/385KcX57r3iE26LV/cmnJMs+9P/bf3Zsjn3BnPanGC0I59mt0HFdPO8/2ky72uOIlo6nmW37nS8o2fB4xpItFeyEkEGo63wWfWhty00nCyI+HFQfQ6gwD+6AdZXnw9WkscgLN6PAuwYavmD67zFzqml+z2eC33A4sNT7+qWTXflN120DrIZx2/2pLh8EnFqIbhl/QmhjcJwAKITqxOsXaR8dvRFUg9bVsopntOR/IgH1P43sJrFhr+6aGgbPDJBHD4pGLTC5o5k3zCV5LXpTW0dih+f02JX23RvPS6oqHO77BUiSAaxc+8wPGFdSHN9RAal+itdg5qcrDrLcW+w9H+yJUdTq/PVZuLaoJf1Fy3xHK8/cy7+Wjta7WXz7J8eX2JEXWUzSGIa3/v3xxQE2WcS/wVw4msAYseG6ZbLp9bft2ut8dJc+vLc8TT0POnWS5OsEexwycU3bc53fZ28Wi7MQ/f+t0i9XnoLFa2nZyOpvkV8PWPlmjKw9GT/vW0Jbid7PAXAPdt0Rw8rlJv0ZiWwk8J3/1UxmfwlvnZUghjmx03X2HKzjTYqPd0XPubL7POLMS5SAKw6FrDu3yuZeJoe9q+vkOJsdBY61i9IEGWbdTk4clXNJtfi9YZE57o497IC6c5bvt0kUzgM3QzfcgXygQ+oLcX4S8+UeKqiw0nOnxnMK2S3TKBv1C696moV3PKY0jLOv/ebXpBs+ut8jXB4P8+TJK8B2S0z7Qeavv+CjFYJACLU1pPnmkThaHEd8byrSlHNriya7Na++nxHz4coHW6dUafjATXzLf8+MudtIxzHDqhMA4y2j+2Os2sdjzCD6IE7CMn/Tr5bZ8u8bH3hRxtO3Nt7On4RDd/IfHMa+XbRPaH+Htx4JjiwW3JW4eWbdxCVPt7VLHx2eQ7YwlxrpEAPMzFrSdnnO9YOtP65Ksh/q2Id0iadUF3a8regpmxfir5nqcCnn41oKE23XRnoOFYOyyd4fh/f1zkv64NyWfhcKviZIfPZo7bb8aj8dD4aeMjrT5Y37jC8G9/3MmNKwzHUgbfmMLxvQczdIZ9m77vC+cgG9UEp8kk7028ScMj2wP2HEzeDU2Ic40kYQ1zcevJVfMNYxodR3rpWjSUxCVG1y40bNgaUC59J9B++vjbv8jwg8+nzBaL7n+yA5ryjls+VuLjV4Xc/0zAYy9oXjugON6mKBR9IM5lYGS9Y+IYx7KZlmsXGxZd6Efqx9rSryMbC015eGR7wANbNY35wesWFdcEb92l2bZLsXh6ugz501EKQqt8v+mhP+HSxdFdgtQvFwzJ8gHFOUwC8DBnna/hXbMwxVZ/8X1t/2atKpKPvuNa3SvnWSaMchxr81PCZzoeY6Gpzu9FfMemgI++13D4pF9XTSrQfmR7tBVaxjo+f32JT69RHD4Jh04q2jt9L+WarGNUg09Iaqh1FEM/Uo4fIw0X3aczhG/elcVY/9p76wDW37SGtqgmeMXsUq81weXEWx6+vK+79neotZ48k3hJIV5WqFQc0MXwJQF4GIv7+C6ablO3ngQ/rZtml6HeKOUDeltn8p/vLMHkcY73zDHcsSnDiHrX68k83vT9ljuzLJlhaRnnyk5fn+55g+i5O6LkoaY6GNXo0Mq32LTOB+rQ+CnovmZ8g896Ht3k+ObPs/x2h2/VONgBq7smOOBz14Xkc/4Y+pKo173vb3ft71APwHHTlG9/skRnlN1dyVfeWhhR77h9U4Y/vyPLiLPgPRADQwLwMOZPLIo1Cyz1tb03zX8nreBrP8ny2lu9d6NK+liFEkwb7/ijm0qpH+vaRYafPR4kytDNZeDQCfjiP+X4yZc7yQY+azd1PbLq7mIVGp/hfMrfxz9TwXR+aGBkA2x8NuCvf5GhsZdNLgZS3G70tf2Kx17UrFtm/VR6HwKwn8pX3Nej9vds4BxcMNr1y9q7sVDf4BjbLMlnw50E4GEsNDCm0XH1fEOhmGbnI9ixT/GPGwI/IqhwFKzwU6o1WfgPl4XMnuj8Hr5ljieuCV4xy3HheMeetxU1ZRJ64vXUx19S/PfvZbn1UyVsp39dfT25ni4LulJhNGW+Y5/iv/3fbFfTkmqdsJXy7+vdT2W4fmn6NXSIdtrKw2Mvnp21v8USZeuhkzAW8kVfNy2GNwnAw1RcXnPZHMuMCckTa2w0hbjx2QzFEMY09c+oLNBw+KQf7V06tUR7Z/mo1t38wXLVJYZ/uC9LPufKro+GFkbWwx2bAupq4BufKFEo+VHsUEhAC40PvnsPKT55a44DxxUNtdVdK40bZ2x6QfPafsWksY5iynrxuCmK3/dXJfqshpL+utCKlySGcq29GBxD4HQjqsU5X/ubDZJPBQYK2jr9XrEZ7YNZf2xSHlof/B7apmkr00O4p+7WlDZxnSr45xzZAN9/KMMffCcL+ADTX/2e+8JFa8ejGn2S0s1/leOVN6sffMEHz2wG3j7ua4LrUrzX8O59f6X2VwgJwMOSwmfVThwNV8y1tCfsRGQd5GvgxdcVz+3RfgqxnwJDPMJ6bo/mhddV2S3wYvE09KXTLHNb0rXRNBZGNjpufzTg5m/V8PohxahGvw3jYAeHOKlpdJPjvs2aD30jx+6DalBLjsrxQdjXBLcV0tUEx+VMj27X7DmopfZXCCQAD0taQ0en4vI5hkljXOLWk85BTcax8bmA4+39Xy8cN+ff+GzUajHFaLYp71i9wKYupTIGRjXAb3Yobrglx+2PZmjI+2BhBiEQG+svPprr/IXRLXdk+eStOU60qSFXohNfJG3bpdm6K103Ll/7i6/9lS0XhAAkAA9LzkGgHWsXm9RtGU8WFBu3DUwGa1eAf1ZzsiN5gI9bU14zP2pNmTJohVFi1rE2xWf/T5bfvTXL9r2aEfV09Y42tv9GbF2Ph3/ehjw8uE1z41/k+Ku7MtRk/XTtUAq+sbj++p6nA790keA+XTsr9dz3V2KwEJKENdwoBR0luHC8b+PYWujOcD0TR7SpQa3viLR9r6J2APahtQ5qa2D7Xs3zezULp/nj0wkaH8Rb/C2aZnn4eU1jXbrpcWP9GmcuC/c+HfDI8wE3LDf8zpWG+VMtuYyjo6golrpfd8+knNONuuP3tGfDhUD7LPLarKO1oPj185rvP5ThwW0a5/y6dBycK5Fm8/ieP1tOXBP84DbN5673SwXG9D6DElpoznTX/o5MWPeatutUmgukNK+5v1XzucXQIgF4mNEKCkXFBxaHjBvjaD2pqEnQDSo0UFsXjU4LA9dAIVBwvOCb9K+YZygZlahbVWggX+dYv8Kw8Tndp2zV+GTfXOeDxg82Btz1m4AVsy1rFxlWzrZMHOOozTmcU5SMDz7xVHXPE6qKdi/S2nfoyga+WXRbQfHyPsUj2zPc87TmmZ2aMNr2UNF/o95cBjI5qC2Vz+wuGdA5f7zlYkK8J/FrbykefyngxveEtPXS29o5qI1mKO7dnHxpQSk/ag4Slrgpla45SE3WXwiVylw8DARj/fudlbPvsCdfgWHGbzHnuGiSY+cbmrZCivaPbys2bA2ozQ5cA4W4zGnD1oD1y31KctJpztwRXx4zrtn3fQ76uF+usX5tJh6NPrRNs2FrwLhmx5xJlvnTLHMnOSaPdYxpctTXOGpz3VsLWufLo052+IB74Jhi10HF9r2Krbs0O97QHG1VZDOOupqotWQ/tvXUCt46ptizX3GivfznawyMbMU3YknY5UkBP30sYMFUS1sBVC8BuK4GtuzUvJCw9lcpHxh3vqUS15jHndTKBVSFf/7dBxVHW6Os90EOwL4Tls8ol20Yhzc1ecpMmQgZZuIOTcamO/c45xtmDMZJI26MoTWJI1PcrCKe4usv8eiuFBLVCysy2pGv8fW6TXlHfa0f5WrtT7CdJUVbJxxv832gO4rgnA+6tdlotNnPx9lTX2pW0/YmttZf5JR9HuWDfNrNB/ryPUv6fg6FwCe9oIUE4GGqT//wlR8ZDuYXpq/HORDnV6W6A1u8Lh7XMccbUzjX/XNa+ennQHePQrvWNQfg+HpyXb8kl3YqNh5NDsRjQ98++6TPMyQCn+yGNOzJFPQw1dd1r8E+bw2lbkGnSwjKBP7WdZhxdO7+zc8cDHJGs+r6ZeA4BvbzOVsfW4ikJAALUQH3jmArJa5CiKSkDlgIIYSoAgnAQgghRBVIABZCCCGqQAKwEEIIUQUSgIUQQogqkAAshBBCVIEEYCGEEKIKJAALIYQQVSABWAghhKgCCcBCCCFEFUgAFkIIIapAArAQQghRBRKAhRBCiCqQACyEEEJUgQRgIYQQogokAAshhBBVIAFYCCGEqAIJwEIIIUQVSAAWQgghqkACsBBCCFEFEoCFEEKIKpAALIQQQlSBBGAhhBCiCiQACyGEEFUgAVgIIYSoAgnAQgghRBVIABZCCCGqQAKwEEIIUQUSgIUQQogqkAAshBBCVIEEYCGEEKIKJAALIYQQVSABWAghhKgCCcBCCCFEFUgAFkIIIapAArAQQghRBRKAhRBCiCqQACyEEEJUgQRgIYQQogokAAshhBBV8P8BuUDtaGhq8iUAAAAASUVORK5CYII="
                            alt="Logo" style="height: 75px;padding-top: 2.5em;"></a>

                </div>
                <div style="background-color: #333333;height: 10px;"></div>
            </div>


            <div style="padding: 2em 0 2em;margin: 0 10% 0 10% ">
                <div>

                    <div style="text-align: left;">
                        <p style="font-family: serif;">Hola</p>
                        <h4>${nombre} ${apellido}:</h4>
                        <p style="font-family: serif;">

                            Su solicitud de vacaciones para la fecha ${fechaI} hasta ${fechaF} a sido aprobada.
                            <br>
                            <br>
                                                 

                        </p>
                    </div>
                </div>
            </div>
        </div>

        <div>
            <div style="background-color: #FFCC00; height: 7px;"></div>
            <div style="background-color: #E8E8E8;height: 65px; padding-top: 1px;">
                <div style="margin: auto;text-align:left;">
                    <h2><a href="http://app.acme.com.ar/" style="margin-left: 10%;">app.acme.com.ar</a></h2>
                </div>
            </div>



        </div>

        <div style="background-color: #333333;height: 10px;margin-bottom: 4em;"></div>
    </div>
                        
                    `, // html body
                            });


                            res.status(200).json({

                                message: 'Vacaciones aprobadas'
                            });
                        }
            } else {
                res.status(500).json({
                    message: 'No se pudo revisar vacaciones'
                });
            }
        } else {
            res.status(500).json({
                message: 'No se encuentran las vacaciones o no es posible revisarlas'
            });
        }
    }
    catch (error) {
        res.status(500).json({
            message: 'No puede editarse vacaciones server'
        });
    }
}


//Solo si no se ha revisado aun
const deleteVacaciones = async (req, res) => {
    const { id_vacaciones } = req.body;
    try {
        //Verificar q exista lalicencia
        const consulta = await pool.query(`select v.id_vacaciones,u.nombre,u.apellido,v.fecha_inicio,v.fecha_fin,v.fecha_reintegro,v.cantidad_dias,v.created_at,v.update_at,v.estado from vacaciones v join empleados e on v.id_empleado=e.id_empleado join usuarios u on u.id_usuario=e.id_empleado where id_vacaciones=$1
        `, [id_vacaciones]);
        if (consulta.rowCount > 0) {

            //Verificar que el estado de la licencia seapendiente de revision, y si es asi eliminarla
            const eliminar = await pool.query(`
            delete from vacaciones where id_vacaciones=$1 and estado='0'`, [id_vacaciones]);
            if (eliminar.rowCount > 0) {
                res.status(200).json({
                    message: 'Vacaciones eliminadas con exito'
                });
            } else {
                res.status(500).json({
                    message: 'No se pudo eliminar vacaciones ya que se encuentra en revisión'
                });
            }
        } else {
            res.status(501).json({ message: 'Vacaciones no encontradas' })
        }
    }
    catch (error) {
        res.status(500).json({ message: 'No se puede eliminar vacaciones server' });
    }
}



//Obtener todas las Vacaciones segun Jefe_directo 
const getVacacionesByIdJefe = async (req, res) => {
    try {
        const { jefe_directo } = req.params;
        const response = await pool.query(`select v.id_vacaciones,u.nombre,u.apellido,
        to_char(v.fecha_inicio::timestamp with time zone, 'dd/MM/yyyy'::text) AS "fecha_inicio",to_char(v.fecha_fin::timestamp with time zone, 'dd/MM/yyyy'::text) AS "fecha_fin",to_char(v.fecha_reintegro::timestamp with time zone, 'dd/MM/yyyy'::text) AS "fecha_reintegro"
        ,v.cantidad_dias,v.created_at,v.update_at,v.estado from vacaciones v join empleados e on v.id_empleado=e.id_empleado join usuarios u on u.id_usuario=e.id_empleado where e.jefe_directo=$1 order by v.id_vacaciones desc
        `, [jefe_directo]);
        if (response.rowCount > 0) {
            res.status(200).json(response.rows)
        } else {
            res.status(200).json(response.rows)
        }
    } catch (error) {
        res.status(500).json({ message: error });
    }
};



//Obtener todas las  Vacaciones por Jefe_directo por ESTADO
const getVacacionesIdJefeEstado = async (req, res) => {
    try {
        const { jefe_directo, estado } = req.body;
        const response = await pool.query(`select v.id_vacaciones,u.nombre,u.apellido,v.fecha_inicio,v.fecha_fin,v.fecha_reintegro,v.cantidad_dias,v.created_at,v.update_at,v.estado from vacaciones v join empleados e on v.id_empleado=e.id_empleado join usuarios u on u.id_usuario=e.id_empleado where e.jefe_directo=$1 and estado=$2 order by fecha_inicio desc`, [jefe_directo, estado]);
        if (response.rowCount > 0) {
            res.status(200).json(response.rows)
        } else {
            res.status(200).json(response.rows)
        }
    } catch (error) {
        res.status(500).json({ message: error });
    }
};

const eliminarVacaciones = async (req, res) => {
    try {
        const { id_vacaciones, motivo_eliminacion } = req.body;

        const response = await pool.query(`
        select * from vacaciones where id_vacaciones = $1
        `, [id_vacaciones]);
        if (response.rowCount > 0) {
            //console.log(response.rows[0].estado)
            if (response.rows[0].estado == '1') {
                const usuario = await pool.query(`
                 select * from empleados where id_empleado = $1
                `, [response.rows[0].id_empleado]);
                if (usuario.rowCount > 0) {
                    const eliminacion = await pool.query(`
                    update vacaciones set estado = 3, comentario = $1 where id_vacaciones = $2
                    `, [motivo_eliminacion, id_vacaciones]);
                    if (eliminacion.rowCount > 0) {
                        var diasTotales = response.rows[0].cantidad_dias + usuario.rows[0].dias_restantes;
                        //console.log(diasTotales);
                        const restaurarDias = await pool.query(`update empleados set dias_restantes = $1 where id_empleado = $2`, [diasTotales, response.rows[0].id_empleado]);
                        if (restaurarDias.rowCount > 0) {
                            res.status(200).json({ "message": "Vacaciones eliminadas con exito" })
                        } else {
                            res.status(400).json({ "message": "Error al restaurar vacaciones" })

                        }
                    } else {
                        res.status(400).json({ "message": "Error al eliminar vacaciones" })

                    }
                } else {
                    res.status(400).json({ "message": "Error al obtener usuario" })

                }
            } else {
                res.status(400).json({ "message": "No se puede eliminar esta vacacion" })
            }
        } else {
            res.status(400).json({ "message": "Error al obtener vacaciones" })
        }
    } catch (error) {
        res.status(500).json({ "message": "Error al eliminar vacaciones server" })
    }



}



module.exports = {
    getVacaciones,
    getVacacionesByEmpleado,
    solicitarVacaciones,
    getVacacionesByEstado,
    getVacacionesById,
    getVacacionesByEmpleadoEstado,
    revisarVacacionesJefe,
    deleteVacaciones,
    getVacacionesByIdJefe,
    getVacacionesIdJefeEstado,
    workingDays,
    getVacacionesFiltro,
    getVacacionesFiltroBySector,
    eliminarVacaciones

}