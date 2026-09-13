export interface Empleado{
    id_empleado?: number;
    id_sector?: number;
    id_posicion?: number;
    jefe_directo?: number;
    dias_vacaciones?: number;
    dias_restantes?: number;
    cargo?: string;
    sector?: string;
    jefe?: string;
    n_legajo?: number;
    id_empresa?:number;
    nombre_empresa?:string;
    nombre?:string;
    apellido?:string;
    estado?:string;
    color_estado?:string;
    id_estado?:number;
}