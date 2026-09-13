export interface Oportunidad {
    id_empleo: number;
    fecha_creacion: string;
    fecha_publicacion: string;
    fecha_fin_publicacion: string;
    titulo: string;
    descripcion: string;
    id_carga_horaria: number;
    id_modalidad: number;
    id_ubicacion: number;
    id_area: number;
    estado: string;
    estado_color: string;
    carga_horaria: string;
    modalidad: string;
    ubicacion: string;
    area: string;
    requisitos: Requisito[]; 
    beneficios: Beneficio[]; 
    categoria?: CategoriaTrabajo[];
    
}


export interface Requisito {
    id_requisito: number;
    id_empleo: number;
    requisito: string; 
  }

  export interface Beneficio {
    id_beneficio: number;
    id_empleo: number;
    beneficio: string; 
  }

  export interface Ubicacion {
    id_ubicacion: number;
    ubicacion: string; 
  }

    export interface Modalidad {
    id_modalidad: number;
    modalidad: string; 
  }

  export interface Carga_horaria {
    id_carga_horaria: number;
    carga_horaria: string; 
  }

   export interface Area {
    id_area: number;
    area: string; 
  }

  export interface CategoriaTrabajo{
    id_categoria_trabajo: number;
    descripcion_categoria: string;
  }
