export interface Oportunidad {
    id_empleo?: number;
    fecha_creacion?: Date;
    fecha_publicacion?: Date;
    fecha_fin_publicacion?: Date;
    titulo?: string;
    descripcion?: string;
    id_carga_horaria?: number;
    id_modalidad?: number;
    id_ubicacion?: number;
    id_area?: number;
    estado?: string;
    carga_horaria?: string;
    modalidad?: string;
    ubicacion?: string;
    area?: string;
    beneficios?: Beneficio[];
    requisitos?: Requisito[];
}

export interface Beneficio {
    id_beneficio?: number;
    beneficio?: string;
}
export interface Requisito {
    id_requisito?: number;
    requisito?: string;
}

export interface Ubicacion {
    id_ubicacion: number;
    ubicacion: string; 
  }