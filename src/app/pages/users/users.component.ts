import { Component } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { UserModalComponent } from '../../components/user-modal/user-modal.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {

  bsModalRef?: BsModalRef;

  constructor(
    private modalService: BsModalService
  ) { }

  openModal(isEditable: boolean, idUsuario?: any) {
    const initialState: ModalOptions = {
      initialState: {
        modalTitle: isEditable ? 'Editar usuario' : 'Nuevo usuario',
        onEdit: isEditable,
        idUsuario
      },
      ignoreBackdropClick: true,
      class: 'modal-lg',
    };

    this.bsModalRef = this.modalService.show(UserModalComponent, initialState);

    this.modalService.onHide.subscribe((reason: string | any) => {
      //volver a consultar todos los registros de usuarios, al cerrar la modal;
    })

  }
}
