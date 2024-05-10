import { Component, OnInit } from '@angular/core';
import { Helpers } from '../../libs/helpers';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { MasterService } from '../../services/master.service';
import { PrestadorSalud } from '../../models/prestadorSalud.model';
import { TablesEnum } from '../../models/tables.enum';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModalidadServicio } from '../../models/modalidadServicio.model';
import { ViaIngresoServicio } from '../../models/viaIngresoServicio.model';
import { CausaAtencion } from '../../models/causaAtencion.model';
import { Diagnostico } from '../../models/diagnostico.model';
import Dialogtype, { Dialog } from '../../libs/dialog.lib';
import { Result } from '../../models/result.model';
import { HealthServiceService } from '../../services/health-service.service';

@Component({
  selector: 'app-health-service-modal',
  templateUrl: './health-service-modal.component.html',
  styleUrl: './health-service-modal.component.scss'
})
export class HealthServiceModalComponent implements OnInit {

  helpers = Helpers;
  modalTitle: string = '';
  document: string = '';
  idServicioSalud: string = '';
  onEdit: boolean = false;
  onViewMode: boolean = false;

  diagnosticoText: string = 'Seleccionar';

  serviceForm = new FormGroup({
    idServicioSalud: new FormControl('00000000-0000-0000-0000-000000000000'),
    codigoPrestadorSalud: new FormControl('', Validators.required),
    fechaInicioAtencion: new FormControl('', Validators.required),
    horaInicioAtencion: new FormControl('', Validators.required),
    codigoModalidad: new FormControl('', Validators.required),
    grupoServicio: new FormControl('', Validators.required),
    entornoAtencion: new FormControl('', Validators.required),
    codigoViaIngreso: new FormControl('', Validators.required),
    codigoCausaAtencion: new FormControl('', Validators.required),
    codigoDiagnostico: new FormControl('', Validators.required),
    tipoDiagnostico: new FormControl('', Validators.required),
    triage: new FormGroup({
      idTriage: new FormControl(0),
      fechaTriage: new FormControl('', Validators.required),
      horaTriage: new FormControl('', Validators.required),
      clasificacionTriage: new FormControl('', Validators.required),
    })
  });

  submited: boolean = false;
  prestadorSaludList: PrestadorSalud[] = [];
  modalidadServicioList: ModalidadServicio[] = [];
  viaIngresoList: ViaIngresoServicio[] = [];
  causaAtencionList: CausaAtencion[] = [];
  diagnosticoList: { text: string, value: string, isparent: boolean }[] = [];

  constructor(
    private masterService: MasterService,
    public bsModalRef: BsModalRef,
    private healthService: HealthServiceService
  ) { }

  async ngOnInit() {
    await this.getAllPrestadorSalud();
    await this.getAllModalidad();
    await this.getAllViaIngreso();
    await this.getAllCausaAtencion();
    await this.getAllDiagnostico();

    if (this.onEdit) {
      if (this.onViewMode) {
        this.serviceForm.disable();
      }
      await this.getUserData();
    }

  }

  async getUserData() {
    const result = await firstValueFrom(this.healthService.getByIdService(this.idServicioSalud));
    if (result.success) {
      console.log(result);

      this.serviceForm.patchValue({
        idServicioSalud: result.data?.idServicioSalud,
        codigoPrestadorSalud: result.data?.codigoPrestadorSalud,
        fechaInicioAtencion: Helpers.convertDate(result.data?.fechaInicioAtencion.toString() as any),
        horaInicioAtencion: result.data?.horaInicioAtencion,
        codigoModalidad: result.data?.codigoModalidad,
        grupoServicio: result.data?.grupoServicio,
        entornoAtencion: result.data?.entornoAtencion,
        codigoViaIngreso: result.data?.codigoViaIngreso,
        codigoCausaAtencion: result.data?.codigoCausaAtencion,
        codigoDiagnostico: result.data?.codigoDiagnostico,
        tipoDiagnostico: result.data?.tipoDiagnostico,
      });

      this.diagnosticoText = result.data?.codigoDiagnosticoNavigation?.diagnostico1!;

      this.serviceForm.get('triage')?.patchValue({
        idTriage: (result.data?.idTriage) ? result.data?.idTriage : 0,
        fechaTriage: result.data?.idTriageNavigation?.fechaTriage ? Helpers.convertDate(result.data?.idTriageNavigation?.fechaTriage.toString()) : '',
        horaTriage: result.data?.idTriageNavigation?.horaTriage!,
        clasificacionTriage: result.data?.idTriageNavigation?.clasificacionTriage!,
      })
    }
  }

  async getAllPrestadorSalud() {
    const result = await firstValueFrom(this.masterService.getAll<PrestadorSalud>(TablesEnum.PrestadoresSalud));
    if (result.success) {
      this.prestadorSaludList = result.data!;
    }
  }

  async getAllModalidad() {
    const result = await firstValueFrom(this.masterService.getAll<ModalidadServicio>(TablesEnum.ModalidadServicios));
    if (result.success) {
      this.modalidadServicioList = result.data!;
    }
  }

  async getAllViaIngreso() {
    const result = await firstValueFrom(this.masterService.getAll<ViaIngresoServicio>(TablesEnum.ViaIngresoServicio));
    if (result.success) {
      this.viaIngresoList = result.data!;
    }
  }

  async getAllCausaAtencion() {
    const result = await firstValueFrom(this.masterService.getAll<CausaAtencion>(TablesEnum.CausaAtencion));
    if (result.success) {
      this.causaAtencionList = result.data!;
    }
  }

  async getAllDiagnostico(parent?: string) {
    const result = await firstValueFrom(this.masterService.getAll<{ diagnostico: Diagnostico, esPadre: boolean }>(TablesEnum.Diagnostico, parent));
    if (result.success) {
      this.diagnosticoList = result.data?.map(item => {
        return {
          text: item.diagnostico.diagnostico1,
          value: item.diagnostico.codigoDiagnostico,
          isparent: item.esPadre
        }
      })!;
    }
  }

  async save() {
    this.submited = true;

    if (this.serviceForm.invalid) {
      Dialog.show('Debes diligenciar todos los campos obligatorios', Dialogtype.warning);
      return;
    }

    const formData = this.serviceForm.getRawValue();

    const data = {
      service: formData,
      triag: formData.triage,
      document: this.document,
    }

    let result: Result<string> = {} as Result<string>;

    if (this.onEdit) {
      result = await firstValueFrom(this.healthService.update(data));
    } else {
      data.service.horaInicioAtencion = `${formData.horaInicioAtencion}:00`;
      data.triag.horaTriage = `${formData.triage.horaTriage}:00`;
      console.log(data);
      result = await firstValueFrom(this.healthService.create(data));
    }

    if (result.success) {
      Dialog.show(result.data!, Dialogtype.success);
      this.bsModalRef.hide();
    }

  }






}
