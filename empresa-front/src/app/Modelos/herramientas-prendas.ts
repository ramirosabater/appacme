import { Elemento } from "./elemento";
import { Estado } from "./estado";

export interface HerramientasPrendas {
    id_solicitud?: number,
    id_empleado?: number,
    nombre?: string,
    apellido?: string,
    estado?: number,
    descargo_recursos?: string,
    estado_respuesta_empleado?: number | null,
    respuesta_empleado?: string,
    fecha_pedido?: string,
    datos?: Elemento[],
    id_jefe_directo?:number,
    estado_string?:Estado
}