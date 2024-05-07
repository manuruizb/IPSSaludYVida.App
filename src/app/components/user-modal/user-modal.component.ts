import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
import { Pais } from '../../models/pais.model';
import { Discapacidad } from '../../models/discapacidad.model';
import { requiredIfCheckedValidator } from '../../libs/checked-required-validator';
import Dialogtype, { Dialog } from '../../libs/dialog.lib';
import { UserService } from '../../services/user.service';
import { Result } from '../../models/result.model';

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrl: './user-modal.component.scss'
})
export class UserModalComponent implements OnInit {

  helpers = Helpers;
  modalTitle: string = '';
  document: string = '';
  onEdit: boolean = false;
  onViewMode: boolean = false;

  ocupacionText: string = 'Seleccionar';

  editPais:boolean = false;
  paisesSeleccionados:string = '';

  editDiscapacidad:boolean = false;
  discapacidadesSeleccionadas:string = '';

  userForm = new FormGroup({
    idUsuario: new FormControl('00000000-0000-0000-0000-000000000000'),
    tipoDocumento: new FormControl('', Validators.required),
    numeroDocumento: new FormControl('', Validators.required),
    primerNombre: new FormControl('', Validators.required),
    segundoNombre: new FormControl(null),
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
      idDonacion: new FormControl(''),
      manifestacionOposicion: new FormControl(false),
      fecha: new FormControl('', requiredIfCheckedValidator('manifestacionOposicion')),
    }),
    voluntad: new FormGroup({
      idVoluntad: new FormControl(''),
      documentoVoluntad: new FormControl(false),
      fecha: new FormControl('', requiredIfCheckedValidator('documentoVoluntad')),
      codigoPrestadorSalud: new FormControl('', requiredIfCheckedValidator('documentoVoluntad')),
    }),
    paises: new FormControl<Pais[] | null>([], Validators.required),
    discapacidades: new FormControl<Discapacidad[] | null>([], Validators.required)
  });

  submited: boolean = false;
  documentTypeList: DocumentosIdentificacion[] = [];
  countryList: Paises[] = [];
  etniaList: Etnia[] = [];
  comunidadEtnicaList: ComunidadEtnica[] = [];
  prestadorSaludList: PrestadorSalud[] = [];
  entidadAdministradoraList: EntidadesAdministradorasSalud[] = [];
  ocupacionesList: { text: string, value: string, isparent: boolean }[] = [];
  paisesList: Pais[] = [];
  dicapacidadesList: Discapacidad[] = [];
  departamentoList: DepartamentoMunicipios[] = [];
  municipioList: DepartamentoMunicipios[] = [];


  constructor(
    public bsModalRef: BsModalRef,
    private masterService: MasterService,
    private userService: UserService
  ) { }

  async ngOnInit() {
    await this.getAllDocumentTypes();
    await this.getAllCountries();
    await this.getAllEtnia();
    await this.getAllPrestadorSalud();
    await this.getAllEntidadesSalud();
    await this.getAllOcupacion();
    await this.getAllDepartamentos();
    await this.getAllPaises();
    await this.getAllDiscapacidades();

    if (this.onEdit) {
      if(this.onViewMode){
        this.userForm.disable();
      }
      await this.getUserData();
    }

    
  }

  async getUserData() {
    const result = await firstValueFrom(this.userService.getByDocument(this.document));
    if (result.success) {
      console.log(result);

      await this.getAllCommunitiesByEtnia(null, result.data?.codigoComunidadNavigation?.codigoEtnia);
      await this.getAllMunicipiosByDepartamento(null, result.data?.codigoDeparMuniNavigation?.padre);

      this.userForm.patchValue({
        idUsuario: result.data?.idUsuario,
        tipoDocumento: result.data?.tipoDocumento,
        numeroDocumento: result.data?.numeroDocumento,
        primerNombre: result.data?.primerNombre,
        segundoNombre: result.data?.segundoNombre as any,
        primerApellido: result.data?.primerApellido,
        segundoApellido: result.data?.segundoApellido,
        fechaNacimiento: Helpers.convertDate(result.data?.fechaNacimiento.toString() as any),
        horaNacimiento: result.data?.horaNacimiento,
        sexoBiologico: result.data?.sexoBiologico,
        identidadGenero: result.data?.identidadGenero,
        codigoOcupacion: result.data?.codigoOcupacion,
        idPaisResidencia: result.data?.idPaisResidencia,
        codigoDepartamento: result.data?.codigoDeparMuniNavigation?.padre,
        codigoDeparMuni: result.data?.codigoDeparMuni,
        codigoEtnia: result.data?.codigoComunidadNavigation?.codigoEtnia,
        codigoComunidad: result.data?.codigoComunidad,
        zonaResidencia: result.data?.zonaResidencia,
        codigoEntidad: result.data?.codigoEntidad,
        paises: result.data?.usuarioPaises?.map(x => {
          return {
            idPais: x.idPais,
            pais: x.idPaisNavigation?.pais
          } as Pais
        })!,
        discapacidades: result.data?.usuarioDiscapacidads?.map(x => {
          return {
            codigoDiscapacidad: x.codigoDiscapacidad,
            categoriaDiscapacidad: x.codigoDiscapacidadNavigation?.categoriaDiscapacidad
          } as Discapacidad
        })!
      });

      console.log(result.data?.usuarioPaises?.map(x => {
        return {
          idPais: x.idPais,
          pais: x.idPaisNavigation?.pais
        } as Pais
      }))

      this.paisesSeleccionados = result.data?.usuarioPaises?.map(x => {
          return x.idPaisNavigation?.pais
      }).toString()!;

      this.discapacidadesSeleccionadas = result.data?.usuarioDiscapacidads?.map(x => {
        return x.codigoDiscapacidadNavigation?.categoriaDiscapacidad
    }).toString()!;

      this.ocupacionText = result.data?.codigoOcupacionNavigation?.ocupacion1!;

      this.userForm.get('opoDonacion')?.patchValue({
        idDonacion: result.data?.idDonacion as any,
        manifestacionOposicion: result.data?.idDonacionNavigation?.manifestacionOposicion!,
        fecha: Helpers.convertDate(result.data?.idDonacionNavigation?.fecha.toString() as any)
      })

      this.userForm.get('voluntad')?.patchValue({
        idVoluntad: result.data?.idVoluntad as any,
        documentoVoluntad: result.data?.idVoluntadNavigation?.documentoVoluntad!,
        fecha: Helpers.convertDate(result.data?.idVoluntadNavigation?.fecha.toString() as any),
        codigoPrestadorSalud: result.data?.idVoluntadNavigation?.codigoPrestadorSalud!
      })


    }
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

  async getAllDiscapacidades() {
    const result = await firstValueFrom(this.masterService.getAll<Discapacidad>(TablesEnum.Discapacidades));
    if (result.success) {
      this.dicapacidadesList = result.data!;
    }
  }

  async getAllPaises() {
    const result = await firstValueFrom(this.masterService.getAll<Pais>(TablesEnum.Paises));
    if (result.success) {
      this.paisesList = result.data!;
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

  async getAllCommunitiesByEtnia(evt: Event | null, param?: string) {
    this.comunidadEtnicaList = [];
    this.userForm.get('codigoComunidad')?.setValue('');

    let codigoEtnia: string;

    if (!evt) {
      codigoEtnia = param!;
    } else {
      const tg = evt!.target as HTMLSelectElement;
      codigoEtnia = tg.value;
    }


    const result = await firstValueFrom(this.masterService.getAll<ComunidadEtnica>(TablesEnum.ComunidadEtnica, codigoEtnia));
    if (result.success) {
      this.comunidadEtnicaList = result.data!;
    }
  }

  async getAllMunicipiosByDepartamento(evt: Event | null, param?: string) {
    this.municipioList = [];
    this.userForm.get('codigoDeparMuni')?.setValue('');

    let codigoDepart: string;

    if (!evt) {
      codigoDepart = param!;
    } else {
      const tg = evt!.target as HTMLSelectElement;
      codigoDepart = tg.value;
    }

    const result = await firstValueFrom(this.masterService.getAll<DepartamentoMunicipios>(TablesEnum.Municipio, codigoDepart));
    if (result.success) {
      this.municipioList = result.data!;
    }
  }

  async getAllOcupacion(parent?: string) {
    const result = await firstValueFrom(this.masterService.getAll<{ ocupacion: Ocupacion, esPadre: boolean }>(TablesEnum.Ocupacion, parent));
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

  async getAllEntidadesSalud() {
    const result = await firstValueFrom(this.masterService.getAll<EntidadesAdministradorasSalud>(TablesEnum.EntidadesAdministradorasSalud));
    if (result.success) {
      this.entidadAdministradoraList = result.data!;
    }
  }

  updateValues() {

    this.userForm.get('opoDonacion')!.get('fecha')!.updateValueAndValidity();
    this.userForm.get('voluntad')!.get('fecha')!.updateValueAndValidity();
    this.userForm.get('voluntad')!.get('codigoPrestadorSalud')!.updateValueAndValidity();

  }

  async save() {
    this.submited = true;

    if (this.userForm.invalid) {
      Dialog.show('Debes diligenciar todos los campos obligatorios', Dialogtype.warning);
      return;
    }
    const formData = this.userForm.getRawValue();

    const data = {
      user: formData,
      paises: formData.paises,
      discapacidades: formData.discapacidades,
      opoDonacion: formData.opoDonacion,
      voluntad: formData.voluntad
    }

    let result: Result<string> = {} as Result<string>;

    console.log(result)
    if (this.onEdit) {
      result = await firstValueFrom(this.userService.update(data));
    } else {
      data.user.horaNacimiento = `${formData.horaNacimiento}:00`;
      result = await firstValueFrom(this.userService.create(data));
    }

    if (result.success) {
      Dialog.show(result.data!, Dialogtype.success);
      this.bsModalRef.hide();
    }

  }

  onEditPais(){
    this.editPais = true;
    this.userForm.get('paises')?.setValue([]);
  }

  onEditDiscapacidad(){
    this.editDiscapacidad = true;
    this.userForm.get('discapacidades')?.setValue([]);
  }


}
