const { pool } = require('../config');



//Obtener todas las  Licencias
const getDomicilios = async (req, res) => {
    try {
        const response = await pool.query(`select md.id_direccion,u.id_usuario,u.nombre,u.apellido, td.descripcion ,md.calle,md.numero,md.localidad,md.provincia, md.estado, to_char(md.fecha_actualizacion::timestamp without time zone, 'dd/MM/yyyy'::text)as "fecha_actualizacion" from mis_direcciones md join tipo_direccion td on md.tipo_direccion = td.id_tipo_dir join usuarios u on md.id_usuario=u.id_usuario order by md.id_direccion desc`);
        if (response.rowCount > 0) {
            res.status(200).json(response.rows)
        } else {
            res.status(200).json(response.rows)
        }
    } catch (error) {
        res.status(500).json({ message: error });
    }
};


//Get Direcciones By Id_Usuario - Activas
const getDireccionesByUsuario = async (req, res) => {
    try {
        const { id_usuario } = req.params;
        const response = await pool.query(`select md.id_direccion,u.id_usuario,u.nombre,u.apellido, td.descripcion ,md.calle,md.numero,md.localidad,md.provincia,md.estado, md.observaciones,to_char(md.fecha_actualizacion::timestamp without time zone, 'dd/MM/yyyy'::text)as "fecha_actualizacion", md.url_frente_domicilio from mis_direcciones md join tipo_direccion td on md.tipo_direccion = td.id_tipo_dir join usuarios u on md.id_usuario=u.id_usuario where md.id_usuario=$1 and estado=1 order by md.tipo_direccion asc `, [id_usuario]);

        if (response.rowCount > 0) {
            //console.log(response.rows);
            res.status(200).json(response.rows)
        } else {
            res.status(200).json(response.rows)
        }
    }
    catch (error) {
        res.status(500).json({
            message: 'Error al obtener direccion/es'
        });
    }
};


//Get Direcciones By Id_Direccion 
const getDireccionesByIdDireccion = async (req, res) => {
    try {
        const { id_direccion } = req.params;
        const response = await pool.query(`select md.id_direccion,u.id_usuario, u.nombre,u.apellido, td.descripcion ,md.calle,md.numero,md.localidad,md.provincia,md.estado,to_char(md.fecha_actualizacion::timestamp without time zone, 'dd/MM/yyyy'::text)as "fecha_actualizacion" from mis_direcciones md join tipo_direccion td on md.tipo_direccion = td.id_tipo_dir join usuarios u on md.id_usuario=u.id_usuario where md.id_direccion= $1`, [id_direccion]);

        if (response.rowCount > 0) {
            //console.log(response.rows);
            res.status(200).json(response.rows)
        } else {
            res.status(200).json(response.rows)
        }
    }
    catch (error) {
        res.status(500).json({
            message: 'Error al obtener direccion/es'
        });
    }
};



//create domicilio
//1 activo - 0 baja //Se crea el domicilio activo
const createDomicilio = async (req, res) => {
    try {
        const { calle, numero, localidad, provincia, tipo_direccion, id_usuario, observaciones } = req.body;
        const file = req.file.path;
        //comprobar que el id_usuario exista
        const verify = await pool.query('SELECT * FROM usuarios WHERE id_usuario = $1', [id_usuario]);

        if (verify.rowCount > 0) {
            const response = await pool.query(`insert into mis_direcciones(calle,numero,localidad,provincia,tipo_direccion,id_usuario,estado, observaciones,fecha_actualizacion,url_frente_domicilio)values($1,$2,$3,$4,$5,$6,1,$7,now(),$8)`, [calle, numero, localidad, provincia, tipo_direccion, id_usuario, observaciones,file]);
            res.status(200).json({
                message: 'Direccion Creada'
            });
        } else {

            res.status(200).json({
                message: 'Usuario no encontrado'
            });
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error al crear direccion'
        });
    }
};



//editar Noticia titulo, subtitulo, cuerpo noticia, fecha_vencimiento
const editDomicilio = async (req, res) => {
    try {
        const{id_direccion}= req.params
        const { calle,numero,localidad, provincia, tipo_direccion,estado } = req.body;
        const consulta = await pool.query('select md.id_direccion, u.nombre,u.apellido, td.descripcion ,md.calle,md.numero,md.localidad,md.provincia,md.estado from mis_direcciones md join tipo_direccion td on md.tipo_direccion = td.id_tipo_dir join usuarios u on md.id_usuario=u.id_usuario where md.id_direccion= $1 and md.estado=1', [id_direccion]);
        if (consulta.rowCount > 0) {
            const response = await pool.query(`update mis_direcciones set calle=$1,numero=$2,localidad=$3, provincia=$4, tipo_direccion=$5,estado=$6, fecha_actualizacion=now() where id_direccion=$7`, [calle,numero,localidad, provincia, tipo_direccion,estado,id_direccion]);
            if (response.rowCount > 0) {
                res.status(200).json({
                    message: 'Direccion editada correctamente'
                });
            } else {
                res.status(500).json({
                    message: 'No pudo editarse direccion'
                });
            }
        } else {
            res.status(500).json({
                message: 'No se puede editar direccion ya que no esta activa'
            });
        }
    }
    catch (error) {
        res.status(500).json({
            message: 'No se pudo editar la noticia server'
        });
    }
}




//baja Direccion
//estado = 0 - Baja
const bajaDireccion = async (req, res) => {
    const { id_direccion } = req.body;
    try {
        //Verificar q exista el usuario
        const user = await pool.query('select md.id_direccion, u.nombre,u.apellido, td.descripcion ,md.calle,md.numero,md.localidad,md.provincia,md.estado from mis_direcciones md join tipo_direccion td on md.tipo_direccion = td.id_tipo_dir join usuarios u on md.id_usuario=u.id_usuario where md.id_direccion=$1 and md.estado=1', [id_direccion]);
        if (user.rowCount > 0) {
            
            //Baja direccion
               const response = await pool.query('update mis_direcciones set estado=0 where id_direccion=$1', [id_direccion]);
                res.status(200).json({ message: 'Direccion dada de baja' });
            }
         else {
            res.status(200).json({ message: 'No se puede dar de baja la direccion' })
        }
    }
    catch (error) {
        res.status(500).json({ message: 'No se pudo dar de baja la direccion - service' });
    }
}












module.exports = {
    getDomicilios,
    getDireccionesByUsuario,
    createDomicilio,
    editDomicilio,
    bajaDireccion,
    getDireccionesByIdDireccion

};