const { pool } = require('../config');




//Get adjuntos activos by usuario
// 0=baja - 1=activo
const getAdjuntosActivosByIdUsuario = async (req, res) => {
    try {
        const { id_empleado } = req.params;
        const response = await pool.query(`select * from adjuntos where id_empleado=$1 and estado=1 order by id_adjunto desc`, [id_empleado]);

        if (response.rowCount > 0) {
            res.status(200).json(response.rows)
        } else {
            res.status(200).json(response.rows)
        }
    }
    catch (error) {
        res.status(500).json({
            message: 'Error al obtener adjunto'
        });
    }
};




//Get LicenciasById
const getAdjuntosByIdAdjunto = async (req, res) => {
    try {
        const { id_adjunto } = req.params;
        const response = await pool.query(`select * from adjuntos where id_adjunto=$1`, [id_adjunto]);

        if (response.rowCount > 0) {
            res.status(200).json(response.rows)
        } else {
            res.status(200).json(response.rows)
        }
    }
    catch (error) {
        res.status(500).json({
            message: 'Error al obtener adjunto'
        });
    }
};



//Nueva licencia
const createAdjunto = async (req, res) => {
    const { id_empleado,id_tipo_adjunto,nombre_adjunto } = req.body;
    const file = req.file.path;
    //console.log(req.file);
    //console.log(req.body);
        try {

        const response = await pool.query(`insert into adjuntos (id_empleado,id_tipo_adjunto,url_adj,nombre_adjunto,estado)values($1,$2,$3,$4,1);`, [id_empleado,id_tipo_adjunto,file,nombre_adjunto]);
        
        if (response.rowCount > 0) {
            
           
            res.status(200).json({
                message: 'Adjunto cargado correctamente'
            });
        } else {
            res.status(500).json({
                message: 'No se pudo cargar adjunto'
            });
        }
    } catch (error) {
        res.status(501).json({
            message: 'Error al cargar adjunto server'
        });
    }
}


const deleteAdjunto = async (req, res) => {

    try {
        const { id_adjunto } = req.params;
    const consulta = await pool.query(`select * from adjuntos where id_adjunto=$1 and estado = 1 `, [id_adjunto]);

    if (consulta.rowCount > 0) {
        const verificar = await pool.query(`update adjuntos set estado=0 where id_adjunto = $1`, [id_adjunto]);
        //console.log(verificar);
        if (verificar.rowCount > 0) {
            res.status(200).json({ message: 'adjunto dado de baja correctamente' });
        } else {
            res.status(200).json({ message: 'No se pudo dar de baja el adjunto ' });
        }
    } else {
        res.status(500).json({ message: 'No se encuentra el adjunto ' });
    }
    } catch (error) {
        res.status(500).json({ message: 'No se eliminar adjunto - server ' });
    }
    
};




module.exports = {
    getAdjuntosActivosByIdUsuario,
    getAdjuntosByIdAdjunto,
    createAdjunto,
    deleteAdjunto
};