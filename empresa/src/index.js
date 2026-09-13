const express = require('express');
const app = express();
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');

// Settings
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));


// Routes protected
app.use('/api/usuarios', require('./mod-usuarios/usuarios.routes'));
app.use('/api/empleados', require('./mod-empleados/empleados.routes'));
app.use('/api/auth', require('./mod-login/login.routes'));
app.use('/api/roles', require('../src/mod-roles/roles.routes'));
app.use('/api/news', require('../src/mod-noticias/noticias.routes'));
app.use('/api/feriados', require('../src/mod-feriados/feriados.routes'));
app.use('/api/licencias', require('../src/mod-licencias/licencias.routes'));
app.use('/api/vacaciones', require('../src/mod-vacaciones/vacaciones.routes'));
app.use('/api/login', require('./mod-login/login.routes'));
app.use('/api/direcciones',require('./mod-direcciones/direcciones.routes'));
app.use('/api/adjuntos',require('./mod-adjuntos/adjuntos.routes'));
app.use('/api/empresas',require('./mod-empresas/empresas.routes'));
app.use('/api/solicitud-dinero',require('./mod-solicitud-dinero/solicitud-dinero.routes'));
app.use('/api/novedades',require('./mod-novedades/novedades.routes'));
app.use('/api/solicitudes', require('./mod-herramientas-y-prendas/herramientas.routes'));
app.use('/api/solicitudes', require('./mod-herramientas-y-prendas/herramientas.routes'));
app.use('/api/solicitud-dinero/caja-chica',require('../src/mod-solicitud-dinero/caja-chica/solicitud-dinero-caja-chica.routes'));
app.use('/api/solicitud-dinero/viaticos-deslocalizados',require('../src/mod-solicitud-dinero/viaticos-deslocalizados/solicitud-dinero-viaticos-des.routes'));
app.use('/api/solicitud-dinero/viajes-vendedores',require('../src/mod-solicitud-dinero/viaje-vendedores/solicitud-dinero-viaje-vend.routes'));
app.use('/api/solicitud-dinero/tarjeta-credito',require('../src/mod-solicitud-dinero/tarjeta-credito/solicitud-dinero-tarjeta-credito.routes'));
app.use('/api/oportunidadesEmpleo', require('../src/mod-oportunidades/oportunidades-publicas.routes'));
app.use('/api/oportunidades', require('../src/mod-oportunidades/oportunidades.routes'));




// Static files
app.use('/uploads', express.static(path.resolve('uploads')));

// Starting the server
app.listen(3000, () => {
    console.log('Server on port 3000');
});