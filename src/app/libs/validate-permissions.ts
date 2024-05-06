import { SessionService } from "../services/session.service";

export class ValidatePermissions {

    canEdit: boolean = false;
    canCreate: boolean = false;

    constructor(session: SessionService) {

        let isAdmin:boolean = session.getSession().Empleado.cargo === 'Administrador';

        if(isAdmin){
            this.canEdit = true;
            this.canCreate = true;
        }
        
    }
}