const { pool } = require('../config');


//Get todos los feriados
const getFeriados = async (req, res) => {
    try {
        const response = await pool.query(`SELECT id_feriado, fecha_feriado as feriado, 
        TO_CHAR(fecha_feriado::timestamp with time zone, 'dd/MM/yyyy') AS "fecha_feriado", 
        descripcion FROM feriados ORDER BY feriado DESC;;`);
        if (response.rowCount > 0) {
            res.status(200).json(response.rows)
        } else {
            res.status(200).json(response.rows)
        }
    } catch (error) {
        res.status(500).json({ message: error });
    }
};

//Get todos los feriados del año
const getFeriadosActuales = async (req, res) => {
    try {
        const response = await pool.query(`SELECT * FROM feriados WHERE date_part('year', fecha_feriado) = date_part('year', CURRENT_DATE)order by fecha_feriado desc`);
        if (response.rowCount > 0) {
            res.status(200).json(response.rows)
        } else {
            res.status(200).json(response.rows)
        }
    } catch (error) {
        res.status(500).json({ message: error });
    }
};



const getFeriadoByFecha = async (req, res) => {
    try {
        const { fecha_feriado } = req.body;
        const response = await pool.query(`select * from feriados where fecha_feriado =$1`, [fecha_feriado]);
        //console.log(response)
        if (response.rowCount > 0) {
            res.status(200).json(response.rows)
        } else {
            res.status(200).json(response.rows)
        }
    }
    catch (error) {
        res.status(500).json({
            message: 'Error al obtener feriado'
        });
    }
};


//Crear Feriado
const createFeriado = async (req, res) => {
    const { fecha_feriado, descripcion } = req.body;
    const consulta = await pool.query('select * from feriados where fecha_feriado =$1', [fecha_feriado])
    if (consulta.rowCount > 0) {
        res.status(500).json({
            message: 'La fecha seleccionada ya tiene un feriado cargado'
        })
    } else {
        try {
            const response = await pool.query('insert into feriados(fecha_feriado,descripcion)values($1,$2);', [fecha_feriado, descripcion]);
            //console.log(response);
            if (response.rowCount > 0) {
                res.status(200).json({
                    message: 'feriado creado correctamente'
                });
            } else {
                res.status(500).json({
                    message: 'No se pudo crear feriado'
                });
            }
        } catch (error) {
            res.status(501).json({
                message: 'Error al crear feriado'
            });
        }
    }
}


//editar Noticia titulo, subtitulo, cuerpo noticia, fecha_vencimiento
const updateFeriado = async (req, res) => {
    const { fecha_feriado, descripcion } = req.body;
    try {
        const consulta = await pool.query('select * from feriados where fecha_feriado =$1', [fecha_feriado]);
        if (consulta.rowCount > 0) {
            const response = await pool.query('update feriados set descripcion=$1 where fecha_feriado =$2', [descripcion, fecha_feriado]);
            if (response.rowCount > 0) {
                res.status(200).json({
                    message: 'Feriado editado correctamente'
                });
            } else {
                res.status(500).json({
                    message: 'No pudo editarse feriado'
                });
            }
        } else {
            res.status(500).json({
                message: 'No se encontro feriado para editar'
            });
        }
    }
    catch (error) {
        res.status(500).json({
            message: 'No se pudo editarse feriado - server'
        });
    }
}






//baja Feriado
const deleteFeriado = async (req, res) => {
    const { fecha_feriado } = req.body;
    const consulta = await pool.query('select * from feriados where fecha_feriado =$1', [fecha_feriado])
    if (consulta.rowCount > 0) {
        try {
            const response = await pool.query('delete from feriados where fecha_feriado =$1', [fecha_feriado]);
            if (response.rowCount > 0) {
                res.status(200).json({
                    message: 'feriado eliminado correctamente'
                });
            } else {
                res.status(500).json({
                    message: 'No se pudo eliminar feriado'
                });
            }
        } catch (error) {
            res.status(501).json({
                message: 'Error al eliminar feriado'
            });
        }




    } else {
        res.status(500).json({
            message: 'No existe feriado cargado para la fecha seleccionada'
        })
    }
};


//obtener proximo feriado
const getProximoFeriado = async (req, res) => {
    try {
        const response = await pool.query(`SELECT id_feriado, 
        fecha_feriado AS feriado, 
        TO_CHAR(fecha_feriado::timestamp with time zone, 'dd/MM/yyyy') AS "fecha_feriado", 
        descripcion FROM feriados WHERE fecha_feriado >= CURRENT_DATE ORDER BY feriado asc LIMIT 1;`);
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
    getFeriados,
    getFeriadosActuales,
    getFeriadoByFecha,
    createFeriado,
    updateFeriado,
    deleteFeriado,
    getProximoFeriado
};