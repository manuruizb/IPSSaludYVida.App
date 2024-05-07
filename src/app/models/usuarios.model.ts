import { ComunidadEtnica } from "./comunidadEtnica.model";
import { DepartamentoMunicipios } from "./departamentoMunicipio.model";
import { Discapacidad } from "./discapacidad.model";
import { Ocupacion } from "./ocupacion.model";
import { OposicionDonacion } from "./oposicionDonacion.model";
import { Pais } from "./pais.model";
import { Usuariodiscapacidad } from "./usuarioDiscapacidad.model";
import { UsuarioPais } from "./usuarioPais.model";
import { VoluntadAnticipada } from "./voluntadAnticipada.model";

export interface Usuarios {
    idUsuario: string;
    tipoDocumento: string;
    numeroDocumento: string;
    primerNombre: string;
    segundoNombre: string;
    primerApellido: string;
    segundoApellido: string;
    fechaNacimiento: Date;
    horaNacimiento: string;
    sexoBiologico: string;
    identidadGenero: string;
    codigoOcupacion: string;
    idDonacion: number;
    idVoluntad: number;
    idPaisResidencia: string;
    codigoDeparMuni: string;
    codigoComunidad: string;
    zonaResidencia: string;
    codigoEntidad: string;

    idDonacionNavigation?: OposicionDonacion;
    idVoluntadNavigation?: VoluntadAnticipada;
    codigoOcupacionNavigation?: Ocupacion;
    codigoComunidadNavigation?: ComunidadEtnica;
    codigoDeparMuniNavigation?: DepartamentoMunicipios;
    usuarioPaises?: UsuarioPais[];
    usuarioDiscapacidads?: Usuariodiscapacidad[]
}