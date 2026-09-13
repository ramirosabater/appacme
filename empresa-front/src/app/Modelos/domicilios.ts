export interface Domicilio {
    id_direccion?: number;
    calle?: string;
    numero?: string;
    localidad?: string;
    provincia?: string;
    tipo_direccion?: number;
    descripcion?: string;
    id_usuario?: number;
    observaciones?: string;
    estado?: number;
    fecha_actualizacion?:string;
    url_frente_domicilio?:string;
}
