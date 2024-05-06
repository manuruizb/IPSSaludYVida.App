import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { DocumentosIdentificacion } from '../../models/documentosIdentificacion.model';
import { Helpers } from '../../libs/helpers';
import { MasterService } from '../../services/master.service';
import { TablesEnum } from '../../models/tables.enum';
import { firstValueFrom } from 'rxjs';
import { Paises } from '../../models/paises.model';
import { Etnia } from '../../models/etnia.model';
import { ComunidadEtnica } from '../../models/comunidadEtnica.model';
import { PrestadorSalud } from '../../models/prestadorSalud.model';
import { EntidadesAdministradorasSalud } from '../../models/entidadesAdministradorasSalud.model';
import { Ocupacion } from '../../models/ocupacion.model';
import { DepartamentoMunicipios } from '../../models/departamentoMunicipio.model';

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrl: './user-modal.component.scss'
})
export class UserModalComponent implements OnInit {

  helpers = Helpers;
  modalTitle: string = '';
  idUsuario: string = '';
  onEdit: boolean = false;

  userForm = new FormGroup({
    idUsuario: new FormControl('', Validators.required),
    tipoDocumento: new FormControl('', Validators.required),
    numeroDocumento: new FormControl('', Validators.required),
    primerNombre: new FormControl('', Validators.required),
    segundoNombre: new FormControl(''),
    primerApellido: new FormControl('', Validators.required),
    segundoApellido: new FormControl('', Validators.required),
    fechaNacimiento: new FormControl('', Validators.required),
    horaNacimiento: new FormControl('', Validators.required),
    sexoBiologico: new FormControl('', Validators.required),
    identidadGenero: new FormControl('', Validators.required),
    codigoOcupacion: new FormControl('', Validators.required),
    idPaisResidencia: new FormControl('', Validators.required),
    codigoDepartamento: new FormControl('', Validators.required),
    codigoDeparMuni: new FormControl('', Validators.required),
    codigoEtnia: new FormControl('', Validators.required),
    codigoComunidad: new FormControl('', Validators.required),
    zonaResidencia: new FormControl('', Validators.required),
    codigoEntidad: new FormControl('', Validators.required),
    opoDonacion: new FormGroup({
      manifestacionOposicion: new FormControl(false, Validators.required),
      fecha: new FormControl(''),
    }),
    voluntad: new FormGroup({
      documentoVoluntad: new FormControl(false, Validators.required),
      fecha: new FormControl(''),
      codigoPrestadorSalud: new FormControl(''),
    })
  });

  submited: boolean = false;
  documentTypeList: DocumentosIdentificacion[] = [];
  countryList: Paises[] = [];
  etniaList: Etnia[] = [];
  comunidadEtnicaList: ComunidadEtnica[] = [];
  prestadorSaludList: PrestadorSalud[] = [];
  entidadAdministradoraList: EntidadesAdministradorasSalud[] = [];
  ocupacionesList: { text: string, value: string, isparent: boolean }[] = [];
  departamentoList: DepartamentoMunicipios[] = [];
  municipioList: DepartamentoMunicipios[] = [];


  constructor(
    public bsModalRef: BsModalRef,
    private masterService: MasterService
  ) { }

  ngOnInit() {
    this.getAllDocumentTypes();
    this.getAllCountries();
    this.getAllEtnia();
    this.getAllPrestadorSalud();
    this.getAllEntidadesSalud();
    this.getAllOcupacion();
    this.getAllDepartamentos();
  }

  async getAllDocumentTypes() {
    const result = await firstValueFrom(this.masterService.getAll<DocumentosIdentificacion>(TablesEnum.DocumentosIdentificacion));
    if (result.success) {
      this.documentTypeList = result.data!;
    }
  }

  async getAllCountries() {
    const result = await firstValueFrom(this.masterService.getAll<Paises>(TablesEnum.Paises));
    if (result.success) {
      this.countryList = result.data!;
    }
  }

  async getAllEtnia() {
    const result = await firstValueFrom(this.masterService.getAll<Etnia>(TablesEnum.Etnia));
    if (result.success) {
      this.etniaList = result.data!;
    }
  }

  async getAllDepartamentos() {
    const result = await firstValueFrom(this.masterService.getAll<DepartamentoMunicipios>(TablesEnum.Departamento));
    if (result.success) {
      this.departamentoList = result.data!;
    }
  }

  async getAllPrestadorSalud() {
    const result = await firstValueFrom(this.masterService.getAll<PrestadorSalud>(TablesEnum.PrestadoresSalud));
    if (result.success) {
      this.prestadorSaludList = result.data!;
    }
  }

  async getAllCommunitiesByEtnia(evt: Event) {
    this.comunidadEtnicaList = [];
    this.userForm.get('codigoComunidad')?.setValue('');

    const tg = evt.target as HTMLSelectElement;
    const codigoEtnia = tg.value;

    const result = await firstValueFrom(this.masterService.getAll<ComunidadEtnica>(TablesEnum.ComunidadEtnica, codigoEtnia));
    if (result.success) {
      this.comunidadEtnicaList = result.data!;
    }
  }

  async getAllMunicipiosByDepartamento(evt: Event) {
    this.municipioList = [];
    this.userForm.get('codigoDeparMuni')?.setValue('');

    const tg = evt.target as HTMLSelectElement;
    const codigoDepart = tg.value;

    const result = await firstValueFrom(this.masterService.getAll<DepartamentoMunicipios>(TablesEnum.Municipio, codigoDepart));
    if (result.success) {
      this.municipioList = result.data!;
    }
  }

  async getAllOcupacion(parent?: string) {
    const result = await firstValueFrom(this.masterService.getAll<{ocupacion: Ocupacion, esPadre:boolean}>(TablesEnum.Ocupacion, parent));
    if (result.success) {
      this.ocupacionesList = result.data?.map(item => {
        return {
          text: item.ocupacion.ocupacion1,
          value: item.ocupacion.codigoOcupacion,
          isparent: item.esPadre
        }
      })!;
    }
  }

  save() {
    this.submited = true;

    console.log(this.userForm.getRawValue());
  }

  onchangeOpoDonacion(evt: Event) {

    const tg = evt.target as HTMLInputElement;


    if (tg.checked) {
      console.log(tg.checked)
      this.userForm.get('codigoEntidad')?.addValidators(Validators.required);
    } else {
      //this.userForm.get('opoDonacion')?.get('fecha')?.removeValidators(Validators.required);
    }

    console.log('haserror', this.userForm.get('opoDonacion')?.get('fecha')?.errors)

    this.userForm.updateValueAndValidity();
    this.userForm.get('opoDonacion')?.updateValueAndValidity();

    console.log('haserror', this.userForm.get('opoDonacion')?.get('fecha')?.errors)

  }

  async getAllEntidadesSalud() {
    const result = await firstValueFrom(this.masterService.getAll<EntidadesAdministradorasSalud>(TablesEnum.EntidadesAdministradorasSalud));
    if (result.success) {
      this.entidadAdministradoraList = result.data!;
    }
  }

}
