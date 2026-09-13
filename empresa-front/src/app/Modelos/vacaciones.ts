export interface Vacaciones{
    id_vacaciones?: number;
    id_empleado?: number;
    nombre?: string;
    apellido?: string;
    fecha_inicio?: string;
    fecha_fin?: string;
    fecha_reintegro?: string;
    cantidad_dias?: number;
    estado?: number;
    estado_string?: string;
    estado_color?: string;
    updated_at?: string;
    comentario?: string;
    descripcion?: string;
    created_at?:string;
    dias_vacaciones?:number;
    dias_restantes?:number;
    fecha_i?:string;
}