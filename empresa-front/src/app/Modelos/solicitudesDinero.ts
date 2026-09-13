import { ItemSolicitudDinero } from "./itemSolicitudDinero";
import { tipoEstadoSolicitud } from "./tiposEstadosSolicitd";

export interface SolicitudDinero{
    id_solicitud_dinero?:number;
    id_empleado?: number;
    monto_solicitado?:number;
    motivo_solicitud?:string;
    id_tipo_solicitud?: number;
    fecha_solicitud?: string;
    fecha_pedido?: string;
    cantidad_dias?:number;
    descripcion?:string;
    detalle?: ItemSolicitudDinero[];
    estado?:string;
    tipo_estado?: tipoEstadoSolicitud[];
    apellido?:string;
    nombre?:string;
    estado_color?: string;
    sub_tipo?: number;
}