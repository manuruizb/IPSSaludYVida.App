import { Etnia } from "./etnia.model";

export interface ComunidadEtnica {
    codigoComunidad: string;
    comunidad: string;
    codigoEtnia: string;

    codigoEtniaNavigation?: Etnia;
}