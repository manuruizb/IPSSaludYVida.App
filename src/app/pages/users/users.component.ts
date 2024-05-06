import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { UserModalComponent } from '../../components/user-modal/user-modal.component';
import { Usuarios } from '../../models/usuarios.model';
import { DatatableDataValues } from '../../shared/datatable/datatable.component';
import { firstValueFrom } from 'rxjs';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit{

  @ViewChild('actionsTemplate', { static: true }) actionsTemplate: TemplateRef<any> = {} as TemplateRef<any>;

  bsModalRef?: BsModalRef;
  JSONdata: Usuarios[] = [];
  dataValues: Array<DatatableDataValues> = [];

  itemsPerPage: number = 5;
  totalItems: number = 0;
  currentPage: number = 1;

  constructor(
    private modalService: BsModalService,
    private userService: UserService,
  ) { }


  ngOnInit(): void {
    this.initializeDatatable();
    this.getAll(1);
  }

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

  initializeDatatable() {
    this.dataValues = [
      { id: 'numeroDocumento', header: 'Documento' },
      { id: 'nombre', header: 'Nombre' },
      { header: '', template: this.actionsTemplate }
    ];
  }

  async getAll(page: number, searchParameter?: string) {
    this.currentPage = page;

    const result = await firstValueFrom(this.userService.getAll(page, this.itemsPerPage, searchParameter));

    if (result.data!.rows.length > 0) {
      this.totalItems = Number(result.data?.count);
    } else {
      this.totalItems = 0;
    }

    this.JSONdata = result.data!.rows!.map(item => {
      return {
        ...item,
        nombre: item.primerNombre + ' ' + item.primerApellido
      }
    });

  }

  onPageChanged(page: number) {
    this.getAll(page);
  }




}
