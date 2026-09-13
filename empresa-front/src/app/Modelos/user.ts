import { Rol } from "./rol";

export interface User{
    id_usuario?:number,
    apellido?:string,
    nombre?:string,
    password?:string,
    role?:string,
    id_estado?:number,
    estado?:string,
    dni?:string,
    email?:string,
    telefono?:string,
    colorestado?:string,
    roles?: Rol[];
    reset_password?: number;
}