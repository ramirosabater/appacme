import { CategoriaTrabajo } from "./oportunidad";

export interface Postulante{

    id_postulante: number,
    id_provincia: number,
    id_empleo:number,
    nombre: string,
    apellido:string,
    email: string,
    tipo_documento: string,
    nro_documento: string,
    telefono:string,
    genero:string,
    localidad: string,
    fecha_postulacion:string,
    curriculum_vitae: string,
    estado: string,
    categorias?: CategoriaTrabajo[];
}