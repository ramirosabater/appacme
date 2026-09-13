const { pool } = require('../config');



//Get todos los Empleados
const getEmpleados = async (req, res) => {
    try {
        const response = await pool.query(`select e.id_empleado, e.n_legajo ,u.dni,u.nombre, u.apellido,TO_CHAR(e.fecha_alta,'DD/MM/YYYY')fecha_alta, 
        s.descripcion as sector, p.descripcion as cargo, e.jefe_directo,e.dias_vacaciones
        ,e.dias_restantes,em.nombre_empresa,u.id_estado from empleados e,usuarios u,sectores s, posiciones p,
        empresas em where e.id_empleado = u.id_usuario and e.id_sector=s.id_sector and 
        e.id_posicion = p.id_posicion and e.id_empresa=em.id_empresa order by u.apellido asc`);
        if (response.rowCount > 0) {
            res.status(200).json(response.rows)
        } else {
            res.status(200).json(response.rows)
        }
    } catch (error) {
        res.status(500).json({ message: error });
    }
};

//Get todos los Empleados
const getEmpleadosbyId = async (req, res) => {
    try {
        const { id_empleado } = req.params;
        //console.log(id_empleado);
        const response = await pool.query(`select e.id_empleado,e.n_legajo ,u.nombre, u.apellido,TO_CHAR(e.fecha_alta,'DD/MM/YYYY')fecha_alta, s.descripcion as sector, s.id_sector, p.descripcion as cargo,p.id_posicion, e.jefe_directo, e.n_legajo, e.dias_vacaciones,e.dias_restantes ,em.nombre_empresa, em.id_empresa from empleados e,usuarios u,sectores s, posiciones p,empresas em where e.id_empleado = u.id_usuario and e.id_sector=s.id_sector and e.id_posicion = p.id_posicion and e.id_empresa=em.id_empresa and e.id_empleado = $1 order by e.id_empleado desc`, [id_empleado]);
        if (response.rowCount > 0) {
            res.status(200).json(response.rows)
        } else {
            res.status(200).json(response.rows)
        }
    } catch (error) {
        res.status(501).json({ message: error });
    }
};


//edit usuario nombre, apellido, email, telefono, dni
const updateEmpleado = async (req, res) => {
    try {
        const { id_sector, id_posicion, jefe_directo, id_empresa, id_empleado } = req.body;
        const response = await pool.query(`update empleados set id_sector=$1,id_posicion=$2,jefe_directo=$3,id_empresa=$4 where id_empleado=$5`, [id_sector, id_posicion, jefe_directo, id_empresa, id_empleado]);

        if (response.rowCount > 0) {
            res.status(200).json({
                message: 'Empleado editado correctamente'
            });
        } else {
            res.status(501).json({
                message: 'Empleado no encontrado'
            });
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error al editar empleado'
        });
    }
};

//obtener todos los sectores
const getSectores = async (req, res) => {
    try {
        const response = await pool.query('select * from sectores');
        if (response.rowCount > 0) {
            res.status(200).json(response.rows)
        } else {
            res.status(200).json(response.rows)
        }
    } catch (error) {
        res.status(500).json({ message: error });
    }
}

//obtener todos las posiciones
const getPosiciones = async (req, res) => {
    try {
        const response = await pool.query('select * from posiciones');
        if (response.rowCount > 0) {
            res.status(200).json(response.rows)
        } else {
            res.status(200).json(response.rows)
        }
    } catch (error) {
        res.status(500).json({ message: error });
    }
}

//Get todos los Empleados by Jefe_directo
const getEmpleadosbyJefeDirecto = async (req, res) => {
    try {
        const { jefe_directo } = req.params;
        const response = await pool.query(`select e.id_empleado, e.n_legajo ,u.dni,u.nombre, u.apellido,TO_CHAR(e.fecha_alta,'DD/MM/YYYY')fecha_alta, 
        s.descripcion as sector, p.descripcion as cargo, e.jefe_directo,e.dias_vacaciones
        ,e.dias_restantes,em.nombre_empresa,u.id_estado from empleados e,usuarios u,sectores s, posiciones p,empresas em where e.id_empleado = u.id_usuario and e.id_sector=s.id_sector and 
        e.id_posicion = p.id_posicion and e.id_empresa=em.id_empresa and e.jefe_directo=$1 and u.id_estado=1 order by u.apellido asc`, [jefe_directo]);
        if (response.rowCount > 0) {
            res.status(200).json(response.rows)
        } else {
            res.status(200).json(response.rows)
        }
    } catch (error) {
        res.status(500).json({ message: error });
    }
};


module.exports = {
    getEmpleados,
    getEmpleadosbyId,
    updateEmpleado,
    getSectores,
    getPosiciones,
    getEmpleadosbyJefeDirecto

};
