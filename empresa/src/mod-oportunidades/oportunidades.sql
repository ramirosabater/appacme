create TABLE cargas_horarias(
    id_carga_horaria serial PRIMARY KEY,
    carga_horaria varchar(50) NOT NULL
);

create TABLE modalidades(
    id_modalidad serial PRIMARY KEY,
    modalidad varchar(50) NOT NULL
);

create TABLE ubicaciones(
    id_ubicacion serial PRIMARY KEY,
    ubicacion varchar(50) NOT NULL
);

create TABLE areas(
    id_area serial PRIMARY KEY,
    area varchar(50) NOT NULL
);

create TABLE empleos(
    id_empleo serial PRIMARY KEY,
    fecha_creacion date NOT NULL,
    fecha_publicacion date NOT NULL,
    fecha_fin_publicacion date NOT NULL,
    titulo varchar(50) NOT NULL,
    descripcion varchar(500) NOT NULL,
    id_carga_horaria integer NOT NULL,
    id_modalidad integer NOT NULL,
    id_ubicacion integer NOT NULL,
    id_area integer NOT NULL,
    estado varchar(50) NOT NULL,

    FOREIGN KEY (id_carga_horaria) REFERENCES cargas_horarias(id_carga_horaria),
    FOREIGN KEY (id_modalidad) REFERENCES modalidades(id_modalidad),
    FOREIGN KEY (id_ubicacion) REFERENCES ubicaciones(id_ubicacion),
    FOREIGN KEY (id_area) REFERENCES areas(id_area)
);

CREATE TABLE provincias (
    id_provincia SERIAL PRIMARY KEY,
    provincia VARCHAR(100) NOT NULL
);

CREATE TABLE postulantes (
    id_postulante SERIAL PRIMARY KEY,
    id_provincia INTEGER,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    tipo_documento VARCHAR(20) NOT NULL,
    nro_documento VARCHAR(50) NOT NULL,
    telefono VARCHAR(50),
    genero VARCHAR(50),
    localidad VARCHAR(100),
    fecha_postulacion DATE NOT NULL DEFAULT CURRENT_DATE,
    curriculum_vitae TEXT,
    estado VARCHAR(50) NOT NULL CHECK (estado IN ('enviada', 'revisada', 'eliminada')),

    FOREIGN KEY (id_provincia) REFERENCES provincias(id_provincia)
);

CREATE TABLE requisitos (
    id_requisito SERIAL PRIMARY KEY,
    id_empleo INTEGER NOT NULL,
    requisito TEXT NOT NULL,

    FOREIGN KEY (id_empleo) REFERENCES empleos(id_empleo) ON DELETE CASCADE
);

CREATE TABLE beneficios (
    id_beneficio SERIAL PRIMARY KEY,
    id_empleo INTEGER NOT NULL,
    beneficio TEXT NOT NULL,

    FOREIGN KEY (id_empleo) REFERENCES empleos(id_empleo) ON DELETE CASCADE
);


--tabla para categoria de trabajo/puesto/area
create table categoria_trabajo(id_categoria_trabajo serial primary key, descripcion_categoria character varying);

--tabla intermedia postulante_puesto
create table postulante_puesto(id_postulante_puesto serial primary key, id_postulante integer, 
							   id_categoria_trabajo integer,
							  foreign key(id_postulante)references postulantes(id_postulante),
							  foreign key(id_categoria_trabajo) references categoria_trabajo(id_categoria_trabajo)) ;

--Se carga tabla categoria_trabajo
insert into categoria_trabajo (descripcion_categoria) values('Operario auxiliar depósito');
insert into categoria_trabajo (descripcion_categoria) values('Operario depósito con manejo auto-elevador');
insert into categoria_trabajo (descripcion_categoria) values('Operario especializado carpintería');
insert into categoria_trabajo (descripcion_categoria) values('Operario especializado mantenimiento ');
insert into categoria_trabajo (descripcion_categoria) values('Comprador / Analista de Abastecimiento');
insert into categoria_trabajo (descripcion_categoria) values('Supervisor o Responsable de depósito');
insert into categoria_trabajo (descripcion_categoria) values('Supervisor o Responsable de Mantenimiento');
insert into categoria_trabajo (descripcion_categoria) values('Profesional de Supply Chain');
insert into categoria_trabajo (descripcion_categoria) values('Ayudante de chofer con manejo hidrogrua');
insert into categoria_trabajo (descripcion_categoria) values('Chofer de camión ');
insert into categoria_trabajo (descripcion_categoria) values('Supervisor o Responsable de Reparto');
insert into categoria_trabajo (descripcion_categoria) values('Vendedor minorista');
insert into categoria_trabajo (descripcion_categoria) values('Vendedor mayorista b2b');
insert into categoria_trabajo (descripcion_categoria) values('Supervisor o Responsable de ventas');
insert into categoria_trabajo (descripcion_categoria) values('Profesional Comercial');
insert into categoria_trabajo (descripcion_categoria) values('Auxiliar administrativo');
insert into categoria_trabajo (descripcion_categoria) values('Cajero');
insert into categoria_trabajo (descripcion_categoria) values('Analista Administrativo /Profesional Administración');
insert into categoria_trabajo (descripcion_categoria) values('Auxiliar RH');
insert into categoria_trabajo (descripcion_categoria) values('Analista RH / Profesional RH ');
insert into categoria_trabajo (descripcion_categoria) values('Auxiliar IT');
insert into categoria_trabajo (descripcion_categoria) values('Analista IT / Profesional IT');
insert into categoria_trabajo (descripcion_categoria) values('Gerencia Supply Chain');
insert into categoria_trabajo (descripcion_categoria) values('Gerencia Comercial');
insert into categoria_trabajo (descripcion_categoria) values('Gerencia Administración y Finanzas');
insert into categoria_trabajo (descripcion_categoria) values('Gerencias otras');
