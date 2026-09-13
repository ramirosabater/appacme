export interface Licencia {
    id_licencia?: number;
    id_empleado?: number;
    tipo_licencia?: number;
    tipo_licencia_string?: string;
    fecha_creacion?:string;
    fecha_inicio?: string;
    fecha_fin?: string;
    fecha_reintegro?: string;
    descripcion?: string;
    adjunto?: string;
    revision_jefe?: number;
    motivo_jefe?: string;
    revision_recursos?: number;
    motivo_recursos?: string;
    estado?: number;
    revision_jefe_string?: string;
    revision_recursos_string?: string;
    revision_jefe_color?: string;
    revision_recursos_color?: string;
    estado_string?: string;
    estado_color?: string;
    age?:{days?:number};
    nombre?: string;
    apellido?: string;
    cantidad_dias?: number;
}
