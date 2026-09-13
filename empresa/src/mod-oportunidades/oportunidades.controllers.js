const { poolOportunidades, secret } = require('../config');
const fs = require('fs-extra');
const path = require('path');
const pdfParse = require('pdf-parse');
// Optional parsers (may not be installed in all environments)
let mammoth = null;
try {
    mammoth = require('mammoth');
} catch (e) {
    // mammoth not installed — we'll provide graceful fallbacks later
}
let createWorker = null;
try {
    ({ createWorker } = require('tesseract.js'));
} catch (e) {
    // tesseract.js not installed — fallback to message
}

//get Oportunidades con requisitos y beneficios
const getOportunidades = async (req, res) => {
    try {
        const response = await poolOportunidades.query(`
            SELECT e.*, 
                   ch.carga_horaria, 
                   m.modalidad, 
                   u.ubicacion, 
                   a.area 
            FROM empleos e
            JOIN cargas_horarias ch ON e.id_carga_horaria = ch.id_carga_horaria
            JOIN modalidades m ON e.id_modalidad = m.id_modalidad
            JOIN ubicaciones u ON e.id_ubicacion = u.id_ubicacion
            JOIN areas a ON e.id_area = a.id_area
            where e.estado= 'activo'
            order by e.fecha_creacion desc;
        `);
        if (response.rowCount > 0) {
            res.status(200).json(response.rows);
        } else {
            res.status(200).json(response.rows);
        }
    } catch (error) {
        res.status(500).json(error);
    }
}

const getAllOportunidades = async (req, res) => {
    try {
        const response = await poolOportunidades.query(`
            SELECT e.*, 
                   ch.carga_horaria, 
                   m.modalidad, 
                   u.ubicacion, 
                   a.area 
            FROM empleos e
            JOIN cargas_horarias ch ON e.id_carga_horaria = ch.id_carga_horaria
            JOIN modalidades m ON e.id_modalidad = m.id_modalidad
            JOIN ubicaciones u ON e.id_ubicacion = u.id_ubicacion
            JOIN areas a ON e.id_area = a.id_area
            order by e.fecha_creacion desc;
        `);
        if (response.rowCount > 0) {
            res.status(200).json(response.rows);
        } else {
            res.status(200).json(response.rows);
        }
    } catch (error) {
        res.status(500).json(error);
    }
}

//get Oportunidades by id con requisitos y beneficios en formato Json
const getOportunidadById = async (req, res) => {
    try {
        const { id } = req.params;
        const oportunidadResponse = await poolOportunidades.query(`
            SELECT e.*, 
                   ch.carga_horaria, 
                   m.modalidad, 
                   u.ubicacion, 
                   a.area 
            FROM empleos e
            JOIN cargas_horarias ch ON e.id_carga_horaria = ch.id_carga_horaria
            JOIN modalidades m ON e.id_modalidad = m.id_modalidad
            JOIN ubicaciones u ON e.id_ubicacion = u.id_ubicacion
            JOIN areas a ON e.id_area = a.id_area
            WHERE e.id_empleo = $1
        `, [id]);

        if (oportunidadResponse.rows.length > 0) {

            const oportunidad = oportunidadResponse.rows[0];
            const requisitosResponse = await poolOportunidades.query('SELECT * FROM requisitos WHERE id_empleo = $1', [id]);
            const beneficiosResponse = await poolOportunidades.query('SELECT * FROM beneficios WHERE id_empleo = $1', [id]);

            res.status(200).json({
                ...oportunidad,
                requisitos: requisitosResponse.rows,
                beneficios: beneficiosResponse.rows
            });
        } else {
            res.status(404).json({ message: 'Oportunidad no encontrada' });
        }
    } catch (error) {
        res.status(500).json(error);
    }
};

//create oportunidad
const createOportunidad = async (req, res) => {
    try {
        const { fecha_creacion, fecha_publicacion, fecha_fin_publicacion, titulo, descripcion, id_carga_horaria, id_modalidad, id_ubicacion, id_area, estado } = req.body;
        const response = await poolOportunidades.query('insert into empleos (fecha_creacion, fecha_publicacion, fecha_fin_publicacion, titulo, descripcion, id_carga_horaria, id_modalidad, id_ubicacion, id_area, estado) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)', [fecha_creacion, fecha_publicacion, fecha_fin_publicacion, titulo, descripcion, id_carga_horaria, id_modalidad, id_ubicacion, id_area, estado]);
        res.status(200).json({
            message: 'Oportunidad creada correctamente',
            body: {
                oportunidad: { fecha_creacion, fecha_publicacion, fecha_fin_publicacion, titulo, descripcion, id_carga_horaria, id_modalidad, id_ubicacion, id_area, estado }
            }
        })
    } catch (error) {
        res.status(500).json(error);
    }
}

//update oportunidad
const updateOportunidad = async (req, res) => {
    try {
        const id = req.params.id;
        const { fecha_creacion, fecha_publicacion, fecha_fin_publicacion, titulo, descripcion, id_carga_horaria, id_modalidad, id_ubicacion, id_area, estado } = req.body;
        const response = await poolOportunidades.query('update empleos set fecha_creacion = $1, fecha_publicacion = $2, fecha_fin_publicacion = $3, titulo = $4, descripcion = $5, id_carga_horaria = $6, id_modalidad = $7, id_ubicacion = $8, id_area = $9, estado = $10 where id_empleo = $11', [fecha_creacion, fecha_publicacion, fecha_fin_publicacion, titulo, descripcion, id_carga_horaria, id_modalidad, id_ubicacion, id_area, estado, id]);
        res.status(200).json({
            message: 'Oportunidad actualizada correctamente',
            body: {
                oportunidad: { fecha_creacion, fecha_publicacion, fecha_fin_publicacion, titulo, descripcion, id_carga_horaria, id_modalidad, id_ubicacion, id_area, estado }
            }
        })
    } catch (error) {
        res.status(500).json(error);
    }
}

//delete oportunidad (baja logica)
const deleteOportunidad = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await poolOportunidades.query('update empleos set estado=0 where id_empleo = $1', [id]);
        res.status(200).json({
            message: 'Oportunidad dada de baja correctamente',
            body: {
                oportunidad: { id }
            }
        })
    } catch (error) {
        res.status(500).json(error);
    }
}

//agregar requisitos a una oportunidad: id_empleo, id_requisito, requisito
const addRequisito = async (req, res) => {
    try {
        const { id_empleo, requisito } = req.body;
        const response = await poolOportunidades.query('insert into requisitos (id_empleo, requisito) values ($1, $2)', [id_empleo, requisito]);
        res.status(200).json({
            message: 'Requisito agregado correctamente',
            body: {
                requisito: { id_empleo, requisito }
            }
        })
    } catch (error) {
        res.status(500).json(error);
    }
}

//eliminar requisito de una oportunidad: id_requisito
const deleteRequisito = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await poolOportunidades.query('delete from requisitos where id_requisito = $1', [id]);
        res.status(200).json({
            message: 'Requisito eliminado correctamente',
            body: {
                requisito: { id }
            }
        })
    } catch (error) {
        res.status(500).json(error);
    }
}

//agregar beneficio a una oportunidad: id_empleo, id_beneficio, beneficio
const addBeneficio = async (req, res) => {
    try {
        const { id_empleo, beneficio } = req.body;
        const response = await poolOportunidades.query('insert into beneficios (id_empleo, beneficio) values ($1, $2)', [id_empleo, beneficio]);
        res.status(200).json({
            message: 'Beneficio agregado correctamente',
            body: {
                beneficio: { id_empleo, beneficio }
            }
        })
    } catch (error) {
        res.status(500).json(error);
    }
}

//eliminar beneficio de una oportunidad: id_beneficio
const deleteBeneficio = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await poolOportunidades.query('delete from beneficios where id_beneficio = $1', [id]);
        res.status(200).json({
            message: 'Beneficio eliminado correctamente',
            body: {
                beneficio: { id }
            }
        })
    } catch (error) {
        res.status(500).json(error);
    }
}

const getCargaHoraria = async (req, res) => {
    try {
        const response = await poolOportunidades.query(
            `select * from cargas_horarias order by id_carga_horaria asc;`
        );
        if (response.rowCount > 0) {
            res.status(200).json(response.rows);
        } else {
            res.status(200).json(response.rows);
        }
    } catch (error) {
        res.status(500).json(error);
    }
}

const getUbicaciones = async (req, res) => {
    try {
        const response = await poolOportunidades.query(`
            select * from ubicaciones order by id_ubicacion asc;`);
        if (response.rowCount > 0) {
            res.status(200).json(response.rows);
        } else {
            res.status(200).json(response.rows);
        }
    } catch (error) {
        console.error('Error al obtener ubicaciones:', error.message, error.stack);

    }
}

const getModalidad = async (req, res) => {
    try {
        const response = await poolOportunidades.query(`
            select * from modalidades order by id_modalidad asc;`);
        if (response.rowCount > 0) {
            res.status(200).json(response.rows);
        } else {
            res.status(200).json(response.rows);
        }
    } catch (error) {
        console.error('Error al obtener ubicaciones:', error.message, error.stack);

    }
}


const getAreas = async (req, res) => {
    try {
        const response = await poolOportunidades.query(`
            select * from areas order by id_area asc;`);
        if (response.rowCount > 0) {
            res.status(200).json(response.rows);
        } else {
            res.status(200).json(response.rows);
        }
    } catch (error) {
        console.error('Error al obtener ubicaciones:', error.message, error.stack);

    }
}

const getCategoriasTrabajo = async (req, res) => {
    try {
        const response = await poolOportunidades.query(`
            select * from categoria_trabajo;`);
        if (response.rowCount > 0) {
            res.status(200).json(response.rows);
        } else {
            res.status(200).json(response.rows);
        }
    } catch (error) {
        console.error('Error al obtener ubicaciones:', error.message, error.stack);

    }
}

const scanOportunidadesPDFs = async (req, res) => {
    try {
        const { id_oportunidad } = req.params;
        const { id_categoria_trabajo } = req.query;
        let postulantesResponse;

        if (id_oportunidad === 'banco') {
            // Get postulantes not linked to any opportunity, opcionalmente filtrado por categoría
            if (id_categoria_trabajo) {
                postulantesResponse = await poolOportunidades.query(
                    `SELECT DISTINCT p.* 
                     FROM postulantes p
                     JOIN postulante_puesto pp ON p.id_postulante = pp.id_postulante
                     WHERE p.id_empleo IS NULL 
                     AND p.curriculum_vitae IS NOT NULL 
                     AND pp.id_categoria_trabajo = $1`,
                    [id_categoria_trabajo]
                );
            } else {
                postulantesResponse = await poolOportunidades.query(
                    'SELECT * FROM postulantes WHERE id_empleo IS NULL AND curriculum_vitae IS NOT NULL'
                );
            }
        } else {
            // Get postulantes for this specific opportunity
            postulantesResponse = await poolOportunidades.query('SELECT * FROM postulantes WHERE id_empleo = $1 AND curriculum_vitae IS NOT NULL', [id_oportunidad]);
        }

        if (postulantesResponse.rows.length === 0) {
            const message = id_oportunidad === 'banco' 
                ? 'No hay documentos en el banco de CVs para esa busqueda.'
                : `No hay documentos asociados a la oportunidad.`;
            res.setHeader('Content-Type', 'text/plain');
            res.setHeader('Content-Disposition', 'attachment; filename="sin_documentos.txt"');
            return res.send(message);
        }

        let combinedText = '';

        for (const postulante of postulantesResponse.rows) {
            const originalPath = postulante.curriculum_vitae;
            
            // Simplificar: primero intentar la ruta exacta almacenada en BD
            let readSuccess = false;
            let fileContent = '';

            try {
                const fullPath = path.join(process.cwd(), 'uploads', 'oportunidades', path.basename(originalPath));
                
                if (await fs.pathExists(fullPath)) {
                    const ext = path.extname(fullPath).toLowerCase();
                    
                    if (ext === '.pdf') {
                        const dataBuffer = await fs.readFile(fullPath);
                        const data = await pdfParse(dataBuffer);
                        fileContent = data.text;
                        readSuccess = true;
                    } else if (ext === '.docx' || ext === '.doc') {
                        if (mammoth) {
                            const result = await mammoth.extractRawText({ path: fullPath });
                            fileContent = result.value;
                            readSuccess = true;
                        } else {
                            fileContent = `DOC/DOCX detectado pero la dependencia 'mammoth' no está instalada.`;
                        }
                    } else if (['.png', '.jpg', '.jpeg', '.tiff', '.bmp'].includes(ext)) {
                        if (createWorker) {
                            let worker = null;
                            try {
                                worker = await createWorker('eng');
                                const { data: { text } } = await worker.recognize(fullPath);
                                fileContent = text;
                                readSuccess = true;
                            } catch (ocrErr) {
                                fileContent = `Error en OCR: ${ocrErr.message}`;
                            } finally {
                                if (worker && typeof worker.terminate === 'function') {
                                    try { await worker.terminate(); } catch (e) { /* ignore */ }
                                }
                            }
                        } else {
                            fileContent = `Archivo de imagen detectado pero 'tesseract.js' no está instalado.`;
                        }
                    } else {
                        // Intentar leer como texto plano
                        try {
                            fileContent = await fs.readFile(fullPath, 'utf8');
                            readSuccess = true;
                        } catch (plainErr) {
                            fileContent = `Tipo de archivo no soportado: ${plainErr.message}`;
                        }
                    }
                } else {
                    fileContent = `Archivo no encontrado. `;
                }
            } catch (err) {
                fileContent = `Error al procesar archivo: ${err.message}`;
            }

            // Siempre agregar el postulante al resultado, con o sin contenido
            combinedText += `--- ${postulante.nombre} ${postulante.apellido} (${postulante.email}) ---\n${fileContent}\n\n`;
        }

        const filename = id_oportunidad === 'banco' ? 'banco_cvs.txt' : `oportunidades_${id_oportunidad}.txt`;
        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.send(combinedText);
    } catch (error) {
        console.error('Error al escanear PDFs:', error);
        res.status(500).json({ error: 'Error al escanear PDFs' });
    }
}




module.exports = {
    getOportunidades,
    getOportunidadById,
    createOportunidad,
    updateOportunidad,
    deleteOportunidad,
    addRequisito,
    deleteRequisito,
    addBeneficio,
    deleteBeneficio,
    getAllOportunidades,
    getCargaHoraria,
    getUbicaciones,
    getModalidad,
    getAreas,
    getCategoriasTrabajo,
    scanOportunidadesPDFs
}