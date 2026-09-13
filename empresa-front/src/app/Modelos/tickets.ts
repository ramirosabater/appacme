export interface Ticket{
    id_ticket?: number;
    id_solicitud?: number;
    proveedor?: string;
    punto_venta?: string;
    nro_ticket?: string;
    importe_sin_iva?: string;
    fecha_ticket?: string;
    url_imagen?: string;
    cuit?: string;
}