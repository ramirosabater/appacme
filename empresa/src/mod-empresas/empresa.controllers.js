const { pool } = require('../config');





//Get todos los Empleados
const getEmpresas = async (req, res) => {
    try {
        const response = await pool.query(`select * from empresas order by id_empresa asc`);
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
    getEmpresas
};