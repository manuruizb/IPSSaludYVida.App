import { Pais } from "./pais.model";

export interface UsuarioPais {
    idUsuario: string;
    idPais: string;
    idUsuarioPaises: number;
    
    idPaisNavigation?: Pais
}