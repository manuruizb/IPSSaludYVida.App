import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ServicioSalud } from '../../models/servicioSalud.model';
import { DatatableDataValues } from '../../shared/datatable/datatable.component';
import { HealthServiceModalComponent } from '../../components/health-service-modal/health-service-modal.component';
import { firstValueFrom } from 'rxjs';
import { HealthServiceService } from '../../services/health-service.service';
import { Helpers } from '../../libs/helpers';

@Component({
  selector: 'app-health-services',
  templateUrl: './health-services.component.html',
  styleUrl: './health-services.component.scss'
})
export class HealthServicesComponent implements OnInit {

  @ViewChild('actionsTemplate', { static: true }) actionsTemplate: TemplateRef<any> = {} as TemplateRef<any>;

  bsModalRef?: BsModalRef;
  JSONdata: ServicioSalud[] = [];
  dataValues: Array<DatatableDataValues> = [];

  itemsPerPage: number = 5;
  totalItems: number = 0;
  currentPage: number = 1;

  document: string = '';
  helpers = Helpers;
  nombreUsuario: string = '';

  constructor(
    private modalService: BsModalService,
    private healthService: HealthServiceService,
  ) { }

  ngOnInit(): void {
    this.initializeDatatable();
  }

  openModal(isEditable: boolean, onViewMode: boolean, document?: any, idServicioSalud?: string) {
    const initialState: ModalOptions = {
      initialState: {
        modalTitle: isEditable && !onViewMode ? 'Editar servicio de salud' : (isEditable && onViewMode ? 'Datos del servicio de salud' : 'Nuevo servicio de salud'),
        onEdit: isEditable,
        document,
        onViewMode,
        idServicioSalud
      },
      ignoreBackdropClick: true,
      class: 'modal-lg',
    };

    this.bsModalRef = this.modalService.show(HealthServiceModalComponent, initialState);

    this.modalService.onHide.subscribe((reason: string | any) => {
      this.getAll(1);
    })
  }

  initializeDatatable() {
    this.dataValues = [
      { id: 'fechaInicioAtencion', header: 'Fecha', date: true },
      { id: 'horaInicioAtencion', header: 'Hora' },
      { id: 'prestadorSalud', header: 'Prestador de Salud' },
      { id: 'diagnostico1', header: 'Diagnóstico' },
      { header: '', template: this.actionsTemplate }
    ];
  }

  async getAll(page: number, searchParameter?: string) {
    this.currentPage = page;

    if (this.document === '')
      return;

    const result = await firstValueFrom(this.healthService.getAll(page, this.itemsPerPage, this.document));
    console.log(result);
    if (result.data!.rows.length > 0) {
      this.totalItems = Number(result.data?.count);
    } else {
      this.totalItems = 0;
    }

    this.JSONdata = result.data!.rows!.map(item => {
      return {
        ...item,
        prestadorSalud: item.codigoPrestadorSaludNavigation?.prestadorSalud,
        diagnostico1: item.codigoDiagnosticoNavigation?.diagnostico1
      }
    });

    this.nombreUsuario = result.data?.rows[0].idUsuarioNavigation.primerNombre + ' ' + result.data?.rows[0].idUsuarioNavigation.primerApellido;

  }

  onPageChanged(page: number) {
    this.getAll(page);
  }

}
