import { Diagnostico } from "./diagnostico.model";
import { PrestadorSalud } from "./prestadorSalud.model";
import { Triage } from "./triage.model";
import { Usuarios } from "./usuarios.model";

export interface ServicioSalud {
    idServicioSalud: string;
    codigoPrestadorSalud: string;
    fechaInicioAtencion: Date;
    horaInicioAtencion: string;
    codigoModalidad: string;
    grupoServicio: string;
    entornoAtencion: string;
    codigoViaIngreso: string;
    codigoCausaAtencion: string;
    idTriage: number;
    codigoDiagnostico: string;
    tipoDiagnostico: string;
    idUsuario: string;

    codigoDiagnosticoNavigation?: Diagnostico;
    codigoPrestadorSaludNavigation?: PrestadorSalud;
    idUsuarioNavigation: Usuarios;
    idTriageNavigation: Triage;
}