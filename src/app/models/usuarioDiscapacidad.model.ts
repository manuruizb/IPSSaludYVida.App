import { Discapacidad } from "./discapacidad.model";

export interface Usuariodiscapacidad {
    idUsuario: string;
    codigoDiscapacidad: string;
    idUsuarioDiscapacidad: number;

    codigoDiscapacidadNavigation?: Discapacidad;
}