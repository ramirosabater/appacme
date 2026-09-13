const { pool } = require('../config');


//get Novedades by empresa // para combo box de seleccion de novedades
const getNovedades = async (req, res) => {
    const { id_empresa } = req.params;
    try {
        const response = await pool.query('select * from novedades where id_empresa=$1 order by id_novedades', [id_empresa]);
        if (response.rowCount > 0) {
            res.status(200).json(response.rows);
        } else {
            res.status(200).json(response.rows)
        }
    } catch (error) {
        res.status(500).json(error);
    }
};


//Crear Novedad_Empleado
const createNovedadEmpleado = async (req, res) => {
    try {
        const { id_novedad, id_empleado, cantidad } = req.body;
        const consulta = await pool.query(`select e.id_empleado,e.id_empresa, u.id_estado from empleados e join usuarios u on e.id_empleado=u.id_usuario where id_empleado=$1 and u.id_estado=1`, [id_empleado])
        if (consulta.rowCount > 0) {
            try {
                const response = await pool.query(`insert into empleados_novedades(id_novedades,id_empleado,cantidad,fecha,estado)values($1,$2,$3,now(),1)`, [id_novedad, id_empleado, cantidad]);
                //console.log(response);
                if (response.rowCount > 0) {
                    res.status(200).json({
                        message: 'Novedad cargada correctamente'
                    });
                } else {
                    res.status(500).json({
                        message: 'No se pudo cargar novedad'
                    });
                }
            } catch (error) {
                res.status(501).json({
                    message: 'Error al crear novedad'
                });
            }
        } else {
            res.status(500).json({
                message: 'No se puede cargar novedad a empleado. Revise su estado.'
            })
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error al cargar novedad server'
        });
    }

}


//Get Novedades_empleado cargadas activas// la que ve RRHH
const getNovedadesEmpleados = async (req, res) => {
    try {
        const response = await pool.query(`select en.id_empleado_novedad, to_char(en.fecha::timestamp with time zone, 'dd/MM/yyyy'::text) AS "fecha_creacion",e.n_legajo,u.apellido,u.nombre,en.id_novedades,n.codigo,n.desc_novedades,en.id_empleado,en.cantidad,en.estado,e.id_empresa from empleados_novedades en join novedades n on en.id_novedades=n.id_novedades 
        join empleados e on en.id_empleado=e.id_empleado join usuarios u on e.id_empleado=u.id_usuario order by en.fecha desc
        `);
        if (response.rowCount > 0) {
            res.status(200).json(response.rows)
        } else {
            res.status(200).json(response.rows)
        }
    } catch (error) {
        res.status(500).json({ message: 'No se pudo obtener novedades' });
    }
};


//Get Novedades_empleado cargadas activas// las que ve el Jefe Directo
const getNovedadesJefe = async (req, res) => {
    try {
        const { jefe_directo } = req.params;
        const response = await pool.query(`select en.id_empleado_novedad,to_char(en.fecha::timestamp with time zone, 'dd/MM/yyyy'::text) AS "fecha_creacion",e.n_legajo,u.apellido,u.nombre,en.id_novedades,n.codigo,n.desc_novedades,en.id_empleado,en.cantidad,e.id_empresa,en.estado from empleados_novedades en join novedades n on en.id_novedades=n.id_novedades 
        join empleados e on en.id_empleado=e.id_empleado join usuarios u on e.id_empleado=u.id_usuario where e.jefe_directo =$1 order by en.fecha desc
        `, [jefe_directo]);
        if (response.rowCount > 0) {
            res.status(200).json(response.rows)
        } else {
            res.status(200).json(response.rows)
        }
    } catch (error) {
        res.status(500).json({ message: 'No se pudo obtener novedades' });
    }
};


//editar Novedades id_novedades, cantidad, fecha=now(), estado=2
const bajaNovedad = async (req, res) => {
    const { id_empleado_novedad } = req.body;
    try {
        const consulta = await pool.query(`select * from empleados_novedades where id_empleado_novedad=$1 and estado=1`, [id_empleado_novedad]);
        if (consulta.rowCount > 0) {
            const response = await pool.query(`update empleados_novedades set estado=2 where id_empleado_novedad=$1`, [id_empleado_novedad]);
            if (response.rowCount > 0) {
                res.status(200).json({
                    message: 'Novedad dada de baja correctamente'
                });
            } else {
                res.status(500).json({
                    message: 'No se pudo dar de baja'
                });
            }
        } else {
            res.status(500).json({
                message: 'No se encuentra novedad o no puede darse de baja'
            });
        }
    }
    catch (error) {
        res.status(500).json({
            message: 'No se puede dar de baja novedad - server'
        });
    }
}


//Descargar licencias entre fecha y fecha en formato Json
const descargarNovedades = async (req, res) => {
    try {
        const { fecha_inicio, fecha_fin, id_empresa } = req.body;
        const response = await pool.query(`
        select en.id_empleado_novedad, to_char(en.fecha::timestamp with time zone, 'dd/MM/yyyy'::text) AS "fecha_creacion", en.cantidad, emp.n_legajo, nov.codigo
		from empleados_novedades en, empleados emp, novedades nov
        where en.id_empleado = emp.id_empleado and en.id_novedades = nov.id_novedades and
        en.fecha::date between $1 and $2 and
        nov.id_empresa=$3 and en.estado=1 order by en.fecha desc
        `, [fecha_inicio, fecha_fin, id_empresa]);

        if (response.rowCount > 0) {
            res.status(200).json(response.rows);
        } else {
            res.status(200).json();
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error al descargar novedad'
        });
    }
};


//Descargar licencias entre fecha y fecha en formato Json
const getNovedadesByJefeDirecto = async (req, res) => {
    try {
        const { fecha_inicio, fecha_fin, jefe_directo } = req.body;
        const response = await pool.query(`
        select en.id_empleado_novedad, to_char(en.fecha::timestamp with time zone, 'dd/MM/yyyy'::text) AS "fecha_creacion", en.cantidad, emp.n_legajo, nov.codigo
		from empleados_novedades en, empleados emp, novedades nov
        where en.id_empleado = emp.id_empleado and en.id_novedades = nov.id_novedades and
        en.fecha::date between $1 and $2 and
        emp.jefe_directo=$3 and en.estado=1 order by en.fecha desc
        `, [fecha_inicio, fecha_fin, jefe_directo]);

        if (response.rowCount > 0) {
            res.status(200).json(response.rows);
        } else {
            res.status(200).json();
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error al descargar novedad'
        });
    }
};

//Todas las novedades por Jefe_directo
const getAllNovedadesByJefeDirecto = async (req, res) => {
    try {
        const { jefe_directo } = req.params;
        const response = await pool.query(`select en.id_empleado_novedad, to_char(en.fecha::timestamp with time zone, 'dd/MM/yyyy'::text) AS "fecha_creacion",e.n_legajo,u.apellido,u.nombre,en.id_novedades,n.codigo,n.desc_novedades,en.id_empleado,en.cantidad,en.estado,e.id_empresa from empleados_novedades en join novedades n on en.id_novedades=n.id_novedades 
        join empleados e on en.id_empleado=e.id_empleado join usuarios u on e.id_empleado=u.id_usuario 
        WHERE e.jefe_directo=$1 order by en.fecha desc`, [jefe_directo]);

        if (response.rowCount > 0) {
            res.status(200).json(response.rows);
        } else {
            res.status(200).json();
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error al descargar novedad'
        });
    }
};


module.exports = {
    getNovedades,
    createNovedadEmpleado,
    getNovedadesEmpleados,
    getNovedadesJefe,
    bajaNovedad,
    descargarNovedades,
    getNovedadesByJefeDirecto,
    getAllNovedadesByJefeDirecto
}