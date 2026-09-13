const { poolOportunidades } = require('../config');
const { validateRecaptcha } = require('../middleware/recaptcha');

//get postulantes por id de empleo
const getPostulantes = async (req, res) => {
    try {
        const { id_empleo } = req.params;
        let response;
        response = await poolOportunidades.query('SELECT * FROM postulantes WHERE id_empleo = $1 order by id_postulante asc', [id_empleo]);

        res.status(200).json(response.rows);
    } catch (error) {
        res.status(500).json(error);
    }
};

//Get postulantes fuera de aviso
/* const getAllPostulantes = async (req, res) => {
    try {
        const response = await poolOportunidades.query(`SELECT * FROM postulantes WHERE id_empleo IS NULL order by id_postulante desc;`);
        if (response.rowCount > 0) {
            res.status(200).json(response.rows);
        } else {
            res.status(200).json(response.rows);
        }
    } catch (error) {
        res.status(500).json(error);
    }
}; */

const getAllPostulantes = async (req, res) => {
    try {

        const { id_categoria } = req.params;

        let query = `
      SELECT p.*, c.id_categoria_trabajo, c.descripcion_categoria 
      FROM postulantes p
      JOIN postulante_puesto pu ON p.id_postulante = pu.id_postulante
      JOIN categoria_trabajo c ON c.id_categoria_trabajo = pu.id_categoria_trabajo
      WHERE p.id_empleo IS NULL 
          `;

        const params = [];
        if (id_categoria) {
            params.push(id_categoria);
            query += ` AND c.id_categoria_trabajo = $${params.length}`;
        }

        query += ` ORDER BY p.id_postulante DESC;`;

        const result = await poolOportunidades.query(query, params);


        const rows = result.rows;

        const postulantesMap = new Map();

        for (const row of rows) {
            const id = row.id_postulante;
            if (!postulantesMap.has(id)) {
                // Inicializamos al postulante
                postulantesMap.set(id, {
                    id_postulante: row.id_postulante,
                    id_provincia: row.id_provincia,
                    id_empleo: row.id_empleo,
                    nombre: row.nombre,
                    apellido: row.apellido,
                    email: row.email,
                    tipo_documento: row.tipo_documento,
                    nro_documento: row.nro_documento,
                    telefono: row.telefono,
                    genero: row.genero,
                    localidad: row.localidad,
                    fecha_postulacion: row.fecha_postulacion,
                    curriculum_vitae: row.curriculum_vitae,
                    estado: row.estado,
                    categorias: [] // Aquí guardamos los puestos
                });
            }

            // Agregamos la categoría al array
            postulantesMap.get(id).categorias.push({
                id_categoria_trabajo: row.id_categoria_trabajo,
                descripcion_categoria: row.descripcion_categoria
            });
        }

        const postulantes = Array.from(postulantesMap.values());

        res.status(200).json(postulantes);
    } catch (error) {
        console.error('Error en getAllPostulantes:', error);
        res.status(500).json({ error: 'Error al obtener postulantes' });
    }
};



const createPostulante = async (req, res) => {
    try {
        let { id_empleo, nombre, apellido, email, telefono, tipo_documento, nro_documento, genero, id_provincia, localidad, fecha_postulacion, curriculum_vitae, estado, puestos_interes, recaptchaToken } = req.body;

        // Validar reCAPTCHA
        if (!recaptchaToken) {
            return res.status(400).json({ error: 'Token de reCAPTCHA requerido' });
        }

        const recaptchaResult = await validateRecaptcha(recaptchaToken);
        if (!recaptchaResult.success) {
            return res.status(400).json({ error: 'Validación de reCAPTCHA fallida' });
        }

        const file = req.file.path;
        //console.log(recaptchaToken)
        if (id_empleo === 'null') {
            id_empleo = null;
        }

        const existe = await consultarSiYaPostulo(email, id_empleo);

        if (existe) {
            return res.status(409).json({
                message: 'Ya existe una postulacion para este cargo con este email.'
            })
        }

        const response = await poolOportunidades.query('insert into postulantes(id_empleo,id_provincia,nombre,apellido,email,tipo_documento, nro_documento, telefono, genero, localidad, fecha_postulacion, curriculum_vitae, estado) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id_postulante', [id_empleo, id_provincia, nombre, apellido, email, tipo_documento, nro_documento, telefono, genero, localidad, fecha_postulacion, file, 'enviada']);
        const postulante = response.rows[0].id_postulante;


        if (id_empleo == null) {
            await addCategoriaPostulante(postulante, puestos_interes);
        }


        res.status(200).json({
            message: 'Postulante creado correctamente',
            body: {
                postulante: { id_empleo, id_provincia, nombre, apellido, email, tipo_documento, nro_documento, telefono, genero, localidad, fecha_postulacion, curriculum_vitae, estado }
            }
        })
    } catch (error) {
        console.error('Error en createPostulante:', error);
        res.status(500).json({ error: 'Error al crear postulante', details: error.message });
    }
}

//agregar categoria-puesto en postulante general
const addCategoriaPostulante = async (postulante, puestos_interes) => {
    try {
        if (typeof puestos_interes === 'string') {
            puestos_interes = JSON.parse(puestos_interes);
        }

        //console.log('Puestos iterados', puestos_interes)
        for (const puesto of puestos_interes) {
            //console.log('id_categoria_trabajo', puesto.id_categoria_trabajo);
            await poolOportunidades.query(
                `INSERT INTO postulante_puesto (id_postulante, id_categoria_trabajo) VALUES ($1, $2);`,
                [postulante, puesto.id_categoria_trabajo]
            );
        }
    } catch (error) {
        throw error;
    }
}



const consultarSiYaPostulo = async (email, id_empleo) => {
    try {
        let query;
        let params;

        if (id_empleo === 'null' || id_empleo === null) {
            query = `SELECT count(*) FROM postulantes WHERE email = $1 AND id_empleo IS NULL`;
            params = [email];
        } else {
            query = `SELECT count(*) FROM postulantes WHERE email = $1 AND id_empleo = $2`;
            params = [email, id_empleo];
        }

        const result = await poolOportunidades.query(query, params);
        const count = parseInt(result.rows[0].count, 10);

        return count > 0;

    } catch (error) {
        console.error('Error en consultarSiYaPostulo:', error);
        throw error;
    }
}


module.exports = {
    getPostulantes,
    createPostulante,
    getAllPostulantes,
    addCategoriaPostulante
}