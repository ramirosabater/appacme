export interface Noticia{
    id_noticia?: number;
    categoria?: string;
    titulo?: string;
    subtitulo?: string;
    cuerpo_noticia?: string;
    fecha_vencimiento?: string;
    fecha_publicacion?: string;
    id_categoria?: number;
    id_estado?: number;
    estado_string?: string;
    estado_color?: string;
    url?: string;
}